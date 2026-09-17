import { Table, StringColumn, IntegerColumn, BooleanColumn, DateColumn, ChoiceColumn, ReferenceColumn } from '@servicenow/sdk/core';

// 1. u_bridge360_family Table
export const u_bridge360_family = Table({
  name: 'u_bridge360_family',
  label: 'Refugee Family',
  schema: {
    u_bridge360_id: StringColumn({ label: 'Primary ID / Refugee ID', maxLength: 40 }),
    u_application_id: StringColumn({ label: 'Application ID', maxLength: 40 }),
    u_family_id: StringColumn({ label: 'Family ID', maxLength: 40 }),
    u_family_name: StringColumn({ label: 'Family Name', maxLength: 100, mandatory: true }),
    u_country_of_origin: StringColumn({ label: 'Country of Origin', maxLength: 100, mandatory: true }),
    u_arrival_date: DateColumn({ label: 'Arrival Date' }),
    u_household_size: IntegerColumn({ label: 'Household Size', defaultValue: 1 }),
    u_primary_language: StringColumn({ label: 'Primary Language', maxLength: 60 }),
    u_immigration_status: ChoiceColumn({
      label: 'Immigration Status',
      choices: {
        asylum_applicant: { label: 'Asylum Applicant' },
        refugee_granted: { label: 'Refugee Status Granted' },
        humanitarian_placement: { label: 'Humanitarian Placement' },
        temporary_protection: { label: 'Temporary Protection' },
      },
    }),
    u_needs_interpreter: BooleanColumn({ label: 'Needs Interpreter', defaultValue: false }),
    u_priority: ChoiceColumn({
      label: 'Priority',
      choices: {
        critical: { label: 'Critical' },
        high: { label: 'High' },
        medium: { label: 'Medium' },
        normal: { label: 'Normal' },
      },
    }),
    u_assigned_officer: StringColumn({ label: 'Assigned Officer', maxLength: 100 }),
    u_registration_status: ChoiceColumn({
      label: 'Registration Status',
      choices: {
        submitted: { label: 'Submitted' },
        under_review: { label: 'Under Review' },
        approved: { label: 'Approved' },
        rejected: { label: 'Rejected' },
      },
    }),
    u_verification_status: ChoiceColumn({
      label: 'Verification Status',
      choices: {
        pending_review: { label: 'Pending Review' },
        in_review: { label: 'In Review' },
        verified: { label: 'Verified' },
        rejected: { label: 'Rejected' },
      },
    }),
    u_case_status: ChoiceColumn({
      label: 'Case Status',
      choices: {
        new: { label: 'New' },
        active: { label: 'Active' },
        closed: { label: 'Closed' },
      },
    }),
    u_email: StringColumn({ label: 'Applicant Email', maxLength: 150 }),
    u_otp_code: StringColumn({ label: 'OTP Code', maxLength: 10 }),
    u_otp_expiry: StringColumn({ label: 'OTP Expiry Epoch ms', maxLength: 20 }),
    u_allow_customer_edit: BooleanColumn({ label: 'Allow Customer Profile Edit', defaultValue: false }),
    u_doc_request_pending: BooleanColumn({ label: 'Document Request Pending', defaultValue: false }),
    u_doc_request_type: StringColumn({ label: 'Requested Document Type', maxLength: 100 }),
    u_doc_request_notes: StringColumn({ label: 'Requested Document Notes', maxLength: 500 }),
  },
});

