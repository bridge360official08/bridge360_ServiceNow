const SN_BASE = "https://dev187180.service-now.com";
const SN_AUTH = "Basic YWRtaW46bW4lWEMxXlNjZEE0";
const h = { "Authorization": SN_AUTH, "Content-Type": "application/json", "Accept": "application/json" };
async function main() {
  // Find ALL REST API operations for Bridge360
  const r1 = await fetch(`${SN_BASE}/api/now/table/sys_ws_operation?sysparm_fields=sys_id,name,http_method,web_service_definition&sysparm_limit=30&sysparm_query=web_service_definition.name=Bridge360`, { headers: h });
  const d1 = await r1.json();
  console.log("Bridge360 REST Ops:", JSON.stringify((d1.result||[]).map(o=>({id:o.sys_id,name:o.name,method:o.http_method}))));

  // Get the register operation script by sys_id
  const registerOp = (d1.result||[]).find(o => o.name === "register" || o.name?.toLowerCase().includes("register"));
  if (registerOp) {
    const r2 = await fetch(`${SN_BASE}/api/now/table/sys_ws_operation/${registerOp.sys_id}?sysparm_fields=script`, { headers: h });
    const d2 = await r2.json();
    const script = d2.result?.script || "";
    // Look for uploadedDocs and memberId handling
    const upIdx = script.indexOf("uploadedDocs");
    const memIdx = script.indexOf("memberId");
    console.log("\nRegister op sys_id:", registerOp.sys_id);
    console.log("uploadedDocs in script:", upIdx >= 0);
    console.log("memberId in script:", memIdx >= 0);
    if (upIdx >= 0) console.log("uploadedDocs context:", script.substring(Math.max(0,upIdx-50), upIdx+300));
    // Show how it calls Bridge360API
    const apiIdx = script.indexOf("Bridge360API");
    if (apiIdx >= 0) console.log("Bridge360API call context:", script.substring(Math.max(0,apiIdx-50), apiIdx+400));
    else console.log("First 600 chars:", script.substring(0,600));
  } else {
    console.log("register op not found in Bridge360 ops");
    // Try directly
    const r3 = await fetch(`${SN_BASE}/api/now/table/sys_ws_operation/${encodeURIComponent("c890d0af047a4b019ae0eecb3c082ae5")}?sysparm_fields=script,name`, { headers: h });
    const d3 = await r3.json();
    if (d3.result?.script) {
      const script = d3.result.script;
      const upIdx = script.indexOf("uploadedDocs");
      const memIdx = script.indexOf("memberId");
      console.log("Direct sys_id c890d0af... - uploadedDocs:", upIdx>=0, "memberId:", memIdx>=0);
      if (upIdx >= 0) console.log("uploadedDocs ctx:", script.substring(Math.max(0,upIdx-50), upIdx+400));
    }
  }
}
main().catch(console.error);
