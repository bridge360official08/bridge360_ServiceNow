import { snRequest } from '../scratch/sn_client.mjs';

async function getCount(table) {
  const res = await snRequest(`/api/now/table/${table}?sysparm_fields=sys_id`, 'GET');
  if (res.status === 200 && res.data?.result) {
    return res.data.result.length;
  }
  return -1;
}

async function getRecords(table, query) {
  const res = await snRequest(`/api/now/table/${table}?sysparm_query=${encodeURIComponent(query)}`, 'GET');
  if (res.status === 200 && res.data?.result) {
    return res.data.result;
  }
  return [];
}

async function deleteRecord(table, sysId) {
  const res = await snRequest(`/api/now/table/${table}/${sysId}`, 'DELETE');
  return res.status === 204;
}

async function submitRegister(payload) {
  const res = await snRequest('/api/global/v1/register', 'POST', payload);
  const data = res.data?.result || res.data;
  return { status: res.status, data };
}

async function runTestSuite() {
  console.log('===============================================================');
  console.log('BRIDGE360 — PHASE 5: LIVE SERVICENOW VERIFICATION TEST SUITE');
  console.log('===============================================================');

  const createdFamilySysIds = [];
  const createdMemberSysIds = [];

  // ── Baseline Counts ──
  const initialFamilyCount = await getCount('u_bridge360_family');
  const initialMemberCount = await getCount('u_bridge360_member');
  console.log(`\n[BASELINE COUNTS]`);
  console.log(`Initial u_bridge360_family count: ${initialFamilyCount}`);
  console.log(`Initial u_bridge360_member count: ${initialMemberCount}`);

  try {
    // ────────────────────────────────────────────────────────────────
    // CASE 1: Multiple Extracted Members (3 reviewed -> 3 records)
    // ────────────────────────────────────────────────────────────────
    console.log('\n--- CASE 1: Multiple Extracted Members (3 reviewed -> 3 records) ---');
    const case1Email = `case1_multi_${Date.now()}@bridge360test.org`;
    const case1Payload = {
      familyInfo: {
        familyName: 'Sharma Family',
        countryOfOrigin: 'India',
        primaryLanguage: 'Hindi',
        householdSize: 3
      },
      headOfFamily: {
        firstName: 'Rajesh',
        lastName: 'Sharma',
        email: case1Email,
        gender: 'Male',
        dateOfBirth: '1980-05-15',
        nationality: 'India'
      },
      familyMembers: [
        { id: 'TEMP-C1-1', name: 'Rajesh Sharma', firstName: 'Rajesh', lastName: 'Sharma', relationshipToHead: 'Head', gender: 'Male', dateOfBirth: '1980-05-15' },
        { id: 'TEMP-C1-2', name: 'Sunita Sharma', firstName: 'Sunita', lastName: 'Sharma', relationshipToHead: 'Spouse', gender: 'Female', dateOfBirth: '1982-08-20' },
        { id: 'TEMP-C1-3', name: 'Aarav Sharma', firstName: 'Aarav', lastName: 'Sharma', relationshipToHead: 'Son', gender: 'Male', dateOfBirth: '2010-12-05' }
      ],
      selectedApplicantMemberId: 'TEMP-C1-1',
      uploadedDocs: []
    };

    const res1 = await submitRegister(case1Payload);
    if (!res1.data?.success) throw new Error(`Case 1 failed: ${JSON.stringify(res1.data)}`);
    console.log(`✅ Case 1 API Success. Application ID: ${res1.data.applicationId}, Family sys_id: ${res1.data.familySysId}`);
    createdFamilySysIds.push(res1.data.familySysId);

    const members1 = await getRecords('u_bridge360_member', `u_family=${res1.data.familySysId}`);
    members1.forEach(m => createdMemberSysIds.push(m.sys_id));
    console.log(`   Found ${members1.length} persisted members for family ${res1.data.familySysId}`);
    if (members1.length !== 3) throw new Error(`Case 1 expected 3 members, got ${members1.length}`);
    if (res1.data.persistedMembers?.length !== 3) throw new Error(`Case 1 API response expected 3 persistedMembers`);

    const head1 = members1.find(m => m.u_is_head === 'true' || m.u_is_head === true);
    if (!head1 || head1.u_first_name !== 'Rajesh') throw new Error(`Case 1 head mismatch: ${JSON.stringify(head1)}`);
    console.log(`   ✅ Rajesh Sharma is Head (u_is_head: true, relationship: ${head1.u_relationship_to_head})`);

    // ────────────────────────────────────────────────────────────────
    // CASE 2: Removed Member (Extracted 3, Removed Mary -> 2 persisted)
    // ────────────────────────────────────────────────────────────────
    console.log('\n--- CASE 2: Removed Member (Extracted 3, Removed Mary -> 2 persisted) ---');
    const case2Email = `case2_remove_${Date.now()}@bridge360test.org`;
    // Extracted: John, Mary, David. User removes Mary. Reviewed: John, David.
    const case2Payload = {
      familyInfo: {
        familyName: 'Miller Family',
        countryOfOrigin: 'Vietnam',
        householdSize: 2
      },
      headOfFamily: {
        firstName: 'John',
        lastName: 'Miller',
        email: case2Email,
        gender: 'Male',
        dateOfBirth: '1975-03-10'
      },
      familyMembers: [
        { id: 'TEMP-C2-JOHN', name: 'John Miller', firstName: 'John', lastName: 'Miller', relationshipToHead: 'Head', gender: 'Male', dateOfBirth: '1975-03-10' },
        // Mary was removed by user!
        { id: 'TEMP-C2-DAVID', name: 'David Miller', firstName: 'David', lastName: 'Miller', relationshipToHead: 'Son', gender: 'Male', dateOfBirth: '2005-09-14' }
      ],
      selectedApplicantMemberId: 'TEMP-C2-JOHN',
      uploadedDocs: []
    };

    const res2 = await submitRegister(case2Payload);
    if (!res2.data?.success) throw new Error(`Case 2 failed: ${JSON.stringify(res2.data)}`);
    createdFamilySysIds.push(res2.data.familySysId);

    const members2 = await getRecords('u_bridge360_member', `u_family=${res2.data.familySysId}`);
    members2.forEach(m => createdMemberSysIds.push(m.sys_id));
    console.log(`   Persisted members count: ${members2.length} (Expected: 2)`);
    if (members2.length !== 2) throw new Error(`Case 2 expected 2 members, got ${members2.length}`);
    const maryExists = members2.some(m => m.u_first_name.toLowerCase().includes('mary'));
    if (maryExists) throw new Error(`Case 2 removed member Mary should NOT be persisted!`);
    console.log(`   ✅ Mary was removed and NOT persisted. Only John & David exist.`);

    // ────────────────────────────────────────────────────────────────
    // CASE 3: Edited Member (User edited John Doe -> John A. Doe)
    // ────────────────────────────────────────────────────────────────
    console.log('\n--- CASE 3: Edited Member (User edited John Doe -> John A. Doe) ---');
    const case3Email = `case3_edit_${Date.now()}@bridge360test.org`;
    const case3Payload = {
      familyInfo: {
        familyName: 'Doe Family',
        countryOfOrigin: 'China',
        householdSize: 1
      },
      headOfFamily: {
        firstName: 'John',
        middleName: 'A.',
        lastName: 'Doe',
        email: case3Email,
        gender: 'Male',
        dateOfBirth: '1985-01-01'
      },
      familyMembers: [
        { id: 'TEMP-C3-1', name: 'John A. Doe', firstName: 'John', middleName: 'A.', lastName: 'Doe', relationshipToHead: 'Head', gender: 'Male', dateOfBirth: '1985-01-01' }
      ],
      selectedApplicantMemberId: 'TEMP-C3-1',
      uploadedDocs: []
    };

    const res3 = await submitRegister(case3Payload);
    if (!res3.data?.success) throw new Error(`Case 3 failed: ${JSON.stringify(res3.data)}`);
    createdFamilySysIds.push(res3.data.familySysId);

    const members3 = await getRecords('u_bridge360_member', `u_family=${res3.data.familySysId}`);
    members3.forEach(m => createdMemberSysIds.push(m.sys_id));
    if (members3.length !== 1) throw new Error(`Case 3 expected 1 member`);
    if (members3[0].u_first_name !== 'John' || members3[0].u_middle_name !== 'A.' || members3[0].u_last_name !== 'Doe') {
      throw new Error(`Case 3 edited member mismatch: ${JSON.stringify(members3[0])}`);
    }
    console.log(`   ✅ ServiceNow contains edited member: ${members3[0].u_first_name} ${members3[0].u_middle_name} ${members3[0].u_last_name}`);

    // ────────────────────────────────────────────────────────────────
    // CASE 4: Manually Added Member (Extracted 2 + User Added David = 3)
    // ────────────────────────────────────────────────────────────────
    console.log('\n--- CASE 4: Manually Added Member (Extracted 2 + User Added David = 3) ---');
    const case4Email = `case4_add_${Date.now()}@bridge360test.org`;
    const case4Payload = {
      familyInfo: {
        familyName: 'Nguyen Family',
        countryOfOrigin: 'Vietnam',
        householdSize: 3
      },
      headOfFamily: {
        firstName: 'Minh',
        lastName: 'Nguyen',
        email: case4Email,
        gender: 'Male',
        dateOfBirth: '1980-02-14'
      },
      familyMembers: [
        { id: 'TEMP-C4-1', name: 'Minh Nguyen', firstName: 'Minh', lastName: 'Nguyen', relationshipToHead: 'Head', gender: 'Male', dateOfBirth: '1980-02-14', source: 'OCR' },
        { id: 'TEMP-C4-2', name: 'Hoa Nguyen', firstName: 'Hoa', lastName: 'Nguyen', relationshipToHead: 'Spouse', gender: 'Female', dateOfBirth: '1984-06-21', source: 'OCR' },
        // Manually added by user
        { id: 'TEMP-C4-3', name: 'David Nguyen', firstName: 'David', lastName: 'Nguyen', relationshipToHead: 'Son', gender: 'Male', dateOfBirth: '2012-11-03', source: 'Manual entry' }
      ],
      selectedApplicantMemberId: 'TEMP-C4-1',
      uploadedDocs: []
    };

    const res4 = await submitRegister(case4Payload);
    if (!res4.data?.success) throw new Error(`Case 4 failed: ${JSON.stringify(res4.data)}`);
    createdFamilySysIds.push(res4.data.familySysId);

    const members4 = await getRecords('u_bridge360_member', `u_family=${res4.data.familySysId}`);
    members4.forEach(m => createdMemberSysIds.push(m.sys_id));
    if (members4.length !== 3) throw new Error(`Case 4 expected 3 members, got ${members4.length}`);
    const davidFound = members4.find(m => m.u_first_name === 'David');
    if (!davidFound) throw new Error(`Case 4 manually added David Nguyen not found in ServiceNow`);
    console.log(`   ✅ Manually added member David Nguyen successfully persisted in ServiceNow: sys_id=${davidFound.sys_id}`);

    // ────────────────────────────────────────────────────────────────
    // CASE 5: Applicant Selection (User selects Mary as Applicant)
    // ────────────────────────────────────────────────────────────────
    console.log('\n--- CASE 5: Applicant Selection (User selects Mary as Applicant) ---');
    const case5Email = `case5_appsel_${Date.now()}@bridge360test.org`;
    const case5Payload = {
      familyInfo: {
        familyName: 'Tanaka Family',
        countryOfOrigin: 'Japan',
        householdSize: 2
      },
      headOfFamily: {
        firstName: 'Mary',
        lastName: 'Tanaka',
        email: case5Email,
        gender: 'Female',
        dateOfBirth: '1988-04-12'
      },
      familyMembers: [
        { id: 'TEMP-C5-KEN', name: 'Ken Tanaka', firstName: 'Ken', lastName: 'Tanaka', relationshipToHead: 'Spouse', gender: 'Male', dateOfBirth: '1985-03-10' },
        // User selected Mary as applicant!
        { id: 'TEMP-C5-MARY', name: 'Mary Tanaka', firstName: 'Mary', lastName: 'Tanaka', relationshipToHead: 'Head', gender: 'Female', dateOfBirth: '1988-04-12' }
      ],
      selectedApplicantMemberId: 'TEMP-C5-MARY',
      uploadedDocs: []
    };

    const res5 = await submitRegister(case5Payload);
    if (!res5.data?.success) throw new Error(`Case 5 failed: ${JSON.stringify(res5.data)}`);
    createdFamilySysIds.push(res5.data.familySysId);

    const members5 = await getRecords('u_bridge360_member', `u_family=${res5.data.familySysId}`);
    members5.forEach(m => createdMemberSysIds.push(m.sys_id));
    if (members5.length !== 2) throw new Error(`Case 5 expected 2 members, got ${members5.length}`);

    const maryHead = members5.find(m => m.u_is_head === 'true' || m.u_is_head === true);
    if (!maryHead || maryHead.u_first_name !== 'Mary') {
      throw new Error(`Case 5 expected Mary to be Head, but found: ${JSON.stringify(maryHead)}`);
    }
    if (maryHead.u_relationship_to_head !== 'self') {
      throw new Error(`Case 5 expected Mary relationship to be 'self', got '${maryHead.u_relationship_to_head}'`);
    }
    console.log(`   ✅ Mary Tanaka is verified Head of Family (u_is_head: true, u_relationship_to_head: self, sys_id=${maryHead.sys_id})`);

    // ────────────────────────────────────────────────────────────────
    // CASE 6: Retry Duplicate Protection (Submit same family twice)
    // ────────────────────────────────────────────────────────────────
    console.log('\n--- CASE 6: Retry Duplicate Protection (Submit same family twice) ---');
    const case6Email = `case6_retry_${Date.now()}@bridge360test.org`;
    const case6Payload = {
      familyInfo: {
        familyName: 'Wong Family',
        countryOfOrigin: 'China',
        householdSize: 2
      },
      headOfFamily: {
        firstName: 'Li',
        lastName: 'Wong',
        email: case6Email,
        gender: 'Male',
        dateOfBirth: '1982-07-07'
      },
      familyMembers: [
        { id: 'TEMP-C6-1', name: 'Li Wong', firstName: 'Li', lastName: 'Wong', relationshipToHead: 'Head', gender: 'Male', dateOfBirth: '1982-07-07' },
        { id: 'TEMP-C6-2', name: 'Mei Wong', firstName: 'Mei', lastName: 'Wong', relationshipToHead: 'Spouse', gender: 'Female', dateOfBirth: '1985-09-09' }
      ],
      selectedApplicantMemberId: 'TEMP-C6-1',
      uploadedDocs: []
    };

    // First submission
    const res6a = await submitRegister(case6Payload);
    if (!res6a.data?.success) throw new Error(`Case 6 first submission failed: ${JSON.stringify(res6a.data)}`);
    const initialFamSysId = res6a.data.familySysId;
    const initialAppId = res6a.data.applicationId;
    createdFamilySysIds.push(initialFamSysId);

    const members6a = await getRecords('u_bridge360_member', `u_family=${initialFamSysId}`);
    members6a.forEach(m => createdMemberSysIds.push(m.sys_id));
    console.log(`   First attempt created ${members6a.length} members. Application ID: ${initialAppId}`);
    if (members6a.length !== 2) throw new Error(`Case 6 first attempt expected 2 members`);

    // Second submission (Retry with familySysId / allowRetry)
    const retryPayload = {
      ...case6Payload,
      familySysId: initialFamSysId,
      applicationId: initialAppId,
      allowRetry: true
    };
    const res6b = await submitRegister(retryPayload);
    if (!res6b.data?.success) throw new Error(`Case 6 retry submission failed: ${JSON.stringify(res6b.data)}`);
    console.log(`   Retry attempt response: success=${res6b.data.success}, familySysId=${res6b.data.familySysId}`);

    const members6b = await getRecords('u_bridge360_member', `u_family=${initialFamSysId}`);
    console.log(`   After retry: members count for family is ${members6b.length} (Expected: still 2, ZERO duplicate records)`);
    if (members6b.length !== 2) throw new Error(`Case 6 retry created duplicate members! Count was ${members6b.length}`);
    console.log(`   ✅ Retry protection verified: In-place update with ZERO duplicate records created.`);

    // ────────────────────────────────────────────────────────────────
    // CASE 7: Individual Registration Regression Test
    // ────────────────────────────────────────────────────────────────
    console.log('\n--- CASE 7: Individual Registration Regression Test ---');
    const case7Email = `case7_indiv_${Date.now()}@bridge360test.org`;
    const case7Payload = {
      familyInfo: {
        familyName: 'Solo Applicant',
        countryOfOrigin: 'India',
        householdSize: 1
      },
      headOfFamily: {
        firstName: 'Amit',
        lastName: 'Kumar',
        email: case7Email,
        gender: 'Male',
        dateOfBirth: '1995-10-25'
      },
      members: [], // Individual flow: empty members array, no familyMembers
      uploadedDocs: []
    };

    const res7 = await submitRegister(case7Payload);
    if (!res7.data?.success) throw new Error(`Case 7 Individual registration failed: ${JSON.stringify(res7.data)}`);
    createdFamilySysIds.push(res7.data.familySysId);

    const members7 = await getRecords('u_bridge360_member', `u_family=${res7.data.familySysId}`);
    members7.forEach(m => createdMemberSysIds.push(m.sys_id));
    if (members7.length !== 1) throw new Error(`Case 7 expected 1 member for Individual registration, got ${members7.length}`);
    if (members7[0].u_first_name !== 'Amit' || members7[0].u_is_head !== 'true') {
      throw new Error(`Case 7 member mismatch: ${JSON.stringify(members7[0])}`);
    }
    console.log(`   ✅ Individual registration verified: Created Application ID ${res7.data.applicationId} with 1 head member (Amit Kumar).`);

    console.log('\n===============================================================');
    console.log('ALL 7 TEST CASES PASSED SUCCESSFULLY!');
    console.log('===============================================================');
    console.log(`Total test family records created: ${createdFamilySysIds.length}`);
    console.log(`Total test member records created: ${createdMemberSysIds.length}`);

    // Verification of temporary ID -> permanent ServiceNow sys_id mapping
    console.log('\n--- VERIFYING TEMPORARY ID -> SERVICENOW SYS_ID MAPPING ---');
    for (const pm of res1.data.persistedMembers) {
      console.log(`   Client Temp ID [${pm.clientTempId}] ───► ServiceNow sys_id [${pm.sys_id}] (${pm.fullName}, isHead: ${pm.isHead})`);
    }

  } finally {
    // ── Safe Cleanup of ONLY Test-Created Records ──
    console.log('\n[TEST DATA CLEANUP] Removing ONLY records created during this test run...');
    let deletedMembers = 0;
    for (const memId of createdMemberSysIds) {
      const ok = await deleteRecord('u_bridge360_member', memId);
      if (ok) deletedMembers++;
    }
    let deletedFamilies = 0;
    for (const famId of createdFamilySysIds) {
      const ok = await deleteRecord('u_bridge360_family', famId);
      if (ok) deletedFamilies++;
    }
    console.log(`Cleaned up ${deletedMembers} member records and ${deletedFamilies} family records.`);

    const finalFamilyCount = await getCount('u_bridge360_family');
    const finalMemberCount = await getCount('u_bridge360_member');
    console.log(`\n[FINAL COUNTS]`);
    console.log(`u_bridge360_family count: ${finalFamilyCount} (Initial: ${initialFamilyCount})`);
    console.log(`u_bridge360_member count: ${finalMemberCount} (Initial: ${initialMemberCount})`);
    if (finalFamilyCount === initialFamilyCount && finalMemberCount === initialMemberCount) {
      console.log('✅ Instance restored exactly to initial baseline! Zero contamination of existing records.');
    }
  }
}

runTestSuite().catch(err => {
  console.error('❌ Test Suite Failed:', err);
  process.exit(1);
});
