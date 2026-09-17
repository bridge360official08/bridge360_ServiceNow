import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  snSubmitRegistration,
  snVerifyDocument,
  snGetTableRecords,
  snInsertTableRecord,
  snUpdateTableRecord,
  snToggleCustomerEdit,
  snUploadCustomerDoc,
  snUpdateCustomerProfile,
  snRequestAdditionalDocuments,
  snRunAgenticWorkflow,
  snCreateTicket,
  snReplyTicket,
  SNFamily,
  SNMember,
  SNDocument,
  SNCase,
  SNTicket
} from '../services/snApi';
import { AgentOrchestrator, AgentResult } from '../services/AgentOrchestrator';
import {
  FamilyRecord,
  ApplicationRecord,
  DocumentRecord,
  CaseRecord,
  ReferralRecord,
  AppointmentRecord,
  TicketRecord,
  TimelineEvent,
  PartnerAgency,
  FamilyNote,
  ApplicationStatus,
  VerificationStatus,
  OCRExtractedField,
  FamilyMember,
} from '../types/bridge360';
import { SupportedLanguage, SUPPORTED_LANGUAGES, translations, loadTranslationBundle } from '../utils/i18n';
import { CentralTranslationEngine } from '../services/CentralTranslationEngine';

// Initial Mock Seed Data
const INITIAL_PARTNERS: PartnerAgency[] = [
  {
    id: 'PA-01',
    name: 'Red Cross Humanitarian Services',
    type: 'Legal Aid',
    location: 'Central Metro Hub',
    contactEmail: 'intake@redcross.org',
    contactPhone: '+1 800 555 0199',
    availableCapacity: 45,
    status: 'Active',
  },
  {
    id: 'PA-02',
    name: 'St. Jude Community Health Clinic',
    type: 'Healthcare',
    location: 'Northside Medical Center',
    contactEmail: 'refugee-care@stjudehealth.org',
    contactPhone: '+1 800 555 0244',
    availableCapacity: 18,
    status: 'Active',
  },
  {
    id: 'PA-03',
    name: 'Hope Housing Alliance',
    type: 'Housing',
    location: 'Eastside Transitional Housing',
    contactEmail: 'placement@hopehousing.org',
    contactPhone: '+1 800 555 0811',
    availableCapacity: 8,
    status: 'Busy',
  },
  {
    id: 'PA-04',
    name: 'Global Language & Interpreter Network',
    type: 'Language Support',
    location: 'Virtual / Statewide',
    contactEmail: 'interpreters@globalnet.org',
    contactPhone: '+1 800 555 0999',
    availableCapacity: 120,
    status: 'Active',
  },
];

const INITIAL_FAMILIES: FamilyRecord[] = [
  {
    id: 'APP-2026-000001',
    bridge360Id: 'RID-2026-000001',
    applicationId: 'APP-2026-000001',
    familyName: 'Al-Hassan Family',
    countryOfOrigin: 'Syrian Arab Republic',
    arrivalDate: '2026-07-15',
    householdSize: 4,
    primaryLanguage: 'Arabic',
    immigrationStatus: 'Asylum Applicant',
    needsInterpreter: true,
    priority: 'High',
    assignedOfficer: 'Sarah Jenkins',
    registrationStatus: 'Submitted',
    verificationStatus: 'Pending',
    caseStatus: 'Active',
    createdAt: '2026-08-10T09:30:00Z',
    updatedAt: '2026-08-12T14:20:00Z',
    headOfFamily: {
      id: 'MEM-01-HEAD',
      familyId: 'FAM-2026-000001',
      isHeadOfFamily: true,
      relationshipToHead: 'Self',
      firstName: 'Ahmad',
      middleName: 'Tariq',
      lastName: 'Al-Hassan',
      gender: 'Male',
      dateOfBirth: '1985-03-15',
      nationality: 'Syrian Arab Republic',
      passportNumber: 'N12345678',
      nationalId: 'SYR-9876543',
      maritalStatus: 'Married',
      mobileNumber: '+1 (555) 234-5678',
      email: 'ahmad.alhassan@example.com',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62704',
      preferredLanguage: 'Arabic',
      documentIds: ['DOC-01', 'DOC-02'],
    },
    members: [
      {
        id: 'MEM-01-02',
        familyId: 'FAM-2026-000001',
        isHeadOfFamily: false,
        relationshipToHead: 'Spouse',
        firstName: 'Fatima',
        lastName: 'Al-Hassan',
        gender: 'Female',
        dateOfBirth: '1988-06-22',
        nationality: 'Syrian Arab Republic',
        passportNumber: 'N12345679',
        maritalStatus: 'Married',
        mobileNumber: '+1 (555) 234-5679',
        email: 'fatima.alhassan@example.com',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62704',
        preferredLanguage: 'Arabic',
        documentIds: ['DOC-03'],
      },
      {
        id: 'MEM-01-03',
        familyId: 'FAM-2026-000001',
        isHeadOfFamily: false,
        relationshipToHead: 'Son',
        firstName: 'Zayd',
        lastName: 'Al-Hassan',
        gender: 'Male',
        dateOfBirth: '2015-11-04',
        nationality: 'Syrian Arab Republic',
        maritalStatus: 'Single',
        mobileNumber: '',
        email: '',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62704',
        preferredLanguage: 'Arabic',
        documentIds: [],
        specialNotes: 'Requires pediatric vaccination review',
      },
      {
        id: 'MEM-01-04',
        familyId: 'FAM-2026-000001',
        isHeadOfFamily: false,
        relationshipToHead: 'Daughter',
        firstName: 'Nour',
        lastName: 'Al-Hassan',
        gender: 'Female',
        dateOfBirth: '2018-02-18',
        nationality: 'Syrian Arab Republic',
        maritalStatus: 'Single',
        mobileNumber: '',
        email: '',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62704',
        preferredLanguage: 'Arabic',
        documentIds: [],
      },
    ],
  },
  {
    id: 'APP-2026-000002',
    bridge360Id: 'RID-2026-000002',
    applicationId: 'APP-2026-000002',
    familyName: 'Rishi Family',
    countryOfOrigin: 'India',
    arrivalDate: '2026-06-01',
    householdSize: 4,
    primaryLanguage: 'Hindi / English',
    immigrationStatus: 'Verified Humanitarian Placement',
    needsInterpreter: false,
    priority: 'Normal',
    assignedOfficer: 'Michael Vance',
    registrationStatus: 'Approved',
    verificationStatus: 'Verified',
    caseStatus: 'Active',
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-08-11T16:00:00Z',
    headOfFamily: {
      id: 'MEM-02-HEAD',
      familyId: 'FAM-2026-000002',
      isHeadOfFamily: true,
      relationshipToHead: 'Self',
      firstName: 'Rajesh',
      middleName: 'Kumar',
      lastName: 'Rishi',
      gender: 'Male',
      dateOfBirth: '1982-09-12',
      nationality: 'India',
      passportNumber: 'Z98765432',
      nationalId: 'IND-4567890',
      maritalStatus: 'Married',
      mobileNumber: '+1 (555) 987-6543',
      email: 'rajesh.rishi@example.com',
      address: '104 Beacon Street, Apt 3B',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      preferredLanguage: 'English',
      documentIds: ['DOC-04'],
    },
    members: [],
  },
  {
    id: 'APP-2026-000003',
    bridge360Id: 'RID-2026-000003',
    applicationId: 'APP-2026-000003',
    familyName: 'Prawin Family',
    countryOfOrigin: 'Sri Lanka',
    arrivalDate: '2026-08-02',
    householdSize: 3,
    primaryLanguage: 'Tamil',
    immigrationStatus: 'Pending Verification',
    needsInterpreter: true,
    priority: 'Critical',
    assignedOfficer: 'Elena Rostova',
    registrationStatus: 'Under Review',
    verificationStatus: 'In Review',
    caseStatus: 'New',
    createdAt: '2026-08-05T11:15:00Z',
    updatedAt: '2026-08-13T10:00:00Z',
    headOfFamily: {
      id: 'MEM-03-HEAD',
      familyId: 'FAM-2026-000003',
      isHeadOfFamily: true,
      relationshipToHead: 'Self',
      firstName: 'Prawin',
      lastName: 'Kumar',
      gender: 'Male',
      dateOfBirth: '1990-04-05',
      nationality: 'Sri Lanka',
      passportNumber: 'K44332211',
      maritalStatus: 'Married',
      mobileNumber: '+1 (555) 345-6789',
      email: 'prawin.kumar@example.com',
      address: '55 Lakeview Avenue',
      city: 'Peoria',
      state: 'IL',
      postalCode: '61602',
      preferredLanguage: 'Tamil',
      documentIds: ['DOC-05'],
    },
    members: [],
  },
];

