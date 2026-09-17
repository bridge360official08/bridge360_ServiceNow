import { Table, StringColumn, IntegerColumn, BooleanColumn, DateColumn, ChoiceColumn, ReferenceColumn } from '@servicenow/sdk/core';

/**
 * Country-Specific Identity, Family Evidence & External Verification Supporting Tables
 * Belongs exclusively to the existing Bridge360 application scope.
 */

// 1. u_bridge360_country Table (Factual Country Reference Intelligence)
export const u_bridge360_country = Table({
  name: 'u_bridge360_country',
  label: 'Country Evidence Intelligence',
  schema: {
    u_country_name: StringColumn({ label: 'Country Name', maxLength: 100, mandatory: true }),
    u_iso2: StringColumn({ label: 'ISO-2 Code', maxLength: 2, mandatory: true }),
    u_iso3: StringColumn({ label: 'ISO-3 Code', maxLength: 3, mandatory: true }),
    u_nationality: StringColumn({ label: 'Nationality / Demonym', maxLength: 100, mandatory: true }),
    u_official_languages: StringColumn({ label: 'Official Languages', maxLength: 255 }),
    u_scripts_used: StringColumn({ label: 'Scripts Used', maxLength: 100 }),
    u_transliteration_notes: StringColumn({ label: 'Transliteration Patterns', maxLength: 1000 }),
    u_naming_convention: ChoiceColumn({
      label: 'Naming Convention',
      choices: {
        patronymic: { label: 'Patronymic (Given + Father + Grandfather)' },
        family_surname: { label: 'Given Name + Family Surname' },
        tripartite: { label: 'Tripartite (Given + Middle/Clan + Family)' },
        compound: { label: 'Compound / Matronymic-Patronymic' },
        single_name: { label: 'Mononym / Single Name Structure' },
      },
    }),
    u_civil_registry_info: StringColumn({ label: 'Civil Registration System Info', maxLength: 1000 }),
    u_active: BooleanColumn({ label: 'Active', defaultValue: true }),
    u_notes: StringColumn({ label: 'Caseworker Guidance Notes', maxLength: 1000 }),
  },
});

// 2. u_bridge360_country_document Table (Reference Document Catalog)
export const u_bridge360_country_document = Table({
  name: 'u_bridge360_country_document',
  label: 'Country Reference Document',
  schema: {
    u_country: ReferenceColumn({ label: 'Country', referenceTable: 'u_bridge360_country', mandatory: true }),
    u_document_type: StringColumn({ label: 'Document Type Code', maxLength: 100 }),
    u_document_name: StringColumn({ label: 'Document Name (English)', maxLength: 150, mandatory: true }),
    u_local_name: StringColumn({ label: 'Native / Local Name', maxLength: 150 }),
    u_document_category: ChoiceColumn({
      label: 'Evidence Category',
      choices: {
        identity: { label: 'Primary Identity Evidence' },
        family_relationship: { label: 'Family Relationship Evidence' },
        civil_status: { label: 'Civil Status (Birth/Marriage/Death)' },
        address: { label: 'Residential / Location Evidence' },
        supporting: { label: 'Supporting Humanitarian Evidence' },
      },
    }),
    u_issuing_authority_desc: StringColumn({ label: 'Issuing Authority Description', maxLength: 255 }),
    u_security_features: StringColumn({ label: 'Security & Forensic Features', maxLength: 1000 }),
    u_typical_fields: StringColumn({ label: 'Typical Extracted Fields', maxLength: 1000 }),
    u_validity_period_desc: StringColumn({ label: 'Standard Validity Period', maxLength: 100 }),
    u_electronic_verification_available: BooleanColumn({ label: 'Electronic Verification Feasible', defaultValue: false }),
    u_active: BooleanColumn({ label: 'Active in Catalog', defaultValue: true }),
    u_notes: StringColumn({ label: 'Examination Reference Notes', maxLength: 1000 }),
  },
});

