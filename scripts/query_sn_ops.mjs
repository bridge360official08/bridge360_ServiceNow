const SN_BASE = "https://dev187180.service-now.com";
const SN_AUTH = "Basic YWRtaW46bW4lWEMxXlNjZEE0";
const h = { "Authorization": SN_AUTH, "Content-Type": "application/json", "Accept": "application/json" };
async function main() {
  const q = "sysparm_query=name=register&sysparm_fields=sys_id,name,http_method,script&sysparm_limit=10";
  const r = await fetch(`${SN_BASE}/api/now/table/sys_ws_operation?${q}`, { headers: h });
  const d = await r.json();
  const ops = d.result || [];
  ops.forEach(op => {
    console.log("=== OP:", op.sys_id, op.name, op.http_method);
    if (op.script) {
      const snippet = op.script;
      const memIdx = snippet.indexOf("memberId");
      if (memIdx >= 0) {
        console.log("memberId context:", snippet.substring(Math.max(0,memIdx-100), memIdx+200));
      } else {
        console.log("NO memberId in script - first 300 chars:", snippet.substring(0, 300));
      }
    }
  });
  
  // Also check sys_script_include for Bridge360API
  const r2 = await fetch(`${SN_BASE}/api/now/table/sys_script_include?sysparm_query=name=Bridge360API&sysparm_fields=sys_id,name,script&sysparm_limit=2`, { headers: h });
  const d2 = await r2.json();
  const includes = d2.result || [];
  includes.forEach(inc => {
    console.log("\n=== SCRIPT INCLUDE:", inc.name, inc.sys_id);
    const snippet = inc.script;
    const memIdx = snippet.indexOf("memberId");
    if (memIdx >= 0) {
      console.log("memberId context:", snippet.substring(Math.max(0,memIdx-100), memIdx+300));
    } else {
      const docIdx = snippet.indexOf("Supporting Documents");
      if (docIdx >= 0) console.log("Doc section:", snippet.substring(docIdx, docIdx+400));
    }
  });
}
main().catch(console.error);
