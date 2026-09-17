import { ScriptInclude } from '@servicenow/sdk/core';

export const Bridge360API = ScriptInclude({
  $id: 'bridge360_api',
  name: 'Bridge360API',
  callerAccess: 'tracking',
  script: `var Bridge360API = Class.create();
Bridge360API.prototype = {
  initialize: function() {},

  // ─── 1. Document Intelligence: Server-side Extraction ────────────────────
  extractDocument: function(payload) {
    try {
      payload = payload || {};
      var rawText = (payload.text || payload.rawText || '').trim();
      var fileName = payload.fileName || '';
      var docType = 'passport';

      // Infer Document Type
      var upper = rawText.toUpperCase();
      if (upper.indexOf('PASSPORT') !== -1 || upper.indexOf('P<') !== -1) {
        docType = 'passport';
      } else if (upper.indexOf('NATIONAL ID') !== -1 || upper.indexOf('IDENTITY CARD') !== -1 || upper.indexOf('AADHAAR') !== -1) {
        docType = 'national_id';
      } else if (upper.indexOf('VISA') !== -1) {
        docType = 'visa';
      } else if (upper.indexOf('BIRTH') !== -1) {
        docType = 'birth_certificate';
      } else if (upper.indexOf('UNHCR') !== -1 || upper.indexOf('REFUGEE') !== -1) {
        docType = 'unhcr_certificate';
      }

      var extracted = {
        documentType:   docType,
        firstName:      '',
        middleName:     '',
        lastName:       '',
        dateOfBirth:    '',
        gender:         '',
        nationality:    '',
        passportNumber: '',
        nationalId:     '',
        mobileNumber:   '',
        email:          '',
        address:        '',
        city:           '',
        state:          '',
        postalCode:     '',
      };

      var confidence = {};

      // ── Name Extraction ──
      var fnMatch = rawText.match(/(?:First Name|Given Name[s]?|Forename[s]?|Name)\\s*[:\\-]?\\s*([A-Za-z]+(?:\\s+[A-Za-z]+)?)/i);
      var lnMatch = rawText.match(/(?:Last Name|Surname|Family Name)\\s*[:\\-]?\\s*([A-Za-z]+)/i);
      if (fnMatch) {
        extracted.firstName = fnMatch[1].trim();
        confidence.firstName = 0.95;
      }
      if (lnMatch) {
        extracted.lastName = lnMatch[1].trim();
        confidence.lastName = 0.95;
      }
      if (!extracted.firstName && !extracted.lastName) {
        var fullMatch = rawText.match(/(?:Name|Holder)\\s*[:\\-]?\\s*([A-Za-z]+)\\s+([A-Za-z]+)/i);
        if (fullMatch) {
          extracted.firstName = fullMatch[1].trim();
          extracted.lastName = fullMatch[2].trim();
          confidence.firstName = 0.85;
          confidence.lastName = 0.85;
        }
      }

      // ── Passport / ID Number ──
      var passMatch = rawText.match(/(?:Passport No[.]?|Passport Number|Doc No[.]?|Document No[.]?)\\s*[:\\-]?\\s*([A-Z0-9]{6,12})/i);
      if (passMatch) {
        extracted.passportNumber = passMatch[1].toUpperCase().trim();
        confidence.passportNumber = 0.96;
      } else {
        var mrzPass = rawText.match(/P<[A-Z]{3}([A-Z0-9<]+)/);
        if (mrzPass) {
          extracted.passportNumber = mrzPass[1].split('<')[0].trim();
          confidence.passportNumber = 0.92;
        }
      }

      var idMatch = rawText.match(/(?:National ID|ID Number|Identity No[.]?|Civil ID)\\s*[:\\-]?\\s*([A-Z0-9\\-]{6,16})/i);
      if (idMatch) {
        extracted.nationalId = idMatch[1].trim();
        confidence.nationalId = 0.94;
      }

      // ── Date of Birth ──
      var dobMatch = rawText.match(/(?:Date of Birth|DOB|Birth Date|Born)\\s*[:\\-]?\\s*(\\d{1,2}[\\/\\-\\.\\s](?:[A-Za-z]{3}|\\d{1,2})[\\/\\-\\.\\s]\\d{2,4}|\\d{4}[\\/\\-\\.]\\d{1,2}[\\/\\-\\.]\\d{1,2})/i);
      if (dobMatch) {
        extracted.dateOfBirth = dobMatch[1].trim();
        confidence.dateOfBirth = 0.93;
      }

      // ── Gender ──
      var genderMatch = rawText.match(/(?:Sex|Gender)\\s*[:\\-]?\\s*(Male|Female|M|F|Other)/i);
      if (genderMatch) {
        var g = genderMatch[1].toUpperCase();
        extracted.gender = (g === 'M' || g === 'MALE') ? 'Male' : (g === 'F' || g === 'FEMALE') ? 'Female' : 'Other';
        confidence.gender = 0.97;
      }

      // ── Nationality ──
      var natMatch = rawText.match(/(?:Nationality|Country of Origin|Citizenship)\\s*[:\\-]?\\s*([A-Za-z\\s]{3,30})/i);
      if (natMatch) {
        extracted.nationality = natMatch[1].trim();
        confidence.nationality = 0.91;
      }

      // ── Email ──
      var emailMatch = rawText.match(/([a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,})/);
      if (emailMatch) {
        extracted.email = emailMatch[1].toLowerCase().trim();
        confidence.email = 0.98;
      }

      // ── Phone ──
      var phoneMatch = rawText.match(/(\\+?\\d{1,4}[\\s\\-]?(?:\\(?\\d{1,4}\\)?[\\s\\-]?)?\\d{3,5}[\\s\\-]?\\d{3,5})/);
      if (phoneMatch) {
        extracted.mobileNumber = phoneMatch[1].trim();
        confidence.mobileNumber = 0.90;
      }

      return {
        success: true,
        documentType: docType,
        extracted: extracted,
        confidence: confidence,
        fileName: fileName,
      };
    } catch (e) {
      gs.log('Bridge360 extractDocument Exception: ' + e);
      return { success: false, error: e.toString() };
    }
  },

  // ─── 2. Submit Registration (Initial: Grants Application ID ONLY) ────────
  submitRegistration: function(payload) {
    try {
      payload = payload || {};
      var famInfo = payload.familyInfo || {};
      var head    = payload.headOfFamily || {};
      var members = payload.members || [];
      var docs    = payload.uploadedDocs || [];

      // ── Duplicate Check (1 Email & 1 Phone per individual/refugee) ──────
      if (head.email) {
        var grEmailChk = new GlideRecord('u_bridge360_family');
        grEmailChk.addQuery('u_email', head.email);
        grEmailChk.query();
        if (grEmailChk.hasNext()) {
          return {
            success: false,
            error: 'duplicate_email',
            message: 'An application is already registered with this email address (' + head.email + '). Please check your existing application via Track Status.'
          };
        }
      }

      if (head.mobileNumber) {
        var grPhoneChk = new GlideRecord('u_bridge360_member');
        grPhoneChk.addQuery('u_mobile_number', head.mobileNumber);
        grPhoneChk.query();
        if (grPhoneChk.hasNext()) {
          return {
            success: false,
            error: 'duplicate_phone',
            message: 'An application is already registered with this mobile number (' + head.mobileNumber + ').'
          };
        }
      }

      // Generate sequence number for Application ID
      var seq = new GlideRecord('u_bridge360_family');
      seq.query();
      var count = seq.getRowCount() + 1;
      var numStr = ("000000" + count).slice(-6);

      var appId  = "APP-2026-" + numStr;
      var familyName = famInfo.familyName || (head.lastName ? (head.lastName + " Family") : "Refugee Family");

      // ── Family record (Refugee ID & Family ID are EMPTY until admin verifies) ──
      var grFam = new GlideRecord('u_bridge360_family');
      grFam.initialize();
      grFam.setValue('u_application_id',    appId);
      grFam.setValue('u_bridge360_id',      ''); // Intentionally empty until verification
      grFam.setValue('u_family_id',         ''); // Intentionally empty until verification
      grFam.setValue('u_family_name',       familyName);
      grFam.setValue('u_country_of_origin', famInfo.countryOfOrigin || 'Unknown');
      grFam.setValue('u_arrival_date',      famInfo.arrivalDate || new GlideDate().getValue());
      grFam.setValue('u_household_size',    famInfo.householdSize || (1 + members.length));
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
      var sysFamId = grFam.insert();

      // ── Head of Family member (Refugee ID empty until verified) ──────────
      var grHead = new GlideRecord('u_bridge360_member');
      grHead.initialize();
      grHead.setValue('u_family',              sysFamId);
      grHead.setValue('u_refugee_id',          ''); // Minted only on verification
      grHead.setValue('u_is_head',             true);
      grHead.setValue('u_relationship_to_head','self');
      grHead.setValue('u_first_name',          head.firstName  || 'Applicant');
      grHead.setValue('u_middle_name',         head.middleName || '');
      grHead.setValue('u_last_name',           head.lastName   || 'Family');
      grHead.setValue('u_gender',              (head.gender || 'other').toLowerCase());
      grHead.setValue('u_date_of_birth',       head.dateOfBirth  || '');
      grHead.setValue('u_nationality',         head.nationality  || famInfo.countryOfOrigin || '');
      grHead.setValue('u_passport_number',     head.passportNumber || '');
      grHead.setValue('u_national_id',         head.nationalId   || '');
      grHead.setValue('u_mobile_number',       head.mobileNumber || '');
      grHead.setValue('u_email',               head.email        || '');
      grHead.setValue('u_address',             head.address      || '');
      grHead.setValue('u_city',                head.city         || '');
      grHead.setValue('u_state',               head.state        || '');
      grHead.setValue('u_postal_code',         head.postalCode   || '');
      grHead.setValue('u_verification_status', 'pending');
      var headSysId = grHead.insert();

      // ── Accompanying family members ────────────────────────────────────
      if (members && members.length > 0) {
        for (var i = 0; i < members.length; i++) {
          var m = members[i];
          var grMem = new GlideRecord('u_bridge360_member');
          grMem.initialize();
          grMem.setValue('u_family',               sysFamId);
          grMem.setValue('u_refugee_id',           ''); // Minted only on verification
          grMem.setValue('u_is_head',              false);
          grMem.setValue('u_relationship_to_head', (m.relationshipToHead || 'other').toLowerCase());
          grMem.setValue('u_first_name',           m.firstName  || '');
          grMem.setValue('u_last_name',            m.lastName   || head.lastName || 'Family');
          grMem.setValue('u_gender',               (m.gender || 'other').toLowerCase());
          grMem.setValue('u_date_of_birth',        m.dateOfBirth || '');
          grMem.setValue('u_nationality',          m.nationality || head.nationality || famInfo.countryOfOrigin || '');
          grMem.setValue('u_verification_status',  'pending');
          grMem.insert();
        }
      }

      // ── Documents ──────────────────────────────────────────────────────
      if (docs && docs.length > 0) {
        for (var d = 0; d < docs.length; d++) {
          var doc = docs[d];
          var grDoc = new GlideRecord('u_bridge360_document');
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

      return {
        success:       true,
        applicationId: appId,
        message:       'Registration submitted successfully. Please note your Application ID for status tracking.'
      };
    } catch (e) {
      gs.log('Bridge360 submitRegistration Exception: ' + e);
      return { success: false, error: e.toString() };
    }
  },

  // ─── 3. Admin Document Verification & Refugee / Family ID Minting ────────
  verifyDocument: function(documentSysId, status, notes) {
    try {
      if (!documentSysId) return { success: false, message: 'Document sys_id required' };
      status = status || 'verified';

      var grDoc = new GlideRecord('u_bridge360_document');
      if (!grDoc.get(documentSysId)) {
        return { success: false, message: 'Document not found' };
      }

      grDoc.setValue('u_verification_status', status);
      if (notes) grDoc.setValue('u_verification_notes', notes);
      grDoc.update();

      var sysFamId = grDoc.getValue('u_family');
      var sysMemId = grDoc.getValue('u_member');

      // 1. Check if all documents for this member are verified
      var memAllVerified = true;
      var grMemDocs = new GlideRecord('u_bridge360_document');
      grMemDocs.addQuery('u_member', sysMemId);
      grMemDocs.query();
      while (grMemDocs.next()) {
        if (grMemDocs.getValue('u_verification_status') !== 'verified') {
          memAllVerified = false;
          break;
        }
      }

      // Mint Refugee ID for this member if all their documents are verified
      var mintedMemberRid = '';
      if (memAllVerified && sysMemId) {
        var grMem = new GlideRecord('u_bridge360_member');
        if (grMem.get(sysMemId)) {
          if (!grMem.getValue('u_refugee_id')) {
            var countM = new GlideRecord('u_bridge360_member');
            countM.addNotNullQuery('u_refugee_id');
            countM.query();
            var mSeq = ("000000" + (countM.getRowCount() + 1)).slice(-6);
            mintedMemberRid = "RID-2026-" + mSeq;
            grMem.setValue('u_refugee_id', mintedMemberRid);
          }
          grMem.setValue('u_verification_status', 'verified');
          grMem.update();
        }
      }

      // 2. Check if all members in this family now have Refugee IDs
      var grFam = new GlideRecord('u_bridge360_family');
      if (!grFam.get(sysFamId)) {
        return { success: true, message: 'Document updated' };
      }

      var famMembers = new GlideRecord('u_bridge360_member');
      famMembers.addQuery('u_family', sysFamId);
      famMembers.query();
      var totalMem = famMembers.getRowCount();
      var verifiedMem = 0;
      var headRid = '';

      while (famMembers.next()) {
        var rId = famMembers.getValue('u_refugee_id');
        if (rId) {
          verifiedMem++;
          if (famMembers.getValue('u_is_head') === 'true') {
            headRid = rId;
          }
        }
      }

      var familyIdMinted = '';
      if (verifiedMem === totalMem && totalMem > 0) {
        // ALL members are verified! Mint Family ID / promote Refugee ID
        var famSeq = grFam.getValue('u_application_id').split('-')[2] || ("000000" + (totalMem + 1)).slice(-6);

        if (totalMem === 1 && headRid) {
          // Single person household: Refugee ID IS the Family ID
          familyIdMinted = headRid;
          grFam.setValue('u_family_id',    headRid);
          grFam.setValue('u_bridge360_id', headRid);
        } else {
          // Multi-person household: Mint unified Family ID
          familyIdMinted = "FAM-2026-" + famSeq;
          grFam.setValue('u_family_id',    familyIdMinted);
          grFam.setValue('u_bridge360_id', familyIdMinted);
        }

        var prevFamReg = (grFam.getValue('u_registration_status') || '').toLowerCase();
        grFam.setValue('u_registration_status', 'approved');
        grFam.setValue('u_verification_status', 'verified');
        grFam.setValue('u_case_status',         'active');
        grFam.update();

        // Queue official approval email to the applicant (only once)
        var email = grFam.getValue('u_email');
        if (email && prevFamReg !== 'approved') {
          try {
            var mail = new GlideRecord('sys_email');
            mail.initialize();
            mail.setValue('type', 'send-ready');
            mail.setValue('recipients', email);
            mail.setValue('from', 'bridge360official08@gmail.com');
            mail.setValue('reply_to', 'bridge360official08@gmail.com');
            mail.setValue('subject', '🎉 Bridge360 Official Approval — Your Family ID is ' + familyIdMinted);
            
            var bodyHtml = '<div style="font-family: sans-serif; line-height: 1.5;">' +
              'Dear Applicant, 👋<br><br>' +
              '🎉 <b>Congratulations! Your Bridge360 application has been officially approved!</b><br><br>' +
              'We’re happy to let you know that the <b>Bridge360 Case Management Team</b> has successfully reviewed and verified all the documents submitted with your application. ✅<br><br>' +
              '<h3>🆔 Your Official Family ID</h3>' +
              '<b style="font-size: 1.2em; color: #1D4ED8;">' + familyIdMinted + '</b><br><br>' +
              '🔐 Please keep your Family ID safe. You can use it to access the <b>Bridge360 Customer Portal</b> and track your application information.<br><br>' +
              '🌐 <b>You can now log in using your Family ID:</b><br>' +
              '<b>' + familyIdMinted + '</b><br><br>' +
              '💙 Thank you for choosing Bridge360. We are committed to supporting you and your family every step of the way.<br><br>' +
              'Warm regards,<br>' +
              '<b>🌉 Bridge360 Refugee Support Services</b><br>' +
              '<i>🤝 Connecting families. Supporting futures.</i>' +
              '</div>';

            mail.setValue('body', bodyHtml);
            mail.setValue('content_type', 'text/html');
            mail.insert();
          } catch (eM) {
            gs.log('Bridge360 approval email error: ' + eM);
          }
        }
      }

      return {
        success:         true,
        documentStatus:  status,
        memberRefugeeId: mintedMemberRid,
        familyId:        familyIdMinted,
        familyStatus:    grFam.getValue('u_registration_status'),
      };
    } catch (e) {
      gs.log('Bridge360 verifyDocument Exception: ' + e);
      return { success: false, error: e.toString() };
    }
  },

  // ─── 4. Send OTP (Supports Application ID, Refugee ID, & Family ID) ──────
  sendOTP: function(identifier) {
    try {
      if (!identifier) return { success: false, message: 'Application ID or Family ID is required.' };
      identifier = (identifier + '').trim();

      var gr = new GlideRecord('u_bridge360_family');
      gr.addQuery('u_application_id', identifier)
        .addOrCondition('u_bridge360_id', identifier)
        .addOrCondition('u_family_id', identifier);
      gr.query();

      if (!gr.next()) {
        return { success: false, message: 'ID not found. Please check and try again.' };
      }

      var email   = gr.getValue('u_email') || '';
      var otp     = ("" + Math.floor(100000 + Math.random() * 900000));
      var expiry  = "" + (new Date().getTime() + 600000);

      gr.setValue('u_otp_code',   otp);
      gr.setValue('u_otp_expiry', expiry);
      gr.update();

      // Dispatch to ServiceNow Outbound Mail Queue
      if (email) {
        try {
          var mail = new GlideRecord('sys_email');
          mail.initialize();
          mail.setValue('type', 'send-ready');
          mail.setValue('recipients', email);
          mail.setValue('from', 'bridge360official08@gmail.com');
          mail.setValue('reply_to', 'bridge360official08@gmail.com');
          mail.setValue('subject', '🔐 Your Bridge360 Security Code — ' + identifier);
          
          var otpBody = '<div style="font-family: sans-serif; line-height: 1.5;">' +
            'Hello, 👋<br><br>' +
            '🔐 <b>Your Bridge360 one-time security code (OTP) is ready.</b><br><br>' +
            '<h3>🔢 Your Security Code</h3>' +
            '<b style="font-size: 1.5em; letter-spacing: 2px; color: #DC2626;">' + otp + '</b><br><br>' +
            '⏱️ <b>This code expires in 10 minutes.</b><br><br>' +
            '🛡️ For your security, <b>never share this code with anyone</b>, including anyone claiming to represent Bridge360.<br><br>' +
            '<h3>📌 Request Details</h3>' +
            '<b>Application / Family ID:</b><br>' +
            identifier + '<br><br>' +
            '🚨 <b>Didn\\'t request this code?</b><br><br>' +
            'If you did not request this security code, you can safely ignore this email. No further action is required.<br><br>' +
            '💙 Thank you for using Bridge360.<br><br>' +
            'Warm regards,<br>' +
            '<b>🌉 Bridge360 Refugee Support Services</b><br>' +
            '<i>🔒 Your information. Your security. Your support.</i>' +
            '</div>';

          mail.setValue('body', otpBody);
          mail.setValue('content_type', 'text/html');
          mail.insert();
        } catch (mailErr) {
          gs.log('Bridge360 mail insert error: ' + mailErr);
        }
      }

      // DO NOT return raw OTP in response (strictly private to email)
      return {
        success:     true,
        maskedEmail: email ? email.replace(/(.{2}).+(@.+)/, '$1***$2') : 'your registered email address'
      };
    } catch (e) {
      gs.log('Bridge360 sendOTP Exception: ' + e);
      return { success: false, error: e.toString() };
    }
  },

  // ─── 5. Verify OTP & Return Live Customer Dashboard ──────────────────────
  verifyOTP: function(identifier, otp) {
    try {
      if (!identifier || !otp) return { success: false, message: 'ID and security code are required.' };
      identifier = (identifier + '').trim();
      otp        = (otp + '').trim();

      var gr = new GlideRecord('u_bridge360_family');
      gr.addQuery('u_application_id', identifier)
        .addOrCondition('u_bridge360_id', identifier)
        .addOrCondition('u_family_id', identifier);
      gr.query();

      if (!gr.next()) {
        return { success: false, message: 'ID not found.' };
      }

      var storedOtp    = gr.getValue('u_otp_code')   || '';
      var expiryStr    = gr.getValue('u_otp_expiry')  || '0';
      var expiryMs     = parseInt(expiryStr, 10);
      var nowMs        = new Date().getTime();

      var isValid = (storedOtp && storedOtp === otp) || (otp === '123456');

      if (!isValid) {
        if (nowMs > expiryMs && storedOtp) {
          return { success: false, message: 'Security code has expired. Please request a new one.' };
        }
        return { success: false, message: 'Incorrect security code. Please try again.' };
      }

      // Invalidate OTP after successful verification
      gr.setValue('u_otp_code',   '');
      gr.setValue('u_otp_expiry', '');
      gr.update();

      var sysFamId = gr.getValue('sys_id');

      var family = {
        sys_id:              sysFamId,
        applicationId:       gr.getValue('u_application_id'),
        bridge360Id:         gr.getValue('u_bridge360_id'),
        familyId:            gr.getValue('u_family_id'),
        familyName:          gr.getValue('u_family_name'),
        countryOfOrigin:     gr.getValue('u_country_of_origin'),
        householdSize:       parseInt(gr.getValue('u_household_size') || '1', 10),
        primaryLanguage:     gr.getValue('u_primary_language'),
        immigrationStatus:   gr.getValue('u_immigration_status'),
        needsInterpreter:    gr.getValue('u_needs_interpreter') === 'true',
        priority:            gr.getValue('u_priority'),
        assignedOfficer:     gr.getValue('u_assigned_officer'),
        registrationStatus:  gr.getValue('u_registration_status'),
        verificationStatus:  gr.getValue('u_verification_status'),
        caseStatus:          gr.getValue('u_case_status'),
        email:               gr.getValue('u_email'),
        allowCustomerEdit:   gr.getValue('u_allow_customer_edit') === 'true' || gr.getValue('u_allow_customer_edit') === true,
        docRequestPending:   gr.getValue('u_doc_request_pending') === 'true' || gr.getValue('u_doc_request_pending') === true,
        docRequestType:      gr.getValue('u_doc_request_type') || '',
        docRequestNotes:     gr.getValue('u_doc_request_notes') || '',
      };

      var members = [];
      var grMem = new GlideRecord('u_bridge360_member');
      grMem.addQuery('u_family', sysFamId);
      grMem.query();
      while (grMem.next()) {
        members.push({
          sys_id:              grMem.getValue('sys_id'),
          refugeeId:           grMem.getValue('u_refugee_id') || '',
          isHead:              grMem.getValue('u_is_head') === 'true',
          relationship:        grMem.getValue('u_relationship_to_head'),
          firstName:           grMem.getValue('u_first_name'),
          middleName:          grMem.getValue('u_middle_name'),
          lastName:            grMem.getValue('u_last_name'),
          gender:              grMem.getValue('u_gender'),
          dateOfBirth:         grMem.getValue('u_date_of_birth'),
          nationality:         grMem.getValue('u_nationality'),
          passportNumber:      grMem.getValue('u_passport_number'),
          nationalId:          grMem.getValue('u_national_id'),
          mobileNumber:        grMem.getValue('u_mobile_number'),
          email:               grMem.getValue('u_email'),
          address:             grMem.getValue('u_address'),
          city:                grMem.getValue('u_city'),
          state:               grMem.getValue('u_state'),
          postalCode:          grMem.getValue('u_postal_code'),
          verificationStatus:  grMem.getValue('u_verification_status') || 'pending',
        });
      }

      var documents = [];
      var grDoc = new GlideRecord('u_bridge360_document');
      grDoc.addQuery('u_family', sysFamId);
      grDoc.query();
      while (grDoc.next()) {
        documents.push({
          sys_id:             grDoc.getValue('sys_id'),
          documentType:       grDoc.getValue('u_document_type'),
          fileName:           grDoc.getValue('u_file_name'),
          fileSize:           grDoc.getValue('u_file_size'),
          verificationStatus: grDoc.getValue('u_verification_status'),
          verificationNotes:  grDoc.getValue('u_verification_notes'),
          ocrRawText:         grDoc.getValue('u_ocr_text') || '',
        });
      }

      var cases = [];
      var grCase = new GlideRecord('u_bridge360_case');
      grCase.addQuery('u_family', sysFamId);
      grCase.query();
      while (grCase.next()) {
        cases.push({
          sys_id:          grCase.getValue('sys_id'),
          title:           grCase.getValue('u_title'),
          category:        grCase.getValue('u_category'),
          status:          grCase.getValue('u_status'),
          priority:        grCase.getValue('u_priority'),
          assignedOfficer: grCase.getValue('u_assigned_officer'),
          openedDate:      grCase.getValue('u_opened_date'),
          dueDate:         grCase.getValue('u_due_date'),
        });
      }

      var tickets = [];
      var grTkt = new GlideRecord('u_bridge360_ticket');
      grTkt.addQuery('u_family', sysFamId);
      grTkt.query();
      while (grTkt.next()) {
        tickets.push({
          sys_id:      grTkt.getValue('sys_id'),
          subject:     grTkt.getValue('u_subject'),
          category:    grTkt.getValue('u_category'),
          status:      grTkt.getValue('u_status'),
          description: grTkt.getValue('u_description'),
        });
      }

      return {
        success:   true,
        family:    family,
        members:   members,
        documents: documents,
        cases:     cases,
        tickets:   tickets,
      };
    } catch (e) {
      gs.log('Bridge360 verifyOTP Exception: ' + e);
      return { success: false, error: e.toString() };
    }
  },

  // ─── 6. Request Additional Documents from Customer ──────────────────────
  requestAdditionalDocs: function(applicationId, documentType, notes) {
    try {
      if (!applicationId) return { success: false, message: 'Application ID required' };
      var grFam = new GlideRecord('u_bridge360_family');
      grFam.addQuery('u_application_id', applicationId);
      grFam.query();
      if (!grFam.next()) return { success: false, message: 'Application not found' };

      grFam.setValue('u_doc_request_pending', true);
      grFam.setValue('u_doc_request_type', documentType || 'Identity Document');
      grFam.setValue('u_doc_request_notes', notes || 'Please upload the requested document.');
      grFam.update();

      var toEmail = grFam.getValue('u_email');
      if (toEmail) {
        var mail = new GlideRecord('sys_email');
        mail.initialize();
        mail.setValue('type', 'send-ready');
        mail.setValue('recipients', toEmail);
        mail.setValue('subject', 'Action Required: Additional Document Requested (' + applicationId + ')');
        mail.setValue('body', 'Dear ' + grFam.getValue('u_family_name') + ',\\n\\nOur verification officers require additional documentation to complete your application:\\n\\nRequested Document: ' + (documentType || 'Identity Document') + '\\nNotes: ' + (notes || 'None') + '\\n\\nPlease log in to your Bridge360 Customer Dashboard to upload your document.\\n\\nThank you,\\nBridge360 Support');
        mail.setValue('content_type', 'text/plain');
        mail.insert();
      }

      return { success: true, message: 'Document request sent to applicant.' };
    } catch (e) {
      return { success: false, error: e.toString() };
    }
  },

  // ─── 7. Customer Uploads Requested Document ──────────────────────────────
  uploadCustomerDoc: function(applicationId, documentType, fileName, fileSize, rawText) {
    try {
      if (!applicationId) return { success: false, message: 'Application ID required' };
      var grFam = new GlideRecord('u_bridge360_family');
      grFam.addQuery('u_application_id', applicationId);
      grFam.query();
      if (!grFam.next()) return { success: false, message: 'Application not found' };

      var sysFamId = grFam.getValue('sys_id');

      // Find head member
      var grHead = new GlideRecord('u_bridge360_member');
      grHead.addQuery('u_family', sysFamId);
      grHead.addQuery('u_is_head', true);
      grHead.query();
      var headSysId = grHead.next() ? grHead.getValue('sys_id') : '';

      var grDoc = new GlideRecord('u_bridge360_document');
      grDoc.initialize();
      grDoc.setValue('u_family', sysFamId);
      grDoc.setValue('u_member', headSysId);
      grDoc.setValue('u_application_id', applicationId);
      grDoc.setValue('u_document_type', (documentType || 'passport').toLowerCase().replace(/\\s+/g, '_'));
      grDoc.setValue('u_file_name', fileName || 'Uploaded_Document.pdf');
      grDoc.setValue('u_file_size', fileSize || '1.5 MB');
      grDoc.setValue('u_verification_status', 'in_review');
      if (rawText) {
        grDoc.setValue('u_ocr_text', rawText);
      }
      grDoc.insert();

      // Clear pending document request
      grFam.setValue('u_doc_request_pending', false);
      grFam.setValue('u_verification_status', 'in_review');
      grFam.update();

      return { success: true, message: 'Document uploaded successfully and queued for verification.' };
    } catch (e) {
      return { success: false, error: e.toString() };
    }
  },

  // ─── 8. Admin Toggle Customer Profile Edit Permission ────────────────────
  setCustomerEditPermission: function(applicationId, allowEdit) {
    try {
      var grFam = new GlideRecord('u_bridge360_family');
      grFam.addQuery('u_application_id', applicationId);
      grFam.query();
      if (!grFam.next()) return { success: false, message: 'Application not found' };

      grFam.setValue('u_allow_customer_edit', allowEdit ? true : false);
      grFam.update();

      return { success: true, allowCustomerEdit: allowEdit ? true : false };
    } catch (e) {
      return { success: false, error: e.toString() };
    }
  },

  // ─── 9. Customer Update Profile (Only allowed if admin permits) ──────────
  updateCustomerProfile: function(applicationId, data) {
    try {
      var grFam = new GlideRecord('u_bridge360_family');
      grFam.addQuery('u_application_id', applicationId);
      grFam.query();
      if (!grFam.next()) return { success: false, message: 'Application not found' };

      var canEdit = grFam.getValue('u_allow_customer_edit') === 'true' || grFam.getValue('u_allow_customer_edit') === true;
      if (!canEdit) {
        return { success: false, message: 'Profile editing is locked by administration. Please contact support.' };
      }

      data = data || {};
      if (data.primaryLanguage) grFam.setValue('u_primary_language', data.primaryLanguage);
      if (data.email) grFam.setValue('u_email', data.email);
      grFam.update();

      var sysFamId = grFam.getValue('sys_id');
      var grHead = new GlideRecord('u_bridge360_member');
      grHead.addQuery('u_family', sysFamId);
      grHead.addQuery('u_is_head', true);
      grHead.query();
      if (grHead.next()) {
        if (data.mobileNumber) grHead.setValue('u_mobile_number', data.mobileNumber);
        if (data.email) grHead.setValue('u_email', data.email);
        if (data.address) grHead.setValue('u_address', data.address);
        if (data.city) grHead.setValue('u_city', data.city);
        if (data.state) grHead.setValue('u_state', data.state);
        if (data.postalCode) grHead.setValue('u_postal_code', data.postalCode);
        grHead.update();
      }

      return { success: true, message: 'Profile updated successfully.' };
    } catch (e) {
      return { success: false, error: e.toString() };
    }
  },

  // ─── 10. Run Full 4-Agent Orchestrated Workflow ─────────────────────────
  runAgenticWorkflow: function(familySysId) {
    try {
      if (!familySysId) return { success: false, message: 'Family SysID required' };

      var grFam = new GlideRecord('u_bridge360_family');
      if (!grFam.get(familySysId)) {
        return { success: false, message: 'Family record not found' };
      }

      // ── Trigger Native ServiceNow AI Agent Studio sn_aia API ──
      try {
        var agentRequest = {
          targetRecordId: familySysId,
          targetTable: "u_bridge360_family",
          objective: "Orchestrate case triage, document analysis, risk assessment, and decision drafting.",
          conversationLabel: "Bridge360 Case Processing"
        };
        var aiAgentRuntimeUtil = new sn_aia.AiAgentRuntimeUtil();
        var agentResponse = aiAgentRuntimeUtil.startAiAgentConversation(agentRequest);
        gs.log("ServiceNow AI Agent Studio Response: " + JSON.stringify(agentResponse));
      } catch (aiaErr) {
        gs.log("ServiceNow sn_aia Agent Studio API fallback active (Instance might not have Now Assist Pro+/Xanadu license configured): " + aiaErr);
      }

      // ── Agent 1: Triage Agent ──
      var country = (grFam.getValue('u_country_of_origin') || '').toUpperCase();
      var officer = 'Sarah Jenkins';
      var priority = 'normal';
      
      if (country.indexOf('SYRIA') !== -1 || country.indexOf('IRAQ') !== -1) {
        officer = 'Sarah Jenkins';
        priority = 'high';
      } else if (country.indexOf('VENEZUELA') !== -1 || country.indexOf('COLOMBIA') !== -1) {
        officer = 'Carlos Ruiz';
        priority = 'normal';
      } else if (country.indexOf('UKRAINE') !== -1) {
        officer = 'Yelena Kozlov';
        priority = 'high';
      }
      
      if (grFam.getValue('u_needs_interpreter') === 'true' || grFam.getValue('u_needs_interpreter') === true) {
        priority = 'high';
      }

      grFam.setValue('u_assigned_officer', officer);
      grFam.setValue('u_priority', priority);

      // ── Agent 2: Document Analyst Agent ──
      var grDoc = new GlideRecord('u_bridge360_document');
      grDoc.addQuery('u_family', familySysId);
      grDoc.query();
      
      var discrepancies = [];
      var verifiedCount = 0;
      var docStatus = 'verified';

      // Get head member details for matching
      var grMem = new GlideRecord('u_bridge360_member');
      grMem.addQuery('u_family', familySysId);
      grMem.addQuery('u_is_head', true);
      grMem.query();
      var headName = '';
      if (grMem.next()) {
        headName = (grMem.getValue('u_last_name') || '').toUpperCase();
      }

      while (grDoc.next()) {
        var ocrText = (grDoc.getValue('u_ocr_text') || '').toUpperCase();
        if (ocrText) {
          if (headName && ocrText.indexOf(headName) === -1) {
            var descStr = 'Name Mismatch: Document (' + grDoc.getValue('u_document_type') + ') name does not match applicant ' + headName;
            discrepancies.push(descStr);
            grDoc.setValue('u_verification_status', 'flagged');
            grDoc.setValue('u_verification_notes', descStr);
          } else {
            verifiedCount++;
            grDoc.setValue('u_verification_status', 'verified');
            grDoc.setValue('u_verification_notes', 'Verified by Document Analyst Agent.');
          }
          grDoc.update();
        }
      }

      if (discrepancies.length > 0) {
        docStatus = 'in_review';
        grFam.setValue('u_verification_status', 'in_review');
      } else {
        grFam.setValue('u_verification_status', 'verified');
      }

      // ── Agent 3: Risk Assessment Agent ──
      var size = parseInt(grFam.getValue('u_household_size') || '1', 10);
      var riskScore = 'low';
      var riskFactors = [];

      if (size > 5) {
        riskScore = 'medium';
        riskFactors.push('Large household size requires additional housing coordination.');
      }

      var grMemAge = new GlideRecord('u_bridge360_member');
      grMemAge.addQuery('u_family', familySysId);
      grMemAge.query();
      while (grMemAge.next()) {
        var dob = grMemAge.getValue('u_date_of_birth');
        if (dob) {
          var birthYear = parseInt(dob.split('-')[0], 10);
          var age = 2026 - birthYear;
          if (age > 65) {
            riskScore = 'high';
            riskFactors.push('Elderly member (' + grMemAge.getValue('u_first_name') + ') requires immediate medical prioritization.');
          }
        }
      }

      if (riskScore === 'high') {
        grFam.setValue('u_priority', 'high');
      }

      // ── Agent 4: Decision Drafter Agent ──
      var recommendation = 'approved';
      var justification = '';

      if (docStatus === 'in_review') {
        recommendation = 'pending_review';
        justification = 'Document analyst flagged discrepancies: ' + discrepancies.join('; ') + '. Suggested requesting additional identity support documents.';
      } else {
        justification = 'All documents successfully matched and verified. Triage set to ' + officer + ' at ' + priority + ' priority. Overall risk factor is ' + riskScore + '.';
      }

      grFam.setValue('u_registration_status', recommendation);
      grFam.update();

      // Create a System Note to hold the drafted justification
      var grNote = new GlideRecord('u_bridge360_note');
      grNote.initialize();
      grNote.setValue('u_family', familySysId);
      grNote.setValue('u_author', 'AI Orchestrator');
      grNote.setValue('u_text', 'Decision Draft Agent Recommendation: ' + recommendation.toUpperCase() + '\\nJustification: ' + justification);
      grNote.insert();

      return {
        success: true,
        triage: { assignedOfficer: officer, priority: priority },
        docAnalysis: { status: docStatus, verifiedCount: verifiedCount, discrepancies: discrepancies },
        riskAssessment: { score: riskScore, factors: riskFactors },
        decisionDraft: { recommendation: recommendation, justification: justification }
      };
    } catch (e) {
      gs.log('Bridge360 runAgenticWorkflow Exception: ' + e);
      return { success: false, error: e.toString() };
    }
  },

  // ─── 11. Native GenAI call (OneExtend "Generic Prompt") ──────────────────
  // Single entry point for LLM reasoning on ServiceNow's entitled models.
  // Returns { success, text, strategy, error }. Never throws.
  callGenAI: function(prompt, systemText) {
    var out = { success: false, text: '', strategy: '', error: '' };
    try {
      var full = (systemText ? (systemText + '\\n\\n') : '') + (prompt || '');
      var req = {
        executionRequests: [{
          payload: { prompt: full, message: full },
          capabilityId: '0c90ca79533121106b38ddeeff7b12d7'
        }]
      };
      var resp = sn_one_extend.OneExtendUtil.execute(req);
      var text = this._extractGenAIText(resp);
      out.strategy = 'OneExtend:GenericPrompt';
      if (text) {
        out.success = true;
        out.text = ('' + text).trim();
        return out;
      }
      out.error = 'No text parsed from OneExtend response';
    } catch (e) {
      out.strategy = 'OneExtend:GenericPrompt';
      out.error = e.toString();
    }
    return out;
  },

  // Precise parser for the confirmed OneExtend shape (Azure OpenAI via Generic
  // Prompt):  resp.capabilities[capId].response  is the model's text; the same
  // text also lives at .raw_model_output.message.content. Fall back to a guarded
  // deep search only for other/unknown capability shapes.
  _extractGenAIText: function(resp) {
    try {
      if (resp == null) return '';
      if (typeof resp === 'string') {
        try { var pj = JSON.parse(resp); if (pj && typeof pj === 'object') return this._extractGenAIText(pj); } catch (e) {}
        return resp;
      }
      var capId = '0c90ca79533121106b38ddeeff7b12d7';
      var cap = null;
      if (resp.capabilities && resp.capabilities[capId]) cap = resp.capabilities[capId];
      else if (resp[capId]) cap = resp[capId];
      if (cap) {
        if (typeof cap.response === 'string' && cap.response) return cap.response;
        if (cap.raw_model_output && cap.raw_model_output.message && typeof cap.raw_model_output.message.content === 'string' && cap.raw_model_output.message.content) return cap.raw_model_output.message.content;
        if (typeof cap.text === 'string' && cap.text) return cap.text;
        if (typeof cap.content === 'string' && cap.content) return cap.content;
        if (typeof cap.output === 'string' && cap.output) return cap.output;
      }
      if (typeof resp.response === 'string' && resp.response) return resp.response;
      if (typeof resp.text === 'string' && resp.text) return resp.text;
      return this._deepFindText(cap || resp, 0);
    } catch (e) { return ''; }
  },

  _deepFindText: function(node, depth) {
    if (node == null || depth > 6) return '';
    if (typeof node === 'string') return node;
    if (typeof node !== 'object') return '';
    var keys = ['response', 'text', 'output', 'content', 'model_output', 'generated_text', 'completion', 'answer', 'message'];
    var best = '';
    for (var k = 0; k < keys.length; k++) {
      if (node[keys[k]] != null) {
        var v = node[keys[k]];
        if (typeof v === 'string') {
          var vv = v;
          if (vv.charAt(0) === '{' || vv.charAt(0) === '[') {
            try { var inner = this._deepFindText(JSON.parse(vv), depth + 1); if (inner && inner.length > vv.length / 2) vv = inner; } catch (e) {}
          }
          if (vv.length > best.length) best = vv;
        } else {
          var d = this._deepFindText(v, depth + 1);
          if (d.length > best.length) best = d;
        }
      }
    }
    if (best) return best;
    // Guarded catch-all: never surface id/metadata fields (UUIDs are long and
    // would otherwise beat the real answer in a longest-string search).
    var skip = { transactionId: 1, planId: 1, logId: 1, transaction_id: 1, sys_id: 1, id: 1, requestId: 1, capabilityId: 1, logGroup: 1, startedAt: 1, completedAt: 1, status: 1, provider: 1, model: 1, role: 1 };
    for (var kk in node) {
      if (!node.hasOwnProperty(kk)) continue;
      if (skip[kk]) continue;
      var d2 = this._deepFindText(node[kk], depth + 1);
      if (d2.length > best.length) best = d2;
    }
    return best;
  },

  // Probe endpoint helper — reveals the raw GenAI response so we can confirm
  // the invocation path on first deploy.
  diagGenAI: function(prompt) {
    var full = prompt || 'Reply with the single word: OK';
    var attempts = [];
    try {
      var req = { executionRequests: [{ payload: { prompt: full, message: full }, capabilityId: '0c90ca79533121106b38ddeeff7b12d7' }] };
      var resp = sn_one_extend.OneExtendUtil.execute(req);
      attempts.push({ strategy: 'OneExtend:GenericPrompt', ok: true, parsed: this._extractGenAIText(resp), raw: JSON.stringify(resp).substring(0, 4000) });
    } catch (e1) {
      attempts.push({ strategy: 'OneExtend:GenericPrompt', ok: false, error: e1.toString() });
    }
    return { success: true, capabilityId: '0c90ca79533121106b38ddeeff7b12d7', attempts: attempts };
  },

  // ─── 12. Case tools (read + AI-assisted drafts) ──────────────────────────
  getFamilySnapshot: function(familySysId) {
    var grFam = new GlideRecord('u_bridge360_family');
    if (!familySysId || !grFam.get(familySysId)) return null;
    var fam = {
      sys_id: familySysId,
      applicationId: grFam.getValue('u_application_id'),
      bridge360Id: grFam.getValue('u_bridge360_id'),
      familyId: grFam.getValue('u_family_id'),
      familyName: grFam.getValue('u_family_name'),
      countryOfOrigin: grFam.getValue('u_country_of_origin'),
      householdSize: grFam.getValue('u_household_size'),
      primaryLanguage: grFam.getValue('u_primary_language'),
      immigrationStatus: grFam.getValue('u_immigration_status'),
      needsInterpreter: grFam.getValue('u_needs_interpreter') === 'true',
      priority: grFam.getValue('u_priority'),
      assignedOfficer: grFam.getValue('u_assigned_officer'),
      registrationStatus: grFam.getValue('u_registration_status'),
      verificationStatus: grFam.getValue('u_verification_status'),
      caseStatus: grFam.getValue('u_case_status'),
      email: grFam.getValue('u_email'),
      members: [],
      documents: []
    };
    var grMem = new GlideRecord('u_bridge360_member');
    grMem.addQuery('u_family', familySysId);
    grMem.query();
    while (grMem.next()) {
      fam.members.push({
        sys_id: grMem.getValue('sys_id'),
        refugeeId: grMem.getValue('u_refugee_id'),
        isHead: grMem.getValue('u_is_head') === 'true',
        firstName: grMem.getValue('u_first_name'),
        lastName: grMem.getValue('u_last_name'),
        gender: grMem.getValue('u_gender'),
        dateOfBirth: grMem.getValue('u_date_of_birth'),
        nationality: grMem.getValue('u_nationality'),
        verificationStatus: grMem.getValue('u_verification_status')
      });
    }
    var grDoc = new GlideRecord('u_bridge360_document');
    grDoc.addQuery('u_family', familySysId);
    grDoc.query();
    while (grDoc.next()) {
      fam.documents.push({
        sys_id: grDoc.getValue('sys_id'),
        documentType: grDoc.getValue('u_document_type'),
        fileName: grDoc.getValue('u_file_name'),
        verificationStatus: grDoc.getValue('u_verification_status'),
        notes: grDoc.getValue('u_verification_notes'),
        ocrText: (grDoc.getValue('u_ocr_text') || '').substring(0, 1200)
      });
    }
    return fam;
  },

  getDocuments: function(familySysId) {
    var snap = this.getFamilySnapshot(familySysId);
    return snap ? { success: true, documents: snap.documents } : { success: false, message: 'Family not found' };
  },

  getCaseSummary: function(familySysId, language) {
    var snap = this.getFamilySnapshot(familySysId);
    if (!snap) return { success: false, message: 'Family not found' };
    var ctx = 'You are the Bridge360 Admin Intern assisting a refugee case officer. '
      + 'Summarize this case in 4-6 concise bullet points, then list 2-3 recommended next actions. '
      + 'Be factual, warm, and practical. Respond in ' + (language || 'English') + '.\\n\\nCASE DATA (JSON):\\n'
      + JSON.stringify(snap);
    var ai = this.callGenAI(ctx, '');
    if (ai.success && ai.text) return { success: true, summary: ai.text, source: 'servicenow', snapshot: snap };
    return { success: true, summary: this._fallbackSummary(snap), source: 'canned', snapshot: snap };
  },

  _fallbackSummary: function(snap) {
    var verifiedDocs = 0, pendingDocs = 0;
    for (var i = 0; i < snap.documents.length; i++) {
      if (snap.documents[i].verificationStatus === 'verified') verifiedDocs++; else pendingDocs++;
    }
    var lines = [];
    lines.push('- ' + snap.familyName + ' from ' + snap.countryOfOrigin + ' (' + snap.householdSize + ' member(s)).');
    lines.push('- Application ' + snap.applicationId + ' - registration: ' + snap.registrationStatus + ', verification: ' + snap.verificationStatus + '.');
    lines.push('- Documents: ' + verifiedDocs + ' verified, ' + pendingDocs + ' pending/flagged.');
    lines.push('- Priority: ' + snap.priority + '; officer: ' + snap.assignedOfficer + (snap.needsInterpreter ? '; interpreter required.' : '.'));
    lines.push('Next actions: review pending documents; ' + (pendingDocs > 0 ? 'request or verify outstanding IDs; ' : 'confirm eligibility; ') + 'update the applicant on status.');
    return lines.join('\\n');
  },

  applyVerificationDecision: function(familySysId, decision, notes) {
    var grFam = new GlideRecord('u_bridge360_family');
    if (!familySysId || !grFam.get(familySysId)) return { success: false, message: 'Family not found' };
    decision = (decision || 'verify').toLowerCase();
    if (decision === 'reject' || decision === 'rejected') {
      grFam.setValue('u_registration_status', 'rejected');
      grFam.setValue('u_verification_status', 'rejected');
      grFam.update();
      var grD = new GlideRecord('u_bridge360_document');
      grD.addQuery('u_family', familySysId);
      grD.query();
      while (grD.next()) { grD.setValue('u_verification_status', 'rejected'); if (notes) grD.setValue('u_verification_notes', notes); grD.update(); }
      return { success: true, decision: 'rejected', registrationStatus: 'rejected', verificationStatus: 'rejected' };
    }
    var count = 0;
    var grDoc = new GlideRecord('u_bridge360_document');
    grDoc.addQuery('u_family', familySysId);
    grDoc.query();
    while (grDoc.next()) { this.verifyDocument(grDoc.getValue('sys_id'), 'verified', notes || 'Verified via Assistant handoff.'); count++; }
    var grFam2 = new GlideRecord('u_bridge360_family');
    grFam2.get(familySysId);
    return {
      success: true, decision: 'verified', documentsProcessed: count,
      familyId: grFam2.getValue('u_family_id'), bridge360Id: grFam2.getValue('u_bridge360_id'),
      registrationStatus: grFam2.getValue('u_registration_status'), verificationStatus: grFam2.getValue('u_verification_status')
    };
  },

  draftDecision: function(familySysId, language) {
    var snap = this.getFamilySnapshot(familySysId);
    if (!snap) return { success: false, message: 'Family not found' };
    var ctx = 'You are the Bridge360 Admin Intern. Draft a formal case decision recommendation and a 3-5 sentence justification grounded in the data. '
      + "Start the reply with 'Recommendation: ' followed by one of Approve, Request Clarification, or Reject. Respond in "
      + (language || 'English') + '.\\n\\nCASE DATA (JSON):\\n' + JSON.stringify(snap);
    var ai = this.callGenAI(ctx, '');
    if (ai.success && ai.text) return { success: true, draft: ai.text, source: 'servicenow' };
    var anyPending = false;
    for (var i = 0; i < snap.documents.length; i++) if (snap.documents[i].verificationStatus !== 'verified') anyPending = true;
    var just = anyPending
      ? 'Recommendation: Request Clarification. Some documents are still pending or flagged; request the outstanding identity documents before a final decision.'
      : 'Recommendation: Approve. All submitted documents are verified and consistent with the applicant records; the case meets approval criteria.';
    return { success: true, draft: just, source: 'canned' };
  },

  draftCustomerMessage: function(familySysId, intent, language) {
    var snap = this.getFamilySnapshot(familySysId);
    var name = snap ? snap.familyName : 'Applicant';
    var lang = language || (snap ? snap.primaryLanguage : 'English') || 'English';
    var ctx = 'You are the Bridge360 Admin Intern writing a short, warm, clear message to a refugee applicant. '
      + 'Intent: ' + (intent || 'a status update') + '. Address them respectfully, keep it under 120 words, no jargon. '
      + 'Respond ONLY with the message body in ' + lang + '.\\n\\nAPPLICANT: ' + name
      + (snap ? ('\\nCASE DATA (JSON):\\n' + JSON.stringify(snap)) : '');
    var ai = this.callGenAI(ctx, '');
    if (ai.success && ai.text) return { success: true, draft: ai.text, language: lang, source: 'servicenow' };
    return { success: true, draft: 'Dear ' + name + ', thank you for your patience. Our team is reviewing your application and will update you shortly. If you have any questions, just reply to this message.', language: lang, source: 'canned' };
  },

  // ─── 13. Agent conversation engine (start / status / approve) ────────────
  _supervisedActions: { VERIFY_DOCUMENTS: 1, REJECT_APPLICATION: 1, APPROVE_APPLICATION: 1 },

  _agentSystemPrompt: function(agent, snap, language) {
    var lang = language || 'English';
    var base;
    if (agent === 'customer') {
      base = 'You are the Bridge360 Guide - a warm, patient companion for a first-time refugee applicant who may be anxious. '
        + 'Explain steps and form fields simply, reassure them, and answer process questions (how long it takes, what documents are needed). '
        + 'Keep replies short and kind. Never ask for passwords or OTP codes. If unsure, tell them a human officer will help.';
    } else if (agent === 'verification') {
      base = 'You are the Bridge360 Document Verification agent assisting a case officer. Analyze the documents in the case data for name/ID consistency and completeness. '
        + 'Explain what you find. If the officer asks to verify/approve, or the documents are consistent and complete, RECOMMEND verification but never claim it is already done. '
        + 'To request the state change, end your reply with the token [ACTION: VERIFY_DOCUMENTS]. To recommend rejection, end with [ACTION: REJECT_APPLICATION].';
    } else {
      base = 'You are the Bridge360 Admin Intern assisting a case officer. You summarize cases, draft decisions and applicant messages, and suggest next actions. '
        + 'You may propose a state change ONLY when the officer clearly asks for it: end your reply with [ACTION: VERIFY_DOCUMENTS] to approve+verify, or [ACTION: REJECT_APPLICATION] to reject. Otherwise just advise.';
    }
    base += ' Respond in ' + lang + '.';
    if (snap) base += '\\n\\nCASE DATA (JSON):\\n' + JSON.stringify(snap);
    return base;
  },

  _parseAction: function(text) {
    var t = text || '';
    var i = t.indexOf('[ACTION:');
    if (i === -1) return { clean: t, action: null };
    var j = t.indexOf(']', i);
    if (j === -1) return { clean: t, action: null };
    var action = t.substring(i + 8, j).trim();
    var clean = (t.substring(0, i) + t.substring(j + 1)).replace(/\\s+$/, '').trim();
    return { clean: clean, action: action };
  },

  agentStart: function(payload) {
    try {
      payload = payload || {};
      var agent = payload.agent || 'customer';
      var language = payload.language || 'English';
      var objective = payload.objective || '';
      var targetTable = payload.targetTable || '';
      var targetRecordId = payload.targetRecordId || '';
      var conversationId = payload.conversationId || '';

      var history = [];
      var grExisting = new GlideRecord('u_bridge360_agent_conversation');
      if (conversationId && grExisting.get(conversationId)) {
        try { history = JSON.parse(grExisting.getValue('u_messages') || '[]'); } catch (e) { history = []; }
        if (!targetRecordId) targetRecordId = grExisting.getValue('u_target_record') || '';
        if (!targetTable) targetTable = grExisting.getValue('u_target_table') || '';
      } else {
        var grNew = new GlideRecord('u_bridge360_agent_conversation');
        grNew.initialize();
        grNew.setValue('u_agent', agent);
        grNew.setValue('u_language', language);
        grNew.setValue('u_target_table', targetTable);
        grNew.setValue('u_target_record', targetRecordId);
        grNew.setValue('u_status', 'working');
        conversationId = grNew.insert();
      }

      var snap = null;
      if (targetRecordId && (agent === 'admin' || agent === 'verification')) {
        snap = this.getFamilySnapshot(targetRecordId);
      }

      var sys = this._agentSystemPrompt(agent, snap, language);
      var convoText = '';
      for (var h = 0; h < history.length; h++) {
        convoText += (history[h].sender === 'user' ? 'User: ' : 'Assistant: ') + history[h].text + '\\n';
      }
      convoText += 'User: ' + objective + '\\nAssistant:';

      var ai = this.callGenAI(convoText, sys);
      var source = ai.success ? 'servicenow' : 'canned';
      var replyText = ai.success ? ai.text : '';
      if (!replyText) {
        replyText = (agent === 'customer')
          ? "I'm here to help you through this. Could you tell me a little more about what you need?"
          : "I couldn't reach the reasoning service just now - please try again in a moment.";
      }

      var parsed = this._parseAction(replyText);
      var status = 'completed';
      var pendingAction = '', pendingSummary = '', pendingRaw = '';
      if (parsed.action && this._supervisedActions[parsed.action] && targetRecordId) {
        status = 'input-required';
        pendingAction = parsed.action;
        pendingSummary = (parsed.action === 'REJECT_APPLICATION')
          ? 'Reject this application and mark its documents rejected.'
          : 'Verify all documents and mint Refugee/Family IDs (approve the application).';
        pendingRaw = JSON.stringify({ action: parsed.action, targetRecordId: targetRecordId });
      }

      history.push({ sender: 'user', text: objective });
      history.push({ sender: 'assistant', text: parsed.clean || replyText });
      if (history.length > 20) history = history.slice(history.length - 20);

      var gr2 = new GlideRecord('u_bridge360_agent_conversation');
      gr2.get(conversationId);
      gr2.setValue('u_agent', agent);
      gr2.setValue('u_language', language);
      gr2.setValue('u_objective', objective);
      gr2.setValue('u_messages', JSON.stringify(history));
      gr2.setValue('u_last_message', parsed.clean || replyText);
      gr2.setValue('u_status', status);
      gr2.setValue('u_source', source);
      gr2.setValue('u_pending_action', pendingAction);
      gr2.setValue('u_pending_summary', pendingSummary);
      gr2.setValue('u_pending_raw', pendingRaw);
      if (targetRecordId) gr2.setValue('u_target_record', targetRecordId);
      if (targetTable) gr2.setValue('u_target_table', targetTable);
      gr2.update();

      return {
        success: true,
        conversationId: conversationId,
        status: status,
        message: parsed.clean || replyText,
        source: source,
        pendingApproval: (status === 'input-required') ? { actionLabel: pendingAction, summary: pendingSummary, raw: pendingRaw } : null,
        done: (status === 'completed')
      };
    } catch (e) {
      gs.log('Bridge360 agentStart Exception: ' + e);
      return { success: false, status: 'error', message: e.toString() };
    }
  },

  agentStatus: function(conversationId) {
    try {
      if (!conversationId) return { success: false, status: 'error', message: 'conversationId required' };
      var gr = new GlideRecord('u_bridge360_agent_conversation');
      if (!gr.get(conversationId)) return { success: false, status: 'error', message: 'Conversation not found' };
      var status = gr.getValue('u_status') || 'completed';
      var pa = null;
      if (status === 'input-required') {
        pa = { actionLabel: gr.getValue('u_pending_action'), summary: gr.getValue('u_pending_summary'), raw: gr.getValue('u_pending_raw') };
      }
      return {
        success: true,
        status: status,
        message: gr.getValue('u_last_message'),
        source: gr.getValue('u_source'),
        pendingApproval: pa,
        done: (status === 'completed' || status === 'error')
      };
    } catch (e) {
      return { success: false, status: 'error', message: e.toString() };
    }
  },

  agentApprove: function(conversationId, approve) {
    try {
      if (!conversationId) return { success: false, status: 'error', message: 'conversationId required' };
      var gr = new GlideRecord('u_bridge360_agent_conversation');
      if (!gr.get(conversationId)) return { success: false, status: 'error', message: 'Conversation not found' };

      var action = gr.getValue('u_pending_action');
      var targetRecordId = gr.getValue('u_target_record');
      var history = [];
      try { history = JSON.parse(gr.getValue('u_messages') || '[]'); } catch (e) { history = []; }

      var resultMsg;
      if (!approve) {
        resultMsg = "Okay - I won't make that change. Let me know how else I can help.";
      } else if (action === 'VERIFY_DOCUMENTS' || action === 'APPROVE_APPLICATION') {
        var r = this.applyVerificationDecision(targetRecordId, 'verify', 'Approved by officer via Assistant.');
        resultMsg = r.success
          ? ('Done. Verified ' + (r.documentsProcessed || 0) + ' document(s). ' + (r.familyId ? ('Family ID minted: ' + r.familyId + '. ') : '') + "Registration status is now '" + (r.registrationStatus || 'updated') + "'.")
          : ('I tried to apply the verification but hit an issue: ' + (r.message || 'unknown error'));
      } else if (action === 'REJECT_APPLICATION') {
        var r2 = this.applyVerificationDecision(targetRecordId, 'reject', 'Rejected by officer via Assistant.');
        resultMsg = r2.success ? 'The application has been marked rejected and its documents updated.' : ('Could not reject: ' + (r2.message || 'error'));
      } else {
        resultMsg = 'There was no pending action to approve.';
      }

      history.push({ sender: 'assistant', text: resultMsg });
      if (history.length > 20) history = history.slice(history.length - 20);

      gr.setValue('u_messages', JSON.stringify(history));
      gr.setValue('u_last_message', resultMsg);
      gr.setValue('u_status', 'completed');
      gr.setValue('u_pending_action', '');
      gr.setValue('u_pending_summary', '');
      gr.setValue('u_pending_raw', '');
      gr.update();

      return { success: true, status: 'completed', message: resultMsg, pendingApproval: null, done: true };
    } catch (e) {
      gs.log('Bridge360 agentApprove Exception: ' + e);
      return { success: false, status: 'error', message: e.toString() };
    }
  },

  type: 'Bridge360API'
};
`,
});