// 3. u_bridge360_evidence_rule Table (Evidence Satisfaction Rules)
export const u_bridge360_evidence_rule = Table({
  name: 'u_bridge360_evidence_rule',
  label: 'Family & Identity Evidence Rule',
  schema: {
    u_country: ReferenceColumn({ label: 'Country', referenceTable: 'u_bridge360_country', mandatory: true }),
    u_claim_type: ChoiceColumn({
      label: 'Evidence Claim Type',
      choices: {
        primary_identity: { label: 'Primary Identity Claim' },
        parent_child: { label: 'Parent-Child Relationship' },
        spousal_union: { label: 'Spousal / Marriage Union' },
        legal_custody: { label: 'Legal Custody / Guardianship' },
        address_verification: { label: 'Residential / Origin Address' },
      },
    }),
    u_description: StringColumn({ label: 'Rule Description', maxLength: 255, mandatory: true }),
    u_primary_document_types: StringColumn({ label: 'Primary Acceptable Types (Comma-separated)', maxLength: 255, mandatory: true }),
    u_alternative_document_types: StringColumn({ label: 'Alternative Acceptable Types (Comma-separated)', maxLength: 255 }),
    u_min_confidence_threshold: IntegerColumn({ label: 'Minimum Confidence Threshold %', defaultValue: 70 }),
    u_strictness: ChoiceColumn({
      label: 'Evaluation Strictness',
      choices: {
        standard: { label: 'Standard Humanitarian Review' },
        flexible_humanitarian: { label: 'Flexible / Disrupted Registry Context' },
        heightened_scrutiny: { label: 'Heightened Scrutiny / Discrepancy Flag' },
      },
    }),
    u_verification_guidance: StringColumn({ label: 'Caseworker Guidance', maxLength: 1000 }),
    u_active: BooleanColumn({ label: 'Rule Active', defaultValue: true }),
  },
});

// 4. u_bridge360_verification_authority Table (Registry & Verification Directory)
export const u_bridge360_verification_authority = Table({
  name: 'u_bridge360_verification_authority',
  label: 'Verification Authority Directory',
  schema: {
    u_authority_name: StringColumn({ label: 'Authority Name', maxLength: 150, mandatory: true }),
    u_country: ReferenceColumn({ label: 'Country of Jurisdiction', referenceTable: 'u_bridge360_country' }),
    u_jurisdiction: StringColumn({ label: 'Jurisdiction / Scope', maxLength: 100 }),
    u_verification_method: ChoiceColumn({
      label: 'Verification Method',
      choices: {
        REFERENCE_ONLY: { label: 'Reference Archive / Document Sample Only' },
        MANUAL_REQUEST: { label: 'Manual Request / Consular Query' },
        AUTHORIZED_API: { label: 'Authorized Live Integration (API)' },
        OTHER: { label: 'Other Bilateral Humanitarian Channel' },
      },
    }),
    u_api_available: BooleanColumn({ label: 'Live API Available', defaultValue: false }),
    u_contact_email: StringColumn({ label: 'Official Inquiry Email', maxLength: 100 }),
    u_contact_portal_url: StringColumn({ label: 'Official Portal / Registry URL', maxLength: 255 }),
    u_response_sla_days: IntegerColumn({ label: 'Estimated Turnaround (Days)', defaultValue: 14 }),
    u_active: BooleanColumn({ label: 'Active', defaultValue: true }),
    u_notes: StringColumn({ label: 'Operating Protocol Notes', maxLength: 1000 }),
  },
});

