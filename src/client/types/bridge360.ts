export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Normal' | 'Low';

export type ApplicationStatus = 
  | 'Submitted' 
  | 'Under Review' 
  | 'Verification' 
  | 'Approved' 
  | 'Rejected' 
  | 'Needs Information';

export type VerificationStatus = 
  | 'Pending' 
  | 'In Review' 
  | 'Verified' 
  | 'Rejected' 
  | 'Requires Review';

export type ExtractionCategory = 'High' | 'Medium' | 'Not Found';

export interface OCRExtractedField {
  key: string;
  label: string;
  value: string;
  confidence: number;
  category: ExtractionCategory;
  verified: boolean;
}

export interface DocumentRecord {
  id: string;
  applicationId: string;
  familyId: string;
  memberId?: string;
  memberName?: string;
  documentType: 
    | 'Passport' 
    | 'National ID' 
    | 'Visa' 
    | 'Birth Certificate' 
    | 'Medical Certificate' 
    | 'Police Clearance' 
    | 'Education Certificate' 
    | 'Supporting Document'
    | string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  verificationStatus: VerificationStatus;
  extractedFields: OCRExtractedField[];
  extractedJson?: string;
  ocrRawText?: string;
  previewUrl?: string;
  fileDataUrl?: string;
  notes?: string;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  refugeeId?: string;
  isHeadOfFamily: boolean;
  relationshipToHead: 'Self' | 'Spouse' | 'Son' | 'Daughter' | 'Father' | 'Mother' | 'Sibling' | 'Other' | 'Dependant';
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  nationalId?: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  mobileNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  preferredLanguage?: string;
  documentIds: string[];
  photoUrl?: string;
  specialNotes?: string;
}

