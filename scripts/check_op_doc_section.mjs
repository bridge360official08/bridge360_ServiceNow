const SN_BASE = "https://dev187180.service-now.com";
const SN_AUTH = "Basic YWRtaW46bW4lWEMxXlNjZEE0";
const h = { "Authorization": SN_AUTH, "Content-Type": "application/json", "Accept": "application/json" };
async function main() {
  const r = await fetch(`${SN_BASE}/api/now/table/sys_ws_operation/c890d0af047a4b019ae0eecb3c082ae5?sysparm_fields=operation_script`, { headers: h });
  const d = await r.json();
  const script = d.result?.operation_script || "";
  console.log("Script length:", script.length);

  // Find the Supporting Documents section
  const docSecIdx = script.indexOf("Supporting Documents");
  if (docSecIdx >= 0) {
    console.log("\n=== SUPPORTING DOCS SECTION ===");
    console.log(script.substring(docSecIdx, docSecIdx + 800));
  }

  // Find doc.memberId usage
  const memIdx = script.indexOf("doc.memberId");
  if (memIdx >= 0) {
    console.log("\n=== doc.memberId CONTEXT ===");
    console.log(script.substring(Math.max(0,memIdx-200), memIdx+400));
  } else {
    console.log("\nNO doc.memberId in operation_script");
    // Show around "u_member" assignment
    let idx = 0;
    let count = 0;
    while ((idx = script.indexOf("u_member", idx)) >= 0 && count < 5) {
      console.log(`\nu_member at ${idx}:`, script.substring(Math.max(0,idx-50), idx+150));
      idx += 8; count++;
    }
  }
}
main().catch(console.error);
