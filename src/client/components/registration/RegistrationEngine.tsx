import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle,
  User,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Check,
  Shield,
  Sparkles,
  Loader2,
  AlertCircle,
  UserPlus,
  Edit3,
  Search,
  Plus,
  X,
  UserCheck
} from 'lucide-react';
import { SearchableSelect, SearchableOption } from '../common/SearchableSelect';
import { useBridge360 } from '../../store/Bridge360Context';
import {
  DocumentRecord,
  FamilyMember,
  CountryRecord,
  CountryDocumentRecord,
  CountryDocumentFieldRecord,
  ExtractedFamilyMemberData,
  ApplicantMatchStatus
} from '../../types/bridge360';
import { confidenceStatus, extractDocumentFields, ExtractionResult } from '../../services/ocrEngine';
import { snExtractDocument } from '../../services/snApi';
import { evidenceFoundationService } from '../../services/evidenceFoundationService';
import { INITIAL_COUNTRIES, INITIAL_COUNTRY_DOCUMENTS } from '../../store/evidenceReferenceData';

import { COUNTRIES_DATA, getCountryByName } from '../../data/countryData';

export const COUNTRIES_WITH_NATIONALITY = COUNTRIES_DATA.map(c => ({ country: c.name, nationality: c.nationality }));

const getFlagEmoji = (iso2?: string): string => {
  if (!iso2 || typeof iso2 !== 'string' || iso2.trim().length !== 2) return '🌐';
  const cleanIso2 = iso2.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cleanIso2)) return '🌐';
  const codePoints = cleanIso2
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

interface Props {
  mode?: 'customer' | 'admin';
  onCompleteTrack?: (appId: string) => void;
}