// 5. u_bridge360_verification_request Table (Protection-Controlled Verification Requests)
export const u_bridge360_verification_request = Table({
  name: 'u_bridge360_verification_request',
  label: 'External Verification Request',
  schema: {
    u_request_id: StringColumn({ label: 'Verification Request ID', maxLength: 40, mandatory: true }),
    u_family: ReferenceColumn({ label: 'Family Application', referenceTable: 'u_bridge360_family', mandatory: true }),
    u_member: ReferenceColumn({ label: 'Target Applicant / Member', referenceTable: 'u_bridge360_member', mandatory: true }),
    u_document: ReferenceColumn({ label: 'Document Under Query', referenceTable: 'u_bridge360_document' }),
    u_country: ReferenceColumn({ label: 'Country', referenceTable: 'u_bridge360_country', mandatory: true }),
    u_country_document: ReferenceColumn({ label: 'Catalog Document Type', referenceTable: 'u_bridge360_country_document' }),
    u_authority: ReferenceColumn({ label: 'Target Verification Authority', referenceTable: 'u_bridge360_verification_authority', mandatory: true }),
    u_request_type: ChoiceColumn({
      label: 'Request Purpose',
      choices: {
        document_authenticity: { label: 'Document Authenticity Verification' },
        civil_status_lookup: { label: 'Civil Status / Registry Cross-Check' },
        unhcr_crosscheck: { label: 'UNHCR Refugee Registry Cross-Check' },
        consular_query: { label: 'Consular / Bilateral Identity Verification' },
      },
    }),
    u_status: ChoiceColumn({
      label: 'Request Status',
      choices: {
        draft: { label: 'Draft' },
        pending_consent: { label: 'Pending Applicant Consent' },
        pending_protection_review: { label: 'Pending Protection Review' },
        pending_dispatch: { label: 'Pending Dispatch' },
        dispatched: { label: 'Dispatched (Inquiry Sent)' },
        in_progress: { label: 'In Progress by Authority' },
        verified: { label: 'Verified & Confirmed' },
        inconclusive: { label: 'Inconclusive / No Record Found' },
        discrepancy_flagged: { label: 'Discrepancy / Authenticity Flagged' },
        cancelled: { label: 'Cancelled / Withdrawn' },
      },
    }),
    u_consent_required: BooleanColumn({ label: 'Applicant Consent Required', defaultValue: true }),
    u_consent_status: ChoiceColumn({
      label: 'Consent Status',
      choices: {
        pending: { label: 'Pending Consent' },
        granted: { label: 'Consent Granted by Applicant' },
        withheld: { label: 'Consent Withheld' },
        exempt_legal: { label: 'Exempt under Statutory Mandate' },
      },
    }),
    u_protection_review_required: BooleanColumn({ label: 'Protection Risk Review Required', defaultValue: true }),
    u_protection_review_status: ChoiceColumn({
      label: 'Protection Review Status',
      choices: {
        pending: { label: 'Pending Protection Review' },
        cleared_safe_to_contact: { label: 'Cleared (Safe to Contact)' },
        flagged_do_not_contact: { label: 'FLAGGED: Do Not Contact Origin State' },
        exempt: { label: 'Exempt (UNHCR / Neutral Channel)' },
      },
    }),
    u_assigned_officer: StringColumn({ label: 'Assigned Officer', maxLength: 100 }),
    u_dispatched_at: DateColumn({ label: 'Dispatched Date' }),
    u_completed_at: DateColumn({ label: 'Completed Date' }),
    u_outcome_summary: StringColumn({ label: 'Verification Outcome Summary', maxLength: 1000 }),
    u_officer_notes: StringColumn({ label: 'Internal Officer Notes', maxLength: 1000 }),
  },
});

// 6. u_bridge360_country_document_field Table (Country-Aware Document Field Catalog)
export const u_bridge360_country_document_field = Table({
  name: 'u_bridge360_country_document_field',
  label: 'Country Document Field Definition',
  schema: {
    u_country_document: ReferenceColumn({ label: 'Country Document', referenceTable: 'u_bridge360_country_document', mandatory: true }),
    u_field_name: StringColumn({ label: 'Field Name', maxLength: 100, mandatory: true }),
    u_field_type: ChoiceColumn({
      label: 'Field Type',
      mandatory: true,
      choices: {
        text: { label: 'Text' },
        date: { label: 'Date' },
        image: { label: 'Image' },
      },
    }),
    u_active: BooleanColumn({ label: 'Active', defaultValue: true }),
    u_notes: StringColumn({ label: 'Field Examination Notes', maxLength: 1000 }),
  },
});