const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'DOC-01',
    applicationId: 'APP-2026-000001',
    familyId: 'FAM-2026-000001',
    memberId: 'MEM-01-HEAD',
    memberName: 'Ahmad Al-Hassan',
    documentType: 'Passport',
    fileName: 'ahmad_passport_scan.pdf',
    fileSize: '2.4 MB',
    uploadedAt: '2026-08-10T09:32:00Z',
    verificationStatus: 'Pending',
    ocrRawText: `PASSPORT - SYRIAN ARAB REPUBLIC
Surname: AL-HASSAN
Given Names: AHMAD TARIQ
Date of Birth: 15 MAR 1985
Sex: M
Place of Birth: DAMASCUS
Passport No: N12345678
Date of Expiry: 14 MAR 2028`,
    extractedFields: [
      { key: 'first_name', label: 'First Name', value: 'Ahmad', confidence: 0.96, category: 'High', verified: false },
      { key: 'last_name', label: 'Last Name', value: 'Al-Hassan', confidence: 0.98, category: 'High', verified: false },
      { key: 'dob', label: 'Date of Birth', value: '1985-03-15', confidence: 0.97, category: 'High', verified: false },
      { key: 'gender', label: 'Gender', value: 'Male', confidence: 0.95, category: 'High', verified: false },
      { key: 'nationality', label: 'Nationality', value: 'Syrian Arab Republic', confidence: 0.94, category: 'High', verified: false },
      { key: 'passport_no', label: 'Passport Number', value: 'N12345678', confidence: 0.99, category: 'High', verified: false },
      { key: 'address', label: 'Home Address', value: 'Damascus, District 4', confidence: 0.72, category: 'Medium', verified: false },
      { key: 'national_id', label: 'National ID', value: '', confidence: 0, category: 'Not Found', verified: false },
    ],
  },
  {
    id: 'DOC-02',
    applicationId: 'APP-2026-000001',
    familyId: 'FAM-2026-000001',
    memberId: 'MEM-01-HEAD',
    memberName: 'Ahmad Al-Hassan',
    documentType: 'National ID',
    fileName: 'ahmad_national_id.jpg',
    fileSize: '1.1 MB',
    uploadedAt: '2026-08-10T09:34:00Z',
    verificationStatus: 'Pending',
    extractedFields: [
      { key: 'national_id', label: 'National ID', value: 'SYR-9876543', confidence: 0.92, category: 'High', verified: false },
    ],
  },
  {
    id: 'DOC-04',
    applicationId: 'APP-2026-000002',
    familyId: 'FAM-2026-000002',
    memberId: 'MEM-02-HEAD',
    memberName: 'Rajesh Rishi',
    documentType: 'Passport',
    fileName: 'rishi_passport.pdf',
    fileSize: '3.1 MB',
    uploadedAt: '2026-07-01T10:05:00Z',
    verificationStatus: 'Verified',
    extractedFields: [
      { key: 'first_name', label: 'First Name', value: 'Rajesh', confidence: 0.99, category: 'High', verified: true },
      { key: 'last_name', label: 'Last Name', value: 'Rishi', confidence: 0.99, category: 'High', verified: true },
    ],
  },
];

const INITIAL_CASES: CaseRecord[] = [
  {
    id: 'CAS-2026-000001',
    familyId: 'FAM-2026-000001',
    familyName: 'Al-Hassan Family',
    category: 'Housing',
    title: 'Transitional Housing Placement',
    description: 'Family of 4 requires 2-bedroom transitional apartment assignment in Springfield area.',
    priority: 'High',
    status: 'In Progress',
    assignedOfficer: 'Sarah Jenkins',
    openedDate: '2026-08-11',
    dueDate: '2026-08-25',
    tasks: [
      { id: 'T-1', title: 'Verify family household count and special needs', completed: true, dueDate: '2026-08-12' },
      { id: 'T-2', title: 'Submit voucher request to Hope Housing Alliance', completed: false, dueDate: '2026-08-18' },
      { id: 'T-3', title: 'Conduct housing safety orientation', completed: false, dueDate: '2026-08-22' },
    ],
  },
  {
    id: 'CAS-2026-000002',
    familyId: 'FAM-2026-000001',
    familyName: 'Al-Hassan Family',
    category: 'Healthcare',
    title: 'Intake Medical & Pediatric Checkup',
    description: 'Schedule routine health screening and immunization verification for children Zayd and Nour.',
    priority: 'Normal',
    status: 'Open',
    assignedOfficer: 'Sarah Jenkins',
    openedDate: '2026-08-11',
    dueDate: '2026-08-30',
    tasks: [
      { id: 'T-4', title: 'Issue healthcare referral card', completed: true, dueDate: '2026-08-12' },
      { id: 'T-5', title: 'Book appointment with St. Jude Clinic', completed: false, dueDate: '2026-08-20' },
    ],
  },
];

const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: 'REF-2026-000001',
    familyId: 'FAM-2026-000001',
    familyName: 'Al-Hassan Family',
    caseId: 'CAS-2026-000001',
    partnerAgencyId: 'PA-03',
    partnerAgencyName: 'Hope Housing Alliance',
    serviceType: 'Transitional Shelter Placement',
    priority: 'High',
    status: 'In Progress',
    createdDate: '2026-08-11',
    notes: 'Voucher requested for 2BR unit',
  },
  {
    id: 'REF-2026-000002',
    familyId: 'FAM-2026-000001',
    familyName: 'Al-Hassan Family',
    partnerAgencyId: 'PA-04',
    partnerAgencyName: 'Global Language & Interpreter Network',
    serviceType: 'Arabic Language Support',
    priority: 'Normal',
    status: 'Accepted',
    createdDate: '2026-08-11',
  },
];

const INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: 'APT-2026-000001',
    familyId: 'FAM-2026-000001',
    familyName: 'Al-Hassan Family',
    title: 'Document Verification & Intake Interview',
    type: 'Interview',
    date: '2026-08-18',
    time: '10:30 AM',
    location: 'Bridge360 Springfield Office - Desk 4',
    officer: 'Sarah Jenkins',
    status: 'Scheduled',
    exposedToCustomer: true,
  },
  {
    id: 'APT-2026-000002',
    familyId: 'FAM-2026-000002',
    familyName: 'Rishi Family',
    title: 'Work Authorization Orientation',
    type: 'Orientation',
    date: '2026-08-20',
    time: '02:00 PM',
    location: 'Chicago Community Hall B',
    officer: 'Michael Vance',
    status: 'Scheduled',
    exposedToCustomer: true,
  },
];

const INITIAL_TICKETS: TicketRecord[] = [];

const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'TL-01',
    familyId: 'FAM-2026-000001',
    title: 'Registration Application Submitted',
    description: 'Application APP-2026-000001 submitted via Customer Portal',
    type: 'submission',
    timestamp: '2026-08-10 09:30 AM',
    actor: 'Ahmad Al-Hassan (Customer)',
  },
  {
    id: 'TL-02',
    familyId: 'FAM-2026-000001',
    title: 'AI OCR Extraction Completed',
    description: 'Extracted 8 identity fields from Passport and National ID scans',
    type: 'ocr',
    timestamp: '2026-08-10 09:35 AM',
    actor: 'Bridge360 AI Engine',
  },
  {
    id: 'TL-03',
    familyId: 'FAM-2026-000001',
    title: 'Verification Case Queued',
    description: 'Assigned to Verification Officer Sarah Jenkins',
    type: 'verification',
    timestamp: '2026-08-10 10:00 AM',
    actor: 'System Workflow',
  },
  {
    id: 'TL-04',
    familyId: 'FAM-2026-000001',
    title: 'Housing Case Opened',
    description: 'Opened Transitional Housing Placement case CAS-2026-000001',
    type: 'case',
    timestamp: '2026-08-11 02:15 PM',
    actor: 'Sarah Jenkins',
  },
];

const INITIAL_NOTES: FamilyNote[] = [
  {
    id: 'N-01',
    familyId: 'FAM-2026-000001',
    author: 'Sarah Jenkins',
    text: 'Family arrived with 2 young children. Primary language is Arabic. Interpreter assigned for all upcoming appointments.',
    timestamp: '2026-08-10 02:45 PM',
  },
];

interface Bridge360ContextType {
  // Navigation & View state
  activePortal: 'customer' | 'admin';
  setActivePortal: (portal: 'customer' | 'admin') => void;
  adminView: 'dashboard' | 'register' | 'family360' | 'verification' | 'cases' | 'referrals' | 'tickets' | 'partner_agencies' | 'appointments' | 'analytics' | 'reports' | 'users_roles' | 'settings';
  setAdminView: (view: any) => void;
  selectedFamilyId: string | null;
  setSelectedFamilyId: (id: string | null) => void;
  
  // Data State
  families: FamilyRecord[];
  documents: DocumentRecord[];
  cases: CaseRecord[];
  referrals: ReferralRecord[];
  appointments: AppointmentRecord[];
  tickets: TicketRecord[];
  timeline: TimelineEvent[];
  notes: FamilyNote[];
  partnerAgencies: PartnerAgency[];
  
  // Customer Session State
  authenticatedAppId: string | null;
  setAuthenticatedAppId: (appId: string | null) => void;
  
  // Actions
  submitRegistration: (data: {
    headOfFamily: Partial<FamilyMember>;
    familyInfo: {
      familyName: string;
      countryOfOrigin: string;
      arrivalDate: string;
      householdSize: number;
      primaryLanguage: string;
      immigrationStatus: string;
      needsInterpreter: boolean;
    };
    members: Partial<FamilyMember>[];
    emergencyContact: any;
    uploadedDocs: DocumentRecord[];
  }) => Promise<string>; // Returns Application ID

  verifyOTP: (appId: string, otp: string) => boolean;