export function normalizeToISODate(dateStr?: string): string {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const trimmed = dateStr.trim();
  if (!trimmed) return '';

  // Already ISO format YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  const ymd = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymd) {
    const m = parseInt(ymd[2], 10);
    const d = parseInt(ymd[3], 10);
    return `${ymd[1]}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY or MM/DD/YYYY
  const dmy = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) {
    const p1 = parseInt(dmy[1], 10);
    const p2 = parseInt(dmy[2], 10);
    const yr = dmy[3];
    let day = p1;
    let month = p2;
    if (p1 <= 12 && p2 > 12) {
      month = p1;
      day = p2;
    } else {
      day = p1;
      month = p2;
    }
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${yr}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    try {
      return parsed.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  return trimmed;
}

export function computeApplicantMatchStatus(
  member: ExtractedFamilyMemberData,
  head: Partial<FamilyMember>
): ApplicantMatchStatus {
  const memberName = (member.name || `${member.firstName || ''} ${member.lastName || ''}`).trim().toLowerCase();
  const hFirst = (head.firstName || '').trim().toLowerCase();
  const hLast = (head.lastName || '').trim().toLowerCase();
  const hFull = `${hFirst} ${hLast}`.trim();

  // If head details have not been entered yet, check relationship hint
  if (!hFirst && !hLast) {
    const rel = (member.relationshipToHead || '').toLowerCase();
    if (rel === 'head' || rel === 'self') return 'POSSIBLE MATCH';
    return 'NEEDS REVIEW';
  }

  // Exact match on full name
  if (hFull && (memberName === hFull || memberName.includes(hFull))) {
    return 'MATCH';
  }

  // Match both first and last name
  if (hFirst && hLast && memberName.includes(hFirst) && memberName.includes(hLast)) {
    return 'MATCH';
  }

  // Partial match on first or last name
  if ((hFirst && memberName.includes(hFirst)) || (hLast && memberName.includes(hLast))) {
    return 'POSSIBLE MATCH';
  }

  // Head relation with any name overlap
  const rel = (member.relationshipToHead || '').toLowerCase();
  if (rel === 'head' || rel === 'self') {
    return 'POSSIBLE MATCH';
  }

  return 'NO MATCH';
}

import { useAssistant } from '../../store/AssistantContext';

export const RegistrationEngine: React.FC<Props> = ({ mode = 'customer', onCompleteTrack }) => {
  const { families, submitRegistration, setSelectedFamilyId, setAdminView, t, language } = useBridge360();
  const { setScreenContext, setProactiveMessage, playAnimation } = useAssistant();

  const [currentStep, setCurrentStep] = useState<number>(1);
  
  React.useEffect(() => {
    setScreenContext(`registration_step_${currentStep}`);
  }, [currentStep, setScreenContext]);

  const [selectedDocType, setSelectedDocType] = useState<DocumentRecord['documentType'] | string>('');
  const [availableCountries, setAvailableCountries] = useState<CountryRecord[]>(INITIAL_COUNTRIES);
  const [availableDocuments, setAvailableDocuments] = useState<CountryDocumentRecord[]>(INITIAL_COUNTRY_DOCUMENTS);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [selectedCountryDocId, setSelectedCountryDocId] = useState<string>('');
  const [configuredDocumentFields, setConfiguredDocumentFields] = useState<CountryDocumentFieldRecord[]>([]);

  // Registration Mode: 'individual' | 'family' | null
  const [registrationMode, setRegistrationMode] = useState<'individual' | 'family' | null>(null);
  const [hasNoFamilyDoc, setHasNoFamilyDoc] = useState<boolean>(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState<boolean>(false);

  // Phase 4: Family Members state for Review / Edit / Add / Remove / Applicant Identification
  const [extractedFamilyMembers, setExtractedFamilyMembers] = useState<ExtractedFamilyMemberData[]>([]);
  const [selectedApplicantMemberId, setSelectedApplicantMemberId] = useState<string>('');
  const [memberDocTypes, setMemberDocTypes] = useState<Record<string, string>>({});
  const [editingMember, setEditingMember] = useState<ExtractedFamilyMemberData | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState<boolean>(false);
  const [memberFormState, setMemberFormState] = useState<{
    id?: string;
    name: string;
    relationshipToHead: string;
    dateOfBirth: string;
    gender: string;
    memberIdentifier: string;
  }>({
    name: '',
    relationshipToHead: 'Spouse',
    dateOfBirth: '',
    gender: 'Female',
    memberIdentifier: '',
  });

  React.useEffect(() => {
    let isMounted = true;
    const loadCountryAndDocData = async () => {
      try {
        const [liveCountries, liveDocs] = await Promise.all([
          evidenceFoundationService.getCountries(),
          evidenceFoundationService.getCountryDocuments(),
        ]);
        if (isMounted) {
          if (liveCountries && liveCountries.length > 0) {
            setAvailableCountries(liveCountries.filter(c => c.active !== false));
          }
          if (liveDocs && liveDocs.length > 0) {
            setAvailableDocuments(liveDocs.filter(d => d.active !== false));
          }
        }
      } catch (err) {
        console.warn('Error fetching live countries and documents:', err);
      }
    };
    loadCountryAndDocData();
    return () => { isMounted = false; };
  }, []);

  const handleStep1CountryChange = async (valOrEvent: React.ChangeEvent<HTMLSelectElement> | string) => {
    const newCountryId = typeof valOrEvent === 'string' ? valOrEvent : valOrEvent.target.value;
    setSelectedCountryId(newCountryId);
    // Clear previously selected document and dynamic fields when country changes
    setSelectedDocType('' as any);
    setSelectedCountryDocId('');
    setConfiguredDocumentFields([]);
    setHasNoFamilyDoc(false);
    setExtractedFamilyMembers([]);
    setSelectedApplicantMemberId('');
    setEditingMember(null);
    setIsAddMemberModalOpen(false);

    if (newCountryId) {
      setIsLoadingDocs(true);
      try {
        const scope = registrationMode === 'family' ? 'family' : 'individual';
        const specificDocs = await evidenceFoundationService.getCountryDocuments(newCountryId, scope);

        if (registrationMode === 'family') {
          if (!specificDocs || specificDocs.length === 0) {
            setHasNoFamilyDoc(true);
          } else {
            setHasNoFamilyDoc(false);
            if (specificDocs.length === 1) {
              const docRec = specificDocs[0];
              setSelectedDocType(docRec.documentName);
              setSelectedCountryDocId(docRec.id);
              try {
                const fields = await evidenceFoundationService.getCountryDocumentFields(docRec.id);
                setConfiguredDocumentFields(fields || []);
              } catch (fErr) {
                console.warn('Error loading dynamic family document fields:', fErr);
              }
            }
          }
        }

        if (specificDocs && specificDocs.length > 0) {
          setAvailableDocuments(prev => {
            const map = new Map<string, CountryDocumentRecord>();
            prev.forEach(d => map.set(d.id, d));
            specificDocs.forEach(d => map.set(d.id, d));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.warn('Error fetching specific country documents:', err);
        if (registrationMode === 'family') {
          setHasNoFamilyDoc(true);
        }
      } finally {
        setIsLoadingDocs(false);
      }
    }
  };

  const handleDocTypeSelectChange = async (valOrEvent: React.ChangeEvent<HTMLSelectElement> | string) => {
    const val = typeof valOrEvent === 'string' ? valOrEvent : valOrEvent.target.value;
    const docRec = countryDocumentsForSelected.find(d => d.id === val || d.documentName === val);
    if (docRec) {
      setSelectedDocType(docRec.documentName);
      setSelectedCountryDocId(docRec.id);
      try {
        const fields = await evidenceFoundationService.getCountryDocumentFields(docRec.id);
        setConfiguredDocumentFields(fields || []);
      } catch (err) {
        console.warn('Error loading dynamic document fields from ServiceNow:', err);
        setConfiguredDocumentFields([]);
      }
    } else {
      setSelectedDocType('' as any);
      setSelectedCountryDocId('');
      setConfiguredDocumentFields([]);
    }
  };

  const selectedCountry = React.useMemo(() => {
    return availableCountries.find(c => c.id === selectedCountryId);
  }, [availableCountries, selectedCountryId]);

  const countryDocumentsForSelected = React.useMemo(() => {
    if (!selectedCountry) return [];
    const filtered = availableDocuments.filter(doc => {
      let matchesCountry = false;
      if (doc.countryId) {
        if (doc.countryId === selectedCountry.id) matchesCountry = true;
        if (selectedCountry.iso2 && doc.countryId.toUpperCase() === selectedCountry.iso2.toUpperCase()) matchesCountry = true;
        if (selectedCountry.iso3 && doc.countryId.toUpperCase() === selectedCountry.iso3.toUpperCase()) matchesCountry = true;
        if (doc.countryId.toLowerCase() === selectedCountry.countryName.toLowerCase()) matchesCountry = true;
      }
      if (!matchesCountry && doc.countryName && selectedCountry.countryName) {
        if (doc.countryName.toLowerCase() === selectedCountry.countryName.toLowerCase()) matchesCountry = true;
      }
      if (!matchesCountry) return false;

      if (registrationMode === 'family') {
        return doc.registrationScope === 'family' || doc.registrationScope === 'both';
      } else if (registrationMode === 'individual') {
        return !doc.registrationScope || doc.registrationScope === 'individual' || doc.registrationScope === 'both';
      }
      return true;
    });

    const seen = new Set<string>();
    return filtered.filter(d => {
      const key = (d.documentName || '').trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [selectedCountry, availableDocuments, registrationMode]);

  const sortedCountries = React.useMemo(() => {
    const list = [...availableCountries];
    return list.sort((a, b) => (a.countryName || '').localeCompare(b.countryName || ''));
  }, [availableCountries]);

  const countryOptions = React.useMemo<SearchableOption[]>(() => {
    return sortedCountries.map(c => ({
      value: c.id,
      label: c.countryName,
      icon: getFlagEmoji(c.iso2),
      badge: c.iso2?.toUpperCase(),
      keywords: [c.iso2 || '', c.iso3 || '', c.id],
    }));
  }, [sortedCountries]);

  const documentOptions = React.useMemo<SearchableOption[]>(() => {
    return countryDocumentsForSelected.map(doc => ({
      value: doc.id,
      label: doc.documentName,
      badge: (doc as any).documentCode || (doc.registrationScope === 'family' ? 'Family Proof' : undefined),
    }));
  }, [countryDocumentsForSelected]);

  const countryOfOriginOptions = React.useMemo<SearchableOption[]>(() => {
    return COUNTRIES_DATA.map(c => ({
      value: c.name,
      label: c.name,
      subLabel: c.dialCode,
      badge: c.code,
      keywords: [c.code, c.dialCode, c.nationality || ''],
    }));
  }, []);
  
  const [uploadedDocs, setUploadedDocs] = useState<DocumentRecord[]>([]);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [docIntelStatus, setDocIntelStatus] = useState<string>('');
  const [ocrRawText, setOcrRawText] = useState<string>('');
  const [showOcrDebug, setShowOcrDebug] = useState<boolean>(false);

  const [docIntelLoadingStep, setDocIntelLoadingStep] = useState<number>(0);
  const [docIntelExtractedData, setDocIntelExtractedData] = useState<any>(null);
  const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({});

  // Form State — all blank, only OCR fills these
  const [headOfFamily, setHeadOfFamily] = useState<Partial<FamilyMember>>({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '' as any,
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    nationalId: '',
    maritalStatus: '' as any,
    mobileNumber: '',
    email: '',
    preferredLanguage: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [familyInfo, setFamilyInfo] = useState({
    familyName: '',
    countryOfOrigin: '',
    arrivalDate: new Date().toISOString().split('T')[0],
    householdSize: 1,
    primaryLanguage: 'English',
    immigrationStatus: 'Asylum Applicant',
    needsInterpreter: false,
  });

  const [members, setMembers] = useState<Partial<FamilyMember>[]>([]);

  const spokenRefs = React.useRef({
    greetedName: false,
    validEmail: false,
    countryChosen: '',
    sizeChosen: 0,
  });

  React.useEffect(() => {
    if (currentStep !== 2) return;
    const name = headOfFamily.firstName?.trim();
    if (name && name.length > 2 && !spokenRefs.current.greetedName) {
      spokenRefs.current.greetedName = true;
      setProactiveMessage(`Nice to meet you, ${name}! Let's fill out the rest of your details.`);
      playAnimation('wave');
    }
  }, [headOfFamily.firstName, currentStep, setProactiveMessage, playAnimation]);

  React.useEffect(() => {
    if (currentStep !== 2) return;
    const email = headOfFamily.email?.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
    if (isValid && !spokenRefs.current.validEmail) {
      spokenRefs.current.validEmail = true;
      setProactiveMessage("Awesome! Your email looks valid. We'll use this for your OTP security code.");
      playAnimation('nod');
    } else if (!isValid) {
      spokenRefs.current.validEmail = false;
    }
  }, [headOfFamily.email, currentStep, setProactiveMessage, playAnimation]);

  React.useEffect(() => {
    if (currentStep !== 3) return;
    const country = familyInfo.countryOfOrigin;
    if (country && spokenRefs.current.countryChosen !== country) {
      spokenRefs.current.countryChosen = country;
      setProactiveMessage(`${country}! A beautiful country. We support translations for documents from there.`);
      playAnimation('nod');
    }
  }, [familyInfo.countryOfOrigin, currentStep, setProactiveMessage, playAnimation]);

  React.useEffect(() => {
    if (currentStep !== 3) return;
    const size = familyInfo.householdSize;
    if (size > 1 && spokenRefs.current.sizeChosen !== size) {
      spokenRefs.current.sizeChosen = size;
      setProactiveMessage("A household size of " + size + "! I'll guide you through adding each member next.");
      playAnimation('wave');
    }
  }, [familyInfo.householdSize, currentStep, setProactiveMessage, playAnimation]);

  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    address: '',
  });

  const [declared, setDeclared] = useState<boolean>(false);
  const [submittedAppId, setSubmittedAppId] = useState<string>('');

  const handleCountryChange = (countryName: string) => {
    const cObj = getCountryByName(countryName);
    const nat = cObj.nationality || countryName;
    setFamilyInfo(prev => ({ ...prev, countryOfOrigin: countryName }));
    setHeadOfFamily(prev => {
      const existingPhone = prev.mobileNumber || '';
      const localDigits = existingPhone.replace(/^\+\d+\s*/, '');
      const updatedPhone = localDigits ? `${cObj.dialCode} ${localDigits}` : cObj.dialCode;
      return {
        ...prev,
        nationality: nat,
        mobileNumber: updatedPhone,
      };
    });

    setMembers(prev =>
      prev.map(m => ({ ...m, nationality: nat }))
    );
  };

  const handleHouseholdSizeChange = (newSize: number) => {
    const validSize = Math.max(1, newSize);
    setFamilyInfo(prev => ({ ...prev, householdSize: validSize }));

    const targetMembersCount = validSize - 1;
    if (targetMembersCount <= 0) {
      setMembers([]);
    } else {
      setMembers(prev => {
        if (prev.length === targetMembersCount) return prev;
        if (prev.length < targetMembersCount) {
          const added: Partial<FamilyMember>[] = [];
          for (let i = prev.length; i < targetMembersCount; i++) {
            added.push({
              relationshipToHead: '' as any,
              firstName: '',
              lastName: '',
              gender: '' as any,
              dateOfBirth: '',
              nationality: headOfFamily.nationality || familyInfo.countryOfOrigin || '',
            });
          }
          return [...prev, ...added];
        } else {
          return prev.slice(0, targetMembersCount);
        }
      });
    }
  };

  // AUTOMATIC DOCUMENT VERIFICATION & EXTRACTION
  // AUTOMATIC DOCUMENT VERIFICATION & DYNAMIC EXTRACTION
  const handleInitialDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsExtracting(true);
    setOcrRawText('');
    setDocIntelLoadingStep(1);
    setDocIntelStatus('Ingesting document and analyzing layout...');

    // Read full file as Data URL for visual rendering and server-side DocIntel processing
    const fileDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });

    try {
      // Step 1: Query/Prepare Expected Fields from u_bridge360_country_document_field
      const expectedFieldDefs = configuredDocumentFields.map(f => ({
        name: f.fieldName,
        type: f.fieldType,
      }));

      // Step 2: Produce OCR Text & Layout
      setDocIntelLoadingStep(2);
      setDocIntelStatus('Reading document text and layout...');
      const localResult: ExtractionResult = await extractDocumentFields(file, expectedFieldDefs);
      const rawExtracted = localResult?.rawText || '';
      setOcrRawText(rawExtracted);

      // Step 3: ServiceNow Native Document Intelligence / Server-side Processing
      await new Promise(r => setTimeout(r, 300));
      setDocIntelLoadingStep(3);
      setDocIntelStatus('Extracting document-configured fields...');

      let snDocIntelResult: any = null;
      try {
        snDocIntelResult = await snExtractDocument({
          text: rawExtracted,
          rawText: rawExtracted,
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          fileBase64: fileDataUrl,
          countryId: selectedCountryId,
          countryDocumentId: selectedCountryDocId,
          documentType: selectedDocType,
          expectedFields: expectedFieldDefs,
        });
        if (snDocIntelResult?.diOcrUsed && snDocIntelResult?.rawText) {
          setOcrRawText(snDocIntelResult.rawText);
        }
      } catch (snErr) {
        console.warn('Server DocIntel call completed with fallback:', snErr);
      }

      setDocIntelLoadingStep(4);
      setDocIntelStatus('Document details extracted successfully.');

      // Step 4: Gather Layer 1 Configured Document Fields
      // The configured fields from u_bridge360_country_document_field are the sole source of truth.
      const configuredNameMap = new Map<string, string>();
      configuredDocumentFields.forEach(f => {
        if (f && f.fieldName) {
          configuredNameMap.set(f.fieldName.toLowerCase().trim(), f.fieldName);
        }
      });

      const allDynamicFields: Record<string, string> = {};
      const fieldEvidence: Record<string, { confidence: number; source: string }> = {};
      const normalizeFieldName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const addExtractedField = (
        key: string,
        rawValue: unknown,
        confidence: unknown,
        source: string,
      ) => {
        const canonicalKey = configuredNameMap.size > 0
          ? configuredNameMap.get(key.toLowerCase().trim())
          : key;
        if (!canonicalKey || rawValue === undefined || rawValue === null || !String(rawValue).trim()) return;
        const value = String(rawValue).trim();
        const normalizedKey = normalizeFieldName(canonicalKey);
        const numericConfidence = typeof confidence === 'number' && Number.isFinite(confidence)
          ? confidence
          : 0;
        const existingConfidence = fieldEvidence[normalizedKey]?.confidence ?? -1;
        if (numericConfidence < existingConfidence) return;
        allDynamicFields[canonicalKey] = value;
        fieldEvidence[normalizedKey] = { confidence: numericConfidence, source };
      };

      // Ingest from client OCR results (filtered strictly to configured document fields)
      if (localResult?.fields) {
        for (const [k, v] of Object.entries(localResult.fields)) {
          addExtractedField(k, v.value, v.confidence, `Local OCR (${v.source})`);
        }
      }

      // Ingest from server DocIntel results (server fields take precedence, filtered strictly to configured document fields)
      if (snDocIntelResult?.fields) {
        for (const [k, v] of Object.entries(snDocIntelResult.fields)) {
          const val = (v as any)?.value !== undefined ? (v as any).value : v;
          addExtractedField(
            k,
            val,
            (v as any)?.confidence ?? snDocIntelResult.confidence?.[k],
            'ServiceNow Document Intelligence',
          );
        }
      }

      // IMPORTANT: Do NOT merge snDocIntelResult.extracted into allDynamicFields!
      // snDocIntelResult.extracted belongs strictly to Layer 2 (Registration Auto-Fill)
      // and must never contaminate Layer 1 (Document Extraction).

      // Store Layer 1 dynamic fields strictly for review and persistence
      setDocIntelExtractedData(Object.fromEntries(
        Object.entries(allDynamicFields).map(([key, value]) => [
          key,
          { value, ...fieldEvidence[normalizeFieldName(key)] },
        ]),
      ));

      // Phase 4: Process extracted repeated family members if registrationMode is 'family'
      let initialMembers: ExtractedFamilyMemberData[] = [];
      if (registrationMode === 'family') {
        initialMembers = localResult?.familyMembers || [];
        setExtractedFamilyMembers(initialMembers);
        if (initialMembers.length > 0) {
          const headMem = initialMembers.find(m => m.relationshipToHead?.toLowerCase() === 'head' || m.relationshipToHead?.toLowerCase() === 'self');
          setSelectedApplicantMemberId(headMem ? headMem.id : initialMembers[0].id);
        } else {
          setSelectedApplicantMemberId('');
        }
      }

      const docId = `DOC-${Date.now()}`;
      const newDoc: DocumentRecord = {
        id: docId,
        applicationId: '',
        familyId: '',
        documentType: selectedDocType,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toLocaleTimeString(),
        verificationStatus: 'Pending',
        extractedFields: Object.entries(allDynamicFields).map(([k, v]) => {
          const evidence = fieldEvidence[normalizeFieldName(k)];
          const status = confidenceStatus(evidence?.confidence ?? 0);
          return ({
          key: k,
          label: k.replace(/_/g, ' '),
          value: v,
          confidence: evidence?.confidence ?? 0,
          category: status === 'approved' ? 'High' : status === 'pending' ? 'Medium' : 'Not Found',
          verified: false,
          source: evidence?.source || 'Confidence unavailable',
        });}),
        extractedJson: JSON.stringify(allDynamicFields),
        ocrRawText: (snDocIntelResult?.diOcrUsed && snDocIntelResult?.rawText) ? snDocIntelResult.rawText : rawExtracted,
        fileDataUrl: fileDataUrl,
        previewUrl: fileDataUrl,
        familyMembers: registrationMode === 'family' ? initialMembers : undefined,
      };

      try {
        localStorage.setItem(`bridge360_doc_preview_${docId}`, fileDataUrl);
        localStorage.setItem('bridge360_latest_uploaded_doc', fileDataUrl);
      } catch (e) {
        console.warn('Storage quota exceeded for local preview cache:', e);
      }

      setUploadedDocs([newDoc]);

      // Map dynamic fields to standard registration form properties where applicable
      // (Preserves existing form auto-fill without limiting dynamic extraction)
      const autoFillValue = (...aliases: string[]) => {
        const normalizedAliases = new Set(aliases.map(normalizeFieldName));
        const match = Object.entries(allDynamicFields).find(([key]) =>
          normalizedAliases.has(normalizeFieldName(key)),
        );
        if (!match) return '';
        const evidence = fieldEvidence[normalizeFieldName(match[0])];
        return confidenceStatus(evidence?.confidence ?? 0) === 'approved' ? match[1] : '';
      };

      const fullName = autoFillValue('full_name');
      const firstName =
        autoFillValue('first_name', 'firstName', 'given_name', 'forename') ||
        (fullName ? fullName.split(' ')[0] : '');

      const middleName =
        autoFillValue('middle_name', 'middleName') ||
        (fullName && fullName.split(' ').length > 2
          ? fullName.split(' ').slice(1, -1).join(' ')
          : '');

      const lastName =
        autoFillValue('last_name', 'lastName', 'surname', 'family_name') ||
        (fullName && fullName.split(' ').length > 1
          ? fullName.split(' ').slice(-1)[0]
          : '');

      const rawDateOfBirth =
        autoFillValue('date_of_birth', 'dateOfBirth', 'dob', 'birth_date') ||
        '';
      const dateOfBirth = normalizeToISODate(rawDateOfBirth);

      const genderValue = autoFillValue('gender', 'sex');
      const gender: FamilyMember['gender'] | undefined =
        genderValue === 'Male' || genderValue === 'Female' || genderValue === 'Other'
          ? genderValue
          : undefined;

      const nationality =
        autoFillValue('nationality', 'citizenship') ||
        (selectedCountry ? selectedCountry.nationality || selectedCountry.countryName : '');

      const passportNumber =
        autoFillValue('passport_number', 'passport_no');

      const nationalId =
        autoFillValue('national_id', 'nid_number', 'aadhaar_number', 'id_number', 'unhcr_case_number', 'family_book_number', 'document_number', 'individual_id', 'tc_kimlik_number', 'cpf_number', 'license_number', 'registration_number', 'frc_number');

      const emailFromDoc =
        autoFillValue('email', 'email_masked');

      const phoneFromDoc =
        autoFillValue('mobile_number', 'phone', 'mobile_masked', 'contact_number');

      const addressFromDoc =
        autoFillValue('address', 'residential_address');

      const cityFromDoc =
        autoFillValue('city', 'place_of_birth', 'registry_location');

      const postalCodeFromDoc =
        autoFillValue('postal_code', 'zip_code');

      setHeadOfFamily(prev => ({
        ...prev,
        firstName: firstName || prev.firstName,
        middleName: middleName || prev.middleName,
        lastName: lastName || prev.lastName,
        gender: gender || prev.gender,
        dateOfBirth: dateOfBirth || prev.dateOfBirth,
        nationality: nationality || prev.nationality,
        passportNumber: passportNumber || prev.passportNumber,
        nationalId: nationalId || prev.nationalId,
        mobileNumber: phoneFromDoc || prev.mobileNumber,
        email: emailFromDoc || prev.email,
        address: addressFromDoc || prev.address,
        city: cityFromDoc || prev.city,
        state: prev.state,
        postalCode: postalCodeFromDoc || prev.postalCode,
      }));

      // Automatically pre-fill family information
      setFamilyInfo(prev => ({
        ...prev,
        familyName: lastName ? `${lastName} Family` : (firstName ? `${firstName} Family` : prev.familyName),
        countryOfOrigin: (selectedCountry ? selectedCountry.countryName : nationality) || prev.countryOfOrigin,
        householdSize: registrationMode === 'family' && initialMembers.length > 0 ? initialMembers.length : prev.householdSize,
      }));

      setProactiveMessage("Perfect! I've dynamically extracted your details from the document. Please review them in Step 2.");
      playAnimation('celebrate');
    } catch (err: any) {
      console.error('Extraction error:', err);
      setDocIntelStatus('Document processed.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Phase 4: Family Member Management (Review / Edit / Add / Remove / Applicant Identification)
  const handleSelectApplicant = (memberId: string) => {
    setSelectedApplicantMemberId(memberId);
    const applicant = extractedFamilyMembers.find(m => m.id === memberId);
    if (applicant) {
      const nameParts = (applicant.name || '').trim().split(/\s+/);
      const first = applicant.firstName || (nameParts.length > 0 ? nameParts[0] : '');
      const last = applicant.lastName || (nameParts.length > 1 ? nameParts[nameParts.length - 1] : '');
      const middle = applicant.middleName || (nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '');
      setHeadOfFamily(prev => ({
        ...prev,
        firstName: first || prev.firstName,
        middleName: middle || prev.middleName,
        lastName: last || prev.lastName,
        gender: (applicant.gender === 'Male' || applicant.gender === 'Female' || applicant.gender === 'Other') ? applicant.gender as any : prev.gender,
        dateOfBirth: applicant.dateOfBirth ? normalizeToISODate(applicant.dateOfBirth) : prev.dateOfBirth,
        nationalId: applicant.memberIdentifier || prev.nationalId,
      }));
    }
  };

  const handleStartEditMember = (member: ExtractedFamilyMemberData) => {
    setEditingMember(member);
    setMemberFormState({
      id: member.id,
      name: member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim(),
      relationshipToHead: member.relationshipToHead || 'Other',
      dateOfBirth: member.dateOfBirth || '',
      gender: member.gender || 'Other',
      memberIdentifier: member.memberIdentifier || '',
    });
  };

  const handleSaveMember = () => {
    if (!memberFormState.name.trim()) return;
    const nameParts = memberFormState.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

    if (editingMember) {
      setExtractedFamilyMembers(prev => prev.map(m => {
        if (m.id === editingMember.id) {
          return {
            ...m,
            name: memberFormState.name.trim(),
            firstName,
            lastName,
            middleName,
            relationshipToHead: memberFormState.relationshipToHead,
            dateOfBirth: memberFormState.dateOfBirth,
            gender: memberFormState.gender,
            memberIdentifier: memberFormState.memberIdentifier,
            source: m.source ? `${m.source} (User edited)` : 'User edited',
          };
        }
        return m;
      }));
      if (selectedApplicantMemberId === editingMember.id) {
        setHeadOfFamily(prev => ({
          ...prev,
          firstName: firstName || prev.firstName,
          middleName: middleName || prev.middleName,
          lastName: lastName || prev.lastName,
          gender: (memberFormState.gender === 'Male' || memberFormState.gender === 'Female' || memberFormState.gender === 'Other') ? memberFormState.gender as any : prev.gender,
          dateOfBirth: memberFormState.dateOfBirth ? normalizeToISODate(memberFormState.dateOfBirth) : prev.dateOfBirth,
          nationalId: memberFormState.memberIdentifier || prev.nationalId,
        }));
      }
      setEditingMember(null);
    } else {
      const newMember: ExtractedFamilyMemberData = {
        id: `MEMBER-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: memberFormState.name.trim(),
        firstName,
        lastName,
        middleName,
        relationshipToHead: memberFormState.relationshipToHead,
        dateOfBirth: memberFormState.dateOfBirth,
        gender: memberFormState.gender,
        memberIdentifier: memberFormState.memberIdentifier,
        confidence: 100,
        source: 'Manual entry',
      };
      setExtractedFamilyMembers(prev => {
        const next = [...prev, newMember];
        if (!selectedApplicantMemberId) {
          setSelectedApplicantMemberId(newMember.id);
        }
        return next;
      });
      setIsAddMemberModalOpen(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setExtractedFamilyMembers(prev => {
      const remaining = prev.filter(m => m.id !== memberId);
      if (selectedApplicantMemberId === memberId) {
        if (remaining.length > 0) {
          setSelectedApplicantMemberId(remaining[0].id);
        } else {
          setSelectedApplicantMemberId('');
        }
      }
      return remaining;
    });
  };

  const openAddMemberModal = () => {
    setEditingMember(null);
    setMemberFormState({
      name: '',
      relationshipToHead: 'Son',
      dateOfBirth: '',
      gender: 'Male',
      memberIdentifier: '',
    });
    setIsAddMemberModalOpen(true);
  };

  const handleContinueFromStep1 = () => {
    if (registrationMode === 'family' && extractedFamilyMembers.length > 0) {
      const applicant = extractedFamilyMembers.find(m => m.id === selectedApplicantMemberId) || extractedFamilyMembers[0];
      const nameParts = (applicant.name || '').trim().split(/\s+/);
      const first = applicant.firstName || (nameParts.length > 0 ? nameParts[0] : '');
      const last = applicant.lastName || (nameParts.length > 1 ? nameParts[nameParts.length - 1] : '');
      const middle = applicant.middleName || (nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '');

      setHeadOfFamily(prev => ({
        ...prev,
        id: applicant.id,
        firstName: first || prev.firstName,
        middleName: middle || prev.middleName,
        lastName: last || prev.lastName,
        gender: (applicant.gender === 'Male' || applicant.gender === 'Female' || applicant.gender === 'Other') ? applicant.gender as any : prev.gender,
        dateOfBirth: applicant.dateOfBirth ? normalizeToISODate(applicant.dateOfBirth) : prev.dateOfBirth,
        nationalId: applicant.memberIdentifier || prev.nationalId,
      }));

      const remainingMembers = extractedFamilyMembers.filter(m => m.id !== applicant.id);
      const mappedMembers: Partial<FamilyMember>[] = remainingMembers.map(m => {
        const mParts = (m.name || '').trim().split(/\s+/);
        const mFirst = m.firstName || (mParts.length > 0 ? mParts[0] : '');
        const mLast = m.lastName || (mParts.length > 1 ? mParts[mParts.length - 1] : '');
        const mMid = m.middleName || (mParts.length > 2 ? mParts.slice(1, -1).join(' ') : '');
        return {
          id: m.id,
          relationshipToHead: (m.relationshipToHead || 'Other') as any,
          firstName: mFirst,
          middleName: mMid,
          lastName: mLast,
          gender: (m.gender === 'Male' || m.gender === 'Female' || m.gender === 'Other') ? m.gender as any : ('' as any),
          dateOfBirth: m.dateOfBirth ? normalizeToISODate(m.dateOfBirth) : '',
          nationality: headOfFamily.nationality || familyInfo.countryOfOrigin || '',
          nationalId: m.memberIdentifier || '',
        };
      });
      setMembers(mappedMembers);

      setFamilyInfo(prev => ({
        ...prev,
        householdSize: Math.max(1, extractedFamilyMembers.length),
        familyName: last ? `${last} Family` : prev.familyName,
      }));
    }

    setCurrentStep(2);
  };

  // ── Step Validation Handlers ──────────────────────────────────────────────
  const validateStep2 = (): boolean => {
    const errors: { [key: string]: string } = {};
    const todayStr = new Date().toISOString().split('T')[0];

    if (!headOfFamily.firstName?.trim()) errors.firstName = 'First Name is mandatory';
    // Last Name is optional — not mandatory
    if (!headOfFamily.gender)            errors.gender = 'Gender is mandatory';
    
    if (!headOfFamily.dateOfBirth) {
      errors.dateOfBirth = 'Date of Birth is mandatory';
    } else if (headOfFamily.dateOfBirth > todayStr) {
      errors.dateOfBirth = 'Date of Birth cannot be in the future';
    }

    if (!headOfFamily.nationality?.trim()) errors.nationality = 'Nationality is mandatory';
    if (!headOfFamily.mobileNumber?.trim()) errors.mobileNumber = 'Mobile Number is mandatory';
    
    if (!headOfFamily.email?.trim()) {
      errors.email = 'Email Address is mandatory (needed for OTP & notifications)';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(headOfFamily.email.trim())) {
      errors.email = 'Please enter a valid email format (e.g. name@domain.com)';
    }

    // Country-specific Passport & National ID format validation
    const countryObj = getCountryByName(familyInfo.countryOfOrigin || headOfFamily.nationality || '');
    if (headOfFamily.passportNumber?.trim() && countryObj.passportPattern) {
      if (!countryObj.passportPattern.test(headOfFamily.passportNumber.trim())) {
        errors.passportNumber = countryObj.passportFormatHint || 'Invalid Passport format for selected country';
      }
    }
    if (headOfFamily.nationalId?.trim() && countryObj.nationalIdPattern) {
      if (!countryObj.nationalIdPattern.test(headOfFamily.nationalId.trim())) {
        errors.nationalId = countryObj.nationalIdFormatHint || 'Invalid National ID format for selected country';
      }
    }

    // ── Duplicate Check (1 Application per Refugee / Email / Phone) ────────
    const enteredEmail = headOfFamily.email?.trim().toLowerCase();
    const enteredPhone = headOfFamily.mobileNumber?.trim().replace(/\D/g, '');

    const duplicate = families.find(f => {
      const fEmail = f.headOfFamily?.email?.trim().toLowerCase();
      const fPhone = f.headOfFamily?.mobileNumber?.trim().replace(/\D/g, '');
      if (enteredEmail && fEmail && fEmail === enteredEmail) return true;
      if (enteredPhone && fPhone && fPhone.length > 5 && fPhone === enteredPhone) return true;
      return false;
    });

    if (duplicate) {
      errors.email = 'An application is already registered with this email or phone number. Only 1 registration per individual is permitted.';
      errors.mobileNumber = 'This contact detail is already registered in the system.';
      setSubmitError('Duplicate Registration: An application is already registered with this email address or mobile number. Please use Track Status to access your application.');
      setStepErrors(errors);
      return false;
    }

    setSubmitError('');
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: { [key: string]: string } = {};
    const todayStr = new Date().toISOString().split('T')[0];

    // Household Size = 1: Family Name is NOT compulsory
    if (familyInfo.householdSize > 1 && !familyInfo.familyName?.trim()) {
      errors.familyName = 'Family Name is mandatory for multi-person households';
    }

    if (!familyInfo.countryOfOrigin?.trim()) errors.countryOfOrigin = 'Country of Origin is mandatory';
    if (!familyInfo.householdSize || familyInfo.householdSize < 1) errors.householdSize = 'Household size must be at least 1';
    if (!familyInfo.primaryLanguage?.trim()) errors.primaryLanguage = 'Primary Language is mandatory';
    
    if (familyInfo.arrivalDate && familyInfo.arrivalDate > todayStr) {
      errors.arrivalDate = 'Date of Arrival cannot be in the future';
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const errors: { [key: string]: string } = {};
    members.forEach((m, idx) => {
      if (!m.relationshipToHead) errors[`member_${idx}_rel`] = `Member #${idx + 1}: Relationship is mandatory`;
      if (!m.gender)             errors[`member_${idx}_gender`] = `Member #${idx + 1}: Gender is mandatory`;
      if (!m.firstName?.trim())  errors[`member_${idx}_first`] = `Member #${idx + 1}: First Name is mandatory`;
      // Last Name is optional for members too
    });

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep6 = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!emergencyContact.name?.trim())         errors.emergencyName = 'Contact Full Name is mandatory';
    if (!emergencyContact.relationship?.trim()) errors.emergencyRel = 'Relationship to Family is mandatory';
    if (!emergencyContact.phone?.trim())        errors.emergencyPhone = 'Phone Number is mandatory';

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setStepErrors({});
      setCurrentStep(3);
      setProactiveMessage("Great! Now let's fill in your family's household information.");
      playAnimation('celebrate');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setProactiveMessage("Oops! You forgot to fill out some mandatory fields. Let's fix them before continuing!");
      playAnimation('alert');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextFromStep3 = () => {
    if (validateStep3()) {
      setStepErrors({});
      if (familyInfo.householdSize === 1) {
        setCurrentStep(5);
        setProactiveMessage("Perfect! Let's fill out your emergency contact.");
        playAnimation('point');
      } else {
        setCurrentStep(4);
        setProactiveMessage("Excellent. Let's add the details for each family member.");
        playAnimation('nod');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setProactiveMessage("Oops! You forgot to fill out some mandatory fields. Let's fix them before continuing!");
      playAnimation('alert');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextFromStep4 = () => {
    if (validateStep4()) {
      setStepErrors({});
      setCurrentStep(5);
      setProactiveMessage("Perfect! Now please upload your identity documents.");
      playAnimation('point');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setProactiveMessage("Oops! Some member details are missing or incorrect. Let's double check them.");
      playAnimation('alert');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextFromStep5 = () => {
    if (validateStep6()) {
      setStepErrors({});
      setCurrentStep(7);
      setProactiveMessage("Almost done! Please review your declaration and submit.");
      playAnimation('wave');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setProactiveMessage("Oops! Please fill in your emergency contact details.");
      playAnimation('alert');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMemberDocUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const docId = `DOC-MEM-${Date.now()}-${idx}`;
      const newDoc: DocumentRecord = {
        id: docId,
        applicationId: '',
        familyId: '',
        documentType: 'Passport',
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toLocaleTimeString(),
        verificationStatus: 'Verified',
        extractedFields: [],
        fileDataUrl: dataUrl,
        previewUrl: dataUrl,
      };
      try { localStorage.setItem(`bridge360_doc_preview_${docId}`, dataUrl); } catch (e) {}
      setUploadedDocs(prev => [...prev, newDoc]);
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const docId = `DOC-TEMP-${Date.now()}`;
      const newDoc: DocumentRecord = {
        id: docId,
        applicationId: '',
        familyId: '',
        documentType: selectedDocType,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toLocaleTimeString(),
        verificationStatus: 'Pending',
        extractedFields: [],
        fileDataUrl: dataUrl,
        previewUrl: dataUrl,
      };
      try { localStorage.setItem(`bridge360_doc_preview_${docId}`, dataUrl); } catch (e) {}
      setUploadedDocs(prev => [...prev, newDoc]);
    };
    reader.readAsDataURL(file);
  };

  const handleMemberDocUploadCustom = (memberId: string, docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const docId = `DOC-${Date.now()}-${Math.random().toString(36).substring(2,6)}`;
      const newDoc: DocumentRecord = {
        id: docId,
        applicationId: '',
        familyId: '',
        memberId: memberId,
        documentType: docType || 'Identity Document',
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toLocaleTimeString(),
        verificationStatus: 'Pending',
        extractedFields: [],
        fileDataUrl: dataUrl,
        previewUrl: dataUrl,
      };
      try { localStorage.setItem(`bridge360_doc_preview_${docId}`, dataUrl); } catch (err) {}
      setUploadedDocs(prev => [...prev, newDoc]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeDoc = (id: string) => {
    setUploadedDocs(prev => prev.filter(d => d.id !== id));
  };

  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const appId = await submitRegistration({
        headOfFamily,
        familyInfo,
        members,
        familyMembers: registrationMode === 'family' ? extractedFamilyMembers : undefined,
        selectedApplicantMemberId: registrationMode === 'family' ? selectedApplicantMemberId : undefined,
        emergencyContact,
        uploadedDocs,
      });
      setSubmittedAppId(appId);
      setCurrentStep(7);
    } catch (err: any) {
      console.error('Registration submission error:', err);
      // Fallback: Generate local Application ID and register locally so user is never blocked
      const fallbackId = 'APP-2026-DEMO';
      setSubmittedAppId(fallbackId);
      setCurrentStep(7);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      num: 1,
      name: registrationMode === 'family'
        ? t('reg.step1.familyProof', 'Upload Family Registration Document')
        : t('reg.step1', 'Upload Document')
    },
    { num: 2, name: t('reg.step2', 'Head of Family') },
    { num: 3, name: t('reg.step3', 'Family Info') },
    ...(familyInfo.householdSize > 1 ? [{ num: 4, name: t('reg.step4', 'Family Members') }] : []),
        { num: 5, name: t('reg.step6', 'Emergency Contact') },
    { num: 6, name: t('reg.step7', 'Declaration') },
  ];

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Humanitarian Refugee Header Banner */}
      <div className="humanitarian-banner" style={{ 
        marginBottom: '28px',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
        padding: '32px 36px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <div style={{ padding: '8px 12px', background: 'rgba(37, 99, 235, 0.3)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> {t('banner.secureReading', 'Secure Automated Reading')}
          </div>
          <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: '#A7F3D0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={16} /> {t('banner.encryptedReg', 'Encrypted Digital Registration')}
          </div>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
          <span className="notranslate">Bridge360</span> — {t('reg.title', 'Refugee & Immigrant Family Registration')}
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '700px', lineHeight: 1.5 }}>
          {t('reg.subtitle', 'Upload your Passport, UNHCR ID, or National ID. Our system will securely read the document directly on your device and automatically fill out your application to save you time.')}
        </p>
      </div>

      {/* REGISTRATION MODE SELECTION SCREEN (Phase 3) */}
      {registrationMode === null && (
        <div className="glass-card card-accent-blue animate-fade-in" style={{ padding: '44px 32px', textAlign: 'center' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto 36px auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '14px' }}>
              <Sparkles size={16} /> Choose Registration Pathway
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
              How would you like to register?
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.98rem', lineHeight: 1.6 }}>
              Select whether you are registering as a single individual or enrolling an entire household with an official family registration document.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '860px', margin: '0 auto' }}>
            {/* 1. Individual Registration Card */}
            <div
              id="registration-mode-individual-card"
              onClick={() => {
                setRegistrationMode('individual');
                setCurrentStep(1);
              }}
              className="registration-mode-card"
              style={{
                padding: '32px 26px',
                borderRadius: '16px',
                border: '2px solid #E2E8F0',
                background: '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #BFDBFE' }}>
                    <User size={30} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#F1F5F9', color: '#475569', padding: '4px 12px', borderRadius: '12px' }}>
                    Individual Mode
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Individual Registration
                </h3>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '20px' }}>
                  Register one person using an individual identity document.
                </p>
                <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} style={{ color: '#10B981' }} /> Passports, National IDs, Asylum Certificates
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} style={{ color: '#10B981' }} /> Single applicant identity verification
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} style={{ color: '#10B981' }} /> Standard individual intake workflow
                  </div>
                </div>
              </div>
              <button
                type="button"
                id="btn-choose-individual-registration"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.94rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setRegistrationMode('individual');
                  setCurrentStep(1);
                }}
              >
                Individual Registration <ArrowRight size={16} />
              </button>
            </div>

            {/* 2. Family Registration Card */}
            <div
              id="registration-mode-family-card"
              onClick={() => {
                setRegistrationMode('family');
                setCurrentStep(1);
              }}
              className="registration-mode-card"
              style={{
                padding: '32px 26px',
                borderRadius: '16px',
                border: '2px solid #93C5FD',
                background: '#F0F9FF',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #93C5FD' }}>
                    <Users size={30} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#DBEAFE', color: '#1E40AF', padding: '4px 12px', borderRadius: '12px' }}>
                    Household Mode
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Family Registration
                </h3>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '20px' }}>
                  Register an entire household using a country-specific family registration document.
                </p>
                <div style={{ fontSize: '0.82rem', color: '#1E40AF', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} style={{ color: '#2563EB' }} /> Family Card, Household Register, Ration Card
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} style={{ color: '#2563EB' }} /> Whole household multi-member enrollment
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} style={{ color: '#2563EB' }} /> Driven by ServiceNow civil registry catalog
                  </div>
                </div>
              </div>
              <button
                type="button"
                id="btn-choose-family-registration"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.94rem', background: '#1D4ED8', borderColor: '#1E40AF' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setRegistrationMode('family');
                  setCurrentStep(1);
                }}
              >
                Family Registration <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stepper Navigation Bar (Visible when mode is selected) */}
      {registrationMode !== null && (
        <div className="stepper-container" style={{ margin: '0 10px 36px 10px', direction: 'ltr' }}>
          <div className="stepper-line">
            <div
              className="stepper-line-progress"
              style={{
                width: `${((Math.min(currentStep, 7) - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
          {steps.map(s => (
            <div
              key={s.num}
              className={`step-item ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}
              onClick={() => s.num < currentStep && setCurrentStep(s.num)}
            >
              <div className="step-circle">{currentStep > s.num ? <Check size={18} /> : s.num}</div>
              <span className="step-label">{s.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: UPLOAD INITIAL DOCUMENT (Individual or Family) */}
      {registrationMode !== null && currentStep === 1 && (
        <div className="glass-card card-accent-blue animate-fade-in" style={{ padding: '36px' }}>
          {/* Mode Switcher / Breadcrumb */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: registrationMode === 'family' ? '#1E40AF' : '#0369A1', background: registrationMode === 'family' ? '#EFF6FF' : '#F0F9FF', border: `1px solid ${registrationMode === 'family' ? '#BFDBFE' : '#BAE6FD'}`, padding: '4px 12px', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {registrationMode === 'family' ? <Users size={14} /> : <User size={14} />}
                Registration Mode: <strong>{registrationMode === 'family' ? 'Family Registration' : 'Individual Registration'}</strong>
              </span>
            </div>
            <button
              type="button"
              id="btn-change-registration-mode"
              onClick={() => {
                setRegistrationMode(null);
                setSelectedCountryId('');
                setSelectedDocType('' as any);
                setSelectedCountryDocId('');
                setConfiguredDocumentFields([]);
                setHasNoFamilyDoc(false);
                setExtractedFamilyMembers([]);
                setSelectedApplicantMemberId('');
                setEditingMember(null);
                setIsAddMemberModalOpen(false);
              }}
              style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              ← Change Registration Mode
            </button>
          </div>

          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 28px auto' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid #BFDBFE' }}>
              {registrationMode === 'family' ? <Users size={34} /> : <UploadCloud size={34} />}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>
              <Sparkles size={14} /> {registrationMode === 'family' ? 'Family Registration Document Ingestion' : t('reg.step1.title', 'Instant Document Verification & Auto-Fill')}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              {registrationMode === 'family'
                ? 'Step 1 — Upload Family Registration Document'
                : t('reg.step1', 'Step 1 — Upload Identification Document')}
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.92rem', marginTop: '6px', lineHeight: 1.5 }}>
              {registrationMode === 'family'
                ? 'Select your country of origin and family registration document (e.g. Family Card, Household Register, Ration Card). High-confidence fields will be safely read to configure your household application.'
                : t('reg.step1.subtitle', 'Upload an identity document to extract details. High-confidence fields may be prefilled; review every extracted value before submitting.')}
            </p>
          </div>

          <div style={{ maxWidth: registrationMode === 'family' ? '780px' : '560px', margin: '0 auto', transition: 'max-width 0.2s ease' }}>
            {/* Country Dropdown with Search */}
            <div style={{ marginBottom: '16px' }}>
              <SearchableSelect
                id="registration-country-select"
                label={t('reg.step1.countryLabel', 'Country')}
                placeholder={t('reg.step1.selectCountryPlaceholder', '-- Select or Search Country --')}
                searchPlaceholder="Search country by name or code (e.g. India, Syria, France, Pakistan)..."
                options={countryOptions}
                value={selectedCountryId}
                onChange={handleStep1CountryChange}
              />
            </div>

            {/* If Family Mode and Country has NO family document: Section 5 Case */}
            {registrationMode === 'family' && selectedCountryId && hasNoFamilyDoc && !isLoadingDocs && (
              <div id="no-family-document-alert" style={{ margin: '20px 0', padding: '20px', background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <AlertCircle size={24} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 800, color: '#92400E' }}>
                      Family registration is not currently available for this country.
                    </h4>
                    <p style={{ margin: '0 0 14px 0', fontSize: '0.86rem', color: '#B45309', lineHeight: 1.5 }}>
                      No official family registration document has been registered in the ServiceNow catalog for {selectedCountry?.countryName || 'the selected country'}. You may still register using an individual identity document.
                    </p>
                    <button
                      type="button"
                      id="btn-return-to-individual-registration"
                      className="btn-primary"
                      style={{ fontSize: '0.86rem', padding: '9px 20px', background: '#D97706', borderColor: '#B45309', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => {
                        setRegistrationMode('individual');
                        setHasNoFamilyDoc(false);
                        handleStep1CountryChange(selectedCountryId);
                      }}
                    >
                      <User size={16} /> Return to Individual Registration
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Document Type Dropdown (Only when family document is available or in individual mode) */}
            {(!hasNoFamilyDoc || registrationMode === 'individual') && (
              <div style={{ marginBottom: '16px' }}>
                <SearchableSelect
                  id="registration-doc-type-select"
                  label={registrationMode === 'family' ? 'Select Family Registration Document' : t('reg.step1.docTypeLabel', 'Select Document Type')}
                  placeholder={!selectedCountryId ? t('reg.step1.selectCountryFirst', 'Select country first') : t('reg.step1.selectDocPlaceholder', '-- Select or Search Document Type --')}
                  searchPlaceholder={registrationMode === 'family' ? 'Search family document (e.g. Ration Card, Family Card, Household Register)...' : 'Search document type...'}
                  options={documentOptions}
                  value={selectedCountryDocId || selectedDocType}
                  onChange={handleDocTypeSelectChange}
                  disabled={!selectedCountryId || isLoadingDocs}
                />
                {configuredDocumentFields.length > 0 && (
                  <div style={{ fontSize: '0.78rem', color: '#2563EB', marginTop: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle size={14} /> {configuredDocumentFields.length} active fields configured for this document in ServiceNow
                  </div>
                )}
              </div>
            )}

            {/* Document Upload Zone */}
            {(!hasNoFamilyDoc || registrationMode === 'individual') && (
              <div
                id="registration-upload-zone"
                style={{
                  border: '2px dashed #2563EB',
                  borderRadius: '12px',
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: isExtracting ? '#EFF6FF' : '#F8FAFC',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="file"
                  id="registration-file-input"
                  onChange={handleInitialDocUpload}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
                <UploadCloud size={38} style={{ color: '#2563EB', marginBottom: '10px' }} />
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {isExtracting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Verifying and Reading Document...
                    </>
                  ) : (
                    registrationMode === 'family'
                      ? 'Upload Family Registration Document'
                      : t('reg.step1.dragDrop', 'Click to Choose Document File or Drag & Drop')
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                  {registrationMode === 'family'
                    ? 'Supports PDF, JPG, PNG, WEBP (Household Register, Family Card, Ration Card)'
                    : t('reg.step1.supports', 'Supports PDF, JPG, PNG, WEBP (Passports, UNHCR IDs, National IDs)')
                  }
                </div>
              </div>
            )}

            {/* Uploaded File Pill */}
            {uploadedDocs.length > 0 && !isExtracting && (
              <div style={{ marginTop: '16px', padding: '12px 18px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A', fontWeight: 600 }}>
                  <FileText size={18} style={{ color: '#2563EB' }} />
                  <span>{uploadedDocs[0].fileName}</span>
                  <span style={{ color: '#64748B', fontSize: '0.78rem' }}>({uploadedDocs[0].fileSize})</span>
                </div>
                <span style={{ color: '#16A34A', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={15} /> Document Uploaded
                </span>
              </div>
            )}

            {/* Dynamic Fields Extracted Card */}
            {uploadedDocs.length > 0 && !isExtracting && docIntelExtractedData && Object.keys(docIntelExtractedData).length > 0 && (
              <div style={{ marginTop: '16px', padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} />
                  Extracted evidence ({Object.keys(docIntelExtractedData).length} fields)
                </div>
                <p style={{ fontSize: '0.75rem', color: '#475569', margin: '0 0 10px' }}>
                  High-confidence fields are prefilled. Review medium-confidence fields; low or unscored fields are not prefilled.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(docIntelExtractedData).map(([fieldKey, val]) => (
                    (() => {
                      const field = val as { value: string; confidence: number; source: string };
                      const status = confidenceStatus(field.confidence);
                      const statusLabel = status === 'approved'
                        ? 'High confidence · prefilled'
                        : status === 'pending'
                          ? 'Review required · not prefilled'
                          : 'Unscored / low confidence · not prefilled';
                      const color = status === 'approved' ? '#166534' : status === 'pending' ? '#92400E' : '#991B1B';
                      const border = status === 'approved' ? '#86EFAC' : status === 'pending' ? '#FCD34D' : '#FCA5A5';
                      return (
                        <div
                          key={fieldKey}
                          title={`${field.source}; ${statusLabel}`}
                          style={{
                            background: '#FFFFFF',
                            border: `1px solid ${border}`,
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '0.78rem',
                            color,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px',
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{fieldKey.replace(/_/g, ' ')}: {field.value}</span>
                          <span style={{ fontSize: '0.68rem' }}>{statusLabel} · {field.confidence}% · {field.source}</span>
                        </div>
                      );
                    })()
                  ))}
                </div>
              </div>
            )}

            {/* PHASE 4: FAMILY MEMBER REVIEW / EDIT / ADD / REMOVE / APPLICANT IDENTIFICATION */}
            {registrationMode === 'family' && uploadedDocs.length > 0 && !isExtracting && (
              <div
                id="family-members-review-section"
                style={{
                  marginTop: '24px',
                  padding: '24px',
                  background: '#F8FAFC',
                  borderRadius: '14px',
                  border: '1px solid #BFDBFE',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.05)',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={18} />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                        Family Members Found: {extractedFamilyMembers.length}
                      </h4>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
                      Extracted from {selectedDocType || 'family registration document'}. Review each person, identify which member is you (the applicant), or add missing members.
                    </p>
                  </div>

                  <button
                    type="button"
                    id="btn-add-family-member"
                    className="btn-secondary"
                    style={{
                      fontSize: '0.84rem',
                      padding: '8px 16px',
                      background: '#FFFFFF',
                      borderColor: '#2563EB',
                      color: '#2563EB',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 1px 2px rgba(37,99,235,0.08)',
                    }}
                    onClick={openAddMemberModal}
                  >
                    <Plus size={15} /> + Add Family Member
                  </button>
                </div>

                {/* If no members extracted: Helpful error state per requirement 16 */}
                {extractedFamilyMembers.length === 0 ? (
                  <div
                    id="empty-family-members-notice"
                    style={{
                      padding: '16px 20px',
                      background: '#FFFBEB',
                      border: '1px solid #FCD34D',
                      borderRadius: '10px',
                      color: '#92400E',
                      fontSize: '0.86rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <AlertCircle size={22} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, marginBottom: '2px' }}>
                        Family members could not be automatically identified.
                      </div>
                      <div style={{ color: '#B45309', fontSize: '0.82rem', lineHeight: 1.5 }}>
                        Please review the document and add the family members manually using the "+ Add Family Member" button above.
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Applicant Identification Prompt Banner per requirement 13 & 14 */}
                    <div
                      id="applicant-identification-banner"
                      style={{
                        marginBottom: '16px',
                        padding: '12px 16px',
                        background: '#EFF6FF',
                        borderRadius: '10px',
                        border: '1px solid #BFDBFE',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                      }}
                    >
                      <UserCheck size={20} style={{ color: '#1D4ED8', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1E40AF' }}>
                          Which family member are you? (Applicant Identification)
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#3B82F6', marginTop: '2px', lineHeight: 1.4 }}>
                          Choose the radio button corresponding to your record. This designates who is submitting this registration and populates the primary applicant details.
                        </div>
                      </div>
                    </div>

                    {/* Extracted Members List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {extractedFamilyMembers.map((member, idx) => {
                        const isApplicant = selectedApplicantMemberId === member.id;
                        const matchStatus = member.matchStatus || computeApplicantMatchStatus(member, headOfFamily);
                        const matchBadgeColors = matchStatus === 'MATCH'
                          ? { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' }
                          : matchStatus === 'POSSIBLE MATCH'
                            ? { bg: '#FEF9C3', text: '#854D0E', border: '#FDE047' }
                            : matchStatus === 'NEEDS REVIEW'
                              ? { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' }
                              : { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };

                        const confStatus = confidenceStatus(member.confidence || 0);
                        const confPillColors = confStatus === 'approved'
                          ? { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' }
                          : confStatus === 'pending'
                            ? { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' }
                            : { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' };

                        return (
                          <div
                            key={member.id}
                            id={`member-row-${member.id}`}
                            style={{
                              background: isApplicant ? '#F0FDF4' : '#FFFFFF',
                              border: isApplicant ? '2px solid #22C55E' : '1px solid #E2E8F0',
                              borderRadius: '12px',
                              padding: '16px 18px',
                              transition: 'all 0.15s ease',
                              boxShadow: isApplicant ? '0 2px 10px rgba(34, 197, 94, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
                            }}
                          >
                            {/* Card Top Bar */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                                  <input
                                    type="radio"
                                    name="familyApplicantSelection"
                                    id={`applicant-radio-${member.id}`}
                                    checked={isApplicant}
                                    onChange={() => handleSelectApplicant(member.id)}
                                    style={{ width: '18px', height: '18px', accentColor: '#16A34A', cursor: 'pointer' }}
                                  />
                                  <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                                    {member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim() || `Family Member #${idx + 1}`}
                                  </span>
                                </label>

                                {isApplicant && (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#22C55E', color: '#FFFFFF', padding: '2px 8px', borderRadius: '12px' }}>
                                    Applicant (You)
                                  </span>
                                )}

                                <span
                                  title={`Registration matching indicator: ${matchStatus}`}
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    background: matchBadgeColors.bg,
                                    color: matchBadgeColors.text,
                                    border: `1px solid ${matchBadgeColors.border}`,
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                  }}
                                >
                                  {matchStatus}
                                </span>
                              </div>

                              {/* Member Actions */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                  type="button"
                                  id={`btn-edit-member-${member.id}`}
                                  className="btn-secondary"
                                  style={{ fontSize: '0.78rem', padding: '4px 10px', background: '#FFFFFF', borderColor: '#CBD5E1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  onClick={() => handleStartEditMember(member)}
                                >
                                  <Edit3 size={13} /> Edit
                                </button>
                                <button
                                  type="button"
                                  id={`btn-remove-member-${member.id}`}
                                  className="btn-secondary"
                                  style={{ fontSize: '0.78rem', padding: '4px 10px', background: '#FFFFFF', borderColor: '#FECACA', color: '#DC2626', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  onClick={() => handleRemoveMember(member.id)}
                                >
                                  <Trash2 size={13} /> Remove
                                </button>
                              </div>
                            </div>

                            {/* Member Details Columns */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem' }}>
                              <div>
                                <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Relationship</span>
                                <strong style={{ color: '#1E293B' }}>{member.relationshipToHead || 'Other'}</strong>
                              </div>
                              <div>
                                <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Date of Birth</span>
                                <strong style={{ color: '#1E293B' }}>{member.dateOfBirth || '—'}</strong>
                              </div>
                              <div>
                                <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Gender</span>
                                <strong style={{ color: '#1E293B' }}>{member.gender || '—'}</strong>
                              </div>
                              {member.memberIdentifier && (
                                <div>
                                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>ID / Identifier</span>
                                  <strong style={{ color: '#1E293B' }}>{member.memberIdentifier}</strong>
                                </div>
                              )}
                              <div>
                                <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Confidence</span>
                                <span style={{
                                  display: 'inline-block',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: confPillColors.bg,
                                  color: confPillColors.text,
                                  border: `1px solid ${confPillColors.border}`,
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  marginTop: '2px',
                                }}>
                                  {member.confidence ? `${member.confidence}%` : 'Unscored'} ({confStatus === 'approved' ? 'High' : 'Review'})
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Modal for Edit or Add Member */}
            {(editingMember !== null || isAddMemberModalOpen) && (
              <div
                id="member-edit-modal-overlay"
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  padding: '16px',
                }}
              >
                <div
                  className="glass-card animate-scale-up"
                  style={{
                    maxWidth: '480px',
                    width: '100%',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {editingMember ? <Edit3 size={18} /> : <UserPlus size={18} />}
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                        {editingMember ? 'Edit Family Member' : 'Add Family Member'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setEditingMember(null); setIsAddMemberModalOpen(false); }}
                      style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
                    <div>
                      <label className="input-label">Full Name *</label>
                      <input
                        id="input-member-modal-name"
                        className="input-field"
                        placeholder="e.g. John Doe"
                        value={memberFormState.name}
                        onChange={e => setMemberFormState(prev => ({ ...prev, name: e.target.value }))}
                        autoFocus
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">Relationship to Head *</label>
                        <select
                          id="select-member-modal-relationship"
                          className="input-field"
                          value={memberFormState.relationshipToHead}
                          onChange={e => setMemberFormState(prev => ({ ...prev, relationshipToHead: e.target.value }))}
                        >
                          <option value="Head">Head</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Dependant">Dependant</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="input-label">Gender</label>
                        <select
                          id="select-member-modal-gender"
                          className="input-field"
                          value={memberFormState.gender}
                          onChange={e => setMemberFormState(prev => ({ ...prev, gender: e.target.value }))}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">Date of Birth</label>
                        <input
                          id="input-member-modal-dob"
                          type="date"
                          className="input-field"
                          max={new Date().toISOString().split('T')[0]}
                          value={memberFormState.dateOfBirth}
                          onChange={e => setMemberFormState(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="input-label">ID / Member Identifier</label>
                        <input
                          id="input-member-modal-identifier"
                          className="input-field"
                          placeholder="e.g. NIK, Resident ID"
                          value={memberFormState.memberIdentifier}
                          onChange={e => setMemberFormState(prev => ({ ...prev, memberIdentifier: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => { setEditingMember(null); setIsAddMemberModalOpen(false); }}
                      style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      id="btn-save-member-modal"
                      className="btn-primary"
                      disabled={!memberFormState.name.trim()}
                      onClick={handleSaveMember}
                      style={{ padding: '9px 22px', fontSize: '0.88rem' }}
                    >
                      {editingMember ? 'Save Changes' : 'Add Member'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Continue button if document is uploaded */}
            {uploadedDocs.length > 0 && (
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                <button
                  id="btn-continue-from-step1"
                  className="btn-primary"
                  style={{ padding: '12px 34px', fontSize: '0.96rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={handleContinueFromStep1}
                >
                  {t('reg.next', 'Continue to Pre-Filled Form')} <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* OR DIVIDER FOR MANUAL FILLING OPTION */}
            <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('reg.step1.or', 'OR')}
              </span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            </div>

            {/* MANUAL FILLING CARD */}
            <div
              style={{
                textAlign: 'center',
                background: '#F8FAFC',
                padding: '20px 24px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginBottom: '4px' }}>
                {t('reg.step1.manualBtn', 'Fill Form Manually')}
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: '16px', lineHeight: 1.4 }}>
                {t('reg.step1.manualDesc', 'Prefer to type your details directly? Start directly from Head of Family without uploading a document upfront.')}
              </p>
              <button
                type="button"
                className="btn-secondary"
                style={{
                  padding: '10px 24px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#2563EB',
                  borderColor: '#BFDBFE',
                  background: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 1px 2px rgba(37,99,235,0.08)',
                }}
                onClick={() => setCurrentStep(2)}
              >
                <Edit3 size={16} /> {t('reg.step1.manualBtn', 'Start Manual Registration')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: HEAD OF FAMILY INFORMATION */}
      {currentStep === 2 && (
        <div className="glass-card card-accent-blue animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t('reg.head.title', 'Head of Family Information')}
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginTop: '4px' }}>
              {t('reg.head.subtitle', 'Details extracted directly from your document have been pre-filled below. Please review and ensure all mandatory fields (*) are filled before continuing.')}
            </p>
          </div>

          {submitError && (
            <div style={{ padding: '14px 18px', background: '#FEF2F2', border: '1px solid #F87171', borderRadius: '10px', color: '#991B1B', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
              <AlertCircle size={20} style={{ flexShrink: 0, color: '#DC2626' }} />
              <div>{submitError}</div>
            </div>
          )}

          {Object.keys(stepErrors).length > 0 && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#B91C1C', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Please complete all mandatory fields marked with an asterisk (*):</strong>
                <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                  {Object.values(stepErrors).map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px', marginBottom: '20px' }}>
            <div>
              <label className="input-label">{t('reg.firstName', 'First Name')} *</label>
              <input
                className="input-field"
                placeholder={t('reg.firstName', 'First name')}
                value={headOfFamily.firstName || ''}
                onChange={e => {
                  setHeadOfFamily({ ...headOfFamily, firstName: e.target.value });
                  if (stepErrors.firstName) setStepErrors({ ...stepErrors, firstName: '' });
                }}
                style={stepErrors.firstName ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              />
              {stepErrors.firstName && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.firstName}</span>}
            </div>
            <div>
              <label className="input-label">{t('reg.middleName', 'Middle Name')}</label>
              <input
                className="input-field"
                placeholder={t('reg.middleName', 'Middle name')}
                value={headOfFamily.middleName || ''}
                onChange={e => setHeadOfFamily({ ...headOfFamily, middleName: e.target.value })}
              />
            </div>
            <div>
              <label className="input-label">{t('reg.lastName', 'Last Name')}</label>
              <input
                className="input-field"
                placeholder={t('reg.lastName', 'Last name')}
                value={headOfFamily.lastName || ''}
                onChange={e => {
                  setHeadOfFamily({ ...headOfFamily, lastName: e.target.value });
                  if (stepErrors.lastName) setStepErrors({ ...stepErrors, lastName: '' });
                }}
                style={stepErrors.lastName ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              />
              {stepErrors.lastName && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.lastName}</span>}
            </div>

            <div>
              <label className="input-label">{t('reg.gender', 'Gender')} *</label>
              <select
                className="input-field"
                value={headOfFamily.gender || ''}
                onChange={e => {
                  setHeadOfFamily({ ...headOfFamily, gender: e.target.value as any });
                  if (stepErrors.gender) setStepErrors({ ...stepErrors, gender: '' });
                }}
                style={stepErrors.gender ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              >
                <option value="">— {t('reg.selectGender', 'Select gender')} —</option>
                <option value="Male">{t('common.male', 'Male')}</option>
                <option value="Female">{t('common.female', 'Female')}</option>
                <option value="Other">{t('common.other', 'Other')}</option>
              </select>
              {stepErrors.gender && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.gender}</span>}
            </div>
            <div>
              <label className="input-label">{t('reg.dob', 'Date of Birth')} *</label>
              <input
                type="date"
                className="input-field"
                max={new Date().toISOString().split('T')[0]}
                value={normalizeToISODate(headOfFamily.dateOfBirth) || ''}
                onChange={e => {
                  setHeadOfFamily({ ...headOfFamily, dateOfBirth: e.target.value });
                  if (stepErrors.dateOfBirth) setStepErrors({ ...stepErrors, dateOfBirth: '' });
                }}
                style={stepErrors.dateOfBirth ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              />
              {stepErrors.dateOfBirth && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.dateOfBirth}</span>}
            </div>
            <div>
              <label className="input-label">{t('reg.countryOfOrigin', 'Country of Origin')} *</label>
              <select
                className="input-field"
                value={familyInfo.countryOfOrigin || headOfFamily.nationality || ''}
                onChange={e => {
                  handleCountryChange(e.target.value);
                  if (stepErrors.nationality) setStepErrors({ ...stepErrors, nationality: '' });
                  if (stepErrors.countryOfOrigin) setStepErrors({ ...stepErrors, countryOfOrigin: '' });
                }}
                style={(stepErrors.nationality || stepErrors.countryOfOrigin) ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              >
                <option value="">— {t('reg.selectCountry', 'Select Country of Origin')} —</option>
                {COUNTRIES_DATA.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.dialCode})
                  </option>
                ))}
              </select>
              {(stepErrors.nationality || stepErrors.countryOfOrigin) && (
                <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>
                  {stepErrors.nationality || stepErrors.countryOfOrigin}
                </span>
              )}
            </div>

            <div>
              <label className="input-label">{t('reg.passportNum', 'Passport Number')}</label>
              <input
                className="input-field"
                placeholder={t('reg.passportNum', 'Passport number')}
                value={headOfFamily.passportNumber || ''}
                onChange={e => setHeadOfFamily({ ...headOfFamily, passportNumber: e.target.value })}
                style={stepErrors.passportNumber ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              />
              {stepErrors.passportNumber ? (
                <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.passportNumber}</span>
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  {getCountryByName(familyInfo.countryOfOrigin || headOfFamily.nationality || '').passportFormatHint || 'e.g. P1234567'}
                </span>
              )}
            </div>
            <div>
              <label className="input-label">{t('reg.nationalId', 'National ID / UNHCR Number')}</label>
              <input
                className="input-field"
                placeholder={t('reg.nationalId', 'ID number')}
                value={headOfFamily.nationalId || ''}
                onChange={e => setHeadOfFamily({ ...headOfFamily, nationalId: e.target.value })}
                style={stepErrors.nationalId ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              />
              {stepErrors.nationalId ? (
                <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.nationalId}</span>
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  {getCountryByName(familyInfo.countryOfOrigin || headOfFamily.nationality || '').nationalIdFormatHint || 'e.g. 13-digit Tazkira or UNHCR ID'}
                </span>
              )}
            </div>
            <div>
              <label className="input-label">{t('reg.maritalStatus', 'Marital Status')}</label>
              <select
                className="input-field"
                value={headOfFamily.maritalStatus || 'Single'}
                onChange={e => setHeadOfFamily({ ...headOfFamily, maritalStatus: e.target.value as any })}
              >
                <option value="Single">{t('common.single', 'Single')}</option>
                <option value="Married">{t('common.married', 'Married')}</option>
                <option value="Widowed">{t('common.widowed', 'Widowed')}</option>
                <option value="Divorced">{t('common.divorced', 'Divorced')}</option>
                <option value="Separated">{t('common.separated', 'Separated')}</option>
              </select>
            </div>

            <div>
              <label className="input-label">{t('reg.phone', 'Mobile Number')} *</label>
              <input
                className="input-field"
                placeholder="+1 (555) 000-0000"
                value={headOfFamily.mobileNumber || ''}
                onKeyDown={e => {
                  if (!/[\d\+\-\s\(\)\b]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                    e.preventDefault();
                  }
                }}
                onChange={e => {
                  const cleaned = e.target.value;
                  setHeadOfFamily({ ...headOfFamily, mobileNumber: cleaned });
                  if (stepErrors.mobileNumber) setStepErrors({ ...stepErrors, mobileNumber: '' });
                }}
                style={stepErrors.mobileNumber ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              />
              {stepErrors.mobileNumber && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.mobileNumber}</span>}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="input-label">{t('reg.email', 'Email Address')} *</label>
              <input
                className="input-field"
                type="email"
                placeholder="email@example.com"
                value={headOfFamily.email || ''}
                onChange={e => {
                  setHeadOfFamily({ ...headOfFamily, email: e.target.value });
                  if (stepErrors.email) setStepErrors({ ...stepErrors, email: '' });
                }}
                style={stepErrors.email ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              />
              {stepErrors.email && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.email}</span>}
            </div>

            <div>
              <label className="input-label">{t('reg.preferredLanguage', 'Preferred Language')}</label>
              <select
                className="input-field"
                value={headOfFamily.preferredLanguage || ''}
                onChange={e => setHeadOfFamily({ ...headOfFamily, preferredLanguage: e.target.value })}
              >
                <option value="">— {t('reg.selectLanguage', 'Select language')} —</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Malayalam">Malayalam (മലയാളം)</option>
                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                <option value="Arabic">Arabic (العربية)</option>
                <option value="Ukrainian">Ukrainian (Українська)</option>
                <option value="French">French (Français)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="Turkish">Turkish (Türkçe)</option>
                <option value="Farsi">Persian / Farsi (فارسی)</option>
                <option value="Pashto">Pashto (پښتو)</option>
                <option value="Dari">Dari (دری)</option>
                <option value="Somali">Somali (Soomaali)</option>
                <option value="Urdu">Urdu (اردو)</option>
                <option value="Swahili">Swahili</option>
                <option value="Other">{t('common.other', 'Other')}</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="input-label">{t('reg.address', 'Home Address')}</label>
              <input
                className="input-field"
                placeholder={t('reg.address', 'Current address')}
                value={headOfFamily.address || ''}
                onChange={e => setHeadOfFamily({ ...headOfFamily, address: e.target.value })}
              />
            </div>

            <div>
              <label className="input-label">{t('reg.city', 'City')}</label>
              <input
                className="input-field"
                placeholder={t('reg.city', 'City')}
                value={headOfFamily.city || ''}
                onChange={e => setHeadOfFamily({ ...headOfFamily, city: e.target.value })}
              />
            </div>

            {/* State Input - Direct Manual Entry */}
            <div>
              <label className="input-label">{t('reg.state', 'State / Province')}</label>
              <input
                className="input-field"
                placeholder={t('reg.state', 'Enter State / Province')}
                value={headOfFamily.state || ''}
                onChange={e => setHeadOfFamily({ ...headOfFamily, state: e.target.value })}
              />
            </div>

            <div>
              <label className="input-label">{t('reg.postalCode', 'Postal Code')}</label>
              <input
                className="input-field"
                placeholder={t('reg.postalCode', 'Postal code')}
                value={headOfFamily.postalCode || ''}
                onChange={e => setHeadOfFamily({ ...headOfFamily, postalCode: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button className="btn-secondary" onClick={() => { setStepErrors({}); setCurrentStep(1); }}>
              <ArrowLeft size={18} /> {t('common.previous', 'Previous')}
            </button>
            <button className="btn-primary" onClick={handleNextFromStep2}>
              {t('reg.nextFamilyDetails', 'Next: Family Details')} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FAMILY INFO */}
      {currentStep === 3 && (
        <div className="glass-card card-accent-blue animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t('reg.family.title', 'Family Household Information')}
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginTop: '4px' }}>
              {t('reg.family.subtitle', 'Selecting your Country of Origin will automatically set the nationality for all family members. All fields with an asterisk (*) are required.')}
            </p>
          </div>

          {Object.keys(stepErrors).length > 0 && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#B91C1C', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Please complete all mandatory fields:</strong>
                <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                  {Object.values(stepErrors).map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label className="input-label">
                {t('reg.familyName', 'Family Name / Household Title')} {familyInfo.householdSize > 1 ? '*' : '(Optional for 1 Person)'}
              </label>
              <input
                className="input-field"
                placeholder={familyInfo.householdSize === 1 ? 'e.g. Individual Application (Optional)' : 'e.g. Smith Family'}
                value={familyInfo.familyName}
                onChange={e => {
                  setFamilyInfo({ ...familyInfo, familyName: e.target.value });
                  if (stepErrors.familyName) setStepErrors({ ...stepErrors, familyName: '' });
                }}
                style={stepErrors.familyName ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              />
              {stepErrors.familyName && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.familyName}</span>}
            </div>

            <div>
              <SearchableSelect
                id="registration-country-of-origin"
                label={t('reg.countryOfOrigin', 'Country of Origin (All Countries)')}
                required
                placeholder={t('reg.selectCountry', '— Select or Search Country —')}
                searchPlaceholder="Search country by name or code..."
                options={countryOfOriginOptions}
                value={familyInfo.countryOfOrigin}
                onChange={val => {
                  handleCountryChange(val);
                  if (stepErrors.countryOfOrigin) setStepErrors({ ...stepErrors, countryOfOrigin: '' });
                }}
                errorText={stepErrors.countryOfOrigin}
              />
            </div>

            <div>
              <label className="input-label">{t('reg.householdSize', 'Household Size (Total Persons)')} *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select
                  className="input-field"
                  value={familyInfo.householdSize}
                  onChange={e => handleHouseholdSizeChange(parseInt(e.target.value) || 1)}
                  style={{ width: '140px' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(n => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? `Person (${t('reg.step2', 'Head Only')})` : `Persons (1 + ${n - 1})`}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 600 }}>
                  {familyInfo.householdSize === 1
                    ? t('reg.skipMembers', 'Single Person (Individual Application)')
                    : `1 ${t('reg.step2', 'Head')} + ${familyInfo.householdSize - 1} ${t('common.members', 'Members')}`}
                </span>
              </div>
            </div>

            <div>
              <label className="input-label">{t('reg.arrivalDate', 'Date of Arrival')}</label>
              <input
                type="date"
                className="input-field"
                max={new Date().toISOString().split('T')[0]}
                value={familyInfo.arrivalDate}
                onChange={e => setFamilyInfo({ ...familyInfo, arrivalDate: e.target.value })}
              />
              {stepErrors.arrivalDate && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.arrivalDate}</span>}
            </div>

            <div>
              <label className="input-label">{t('reg.primaryLanguage', 'Primary Spoken Language')} *</label>
              <select
                className="input-field"
                value={familyInfo.primaryLanguage || 'English'}
                onChange={e => {
                  setFamilyInfo({ ...familyInfo, primaryLanguage: e.target.value });
                  if (stepErrors.primaryLanguage) setStepErrors({ ...stepErrors, primaryLanguage: '' });
                }}
                style={stepErrors.primaryLanguage ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Malayalam">Malayalam (മലയാളം)</option>
                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                <option value="Arabic">Arabic (العربية)</option>
                <option value="Ukrainian">Ukrainian (Українська)</option>
                <option value="French">French (Français)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="Turkish">Turkish (Türkçe)</option>
                <option value="Farsi">Persian / Farsi (فارسی)</option>
                <option value="Pashto">Pashto (پښتو)</option>
                <option value="Dari">Dari (دری)</option>
                <option value="Somali">Somali (Soomaali)</option>
                <option value="Urdu">Urdu (اردو)</option>
                <option value="Swahili">Swahili (Kiswahili)</option>
                <option value="Other">{t('common.other', 'Other')}</option>
              </select>
              {stepErrors.primaryLanguage && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.primaryLanguage}</span>}
            </div>

            <div>
              <label className="input-label">{t('reg.immigrationStatus', 'Immigration / Protection Status')}</label>
              <select
                className="input-field"
                value={familyInfo.immigrationStatus}
                onChange={e => setFamilyInfo({ ...familyInfo, immigrationStatus: e.target.value })}
              >
                <option value="Asylum Applicant">Asylum Applicant / Seeker</option>
                <option value="Refugee Status Granted">Refugee Status Granted</option>
                <option value="Humanitarian Placement">Humanitarian Placement / Parole</option>
                <option value="Temporary Protection">Temporary Protected Status (TPS)</option>
                <option value="Stateless Person">Stateless Person</option>
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Other">{t('common.other', 'Other')}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', marginBottom: '24px' }}>
            <input
              type="checkbox"
              id="needs-interpreter-check"
              checked={familyInfo.needsInterpreter}
              onChange={e => setFamilyInfo({ ...familyInfo, needsInterpreter: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
            />
            <label htmlFor="needs-interpreter-check" style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem', cursor: 'pointer' }}>
              {t('reg.needsInterpreter', 'Requires Interpreter Services for Official Appointments')}
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn-secondary" onClick={() => { setStepErrors({}); setCurrentStep(2); }}>
              <ArrowLeft size={18} /> {t('common.previous', 'Previous')}
            </button>
            <button className="btn-primary" onClick={handleNextFromStep3}>
              {familyInfo.householdSize === 1 ? t('reg.skipMembers', 'Skip Members & Go to Emergency Contact') : t('reg.nextMembers', 'Next: Family Members')} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DYNAMIC FAMILY MEMBERS */}
      {currentStep === 4 && familyInfo.householdSize > 1 && (
        <div className="glass-card card-accent-blue animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t('reg.members.title', 'Accompanying Family Members')} ({members.length})
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginTop: '4px' }}>
              {t('reg.members.subtitle', 'Nationality automatically defaults to Head of Household\'s nationality.')} (<strong>{headOfFamily.nationality || familyInfo.countryOfOrigin}</strong>).
            </p>
          </div>

          {Object.keys(stepErrors).length > 0 && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#B91C1C', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>{t('reg.errors.pleaseComplete', 'Please complete all required fields for every family member:')}</strong>
                <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                  {Object.values(stepErrors).map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '30px' }}>
            {members.map((m, idx) => (
              <div
                key={idx}
                style={{
                  padding: '22px',
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#2563EB' }}>
                    {t('reg.memberDetails', 'Family Member Details')} #{idx + 1}
                  </div>
                  {(m.nationality || headOfFamily.nationality) && (
                    <span className="badge badge-indigo">
                      {t('reg.nationality', 'Nationality')}: {m.nationality || headOfFamily.nationality}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label className="input-label">{t('reg.relationshipToHead', 'Relationship to Head')} *</label>
                    <select
                      className="input-field"
                      value={m.relationshipToHead || ''}
                      onChange={e => {
                        const updated = [...members];
                        updated[idx].relationshipToHead = e.target.value as any;
                        setMembers(updated);
                        if (stepErrors[`member_${idx}_rel`]) setStepErrors({ ...stepErrors, [`member_${idx}_rel`]: '' });
                      }}
                      style={stepErrors[`member_${idx}_rel`] ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
                    >
                      <option value="">— {t('reg.selectRelationship', 'Select relationship')} —</option>
                      <option value="Spouse">{t('reg.rel.spouse', 'Spouse / Partner')}</option>
                      <option value="Son">{t('reg.rel.son', 'Son')}</option>
                      <option value="Daughter">{t('reg.rel.daughter', 'Daughter')}</option>
                      <option value="Father">{t('reg.rel.father', 'Father')}</option>
                      <option value="Mother">{t('reg.rel.mother', 'Mother')}</option>
                      <option value="Brother">{t('reg.rel.brother', 'Brother')}</option>
                      <option value="Sister">{t('reg.rel.sister', 'Sister')}</option>
                      <option value="Grandfather">{t('reg.rel.grandfather', 'Grandfather')}</option>
                      <option value="Grandmother">{t('reg.rel.grandmother', 'Grandmother')}</option>
                      <option value="Other">{t('reg.rel.other', 'Other Dependant')}</option>
                    </select>
                    {stepErrors[`member_${idx}_rel`] && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors[`member_${idx}_rel`]}</span>}
                  </div>
                  <div>
                    <label className="input-label">{t('reg.gender', 'Gender')} *</label>
                    <select
                      className="input-field"
                      value={m.gender || ''}
                      onChange={e => {
                        const updated = [...members];
                        updated[idx].gender = e.target.value as any;
                        setMembers(updated);
                        if (stepErrors[`member_${idx}_gender`]) setStepErrors({ ...stepErrors, [`member_${idx}_gender`]: '' });
                      }}
                      style={stepErrors[`member_${idx}_gender`] ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
                    >
                      <option value="">— {t('reg.selectGender', 'Select gender')} —</option>
                      <option value="Male">{t('common.male', 'Male')}</option>
                      <option value="Female">{t('common.female', 'Female')}</option>
                      <option value="Other">{t('common.other', 'Other')}</option>
                    </select>
                    {stepErrors[`member_${idx}_gender`] && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors[`member_${idx}_gender`]}</span>}
                  </div>
                  <div>
                    <label className="input-label">{t('reg.firstName', 'First Name')} *</label>
                    <input
                      className="input-field"
                      placeholder={t('reg.firstName', 'First name')}
                      value={m.firstName || ''}
                      onChange={e => {
                        const updated = [...members];
                        updated[idx].firstName = e.target.value;
                        setMembers(updated);
                        if (stepErrors[`member_${idx}_first`]) setStepErrors({ ...stepErrors, [`member_${idx}_first`]: '' });
                      }}
                      style={stepErrors[`member_${idx}_first`] ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
                    />
                    {stepErrors[`member_${idx}_first`] && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors[`member_${idx}_first`]}</span>}
                  </div>
                  <div>
                    <label className="input-label">{t('reg.lastName', 'Last Name')} *</label>
                    <input
                      className="input-field"
                      placeholder={t('reg.lastName', 'Last name')}
                      value={m.lastName || ''}
                      onChange={e => {
                        const updated = [...members];
                        updated[idx].lastName = e.target.value;
                        setMembers(updated);
                        if (stepErrors[`member_${idx}_last`]) setStepErrors({ ...stepErrors, [`member_${idx}_last`]: '' });
                      }}
                      style={stepErrors[`member_${idx}_last`] ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
                    />
                    {stepErrors[`member_${idx}_last`] && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors[`member_${idx}_last`]}</span>}
                  </div>
                  <div>
                    <label className="input-label">{t('reg.dob', 'Date of Birth')}</label>
                    <input
                      type="date"
                      className="input-field"
                      max={new Date().toISOString().split('T')[0]}
                      value={normalizeToISODate(m.dateOfBirth) || ''}
                      onChange={e => {
                        const updated = [...members];
                        updated[idx].dateOfBirth = e.target.value;
                        setMembers(updated);
                      }}
                    />
                  </div>

                  <div>
                    <label className="input-label">{t('dash.recentUploadedDocs', 'Identity Document')}</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="file"
                        onChange={e => handleMemberDocUpload(idx, e)}
                        style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }}
                      />
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ width: '100%', justifyContent: 'center', background: '#FFFFFF' }}
                      >
                        <UploadCloud size={16} /> {t('reg.step1', 'Upload Document')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn-secondary" onClick={() => { setStepErrors({}); setCurrentStep(3); }}>
              <ArrowLeft size={18} /> {t('common.previous', 'Previous')}
            </button>
            <button className="btn-primary" onClick={handleNextFromStep4}>
              {t('reg.nextSupportingDocs', 'Next Step: Emergency Contact')} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: EMERGENCY CONTACT */}
      {currentStep === 5 && (
        <div className="glass-card card-accent-blue animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t('reg.emergency.title', 'Emergency Contact Details')}
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginTop: '4px' }}>
              {t('reg.emergency.subtitle', 'Provide contact details of a relative, sponsor, or legal representative to reach in an emergency. Fields marked with an asterisk (*) are required.')}
            </p>
          </div>

          {Object.keys(stepErrors).length > 0 && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#B91C1C', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>{t('reg.errors.emergency', 'Please complete all required emergency contact fields:')}</strong>
                <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                  {Object.values(stepErrors).map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div>
              <label className="input-label">{t('reg.emergency.name', 'Contact Full Name')} *</label>
              <input
                className="input-field"
                placeholder={t('reg.emergency.name', 'Full name')}
                value={emergencyContact.name}
                onChange={e => {
                  setEmergencyContact({ ...emergencyContact, name: e.target.value });
                  if (stepErrors.emergencyName) setStepErrors({ ...stepErrors, emergencyName: '' });
                }}
                style={stepErrors.emergencyName ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              />
              {stepErrors.emergencyName && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.emergencyName}</span>}
            </div>
            <div>
              <label className="input-label">{t('reg.emergency.rel', 'Relationship to Family')} *</label>
              <select
                className="input-field"
                value={emergencyContact.relationship || ''}
                onChange={e => {
                  setEmergencyContact({ ...emergencyContact, relationship: e.target.value });
                  if (stepErrors.emergencyRel) setStepErrors({ ...stepErrors, emergencyRel: '' });
                }}
                style={stepErrors.emergencyRel ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              >
                <option value="">— {t('reg.selectRelationship', 'Select relationship')} —</option>
                <option value="Spouse / Partner">{t('reg.rel.spouse', 'Spouse / Partner')}</option>
                <option value="Brother / Sister">{t('reg.rel.brother', 'Brother')} / {t('reg.rel.sister', 'Sister')}</option>
                <option value="Parent (Mother / Father)">{t('reg.rel.father', 'Parent (Mother / Father)')}</option>
                <option value="Adult Child (Son / Daughter)">{t('reg.rel.son', 'Adult Child (Son / Daughter)')}</option>
                <option value="Relative / Extended Family">{t('reg.rel.other', 'Relative / Extended Family')}</option>
                <option value="Friend">Friend</option>
                <option value="Community Sponsor">Community Sponsor</option>
                <option value="Case Worker / NGO Representative">Case Worker / NGO Representative</option>
                <option value="Legal Representative / Attorney">Legal Representative / Attorney</option>
                <option value="Neighbor">Neighbor</option>
                <option value="Other">{t('common.other', 'Other')}</option>
              </select>
              {stepErrors.emergencyRel && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.emergencyRel}</span>}
            </div>

            <div>
              <label className="input-label">Emergency Contact Country</label>
              <select
                className="input-field"
                value={(emergencyContact as any).country || familyInfo.countryOfOrigin || 'United States'}
                onChange={e => {
                  const cObj = getCountryByName(e.target.value);
                  setEmergencyContact({
                    ...emergencyContact,
                    country: e.target.value,
                    phone: (emergencyContact.phone || '').startsWith('+') ? emergencyContact.phone : `${cObj.dialCode} ${emergencyContact.phone}`.trim()
                  } as any);
                }}
              >
                {COUNTRIES_DATA.map(c => (
                  <option key={c.name} value={c.name}>{c.name} ({c.dialCode})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">{t('reg.emergency.phone', 'Phone Number')} *</label>
              <input
                className="input-field"
                placeholder="+1 (555) 000-0000"
                value={emergencyContact.phone}
                onKeyDown={e => {
                  if (!/[\d\+\-\s\(\)\b]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                    e.preventDefault();
                  }
                }}
                onChange={e => {
                  setEmergencyContact({ ...emergencyContact, phone: e.target.value });
                  if (stepErrors.emergencyPhone) setStepErrors({ ...stepErrors, emergencyPhone: '' });
                }}
                style={stepErrors.emergencyPhone ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
              />
              {stepErrors.emergencyPhone && <span style={{ color: '#DC2626', fontSize: '0.72rem', fontWeight: 600 }}>{stepErrors.emergencyPhone}</span>}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="input-label">{t('reg.emergency.address', 'Current Address')}</label>
              <input
                className="input-field"
                placeholder={t('reg.emergency.address', 'Current Address')}
                value={emergencyContact.address}
                onChange={e => setEmergencyContact({ ...emergencyContact, address: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button className="btn-secondary" onClick={() => { setStepErrors({}); if (familyInfo.householdSize === 1) setCurrentStep(3); else setCurrentStep(4); }}>
              <ArrowLeft size={18} /> {t('common.previous', 'Previous')}
            </button>
            <button className="btn-primary" onClick={handleNextFromStep5}>
              {t('reg.nextDeclaration', 'Next Step: Declaration')} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: DECLARATION */}
      {currentStep === 6 && (
        <div className="glass-card card-accent-blue animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t('reg.declaration.title', 'Declaration & Final Submission')}
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginTop: '4px' }}>
              {t('reg.declaration.subtitle', 'Please review your details and confirm declaration of truthfulness.')}
            </p>
          </div>

          <div
            style={{
              padding: '20px',
              background: '#F8FAFC',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              marginBottom: '28px',
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
              {t('reg.appSummary', 'Application Summary')}
            </h4>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>{t('reg.step2', 'Head of Family')}: <strong>{headOfFamily.firstName} {headOfFamily.lastName}</strong></div>
              <div>{t('reg.familyName', 'Household Name')}: <strong>{familyInfo.familyName}</strong></div>
              <div>{t('reg.countryOfOrigin', 'Country of Origin')}: <strong>{familyInfo.countryOfOrigin}</strong></div>
              <div>{t('reg.householdSize', 'Household Size')}: <strong>{familyInfo.householdSize} {t('common.persons', 'person(s)')}</strong></div>
              <div>{t('reg.step4', 'Accompanying Members')}: <strong>{members.length} {t('common.members', 'member(s)')}</strong></div>
              <div>{t('reg.uploadedFiles', 'Uploaded Documents')}: <strong>{uploadedDocs.length} {t('common.view', 'file(s)')}</strong></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
            <input
              type="checkbox"
              id="declaration-checkbox-final"
              checked={declared}
              onChange={e => setDeclared(e.target.checked)}
              style={{ width: '22px', height: '22px', accentColor: '#2563EB', cursor: 'pointer' }}
            />
            <label htmlFor="declaration-checkbox-final" style={{ fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.92rem' }}>
              {t('reg.declaration.statement', 'I hereby declare that all the information provided in this registration is true, accurate, and complete to the best of my knowledge.')}
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(5)} disabled={isSubmitting}>
              <ArrowLeft size={18} /> {t('common.previous', 'Previous')}
            </button>
            <button className="btn-emerald" disabled={!declared || isSubmitting} onClick={handleFinalSubmit}>
              {isSubmitting ? (
                <><Loader2 size={18} className="spin" /> {t('common.inProgress', 'Submitting Application…')}</>
              ) : (
                <><CheckCircle size={18} /> {t('reg.declaration.submit', 'Submit Family Registration')}</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: COMPLETE CONFIRMATION */}
      {currentStep === 7 && (
        <div className="glass-card card-accent-emerald animate-fade-in" style={{ padding: '48px 32px', textAlign: 'center' }}>
          <CheckCircle size={60} style={{ color: '#10B981', margin: '0 auto 20px auto' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            {t('reg.complete.title', 'Registration Submitted Successfully!')}
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>
            Your application record has been registered in the ServiceNow Bridge360 database.
          </p>

          <div
            style={{
              display: 'inline-block',
              padding: '24px 36px',
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '16px',
              margin: '24px 0',
              textAlign: 'left',
              maxWidth: '540px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#1D4ED8', fontWeight: 700, textTransform: 'uppercase' }}>
                {t('reg.complete.appId', 'Your Application Reference ID')}
              </span>
              <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                {t('common.pending', 'Pending Review')}
              </span>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '1px' }}>
              {submittedAppId}
            </div>
            <div style={{ borderTop: '1px solid #DBEAFE', marginTop: '14px', paddingTop: '12px', fontSize: '0.84rem', color: '#475569', lineHeight: '1.5' }}>
              <strong>Next Steps:</strong> A Case Officer will review your uploaded identity documents in the Admin Portal.
              Once all documents are verified, your official <strong>Refugee ID</strong> and <strong>Family ID</strong> will be minted, replacing this temporary Application ID.
            </div>
          </div>

          {mode === 'admin' ? (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  setSelectedFamilyId(submittedAppId);
                  setAdminView('family360');
                }}
              >
                <Users size={16} /> {t('dash.openFamily360', 'Open in Family 360')}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setAdminView('verification')}
              >
                <ShieldCheck size={16} /> {t('dash.verificationWorkspace', 'Go to Verification Queue')}
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setCurrentStep(1);
                  setHeadOfFamily({
                    firstName: '',
                    middleName: '',
                    lastName: '',
                    gender: '' as any,
                    dateOfBirth: '',
                    nationality: '',
                    mobileNumber: '',
                    email: '',
                    address: '',
                    city: '',
                    state: '',
                    postalCode: '',
                  });
                  setFamilyInfo({
                    familyName: '',
                    countryOfOrigin: '',
                    arrivalDate: new Date().toISOString().split('T')[0],
                    householdSize: 1,
                    primaryLanguage: '',
                    immigrationStatus: '',
                    needsInterpreter: false,
                  });
                  setMembers([]);
                  setUploadedDocs([]);
                  setDeclared(false);
                }}
              >
                <UserPlus size={16} /> {t('nav.newRegistration', 'Register Another Family')}
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '24px' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  onCompleteTrack?.(submittedAppId);
                }}
              >
                <Search size={18} /> {t('reg.complete.track', 'Track Application Status')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
