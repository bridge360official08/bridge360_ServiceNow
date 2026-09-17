import { ScriptInclude } from '@servicenow/sdk/core';

export const Bridge360VerificationAgent = ScriptInclude({
  $id: 'bridge360_verification_agent',
  name: 'Bridge360VerificationAgent',
  callerAccess: 'tracking',
  script: `var Bridge360VerificationAgent = Class.create();
Bridge360VerificationAgent.prototype = {
  initialize: function() {
    this.AGENT_ID = 'bridge360_family_verification_agent';
    this.AGENT_NAME = 'Bridge360 Family Verification Agent';
    this.AGENT_VERSION = '1.0.0';
    this.ROLE = 'Verification Intelligence Co-Pilot';
  },

  /**
   * Main Entry Point: Autonomous & Interactive Family Verification Evaluation
   * 
   * @param {string} applicationId - Unique Bridge360 Application ID (e.g. APP-2026-000001)
   * @param {Object} callerContext - Metadata identifying caller
   * @param {string} userQuery - Optional interactive query from officer
   * @param {Object} options - Optional execution parameters
   * @returns {Object} Structured agent assessment response
   */
  evaluateApplication: function(applicationId, callerContext, userQuery, options) {
    try {
      callerContext = callerContext || {};
      options = options || {};

      if (!applicationId) {
        return this._errorResponse('INVALID_INPUT', 'Application ID is required for verification agent.');
      }

      // ── Step 1: Execute Reusable Feature #2 Capability (Agent-to-Agent Call) ──
      var verifier = new Bridge360AIVerification();
      var verifContext = verifier.generateVerificationSummary(applicationId, {
        caller_type: callerContext.caller_type || 'verification_agent',
        caller_id: callerContext.caller_id || 'verification_agent_service',
        calling_agent_name: callerContext.calling_agent_name || this.AGENT_NAME,
        purpose: callerContext.purpose || 'agentic_verification_evaluation',
        correlation_id: callerContext.correlation_id || ('AGENT-EVAL-' + new GlideDateTime().getNumericValue())
      });

      if (!verifContext || !verifContext.success) {
        return verifContext || this._errorResponse('VERIFICATION_CONTEXT_FAILED', 'Failed to retrieve underlying verification evidence.');
      }

      // ── Step 2: Multi-Step Agentic Reasoning ──
      var reasoningTrail = this._buildReasoningTrail(verifContext);

      // ── Step 3: Household & Evidence Correlation ──
      var correlationAnalysis = this._correlateHouseholdEvidence(verifContext);

      // ── Step 4: Decision Synthesis & Actionable Recommendations ──
      var decisionPackage = this._synthesizeDecisionPackage(verifContext, correlationAnalysis);

      // ── Step 5: Process Interactive Query (if provided) ──
      var queryResult = null;
      if (userQuery && typeof userQuery === 'string' && userQuery.trim().length > 0) {
        queryResult = this._processAgentQuery(userQuery.trim(), verifContext, correlationAnalysis, decisionPackage);
      }

      // ── Step 6: Assemble Agent Response with Advisory Guardrails ──
      var response = {
        success: true,
        is_advisory: true,
        requires_human_officer_decision: true,
        agent_id: this.AGENT_ID,
        agent_name: this.AGENT_NAME,
        agent_version: this.AGENT_VERSION,
        application_id: applicationId,
        timestamp: new GlideDateTime().toString(),
        evaluation_status: 'COMPLETED',
        overall_verdict: decisionPackage.verdict,
        confidence_score: verifContext.summary_stats.overall_confidence,
        risk_level: verifContext.summary_stats.risk_indicator,
        executive_brief: decisionPackage.executive_brief,
        reasoning_trail: reasoningTrail,
        correlation_analysis: correlationAnalysis,
        recommended_action: decisionPackage.recommended_action,
        action_rationale: decisionPackage.action_rationale,
        draft_artifacts: decisionPackage.draft_artifacts,
        query_response: queryResult,
        verification_context: verifContext
      };

      gs.info('Bridge360VerificationAgent: evaluation completed for ' + applicationId + ' verdict=' + decisionPackage.verdict);
      return response;

    } catch (e) {
      gs.error('Bridge360VerificationAgent Exception: ' + e);
      return this._errorResponse('AGENT_EXECUTION_ERROR', 'An internal error occurred during agent verification evaluation: ' + e.toString());
    }
  },

  // ─── AGENT MULTI-STEP REASONING TRAIL ─────────────────────────────────────
  _buildReasoningTrail: function(verifContext) {
    var trail = [];
    var family = verifContext.family || {};
    var members = verifContext.members || [];
    var docs = verifContext.documents || [];
    var stats = verifContext.summary_stats || {};

    // Step 1: Ingest Context
    trail.push({
      step: 1,
      title: 'Context Ingestion',
      status: 'SUCCESS',
      timestamp: new GlideDateTime().toString(),
      summary: 'Ingested application ' + family.application_id + ' (' + family.family_name + ', ' + family.country_of_origin + ') with ' + members.length + ' registered member(s) and ' + docs.length + ' uploaded document(s).'
    });

    // Step 2: Evidence Attribute Matching
    var matchSummary = stats.fields_matched + ' exact match(es), ' + stats.possible_variations + ' variation(s), ' + stats.mismatches + ' mismatch(es) detected.';
    trail.push({
      step: 2,
      title: 'Deterministic Attribute Evaluation',
      status: stats.mismatches > 0 ? 'FLAGGED' : 'SUCCESS',
      timestamp: new GlideDateTime().toString(),
      summary: matchSummary
    });

    // Step 3: Household & Identity Coverage Audit
    var headFound = verifContext.head_of_family ? true : false;
    var docCount = docs.length;
    var coverageRatio = members.length > 0 ? Math.round((docCount / members.length) * 100) : 100;
    trail.push({
      step: 3,
      title: 'Household Coverage Analysis',
      status: coverageRatio < 50 ? 'WARNING' : 'SUCCESS',
      timestamp: new GlideDateTime().toString(),
      summary: 'Head of household identified: ' + (headFound ? 'Yes' : 'No') + '. Document coverage ratio: ' + coverageRatio + '% across household.'
    });

    // Step 4: Risk & Integrity Synthesis
    trail.push({
      step: 4,
      title: 'Risk & Integrity Synthesis',
      status: stats.risk_indicator === 'HIGH' ? 'WARNING' : 'SUCCESS',
      timestamp: new GlideDateTime().toString(),
      summary: 'Assigned Risk Level: ' + stats.risk_indicator + ' with ' + stats.overall_confidence + '% overall confidence score.'
    });

    // Step 5: Country Evidence Foundation Evaluation
    var countryEvidence = verifContext.country_evidence_compliance;
    if (countryEvidence && countryEvidence.country) {
      var ceCountry = countryEvidence.country;
      var ceStatus = 'SUCCESS';
      if (countryEvidence.missing_claims > 0) ceStatus = 'FLAGGED';
      trail.push({
        step: 5,
        title: 'Country Evidence Foundation Evaluation',
        status: ceStatus,
        timestamp: new GlideDateTime().toString(),
        summary: 'Country: ' + ceCountry.country_name + ' (' + ceCountry.iso2 + '/' + ceCountry.iso3 + '). ' +
          countryEvidence.evidence_rules_applied + ' evidence rule(s) evaluated: ' +
          countryEvidence.satisfied_claims + ' satisfied, ' +
          countryEvidence.partial_claims + ' partial, ' +
          countryEvidence.missing_claims + ' missing, ' +
          countryEvidence.unable_to_verify_claims + ' unable to verify. ' +
          'External verification: ' + (countryEvidence.external_verification_available ? 'Available' : 'Not available') + '.'
      });
    } else {
      trail.push({
        step: 5,
        title: 'Country Evidence Foundation Evaluation',
        status: 'SKIPPED',
        timestamp: new GlideDateTime().toString(),
        summary: 'No country-specific evidence reference data available for ' + (family.country_of_origin || 'this jurisdiction') + '. Standard verification rules applied.'
      });
    }

    return trail;
  },

  // ─── HOUSEHOLD & EVIDENCE CORRELATION ────────────────────────────────────
  _correlateHouseholdEvidence: function(verifContext) {
    var family = verifContext.family || {};
    var members = verifContext.members || [];
    var docs = verifContext.documents || [];
    var comparison = verifContext.comparison || {};

    var head = verifContext.head_of_family || {};
    var dependents = members.filter(function(m) { return !m.is_head; });

    // Document coverage check per member
    var memberAudit = [];
    for (var i = 0; i < members.length; i++) {
      var mem = members[i];
      var memName = (mem.first_name + ' ' + mem.last_name).trim();
      var hasDoc = false;
      for (var d = 0; d < docs.length; d++) {
        if (docs[d].member_sys_id === mem.sys_id || docs[d].file_name.toLowerCase().indexOf(mem.last_name.toLowerCase()) !== -1) {
          hasDoc = true;
          break;
        }
      }
      memberAudit.push({
        member_id: mem.sys_id,
        name: memName,
        is_head: mem.is_head,
        relationship: mem.relationship_to_head || (mem.is_head ? 'Self' : 'Dependent'),
        date_of_birth: mem.date_of_birth,
        has_direct_document: hasDoc,
        refugee_id: mem.refugee_id || null,
        verification_status: mem.verification_status || 'pending'
      });
    }

    // Relationship evidence check
    var relationshipEvidencePresent = false;
    var relationshipDocType = '';
    for (var r = 0; r < docs.length; r++) {
      if (docs[r].evidence_type === 'RELATIONSHIP' || docs[r].document_type === 'birth_certificate') {
        relationshipEvidencePresent = true;
        relationshipDocType = docs[r].document_type;
        break;
      }
    }

    // Household size consistency
    var reportedHouseholdSize = family.household_size || 1;
    var actualMemberCount = members.length || 1;
    var householdSizeConsistent = reportedHouseholdSize === actualMemberCount;

    return {
      reported_size: reportedHouseholdSize,
      actual_members_count: actualMemberCount,
      household_size_consistent: householdSizeConsistent,
      head_of_household_verified: head.first_name ? true : false,
      dependents_count: dependents.length,
      relationship_evidence_present: relationshipEvidencePresent,
      relationship_evidence_doc: relationshipDocType,
      member_audit: memberAudit,
      missing_required_documents: comparison.missing_documents || [],
      transliteration_variations_count: comparison.variation_count || 0,
      mismatch_count: comparison.mismatch_count || 0,
      // Country Evidence Compliance Summary
      country_evidence: verifContext.country_evidence_compliance ? {
        country: verifContext.country_evidence_compliance.country ? verifContext.country_evidence_compliance.country.country_name : null,
        evidence_rules_applied: verifContext.country_evidence_compliance.evidence_rules_applied || 0,
        satisfied: verifContext.country_evidence_compliance.satisfied_claims || 0,
        partial: verifContext.country_evidence_compliance.partial_claims || 0,
        missing: verifContext.country_evidence_compliance.missing_claims || 0,
        unable_to_verify: verifContext.country_evidence_compliance.unable_to_verify_claims || 0,
        external_verification_available: verifContext.country_evidence_compliance.external_verification_available || false,
        external_verification_pending: verifContext.country_evidence_compliance.external_verification_pending || false
      } : null
    };
  },

  // ─── DECISION SYNTHESIS & ACTIONABLE PACKAGES ────────────────────────────
  _synthesizeDecisionPackage: function(verifContext, correlation) {
    var stats = verifContext.summary_stats || {};
    var family = verifContext.family || {};
    var head = verifContext.head_of_family || {};
    var fullName = (head.first_name + ' ' + (head.middle_name ? head.middle_name + ' ' : '') + head.last_name).trim() || family.family_name;

    var verdict = 'READY_FOR_APPROVAL';
    var recommendedAction = 'APPROVE_AND_ISSUE_CREDENTIALS';
    var actionRationale = 'All submitted identity attributes match registration records with high confidence. Primary applicant identity and household structure are verified.';

    if (stats.mismatches > 0) {
      verdict = 'REQUIRES_OFFICER_REVIEW';
      recommendedAction = 'MANUAL_OFFICER_INTERVIEW';
      actionRationale = stats.mismatches + ' attribute mismatch(es) detected between intake registration and uploaded documents. Officer manual review is required.';
    } else if (correlation.missing_required_documents.length > 0 && correlation.dependents_count > 0 && !correlation.relationship_evidence_present) {
      verdict = 'ADDITIONAL_DOCUMENTS_REQUESTED';
      recommendedAction = 'REQUEST_ADDITIONAL_DOCUMENT';
      actionRationale = 'Household contains dependents without supporting relationship documentation (e.g. birth certificate). Recommending document request prior to approval.';
    } else if (stats.possible_variations > 0) {
      verdict = 'READY_WITH_VARIATION_NOTE';
      recommendedAction = 'APPROVE_WITH_TRANSLITERATION_NOTE';
      actionRationale = stats.possible_variations + ' spelling or transliteration variation(s) detected (consistent with multilingual naming conventions). Suitable for approval with verification note.';
    }

    // Executive Brief Narrative
    var executiveBrief = 'Bridge360 Verification Agent evaluated application ' + family.application_id + ' (' + fullName + ', ' + family.country_of_origin + '). ' +
      'Evaluated ' + stats.documents_analyzed + ' uploaded document(s) with ' + stats.fields_matched + ' verified attribute match(es). ' +
      'Assigned risk level: ' + stats.risk_indicator + ' (Confidence: ' + stats.overall_confidence + '%). ' + actionRationale;

    // Append country evidence context to executive brief
    if (correlation.country_evidence && correlation.country_evidence.country) {
      executiveBrief += ' Country evidence profile (' + correlation.country_evidence.country + '): ' +
        correlation.country_evidence.evidence_rules_applied + ' rules applied, ' +
        correlation.country_evidence.satisfied + ' satisfied, ' +
        correlation.country_evidence.missing + ' missing.';
      if (correlation.country_evidence.external_verification_pending) {
        executiveBrief += ' External verification request(s) pending.';
      }
    }

    // Draft Artifact 1: Pre-drafted Officer Review Brief
    var draftOfficerNote = '=== BRIDGE360 VERIFICATION AGENT AUDIT ===\\n' +
      'Application ID: ' + family.application_id + '\\n' +
      'Applicant: ' + fullName + ' (' + family.country_of_origin + ')\\n' +
      'Household Size: ' + correlation.actual_members_count + ' member(s)\\n' +
      'Documents Verified: ' + stats.documents_analyzed + ' on file\\n' +
      'Field Matches: ' + stats.fields_matched + ' exact, ' + stats.possible_variations + ' variations, ' + stats.mismatches + ' mismatches\\n' +
      'Agent Recommendation: ' + recommendedAction + '\\n' +
      'Evaluation Timestamp: ' + new GlideDateTime().toString();

    // Draft Artifact 2: Pre-drafted Applicant Document Request Letter (if needed)
    var draftRequestLetter = null;
    if (correlation.missing_required_documents.length > 0 || stats.mismatches > 0) {
      var requestedType = correlation.missing_required_documents.length > 0 ? correlation.missing_required_documents[0].replace(/_/g, ' ').toUpperCase() : 'IDENTITY DOCUMENT';
      draftRequestLetter = {
        recipient_email: head.email || family.email || 'applicant',
        subject: 'Action Required: Additional Document Needed for Bridge360 Application ' + family.application_id,
        suggested_doc_type: requestedType,
        body: 'Dear ' + fullName + ',\\n\\n' +
          'Thank you for submitting your Bridge360 application (' + family.application_id + ').\\n\\n' +
          'To finalize identity verification for your household, our verification team requests a clear, color copy of the following document:\\n' +
          '• ' + requestedType + '\\n\\n' +
          'You can upload this document directly by logging into the Bridge360 Customer Portal using your Application ID.\\n\\n' +
          'Warm regards,\\n' +
          'Bridge360 Verification Team'
      };
    }

    return {
      verdict: verdict,
      recommended_action: recommendedAction,
      action_rationale: actionRationale,
      executive_brief: executiveBrief,
      draft_artifacts: {
        officer_case_note: draftOfficerNote,
        document_request_letter: draftRequestLetter
      }
    };
  },

  // ─── INTERACTIVE AGENT QUERY PROCESSOR ───────────────────────────────────
  _processAgentQuery: function(query, verifContext, correlation, decisionPackage) {
    var q = query.toLowerCase();
    var stats = verifContext.summary_stats || {};
    var comparison = verifContext.comparison || {};
    var head = verifContext.head_of_family || {};
    var family = verifContext.family || {};

    // Query Pattern 1: Variations / Transliterations
    if (q.indexOf('variation') !== -1 || q.indexOf('spelling') !== -1 || q.indexOf('name') !== -1) {
      var varFields = [];
      var fResults = comparison.field_results || [];
      for (var f = 0; f < fResults.length; f++) {
        if (fResults[f].state === 'POSSIBLE_VARIATION') {
          varFields.push(fResults[f].field_name + ': "' + fResults[f].registration_value + '" vs "' + fResults[f].extracted_value + '" (' + fResults[f].detail + ')');
        }
      }
      return {
        query: query,
        category: 'VARIATION_EXPLANATION',
        response: varFields.length > 0
          ? 'The agent identified ' + varFields.length + ' variation(s): ' + varFields.join('; ') + '. In accordance with Bridge360 humanitarian guidelines, cultural spelling and transliteration differences are treated as non-fraudulent variations.'
          : 'No name or spelling variations were detected. All extracted name fields match registration records exactly.'
      };
    }

    // Query Pattern 2: Missing Documents
    if (q.indexOf('missing') !== -1 || q.indexOf('document') !== -1 || q.indexOf('lack') !== -1) {
      var missingList = correlation.missing_required_documents || [];
      var unverifiedMems = correlation.member_audit.filter(function(m) { return !m.has_direct_document; });
      return {
        query: query,
        category: 'DOCUMENT_GAP_ANALYSIS',
        response: 'Missing document analysis: ' +
          (missingList.length > 0 ? 'Missing expected document types: ' + missingList.join(', ') + '. ' : 'All standard identity document types are present. ') +
          (unverifiedMems.length > 0 ? unverifiedMems.length + ' member(s) lack direct document files on record (' + unverifiedMems.map(function(m) { return m.name; }).join(', ') + ').' : 'All registered members have identity documents on file.')
      };
    }

    // Query Pattern 3: Recommendation / Next Steps
    if (q.indexOf('recommend') !== -1 || q.indexOf('next') !== -1 || q.indexOf('action') !== -1 || q.indexOf('should') !== -1) {
      return {
        query: query,
        category: 'RECOMMENDED_ACTION',
        response: 'Agent Recommendation: ' + decisionPackage.recommended_action + '. Rationale: ' + decisionPackage.action_rationale + ' Note: Final decision authority remains solely with the verification officer.'
      };
    }

    // Query Pattern 4: Household / Relationships
    if (q.indexOf('household') !== -1 || q.indexOf('family') !== -1 || q.indexOf('member') !== -1 || q.indexOf('relationship') !== -1) {
      var memSummary = correlation.member_audit.map(function(m) {
        return m.name + ' (' + m.relationship + ', DOB: ' + (m.date_of_birth || 'N/A') + ')';
      }).join(', ');
      return {
        query: query,
        category: 'HOUSEHOLD_SUMMARY',
        response: 'Household Structure for ' + family.family_name + ': ' + correlation.actual_members_count + ' total member(s) (' + memSummary + '). Relationship evidence ' + (correlation.relationship_evidence_present ? 'is present (' + correlation.relationship_evidence_doc + ').' : 'is not separately uploaded.')
      };
    }

    // Default Query Response
    return {
      query: query,
      category: 'GENERAL_SUMMARY',
      response: 'Agent Summary for ' + family.application_id + ': Overall verdict is ' + decisionPackage.verdict + ' with ' + stats.overall_confidence + '% confidence score across ' + stats.documents_analyzed + ' analyzed document(s). ' + decisionPackage.action_rationale
    };
  },

  // ─── ERROR RESPONSE HELPER ───────────────────────────────────────────────
  _errorResponse: function(code, message) {
    gs.warn('Bridge360VerificationAgent error: code=' + code + ' message=' + message);
    return {
      success: false,
      agent_id: this.AGENT_ID,
      error_code: code,
      message: message
    };
  },

  type: 'Bridge360VerificationAgent'
};
`,
});
