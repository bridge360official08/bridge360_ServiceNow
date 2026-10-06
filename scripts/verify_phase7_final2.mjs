// Phase 7 Verification Suite - Run 2 (post-fix)
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
  const icon = status === PASS ? "PASS" : status === FAIL ? "FAIL" : "INFO";
  console.log(`[${icon}] ${test}${detail ? " | " + detail : ""}`);
  results.push({ status, test, detail });
}

async function main() {
  console.log("====== PHASE 7 VERIFICATION - RUN 2 (POST-FIX) ======\n");

  const email = `p7v2_${Date.now()}@bridge360.local`;
  const phone = `+1566${Math.floor(1000000+Math.random()*9000000)}`;
  const idA = `MEM-A2-${Date.now()}`;
  const idC = `MEM-C2-${Date.now()}`;
  const idD = `MEM-D2-${Date.now()}`;

  const payload = {
    headOfFamily: { id: idA, firstName: "Priya", lastName: "Sharma", gender: "Female", dateOfBirth: "1985-03-15", nationality: "Indian", passportNumber: "P7654321", mobileNumber: phone, email, address: "12 Test Street", city: "Chennai", maritalStatus: "Married" },
    familyInfo: { familyName: "Sharma P7v2 Test", countryOfOrigin: "India", arrivalDate: "2026-01-15", householdSize: 3, primaryLanguage: "Tamil", immigrationStatus: "Asylum Applicant", needsInterpreter: false },
    members: [
      { id: idC, firstName: "Arjun", lastName: "Sharma", gender: "Male", dateOfBirth: "2010-06-20", relationshipToHead: "Son", nationality: "Indian" },
      { id: idD, firstName: "Kavitha", lastName: "Sharma", gender: "Female", dateOfBirth: "2014-11-05", relationshipToHead: "Daughter", nationality: "Indian" }
    ],
    familyMembers: [
      { id: idA, name: "Priya Sharma", firstName: "Priya", lastName: "Sharma", relationshipToHead: "self", gender: "Female", dateOfBirth: "1985-03-15", confidence: 99, source: "P7v2Test" },
      { id: idC, name: "Arjun Sharma", firstName: "Arjun", lastName: "Sharma", relationshipToHead: "Son", gender: "Male", dateOfBirth: "2010-06-20", confidence: 95, source: "P7v2Test" },
      { id: idD, name: "Kavitha Sharma", firstName: "Kavitha", lastName: "Sharma", relationshipToHead: "Daughter", gender: "Female", dateOfBirth: "2014-11-05", confidence: 95, source: "P7v2Test-Manual" }
    ],
    selectedApplicantMemberId: idA,
    emergencyContact: { name: "Rajan Sharma", relationship: "Brother", phone: "+91 9876543210", address: "Mumbai" },
    uploadedDocs: [
      { id: "DOC-V2-A", memberId: idA, documentType: "Passport", fileName: "v2_priya_passport.pdf", fileSize: "1.2 MB" },
      { id: "DOC-V2-C", memberId: idC, documentType: "Birth Certificate", fileName: "v2_arjun_birth.pdf", fileSize: "0.8 MB" },
      { id: "DOC-V2-D", memberId: idD, documentType: "Birth Certificate", fileName: "v2_kavitha_birth.pdf", fileSize: "0.7 MB" }
    ]
  };

  console.log("Submitting family registration...");
  const reg = await callRegisterAPI(payload);
  log(reg?.success ? PASS : FAIL, "Registration API succeeded", reg?.applicationId || reg?.error);
  if (!reg?.success) { console.log("FATAL: Cannot continue."); return; }

  const { applicationId, familySysId, headSysId, persistedMembers } = reg;
  if (familySysId) created.families.push(familySysId);
  log(!!applicationId ? PASS : FAIL, "Application ID returned", applicationId);
  log(!!familySysId ? PASS : FAIL, "Family SysId returned", familySysId);
  log(Array.isArray(persistedMembers) && persistedMembers.length === 3 ? PASS : FAIL, "persistedMembers has 3 entries", `Got: ${persistedMembers?.length}`);

  const pmA = persistedMembers?.find(pm => pm.isHead || pm.clientTempId === idA);
  const pmC = persistedMembers?.find(pm => pm.clientTempId === idC);
  const pmD = persistedMembers?.find(pm => pm.clientTempId === idD);
  log(!!pmA ? PASS : FAIL, "persistedMembers: head (idA) found", pmA?.sys_id);
  log(!!pmC ? PASS : FAIL, "persistedMembers: Arjun (idC) found", pmC?.sys_id);
  log(!!pmD ? PASS : FAIL, "persistedMembers: Kavitha (idD) found", pmD?.sys_id);

  // Verify members in SN
  const snMems = await snGet("u_bridge360_member", `u_family=${familySysId}`, "sys_id,u_first_name,u_is_head");
  log(snMems.length === 3 ? PASS : FAIL, "Exactly 3 members in ServiceNow", `Found: ${snMems.length}`);
  for (const m of snMems) created.members.push(m.sys_id);

  // Verify documents
  const snDocs = await snGet("u_bridge360_document", `u_family=${familySysId}`, "sys_id,u_file_name,u_member,u_document_type");
  log(snDocs.length === 3 ? PASS : FAIL, "Exactly 3 documents in ServiceNow", `Found: ${snDocs.length}`);
  for (const dd of snDocs) created.documents.push(dd.sys_id);

  const docA = snDocs.find(d => d.u_file_name?.includes("priya"));
  const docC = snDocs.find(d => d.u_file_name?.includes("arjun"));
  const docD = snDocs.find(d => d.u_file_name?.includes("kavitha"));

  console.log("\n====== CRITICAL: RECONCILIATION TABLE ======");
  console.log("| Document           | Expected sys_id                      | Actual u_member                      | Result |");
  console.log("|--------------------|--------------------------------------|--------------------------------------|--------|");

  function checkDoc(doc, pm, label) {
    if (!doc || !pm) { log(FAIL, `${label}: doc or pm missing`); return false; }
    const actual = doc.u_member?.value || doc.u_member || "NULL";
    const match = actual === pm.sys_id;
    console.log(`| ${label.padEnd(18)} | ${(pm.sys_id||"").padEnd(36)} | ${actual.padEnd(36)} | ${match ? "PASS" : "FAIL"} |`);
    log(match ? PASS : FAIL, `${label} → correct member sys_id`, `Exp: ${pm.sys_id} | Got: ${actual}`);
    return match;
  }

  const aOk = checkDoc(docA, pmA, "Priya passport");
  const cOk = checkDoc(docC, pmC, "Arjun birth cert");
  const dOk = checkDoc(docD, pmD, "Kavitha birth cert");

  // Cross-contamination check
  const uniqueMemIds = new Set(snDocs.map(d => d.u_member?.value || d.u_member).filter(Boolean));
  log(uniqueMemIds.size === 3 ? PASS : FAIL, "No cross-member contamination (3 unique u_member values)", `Unique: ${uniqueMemIds.size}`);

  // Multiple docs per member test - add 2 more docs for Arjun
  console.log("\n====== MULTIPLE DOCS PER MEMBER TEST ======");
  if (pmC) {
    const multiPayload = {
      ...payload,
      familySysId: familySysId,
      applicationId: applicationId,
      allowRetry: true,
      uploadedDocs: [
        { id: "DOC-V2-C2", memberId: idC, documentType: "Passport", fileName: "v2_arjun_passport.pdf", fileSize: "0.9 MB" },
        { id: "DOC-V2-C3", memberId: idC, documentType: "UNHCR Card", fileName: "v2_arjun_unhcr.pdf", fileSize: "0.5 MB" }
      ]
    };
    const reg2 = await callRegisterAPI(multiPayload);
    log(reg2?.success ? PASS : FAIL, "Multi-doc retry submission succeeded", reg2?.applicationId);
    
    const snDocs2 = await snGet("u_bridge360_document", `u_family=${familySysId}`, "sys_id,u_file_name,u_member");
    const arjunDocs = snDocs2.filter(d => (d.u_member?.value || d.u_member) === pmC.sys_id);
    log(arjunDocs.length === 3 ? PASS : FAIL, "Arjun has 3 documents (all linked to same sys_id)", `Count: ${arjunDocs.length}`);
    for (const nd of snDocs2) { if (!created.documents.includes(nd.sys_id)) created.documents.push(nd.sys_id); }
    
    const otherDocs = snDocs2.filter(d => (d.u_member?.value || d.u_member) !== pmC.sys_id && (d.u_member?.value || d.u_member) !== pmA?.sys_id && (d.u_member?.value || d.u_member) !== pmD?.sys_id);
    log(otherDocs.length === 0 ? PASS : FAIL, "No documents orphaned to wrong members", `Orphaned: ${otherDocs.length}`);
  }

  // Family proof linkage check - head doc should NOT be replicated to other members
  if (pmA && docA) {
    const headDocMem = docA.u_member?.value || docA.u_member;
    log(headDocMem === pmA.sys_id ? PASS : FAIL, "Family proof (Priya passport) stays on head member only", `mem=${headDocMem}`);
    log(headDocMem !== pmC?.sys_id && headDocMem !== pmD?.sys_id ? PASS : FAIL, "Family proof NOT replicated to non-head members");
  }

  // Cleanup
  console.log("\nCLEANUP...");
  for (const id of created.documents) await snDelete("u_bridge360_document", id);
  for (const id of created.members) await snDelete("u_bridge360_member", id);
  for (const id of created.families) await snDelete("u_bridge360_family", id);
  log(INFO, `Cleaned ${created.documents.length} docs, ${created.members.length} members, ${created.families.length} families`);

  // Summary
  const passes = results.filter(r => r.status === PASS).length;
  const fails = results.filter(r => r.status === FAIL).length;
  console.log(`\n====== PHASE 7 RUN 2 RESULTS: ${passes} PASS | ${fails} FAIL | ${results.length} TOTAL ======`);
  if (fails > 0) {
    console.log("FAILED:");
    results.filter(r => r.status === FAIL).forEach(r => console.log(`  FAIL: ${r.test} | ${r.detail}`));
  } else {
    console.log("ALL TESTS PASSED");
  }
  
  console.log("\nJSON_START");
  console.log(JSON.stringify({ passes, fails, total: results.length, results }, null, 2));
  console.log("JSON_END");
}
main().catch(console.error);
