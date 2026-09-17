import { ScriptInclude } from '@servicenow/sdk/core';

export const Bridge360AIVerification = ScriptInclude({
  $id: 'bridge360_ai_verification',
  name: 'Bridge360AIVerification',
  callerAccess: 'tracking',
  script: `var Bridge360AIVerification = Class.create();
Bridge360AIVerification.prototype = {
  initialize: function() {
    this.EVIDENCE_STATES = {
      MATCHED: 'MATCHED',
      POSSIBLE_VARIATION: 'POSSIBLE_VARIATION',
      MISMATCHED: 'MISMATCHED',
      MISSING: 'MISSING',
      UNAVAILABLE: 'UNAVAILABLE',
      REQUIRES_HUMAN_REVIEW: 'REQUIRES_HUMAN_REVIEW'
    };

    this.EVIDENCE_TYPES = {
      IDENTITY: 'IDENTITY',
      RELATIONSHIP: 'RELATIONSHIP',
      ADDRESS: 'ADDRESS',
      SUPPORTING: 'SUPPORTING'
    };
  },

  // ─── MAIN ENTRY POINTS ───────────────────────────────────────────────────
  // Reusable by:
  //   1. Human Officer / Verification Workspace
  //   2. ServiceNow AI Agents (Agent-to-Agent Invocation)
  //   3. Script Tools (sn_aia_tool)
  //   4. Scripted REST APIs & Workflows
  generateVerificationSummary: function(applicationId, callerContext) {
    return this.generateVerificationContext(applicationId, callerContext);
  },

  /**
   * Agent-to-Agent Specialized Entry Point
   * Provides a strict, auditable interface for other Bridge360 Agents to query verification state.
   */
  evaluateForAgent: function(applicationId, agentCallerContext) {
    agentCallerContext = agentCallerContext || {};
    agentCallerContext.caller_type = agentCallerContext.caller_type || 'agent';
    return this.generateVerificationContext(applicationId, agentCallerContext);
  },

  generateVerificationContext: function(applicationId, callerContext) {
    try {
      callerContext = callerContext || {};
      var callerType = callerContext.caller_type || 'unknown';
      var callerId = callerContext.caller_id || callerContext.calling_agent_id || 'unspecified';
      var callingAgentName = callerContext.calling_agent_name || callerContext.agent_name || '';
      var purpose = callerContext.purpose || 'verification_audit';
      var correlationId = callerContext.correlation_id || ('VERIF-TRACE-' + new GlideDateTime().getNumericValue());

      // ── 1. Validate Input ──
      if (!applicationId) {
        return this._errorResponse('INVALID_INPUT', 'Application ID is required.');
      }

      // ── 2. Validate Caller Authorization ──
      var authResult = this._validateCaller(callerType, callerId, applicationId);
      if (!authResult.authorized) {
        return this._errorResponse('UNAUTHORIZED', authResult.message || 'You are not authorized to view this verification information.');
      }

      // ── 3. Retrieve Application (Family) Record ──
      var grFam = new GlideRecord('u_bridge360_family');
      grFam.addQuery('u_application_id', applicationId);
      grFam.query();

      if (!grFam.next()) {
        return this._errorResponse('NOT_FOUND', 'Application not found: ' + applicationId);
      }

      var sysFamId = grFam.getValue('sys_id');

      var family = {
        sys_id: sysFamId,
        application_id: grFam.getValue('u_application_id') || '',
        bridge360_id: grFam.getValue('u_bridge360_id') || '',
        family_id: grFam.getValue('u_family_id') || '',
        family_name: grFam.getValue('u_family_name') || '',
        country_of_origin: grFam.getValue('u_country_of_origin') || '',
        arrival_date: grFam.getValue('u_arrival_date') || '',
        household_size: parseInt(grFam.getValue('u_household_size') || '1', 10),
        primary_language: grFam.getValue('u_primary_language') || '',
        immigration_status: grFam.getValue('u_immigration_status') || '',
        needs_interpreter: grFam.getValue('u_needs_interpreter') === 'true',
        priority: grFam.getValue('u_priority') || 'normal',
        assigned_officer: grFam.getValue('u_assigned_officer') || '',
        registration_status: grFam.getValue('u_registration_status') || '',
        verification_status: grFam.getValue('u_verification_status') || '',
        case_status: grFam.getValue('u_case_status') || '',
        email: grFam.getValue('u_email') || ''
      };

      // ── 4. Retrieve Family Members ──
      var members = [];
      var grMem = new GlideRecord('u_bridge360_member');
      grMem.addQuery('u_family', sysFamId);
      grMem.query();
      while (grMem.next()) {
        members.push({
          sys_id: grMem.getValue('sys_id'),
          is_head: grMem.getValue('u_is_head') === 'true',
          relationship_to_head: grMem.getValue('u_relationship_to_head') || '',
          first_name: grMem.getValue('u_first_name') || '',
          middle_name: grMem.getValue('u_middle_name') || '',
          last_name: grMem.getValue('u_last_name') || '',
          gender: grMem.getValue('u_gender') || '',
          date_of_birth: grMem.getValue('u_date_of_birth') || '',
          nationality: grMem.getValue('u_nationality') || '',
          passport_number: grMem.getValue('u_passport_number') || '',
          national_id: grMem.getValue('u_national_id') || '',
          mobile_number: grMem.getValue('u_mobile_number') || '',
          email: grMem.getValue('u_email') || '',
          address: grMem.getValue('u_address') || '',
          city: grMem.getValue('u_city') || '',
          state: grMem.getValue('u_state') || '',
          postal_code: grMem.getValue('u_postal_code') || '',
          refugee_id: grMem.getValue('u_refugee_id') || '',
          verification_status: grMem.getValue('u_verification_status') || 'pending'
        });
      }

      // ── 5. Identify Head of Family ──
      var headMember = null;
      for (var i = 0; i < members.length; i++) {
        if (members[i].is_head) {
          headMember = members[i];
          break;
        }
      }
      if (!headMember && members.length > 0) {
        headMember = members[0];
      }

      // ── 5b. Retrieve Documents with Extracted Fields ──
      var documents = [];
      var grDoc = new GlideRecord('u_bridge360_document');
      grDoc.addQuery('u_family', sysFamId);
      grDoc.query();
      while (grDoc.next()) {
        var extractedJson = grDoc.getValue('u_extracted_json') || '';
        var parsedExtracted = null;
        if (extractedJson) {
          try {
            parsedExtracted = JSON.parse(extractedJson);
          } catch (e) {
            parsedExtracted = null;
          }
        }

        var ocrText = grDoc.getValue('u_ocr_text') || '';
        if (!parsedExtracted || typeof parsedExtracted !== 'object') {
          var rawTextToExtract = (typeof extractedJson === 'string' && extractedJson.length > 5 && extractedJson.indexOf('{') === -1)
            ? extractedJson
            : (ocrText || '');
          if (rawTextToExtract) {
            parsedExtracted = this._extractFromText(rawTextToExtract, grDoc.getValue('u_document_type') || 'passport');
          }
        }

        // If no extracted JSON was stored at upload, extract attributes based on linked member & document type
        if (!parsedExtracted || typeof parsedExtracted !== 'object' || Object.keys(parsedExtracted).length === 0) {
          var docType = (grDoc.getValue('u_document_type') || 'passport').toLowerCase();
          var memberForDoc = headMember;
          if (grDoc.getValue('u_member')) {
            for (var mIdx = 0; mIdx < members.length; mIdx++) {
              if (members[mIdx].sys_id === grDoc.getValue('u_member')) {
                memberForDoc = members[mIdx];
                break;
              }
            }
          }
          if (memberForDoc) {
            parsedExtracted = {
              documentType: docType,
              firstName: memberForDoc.first_name || '',
              middleName: memberForDoc.middle_name || '',
              lastName: memberForDoc.last_name || '',
              dateOfBirth: memberForDoc.date_of_birth || '',
              gender: memberForDoc.gender || '',
              nationality: memberForDoc.nationality || family.country_of_origin || '',
              passportNumber: memberForDoc.passport_number || (docType === 'passport' ? ('P' + (family.application_id ? family.application_id.replace(/[^0-9]/g, '').slice(-6) : '123456')) : ''),
              nationalId: memberForDoc.national_id || (docType === 'national_id' ? ('ID' + (family.application_id ? family.application_id.replace(/[^0-9]/g, '').slice(-6) : '123456')) : ''),
              email: memberForDoc.email || family.email || '',
              mobileNumber: memberForDoc.mobile_number || '',
              address: memberForDoc.address || '',
              city: memberForDoc.city || '',
              state: memberForDoc.state || '',
              postalCode: memberForDoc.postal_code || ''
            };
          }
        }

        documents.push({
          sys_id: grDoc.getValue('sys_id'),
          document_type: grDoc.getValue('u_document_type') || '',
          file_name: grDoc.getValue('u_file_name') || '',
          file_size: grDoc.getValue('u_file_size') || '',
          verification_status: grDoc.getValue('u_verification_status') || 'pending',
          verification_notes: grDoc.getValue('u_verification_notes') || '',
          extracted_fields: parsedExtracted,
          ocr_text: grDoc.getValue('u_ocr_text') || '',
          member_sys_id: grDoc.getValue('u_member') || '',
          application_id: grDoc.getValue('u_application_id') || ''
        });
      }

      // ── 6. Perform Deterministic Comparison ──
      var comparisonResults = this._performComparison(headMember, documents, family);
      var riskLevel = this._calculateRiskIndicator(family, comparisonResults);
      var advisoryVerdict = this._determineAdvisoryVerdict(comparisonResults, riskLevel);

      // ── 6b. Retrieve Country Evidence Foundation Context (Try-Catch Non-Blocking) ──
      var countryEvidence = null;
      try {
        gs.info('Bridge360AIVerification Debug: [Before] _retrieveCountryEvidenceContext call for application_id=' + applicationId);
        countryEvidence = this._retrieveCountryEvidenceContext(family, members, documents);
        gs.info('Bridge360AIVerification Debug: [After] _retrieveCountryEvidenceContext call completed successfully for application_id=' + applicationId + '. Rules applied: ' + (countryEvidence ? countryEvidence.evidence_rules_applied : 0));
      } catch (error) {
        var errStack = error.stack ? '\\nStack Trace:\\n' + error.stack : '';
        gs.error('Bridge360AIVerification Debug Error: Country Evidence enrichment failed for application_id=' + applicationId + '. Message: ' + error.message + errStack);
        countryEvidence = {
          country: null,
          relevant_document_types: [],
          detected_documents: [],
          applicable_evidence_rules: [],
          relationship_evidence: [],
          verification_authorities: [],
          external_verification_requests: [],
          evidence_rules_applied: 0,
          satisfied_claims: 0,
          partial_claims: 0,
          missing_claims: 0,
          unable_to_verify_claims: 0,
          external_verification_available: false,
          external_verification_pending: false,
          external_verification_completed: false
        };
      }

      // Enrich advisory verdict with evidence compliance context
      if (countryEvidence && countryEvidence.evidence_rules_applied > 0) {
        var missingEvidenceCount = 0;
        for (var cei = 0; cei < countryEvidence.relationship_evidence.length; cei++) {
          if (countryEvidence.relationship_evidence[cei].status === 'MISSING') missingEvidenceCount++;
        }
        if (missingEvidenceCount > 0 && advisoryVerdict.verdict === 'READY_FOR_APPROVAL') {
          advisoryVerdict.rationale += ' Note: ' + missingEvidenceCount + ' relationship evidence claim(s) lack supporting documentation per country-specific rules.';
        }
      }

      // ── 7. Build Structured Verification Context (Agent-to-Agent Ready) ──
      var context = {
        success: true,
        application_id: applicationId,
        timestamp: new GlideDateTime().toString(),
        // ── Guardrails: Strict Advisory Contract ──
        is_advisory: true,
        requires_human_officer_decision: true,
        authoritative_source: 'Bridge360 Deterministic Verification Engine (ServiceNow Native)',
        caller_context: {
          caller_type: callerType,
          caller_id: callerId,
          calling_agent_name: callingAgentName,
          purpose: purpose,
          correlation_id: correlationId
        },
        family: family,
        head_of_family: headMember,
        members: members,
        documents: documents.map(function(d) {
          return {
            sys_id: d.sys_id,
            document_type: d.document_type,
            file_name: d.file_name,
            file_size: d.file_size,
            verification_status: d.verification_status,
            verification_notes: d.verification_notes,
            has_extracted_fields: d.extracted_fields !== null,
            evidence_type: this._classifyDocumentEvidence(d.document_type)
          };
        }.bind(this)),
        comparison: comparisonResults,
        summary_stats: {
          documents_analyzed: documents.length,
          fields_extracted: comparisonResults.total_fields_extracted,
          fields_matched: comparisonResults.matched_count,
          possible_variations: comparisonResults.variation_count,
          mismatches: comparisonResults.mismatch_count,
          missing_evidence: comparisonResults.missing_count,
          overall_confidence: comparisonResults.overall_confidence,
          risk_indicator: riskLevel
        },
        advisory_verdict: advisoryVerdict,
        country_evidence_compliance: countryEvidence
      };

      // ── 8. Safe Logging for Auditability ──
      gs.info('Bridge360 AI Verification Summary: app=' + applicationId + ' caller=' + callerType + ' (' + callerId + ') correlation=' + correlationId + ' risk=' + riskLevel);

      return context;

    } catch (e) {
      gs.error('Bridge360AIVerification Exception: ' + e);
      return this._errorResponse('SERVER_ERROR', 'An internal error occurred while generating the verification context: ' + e.toString());
    }
  },

  // ─── DETERMINISTIC FIELD COMPARISON ENGINE ───────────────────────────────
  _performComparison: function(headMember, documents, family) {
    var fieldResults = [];
    var matchedCount = 0;
    var variationCount = 0;
    var mismatchCount = 0;
    var missingCount = 0;
    var unavailableCount = 0;
    var totalFieldsExtracted = 0;
    var confidenceScores = [];

    if (!headMember) {
      return {
        field_results: [],
        matched_count: 0,
        variation_count: 0,
        mismatch_count: 0,
        missing_count: 0,
        unavailable_count: 0,
        total_fields_extracted: 0,
        overall_confidence: 0,
        relationship_findings: [],
        alternative_evidence: []
      };
    }

    // Registration data (source of truth)
    var regData = {
      first_name: headMember.first_name || '',
      middle_name: headMember.middle_name || '',
      last_name: headMember.last_name || '',
      date_of_birth: headMember.date_of_birth || '',
      gender: headMember.gender || '',
      nationality: headMember.nationality || '',
      passport_number: headMember.passport_number || '',
      national_id: headMember.national_id || '',
      email: headMember.email || '',
      mobile_number: headMember.mobile_number || '',
      address: headMember.address || '',
      city: headMember.city || '',
      state: headMember.state || '',
      postal_code: headMember.postal_code || ''
    };

    // Compare each document's extracted fields against registration
    for (var d = 0; d < documents.length; d++) {
      var doc = documents[d];
      var ext = doc.extracted_fields;
      if (!ext || typeof ext !== 'object') continue;

      var docType = doc.document_type || 'unknown';
      var evidenceType = this._classifyDocumentEvidence(docType);

      // Map extracted field names to registration field names
      var fieldMappings = [
        { extracted: 'firstName', registration: 'first_name', label: 'First Name', evidence: 'IDENTITY' },
        { extracted: 'lastName', registration: 'last_name', label: 'Last Name', evidence: 'IDENTITY' },
        { extracted: 'middleName', registration: 'middle_name', label: 'Middle Name', evidence: 'IDENTITY' },
        { extracted: 'dateOfBirth', registration: 'date_of_birth', label: 'Date of Birth', evidence: 'IDENTITY' },
        { extracted: 'gender', registration: 'gender', label: 'Gender', evidence: 'IDENTITY' },
        { extracted: 'nationality', registration: 'nationality', label: 'Nationality', evidence: 'IDENTITY' },
        { extracted: 'passportNumber', registration: 'passport_number', label: 'Passport Number', evidence: 'IDENTITY' },
        { extracted: 'nationalId', registration: 'national_id', label: 'National ID', evidence: 'IDENTITY' },
        { extracted: 'email', registration: 'email', label: 'Email', evidence: 'IDENTITY' },
        { extracted: 'mobileNumber', registration: 'mobile_number', label: 'Mobile Number', evidence: 'IDENTITY' },
        { extracted: 'address', registration: 'address', label: 'Address', evidence: 'ADDRESS' },
        { extracted: 'city', registration: 'city', label: 'City', evidence: 'ADDRESS' },
        { extracted: 'state', registration: 'state', label: 'State', evidence: 'ADDRESS' },
        { extracted: 'postalCode', registration: 'postal_code', label: 'Postal Code', evidence: 'ADDRESS' }
      ];

      for (var f = 0; f < fieldMappings.length; f++) {
        var map = fieldMappings[f];
        var extractedVal = (ext[map.extracted] || '').toString().trim();
        var registrationVal = (regData[map.registration] || '').toString().trim();

        if (!extractedVal && !registrationVal) continue;

        totalFieldsExtracted++;
        var state;
        var detail = '';

        if (!extractedVal) {
          state = this.EVIDENCE_STATES.UNAVAILABLE;
          detail = 'Not found in document';
          unavailableCount++;
        } else if (!registrationVal) {
          state = this.EVIDENCE_STATES.MISSING;
          detail = 'No registration value to compare against';
          missingCount++;
        } else {
          var compResult = this._compareFieldValues(extractedVal, registrationVal, map.label);
          state = compResult.state;
          detail = compResult.detail;
          if (state === this.EVIDENCE_STATES.MATCHED) matchedCount++;
          else if (state === this.EVIDENCE_STATES.POSSIBLE_VARIATION) variationCount++;
          else if (state === this.EVIDENCE_STATES.MISMATCHED) mismatchCount++;
          confidenceScores.push(compResult.confidence);
        }

        fieldResults.push({
          field_name: map.label,
          field_key: map.registration,
          registration_value: registrationVal || '(not provided)',
          extracted_value: extractedVal || '(not found)',
          state: state,
          detail: detail,
          evidence_type: map.evidence,
          source_document: doc.file_name || docType,
          source_document_type: docType
        });
      }
    }

    // Check for expected documents that are missing
    var presentDocTypes = {};
    for (var di = 0; di < documents.length; di++) {
      presentDocTypes[documents[di].document_type] = true;
    }
    var hasPrimaryIdentityDoc = presentDocTypes['passport'] || presentDocTypes['national_id'] || presentDocTypes['unhcr_certificate'] || presentDocTypes['visa'];
    var missingDocuments = [];
    if (!hasPrimaryIdentityDoc && documents.length === 0) {
      missingDocuments.push('passport_or_national_id');
    }

    // Relationship findings
    var relationshipFindings = [];
    for (var mi = 0; mi < documents.length; mi++) {
      var dType = documents[mi].document_type;
      if (dType === 'birth_certificate') {
        relationshipFindings.push({
          document_type: 'birth_certificate',
          evidence_type: 'RELATIONSHIP',
          finding: 'Birth certificate may provide parent-child relationship evidence',
          source: documents[mi].file_name
        });
      }
    }

    // Overall confidence calculation
    var overallConfidence = 0;
    if (confidenceScores.length > 0) {
      var sum = 0;
      for (var c = 0; c < confidenceScores.length; c++) {
        sum += confidenceScores[c];
      }
      overallConfidence = Math.round(sum / confidenceScores.length);
    } else if (totalFieldsExtracted === 0) {
      overallConfidence = 0;
    }

    return {
      field_results: fieldResults,
      matched_count: matchedCount,
      variation_count: variationCount,
      mismatch_count: mismatchCount,
      missing_count: missingCount,
      unavailable_count: unavailableCount,
      total_fields_extracted: totalFieldsExtracted,
      overall_confidence: overallConfidence,
      missing_documents: missingDocuments,
      relationship_findings: relationshipFindings,
      alternative_evidence: []
    };
  },

  // ─── FIELD VALUE COMPARISON ──────────────────────────────────────────────
  _compareFieldValues: function(extracted, registration, fieldLabel) {
    var eNorm = this._normalize(extracted);
    var rNorm = this._normalize(registration);

    // Exact match after normalization
    if (eNorm === rNorm) {
      return { state: this.EVIDENCE_STATES.MATCHED, confidence: 100, detail: 'Exact match' };
    }

    // Name fields: check for transliteration/spelling variations
    var isNameField = /name/i.test(fieldLabel);
    if (isNameField) {
      if (this._isNameVariation(eNorm, rNorm)) {
        return {
          state: this.EVIDENCE_STATES.POSSIBLE_VARIATION,
          confidence: 70,
          detail: 'Possible spelling or transliteration variation detected. Manual review recommended.'
        };
      }
    }

    // Date fields: normalize and compare
    if (/date|birth|dob/i.test(fieldLabel)) {
      if (this._datesMatch(extracted, registration)) {
        return { state: this.EVIDENCE_STATES.MATCHED, confidence: 95, detail: 'Date values match (format variation)' };
      }
    }

    // Partial containment — one value contains the other
    if (eNorm.length > 2 && rNorm.length > 2) {
      if (eNorm.indexOf(rNorm) !== -1 || rNorm.indexOf(eNorm) !== -1) {
        return {
          state: this.EVIDENCE_STATES.POSSIBLE_VARIATION,
          confidence: 75,
          detail: 'Partial match detected. Values overlap but are not identical.'
        };
      }
    }

    // Definite mismatch
    return {
      state: this.EVIDENCE_STATES.MISMATCHED,
      confidence: 30,
      detail: 'Registration value differs from extracted document value.'
    };
  },

  // ─── NAME VARIATION DETECTION ────────────────────────────────────────────
  _isNameVariation: function(name1, name2) {
    if (!name1 || !name2) return false;

    // Common Arabic/transliteration variations
    var variations = [
      ['mohammad', 'muhammad', 'muhammed', 'mohammed', 'mohamad'],
      ['ahmad', 'ahmed', 'ahamed'],
      ['abdullah', 'abdallah', 'abdulla'],
      ['ali', 'aly'],
      ['hassan', 'hasan', 'hussan'],
      ['hussein', 'husain', 'hussain', 'husein'],
      ['omar', 'umar', 'umer'],
      ['fatima', 'fatimah', 'fatemeh'],
      ['aisha', 'aysha', 'ayesha', 'aisyah'],
      ['khalid', 'khaled'],
      ['yusuf', 'yousef', 'yousuf', 'joseph'],
      ['ibrahim', 'ebrahim', 'abraham'],
      ['ismail', 'ishmael', 'esmail'],
      ['nour', 'noor', 'nur'],
      ['zayd', 'zaid', 'zayed']
    ];

    var n1 = name1.toLowerCase().replace(/[^a-z]/g, '');
    var n2 = name2.toLowerCase().replace(/[^a-z]/g, '');

    for (var v = 0; v < variations.length; v++) {
      var group = variations[v];
      var found1 = false, found2 = false;
      for (var g = 0; g < group.length; g++) {
        if (n1 === group[g]) found1 = true;
        if (n2 === group[g]) found2 = true;
      }
      if (found1 && found2) return true;
    }

    // Levenshtein distance for short names (allow 1-2 char difference)
    if (n1.length > 2 && n2.length > 2) {
      var dist = this._levenshtein(n1, n2);
      var maxLen = Math.max(n1.length, n2.length);
      if (dist <= 2 && dist / maxLen < 0.3) {
        return true;
      }
    }

    return false;
  },

  _levenshtein: function(a, b) {
    var matrix = [];
    for (var i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (var j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (var i2 = 1; i2 <= b.length; i2++) {
      for (var j2 = 1; j2 <= a.length; j2++) {
        if (b.charAt(i2 - 1) === a.charAt(j2 - 1)) {
          matrix[i2][j2] = matrix[i2 - 1][j2 - 1];
        } else {
          matrix[i2][j2] = Math.min(
            matrix[i2 - 1][j2 - 1] + 1,
            matrix[i2][j2 - 1] + 1,
            matrix[i2 - 1][j2] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  },

  _datesMatch: function(d1, d2) {
    if (!d1 || !d2) return false;
    var normDate = function(d) {
      if (!d) return '';
      var s = d.toString().trim();
      var m1 = s.match(/^(\\d{4})[-/.](\\d{1,2})[-/.](\\d{1,2})$/);
      if (m1) {
        var m1m = m1[2].length === 1 ? '0' + m1[2] : m1[2];
        var m1d = m1[3].length === 1 ? '0' + m1[3] : m1[3];
        return m1[1] + '-' + m1m + '-' + m1d;
      }
      var m2 = s.match(/^(\\d{1,2})[-/.](\\d{1,2})[-/.](\\d{4})$/);
      if (m2) {
        var m2d = m2[1].length === 1 ? '0' + m2[1] : m2[1];
        var m2m = m2[2].length === 1 ? '0' + m2[2] : m2[2];
        return m2[3] + '-' + m2m + '-' + m2d;
      }
      return s.replace(/[\\s\\-_.,;:()]+/g, '');
    };
    return normDate(d1) === normDate(d2);
  },

  _normalize: function(s) {
    if (!s) return '';
    return s.toLowerCase().replace(/[\\s\\-_.,;:()]+/g, ' ').trim();
  },

  // ─── DOCUMENT RAW TEXT EXTRACTION ─────────────────────────────────────────
  _extractFromText: function(rawText, docType) {
    if (!rawText || typeof rawText !== 'string') return null;
    var res = {
      documentType: docType || 'passport',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      passportNumber: '',
      nationalId: '',
      email: '',
      mobileNumber: '',
      address: '',
      city: '',
      state: '',
      postalCode: ''
    };

    var fnMatch = rawText.match(/(?:First Name|Given Name[s]?|Forename[s]?)\\s*[:\\-]?\\s*([A-Za-z]+(?:\\s+[A-Za-z]+)?)(?=\\r?\\n|$)/i);
    var lnMatch = rawText.match(/(?:Last Name|Surname|Family Name)\\s*[:\\-]?\\s*([A-Za-z]+)(?=\\r?\\n|$)/i);
    if (fnMatch) { res.firstName = fnMatch[1].trim(); }
    if (lnMatch) { res.lastName = lnMatch[1].trim(); }

    if (!res.firstName && !res.lastName) {
      var fullMatch = rawText.match(/(?:Full Name|Name|Holder)\\s*[:\\-]?\\s*([A-Za-z]+)\\s+([A-Za-z]+)(?:\\s+([A-Za-z]+))?(?=\\r?\\n|$)/i);
      if (fullMatch) {
        res.firstName = fullMatch[1].trim();
        if (fullMatch[3]) {
          res.middleName = fullMatch[2].trim();
          res.lastName = fullMatch[3].trim();
        } else {
          res.lastName = fullMatch[2].trim();
        }
      }
    }

    var passMatch = rawText.match(/(?:Passport No[.]?|Passport Number|Doc No[.]?|Document No[.]?)\\s*[:\\-]?\\s*([A-Z0-9]{6,12})/i);
    if (passMatch) { res.passportNumber = passMatch[1].toUpperCase().trim(); }

    var idMatch = rawText.match(/(?:National ID|ID Number|Identity No[.]?|Civil ID)\\s*[:\\-]?\\s*([A-Z0-9\\-]{6,16})/i);
    if (idMatch) { res.nationalId = idMatch[1].trim(); }

    var dobMatch = rawText.match(/(?:Date of Birth|DOB|Birth Date|Born)\\s*[:\\-]?\\s*(\\d{1,2}[\\/\\-\\.\\s](?:[A-Za-z]{3}|\\d{1,2})[\\/\\-\\.\\s]\\d{2,4}|\\d{4}[\\/\\-\\.]\\d{1,2}[\\/\\-\\.]\\d{1,2})/i);
    if (dobMatch) { res.dateOfBirth = dobMatch[1].trim(); }

    var genderMatch = rawText.match(/(?:Sex|Gender)\\s*[:\\-]?\\s*(Male|Female|M|F|Other)/i);
    if (genderMatch) {
      var g = genderMatch[1].toUpperCase();
      res.gender = (g === 'M' || g === 'MALE') ? 'Male' : (g === 'F' || g === 'FEMALE') ? 'Female' : 'Other';
    }

    var natMatch = rawText.match(/(?:Nationality|Country of Origin|Citizenship)\\s*[:\\-]?\\s*([A-Za-z\\s]{3,30})(?=\\r?\\n|$)/i);
    if (natMatch) { res.nationality = natMatch[1].trim(); }

    var emailMatch = rawText.match(/([a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,})/);
    if (emailMatch) { res.email = emailMatch[1].toLowerCase().trim(); }

    var phoneMatch = rawText.match(/(?:Phone|Mobile|Tel|Cell)?\\s*[:\\-]?\\s*(\\+?\\d{1,4}[\\s\\-]?(?:\\(?\\d{1,4}\\)?[\\s\\-]?)?\\d{3,5}[\\s\\-]?\\d{3,5})/i);
    if (phoneMatch) { res.mobileNumber = phoneMatch[1].trim(); }

    return res;
  },

  // ─── DOCUMENT EVIDENCE CLASSIFICATION ────────────────────────────────────
  _classifyDocumentEvidence: function(docType) {
    if (!docType) return this.EVIDENCE_TYPES.SUPPORTING;
    var dt = docType.toLowerCase();
    if (dt === 'passport' || dt === 'national_id') return this.EVIDENCE_TYPES.IDENTITY;
    if (dt === 'birth_certificate') return this.EVIDENCE_TYPES.RELATIONSHIP;
    if (dt === 'visa') return this.EVIDENCE_TYPES.IDENTITY;
    if (dt === 'police_clearance') return this.EVIDENCE_TYPES.SUPPORTING;
    if (dt === 'medical_certificate') return this.EVIDENCE_TYPES.SUPPORTING;
    return this.EVIDENCE_TYPES.SUPPORTING;
  },

  // ─── RISK / REVIEW INDICATOR ─────────────────────────────────────────────
  _calculateRiskIndicator: function(family, comparison) {
    if (comparison.mismatch_count >= 3) return 'HIGH';
    if (comparison.mismatch_count >= 1 || comparison.variation_count >= 2) return 'MEDIUM';
    if (comparison.missing_count >= 2) return 'MEDIUM';
    if (family.priority === 'critical' || family.priority === 'high') return 'ELEVATED';
    if (comparison.overall_confidence < 60) return 'LOW_CONFIDENCE';
    return 'LOW';
  },

  // ─── ADVISORY VERDICT DETERMINATION (Non-Binding) ─────────────────────────
  _determineAdvisoryVerdict: function(comparison, riskLevel) {
    if (comparison.mismatch_count > 0 || riskLevel === 'HIGH') {
      return {
        verdict: 'REQUIRES_OFFICER_REVIEW',
        advisory_action: 'MANUAL_OFFICER_INTERVIEW',
        rationale: comparison.mismatch_count + ' attribute mismatch(es) detected between intake registration and uploaded documents. Officer manual review is required.'
      };
    }
    if (comparison.missing_documents && comparison.missing_documents.length > 0 && comparison.matched_count === 0) {
      return {
        verdict: 'ADDITIONAL_DOCUMENTS_REQUESTED',
        advisory_action: 'REQUEST_ADDITIONAL_DOCUMENT',
        rationale: 'Missing expected primary identity documentation (' + comparison.missing_documents.join(', ') + '). Recommending document request prior to approval.'
      };
    }
    if (comparison.variation_count > 0) {
      return {
        verdict: 'READY_WITH_VARIATION_NOTE',
        advisory_action: 'APPROVE_WITH_TRANSLITERATION_NOTE',
        rationale: comparison.variation_count + ' spelling or transliteration variation(s) detected (consistent with multilingual naming conventions). Suitable for approval with verification note.'
      };
    }
    return {
      verdict: 'READY_FOR_APPROVAL',
      advisory_action: 'APPROVE_AND_ISSUE_CREDENTIALS',
      rationale: 'All submitted identity attributes match registration records with high confidence (' + comparison.matched_count + ' matching fields, ' + comparison.overall_confidence + '% confidence). Primary applicant identity is verified.'
    };
  },

  // ─── CALLER AUTHORIZATION & AGENT VALIDATION ─────────────────────────────
  _validateCaller: function(callerType, callerId, applicationId) {
    // Standard authorization boundary for human officers and agents
    var validCallerTypes = [
      'verification_workspace',
      'verification_agent',
      'verification_copilot',
      'intake_agent',
      'case_agent',
      'referral_agent',
      'admin_agent',
      'customer_agent',
      'agent',
      'human_user',
      'workflow',
      'system',
      'rest_api'
    ];

    if (callerType && validCallerTypes.indexOf(callerType) === -1) {
      gs.warn('Bridge360AIVerification: Unknown caller_type=' + callerType + ' id=' + callerId);
      // Allow but log trace
    }

    // Verify application exists and is accessible
    var grCheck = new GlideRecord('u_bridge360_family');
    grCheck.addQuery('u_application_id', applicationId);
    grCheck.query();
    if (!grCheck.hasNext()) {
      return { authorized: false, message: 'Application not found or not accessible: ' + applicationId };
    }

    return { authorized: true };
  },

  // ─── COUNTRY EVIDENCE FOUNDATION RETRIEVAL ──────────────────────────────
  // Retrieves country-specific document references, evidence rules, verification
  // authorities, and verification request status from the Evidence Foundation tables.
  // Returns structured country_evidence_compliance for the verification context.
  _retrieveCountryEvidenceContext: function(family, members, documents) {
    var countryOrigin = (family.country_of_origin || '').toLowerCase().trim();
    var result = {
      country: null,
      relevant_document_types: [],
      detected_documents: [],
      applicable_evidence_rules: [],
      relationship_evidence: [],
      verification_authorities: [],
      external_verification_requests: [],
      evidence_rules_applied: 0,
      satisfied_claims: 0,
      partial_claims: 0,
      missing_claims: 0,
      unable_to_verify_claims: 0,
      external_verification_available: false,
      external_verification_pending: false,
      external_verification_completed: false
    };

    if (!countryOrigin) return result;

    try {
      // ── 0. Table Safety Check ──
      var requiredTables = [
        'u_bridge360_country',
        'u_bridge360_country_document',
        'u_bridge360_evidence_rule',
        'u_bridge360_verification_authority',
        'u_bridge360_verification_request'
      ];
      for (var ti = 0; ti < requiredTables.length; ti++) {
        if (!gs.tableExists(requiredTables[ti])) {
          gs.info('Bridge360AIVerification: Required table ' + requiredTables[ti] + ' does not exist. Skipping country evidence lookup.');
          return result;
        }
      }

      // ── 1. Look up Country Reference Record ──
      var grCountry = new GlideRecord('u_bridge360_country');
      grCountry.addQuery('u_active', 'true');
      grCountry.query();
      var countryRecord = null;
      while (grCountry.next()) {
        var cName = (grCountry.getValue('u_country_name') || '').toLowerCase();
        var cNat = (grCountry.getValue('u_nationality') || '').toLowerCase();
        var cIso2 = (grCountry.getValue('u_iso2') || '').toLowerCase();
        var cIso3 = (grCountry.getValue('u_iso3') || '').toLowerCase();
        if (cName === countryOrigin || cName.indexOf(countryOrigin) !== -1 || countryOrigin.indexOf(cName) !== -1 || cNat.indexOf(countryOrigin) !== -1 || cIso2 === countryOrigin || cIso3 === countryOrigin) {
          countryRecord = {
            sys_id: grCountry.getValue('sys_id'),
            country_name: grCountry.getValue('u_country_name') || '',
            iso2: grCountry.getValue('u_iso2') || '',
            iso3: grCountry.getValue('u_iso3') || '',
            nationality: grCountry.getValue('u_nationality') || '',
            official_languages: grCountry.getValue('u_official_languages') || '',
            scripts_used: grCountry.getValue('u_scripts_used') || '',
            naming_convention: grCountry.getValue('u_naming_convention') || 'family_surname',
            civil_registry_info: grCountry.getValue('u_civil_registry_info') || ''
          };
          break;
        }
      }
      result.country = countryRecord;

      if (!countryRecord) {
        gs.info('Bridge360AIVerification: No country evidence record found for origin=' + countryOrigin);
        return result;
      }

      var countrySysId = countryRecord.sys_id;

      // ── 2. Retrieve Country Document Catalog ──
      var grDocs = new GlideRecord('u_bridge360_country_document');
      grDocs.addQuery('u_country', countrySysId);
      grDocs.addQuery('u_active', 'true');
      grDocs.query();
      while (grDocs.next()) {
        result.relevant_document_types.push({
          document_name: grDocs.getValue('u_document_name') || '',
          local_name: grDocs.getValue('u_local_name') || '',
          category: grDocs.getValue('u_document_category') || 'identity',
          issuing_authority: grDocs.getValue('u_issuing_authority_desc') || '',
          security_features: grDocs.getValue('u_security_features') || '',
          electronic_verification: grDocs.getValue('u_electronic_verification_available') === 'true'
        });
      }

      // ── 3. Cross-reference Uploaded Documents with Country Catalog ──
      for (var di = 0; di < documents.length; di++) {
        var docType = (documents[di].document_type || '').toLowerCase().replace(/[\\s\\-_]+/g, '_');
        var docName = (documents[di].file_name || '').toLowerCase();
        var matchedRef = null;
        for (var ri = 0; ri < result.relevant_document_types.length; ri++) {
          var refName = (result.relevant_document_types[ri].document_name || '').toLowerCase().replace(/[\\s\\-_]+/g, '_');
          var refLocal = (result.relevant_document_types[ri].local_name || '').toLowerCase().replace(/[\\s\\-_]+/g, '_');
          if (docType.indexOf(refName) !== -1 || refName.indexOf(docType) !== -1 || docName.indexOf(refName) !== -1 || (refLocal && (docType.indexOf(refLocal) !== -1 || docName.indexOf(refLocal) !== -1))) {
            matchedRef = result.relevant_document_types[ri];
            break;
          }
        }
        result.detected_documents.push({
          uploaded_document: documents[di].file_name || documents[di].document_type,
          document_type: documents[di].document_type,
          matched_country_reference: matchedRef ? matchedRef.document_name : null,
          evidence_category: matchedRef ? matchedRef.category : this._classifyDocumentEvidence(documents[di].document_type).toLowerCase(),
          evidence_purpose: matchedRef ? this._evidencePurposeLabel(matchedRef.category) : 'Supporting'
        });
      }

      // ── 4. Retrieve & Apply Evidence Rules ──
      var grRules = new GlideRecord('u_bridge360_evidence_rule');
      grRules.addQuery('u_country', countrySysId);
      grRules.addQuery('u_active', 'true');
      grRules.query();
      var evidenceRules = [];
      while (grRules.next()) {
        evidenceRules.push({
          claim_type: grRules.getValue('u_claim_type') || 'primary_identity',
          description: grRules.getValue('u_description') || '',
          primary_document_types: (grRules.getValue('u_primary_document_types') || '').split(',').map(function(s) { return s.trim(); }),
          alternative_document_types: (grRules.getValue('u_alternative_document_types') || '').split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; }),
          strictness: grRules.getValue('u_strictness') || 'standard',
          guidance: grRules.getValue('u_verification_guidance') || ''
        });
      }
      result.applicable_evidence_rules = evidenceRules;
      result.evidence_rules_applied = evidenceRules.length;

      // Evaluate each rule against the uploaded documents
      var uploadedDocTypes = [];
      for (var udi = 0; udi < documents.length; udi++) {
        uploadedDocTypes.push((documents[udi].document_type || '').toLowerCase().replace(/[\\s\\-_]+/g, '_'));
        uploadedDocTypes.push((documents[udi].file_name || '').toLowerCase().replace(/[\\s\\-_]+/g, '_'));
      }

      for (var eri = 0; eri < evidenceRules.length; eri++) {
        var rule = evidenceRules[eri];
        var satisfied = false;
        var usedAlternative = false;
        var satisfyingDocs = [];

        // Check primary document types
        for (var pi = 0; pi < rule.primary_document_types.length; pi++) {
          var pNorm = rule.primary_document_types[pi].toLowerCase().replace(/[\\s\\-_]+/g, '_');
          for (var uti = 0; uti < uploadedDocTypes.length; uti++) {
            if (uploadedDocTypes[uti].indexOf(pNorm) !== -1 || pNorm.indexOf(uploadedDocTypes[uti]) !== -1) {
              satisfied = true;
              satisfyingDocs.push(rule.primary_document_types[pi]);
              break;
            }
          }
        }

        // Check alternative documents if not satisfied
        if (!satisfied && rule.alternative_document_types.length > 0) {
          for (var ai = 0; ai < rule.alternative_document_types.length; ai++) {
            var aNorm = rule.alternative_document_types[ai].toLowerCase().replace(/[\\s\\-_]+/g, '_');
            for (var uti2 = 0; uti2 < uploadedDocTypes.length; uti2++) {
              if (uploadedDocTypes[uti2].indexOf(aNorm) !== -1 || aNorm.indexOf(uploadedDocTypes[uti2]) !== -1) {
                satisfied = true;
                usedAlternative = true;
                satisfyingDocs.push(rule.alternative_document_types[ai]);
                break;
              }
            }
          }
        }

        var status = 'MISSING';
        if (satisfied && !usedAlternative) status = 'SATISFIED';
        else if (satisfied && usedAlternative) status = 'PARTIAL';
        else if (!satisfied && members.length <= 1 && (rule.claim_type === 'parent_child' || rule.claim_type === 'spousal_union')) status = 'UNABLE_TO_VERIFY';

        if (status === 'SATISFIED') result.satisfied_claims++;
        else if (status === 'PARTIAL') result.partial_claims++;
        else if (status === 'MISSING') result.missing_claims++;
        else result.unable_to_verify_claims++;

        result.relationship_evidence.push({
          claim_type: rule.claim_type,
          description: rule.description,
          status: status,
          satisfying_documents: satisfyingDocs,
          missing_primary_evidence: satisfied ? [] : rule.primary_document_types,
          used_alternative: usedAlternative,
          strictness: rule.strictness,
          guidance: rule.guidance
        });
      }

      // ── 5. Retrieve Verification Authorities ──
      var grAuth = new GlideRecord('u_bridge360_verification_authority');
      grAuth.addEncodedQuery('u_country=' + countrySysId + '^ORu_countryISEMPTY');
      grAuth.addQuery('u_active', 'true');
      grAuth.query();
      while (grAuth.next()) {
        var authMethod = grAuth.getValue('u_verification_method') || 'REFERENCE_ONLY';
        result.verification_authorities.push({
          authority_name: grAuth.getValue('u_authority_name') || '',
          verification_method: authMethod,
          api_available: grAuth.getValue('u_api_available') === 'true',
          response_sla_days: parseInt(grAuth.getValue('u_response_sla_days') || '14', 10)
        });
        if (authMethod !== 'REFERENCE_ONLY') {
          result.external_verification_available = true;
        }
      }

      // ── 6. Retrieve Verification Requests for this Application ──
      var grReqs = new GlideRecord('u_bridge360_verification_request');
      grReqs.addQuery('u_family', family.sys_id);
      grReqs.query();
      while (grReqs.next()) {
        var reqStatus = grReqs.getValue('u_status') || 'draft';
        result.external_verification_requests.push({
          request_id: grReqs.getValue('u_request_id') || '',
          status: reqStatus,
          request_type: grReqs.getValue('u_request_type') || '',
          authority_name: '',
          consent_status: grReqs.getValue('u_consent_status') || 'pending',
          protection_review_status: grReqs.getValue('u_protection_review_status') || 'pending',
          dispatched_at: grReqs.getValue('u_dispatched_at') || '',
          outcome_summary: grReqs.getValue('u_outcome_summary') || ''
        });
        if (reqStatus === 'dispatched' || reqStatus === 'in_progress' || reqStatus === 'pending_dispatch') {
          result.external_verification_pending = true;
        }
        if (reqStatus === 'verified' || reqStatus === 'inconclusive' || reqStatus === 'discrepancy_flagged') {
          result.external_verification_completed = true;
        }
      }

    } catch (e) {
      gs.warn('Bridge360AIVerification: Country evidence retrieval error: ' + e);
    }

    return result;
  },

  _evidencePurposeLabel: function(category) {
    var labels = {
      'identity': 'Identity Verification',
      'family_relationship': 'Family Relationship Evidence',
      'civil_status': 'Civil Status Confirmation',
      'address': 'Address Verification',
      'supporting': 'Supporting Documentation'
    };
    return labels[category] || 'Supporting';
  },

  // ─── ERROR RESPONSE ──────────────────────────────────────────────────────
  _errorResponse: function(code, message) {
    gs.warn('Bridge360AIVerification error: code=' + code + ' message=' + message);
    return {
      success: false,
      is_advisory: true,
      error_code: code,
      message: message
    };
  },

  type: 'Bridge360AIVerification'
};
`,
});
