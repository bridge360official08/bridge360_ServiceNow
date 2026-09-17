import { BusinessRule } from '@servicenow/sdk/core';

/**
 * Business Rules for u_bridge360_verification_request
 * Enforces refugee protection and applicant consent guardrails.
 */

export const br_enforce_consent_and_protection = BusinessRule({
  $id: 'br_enforce_consent_and_protection',
  name: 'Bridge360 - Enforce Protection & Consent Before Dispatch',
  table: 'u_bridge360_verification_request',
  when: 'before',
  action: ['insert', 'update'],
  active: true,
  script: `(function executeRule(current, previous /*null when async*/) {
    // Auto-generate request ID if not provided
    if (!current.getValue('u_request_id')) {
      var randSuffix = Math.floor(100000 + Math.random() * 900000);
      current.setValue('u_request_id', 'VR-2026-' + randSuffix);
    }

    var status = current.getValue('u_status');
    var isDispatching = (status === 'dispatched' || status === 'in_progress');

    if (isDispatching) {
      var consentReq = current.getValue('u_consent_required') === 'true' || current.getValue('u_consent_required') === true;
      var consentStatus = current.getValue('u_consent_status');

      if (consentReq && consentStatus !== 'granted' && consentStatus !== 'exempt_legal') {
        gs.addErrorMessage('Cannot dispatch external verification request: Applicant consent is required and currently pending or withheld.');
        current.setAbortAction(true);
        return;
      }

      var protectionReq = current.getValue('u_protection_review_required') === 'true' || current.getValue('u_protection_review_required') === true;
      var protectionStatus = current.getValue('u_protection_review_status');

      if (protectionReq && protectionStatus !== 'cleared_safe_to_contact' && protectionStatus !== 'exempt') {
        gs.addErrorMessage('Cannot dispatch external verification request: Protection review is pending or origin contact is flagged as unsafe.');
        current.setAbortAction(true);
        return;
      }

      // Record dispatch timestamp if empty
      if (!current.getValue('u_dispatched_at')) {
        current.setValue('u_dispatched_at', new GlideDate().getLocalDate());
      }
    }
  })(current, previous);`,
});