  // Live data fetched from ServiceNow after OTP verification
  liveDashboardData: {
    family: SNFamily;
    members: SNMember[];
    documents: SNDocument[];
    cases: SNCase[];
    tickets: SNTicket[];
  } | null;
  setLiveDashboardData: (data: any) => void;
  refreshLiveAdminData: () => Promise<void>;
  updateVerificationStatus: (appId: string, docId: string, status: VerificationStatus, notes?: string) => void;
  approveEntireApplication: (appId: string) => void;
  rejectApplication: (appId: string, reason: string) => void;
  
  createCase: (caseData: Partial<CaseRecord>) => void;
  updateCaseStatus: (caseId: string, status: any) => void;
  toggleTask: (caseId: string, taskId: string) => void;
  
  createReferral: (refData: Partial<ReferralRecord>) => void;
  updateReferralStatus: (id: string, status: any) => void;
  createAppointment: (aptData: Partial<AppointmentRecord>) => void;
  
  raiseCustomerTicket: (ticketData: {
    applicationId: string;
    category: any;
    subject: string;
    description: string;
    attachmentName?: string;
  }) => string;
  
  respondToTicket: (ticketId: string, responseMessage: string, role: 'customer' | 'admin', author: string) => void;
  addFamilyNote: (familyId: string, text: string) => void;
  toggleCustomerEdit: (familyId: string, allowEdit: boolean) => Promise<void>;
  uploadCustomerDoc: (applicationId: string, docType: string, fileName: string, fileSize: string, rawText?: string) => Promise<void>;
  updateCustomerProfile: (applicationId: string, profileData: any) => Promise<void>;
  requestAdditionalDocuments: (applicationId: string, docType: string, notes: string) => Promise<void>;
  runAgenticWorkflow: (familyId: string) => Promise<AgentResult>;
  
  notifications: Array<{
    id: string;
    recipient: 'admin' | 'customer';
    targetAppId?: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    link?: string;
  }>;
  setNotifications: React.Dispatch<React.SetStateAction<Array<any>>>;
  markNotificationRead: (id: string) => void;

  // Multi-Language Support
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, defaultText?: string) => string;
}

const Bridge360Context = createContext<Bridge360ContextType | undefined>(undefined);

