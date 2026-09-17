import fs from 'fs';
import { snRequest } from '../scratch/sn_client.mjs';

async function validate() {
  console.log('================================================================');
  console.log('RUNNING FINAL VALIDATION CHECKS ON LIVE INSTANCE');
  console.log('================================================================\n');

  const report = {};

  // 1. Countries Check
  console.log('Checking Countries...');
  const ctryRes = await snRequest('/api/now/table/u_bridge360_country?sysparm_limit=200');
  const countries = ctryRes.data?.result || [];
  report.finalCountryCount = countries.length;

  const original10CountryCodes = ['AF', 'BD', 'CD', 'LK', 'MM', 'PK', 'SO', 'SY', 'UA', 'YE'];
  const foundOriginal10 = countries.filter(c => original10CountryCodes.includes(c.u_iso2));
  report.existing10CountriesVerified = foundOriginal10.length === 10;
  report.existing10CountriesList = foundOriginal10.map(c => `${c.u_iso2} (${c.u_country_name})`);

  // Check country duplicates
  const countryCodeSet = new Set();
  const countryDupes = [];
  for (const c of countries) {
    if (countryCodeSet.has(c.u_iso2)) countryDupes.push(c.u_iso2);
    else countryCodeSet.add(c.u_iso2);
  }
  report.duplicateCountries = countryDupes;

  // 2. Documents Check
  console.log('Checking Country Documents...');
  const docRes = await snRequest('/api/now/table/u_bridge360_country_document?sysparm_limit=500');
  const docs = docRes.data?.result || [];
  report.finalCountryDocumentCount = docs.length;

  const original13DocIds = [
    'CDOC-AFG-01', 'CDOC-AFG-02', 'CDOC-AFG-03', 'CDOC-AFG-04',
    'CDOC-BGD-01', 'CDOC-BGD-02',
    'CDOC-PAK-01', 'CDOC-PAK-02',
    'CDOC-SOM-01',
    'CDOC-SYR-01', 'CDOC-SYR-02', 'CDOC-SYR-03',
    'CDOC-YEM-01'
  ];
  const foundOriginal13 = docs.filter(d => original13DocIds.includes(d.sys_id));
  report.existing13DocumentsVerified = foundOriginal13.length === 13;
  report.existing13DocumentsList = foundOriginal13.map(d => `${d.sys_id} (${d.u_document_name})`);

  // Check document duplicates
  const docKeySet = new Set();
  const docDupes = [];
  for (const d of docs) {
    const ctryVal = typeof d.u_country === 'object' ? d.u_country.value : d.u_country;
    const key = `${ctryVal}::${d.u_document_name}::${d.u_document_type || ''}`;
    if (docKeySet.has(key)) docDupes.push(key);
    else docKeySet.add(key);
  }
  report.duplicateDocuments = docDupes;

  // Check dangling country references on documents
  const countrySysIds = new Set(countries.map(c => c.sys_id));
  let danglingCountryRefsInDocs = 0;
  for (const d of docs) {
    const ctryVal = typeof d.u_country === 'object' ? d.u_country.value : d.u_country;
    if (!countrySysIds.has(ctryVal)) danglingCountryRefsInDocs++;
  }
  report.danglingCountryRefsInDocs = danglingCountryRefsInDocs;

  // 3. Document Fields Check
  console.log('Checking Document Fields...');
  const fieldRes = await snRequest('/api/now/table/u_bridge360_country_document_field?sysparm_limit=2000');
  const fields = fieldRes.data?.result || [];
  report.finalDocumentFieldCount = fields.length;

  // Check duplicate fields
  const fieldKeySet = new Set();
  const fieldDupes = [];
  for (const f of fields) {
    const docVal = typeof f.u_country_document === 'object' ? f.u_country_document.value : f.u_country_document;
    const key = `${docVal}::${f.u_field_name}`;
    if (fieldKeySet.has(key)) fieldDupes.push(key);
    else fieldKeySet.add(key);
  }
  report.duplicateFields = fieldDupes;

  // Check dangling document references in fields
  const docSysIds = new Set(docs.map(d => d.sys_id));
  let danglingDocRefsInFields = 0;
  for (const f of fields) {
    const docVal = typeof f.u_country_document === 'object' ? f.u_country_document.value : f.u_country_document;
    if (!docSysIds.has(docVal)) danglingDocRefsInFields++;
  }
  report.danglingDocRefsInFields = danglingDocRefsInFields;

  // 4. Evidence Rules Check
  console.log('Checking Evidence Rules...');
  const ruleRes = await snRequest('/api/now/table/u_bridge360_evidence_rule?sysparm_limit=50');
  const rules = ruleRes.data?.result || [];
  report.existingEvidenceRulesCount = rules.length;
  report.existingEvidenceRulesVerified = rules.length === 6;

  // 5. Verification Authorities Check
  console.log('Checking Verification Authorities...');
  const authRes = await snRequest('/api/now/table/u_bridge360_verification_authority?sysparm_limit=50');
  const auths = authRes.data?.result || [];
  report.existingAuthoritiesCount = auths.length;
  report.existingAuthoritiesVerified = auths.length === 5;

  // 6. Verification Requests Check
  console.log('Checking Verification Requests...');
  const reqRes = await snRequest('/api/now/table/u_bridge360_verification_request?sysparm_limit=50');
  const reqs = reqRes.data?.result || [];
  report.existingRequestsCount = reqs.length;
  report.existingRequestsVerified = reqs.length === 5;

  console.log('\n================================================================');
  console.log('VALIDATION RESULTS SUMMARY');
  console.log('================================================================');
  console.log(JSON.stringify(report, null, 2));

  fs.writeFileSync('./scratch/validation_report.json', JSON.stringify(report, null, 2), 'utf8');
}

validate().catch(console.error);
