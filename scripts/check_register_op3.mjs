const SN_BASE = "https://dev187180.service-now.com";
const SN_AUTH = "Basic YWRtaW46bW4lWEMxXlNjZEE0";
const h = { "Authorization": SN_AUTH, "Content-Type": "application/json", "Accept": "application/json" };
async function main() {
  // Find ALL REST API operations - no filter
  const r1 = await fetch(`${SN_BASE}/api/now/table/sys_ws_operation?sysparm_fields=sys_id,name,http_method&sysparm_limit=50`, { headers: h });
  const d1 = await r1.json();
  console.log("ALL REST Ops count:", (d1.result||[]).length);
  (d1.result||[]).forEach(o => console.log(` ${o.http_method} ${o.name} [${o.sys_id}]`));

  // Try to get the known register op by sys_id c890d0af047a4b019ae0eecb3c082ae5
  const r2 = await fetch(`${SN_BASE}/api/now/table/sys_ws_operation/c890d0af047a4b019ae0eecb3c082ae5?sysparm_fields=sys_id,name,script`, { headers: h });
  const d2 = await r2.json();
  const op = d2.result;
  if (op && op.script) {
    console.log("\nFound op:", op.name, op.sys_id);
    const script = op.script;
    console.log("Script length:", script.length);
    const upIdx = script.indexOf("uploadedDocs");
    const memIdx = script.indexOf("memberId");
    console.log("uploadedDocs in script:", upIdx>=0, "memberId in script:", memIdx>=0);
    if (memIdx >= 0) console.log("memberId ctx:", script.substring(Math.max(0,memIdx-100), memIdx+200));
    else if (upIdx >= 0) console.log("uploadedDocs ctx:", script.substring(Math.max(0,upIdx-50), upIdx+400));
    // Show how Bridge360API.submitRegistration is called
    const apiCall = script.indexOf("submitRegistration");
    if (apiCall >= 0) console.log("submitRegistration call:", script.substring(Math.max(0,apiCall-100), apiCall+500));
  } else {
    console.log("Op c890d0af not found, result:", JSON.stringify(d2).substring(0,200));
  }
}
main().catch(console.error);