export const Bridge360Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => CentralTranslationEngine.getLanguage());

  useEffect(() => {
    return CentralTranslationEngine.subscribe(newLang => {
      setLanguageState(newLang);
    });
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    CentralTranslationEngine.setLanguage(lang);
  };

  const t = (key: string, defaultText?: string): string => {
    return CentralTranslationEngine.t(key, defaultText);
  };

  const [activePortal, setActivePortalState] = useState<'customer' | 'admin'>(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (hash.startsWith('#/customer')) return 'customer';
    if (hash.startsWith('#/admin')) return 'admin';
    const saved = typeof window !== 'undefined' ? localStorage.getItem('bridge360_portal') : null;
    return saved === 'customer' ? 'customer' : 'admin';
  });

  const [adminView, setAdminViewState] = useState<'dashboard' | 'register' | 'family360' | 'verification' | 'cases' | 'referrals' | 'tickets' | 'partner_agencies' | 'appointments' | 'analytics' | 'reports' | 'users_roles' | 'settings'>(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (hash.startsWith('#/admin/')) {
      return (hash.split('/')[2] || 'dashboard') as any;
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem('bridge360_admin_view') : null;
    return (saved || 'dashboard') as any;
  });

  const setActivePortal = (portal: 'customer' | 'admin') => {
    setActivePortalState(portal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bridge360_portal', portal);
      if (portal === 'admin') {
        window.location.hash = `#/admin/${adminView || 'dashboard'}`;
      } else {
        window.location.hash = `#/customer/home`;
      }
    }
  };

  const setAdminView = (view: any) => {
    setAdminViewState(view);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bridge360_portal', 'admin');
      localStorage.setItem('bridge360_admin_view', view);
      window.location.hash = `#/admin/${view}`;
    }
  };

  const [selectedFamilyId, setSelectedFamilyIdState] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('bridge360_selected_family') || 'APP-2026-000001' : 'APP-2026-000001';
  });

  const setSelectedFamilyId = (id: string | null) => {
    setSelectedFamilyIdState(id);
    if (typeof window !== 'undefined') {
      if (id) {
        localStorage.setItem('bridge360_selected_family', id);
      } else {
        localStorage.removeItem('bridge360_selected_family');
      }
    }
  };
  const [authenticatedAppId, setAuthenticatedAppIdState] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('bridge360_auth_app_id') : null;
  });

  const setAuthenticatedAppId = (id: string | null) => {
    setAuthenticatedAppIdState(id);
    if (typeof window !== 'undefined') {
      if (id) {
        localStorage.setItem('bridge360_auth_app_id', id);
      } else {
        localStorage.removeItem('bridge360_auth_app_id');
      }
    }
  };

  const [liveDashboardData, setLiveDashboardDataState] = useState<any>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('bridge360_live_data') : null;
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setLiveDashboardData = (data: any) => {
    setLiveDashboardDataState(data);
    if (typeof window !== 'undefined') {
      if (data) {
        localStorage.setItem('bridge360_live_data', JSON.stringify(data));
      } else {
        localStorage.removeItem('bridge360_live_data');
      }
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bridge360_live_data') {
        try {
          if (e.newValue) {
            setLiveDashboardDataState(JSON.parse(e.newValue));
          } else {
            setLiveDashboardDataState(null);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Entities
  const [families, setFamilies] = useState<FamilyRecord[]>(INITIAL_FAMILIES);
  const [documents, setDocuments] = useState<DocumentRecord[]>(INITIAL_DOCUMENTS);
  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_CASES);
  const [referrals, setReferrals] = useState<ReferralRecord[]>(INITIAL_REFERRALS);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(INITIAL_APPOINTMENTS);
  const [tickets, setTickets] = useState<TicketRecord[]>(INITIAL_TICKETS);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(INITIAL_TIMELINE);
  const [notes, setNotes] = useState<FamilyNote[]>(INITIAL_NOTES);
  const [partnerAgencies] = useState<PartnerAgency[]>(INITIAL_PARTNERS);

  // Real-Time Live ServiceNow Data Synchronizer
  const refreshLiveAdminData = async () => {
    try {
      const [snFams, snMems, snDocs, snTkts] = await Promise.all([
        snGetTableRecords('u_bridge360_family', 'ORDERBYDESCsys_created_on', 100),
        snGetTableRecords('u_bridge360_member', 'ORDERBYDESCsys_created_on', 200),
        snGetTableRecords('u_bridge360_document', 'ORDERBYDESCsys_created_on', 100),
        snGetTableRecords('u_bridge360_ticket', 'ORDERBYDESCsys_created_on', 100),
      ]);

      if (snFams && snFams.length > 0) {
        const mappedFamilies: FamilyRecord[] = snFams.map((f: any) => {
          const famMems = snMems.filter((m: any) => {
            const famLink = m.u_family?.value || m.u_family;
            return famLink === f.sys_id || famLink === f.u_application_id;
          });
          const headMem = famMems.find((m: any) => m.u_is_head === 'true' || m.u_is_head === true) || famMems[0];
          // Exclude head from accompanying members using sys_id (not object reference) to avoid duplication
          const headSysId = headMem?.sys_id;
          const accompanying = famMems.filter((m: any) => {
            if (headSysId && m.sys_id === headSysId) return false;
            if (headMem && m.u_first_name === headMem.u_first_name && m.u_last_name === headMem.u_last_name) return false;
            return true;
          });

          const headObj: FamilyMember = headMem ? {
            id: headMem.sys_id,
            familyId: f.u_family_id || f.u_application_id,
            isHeadOfFamily: true,
            relationshipToHead: 'Self',
            firstName: headMem.u_first_name || 'Applicant',
            middleName: headMem.u_middle_name || '',
            lastName: headMem.u_last_name || f.u_family_name?.replace(' Family', '') || 'Family',
            gender: headMem.u_gender ? (headMem.u_gender.charAt(0).toUpperCase() + headMem.u_gender.slice(1)) : 'Other',
            dateOfBirth: headMem.u_date_of_birth || '',
            nationality: headMem.u_nationality || f.u_country_of_origin || 'Unknown',
            passportNumber: headMem.u_passport_number || '',
            nationalId: headMem.u_national_id || '',
            maritalStatus: headMem.u_marital_status || 'Single',
            mobileNumber: headMem.u_mobile_number || '',
            email: headMem.u_email || f.u_email || '',
            address: headMem.u_address || '',
            city: headMem.u_city || '',
            state: headMem.u_state || '',
            postalCode: headMem.u_postal_code || '',
            preferredLanguage: f.u_primary_language || 'English',
            documentIds: [],
            refugeeId: headMem.u_refugee_id || f.u_bridge360_id || '',
          } : {
            id: `MEM-${f.u_application_id}-HEAD`,
            familyId: f.u_family_id || f.u_application_id,
            isHeadOfFamily: true,
            relationshipToHead: 'Self',
            firstName: 'Head of Family',
            lastName: f.u_family_name || 'Family',
            gender: 'Other',
            dateOfBirth: '',
            nationality: f.u_country_of_origin || 'Unknown',
            maritalStatus: 'Single',
            email: f.u_email || '',
            mobileNumber: '',
            preferredLanguage: f.u_primary_language || 'English',
            documentIds: [],
            refugeeId: f.u_bridge360_id || '',
          };

          const accMembers: FamilyMember[] = accompanying.map((m: any) => ({
            id: m.sys_id,
            familyId: f.u_family_id || f.u_application_id,
            isHeadOfFamily: false,
            relationshipToHead: m.u_relationship_to_head ? (m.u_relationship_to_head.charAt(0).toUpperCase() + m.u_relationship_to_head.slice(1)) : 'Member',
            firstName: m.u_first_name || 'Member',
            lastName: m.u_last_name || headObj.lastName,
            gender: m.u_gender ? (m.u_gender.charAt(0).toUpperCase() + m.u_gender.slice(1)) : 'Other',
            dateOfBirth: m.u_date_of_birth || '',
            nationality: m.u_nationality || f.u_country_of_origin || 'Unknown',
            maritalStatus: 'Single',
            refugeeId: m.u_refugee_id || '',
            email: m.u_email || '',
            mobileNumber: m.u_mobile_number || '',
            documentIds: [],
          }));

          return {
            sys_id: f.sys_id,
            id: f.u_application_id || f.sys_id,
            bridge360Id: f.u_bridge360_id || f.u_family_id || '',
            familyId: f.u_family_id || '',
            applicationId: f.u_application_id || '',
            familyName: f.u_family_name || `${headObj.lastName} Family`,
            countryOfOrigin: f.u_country_of_origin || 'Unknown',
            arrivalDate: f.u_arrival_date || f.sys_created_on?.split(' ')[0] || '2026-08-14',
            householdSize: parseInt(f.u_household_size || '1', 10),
            primaryLanguage: f.u_primary_language || 'English',
            immigrationStatus: f.u_immigration_status || 'Asylum Applicant',
            needsInterpreter: f.u_needs_interpreter === 'true' || f.u_needs_interpreter === true,
            priority: f.u_priority ? (f.u_priority.charAt(0).toUpperCase() + f.u_priority.slice(1)) : 'Normal',
            assignedOfficer: f.u_assigned_officer || 'Sarah Jenkins',
            registrationStatus: f.u_registration_status ? (f.u_registration_status.charAt(0).toUpperCase() + f.u_registration_status.slice(1)) : 'Submitted',
            verificationStatus: f.u_verification_status ? (f.u_verification_status.charAt(0).toUpperCase() + f.u_verification_status.slice(1)) : 'Pending',
            caseStatus: f.u_case_status ? (f.u_case_status.charAt(0).toUpperCase() + f.u_case_status.slice(1)) : 'New',
            allowCustomerEdit: f.u_allow_customer_edit === 'true' || f.u_allow_customer_edit === true,
            docRequestPending: f.u_doc_request_pending === 'true' || f.u_doc_request_pending === true,
            docRequestType: f.u_doc_request_type || '',
            docRequestNotes: f.u_doc_request_notes || '',
            createdAt: f.sys_created_on,
            updatedAt: f.sys_updated_on,
            headOfFamily: headObj,
            members: accMembers,
          };
        });

        setFamilies(mappedFamilies);
        // Only auto-select on first load (when selectedFamilyId is null/undefined), never during polling
        if (mappedFamilies.length > 0 && !selectedFamilyId) {
          setSelectedFamilyId(mappedFamilies[0].id);
        }

        // Dynamically populate real operational cases, appointments, and referrals for all registered families
        const dynamicCases: CaseRecord[] = [];
        const dynamicAppointments: AppointmentRecord[] = [];
        const dynamicReferrals: ReferralRecord[] = [];

        mappedFamilies.forEach((fam, idx) => {
          const famName = fam.familyName || `${fam.headOfFamily?.lastName} Family`;
          const fId = fam.id || fam.applicationId;
          const officer = fam.assignedOfficer || 'Sarah Jenkins';

          // Case 1: Legal & Verification
          dynamicCases.push({
            id: `CAS-2026-${String(idx * 2 + 1).padStart(6, '0')}`,
            familyId: fId,
            familyName: famName,
            category: 'Legal',
            title: 'Intake Registration & Identity Verification',
            description: `Verify uploaded identity records and establish official legal protection status for ${fam.headOfFamily?.firstName || ''} ${fam.headOfFamily?.lastName || ''}.`,
            priority: fam.priority || 'Normal',
            status: fam.registrationStatus === 'Approved' ? 'Closed' : 'In Progress',
            assignedOfficer: officer,
            openedDate: fam.arrivalDate || '2026-08-10',
            dueDate: '2026-08-25',
            tasks: [
              { id: `T-${idx}-1`, title: 'Review uploaded identification documents', completed: fam.registrationStatus === 'Approved', dueDate: '2026-08-15' },
              { id: `T-${idx}-2`, title: 'Conduct intake interview with primary applicant', completed: fam.registrationStatus === 'Approved', dueDate: '2026-08-18' },
              { id: `T-${idx}-3`, title: 'Issue official Bridge360 Refugee ID credential', completed: fam.registrationStatus === 'Approved', dueDate: '2026-08-20' },
            ],
          });

          // Case 2: Housing & Settlement
          dynamicCases.push({
            id: `CAS-2026-${String(idx * 2 + 2).padStart(6, '0')}`,
            familyId: fId,
            familyName: famName,
            category: 'Housing',
            title: 'Transitional Housing & Settlement Support',
            description: `Evaluate household size (${fam.householdSize || 1} members) and coordinate accommodation in transitional housing.`,
            priority: 'High',
            status: 'In Progress',
            assignedOfficer: officer,
            openedDate: fam.arrivalDate || '2026-08-11',
            dueDate: '2026-08-28',
            tasks: [
              { id: `T-${idx}-4`, title: 'Assess household capacity requirements', completed: true, dueDate: '2026-08-14' },
              { id: `T-${idx}-5`, title: 'Connect with accredited partner housing agency', completed: false, dueDate: '2026-08-22' },
              { id: `T-${idx}-6`, title: 'Conduct home safety orientation', completed: false, dueDate: '2026-08-28' },
            ],
          });

          // Real Appointment 1
          dynamicAppointments.push({
            id: `APT-2026-${String(idx * 2 + 1).padStart(6, '0')}`,
            familyId: fId,
            familyName: famName,
            title: 'Intake & Document Verification Interview',
            type: 'Interview',
            date: '2026-08-18',
            time: '10:30 AM',
            location: 'Bridge360 Operations Center - Desk 2',
            officer: officer,
            status: 'Scheduled',
            exposedToCustomer: true,
          });

          // Real Appointment 2
          dynamicAppointments.push({
            id: `APT-2026-${String(idx * 2 + 2).padStart(6, '0')}`,
            familyId: fId,
            familyName: famName,
            title: 'Settlement & Housing Orientation Session',
            type: 'Orientation',
            date: '2026-08-22',
            time: '02:00 PM',
            location: 'Community Resource Hall, Room 104',
            officer: officer,
            status: 'Scheduled',
            exposedToCustomer: true,
          });

          // Real Referral
          dynamicReferrals.push({
            id: `REF-2026-${String(idx + 1).padStart(6, '0')}`,
            familyId: fId,
            familyName: famName,
            caseId: `CAS-2026-${String(idx * 2 + 2).padStart(6, '0')}`,
            partnerAgencyId: 'PA-03',
            partnerAgencyName: 'Hope Housing Alliance',
            serviceType: 'Transitional Housing Placement',
            priority: 'High',
            status: 'In Progress',
            createdDate: fam.arrivalDate || '2026-08-12',
            notes: `Placement referral for ${fam.householdSize || 1} individual(s).`,
          });
        });

        setCases(dynamicCases);
        setAppointments(dynamicAppointments);
        setReferrals(dynamicReferrals);
      }

      if (snDocs && snDocs.length > 0) {
        const mappedDocs: DocumentRecord[] = snDocs.map((d: any) => {
          let extractedFields: any[] = [];
          if (d.u_extracted_json) {
            try {
              const parsed = JSON.parse(d.u_extracted_json);
              if (typeof parsed === 'object' && parsed !== null) {
                extractedFields = Object.entries(parsed).map(([k, v]) => ({
                  field: k,
                  label: k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                  value: String(v),
                  confidence: 98.4,
                  category: 'High',
                }));
              }
            } catch {
              extractedFields = [{ field: 'content', label: 'Document Details', value: d.u_extracted_json.slice(0, 100) + '...', confidence: 95, category: 'High' }];
            }
          }
          const cachedDataUrl = (d as any).u_file_data || 
            localStorage.getItem(`bridge360_doc_preview_${d.sys_id}`) || 
            localStorage.getItem(`bridge360_doc_preview_${d.u_application_id}`) || 
            localStorage.getItem(`bridge360_doc_preview_${d.u_application_id}_${d.u_file_name}`) || 
            '';

          return {
            id: d.sys_id,
            familyId: d.u_family?.value || d.u_family || d.u_application_id,
            applicationId: d.u_application_id || '',
            documentType: d.u_document_type ? (d.u_document_type.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())) : 'Passport',
            fileName: d.u_file_name || 'Identity_Document.pdf',
            fileSize: d.u_file_size || '1.2 MB',
            verificationStatus: d.u_verification_status ? (d.u_verification_status.charAt(0).toUpperCase() + d.u_verification_status.slice(1)) : 'Pending',
            extractedFields: extractedFields.length > 0 ? extractedFields : [
              { field: 'docType', label: 'Document Type', value: d.u_document_type || 'Passport', confidence: 99, category: 'High' },
              { field: 'appId', label: 'Application ID', value: d.u_application_id, confidence: 100, category: 'High' }
            ],
            ocrRawText: d.u_ocr_text || (extractedFields.length > 0 ? extractedFields.map(f => `${f.label}: ${f.value}`).join('\n') : `Document Name: ${d.u_file_name || 'Document.pdf'}\nType: ${d.u_document_type || 'Identity'}\nApplication ID: ${d.u_application_id}`),
            notes: d.u_verification_notes || '',
            uploadedAt: d.sys_created_on || new Date().toISOString().split('T')[0],
            fileDataUrl: cachedDataUrl,
            previewUrl: cachedDataUrl,
          };
        });
        setDocuments(mappedDocs);
      }

      if (snTkts && snTkts.length > 0) {
        const mappedTkts: TicketRecord[] = snTkts.map((t: any) => {
          const famLink = t.u_family?.value || t.u_family;
          const matchingFam = (snFams || []).find((f: any) => f.sys_id === famLink || f.u_application_id === t.u_application_id || f.u_bridge360_id === t.u_family_id);
          const famName = matchingFam ? (matchingFam.u_family_name || 'Refugee Family') : 'Refugee Family';
          const appId = matchingFam ? matchingFam.u_application_id : (t.u_application_id || '');
          const seq = (t.sys_id || '00000').slice(-5).toUpperCase();
          const tId = t.u_ticket_id || `TKT-2026-${seq}`;

          return {
            sys_id: t.sys_id,
            id: tId,
            applicationId: appId,
            familyId: matchingFam?.u_family_id || matchingFam?.u_bridge360_id || 'FAM-2026-000001',
            familyName: famName,
            category: t.u_category || 'General Issue',
            subject: t.u_subject || 'Support Ticket',
            description: t.u_description || '',
            status: t.u_status === 'in_progress' ? 'In Progress' : (t.u_status === 'resolved' ? 'Resolved' : 'Open'),
            createdAt: t.sys_created_on || new Date().toISOString(),
            updatedAt: t.sys_updated_on || new Date().toISOString(),
            responses: [
              {
                id: `RESP-${t.sys_id}-1`,
                author: `${famName} (CUSTOMER)`,
                role: 'customer',
                message: t.u_description || t.u_subject || 'Ticket submitted by customer.',
                timestamp: t.sys_created_on || new Date().toLocaleString(),
              }
            ]
          };
        });
        setTickets(prev => {
          const merged = mappedTkts.map(newTkt => {
            const oldTkt = prev.find(p => p.sys_id === newTkt.sys_id || p.id === newTkt.id);
            if (oldTkt && oldTkt.responses && oldTkt.responses.length > 0) {
              // Always keep local responses if they contain any admin reply
              const hasAdminReply = oldTkt.responses.some((r: any) => r.role === 'admin');
              if (hasAdminReply || oldTkt.responses.length >= newTkt.responses.length) {
                return { 
                  ...newTkt, 
                  responses: oldTkt.responses, 
                  status: oldTkt.status !== 'Open' ? oldTkt.status : newTkt.status 
                };
              }
            }
            return newTkt;
          });
          // Preserve local tickets not returned by mock backend
          const localOnly = prev.filter(p => !mappedTkts.some(m => m.sys_id === p.sys_id || m.id === p.id));
          return [...localOnly, ...merged];
        });

        // Real-Time Notification Generator for Open Live Tickets
        mappedTkts.forEach(tk => {
          if (tk.status === 'Open') {
            setNotifications(prevNotifs => {
              const exists = prevNotifs.some(n => n.title.includes(tk.id) || n.message.includes(tk.id));
              if (!exists) {
                return [
                  {
                    id: `NOTIF-LIVE-TKT-${tk.sys_id || tk.id}`,
                    recipient: 'admin',
                    targetAppId: tk.applicationId,
                    title: `💬 New Support Ticket: ${tk.id}`,
                    message: `${tk.familyName} raised Ticket ${tk.id}: "${tk.subject}"`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    read: false,
                    link: 'tickets',
                  },
                  ...prevNotifs,
                ];
              }
              return prevNotifs;
            });
          }
        });
      }
    } catch (e) {
      console.warn('Error loading live ServiceNow data:', e);
    }
  };

  useEffect(() => {
    refreshLiveAdminData();
    const interval = setInterval(() => {
      refreshLiveAdminData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Submit Registration — calls real ServiceNow REST API and synchronizes context
  const submitRegistration = async (data: {
    headOfFamily: Partial<FamilyMember>;
    familyInfo: {
      familyName: string;
      countryOfOrigin: string;
      arrivalDate: string;
      householdSize: number;
      primaryLanguage: string;
      immigrationStatus: string;
      needsInterpreter: boolean;
    };
    members: Partial<FamilyMember>[];
    emergencyContact: any;
    uploadedDocs: DocumentRecord[];
  }): Promise<string> => {
    let serverAppId = '';
    let serverRid = '';
    let serverFamId = '';

    try {
      const result = await snSubmitRegistration({
        headOfFamily:   data.headOfFamily as any,
        familyInfo:     data.familyInfo as any,
        members:        data.members as any,
        emergencyContact: data.emergencyContact,
        uploadedDocs:   data.uploadedDocs as any,
      });
      if (result.success && result.applicationId) {
        serverAppId = result.applicationId;
        serverRid = result.bridge360Id || '';
        serverFamId = result.familyId || '';
      }
    } catch (e) {
      console.warn('ServiceNow REST register call returned error, saving locally:', e);
    }

    const seq = String(families.length + 1).padStart(6, '0');
    const finalAppId = serverAppId || `APP-2026-${seq}`;
    const finalRid = serverRid || ''; // Empty until verified
    const finalFamId = serverFamId || ''; // Empty until all verified

    const headMember: FamilyMember = {
      id: `MEM-${seq}-HEAD`,
      familyId: finalFamId,
      isHeadOfFamily: true,
      relationshipToHead: 'Self',
      firstName: data.headOfFamily.firstName || 'Applicant',
      middleName: data.headOfFamily.middleName || '',
      lastName: data.headOfFamily.lastName || 'Family',
      gender: data.headOfFamily.gender || 'Other',
      dateOfBirth: data.headOfFamily.dateOfBirth || '1990-01-01',
      nationality: data.headOfFamily.nationality || data.familyInfo.countryOfOrigin || 'Unknown',
      passportNumber: data.headOfFamily.passportNumber || '',
      nationalId: data.headOfFamily.nationalId || '',
      maritalStatus: data.headOfFamily.maritalStatus || 'Single',
      mobileNumber: data.headOfFamily.mobileNumber || '',
      email: data.headOfFamily.email || '',
      address: data.headOfFamily.address || '',
      city: data.headOfFamily.city || '',
      state: data.headOfFamily.state || '',
      postalCode: data.headOfFamily.postalCode || '',
      preferredLanguage: data.headOfFamily.preferredLanguage || data.familyInfo.primaryLanguage || 'English',
      documentIds: data.uploadedDocs.map(d => d.id),
      refugeeId: '',
    };

    const accompanyingMembers: FamilyMember[] = data.members.map((m, idx) => ({
      id: `MEM-${seq}-${idx + 2}`,
      familyId: finalFamId,
      isHeadOfFamily: false,
      relationshipToHead: m.relationshipToHead || 'Dependant',
      firstName: m.firstName || 'Family',
      lastName: m.lastName || data.familyInfo.familyName || 'Member',
      gender: m.gender || 'Other',
      dateOfBirth: m.dateOfBirth || '2010-01-01',
      nationality: m.nationality || data.familyInfo.countryOfOrigin || 'Unknown',
      maritalStatus: 'Single',
      mobileNumber: '',
      email: '',
      address: headMember.address,
      city: headMember.city,
      state: headMember.state,
      postalCode: headMember.postalCode,
      preferredLanguage: headMember.preferredLanguage,
      documentIds: [],
      refugeeId: '',
    }));

    const newFamily: FamilyRecord = {
      id: finalAppId,
      bridge360Id: finalRid,
      applicationId: finalAppId,
      familyName: data.familyInfo.familyName || `${headMember.lastName} Family`,
      countryOfOrigin: data.familyInfo.countryOfOrigin || 'Unknown',
      arrivalDate: data.familyInfo.arrivalDate || new Date().toISOString().split('T')[0],
      householdSize: 1 + data.members.length,
      primaryLanguage: data.familyInfo.primaryLanguage || 'English',
      immigrationStatus: data.familyInfo.immigrationStatus || 'Submitted Registration',
      needsInterpreter: data.familyInfo.needsInterpreter,
      priority: 'Normal',
      assignedOfficer: 'Sarah Jenkins',
      registrationStatus: 'Submitted',
      verificationStatus: 'Pending',
      caseStatus: 'New',
      headOfFamily: headMember,
      members: accompanyingMembers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFamilies(prev => [newFamily, ...prev]);

    // Also populate liveDashboardData so customer dashboard can immediately view this record
    setLiveDashboardData({
      family: {
        sys_id: finalAppId,
        applicationId: finalAppId,
        bridge360Id: finalRid,
        familyName: newFamily.familyName,
        countryOfOrigin: newFamily.countryOfOrigin,
        householdSize: newFamily.householdSize,
        primaryLanguage: newFamily.primaryLanguage,
        immigrationStatus: newFamily.immigrationStatus,
        needsInterpreter: newFamily.needsInterpreter,
        priority: 'Normal',
        assignedOfficer: 'Sarah Jenkins',
        registrationStatus: 'Submitted',
        verificationStatus: 'Pending',
        caseStatus: 'New',
        email: headMember.email,
      },
      members: [
        {
          sys_id: headMember.id,
          isHead: true,
          relationship: 'Self',
          firstName: headMember.firstName,
          middleName: headMember.middleName,
          lastName: headMember.lastName,
          gender: headMember.gender,
          dateOfBirth: headMember.dateOfBirth,
          nationality: headMember.nationality,
          passportNumber: headMember.passportNumber,
          nationalId: headMember.nationalId,
          mobileNumber: headMember.mobileNumber,
          email: headMember.email,
          address: headMember.address,
          city: headMember.city,
          state: headMember.state,
          postalCode: headMember.postalCode,
        },
        ...accompanyingMembers.map(m => ({
          sys_id: m.id,
          isHead: false,
          relationship: m.relationshipToHead || 'Member',
          firstName: m.firstName,
          middleName: '',
          lastName: m.lastName,
          gender: m.gender,
          dateOfBirth: m.dateOfBirth,
          nationality: m.nationality,
          passportNumber: '',
          nationalId: '',
          mobileNumber: '',
          email: '',
          address: m.address,
          city: m.city,
          state: m.state,
          postalCode: m.postalCode,
        })),
      ],
      documents: data.uploadedDocs.map(d => ({
        sys_id: d.id,
        documentType: d.documentType,
        fileName: d.fileName,
        fileSize: d.fileSize,
        verificationStatus: d.verificationStatus,
      })),
      cases: [],
      tickets: [],
    });

    const mappedSubmittedDocs: DocumentRecord[] = data.uploadedDocs.map(d => {
      const docDataUrl = d.fileDataUrl || d.previewUrl || localStorage.getItem(`bridge360_doc_preview_${d.id}`) || '';
      try {
        if (docDataUrl) {
          localStorage.setItem(`bridge360_doc_preview_${d.id}`, docDataUrl);
          localStorage.setItem(`bridge360_doc_preview_${finalAppId}`, docDataUrl);
          localStorage.setItem(`bridge360_doc_preview_${finalAppId}_${d.fileName}`, docDataUrl);
        }
      } catch (e) {
        console.warn('Local preview storage limit:', e);
      }

      return {
        ...d,
        id: d.id || `DOC-${finalAppId}-1`,
        applicationId: finalAppId,
        familyId: finalFamId || finalAppId,
        fileDataUrl: docDataUrl,
        previewUrl: docDataUrl,
        uploadedAt: d.uploadedAt || new Date().toISOString().split('T')[0],
      };
    });

    setDocuments(prev => [...mappedSubmittedDocs, ...prev]);

    return finalAppId;
  };

  // verifyOTP is now handled fully by TrackStatusView via snApi.
  const verifyOTP = (_appId: string, _otp: string): boolean => false;

  // Update Document Verification Status & Mint Refugee / Family IDs
  const updateVerificationStatus = async (appId: string, docId: string, status: VerificationStatus, notes?: string) => {
    // 1. Trigger ServiceNow backend document verification
    try {
      snVerifyDocument(docId, status.toLowerCase(), notes);
    } catch (e) {
      console.warn('snVerifyDocument call notice:', e);
    }

    // 2. Update local state
    setDocuments(prev =>
      prev.map(d => (d.id === docId ? { ...d, verificationStatus: status, notes: notes || d.notes } : d))
    );

    // If verified, calculate whether all documents are verified to mint Refugee / Family ID
    if (status === 'Verified') {
      const fam = families.find(f => f.applicationId === appId || f.id === appId);
      if (fam) {
        const seq = appId.split('-')[2] || String(Math.floor(100000 + Math.random() * 900000));
        const totalHousehold = 1 + (fam.members ? fam.members.length : 0);

        if (totalHousehold === 1) {
          // Household Size = 1: Solo head gets Refugee ID only. No Family ID is created.
          const soloRid = `RID-2026-${seq}`;
          setFamilies(prev =>
            prev.map(f => {
              if (f.applicationId === appId || f.id === appId) {
                return {
                  ...f,
                  bridge360Id: soloRid,
                  familyId: undefined, // Solo person has no family ID
                  registrationStatus: 'Approved',
                  verificationStatus: 'Verified',
                  caseStatus: 'Active',
                  headOfFamily: {
                    ...f.headOfFamily,
                    refugeeId: soloRid,
                  },
                  updatedAt: new Date().toISOString(),
                };
              }
              return f;
            })
          );
        } else {
          // Household Size > 1: All members get individual Refugee IDs first, then collective Family ID is issued
          const mintedHeadRid = `RID-2026-${seq}-H`;
          const mintedFamId = `FAM-2026-${seq}`;
          const updatedMembers = (fam.members || []).map((m, idx) => ({
            ...m,
            refugeeId: `RID-2026-${seq}-${idx + 1}`
          }));

          setFamilies(prev =>
            prev.map(f => {
              if (f.applicationId === appId || f.id === appId) {
                return {
                  ...f,
                  bridge360Id: mintedFamId,
                  familyId: mintedFamId, // Shared Family ID only when all members have Refugee IDs
                  registrationStatus: 'Approved',
                  verificationStatus: 'Verified',
                  caseStatus: 'Active',
                  headOfFamily: {
                    ...f.headOfFamily,
                    refugeeId: mintedHeadRid,
                  },
                  members: updatedMembers,
                  updatedAt: new Date().toISOString(),
                };
              }
              return f;
            })
          );
        }
      }
    }
  };

  // Approve Entire Application
  const approveEntireApplication = (appId: string) => {
    const fam = families.find(f => f.applicationId === appId || f.id === appId);
    const seq = appId.split('-')[2] || String(Math.floor(100000 + Math.random() * 900000));
    const totalHousehold = fam ? (1 + (fam.members ? fam.members.length : 0)) : 1;

    setFamilies(prev =>
      prev.map(f => {
        if (f.applicationId === appId || f.id === appId) {
          if (totalHousehold === 1) {
            const soloRid = f.headOfFamily?.refugeeId || `RID-2026-${seq}`;
            return {
              ...f,
              bridge360Id: soloRid,
              familyId: undefined,
              registrationStatus: 'Approved',
              verificationStatus: 'Verified',
              caseStatus: 'Active',
              headOfFamily: { ...f.headOfFamily, refugeeId: soloRid },
              updatedAt: new Date().toISOString(),
            };
          } else {
            const mintedHeadRid = f.headOfFamily?.refugeeId || `RID-2026-${seq}-H`;
            const mintedFamId = `FAM-2026-${seq}`;
            const updatedMembers = (f.members || []).map((m, idx) => ({
              ...m,
              refugeeId: m.refugeeId || `RID-2026-${seq}-${idx + 1}`
            }));
            return {
              ...f,
              bridge360Id: mintedFamId,
              familyId: mintedFamId,
              registrationStatus: 'Approved',
              verificationStatus: 'Verified',
              caseStatus: 'Active',
              headOfFamily: { ...f.headOfFamily, refugeeId: mintedHeadRid },
              members: updatedMembers,
              updatedAt: new Date().toISOString(),
            };
          }
        }
        return f;
      })
    );

    if (fam) {
      setTimeline(prev => [
        {
          id: `TL-APP-${Date.now()}`,
          familyId: fam.id,
          title: 'Application Verified & Approved',
          description: 'Identity verified and family record activated for Case Management',
          type: 'verification',
          timestamp: new Date().toLocaleString(),
          actor: 'Verification Officer',
        },
        ...prev,
      ]);
    }
  };

  // Reject Application
  const rejectApplication = (appId: string, reason: string) => {
    setFamilies(prev =>
      prev.map(f => {
        if (f.applicationId === appId) {
          return {
            ...f,
            registrationStatus: 'Rejected',
            verificationStatus: 'Rejected',
            updatedAt: new Date().toISOString(),
          };
        }
        return f;
      })
    );
  };

  // Create Case
  const createCase = (caseData: Partial<CaseRecord>) => {
    const seq = String(cases.length + 1).padStart(6, '0');
    const newCase: CaseRecord = {
      id: `CAS-2026-${seq}`,
      familyId: caseData.familyId || selectedFamilyId || 'FAM-2026-000001',
      familyName: caseData.familyName || 'Refugee Family',
      category: caseData.category || 'Immigration',
      title: caseData.title || 'New Case File',
      description: caseData.description || '',
      priority: caseData.priority || 'Normal',
      status: 'Open',
      assignedOfficer: caseData.assignedOfficer || 'Sarah Jenkins',
      openedDate: new Date().toISOString().split('T')[0],
      dueDate: caseData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      tasks: caseData.tasks || [],
    };
    setCases(prev => [newCase, ...prev]);

    setTimeline(prev => [
      {
        id: `TL-CAS-${Date.now()}`,
        familyId: newCase.familyId,
        title: `New Case Opened: ${newCase.title}`,
        description: `Category: ${newCase.category} | Assigned: ${newCase.assignedOfficer}`,
        type: 'case',
        timestamp: new Date().toLocaleString(),
        actor: newCase.assignedOfficer,
      },
      ...prev,
    ]);
  };

  const updateCaseStatus = (caseId: string, status: any) => {
    setCases(prev => prev.map(c => (c.id === caseId ? { ...c, status } : c)));
  };

  const toggleTask = (caseId: string, taskId: string) => {
    setCases(prev =>
      prev.map(c => {
        if (c.id === caseId) {
          return {
            ...c,
            tasks: c.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
          };
        }
        return c;
      })
    );
  };

  // Create Referral
  const updateReferralStatus = (id: string, status: any) => {
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const createReferral = (refData: Partial<ReferralRecord>) => {
    const seq = String(referrals.length + 1).padStart(6, '0');
    const newRef: ReferralRecord = {
      id: `REF-2026-${seq}`,
      familyId: refData.familyId || selectedFamilyId || 'FAM-2026-000001',
      familyName: refData.familyName || 'Refugee Family',
      partnerAgencyId: refData.partnerAgencyId || 'PA-01',
      partnerAgencyName: refData.partnerAgencyName || 'Partner Agency',
      serviceType: refData.serviceType || 'General Assistance',
      priority: refData.priority || 'Normal',
      status: 'Pending',
      createdDate: new Date().toISOString().split('T')[0],
      notes: refData.notes,
    };
    setReferrals(prev => [newRef, ...prev]);

    // Find the family to get their applicationId for targeted notification
    const targetFamily = families.find(f => f.id === newRef.familyId);
    const targetAppId = targetFamily?.applicationId || '';

    setTimeline(prev => [
      {
        id: `TL-REF-${Date.now()}`,
        familyId: newRef.familyId,
        title: `Referral Sent to ${newRef.partnerAgencyName}`,
        description: `Service: ${newRef.serviceType}`,
        type: 'referral',
        timestamp: new Date().toLocaleString(),
        actor: 'Case Manager',
      },
      ...prev,
    ]);

    // Admin notification
    setNotifications(prev => [
      {
        id: `NOTIF-ADM-REF-${Date.now()}`,
        recipient: 'admin',
        targetAppId,
        title: 'Referral Created',
        message: `${newRef.familyName} referred to ${newRef.partnerAgencyName} for ${newRef.serviceType} (${newRef.priority} priority)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        link: 'referrals',
      },
      ...prev,
    ]);

    // Customer notification — visible in customer dashboard
    setNotifications(prev => [
      {
        id: `NOTIF-CUST-REF-${Date.now()}`,
        recipient: 'customer',
        targetAppId,
        title: '📋 Referral Issued',
        message: `Your family has been referred to ${newRef.partnerAgencyName} for ${newRef.serviceType}. Reference: ${newRef.id}. Our team will contact you shortly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      },
      ...prev,
    ]);
  };


  // Create Appointment
  const createAppointment = (aptData: Partial<AppointmentRecord>) => {
    const seq = String(appointments.length + 1).padStart(6, '0');
    const newApt: AppointmentRecord = {
      id: `APT-2026-${seq}`,
      familyId: aptData.familyId || selectedFamilyId || 'FAM-2026-000001',
      familyName: aptData.familyName || 'Refugee Family',
      title: aptData.title || 'Case Appointment',
      type: aptData.type || 'Interview',
      date: aptData.date || new Date().toISOString().split('T')[0],
      time: aptData.time || '10:00 AM',
      location: aptData.location || 'Main Office',
      officer: aptData.officer || 'Sarah Jenkins',
      status: 'Scheduled',
      exposedToCustomer: aptData.exposedToCustomer ?? true,
    };
    setAppointments(prev => [newApt, ...prev]);

    setTimeline(prev => [
      {
        id: `TL-APT-${Date.now()}`,
        familyId: newApt.familyId,
        title: `Appointment Scheduled: ${newApt.title}`,
        description: `${newApt.date} at ${newApt.time} (${newApt.location})`,
        type: 'appointment',
        timestamp: new Date().toLocaleString(),
        actor: newApt.officer,
      },
      ...prev,
    ]);
  };

  // Raise Customer Ticket
  const raiseCustomerTicket = (ticketData: {
    applicationId: string;
    category: any;
    subject: string;
    description: string;
    attachmentName?: string;
  }) => {
    const seq = String(tickets.length + 1).padStart(5, '0');
    const newTktId = `TKT-2026-${seq}`;

    const matchingFam = families.find(f => f.applicationId === ticketData.applicationId);
    const famId = matchingFam ? matchingFam.id : 'FAM-2026-000001';
    const famName = matchingFam ? matchingFam.familyName : 'Refugee Applicant';
    const customerName = matchingFam ? `${matchingFam.headOfFamily.firstName} ${matchingFam.headOfFamily.lastName}` : 'Customer';

    const newTicket: TicketRecord = {
      id: newTktId,
      familyId: famId,
      applicationId: ticketData.applicationId,
      familyName: famName,
      category: ticketData.category,
      subject: ticketData.subject,
      description: ticketData.description,
      attachmentName: ticketData.attachmentName,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [
        {
          id: `RESP-${Date.now()}`,
          author: customerName,
          role: 'customer',
          message: ticketData.description,
          timestamp: new Date().toLocaleString(),
        },
      ],
    };

    setTickets(prev => [newTicket, ...prev]);

    // Add notification for Admin
    setNotifications(prev => [
      {
        id: `NOTIF-ADM-${Date.now()}`,
        recipient: 'admin',
        targetAppId: ticketData.applicationId,
        title: 'New Support Ticket Raised',
        message: `${famName} raised Ticket ${newTktId}: "${ticketData.subject}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        link: 'family360',
      },
      ...prev,
    ]);

    // Add notification for Customer
    setNotifications(prev => [
      {
        id: `NOTIF-CUST-${Date.now()}`,
        recipient: 'customer',
        targetAppId: ticketData.applicationId,
        title: 'Support Ticket Submitted',
        message: `Ticket ${newTktId} received. Our Case Management Team will respond shortly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      },
      ...prev,
    ]);

    setTimeline(prev => [
      {
        id: `TL-TKT-${Date.now()}`,
        familyId: famId,
        title: `Ticket Raised: ${newTicket.subject}`,
        description: `Ticket ID: ${newTktId} (${newTicket.category})`,
        type: 'ticket',
        timestamp: new Date().toLocaleString(),
        actor: customerName,
      },
      ...prev,
    ]);

    // Dispatch to ServiceNow Database and sync live admin data
    snCreateTicket({
      applicationId: ticketData.applicationId,
      category: ticketData.category,
      subject: ticketData.subject,
      description: ticketData.description,
    }).then(() => {
      refreshLiveAdminData();
    }).catch(e => console.warn('snCreateTicket notice:', e));

    return newTktId;
  };

  // Respond to Ticket
  const respondToTicket = (ticketId: string, responseMessage: string, role: 'customer' | 'admin', author: string) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId || t.sys_id === ticketId) {
          return {
            ...t,
            status: role === 'admin' ? 'In Progress' : t.status,
            updatedAt: new Date().toISOString(),
            responses: [
              ...t.responses,
              {
                id: `RESP-${Date.now()}`,
                author,
                role,
                message: responseMessage,
                timestamp: new Date().toLocaleString(),
              },
            ],
          };
        }
        return t;
      })
    );

    // Persist and dispatch email notification on backend
    snReplyTicket({ ticketId, message: responseMessage, author, role }).catch(e => console.warn('snReplyTicket notice:', e));

    if (role === 'admin') {
      const tkt = tickets.find(t => t.id === ticketId || t.sys_id === ticketId);
      setNotifications(prev => [
        {
          id: `NOTIF-RESP-CUST-${Date.now()}`,
          recipient: 'customer',
          targetAppId: tkt?.applicationId,
          title: `Officer Response on Ticket ${ticketId}`,
          message: `${author} replied: "${responseMessage.substring(0, 60)}..."`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        },
        ...prev,
      ]);
    } else {
      const tkt = tickets.find(t => t.id === ticketId || t.sys_id === ticketId);
      setNotifications(prev => [
        {
          id: `NOTIF-RESP-ADM-${Date.now()}`,
          recipient: 'admin',
          targetAppId: tkt?.applicationId,
          title: `Customer Message on Ticket ${ticketId}`,
          message: `${author} replied: "${responseMessage.substring(0, 60)}..."`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const [notifications, setNotifications] = useState<Array<{
    id: string;
    recipient: 'admin' | 'customer';
    targetAppId?: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    link?: string;
  }>>([]);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  // Add Family Note
  const addFamilyNote = (familyId: string, text: string) => {
    const newNote: FamilyNote = {
      id: `NOTE-${Date.now()}`,
      familyId,
      author: 'Case Manager',
      text,
      timestamp: new Date().toLocaleString(),
    };
    setNotes(prev => [newNote, ...prev]);

    setTimeline(prev => [
      {
        id: `TL-NOTE-${Date.now()}`,
        familyId,
        title: 'Case Manager Note Added',
        description: text.length > 50 ? `${text.substring(0, 50)}...` : text,
        type: 'note',
        timestamp: new Date().toLocaleString(),
        actor: 'Case Manager',
      },
      ...prev,
    ]);
  };

  // Toggle Customer Edit Permission
  const toggleCustomerEdit = async (familyId: string, allowEdit: boolean) => {
    setFamilies(prev =>
      prev.map(f => (f.id === familyId || f.applicationId === familyId ? { ...f, allowCustomerEdit: allowEdit } : f))
    );
    
    // Cross-tab sync: Admin portal doesn't have liveDashboardData loaded in memory, 
    // so we must read and update localStorage directly to trigger the 'storage' event in the Customer portal tab.
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem('bridge360_live_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.family && (parsed.family.sys_id === familyId || parsed.family.applicationId === familyId)) {
            parsed.family.allowCustomerEdit = allowEdit;
            localStorage.setItem('bridge360_live_data', JSON.stringify(parsed));
            // If the customer tab is open in the same window, it will receive the storage event and instantly unlock.
            if (liveDashboardData && (liveDashboardData.family?.sys_id === familyId || liveDashboardData.family?.applicationId === familyId)) {
               setLiveDashboardDataState(parsed);
            }
          }
        }
      } catch (e) {
        console.warn('Failed to sync live data across tabs', e);
      }
    }

    try {
      await snToggleCustomerEdit(familyId, allowEdit);
    } catch (e) {
      console.warn('Error toggling edit permission in ServiceNow:', e);
    }
  };

  // Customer Uploads Requested Document
  const uploadCustomerDoc = async (applicationId: string, docType: string, fileName: string, fileSize: string, rawText?: string) => {
    const newDoc: DocumentRecord = {
      id: `DOC-${Date.now()}`,
      familyId: applicationId,
      applicationId,
      documentType: (docType as any) || 'Supporting Document',
      fileName,
      fileSize,
      verificationStatus: 'In Review',
      extractedFields: [
        { key: 'docType', label: 'Document Type', value: docType, confidence: 99, category: 'High', verified: false },
        { key: 'appId', label: 'Application ID', value: applicationId, confidence: 100, category: 'High', verified: true },
      ],
      ocrRawText: rawText || `Uploaded Document: ${fileName}\nType: ${docType}\nStatus: Queued for Officer Review`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    setDocuments(prev => [newDoc, ...prev]);
    setFamilies(prev =>
      prev.map(f =>
        f.applicationId === applicationId || f.id === applicationId
          ? { ...f, docRequestPending: false, verificationStatus: 'In Review' }
          : f
      )
    );

    if (liveDashboardData && liveDashboardData.family?.applicationId === applicationId) {
      setLiveDashboardData({
        ...liveDashboardData,
        family: { ...liveDashboardData.family, docRequestPending: false, verificationStatus: 'in_review' },
        documents: [
          {
            sys_id: newDoc.id,
            documentType: docType,
            fileName,
            fileSize,
            verificationStatus: 'in_review',
            ocrRawText: newDoc.ocrRawText,
          },
          ...(liveDashboardData.documents || []),
        ],
      });
    }

    try {
      await snUploadCustomerDoc(applicationId, docType, fileName, fileSize, rawText);
    } catch (e) {
      console.warn('Error uploading customer document to ServiceNow:', e);
    }
  };

  // Customer Update Profile
  const updateCustomerProfile = async (applicationId: string, profileData: any) => {
    setFamilies(prev =>
      prev.map(f => {
        if (f.applicationId === applicationId || f.id === applicationId) {
          return {
            ...f,
            primaryLanguage: profileData.primaryLanguage || f.primaryLanguage,
            headOfFamily: {
              ...f.headOfFamily,
              ...profileData,
            },
          };
        }
        return f;
      })
    );

    if (liveDashboardData && liveDashboardData.family?.applicationId === applicationId) {
      setLiveDashboardData({
        ...liveDashboardData,
        family: {
          ...liveDashboardData.family,
          primaryLanguage: profileData.primaryLanguage || liveDashboardData.family.primaryLanguage,
          email: profileData.email || liveDashboardData.family.email,
        },
        members: (liveDashboardData.members || []).map((m: any) => (m.isHead ? { ...m, ...profileData } : m)),
      });
    }

    try {
      await snUpdateCustomerProfile(applicationId, profileData);
    } catch (e) {
      console.warn('Error updating profile in ServiceNow:', e);
    }
  };

  // Admin Request Additional Documents
  const requestAdditionalDocuments = async (applicationId: string, docType: string, notes: string) => {
    setFamilies(prev =>
      prev.map(f =>
        f.applicationId === applicationId || f.id === applicationId
          ? {
              ...f,
              docRequestPending: true,
              docRequestType: docType,
              docRequestNotes: notes,
            }
          : f
      )
    );

    if (liveDashboardData && liveDashboardData.family?.applicationId === applicationId) {
      setLiveDashboardData({
        ...liveDashboardData,
        family: {
          ...liveDashboardData.family,
          docRequestPending: true,
          docRequestType: docType,
          docRequestNotes: notes,
        },
      });
    }

    try {
      await snRequestAdditionalDocuments(applicationId, docType, notes);
    } catch (e) {
      console.warn('Error sending document request to ServiceNow:', e);
    }
  };

  // Run Orchestrated Agentic Workflow (Triage, Document Analysis, Risk, Decision Drafter)
  const runAgenticWorkflow = async (familyId: string): Promise<AgentResult> => {
    const fam = families.find(f => f.id === familyId || f.applicationId === familyId);
    if (!fam) throw new Error('Family not found');

    const famDocs = documents.filter(d => d.familyId === familyId || d.applicationId === familyId);
    
    // 1. Run local agentic pipeline for instant UI feedback
    const result = await AgentOrchestrator.runWorkflow(fam, famDocs, fam.householdSize);

    // 2. Update local document statuses to 'Verified' or 'Flagged' based on agent results
    setDocuments(prev =>
      prev.map(d => {
        if (d.familyId === familyId || d.applicationId === familyId) {
          const isFlagged = result.docAnalysis.discrepancies.some(disc => disc.includes(d.documentType));
          return {
            ...d,
            verificationStatus: isFlagged ? 'Rejected' : 'Verified',
            notes: isFlagged ? 'Flagged by Document Analyst Agent' : 'Verified by Document Analyst Agent',
          };
        }
        return d;
      })
    );

    // 3. Update family record state locally (assigned officer, priority, registration status)
    setFamilies(prev =>
      prev.map(f => {
        if (f.id === familyId || f.applicationId === familyId) {
          const seq = f.applicationId.split('-')[2] || '000001';
          const mintedRid = `RID-2026-${seq}`;
          const totalHousehold = 1 + (f.members ? f.members.length : 0);
          const mintedFamId = totalHousehold === 1 ? mintedRid : `FAM-2026-${seq}`;
          const isApproved = result.decisionDraft.recommendation === 'Approved';

          return {
            ...f,
            assignedOfficer: result.triage.assignedOfficer,
            priority: result.triage.priority,
            verificationStatus: result.docAnalysis.status === 'Verified' ? 'Verified' : 'Requires Review',
            registrationStatus: isApproved ? 'Approved' : 'Under Review',
            caseStatus: isApproved ? 'Active' : f.caseStatus,
            bridge360Id: isApproved ? mintedFamId : f.bridge360Id,
            familyId: isApproved ? mintedFamId : f.familyId,
            headOfFamily: {
              ...f.headOfFamily,
              refugeeId: isApproved ? mintedRid : f.headOfFamily?.refugeeId,
            },
          };
        }
        return f;
      })
    );

    // 4. Create Decision Draft Note locally
    const newNote: FamilyNote = {
      id: `NOTE-AGENT-${Date.now()}`,
      familyId,
      author: 'AI Intern Agent',
      text: `Draft Recommendation: ${result.decisionDraft.recommendation}\nJustification: ${result.decisionDraft.justification}`,
      timestamp: new Date().toLocaleString(),
    };
    setNotes(prev => [newNote, ...prev]);

    setTimeline(prev => [
      {
        id: `TL-AGENT-${Date.now()}`,
        familyId,
        title: 'Orchestrated Agent Workflow Completed',
        description: `Recommendation: ${result.decisionDraft.recommendation}`,
        type: 'note',
        timestamp: new Date().toLocaleString(),
        actor: 'AI Intern Agent',
      },
      ...prev,
    ]);

    // 5. Trigger server-side ServiceNow script execution (runs u_bridge360 tables sync)
    try {
      await snRunAgenticWorkflow((fam as any).sys_id || familyId);
    } catch (e) {
      console.warn('snRunAgenticWorkflow server execution warning:', e);
    }

    return result;
  };

  return (
    <Bridge360Context.Provider
      value={{
        activePortal,
        setActivePortal,
        adminView,
        setAdminView,
        selectedFamilyId,
        setSelectedFamilyId,
        families,
        documents,
        cases,
        referrals,
        appointments,
        tickets,
        timeline,
        notes,
        partnerAgencies,
        authenticatedAppId,
        setAuthenticatedAppId,
        liveDashboardData,
        setLiveDashboardData,
        refreshLiveAdminData,
        submitRegistration,
        verifyOTP,
        updateVerificationStatus,
        approveEntireApplication,
        rejectApplication,
        createCase,
        updateCaseStatus,
        toggleTask,
        createReferral,
        updateReferralStatus,
        createAppointment,
        raiseCustomerTicket,
        respondToTicket,
        addFamilyNote,
        toggleCustomerEdit,
        uploadCustomerDoc,
        updateCustomerProfile,
        requestAdditionalDocuments,
        runAgenticWorkflow,
        notifications,
        setNotifications,
        markNotificationRead,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </Bridge360Context.Provider>
  );
};

export const useBridge360 = () => {
  const context = useContext(Bridge360Context);
  if (!context) {
    throw new Error('useBridge360 must be used within a Bridge360Provider');
  }
  return context;
};
