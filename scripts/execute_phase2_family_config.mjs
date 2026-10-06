/**
 * Phase 2 — ServiceNow Family-Proof Configuration Implementation Script
 * Strictly implements Phase 2 only:
 * 1. Checks/Adds u_registration_scope column on u_bridge360_country_document
 * 2. Checks/Adds json choice to u_bridge360_country_document_field.u_field_type
 * 3. Checks/Adds Philippines country record if missing
 * 4. Ensures all 9 Family Documents exist and have u_registration_scope = 'family'
 * 5. Sets existing non-family documents to u_registration_scope = 'individual'
 * 6. Upserts all 81 field records from family_documents_complete.csv
 * 7. Performs read-only validation
 */

import { readFileSync, existsSync } from 'fs';
import { snRequest } from '../scratch/sn_client.mjs';

const CSV_PATH = 'D:\\family_documents_complete.csv';

async function main() {
  console.log('================================================================');
  console.log('STARTING PHASE 2: SERVICENOW FAMILY-PROOF CONFIGURATION');
  console.log('================================================================\n');

  // ── STEP 1: SCHEMA EXTENSION — u_registration_scope COLUMN ───────────────────
  console.log('>> Step 1: Checking u_registration_scope column on u_bridge360_country_document...');
  const dictCheck = await snRequest('/api/now/table/sys_dictionary?sysparm_query=name=u_bridge360_country_document^element=u_registration_scope');
  if (dictCheck.data?.result?.length > 0) {
    console.log('✅ Column u_registration_scope already exists in sys_dictionary.');
  } else {
    console.log('➕ Creating column u_registration_scope on u_bridge360_country_document...');
    const createCol = await snRequest('/api/now/table/sys_dictionary', 'POST', {
      name: 'u_bridge360_country_document',
      element: 'u_registration_scope',
      column_label: 'Registration Scope',
      internal_type: 'string',
      max_length: '40',
      choice: '1',
      default_value: 'individual',
      active: 'true'
    });
    console.log('Result:', createCol.status, createCol.data?.result?.sys_id || createCol.data);
  }

  // Ensure choices in sys_choice for u_registration_scope
  const scopeChoices = [
    { value: 'individual', label: 'Individual Registration', sequence: 1 },
    { value: 'family', label: 'Family Registration', sequence: 2 },
    { value: 'both', label: 'Both Individual & Family', sequence: 3 },
  ];
  for (const sc of scopeChoices) {
    const chk = await snRequest(`/api/now/table/sys_choice?sysparm_query=name=u_bridge360_country_document^element=u_registration_scope^value=${sc.value}`);
    if (chk.data?.result?.length === 0) {
      console.log(`➕ Adding choice '${sc.value}' for u_registration_scope...`);
      await snRequest('/api/now/table/sys_choice', 'POST', {
        name: 'u_bridge360_country_document',
        element: 'u_registration_scope',
        language: 'en',
        value: sc.value,
        label: sc.label,
        sequence: sc.sequence,
        inactive: 'false'
      });
    }
  }

  // ── STEP 2: SCHEMA EXTENSION — json CHOICE ON u_field_type ──────────────────
  console.log('\n>> Step 2: Checking json choice on u_bridge360_country_document_field.u_field_type...');
  const jsonChoiceChk = await snRequest('/api/now/table/sys_choice?sysparm_query=name=u_bridge360_country_document_field^element=u_field_type^value=json');
  if (jsonChoiceChk.data?.result?.length > 0) {
    console.log('✅ Choice json already exists on u_field_type.');
  } else {
    console.log('➕ Adding choice json to u_field_type in sys_choice...');
    await snRequest('/api/now/table/sys_choice', 'POST', {
      name: 'u_bridge360_country_document_field',
      element: 'u_field_type',
      language: 'en',
      value: 'json',
      label: 'JSON Array / Structured Data',
      sequence: 4,
      inactive: 'false'
    });
  }

  // ── STEP 3: COUNTRY INVENTORY & PHILIPPINES CREATION ────────────────────────
  console.log('\n>> Step 3: Checking countries...');
  const cRes = await snRequest('/api/now/table/u_bridge360_country?sysparm_limit=500');
  const allCountries = cRes.data?.result || [];
  
  let phCountry = allCountries.find(c => 
    (c.u_country_name || '').toLowerCase() === 'philippines' || 
    (c.u_iso2 || '').toUpperCase() === 'PH'
  );

  let createdCountriesCount = 0;
  if (!phCountry) {
    console.log('➕ Philippines is missing. Creating Philippines in u_bridge360_country...');
    const phRes = await snRequest('/api/now/table/u_bridge360_country', 'POST', {
      u_country_name: 'Philippines',
      u_iso2: 'PH',
      u_iso3: 'PHL',
      u_nationality: 'Filipino',
      u_official_languages: 'Filipino, English',
      u_scripts_used: 'Latin',
      u_naming_convention: 'family_surname',
      u_active: 'true',
      u_notes: 'Civil Registration administered by Philippine Statistics Authority (PSA) and Barangay Local Government Units.'
    });
    phCountry = phRes.data?.result;
    console.log('Created Philippines:', phRes.status, phCountry?.sys_id);
    createdCountriesCount++;
  } else {
    console.log('✅ Philippines already exists:', phCountry.sys_id);
  }

  // Refresh country map
  const refCountryRes = await snRequest('/api/now/table/u_bridge360_country?sysparm_limit=500');
  const updatedCountries = refCountryRes.data?.result || [];
  const countryMap = new Map();
  updatedCountries.forEach(c => {
    countryMap.set(c.u_iso2?.toUpperCase(), c);
    countryMap.set(c.u_country_name?.toLowerCase(), c);
  });

  // ── STEP 4: PARSE family_documents_complete.csv ──────────────────────────────
  console.log('\n>> Step 4: Parsing family_documents_complete.csv...');
  if (!existsSync(CSV_PATH)) {
    throw new Error(`CSV file not found at ${CSV_PATH}`);
  }
  const csvContent = readFileSync(CSV_PATH, 'utf8');
  const csvLines = csvContent.split(/\r?\n/).filter(l => l.trim().length > 0);
  const header = csvLines[0].split(',').map(h => h.trim());

  const rows = csvLines.slice(1).map(l => {
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches = [];
    let m;
    while ((m = regex.exec(l)) !== null) {
      let val = m[1];
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val);
      if (regex.lastIndex >= l.length) break;
    }
    const obj = {};
    header.forEach((h, i) => {
      obj[h] = matches[i] !== undefined ? matches[i].trim() : '';
    });
    return obj;
  });

  // Group by document
  const docsInCsv = new Map();
  rows.forEach(r => {
    const key = `${r.country_code}___${r.document_type}`;
    if (!docsInCsv.has(key)) {
      docsInCsv.set(key, {
        countryCode: r.country_code,
        countryName: r.country_name,
        documentType: r.document_type,
        documentName: r.document_name,
        fields: []
      });
    }
    docsInCsv.get(key).fields.push(r);
  });
  console.log(`Parsed ${rows.length} rows across ${docsInCsv.size} distinct family documents.`);

  // ── STEP 5: UPSERT THE 9 FAMILY DOCUMENTS ────────────────────────────────────
  console.log('\n>> Step 5: Upserting the 9 Family Documents in u_bridge360_country_document...');
  const dRes = await snRequest('/api/now/table/u_bridge360_country_document?sysparm_limit=1000');
  const allExistingDocs = dRes.data?.result || [];

  let existingDocsUpdated = 0;
  let newDocsCreated = 0;
  const configuredDocMap = new Map(); // key: countryCode___docType -> sys_id

  for (const [key, docDef] of docsInCsv.entries()) {
    const country = countryMap.get(docDef.countryCode.toUpperCase()) || countryMap.get(docDef.countryName.toLowerCase());
    if (!country) {
      console.error(`❌ Country not found for ${docDef.countryName} (${docDef.countryCode})!`);
      continue;
    }

    // Find existing doc by country + (type or name)
    const existingDoc = allExistingDocs.find(d => {
      const cRef = typeof d.u_country === 'object' ? d.u_country?.value : d.u_country;
      if (cRef !== country.sys_id) return false;
      const t = (d.u_document_type || '').toLowerCase();
      const n = (d.u_document_name || '').toLowerCase();
      return t === docDef.documentType.toLowerCase() || 
             n.includes(docDef.documentType.toLowerCase()) ||
             n.includes(docDef.documentName.toLowerCase().split(' ')[0]);
    });

    if (existingDoc) {
      console.log(`🔄 Updating existing document: "${existingDoc.u_document_name}" (sys_id: ${existingDoc.sys_id}) for ${docDef.countryName}`);
      await snRequest(`/api/now/table/u_bridge360_country_document/${existingDoc.sys_id}`, 'PATCH', {
        u_registration_scope: 'family',
        u_document_category: 'family_relationship',
        u_active: 'true'
      });
      configuredDocMap.set(key, existingDoc.sys_id);
      existingDocsUpdated++;
    } else {
      console.log(`➕ Creating missing family document: "${docDef.documentName}" for ${docDef.countryName}`);
      const newDocRes = await snRequest('/api/now/table/u_bridge360_country_document', 'POST', {
        u_country: country.sys_id,
        u_document_name: docDef.documentName,
        u_document_type: docDef.documentType,
        u_document_category: 'family_relationship',
        u_registration_scope: 'family',
        u_active: 'true',
        u_notes: `Configured from family_documents_complete.csv for ${docDef.countryName} Family Registration.`
      });
      const createdId = newDocRes.data?.result?.sys_id;
      console.log(`   Created with sys_id: ${createdId}`);
      configuredDocMap.set(key, createdId);
      newDocsCreated++;
    }
  }

  // Set any existing non-family documents with blank scope to 'individual'
  console.log('\n>> Preserving backward compatibility: setting unassigned document scopes to "individual"...');
  let nonFamilyScopedCount = 0;
  for (const doc of allExistingDocs) {
    const isOneOfOurFamilyDocs = Array.from(configuredDocMap.values()).includes(doc.sys_id);
    if (!isOneOfOurFamilyDocs && (!doc.u_registration_scope || doc.u_registration_scope === '')) {
      await snRequest(`/api/now/table/u_bridge360_country_document/${doc.sys_id}`, 'PATCH', {
        u_registration_scope: 'individual'
      });
      nonFamilyScopedCount++;
    }
  }
  console.log(`Updated ${nonFamilyScopedCount} existing non-family documents to u_registration_scope = "individual".`);

  // ── STEP 6: POPULATE FIELDS IN u_bridge360_country_document_field ────────────
  console.log('\n>> Step 6: Ingesting 81 fields from CSV into u_bridge360_country_document_field...');
  const fRes = await snRequest('/api/now/table/u_bridge360_country_document_field?sysparm_limit=5000');
  const allExistingFields = fRes.data?.result || [];

  let fieldsCreated = 0;
  let fieldsUpdated = 0;
  let fieldsAlreadyExisting = 0;

  for (const [key, docDef] of docsInCsv.entries()) {
    const docSysId = configuredDocMap.get(key);
    if (!docSysId) {
      console.error(`Cannot find document sys_id for ${key}`);
      continue;
    }

    for (const f of docDef.fields) {
      const fieldName = f.field_name.trim();
      let fieldType = f.field_type.trim().toLowerCase();
      // Map string/choice to text if needed, date -> date, json -> json
      if (fieldType === 'string' || fieldType === 'choice') fieldType = 'text';

      // Check if field already exists for this document
      const existingField = allExistingFields.find(ef => {
        const dRef = typeof ef.u_country_document === 'object' ? ef.u_country_document?.value : ef.u_country_document;
        return dRef === docSysId && (ef.u_field_name || '').toLowerCase() === fieldName.toLowerCase();
      });

      const noteText = `${f.field_label}: ${f.description}`;

      if (existingField) {
        // Check if update needed
        if (existingField.u_field_type !== fieldType || existingField.u_active !== 'true') {
          await snRequest(`/api/now/table/u_bridge360_country_document_field/${existingField.sys_id}`, 'PATCH', {
            u_field_type: fieldType,
            u_active: 'true',
            u_notes: noteText
          });
          fieldsUpdated++;
        } else {
          fieldsAlreadyExisting++;
        }
      } else {
        await snRequest('/api/now/table/u_bridge360_country_document_field', 'POST', {
          u_country_document: docSysId,
          u_field_name: fieldName,
          u_field_type: fieldType,
          u_active: 'true',
          u_notes: noteText
        });
        fieldsCreated++;
      }
    }
  }

  console.log(`\nField Ingestion Results:`);
  console.log(`- Fields Created: ${fieldsCreated}`);
  console.log(`- Fields Updated: ${fieldsUpdated}`);
  console.log(`- Fields Already Existing & Unchanged: ${fieldsAlreadyExisting}`);
  console.log(`- Total Fields Processed: ${fieldsCreated + fieldsUpdated + fieldsAlreadyExisting}`);

  // ── STEP 7: READ-ONLY VALIDATION ───────────────────────────────────────────
  console.log('\n================================================================');
  console.log('READ-ONLY VALIDATION OF PHASE 2 CONFIGURATION');
  console.log('================================================================');

  // Verify all 9 family documents
  let valPassed = true;
  for (const [key, docDef] of docsInCsv.entries()) {
    const docSysId = configuredDocMap.get(key);
    const dCheck = await snRequest(`/api/now/table/u_bridge360_country_document/${docSysId}`);
    const docRec = dCheck.data?.result;
    
    const fCheck = await snRequest(`/api/now/table/u_bridge360_country_document_field?sysparm_query=u_country_document=${docSysId}`);
    const fieldsRecs = fCheck.data?.result || [];
    const hasFamilyMembers = fieldsRecs.some(fr => fr.u_field_name === 'family_members' && fr.u_field_type === 'json');

    console.log(`\nDocument: "${docRec?.u_document_name}" (${docDef.countryName})`);
    console.log(`  - Scope: ${docRec?.u_registration_scope} [${docRec?.u_registration_scope === 'family' ? 'PASS' : 'FAIL'}]`);
    console.log(`  - Active: ${docRec?.u_active}`);
    console.log(`  - Configured Fields in SN: ${fieldsRecs.length} / Expected: ${docDef.fields.length}`);
    console.log(`  - family_members [json] present: ${hasFamilyMembers ? 'PASS' : 'FAIL'}`);

    if (docRec?.u_registration_scope !== 'family' || !hasFamilyMembers) {
      valPassed = false;
    }
  }

  console.log(`\nFINAL VALIDATION RESULT: ${valPassed ? '✅ 100% SUCCESS' : '❌ VALIDATION FAILED'}`);
}

main().catch(console.error);
