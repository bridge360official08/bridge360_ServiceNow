import fs from 'fs';
import readline from 'readline';
import { snRequest } from '../scratch/sn_client.mjs';

const ISO2_TO_ISO3 = {
  'US': 'USA', 'ES': 'ESP', 'FR': 'FRA', 'DE': 'DEU', 'BR': 'BRA',
  'JP': 'JPN', 'KR': 'KOR', 'IT': 'ITA', 'NL': 'NLD', 'SE': 'SWE',
  'DK': 'DNK', 'NO': 'NOR', 'FI': 'FIN', 'PL': 'POL', 'RU': 'RUS',
  'TR': 'TUR', 'SA': 'SAU', 'IL': 'ISR', 'TH': 'THA', 'VN': 'VNM',
  'ID': 'IDN', 'MY': 'MYS', 'CN': 'CHN', 'TW': 'TWN', 'IN': 'IND',
  'UA': 'UKR', 'BD': 'BGD', 'PK': 'PAK', 'LK': 'LKA'
};

const DEMONYMS = {
  'US': 'American', 'ES': 'Spanish', 'FR': 'French', 'DE': 'German', 'BR': 'Brazilian',
  'JP': 'Japanese', 'KR': 'South Korean', 'IT': 'Italian', 'NL': 'Dutch', 'SE': 'Swedish',
  'DK': 'Danish', 'NO': 'Norwegian', 'FI': 'Finnish', 'PL': 'Polish', 'RU': 'Russian',
  'TR': 'Turkish', 'SA': 'Saudi', 'IL': 'Israeli', 'TH': 'Thai', 'VN': 'Vietnamese',
  'ID': 'Indonesian', 'MY': 'Malaysian', 'CN': 'Chinese', 'TW': 'Taiwanese', 'IN': 'Indian'
};

// Reused existing documents mapping
const REUSED_DOCUMENTS = {
  'BD::national_id': 'CDOC-BGD-01',
  'BD::birth_certificate': 'CDOC-BGD-02',
  'PK::cnic': 'CDOC-PAK-01'
};

