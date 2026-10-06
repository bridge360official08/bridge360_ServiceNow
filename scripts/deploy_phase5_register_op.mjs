import { snRequest } from '../scratch/sn_client.mjs';

const REGISTER_OPERATION_SYS_ID = 'c890d0af047a4b019ae0eecb3c082ae5';

const script = `(function process(request, response) {
  response.setContentType('application/json');
  try {
    var body = request.body.data || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) {}
    } else if (!body || Object.keys(body).length === 0) {
      try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
    }

    var famInfo = body.familyInfo || {};
    var head    = body.headOfFamily || {};
    var members = body.members || [];
    var familyMembers = body.familyMembers || [];
    var selectedApplicantId = body.selectedApplicantMemberId || '';
    var docs    = body.uploadedDocs || [];
    var clientFamilySysId = body.familySysId || '';
    var clientAppId = body.applicationId || '';
    var isRetry = body.allowRetry || false;

    function normalizeRelationship(rel, isHead) {
      if (isHead) return 'self';
      if (!rel) return 'other';
      var r = String(rel).toLowerCase().trim();
      if (r === 'self' || r === 'head') return 'self';
      if (r === 'spouse' || r === 'wife' || r === 'husband' || r === 'istri' || r === 'suami') return 'spouse';
      if (r === 'son' || r === 'anak' || r === 'child') return 'son';
      if (r === 'daughter') return 'daughter';
      if (r === 'father' || r === 'ayah' || r === 'parent') return 'father';
      if (r === 'mother' || r === 'ibu') return 'mother';
      if (r === 'sibling' || r === 'brother' || r === 'sister' || r === 'saudara') return 'sibling';
      return 'other';
    }

    function normalizeGender(g) {
      if (!g) return 'other';
      var s = String(g).toLowerCase().trim();
      if (s === 'male' || s === 'm' || s === 'laki-laki' || s === 'pria') return 'male';
      if (s === 'female' || s === 'f' || s === 'perempuan' || s === 'wanita') return 'female';
      return 'other';
    }

    function normalizeDate(d) {
      if (!d) return '';
      var str = String(d).trim();
      var match = str.match(/^(\\d{4})[-/.](\\d{1,2})[-/.](\\d{1,2})$/);
      if (match) {
        var m = parseInt(match[2], 10);
        var day = parseInt(match[3], 10);
        return match[1] + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
      }
      return str;
    }

    // ── 1. Family Record Management (Create or Reuse on Retry) ──
    var grFam = new GlideRecord('u_bridge360_family');
    var sysFamId = '';
    var appId = '';

    if (clientFamilySysId && grFam.get(clientFamilySysId)) {
      sysFamId = grFam.getUniqueValue();
      appId = grFam.getValue('u_application_id') || ('APP-2026-' + sysFamId.slice(-6));
    } else if (clientAppId) {
      grFam.addQuery('u_application_id', clientAppId);
      grFam.query();
      if (grFam.next()) {
        sysFamId = grFam.getUniqueValue();
        appId = clientAppId;
      }
    }

    // If not an existing application retry, check duplicate email/phone
    if (!sysFamId) {
      if (head.email && !isRetry) {
        var grEmailChk = new GlideRecord('u_bridge360_family');
        grEmailChk.addQuery('u_email', head.email);
        grEmailChk.query();
        if (grEmailChk.hasNext()) {
          response.setStatus(409);
          response.setBody({
            success: false,
            error: 'duplicate_email',
            message: 'An application is already registered with this email (' + head.email + '). Please check your existing application via Track Status.'
          });
          return;
        }
      }

      if (head.mobileNumber && !isRetry) {
        var grPhoneChk = new GlideRecord('u_bridge360_member');
        grPhoneChk.addQuery('u_mobile_number', head.mobileNumber);
        grPhoneChk.query();
        if (grPhoneChk.hasNext()) {
          response.setStatus(409);
          response.setBody({
            success: false,
            error: 'duplicate_phone',
            message: 'An application is already registered with this mobile number (' + head.mobileNumber + ').'
          });
          return;
        }
      }

      var seq = new GlideRecord('u_bridge360_family');
      seq.query();
      var count = seq.getRowCount() + 1;
      var numStr = ('000000' + count).slice(-6);
      appId = 'APP-2026-' + numStr;

      var familyName = famInfo.familyName || (head.lastName ? (head.lastName + ' Family') : 'Refugee Family');
      var totalHouseholdSize = familyMembers.length > 0 ? familyMembers.length : (1 + members.length);

      grFam.initialize();
      grFam.setValue('u_application_id',    appId);
      grFam.setValue('u_bridge360_id',      '');
      grFam.setValue('u_family_id',         '');
      grFam.setValue('u_family_name',       familyName);
      grFam.setValue('u_country_of_origin', famInfo.countryOfOrigin || head.nationality || 'Unknown');
      grFam.setValue('u_arrival_date',      famInfo.arrivalDate || new GlideDate().getValue());
      grFam.setValue('u_household_size',    totalHouseholdSize);
      grFam.setValue('u_primary_language',  famInfo.primaryLanguage || 'English');
      grFam.setValue('u_immigration_status','asylum_applicant');
      grFam.setValue('u_needs_interpreter', famInfo.needsInterpreter ? true : false);
      grFam.setValue('u_priority',          'normal');
      grFam.setValue('u_registration_status', 'submitted');
      grFam.setValue('u_verification_status', 'pending_review');
      grFam.setValue('u_case_status',       'new');
      grFam.setValue('u_assigned_officer',  'Sarah Jenkins');
      grFam.setValue('u_email',             head.email || '');
      grFam.setValue('u_allow_customer_edit', false);
      grFam.setValue('u_doc_request_pending', false);
      sysFamId = grFam.insert();
    } else {
      if (familyMembers.length > 0) {
        grFam.setValue('u_household_size', familyMembers.length);
        grFam.update();
      }
    }

    // ── 2. Member Ingestion & Persistence ──
    var persistedMembersSummary = [];
    var headSysId = '';

    if (familyMembers && familyMembers.length > 0) {
      var applicantIndex = -1;
      if (selectedApplicantId) {
        for (var k = 0; k < familyMembers.length; k++) {
          if (familyMembers[k].id === selectedApplicantId) {
            applicantIndex = k;
            break;
          }
        }
      }
      if (applicantIndex === -1) {
        for (var k2 = 0; k2 < familyMembers.length; k2++) {
          if (familyMembers[k2].isApplicant || (familyMembers[k2].relationshipToHead && familyMembers[k2].relationshipToHead.toLowerCase() === 'head')) {
            applicantIndex = k2;
            break;
          }
        }
      }
      if (applicantIndex === -1) {
        applicantIndex = 0;
      }

      for (var idx = 0; idx < familyMembers.length; idx++) {
        var mItem = familyMembers[idx];
        var isHeadMember = (idx === applicantIndex);

        var mName = (mItem.name || '').trim();
        var nParts = mName ? mName.split(/\\s+/) : [];
        var fName = mItem.firstName || (nParts.length > 0 ? nParts[0] : (isHeadMember ? (head.firstName || 'Applicant') : 'Family'));
        var lName = mItem.lastName || (nParts.length > 1 ? nParts[nParts.length - 1] : (isHeadMember ? (head.lastName || 'Family') : (head.lastName || 'Family')));
        var midName = mItem.middleName || (nParts.length > 2 ? nParts.slice(1, -1).join(' ') : (isHeadMember ? (head.middleName || '') : ''));

        var memberRel = normalizeRelationship(mItem.relationshipToHead, isHeadMember);
        var memberGender = normalizeGender(mItem.gender || (isHeadMember ? head.gender : 'other'));
        var memberDob = normalizeDate(mItem.dateOfBirth || (isHeadMember ? head.dateOfBirth : ''));
        var memberNat = mItem.nationality || head.nationality || famInfo.countryOfOrigin || 'Unknown';
        var memberIdNum = mItem.memberIdentifier || mItem.nationalId || (isHeadMember ? (head.nationalId || '') : '');
        var memberPass = mItem.passportNumber || (isHeadMember ? (head.passportNumber || '') : '');

        var grMemberRecord = new GlideRecord('u_bridge360_member');
        var memberFound = false;

        if (mItem.serviceNowSysId || mItem.sys_id) {
          var targetSysId = mItem.serviceNowSysId || mItem.sys_id;
          if (grMemberRecord.get(targetSysId)) {
            memberFound = true;
          }
        }

        if (!memberFound) {
          grMemberRecord.addQuery('u_family', sysFamId);
          if (isHeadMember) {
            grMemberRecord.addQuery('u_is_head', true);
          } else {
            grMemberRecord.addQuery('u_first_name', fName);
            grMemberRecord.addQuery('u_last_name', lName);
          }
          grMemberRecord.query();
          if (grMemberRecord.next()) {
            memberFound = true;
          }
        }

        if (!memberFound) {
          grMemberRecord.initialize();
          grMemberRecord.setValue('u_family', sysFamId);
        }

        grMemberRecord.setValue('u_refugee_id', '');
        grMemberRecord.setValue('u_is_head', isHeadMember);
        grMemberRecord.setValue('u_relationship_to_head', memberRel);
        grMemberRecord.setValue('u_first_name', fName);
        grMemberRecord.setValue('u_middle_name', midName);
        grMemberRecord.setValue('u_last_name', lName);
        grMemberRecord.setValue('u_gender', memberGender);
        grMemberRecord.setValue('u_date_of_birth', memberDob);
        grMemberRecord.setValue('u_nationality', memberNat);
        grMemberRecord.setValue('u_national_id', memberIdNum);
        grMemberRecord.setValue('u_passport_number', memberPass);

        if (isHeadMember) {
          grMemberRecord.setValue('u_mobile_number', head.mobileNumber || '');
          grMemberRecord.setValue('u_email',         head.email || '');
          grMemberRecord.setValue('u_address',       head.address || '');
          grMemberRecord.setValue('u_city',          head.city || '');
          grMemberRecord.setValue('u_state',         head.state || '');
          grMemberRecord.setValue('u_postal_code',   head.postalCode || '');
        } else {
          if (mItem.mobileNumber) grMemberRecord.setValue('u_mobile_number', mItem.mobileNumber);
          if (mItem.email)        grMemberRecord.setValue('u_email', mItem.email);
          if (mItem.address || head.address) grMemberRecord.setValue('u_address', mItem.address || head.address || '');
          if (mItem.city || head.city) grMemberRecord.setValue('u_city', mItem.city || head.city || '');
          if (mItem.postalCode || head.postalCode) grMemberRecord.setValue('u_postal_code', mItem.postalCode || head.postalCode || '');
        }

        grMemberRecord.setValue('u_verification_status', 'pending');

        var savedMemId = '';
        if (memberFound) {
          grMemberRecord.update();
          savedMemId = grMemberRecord.getUniqueValue();
        } else {
          savedMemId = grMemberRecord.insert();
        }

        if (isHeadMember) {
          headSysId = savedMemId;
        }

        persistedMembersSummary.push({
          clientTempId: mItem.id || ('temp-' + idx),
          sys_id: savedMemId,
          firstName: fName,
          lastName: lName,
          relationship: memberRel,
          isHead: isHeadMember
        });
      }
    } else {
      var grHead = new GlideRecord('u_bridge360_member');
      var headFound = false;

      if (head.sys_id && grHead.get(head.sys_id)) {
        headFound = true;
      } else {
        grHead.addQuery('u_family', sysFamId);
        grHead.addQuery('u_is_head', true);
        grHead.query();
        if (grHead.next()) headFound = true;
      }

      if (!headFound) {
        grHead.initialize();
        grHead.setValue('u_family', sysFamId);
      }

      grHead.setValue('u_refugee_id',          '');
      grHead.setValue('u_is_head',             true);
      grHead.setValue('u_relationship_to_head','self');
      grHead.setValue('u_first_name',          head.firstName  || 'Applicant');
      grHead.setValue('u_middle_name',         head.middleName || '');
      grHead.setValue('u_last_name',           head.lastName   || 'Family');
      grHead.setValue('u_gender',              normalizeGender(head.gender));
      grHead.setValue('u_date_of_birth',       normalizeDate(head.dateOfBirth));
      grHead.setValue('u_nationality',         head.nationality  || famInfo.countryOfOrigin || 'Unknown');
      grHead.setValue('u_passport_number',     head.passportNumber || '');
      grHead.setValue('u_national_id',         head.nationalId   || '');
      grHead.setValue('u_mobile_number',       head.mobileNumber || '');
      grHead.setValue('u_email',               head.email        || '');
      grHead.setValue('u_address',             head.address      || '');
      grHead.setValue('u_city',                head.city         || '');
      grHead.setValue('u_state',               head.state        || '');
      grHead.setValue('u_postal_code',         head.postalCode   || '');
      grHead.setValue('u_verification_status', 'pending');

      if (headFound) {
        grHead.update();
        headSysId = grHead.getUniqueValue();
      } else {
        headSysId = grHead.insert();
      }

      persistedMembersSummary.push({
        clientTempId: head.id || 'head-applicant',
        sys_id: headSysId,
        firstName: head.firstName || 'Applicant',
        lastName: head.lastName || 'Family',
        relationship: 'self',
        isHead: true
      });

      if (members && members.length > 0) {
        for (var i = 0; i < members.length; i++) {
          var m = members[i];
          var grMem = new GlideRecord('u_bridge360_member');
          var mFound = false;

          if (m.sys_id && grMem.get(m.sys_id)) {
            mFound = true;
          } else {
            grMem.addQuery('u_family', sysFamId);
            grMem.addQuery('u_first_name', m.firstName || '');
            grMem.addQuery('u_last_name', m.lastName || head.lastName || 'Family');
            grMem.query();
            if (grMem.next()) mFound = true;
          }

          if (!mFound) {
            grMem.initialize();
            grMem.setValue('u_family', sysFamId);
          }

          grMem.setValue('u_refugee_id',           '');
          grMem.setValue('u_is_head',              false);
          grMem.setValue('u_relationship_to_head', normalizeRelationship(m.relationshipToHead, false));
          grMem.setValue('u_first_name',           m.firstName  || '');
          grMem.setValue('u_middle_name',          m.middleName || '');
          grMem.setValue('u_last_name',            m.lastName   || head.lastName || 'Family');
          grMem.setValue('u_gender',               normalizeGender(m.gender));
          grMem.setValue('u_date_of_birth',        normalizeDate(m.dateOfBirth));
          grMem.setValue('u_nationality',          m.nationality || head.nationality || famInfo.countryOfOrigin || 'Unknown');
          grMem.setValue('u_national_id',          m.nationalId || m.memberIdentifier || '');
          grMem.setValue('u_verification_status',  'pending');

          var mId = '';
          if (mFound) {
            grMem.update();
            mId = grMem.getUniqueValue();
          } else {
            mId = grMem.insert();
          }

          persistedMembersSummary.push({
            clientTempId: m.id || ('member-' + i),
            sys_id: mId,
            firstName: m.firstName || '',
            lastName: m.lastName || head.lastName || 'Family',
            relationship: normalizeRelationship(m.relationshipToHead, false),
            isHead: false
          });
        }
      }
    }

    // ── 3. Documents (Linked to Family; Head of Household is default member) ──
    if (docs && docs.length > 0) {
      for (var d = 0; d < docs.length; d++) {
        var doc = docs[d];
        var grDoc = new GlideRecord('u_bridge360_document');
        var docFound = false;

        grDoc.addQuery('u_family', sysFamId);
        grDoc.addQuery('u_file_name', doc.fileName || '');
        grDoc.query();
        if (grDoc.next()) docFound = true;

        if (!docFound) {
          grDoc.initialize();
          grDoc.setValue('u_family',              sysFamId);
          grDoc.setValue('u_member',              headSysId);
          grDoc.setValue('u_application_id',      appId);
          grDoc.setValue('u_document_type',       (doc.documentType || 'passport').toLowerCase().replace(/\\s+/g, '_'));
          grDoc.setValue('u_file_name',           doc.fileName  || '');
          grDoc.setValue('u_file_size',           doc.fileSize  || '');
          grDoc.setValue('u_verification_status', 'pending');
          if (doc.extractedJson) {
            grDoc.setValue('u_extracted_json', typeof doc.extractedJson === 'string' ? doc.extractedJson : JSON.stringify(doc.extractedJson));
          }
          grDoc.insert();
        }
      }
    }

    // ── 4. Confirmation Email Dispatch (Non-blocking) ──
    var email = head.email || '';
    if (email) {
      try {
        var mail = new GlideRecord('sys_email');
        mail.initialize();
        mail.setValue('type', 'send-ready');
        mail.setValue('recipients', email);
        mail.setValue('subject', 'Bridge360 Registration Received — ' + appId);
        mail.setValue('body', 'Hello ' + (head.firstName || 'Applicant') + ',\\n\\nYour registration for the Bridge360 Refugee Support System has been successfully received.\\n\\nYour Application ID is: ' + appId + '\\n\\nMembers registered: ' + persistedMembersSummary.length + '\\n\\nYou can track your application status at any time on the portal by entering your Application ID.\\n\\nThank you,\\nBridge360 Refugee Support System');
        mail.setValue('content_type', 'text/plain');
        mail.insert();
      } catch (mErr) {}
    }

    response.setStatus(200);
    response.setBody({
      success: true,
      applicationId: appId,
      familySysId: sysFamId,
      headSysId: headSysId,
      applicantMemberSysId: headSysId,
      persistedMembers: persistedMembersSummary,
      message: 'Registration submitted successfully with ' + persistedMembersSummary.length + ' members persisted. Application ID: ' + appId
    });
  } catch (e) {
    response.setStatus(400);
    response.setBody({ success: false, error: e.toString() });
  }
})(request, response);`;

async function deploy() {
  console.log('Deploying Phase 5 updated /register operation to live ServiceNow...');
  const res = await snRequest(
    `/api/now/table/sys_ws_operation/${REGISTER_OPERATION_SYS_ID}`,
    'PATCH',
    { operation_script: script }
  );

  if (res.status === 200 && res.data?.result) {
    console.log('✅ Successfully updated sys_ws_operation for /register on live instance!');
    console.log('   Operation name:', res.data.result.name);
    console.log('   Operation sys_id:', res.data.result.sys_id);
  } else {
    console.error('❌ Failed to update operation:', res.status, res.data);
    process.exit(1);
  }
}

deploy();