// 2. u_bridge360_member Table
export const u_bridge360_member = Table({
  name: 'u_bridge360_member',
  label: 'Refugee Family Member',
  schema: {
    u_family: ReferenceColumn({ label: 'Family Record', referenceTable: 'u_bridge360_family' }),
    u_refugee_id: StringColumn({ label: 'Refugee ID', maxLength: 40 }),
    u_is_head: BooleanColumn({ label: 'Is Head of Household', defaultValue: false }),
    u_relationship_to_head: ChoiceColumn({
      label: 'Relationship to Head',
      choices: {
        self: { label: 'Self' },
        spouse: { label: 'Spouse' },
        son: { label: 'Son' },
        daughter: { label: 'Daughter' },
        father: { label: 'Father' },
        mother: { label: 'Mother' },
        sibling: { label: 'Sibling' },
        other: { label: 'Other' },
      },
    }),
    u_first_name: StringColumn({ label: 'First Name', maxLength: 60, mandatory: true }),
    u_middle_name: StringColumn({ label: 'Middle Name', maxLength: 60 }),
    u_last_name: StringColumn({ label: 'Last Name', maxLength: 60, mandatory: true }),
    u_gender: ChoiceColumn({
      label: 'Gender',
      choices: {
        male: { label: 'Male' },
        female: { label: 'Female' },
        other: { label: 'Other' },
      },
    }),
    u_date_of_birth: DateColumn({ label: 'Date of Birth' }),
    u_nationality: StringColumn({ label: 'Nationality', maxLength: 100 }),
    u_passport_number: StringColumn({ label: 'Passport Number', maxLength: 40 }),
    u_national_id: StringColumn({ label: 'National ID', maxLength: 40 }),
    u_mobile_number: StringColumn({ label: 'Mobile Number', maxLength: 30 }),
    u_email: StringColumn({ label: 'Email', maxLength: 100 }),
    u_address: StringColumn({ label: 'Address', maxLength: 255 }),
    u_city: StringColumn({ label: 'City', maxLength: 60 }),
    u_state: StringColumn({ label: 'State', maxLength: 60 }),
    u_postal_code: StringColumn({ label: 'Postal Code', maxLength: 20 }),
    u_verification_status: ChoiceColumn({
      label: 'Verification Status',
      choices: {
        pending: { label: 'Pending' },
        verified: { label: 'Verified' },
        rejected: { label: 'Rejected' },
      },
    }),
  },
});

// 3. u_bridge360_document Table
export const u_bridge360_document = Table({
  name: 'u_bridge360_document',
  label: 'Refugee Identity Document',
  schema: {
    u_family: ReferenceColumn({ label: 'Family Record', referenceTable: 'u_bridge360_family' }),
    u_application_id: StringColumn({ label: 'Application ID', maxLength: 40 }),
    u_member: ReferenceColumn({ label: 'Family Member', referenceTable: 'u_bridge360_member' }),
    u_document_type: ChoiceColumn({
      label: 'Document Type',
      choices: {
        passport: { label: 'Passport' },
        national_id: { label: 'National ID' },
        visa: { label: 'Visa' },
        birth_certificate: { label: 'Birth Certificate' },
        medical_certificate: { label: 'Medical Certificate' },
        police_clearance: { label: 'Police Clearance' },
      },
    }),
    u_file_name: StringColumn({ label: 'File Name', maxLength: 150 }),
    u_file_size: StringColumn({ label: 'File Size', maxLength: 30 }),
    u_verification_status: ChoiceColumn({
      label: 'Verification Status',
      choices: {
        pending: { label: 'Pending' },
        in_review: { label: 'In Review' },
        verified: { label: 'Verified' },
        rejected: { label: 'Rejected' },
      },
    }),
    u_verification_notes: StringColumn({ label: 'Verification Notes', maxLength: 255 }),
    u_extracted_json: StringColumn({ label: 'AI Extracted Field JSON', maxLength: 4000 }),
    u_ocr_text: StringColumn({ label: 'Raw Extracted Document Text', maxLength: 8000 }),
  },
});

// 4. u_bridge360_case Table
export const u_bridge360_case = Table({
  name: 'u_bridge360_case',
  label: 'Refugee Case File',
  schema: {
    u_family: ReferenceColumn({ label: 'Family Record', referenceTable: 'u_bridge360_family' }),
    u_case_id: StringColumn({ label: 'Case ID', maxLength: 40 }),
    u_title: StringColumn({ label: 'Case Title', maxLength: 150, mandatory: true }),
    u_category: ChoiceColumn({
      label: 'Category',
      choices: {
        protection: { label: 'Legal Protection' },
        housing: { label: 'Housing' },
        medical: { label: 'Healthcare' },
        education: { label: 'Education' },
        resettlement: { label: 'Resettlement' },
      },
    }),
    u_status: ChoiceColumn({
      label: 'Status',
      choices: {
        new: { label: 'New' },
        in_progress: { label: 'In Progress' },
        pending_docs: { label: 'Pending Documents' },
        resolved: { label: 'Resolved' },
        closed: { label: 'Closed' },
      },
    }),
    u_priority: ChoiceColumn({
      label: 'Priority',
      choices: {
        critical: { label: 'Critical' },
        high: { label: 'High' },
        medium: { label: 'Medium' },
        normal: { label: 'Normal' },
      },
    }),
    u_assigned_officer: StringColumn({ label: 'Assigned Officer', maxLength: 100 }),
    u_opened_date: DateColumn({ label: 'Opened Date' }),
    u_due_date: DateColumn({ label: 'Due Date' }),
  },
});

