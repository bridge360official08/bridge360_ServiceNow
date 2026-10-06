// Phase 7 Defect Fix: Update the live REST operation script to include doc.memberId → member sys_id linkage
const SN_BASE = "https://dev187180.service-now.com";
const SN_AUTH = "Basic YWRtaW46bW4lWEMxXlNjZEE0";
const h = { "Authorization": SN_AUTH, "Content-Type": "application/json", "Accept": "application/json" };
const OP_SYS_ID = "c890d0af047a4b019ae0eecb3c082ae5";

async function main() {
  // 1. Fetch current script
  const r = await fetch(`${SN_BASE}/api/now/table/sys_ws_operation/${OP_SYS_ID}?sysparm_fields=operation_script`, { headers: h });
  const d = await r.json();
  let script = d.result?.operation_script || "";
  console.log("Fetched script length:", script.length);

  // 2. Find the old document section and replace it
  // OLD pattern: directly assigns headSysId
  const OLD_DOC_SECTION = `var grDocChk = new GlideRecord('u_bridge360_document');
              grDocChk.addQuery('u_family', sysFamId);
              grDocChk.addQuery('u_file_name', docFileName);
              grDocChk.query();
              if (!grDocChk.next()) {
                var grDoc = new GlideRecord('u_bridge360_document');
                grDoc.initialize();
                grDoc.setValue('u_family',              sysFamId);
                grDoc.setValue('u_member',              headSysId);`;

  const NEW_DOC_SECTION = `var docMemberSysId = headSysId;
              if (doc.memberId) {
                for (var dp = 0; dp < persistedMembersSummary.length; dp++) {
                  if (persistedMembersSummary[dp].clientTempId === doc.memberId) {
                    docMemberSysId = persistedMembersSummary[dp].sys_id;
                    break;
                  }
                }
              }
              var grDocChk = new GlideRecord('u_bridge360_document');
              grDocChk.addQuery('u_family', sysFamId);
              grDocChk.addQuery('u_file_name', docFileName);
              grDocChk.query();
              if (!grDocChk.next()) {
                var grDoc = new GlideRecord('u_bridge360_document');
                grDoc.initialize();
                grDoc.setValue('u_family',              sysFamId);
                grDoc.setValue('u_member',              docMemberSysId);`;

  if (!script.includes("grDoc.setValue('u_member',              headSysId);")) {
    console.log("OLD pattern not found exactly. Trying relaxed search...");
    const uMemIdx = script.indexOf("grDoc.setValue('u_member',              headSysId)");
    console.log("u_member headSysId at:", uMemIdx);
    if (uMemIdx < 0) {
      console.log("Cannot find pattern to replace. Manual intervention required.");
      return;
    }
  }

  const updatedScript = script.replace(
    "grDoc.setValue('u_member',              headSysId);",
    // Insert the lookup before the setValue, changing headSysId -> docMemberSysId
    `var docMemberSysId2 = headSysId;
                if (doc.memberId) {
                  for (var dp2 = 0; dp2 < persistedMembersSummary.length; dp2++) {
                    if (persistedMembersSummary[dp2].clientTempId === doc.memberId) {
                      docMemberSysId2 = persistedMembersSummary[dp2].sys_id;
                      break;
                    }
                  }
                }
                grDoc.setValue('u_member',              docMemberSysId2);`
  );

  if (updatedScript === script) {
    console.log("ERROR: Replacement had no effect — string not found.");
    return;
  }

  console.log("Replacement applied. New script length:", updatedScript.length);
  console.log("Verifying doc.memberId now in script:", updatedScript.includes("doc.memberId"));

  // 3. Patch the operation_script back to ServiceNow
  const patchRes = await fetch(`${SN_BASE}/api/now/table/sys_ws_operation/${OP_SYS_ID}`, {
    method: "PATCH",
    headers: h,
    body: JSON.stringify({ operation_script: updatedScript })
  });
  const patchData = await patchRes.json();
  if (patchRes.ok && patchData.result?.sys_id) {
    console.log("SUCCESS: REST operation script updated on ServiceNow. sys_id:", patchData.result.sys_id);
  } else {
    console.log("PATCH response status:", patchRes.status);
    console.log("PATCH response:", JSON.stringify(patchData).substring(0, 500));
  }
}
main().catch(console.error);