async function main() {
  console.log('================================================================');
  console.log('STARTING COUNTRY / DOCUMENT / FIELD FOUNDATION INGESTION');
  console.log('================================================================\n');

  // 1. Read and parse CSV
  const csvFile = 'D:\\global_documents_complete.csv';
  const rl = readline.createInterface({
    input: fs.createReadStream(csvFile),
    crlfDelay: Infinity
  });

  const csvCountries = new Map(); // cCode -> { code, name, iso3, nationality }
  const csvDocs = new Map(); // `${cCode}::${docType}` -> { key, countryCode, docType, docName, isReused, reusedSysId, fields: [] }
  let totalCsvRows = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    totalCsvRows++;
    if (totalCsvRows === 1) continue; // skip header

    const [lang, country, cCode, docType, docName, fieldName, fieldType] = line.split(',');
    const cleanCode = cCode.trim();
    const cleanDocType = docType.trim();

    if (!csvCountries.has(cleanCode)) {
      const iso3 = ISO2_TO_ISO3[cleanCode] || cleanCode;
      csvCountries.set(cleanCode, {
        code: cleanCode,
        name: country.trim(),
        iso3,
        nationality: DEMONYMS[cleanCode] || country.trim()
      });
    }

    const docKey = `${cleanCode}::${cleanDocType}`;
    if (!csvDocs.has(docKey)) {
      csvDocs.set(docKey, {
        key: docKey,
        countryCode: cleanCode,
        docType: cleanDocType,
        docName: docName.trim(),
        isReused: !!REUSED_DOCUMENTS[docKey],
        reusedSysId: REUSED_DOCUMENTS[docKey] || null,
        fields: []
      });
    }

    csvDocs.get(docKey).fields.push({
      fieldName: fieldName.trim(),
      fieldType: fieldType.trim()
    });
  }

  console.log(`Parsed CSV: ${totalCsvRows - 1} field rows across ${csvCountries.size} countries and ${csvDocs.size} document combinations.\n`);

  // 2. Process Countries
  console.log('----------------------------------------------------------------');
  console.log('PHASE 3: COUNTRY INGESTION');
  console.log('----------------------------------------------------------------');
  const existingCountriesRes = await snRequest('/api/now/table/u_bridge360_country?sysparm_limit=100');
  if (existingCountriesRes.status !== 200) {
    console.error('Failed to query existing countries:', existingCountriesRes.status);
    process.exit(1);
  }

  const liveCountryByIso2 = new Map();
  for (const c of existingCountriesRes.data.result) {
    liveCountryByIso2.set(c.u_iso2, c.sys_id);
  }
  console.log(`Initial country records count: ${existingCountriesRes.data.result.length}`);

  let createdCountriesCount = 0;
  for (const [code, info] of csvCountries.entries()) {
    if (liveCountryByIso2.has(code)) {
      console.log(`Reusing existing country: [${liveCountryByIso2.get(code)}] ${info.name} (${code})`);
    } else {
      console.log(`Creating missing country: ${info.name} (${code} / ${info.iso3})...`);
      const createRes = await snRequest('/api/now/table/u_bridge360_country', 'POST', {
        u_country_name: info.name,
        u_iso2: info.code,
        u_iso3: info.iso3,
        u_nationality: info.nationality,
        u_active: 'true'
      });
      if (createRes.status === 201) {
        const createdSysId = createRes.data.result.sys_id;
        liveCountryByIso2.set(info.code, createdSysId);
        createdCountriesCount++;
        console.log(`  -> Created with sys_id: ${createdSysId}`);
      } else {
        console.error(`Failed to create country ${code}:`, createRes.status, createRes.raw || createRes.data);
        process.exit(1);
      }
    }
  }
  console.log(`Country phase complete. Created ${createdCountriesCount} new countries. Total countries mapped: ${liveCountryByIso2.size}.\n`);

  // 3. Process Documents
  console.log('----------------------------------------------------------------');
  console.log('PHASE 4: COUNTRY DOCUMENT INGESTION');
  console.log('----------------------------------------------------------------');

  // Update 3 reused documents via GlideRecord
  console.log('Updating 3 reused documents with u_document_type via GlideRecord...');
  const updateScript = `
(function() {
  var docs = [
    { name: 'Smart National Identity Card (Smart NID)', type: 'national_id' },
    { name: 'Online Birth Registration Certificate (BRC)', type: 'birth_certificate' },
    { name: 'Computerized National Identity Card (CNIC / Smart NIC)', type: 'cnic' }
  ];
  for (var i = 0; i < docs.length; i++) {
    var gr = new GlideRecord('u_bridge360_country_document');
    gr.addQuery('u_document_name', docs[i].name);
    gr.query();
    if (gr.next()) {
      gr.setValue('u_document_type', docs[i].type);
      gr.update();
    }
  }
})();
`;
  await snRequest('/api/now/table/sys_trigger', 'POST', {
    name: 'Bridge360 Ingest Update Reused Docs',
    next_action: new Date().toISOString().replace('T', ' ').slice(0, 19),
    trigger_type: '0',
    state: '0',
    script: updateScript
  });
  console.log('Reused documents update triggered.');
  await new Promise(r => setTimeout(r, 4000));


  // Check existing documents
  const existingDocsRes = await snRequest('/api/now/table/u_bridge360_country_document?sysparm_limit=1000');
  const liveDocMap = new Map(); // `${ctrySysId}::${docType}` -> sys_id
  for (const d of existingDocsRes.data.result) {
    const ctryVal = typeof d.u_country === 'object' ? d.u_country.value : d.u_country;
    if (d.u_document_type) {
      liveDocMap.set(`${ctryVal}::${d.u_document_type}`, d.sys_id);
    }
  }

  const docSysIdMap = new Map(); // docKey -> sys_id
  docSysIdMap.set('BD::national_id', 'CDOC-BGD-01');
  docSysIdMap.set('BD::birth_certificate', 'CDOC-BGD-02');
  docSysIdMap.set('PK::cnic', 'CDOC-PAK-01');

  let createdDocsCount = 0;
  for (const [docKey, doc] of csvDocs.entries()) {
    if (doc.isReused) continue;

    const countrySysId = liveCountryByIso2.get(doc.countryCode);
    if (!countrySysId) {
      console.error(`Missing country sys_id for code ${doc.countryCode}!`);
      process.exit(1);
    }

    const liveLookupKey = `${countrySysId}::${doc.docType}`;
    if (liveDocMap.has(liveLookupKey)) {
      const existingSysId = liveDocMap.get(liveLookupKey);
      docSysIdMap.set(docKey, existingSysId);
      continue;
    }

    const payload = {
      u_country: countrySysId,
      u_document_type: doc.docType,
      u_document_name: doc.docName,
      u_active: 'true'
    };

    const res = await snRequest('/api/now/table/u_bridge360_country_document', 'POST', payload);
    if (res.status === 201) {
      const createdSysId = res.data.result.sys_id;
      docSysIdMap.set(docKey, createdSysId);
      liveDocMap.set(liveLookupKey, createdSysId);
      createdDocsCount++;
      if (createdDocsCount % 25 === 0 || createdDocsCount === 146) {
        console.log(`Created ${createdDocsCount}/146 new documents... (latest: [${createdSysId}] ${doc.docName})`);
      }
    } else {
      console.error(`Failed to create document for ${docKey}:`, res.status, res.raw || res.data);
      process.exit(1);
    }
  }
  console.log(`Document phase complete. Total new documents created: ${createdDocsCount}.\n`);

  // 4. Ingest Document Fields
  console.log('----------------------------------------------------------------');
  console.log('PHASE 5: DOCUMENT FIELD INGESTION (1,130 FIELDS)');
  console.log('----------------------------------------------------------------');

  // Check existing fields to ensure idempotency
  const existingFieldsRes = await snRequest('/api/now/table/u_bridge360_country_document_field?sysparm_limit=2000');
  const existingFieldKeys = new Set();
  for (const f of (existingFieldsRes.data?.result || [])) {
    const docVal = typeof f.u_country_document === 'object' ? f.u_country_document.value : f.u_country_document;
    existingFieldKeys.add(`${docVal}::${f.u_field_name}`);
  }
  console.log(`Existing fields in u_bridge360_country_document_field: ${existingFieldKeys.size}`);

  let createdFieldsCount = 0;
  let skippedFieldsCount = 0;

  for (const [docKey, doc] of csvDocs.entries()) {
    const docSysId = docSysIdMap.get(docKey);
    if (!docSysId) {
      console.error(`Missing document sys_id for ${docKey}!`);
      process.exit(1);
    }

    for (const field of doc.fields) {
      const fieldLookupKey = `${docSysId}::${field.fieldName}`;
      if (existingFieldKeys.has(fieldLookupKey)) {
        skippedFieldsCount++;
        continue;
      }

      const payload = {
        u_country_document: docSysId,
        u_field_name: field.fieldName,
        u_field_type: field.fieldType,
        u_active: 'true'
      };

      const res = await snRequest('/api/now/table/u_bridge360_country_document_field', 'POST', payload);
      if (res.status === 201) {
        createdFieldsCount++;
        existingFieldKeys.add(fieldLookupKey);
        if (createdFieldsCount % 100 === 0 || (createdFieldsCount + skippedFieldsCount) === 1130) {
          console.log(`Inserted ${createdFieldsCount}/1130 field records...`);
        }
      } else {
        console.error(`Failed to insert field ${field.fieldName} for ${docKey}:`, res.status, res.raw || res.data);
        process.exit(1);
      }
    }
  }

  console.log(`Document field phase complete. Inserted: ${createdFieldsCount}, Skipped: ${skippedFieldsCount}.\n`);
  console.log('================================================================');
  console.log('FOUNDATION INGESTION COMPLETED SUCCESSFULLY');
  console.log('================================================================');
}

main().catch(err => {
  console.error('Fatal error during ingestion:', err);
  process.exit(1);
});
