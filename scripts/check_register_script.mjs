const SN_BASE = "https://dev187180.service-now.com";
const SN_AUTH = "Basic YWRtaW46bW4lWEMxXlNjZEE0";
const h = { "Authorization": SN_AUTH, "Content-Type": "application/json", "Accept": "application/json" };
async function main() {
  // Get the register op with all fields
  const r = await fetch(`${SN_BASE}/api/now/table/sys_ws_operation/c890d0af047a4b019ae0eecb3c082ae5`, { headers: h });
  const d = await r.json();
  const op = d.result || {};
  const keys = Object.keys(op);
  console.log("Op fields:", keys.join(", "));
  // Find the script-like field
  for (const k of keys) {
    const v = op[k];
    if (typeof v === "string" && v.length > 200) {
      console.log(`\nField: ${k} (length ${v.length})`);
      const memIdx = v.indexOf("memberId");
      const upIdx = v.indexOf("uploadedDocs");
      const submitIdx = v.indexOf("submitRegistration");
      console.log(`  has memberId: ${memIdx>=0}, uploadedDocs: ${upIdx>=0}, submitRegistration: ${submitIdx>=0}`);
      if (submitIdx >= 0) console.log("  submitReg ctx:", v.substring(Math.max(0,submitIdx-100), submitIdx+600));
      else if (upIdx >= 0) console.log("  uploadedDocs ctx:", v.substring(Math.max(0,upIdx-100), upIdx+400));
    }
  }
}
main().catch(console.error);
