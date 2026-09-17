import { Application, DocumentItem, ExtractedField, FamilyGroup, ActivityLog, StatItem } from '../types';

export const MOCK_STAT_ITEMS: StatItem[] = [
  {
    id: 'total-apps',
    title: 'Total Applications',
    value: '1,284',
    changePercent: '+12.5%',
    trend: 'up',
    icon: 'FileText',
    subtext: 'vs. last month'
  },
  {
    id: 'pending-docs',
    title: 'Pending Documents',
    value: '42',
    changePercent: '-5.2%',
    trend: 'down',
    icon: 'Clock',
    subtext: 'awaiting processing'
  },
  {
    id: 'processing',
    title: 'Processing',
    value: '18',
    changePercent: '+3.1%',
    trend: 'up',
    icon: 'Cpu',
    subtext: 'AI Extraction active'
  },
  {
    id: 'needs-verification',
    title: 'Needs Verification',
    value: '12',
    changePercent: '12 items',
    trend: 'neutral',
    icon: 'AlertTriangle',
    subtext: 'low confidence fields'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'APP-2026-0801',
    applicantName: 'Prawin Balaji',
    applicantEmail: 'prawin.balaji@example.com',
    applicantPhone: '+91 98765 43210',
    familyGroup: 'Balaji Family',
    status: 'needs_verification',
    documentsCount: 4,
    confidenceScore: 88,
    updatedAt: '10 minutes ago',
    createdAt: '2026-08-12',
    assignedTo: 'Sarah Jenkins'
  },
  {
    id: 'APP-2026-0802',
    applicantName: 'Elena Rostova',
    applicantEmail: 'elena.rostova@example.com',
    applicantPhone: '+1 (555) 234-5678',
    familyGroup: 'Rostova Family',
    status: 'processing',
    documentsCount: 3,
    confidenceScore: 94,
    updatedAt: '25 minutes ago',
    createdAt: '2026-08-12',
    assignedTo: 'Alex Morgan'
  },
  {
    id: 'APP-2026-0803',
    applicantName: 'Marcus Vance',
    applicantEmail: 'marcus.v@example.com',
    applicantPhone: '+44 20 7946 0912',
    familyGroup: 'Vance Family',
    status: 'approved',
    documentsCount: 5,
    confidenceScore: 99,
    updatedAt: '1 hour ago',
    createdAt: '2026-08-11',
    assignedTo: 'David Miller'
  },
  {
    id: 'APP-2026-0804',
    applicantName: 'Amina Al-Mansoor',
    applicantEmail: 'amina.mansoor@example.com',
    applicantPhone: '+971 50 123 4567',
    familyGroup: 'Al-Mansoor Family',
    status: 'verified',
    documentsCount: 3,
    confidenceScore: 96,
    updatedAt: '2 hours ago',
    createdAt: '2026-08-11',
    assignedTo: 'Sarah Jenkins'
  },
  {
    id: 'APP-2026-0805',
    applicantName: 'Kenji Takahashi',
    applicantEmail: 'kenji.t@example.com',
    applicantPhone: '+81 90 1234 5678',
    familyGroup: 'Takahashi Family',
    status: 'pending',
    documentsCount: 2,
    confidenceScore: 78,
    updatedAt: '4 hours ago',
    createdAt: '2026-08-10',
    assignedTo: 'Unassigned'
  },
  {
    id: 'APP-2026-0806',
    applicantName: 'Sofia Rossi',
    applicantEmail: 'sofia.rossi@example.com',
    applicantPhone: '+39 06 6987 6543',
    familyGroup: 'Rossi Family',
    status: 'rejected',
    documentsCount: 1,
    confidenceScore: 52,
    updatedAt: 'Yesterday',
    createdAt: '2026-08-09',
    assignedTo: 'David Miller'
  }
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'DOC-901',
    name: 'Passport_Prawin_Balaji.pdf',
    type: 'passport',
    applicationId: 'APP-2026-0801',
    applicantName: 'Prawin Balaji',
    status: 'flagged',
    confidenceScore: 78,
    uploadedAt: 'Today, 10:14 AM',
    fileSize: '2.4 MB'
  },
  {
    id: 'DOC-902',
    name: 'Birth_Certificate_Balaji.jpg',
    type: 'birth_certificate',
    applicationId: 'APP-2026-0801',
    applicantName: 'Prawin Balaji',
    status: 'verified',
    confidenceScore: 96,
    uploadedAt: 'Today, 10:15 AM',
    fileSize: '1.8 MB'
  },
  {
    id: 'DOC-903',
    name: 'National_ID_Elena_R.pdf',
    type: 'national_id',
    applicationId: 'APP-2026-0802',
    applicantName: 'Elena Rostova',
    status: 'extracted',
    confidenceScore: 94,
    uploadedAt: 'Today, 09:45 AM',
    fileSize: '3.1 MB'
  },
  {
    id: 'DOC-904',
    name: 'Marriage_Cert_Vance.pdf',
    type: 'marriage_certificate',
    applicationId: 'APP-2026-0803',
    applicantName: 'Marcus Vance',
    status: 'verified',
    confidenceScore: 99,
    uploadedAt: 'Yesterday, 04:30 PM',
    fileSize: '4.0 MB'
  },
  {
    id: 'DOC-905',
    name: 'Utility_Bill_Proof.pdf',
    type: 'utility_bill',
    applicationId: 'APP-2026-0805',
    applicantName: 'Kenji Takahashi',
    status: 'processing',
    confidenceScore: 62,
    uploadedAt: 'Yesterday, 02:15 PM',
    fileSize: '1.2 MB'
  }
];

