const SN_BASE = "https://dev187180.service-now.com";
const SN_AUTH = "Basic YWRtaW46bW4lWEMxXlNjZEE0";
const h = { "Authorization": SN_AUTH, "Content-Type": "application/json", "Accept": "application/json" };
async function main() {
  // Find register operation
  const r = await fetch(`${SN_BASE}/api/now/table/sys_ws_operation?sysparm_query=name=register&sysparm_fields=sys_id,name,http_method,script&sysparm_limit=10`, { headers: h });
  const d = await r.json();
  const ops = (d.result || []);
  for (const op of ops) {
    console.log("=== OP sys_id:", op.sys_id, "name:", op.name);
    const s = op.script || "";
    // Check for memberId in the script
    const memDocIdx = s.indexOf("doc.memberId");
    if (memDocIdx >= 0) {
      console.log("FOUND doc.memberId at", memDocIdx, ":", s.substring(Math.max(0,memDocIdx-50), memDocIdx+200));
    } else {
      // Show the doc section
      const docSecIdx = s.indexOf("Supporting Documents");
      if (docSecIdx >= 0) {
        console.log("Doc section (no doc.memberId):", s.substring(docSecIdx, docSecIdx+600));
      } else {
        console.log("No doc section found. Script length:", s.length, "First 300:", s.substring(0,300));
      }
    }
  }
  
  // Also look at the Script Include
  const r2 = await fetch(`${SN_BASE}/api/now/table/sys_script_include?sysparm_query=name=Bridge360API&sysparm_fields=sys_id,name,script&sysparm_limit=1`, { headers: h });
  const d2 = await r2.json();
  const inc = (d2.result || [])[0];
  if (inc) {
    const s = inc.script || "";
    const memDocIdx = s.indexOf("doc.memberId");
    if (memDocIdx >= 0) {
      console.log("\nSCRIPT INCLUDE has doc.memberId:", s.substring(Math.max(0,memDocIdx-100), memDocIdx+300));
    } else {
      const docSecIdx = s.indexOf("Supporting Documents");
      if (docSecIdx >= 0) {
        console.log("\nSCRIPT INCLUDE doc section (no doc.memberId):", s.substring(docSecIdx, docSecIdx+600));
      }
    }
  }
}
main().catch(console.error);