export interface FamilyRecord {
  id: string;
  sys_id?: string;
  bridge360Id: string;
  applicationId: string;
  familyId?: string;
  familyName: string;
  countryOfOrigin: string;
  arrivalDate: string;
  householdSize: number;
  primaryLanguage: string;
  immigrationStatus: string;
  needsInterpreter: boolean;
  priority: PriorityLevel;
  assignedOfficer: string;
  registrationStatus: ApplicationStatus;
  verificationStatus: VerificationStatus;
  caseStatus: 'New' | 'Active' | 'Closed';
  headOfFamily: FamilyMember;
  members: FamilyMember[];
  allowCustomerEdit?: boolean;
  docRequestPending?: boolean;
  docRequestType?: string;
  docRequestNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationRecord {
  id: string;
  familyId: string;
  bridge360Id: string;
  familyName: string;
  countryOfOrigin: string;
  headOfFamilyName: string;
  email: string;
  phone: string;
  householdSize: number;
  status: ApplicationStatus;
  submittedAt: string;
  intakeChannel: 'Customer Portal' | 'Admin Assisted';
  documents: DocumentRecord[];
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface CaseTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  assignedTo?: string;
}

export interface CaseRecord {
  id: string;
  familyId: string;
  familyName: string;
  category: 'Immigration' | 'Housing' | 'Healthcare' | 'Education' | 'Legal' | 'Employment';
  title: string;
  description: string;
  priority: PriorityLevel;
  status: 'Open' | 'In Progress' | 'Pending Action' | 'Resolved' | 'Closed';
  assignedOfficer: string;
  openedDate: string;
  dueDate: string;
  tasks: CaseTask[];
}

export interface PartnerAgency {
  id: string;
  name: string;
  type: 'Healthcare' | 'Education' | 'Housing' | 'Legal Aid' | 'Employment' | 'Language Support';
  location: string;
  contactEmail: string;
  contactPhone: string;
  availableCapacity: number;
  status: 'Active' | 'Busy' | 'Inactive';
}

export interface ReferralRecord {
  id: string;
  familyId: string;
  familyName: string;
  caseId?: string;
  partnerAgencyId: string;
  partnerAgencyName: string;
  serviceType: string;
  priority: PriorityLevel;
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';
  createdDate: string;
  notes?: string;
}

export interface AppointmentRecord {
  id: string;
  familyId: string;
  familyName: string;
  title: string;
  type: 'Interview' | 'Medical Check' | 'Medical' | 'Orientation' | 'Legal Review' | 'Legal' | 'Case Meeting';
  date: string;
  time: string;
  location: string;
  officer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  exposedToCustomer: boolean;
}

export interface TicketResponse {
  id: string;
  author: string;
  role: 'customer' | 'admin';
  message: string;
  timestamp: string;
}

export interface TicketRecord {
  id: string;
  sys_id?: string;
  familyId: string;
  applicationId: string;
  familyName: string;
  category: 'Document Issue' | 'Status Inquiry' | 'Appointment Request' | 'General Support';
  subject: string;
  description: string;
  attachmentName?: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

export interface TimelineEvent {
  id: string;
  familyId: string;
  title: string;
  description: string;
  type: 'submission' | 'ocr' | 'verification' | 'case' | 'referral' | 'appointment' | 'ticket' | 'note';
  timestamp: string;
  actor: string;
}

export interface FamilyNote {
  id: string;
  familyId: string;
  author: string;
  text: string;
  timestamp: string;
}

// ── Country Intelligence & Evidence Foundation Types ───────────────────────

export interface CountryRecord {
  id: string;
  countryName: string;
  iso2: string;
  iso3: string;
  nationality: string;
  officialLanguages: string;
  scriptsUsed: string;
  transliterationNotes?: string;
  namingConvention: 'patronymic' | 'family_surname' | 'tripartite' | 'compound' | 'single_name';
  civilRegistryInfo?: string;
  active: boolean;
  notes?: string;
}

export interface CountryDocumentRecord {
  id: string;
  countryId: string;
  countryName: string;
  documentType?: string;
  documentName: string;
  localName?: string;
  documentCategory: 'identity' | 'family_relationship' | 'civil_status' | 'address' | 'supporting';
  issuingAuthorityDesc?: string;
  securityFeatures?: string;
  typicalFields?: string;
  validityPeriodDesc?: string;
  electronicVerificationAvailable: boolean;
  active: boolean;
  notes?: string;
}

export interface CountryDocumentFieldRecord {
  id: string;
  countryDocumentId: string;
  fieldName: string;
  fieldType: 'text' | 'date' | 'image';
  active: boolean;
  notes?: string;
}

export interface EvidenceRuleRecord {
  id: string;
  countryId: string;
  countryName: string;
  claimType: 'primary_identity' | 'parent_child' | 'spousal_union' | 'legal_custody' | 'address_verification';
  description: string;
  primaryDocumentTypes: string[];
  alternativeDocumentTypes: string[];
  minConfidenceThreshold: number;
  strictness: 'standard' | 'flexible_humanitarian' | 'heightened_scrutiny';
  verificationGuidance?: string;
  active: boolean;
}

export interface VerificationAuthorityRecord {
  id: string;
  authorityName: string;
  countryId?: string;
  countryName?: string;
  jurisdiction: string;
  verificationMethod: 'REFERENCE_ONLY' | 'MANUAL_REQUEST' | 'AUTHORIZED_API' | 'OTHER';
  apiAvailable: boolean;
  contactEmail?: string;
  contactPortalUrl?: string;
  responseSlaDays: number;
  active: boolean;
  notes?: string;
}

export interface VerificationRequestRecord {
  id: string;
  requestId: string;
  familyId: string;
  applicationId: string;
  familyName: string;
  memberId: string;
  memberName: string;
  documentId?: string;
  documentName?: string;
  countryId: string;
  countryName: string;
  countryDocumentId?: string;
  countryDocumentName?: string;
  authorityId: string;
  authorityName: string;
  requestType: 'document_authenticity' | 'civil_status_lookup' | 'unhcr_crosscheck' | 'consular_query';
  status: 'draft' | 'pending_consent' | 'pending_protection_review' | 'pending_dispatch' | 'dispatched' | 'in_progress' | 'verified' | 'inconclusive' | 'discrepancy_flagged' | 'cancelled';
  consentRequired: boolean;
  consentStatus: 'pending' | 'granted' | 'withheld' | 'exempt_legal';
  protectionReviewRequired: boolean;
  protectionReviewStatus: 'pending' | 'cleared_safe_to_contact' | 'flagged_do_not_contact' | 'exempt';
  assignedOfficer?: string;
  dispatchedAt?: string;
  completedAt?: string;
  outcomeSummary?: string;
  officerNotes?: string;
  createdAt: string;
}