// 5. u_bridge360_ticket Table
export const u_bridge360_ticket = Table({
  name: 'u_bridge360_ticket',
  label: 'Customer Support Ticket',
  schema: {
    u_family: ReferenceColumn({ label: 'Family Record', referenceTable: 'u_bridge360_family' }),
    u_ticket_id: StringColumn({ label: 'Ticket ID', maxLength: 40 }),
    u_subject: StringColumn({ label: 'Subject', maxLength: 150, mandatory: true }),
    u_category: ChoiceColumn({
      label: 'Category',
      choices: {
        general: { label: 'General Inquiry' },
        appointment: { label: 'Appointment Request' },
        document_update: { label: 'Document Update' },
        emergency: { label: 'Urgent Protection' },
      },
    }),
    u_status: ChoiceColumn({
      label: 'Status',
      choices: {
        open: { label: 'Open' },
        in_review: { label: 'In Review' },
        answered: { label: 'Answered' },
        closed: { label: 'Closed' },
      },
    }),
    u_description: StringColumn({ label: 'Message / Description', maxLength: 1000 }),
  },
});

// 6. u_bridge360_referral Table
export const u_bridge360_referral = Table({
  name: 'u_bridge360_referral',
  label: 'Partner Agency Referral',
  schema: {
    u_family: ReferenceColumn({ label: 'Family Record', referenceTable: 'u_bridge360_family' }),
    u_agency_name: StringColumn({ label: 'Agency Name', maxLength: 100, mandatory: true }),
    u_service_type: ChoiceColumn({
      label: 'Service Type',
      choices: {
        medical: { label: 'Medical Aid' },
        housing: { label: 'Emergency Shelter' },
        food: { label: 'Food Assistance' },
        legal: { label: 'Legal Counsel' },
        translation: { label: 'Translation Support' },
      },
    }),
    u_status: ChoiceColumn({
      label: 'Referral Status',
      choices: {
        referred: { label: 'Referred' },
        accepted: { label: 'Accepted' },
        in_progress: { label: 'In Progress' },
        completed: { label: 'Completed' },
      },
    }),
  },
});

// 7. u_bridge360_agent_conversation Table
// Server-side memory for the assistant. The browser only holds a conversationId
// (this record's sys_id); the transcript, status, and any pending supervised
// action live here so /agent/start -> /agent/status -> /agent/approve can be
// stateless HTTP calls. Reasoning runs on ServiceNow's native GenAI.
export const u_bridge360_agent_conversation = Table({
  name: 'u_bridge360_agent_conversation',
  label: 'Assistant Conversation',
  schema: {
    u_agent: StringColumn({ label: 'Agent Role', maxLength: 40 }),          // customer | admin | verification
    u_status: StringColumn({ label: 'Run Status', maxLength: 40 }),         // working | input-required | completed | error
    u_language: StringColumn({ label: 'Language', maxLength: 20 }),
    u_source: StringColumn({ label: 'Reasoning Source', maxLength: 20 }),   // servicenow | canned
    u_target_table: StringColumn({ label: 'Target Table', maxLength: 100 }),
    u_target_record: StringColumn({ label: 'Target Record', maxLength: 40 }),
    u_objective: StringColumn({ label: 'Latest Objective', maxLength: 4000 }),
    u_messages: StringColumn({ label: 'Transcript JSON', maxLength: 32000 }),
    u_last_message: StringColumn({ label: 'Latest Agent Message', maxLength: 16000 }),
    u_pending_action: StringColumn({ label: 'Pending Action', maxLength: 60 }),
    u_pending_summary: StringColumn({ label: 'Pending Summary', maxLength: 2000 }),
    u_pending_raw: StringColumn({ label: 'Pending Raw JSON', maxLength: 8000 }),
  },
});
