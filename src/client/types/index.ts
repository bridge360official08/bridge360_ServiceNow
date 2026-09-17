export interface StepItem {
  id: number;
  label: string;
  description?: string;
}

export type NavTab = 
  | 'dashboard'
  | 'applications'
  | 'documents'
  | 'families'
  | 'extraction'
  | 'verification'
  | 'wizard'
  | 'settings';

export type ApplicationStatus = 
  | 'draft'
  | 'pending'
  | 'processing'
  | 'needs_verification'
  | 'verified'
  | 'approved'
  | 'rejected';

export type DocumentType = 
  | 'passport'
  | 'birth_certificate'
  | 'national_id'
  | 'marriage_certificate'
  | 'utility_bill'
  | 'income_proof';

export type DocumentStatus = 
  | 'uploaded'
  | 'processing'
  | 'extracted'
  | 'flagged'
  | 'verified';

export interface Application {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  familyGroup: string;
  status: ApplicationStatus;
  documentsCount: number;
  confidenceScore: number; // 0 - 100
  updatedAt: string;
  createdAt: string;
  assignedTo?: string;
  notes?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  applicationId: string;
  applicantName: string;
  status: DocumentStatus;
  confidenceScore: number; // 0 - 100
  uploadedAt: string;
  fileSize: string;
  fileUrl?: string;
}

export interface ExtractedField {
  id: string;
  fieldName: string;
  extractedValue: string;
  confidenceScore: number; // 0 - 100
  status: 'accepted' | 'edited' | 'rejected' | 'pending';
  sourceBoundingBox?: { top: number; left: number; width: number; height: number; page: number };
}

export interface FamilyGroup {
  id: string;
  familyName: string;
  primaryApplicant: string;
  membersCount: number;
  applicationsCount: number;
  status: string;
  registeredDate: string;
}

export interface ActivityLog {
  id: string;
  type: 'application' | 'document' | 'verification' | 'system';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface StatItem {
  id: string;
  title: string;
  value: string | number;
  changePercent?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  subtext?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}
