#!/usr/bin/env node
// Phase 7 Final Verification Suite - Bridge360
const SN_BASE = "https://dev187180.service-now.com";
const SN_AUTH = "Basic YWRtaW46bW4lWEMxXlNjZEE0";
const TABLE = `${SN_BASE}/api/now/table`;
const headers = { "Authorization": SN_AUTH, "Content-Type": "application/json", "Accept": "application/json" };

async function snGet(table, query = "", fields = "") {
  let url = `${TABLE}/${table}?sysparm_limit=100`;
  if (query) url += `&sysparm_query=${encodeURIComponent(query)}`;
  if (fields) url += `&sysparm_fields=${fields}`;
  const r = await fetch(url, { headers });
  const d = await r.json();
  return d.result || [];
}

async function snDelete(table, sysId) {
  await fetch(`${TABLE}/${table}/${sysId}`, { method: "DELETE", headers });
}

async function callRegisterAPI(payload) {
  const r = await fetch(`${SN_BASE}/api/global/v1/register`, { method: "POST", headers, body: JSON.stringify(payload) });
  const d = await r.json();
  return d.result || d;
}

const PASS = "PASS"; const FAIL = "FAIL"; const INFO = "INFO";
const results = []; const created = { families: [], members: [], documents: [] };

function log(status, test, detail = "") {
  const icon = status === PASS ? "✅" : status === FAIL ? "❌" : "ℹ️";
  console.log(`${icon} ${status} | ${test}${detail ? " | " + detail : ""}`);
  results.push({ status, test, detail });
}