export const MOCK_EXTRACTED_FIELDS: ExtractedField[] = [
  {
    id: 'field-1',
    fieldName: 'Full Name',
    extractedValue: 'Prawin Balaji',
    confidenceScore: 98,
    status: 'accepted',
    sourceBoundingBox: { top: 12, left: 15, width: 35, height: 8, page: 1 }
  },
  {
    id: 'field-2',
    fieldName: 'Date of Birth',
    extractedValue: '20/09/2003',
    confidenceScore: 95,
    status: 'accepted',
    sourceBoundingBox: { top: 24, left: 15, width: 25, height: 6, page: 1 }
  },
  {
    id: 'field-3',
    fieldName: 'Document / Passport Number',
    extractedValue: 'Z9847102B',
    confidenceScore: 89,
    status: 'accepted',
    sourceBoundingBox: { top: 34, left: 15, width: 30, height: 6, page: 1 }
  },
  {
    id: 'field-4',
    fieldName: 'Residential Address',
    extractedValue: '42 Broad Street, Suite 300, New York, NY 10004',
    confidenceScore: 62,
    status: 'pending',
    sourceBoundingBox: { top: 46, left: 15, width: 60, height: 12, page: 1 }
  },
  {
    id: 'field-5',
    fieldName: 'Expiry Date',
    extractedValue: '15/11/2031',
    confidenceScore: 94,
    status: 'accepted',
    sourceBoundingBox: { top: 62, left: 15, width: 25, height: 6, page: 1 }
  },
  {
    id: 'field-6',
    fieldName: 'Issuing Authority / Country',
    extractedValue: 'Govt. Administration Office',
    confidenceScore: 48,
    status: 'pending',
    sourceBoundingBox: { top: 72, left: 15, width: 45, height: 8, page: 1 }
  }
];

export const MOCK_FAMILIES: FamilyGroup[] = [
  {
    id: 'FAM-101',
    familyName: 'Balaji Family',
    primaryApplicant: 'Prawin Balaji',
    membersCount: 4,
    applicationsCount: 2,
    status: 'Active',
    registeredDate: '2026-08-01'
  },
  {
    id: 'FAM-102',
    familyName: 'Rostova Family',
    primaryApplicant: 'Elena Rostova',
    membersCount: 3,
    applicationsCount: 1,
    status: 'Active',
    registeredDate: '2026-08-03'
  },
  {
    id: 'FAM-103',
    familyName: 'Vance Family',
    primaryApplicant: 'Marcus Vance',
    membersCount: 5,
    applicationsCount: 3,
    status: 'Verified',
    registeredDate: '2026-07-28'
  }
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    type: 'document',
    title: 'Document Uploaded',
    description: 'Passport_Prawin_Balaji.pdf uploaded for APP-2026-0801',
    timestamp: '10 minutes ago',
    user: 'Prawin Balaji'
  },
  {
    id: 'act-2',
    type: 'verification',
    title: 'AI Field Extraction Completed',
    description: 'Extracted 6 key identity fields with overall 88% confidence',
    timestamp: '12 minutes ago',
    user: 'Bridge360 AI Service'
  },
  {
    id: 'act-3',
    type: 'application',
    title: 'Status Updated',
    description: 'Application APP-2026-0803 moved to Approved',
    timestamp: '1 hour ago',
    user: 'David Miller'
  },
  {
    id: 'act-4',
    type: 'system',
    title: 'System Audit Check',
    description: 'Routine document OCR confidence audit passed',
    timestamp: '3 hours ago',
    user: 'System'
  }
];