async function main() {
  console.log("\n====== BRIDGE360 PHASE 7 VERIFICATION SUITE ======\n");

  // A. CONFIG AUDIT
  console.log("A. SERVICENOW CONFIGURATION AUDIT");
  const countries = await snGet("u_bridge360_country", "active=true", "sys_id,u_country_name,u_iso2");
  log(countries.length > 0 ? PASS : FAIL, "u_bridge360_country has active records", `Count: ${countries.length}`);

  const reqCountries = ["India","Indonesia","China","Vietnam","Taiwan","Thailand","Japan","South Korea","Philippines"];
  const cNames = countries.map(c => (c.u_country_name || "").toLowerCase());
  for (const cn of reqCountries) {
    const found = cNames.some(n => n.includes(cn.toLowerCase()));
    log(found ? PASS : FAIL, `Country configured: ${cn}`);
  }

  const famDocs = await snGet("u_bridge360_country_document", "u_registration_scope=family^ORu_registration_scope=both^active=true", "sys_id,u_document_name,u_registration_scope");
  log(famDocs.length >= 9 ? PASS : FAIL, "At least 9 family documents configured", `Found: ${famDocs.length}`);

  const famMemFields = await snGet("u_bridge360_country_document_field", "u_field_name=family_members^active=true", "sys_id,u_field_name");
  log(famMemFields.length > 0 ? PASS : FAIL, "family_members JSON field configured on family docs", `Count: ${famMemFields.length}`);

  const allFields = await snGet("u_bridge360_country_document_field", "active=true", "sys_id");
  log(allFields.length >= 80 ? PASS : FAIL, "Document fields active (>=80)", `Count: ${allFields.length}`);

  // B. BASELINE
  console.log("\nB. BASELINE COUNTS");
  const famBase = (await snGet("u_bridge360_family","","sys_id")).length;
  const memBase = (await snGet("u_bridge360_member","","sys_id")).length;
  const docBase = (await snGet("u_bridge360_document","","sys_id")).length;
  log(INFO, `Baseline: families=${famBase}, members=${memBase}, documents=${docBase}`);

  // C. FAMILY REGISTRATION TEST
  console.log("\nC. FAMILY REGISTRATION END-TO-END TEST");
  const email = `p7test_${Date.now()}@bridge360.local`;
  const phone = `+1555${Math.floor(1000000+Math.random()*9000000)}`;
  const idA = `MEM-A-${Date.now()}`;
  const idC = `MEM-C-${Date.now()}`;
  const idD = `MEM-D-${Date.now()}`;

  const payload = {
    headOfFamily: { id: idA, firstName: "Priya", lastName: "Sharma", gender: "Female", dateOfBirth: "1985-03-15", nationality: "Indian", passportNumber: "P7654321", mobileNumber: phone, email, address: "12 Test Street", city: "Chennai", maritalStatus: "Married" },
    familyInfo: { familyName: "Sharma Phase7 Test", countryOfOrigin: "India", arrivalDate: "2026-01-15", householdSize: 3, primaryLanguage: "Tamil", immigrationStatus: "Asylum Applicant", needsInterpreter: false },
    members: [
      { id: idC, firstName: "Arjun", lastName: "Sharma", gender: "Male", dateOfBirth: "2010-06-20", relationshipToHead: "Son", nationality: "Indian" },
      { id: idD, firstName: "Kavitha", lastName: "Sharma", gender: "Female", dateOfBirth: "2014-11-05", relationshipToHead: "Daughter", nationality: "Indian" }
    ],
    familyMembers: [
      { id: idA, name: "Priya Sharma", firstName: "Priya", lastName: "Sharma", relationshipToHead: "self", gender: "Female", dateOfBirth: "1985-03-15", confidence: 99, source: "Phase7Test" },
      { id: idC, name: "Arjun Sharma", firstName: "Arjun", lastName: "Sharma", relationshipToHead: "Son", gender: "Male", dateOfBirth: "2010-06-20", confidence: 95, source: "Phase7Test" },
      { id: idD, name: "Kavitha Sharma", firstName: "Kavitha", lastName: "Sharma", relationshipToHead: "Daughter", gender: "Female", dateOfBirth: "2014-11-05", confidence: 95, source: "Phase7Test-Manual" }
    ],
    selectedApplicantMemberId: idA,
    emergencyContact: { name: "Rajan Sharma", relationship: "Brother", phone: "+91 9876543210", address: "Mumbai" },
    uploadedDocs: [
      { id: "DOC-P7-A", memberId: idA, documentType: "Passport", fileName: "p7_priya_passport.pdf", fileSize: "1.2 MB" },
      { id: "DOC-P7-C", memberId: idC, documentType: "Birth Certificate", fileName: "p7_arjun_birth.pdf", fileSize: "0.8 MB" },
      { id: "DOC-P7-D", memberId: idD, documentType: "Birth Certificate", fileName: "p7_kavitha_birth.pdf", fileSize: "0.7 MB" }
    ]
  };

  const reg = await callRegisterAPI(payload);
  log(reg?.success ? PASS : FAIL, "Family registration API call succeeded", reg?.applicationId || reg?.error || reg?.message);

  if (!reg?.success) { console.log("FATAL: Registration failed. Cannot continue."); process.exit(1); }

  const { applicationId, familySysId, headSysId, persistedMembers } = reg;
  if (familySysId) created.families.push(familySysId);
  log(!!applicationId ? PASS : FAIL, "Application ID returned", applicationId);
  log(!!familySysId ? PASS : FAIL, "Family SysId returned", familySysId);
  log(!!headSysId ? PASS : FAIL, "Head SysId returned", headSysId);
  log(Array.isArray(persistedMembers) && persistedMembers.length === 3 ? PASS : FAIL, "persistedMembers has 3 entries", `Got: ${persistedMembers?.length}`);

  // D. MEMBER VERIFICATION
  console.log("\nD. MEMBER RECORD VERIFICATION");
  const snMems = await snGet("u_bridge360_member", `u_family=${familySysId}`, "sys_id,u_first_name,u_last_name,u_is_head,u_relationship_to_head");
  log(snMems.length === 3 ? PASS : FAIL, "Exactly 3 members in ServiceNow", `Found: ${snMems.length}`);
  for (const m of snMems) created.members.push(m.sys_id);

  const headMem = snMems.find(m => m.u_is_head === true || m.u_is_head === "true" || m.u_is_head === "1");
  log(!!headMem ? PASS : FAIL, "Head member exists in SN", headMem ? `${headMem.u_first_name} ${headMem.u_last_name}` : "NOT FOUND");

  const pmA = persistedMembers?.find(pm => pm.isHead || pm.clientTempId === idA);
  const pmC = persistedMembers?.find(pm => pm.clientTempId === idC);
  const pmD = persistedMembers?.find(pm => pm.clientTempId === idD);
  log(!!pmA ? PASS : FAIL, "persistedMembers: head (idA) found", pmA?.sys_id);
  log(!!pmC ? PASS : FAIL, "persistedMembers: Arjun (idC) found", pmC?.sys_id);
  log(!!pmD ? PASS : FAIL, "persistedMembers: Kavitha (idD/manual) found", pmD?.sys_id);

  // E. DOCUMENT LINKAGE - CRITICAL
  console.log("\nE. DOCUMENT → MEMBER LINKAGE (CRITICAL)");
  const snDocs = await snGet("u_bridge360_document", `u_family=${familySysId}`, "sys_id,u_file_name,u_member,u_document_type");
  log(snDocs.length === 3 ? PASS : FAIL, "Exactly 3 documents in ServiceNow", `Found: ${snDocs.length}`);
  for (const d of snDocs) created.documents.push(d.sys_id);

  const docA = snDocs.find(d => d.u_file_name?.includes("priya"));
  const docC = snDocs.find(d => d.u_file_name?.includes("arjun"));
  const docD = snDocs.find(d => d.u_file_name?.includes("kavitha"));

  console.log("\nRECONCILIATION TABLE:");
  console.log("| Document          | Expected SysId | Actual u_member | Result |");
  console.log("|-------------------|----------------|-----------------|--------|");

  function checkDoc(doc, pm, label) {
    if (!doc || !pm) { log(FAIL, `${label} - doc or pm not found`); return; }
    const actual = doc.u_member?.value || doc.u_member || "NULL";
    const match = actual === pm.sys_id;
    console.log(`| ${label.padEnd(17)} | ${pm.sys_id} | ${actual} | ${match ? "PASS" : "FAIL"} |`);
    log(match ? PASS : FAIL, `${label} → correct member sys_id`, `Expected: ${pm.sys_id} | Got: ${actual}`);
  }

  checkDoc(docA, pmA, "Priya passport");
  checkDoc(docC, pmC, "Arjun birth cert");
  checkDoc(docD, pmD, "Kavitha birth cert");

  // Cross-contamination check
  const uniqueMemIds = new Set(snDocs.map(d => d.u_member?.value || d.u_member).filter(Boolean));
  log(uniqueMemIds.size === 3 ? PASS : FAIL, "No cross-member contamination (3 unique u_member values)", `Unique: ${uniqueMemIds.size}`);

  // F. INDIVIDUAL REGRESSION
  console.log("\nF. INDIVIDUAL REGISTRATION REGRESSION");
  const emailI = `p7indiv_${Date.now()}@bridge360.local`;
  const regI = await callRegisterAPI({
    headOfFamily: { firstName: "Ahmad", lastName: "Hassan", gender: "Male", dateOfBirth: "1990-08-22", nationality: "Afghan", mobileNumber: `+1444${Math.floor(1000000+Math.random()*9000000)}`, email: emailI },
    familyInfo: { familyName: "Hassan Phase7 Indiv", countryOfOrigin: "Afghanistan", arrivalDate: "2026-02-01", householdSize: 1, primaryLanguage: "Pashto", immigrationStatus: "Asylum Applicant", needsInterpreter: false },
    members: [],
    emergencyContact: { name: "N/A", relationship: "Friend", phone: "", address: "" },
    uploadedDocs: [{ id: "DOC-P7-INDIV", documentType: "Passport", fileName: "p7_ahmad_passport.pdf", fileSize: "0.9 MB" }]
  });
  log(regI?.success ? PASS : FAIL, "Individual registration succeeded", regI?.applicationId || regI?.error);
  if (regI?.success && regI?.familySysId) {
    created.families.push(regI.familySysId);
    const iMems = await snGet("u_bridge360_member", `u_family=${regI.familySysId}`, "sys_id,u_is_head");
    log(iMems.length === 1 ? PASS : FAIL, "Individual: exactly 1 member created", `Count: ${iMems.length}`);
    if (iMems[0]) created.members.push(iMems[0].sys_id);
    const iDocs = await snGet("u_bridge360_document", `u_family=${regI.familySysId}`, "sys_id,u_member");
    log(iDocs.length === 1 ? PASS : FAIL, "Individual: exactly 1 document created", `Count: ${iDocs.length}`);
    if (iDocs[0]) {
      created.documents.push(iDocs[0].sys_id);
      const iDocMem = iDocs[0].u_member?.value || iDocs[0].u_member;
      log(iDocMem === regI.headSysId ? PASS : FAIL, "Individual: doc linked to head (no memberId fallback works)", `Expected: ${regI.headSysId} | Got: ${iDocMem}`);
    }
  }

  // G. DUPLICATE PROTECTION
  console.log("\nG. DUPLICATE PROTECTION TEST");
  const emailDup = `p7dup_${Date.now()}@bridge360.local`;
  const dupBase = {
    headOfFamily: { firstName: "Dup", lastName: "Test", gender: "Male", dateOfBirth: "1992-01-01", nationality: "Syrian", mobileNumber: `+1333${Math.floor(1000000+Math.random()*9000000)}`, email: emailDup },
    familyInfo: { familyName: "Dup Test", countryOfOrigin: "Syria", arrivalDate: "2026-01-01", householdSize: 1, primaryLanguage: "Arabic", immigrationStatus: "Asylum Applicant", needsInterpreter: false },
    members: [], emergencyContact: { name: "N/A", relationship: "Friend", phone: "", address: "" }, uploadedDocs: []
  };
  const d1 = await callRegisterAPI(dupBase);
  log(d1?.success ? PASS : FAIL, "Dup test: first submission succeeded", d1?.applicationId);
  if (d1?.familySysId) created.families.push(d1.familySysId);

  const d2 = await callRegisterAPI(dupBase);
  const isDup = !d2?.success && (d2?.error === "duplicate_email" || (d2?.message || "").includes("already registered"));
  log(isDup ? PASS : FAIL, "Dup test: second submission blocked as duplicate", `success=${d2?.success}, error=${d2?.error || d2?.message}`);

  const d3 = await callRegisterAPI({ ...dupBase, familySysId: d1?.familySysId, allowRetry: true });
  log(d3?.success ? PASS : FAIL, "Dup test: allowRetry=true succeeds", d3?.applicationId);
  log(d1?.familySysId === d3?.familySysId ? PASS : FAIL, "Dup test: retry reuses same family record", `d1=${d1?.familySysId} d3=${d3?.familySysId}`);

  // H. CLEANUP
  console.log("\nH. CLEANUP");
  for (const id of created.documents) await snDelete("u_bridge360_document", id);
  for (const id of created.members) await snDelete("u_bridge360_member", id);
  for (const id of created.families) await snDelete("u_bridge360_family", id);
  log(INFO, `Cleaned: ${created.documents.length} docs, ${created.members.length} members, ${created.families.length} families`);

  // SUMMARY
  const passes = results.filter(r => r.status === PASS).length;
  const fails = results.filter(r => r.status === FAIL).length;
  console.log(`\n======================================================`);
  console.log(`PHASE 7 RESULTS: ${passes} PASS | ${fails} FAIL | ${results.length} TOTAL`);
  console.log(`======================================================`);
  if (fails > 0) {
    console.log("\nFAILED:");
    results.filter(r => r.status === FAIL).forEach(r => console.log(`  ❌ ${r.test} | ${r.detail}`));
  }
  console.log("\nJSON_START");
  console.log(JSON.stringify({ passes, fails, total: results.length, results, created }, null, 2));
  console.log("JSON_END");
}

main().catch(err => { console.error("FATAL:", err); process.exit(1); });
