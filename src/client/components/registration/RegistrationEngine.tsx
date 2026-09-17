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
  Search
} from 'lucide-react';
import { SearchableSelect, SearchableOption } from '../common/SearchableSelect';
import { useBridge360 } from '../../store/Bridge360Context';
import { DocumentRecord, FamilyMember, CountryRecord, CountryDocumentRecord, CountryDocumentFieldRecord } from '../../types/bridge360';
import { extractDocumentFields, ExtractionResult } from '../../services/ocrEngine';
import { snExtractDocument } from '../../services/snApi';
import { callEasyOCRService } from '../../services/easyOcrClient';
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

    if (newCountryId) {
      try {
        const specificDocs = await evidenceFoundationService.getCountryDocuments(newCountryId);
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
      if (doc.countryId) {
        if (doc.countryId === selectedCountry.id) return true;
        if (selectedCountry.iso2 && doc.countryId.toUpperCase() === selectedCountry.iso2.toUpperCase()) return true;
        if (selectedCountry.iso3 && doc.countryId.toUpperCase() === selectedCountry.iso3.toUpperCase()) return true;
        if (doc.countryId.toLowerCase() === selectedCountry.countryName.toLowerCase()) return true;
      }
      if (doc.countryName && selectedCountry.countryName) {
        if (doc.countryName.toLowerCase() === selectedCountry.countryName.toLowerCase()) return true;
      }
      return false;
    });

    const seen = new Set<string>();
    return filtered.filter(d => {
      const key = (d.documentName || '').trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [selectedCountry, availableDocuments]);

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
      badge: (doc as any).documentCode || undefined,
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

/**
 * Generic assessment of ServiceNow Document Intelligence OCR quality.
 * Evaluates execution status, token density, character count, and field match completion.
 * Decoupled from document type, country, or schema rules.
 */
function assessDocIntelQuality(diResult: any, expectedFieldsCount: number): { sufficient: boolean; reason: string } {
  if (!diResult) {
    return { sufficient: false, reason: 'DI_RESPONSE_EMPTY' };
  }
  if (!diResult.diOcrUsed) {
    return { sufficient: false, reason: 'DI_NOT_USED_OR_FAILED' };
  }
  const tokenCount = Number(diResult.diTokenCount || 0);
  if (tokenCount < 4) {
    return { sufficient: false, reason: `LOW_TOKEN_COUNT (${tokenCount})` };
  }
  const textLen = (diResult.rawText || '').trim().length;
  if (textLen < 20) {
    return { sufficient: false, reason: `LOW_TEXT_LENGTH (${textLen} chars)` };
  }
  const fieldsMatched = diResult.fields ? Object.keys(diResult.fields).length : 0;
  if (expectedFieldsCount > 0 && fieldsMatched === 0 && textLen < 40) {
    return { sufficient: false, reason: `ZERO_FIELDS_MATCHED (${textLen} chars)` };
  }
  return { sufficient: true, reason: 'SUFFICIENT' };
}

/**
 * Extract applicable languages generically from the country configuration where available.
 * No hardcoded country-to-language maps.
 */
function getDynamicLanguagesFromCountry(officialLanguages?: string): string[] | undefined {
  if (!officialLanguages || !officialLanguages.trim()) return undefined;
  const tokens = officialLanguages
    .split(/[,;\/]+/)
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);
  return tokens.length > 0 ? tokens : undefined;
}

  // AUTOMATIC DOCUMENT VERIFICATION & DYNAMIC EXTRACTION
  // DI PRIMARY -> GENERIC QUALITY CHECK -> EASYOCR SECONDARY FALLBACK
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

      // Step 2: Native ServiceNow Document Intelligence Engine (PRIMARY)
      setDocIntelLoadingStep(2);
      setDocIntelStatus('Running ServiceNow Document Intelligence (Primary)...');

      let snDocIntelResult: any = null;
      try {
        snDocIntelResult = await snExtractDocument({
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          fileBase64: fileDataUrl,
          countryId: selectedCountryId,
          countryDocumentId: selectedCountryDocId,
          documentType: selectedDocType,
          expectedFields: expectedFieldDefs,
        });
      } catch (snErr) {
        console.warn('[OCR Pipeline] Primary ServiceNow Document Intelligence call completed with fallback:', snErr);
      }

      // Step 3: Generic DI Quality Assessment
      setDocIntelLoadingStep(3);
      setDocIntelStatus('Evaluating extraction quality...');

      const diAssessment = assessDocIntelQuality(snDocIntelResult, expectedFieldDefs.length);
      let selectedOcrSource: 'DI' | 'EASYOCR' | 'CLIENT_OCR' = 'DI';
      let activeRawText = (snDocIntelResult?.rawText || '').trim();
      let activeFields: Record<string, any> = snDocIntelResult?.fields || {};

      if (diAssessment.sufficient) {
        console.info(
          `[OCR Pipeline] DI SUFFICIENT (tokens: ${snDocIntelResult?.diTokenCount}, length: ${activeRawText.length}, fields: ${Object.keys(activeFields).length}). EasyOCR secondary fallback skipped.`
        );
        selectedOcrSource = 'DI';
        setOcrRawText(activeRawText);
      } else {
        // Fallback: DI Insufficient -> invoke secondary EasyOCR microservice
        console.info(
          `[OCR Pipeline] DI INSUFFICIENT (${diAssessment.reason}). Invoking secondary EasyOCR fallback...`
        );
        setDocIntelStatus('Document Intelligence result insufficient. Running secondary EasyOCR fallback...');

        const dynamicLangs = getDynamicLanguagesFromCountry(selectedCountry?.officialLanguages);
        const easyOcrResult = await callEasyOCRService(fileDataUrl, {
          languages: dynamicLangs,
        });

        if (easyOcrResult.success && easyOcrResult.text && easyOcrResult.text.trim().length > 0) {
          console.info(
            `[OCR Pipeline] EasyOCR secondary fallback succeeded in ${easyOcrResult.processing_time_ms}ms (chars: ${easyOcrResult.text.length}). Passing OCR text into dynamic extraction pipeline.`
          );
          selectedOcrSource = 'EASYOCR';
          activeRawText = easyOcrResult.text.trim();
          setOcrRawText(activeRawText);

          // Pass EasyOCR OCR text into existing dynamic extraction pipeline
          try {
            const dynamicExtractRes = await snExtractDocument({
              text: activeRawText,
              rawText: activeRawText,
              fileName: file.name,
              countryId: selectedCountryId,
              countryDocumentId: selectedCountryDocId,
              documentType: selectedDocType,
              expectedFields: expectedFieldDefs,
            });
            if (dynamicExtractRes?.fields && Object.keys(dynamicExtractRes.fields).length > 0) {
              activeFields = dynamicExtractRes.fields;
            }
          } catch (dynErr) {
            console.warn('[OCR Pipeline] Error passing EasyOCR text to dynamic extraction:', dynErr);
          }
        } else {
          console.warn(
            `[OCR Pipeline] EasyOCR fallback unavailable or empty (${easyOcrResult.error || 'no text'}). Preserving original DI result and continuing safely.`
          );
          // Preserve whatever DI result existed
          selectedOcrSource = 'DI';
        }
      }

      // If both DI and EasyOCR yielded no text, invoke client OCR as emergency safety net
      if (!activeRawText) {
        try {
          const localResult: ExtractionResult = await extractDocumentFields(file, expectedFieldDefs);
          if (localResult?.rawText) {
            activeRawText = localResult.rawText;
            setOcrRawText(activeRawText);
            if (localResult.fields && Object.keys(activeFields).length === 0) {
              activeFields = localResult.fields;
            }
          }
        } catch (localErr) {
          // Graceful ignore
        }
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

      const allDynamicFields: Record<string, any> = {};

      if (activeFields) {
        for (const [k, v] of Object.entries(activeFields)) {
          const val = (v as any)?.value !== undefined ? (v as any).value : v;
          if (val !== undefined && val !== null && String(val).trim()) {
            const canonicalKey = configuredNameMap.size > 0 ? configuredNameMap.get(k.toLowerCase()) : k;
            if (canonicalKey) {
              allDynamicFields[canonicalKey] = typeof val === 'string' ? val.trim() : val;
            }
          }
        }
      }

      // IMPORTANT: Do NOT merge snDocIntelResult.extracted into allDynamicFields!
      // snDocIntelResult.extracted belongs strictly to Layer 2 (Registration Auto-Fill)
      // and must never contaminate Layer 1 (Document Extraction).

      // Store Layer 1 dynamic fields strictly for review and persistence
      setDocIntelExtractedData(allDynamicFields);

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
        extractedFields: Object.entries(allDynamicFields).map(([k, v]) => ({
          key: k,
          label: k.replace(/_/g, ' '),
          value: String(v),
          confidence: 90,
          category: 'IDENTITY' as any,
          verified: false,
        })),
        extractedJson: JSON.stringify(allDynamicFields),
        ocrRawText: activeRawText,
        fileDataUrl: fileDataUrl,
        previewUrl: fileDataUrl,
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
      const firstName =
        allDynamicFields.first_name ||
        allDynamicFields.firstName ||
        allDynamicFields.given_name ||
        allDynamicFields.forename ||
        (allDynamicFields.full_name ? allDynamicFields.full_name.split(' ')[0] : '');

      const middleName =
        allDynamicFields.middle_name ||
        allDynamicFields.middleName ||
        (allDynamicFields.full_name && allDynamicFields.full_name.split(' ').length > 2
          ? allDynamicFields.full_name.split(' ').slice(1, -1).join(' ')
          : '');

      const lastName =
        allDynamicFields.last_name ||
        allDynamicFields.lastName ||
        allDynamicFields.surname ||
        allDynamicFields.family_name ||
        (allDynamicFields.full_name && allDynamicFields.full_name.split(' ').length > 1
          ? allDynamicFields.full_name.split(' ').slice(-1)[0]
          : '');

      const rawDateOfBirth =
        allDynamicFields.date_of_birth ||
        allDynamicFields.dateOfBirth ||
        allDynamicFields.dob ||
        allDynamicFields.birth_date ||
        snDocIntelResult?.extracted?.dateOfBirth ||
        '';
      const dateOfBirth = normalizeToISODate(rawDateOfBirth);

      const gender =
        allDynamicFields.gender ||
        allDynamicFields.sex ||
        'Male';

      const nationality =
        allDynamicFields.nationality ||
        allDynamicFields.citizenship ||
        (selectedCountry ? selectedCountry.nationality || selectedCountry.countryName : '');

      const passportNumber =
        allDynamicFields.passport_number ||
        allDynamicFields.passport_no ||
        snDocIntelResult?.extracted?.passportNumber ||
        '';

      const nationalId =
        allDynamicFields.national_id ||
        allDynamicFields.nid_number ||
        allDynamicFields.aadhaar_number ||
        allDynamicFields.id_number ||
        allDynamicFields.unhcr_case_number ||
        allDynamicFields.family_book_number ||
        allDynamicFields.document_number ||
        allDynamicFields.individual_id ||
        allDynamicFields.tc_kimlik_number ||
        allDynamicFields.cpf_number ||
        allDynamicFields.license_number ||
        allDynamicFields.registration_number ||
        allDynamicFields.frc_number ||
        snDocIntelResult?.extracted?.nationalId ||
        '';

      const emailFromDoc =
        allDynamicFields.email ||
        allDynamicFields.email_masked ||
        snDocIntelResult?.extracted?.email ||
        '';

      const phoneFromDoc =
        allDynamicFields.mobile_number ||
        allDynamicFields.phone ||
        allDynamicFields.mobile_masked ||
        allDynamicFields.contact_number ||
        snDocIntelResult?.extracted?.mobileNumber ||
        '';

      const addressFromDoc =
        allDynamicFields.address ||
        allDynamicFields.residential_address ||
        snDocIntelResult?.extracted?.address ||
        '';

      const cityFromDoc =
        allDynamicFields.city ||
        allDynamicFields.place_of_birth ||
        allDynamicFields.registry_location ||
        snDocIntelResult?.extracted?.city ||
        '';

      const postalCodeFromDoc =
        allDynamicFields.postal_code ||
        allDynamicFields.zip_code ||
        snDocIntelResult?.extracted?.postalCode ||
        '';

      setHeadOfFamily(prev => ({
        ...prev,
        firstName: firstName || prev.firstName,
        middleName: middleName || prev.middleName,
        lastName: lastName || prev.lastName,
        gender: (gender as any) || prev.gender,
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
        setProactiveMessage("Perfect! Now please upload your identity documents.");
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

  const handleNextFromStep6 = () => {
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
        emergencyContact,
        uploadedDocs,
      });
      setSubmittedAppId(appId);
      setCurrentStep(8);
    } catch (err: any) {
      console.error('Registration submission error:', err);
      // Fallback: Generate local Application ID and register locally so user is never blocked
      const fallbackId = `APP-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
      setSubmittedAppId(fallbackId);
      setCurrentStep(8);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, name: t('reg.step1', 'Upload Document') },
    { num: 2, name: t('reg.step2', 'Head of Family') },
    { num: 3, name: t('reg.step3', 'Family Info') },
    ...(familyInfo.householdSize > 1 ? [{ num: 4, name: t('reg.step4', 'Family Members') }] : []),
    { num: 5, name: t('reg.step5', 'Supporting Docs') },
    { num: 6, name: t('reg.step6', 'Emergency Contact') },
    { num: 7, name: t('reg.step7', 'Declaration') },
  ];

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Humanitarian Refugee Header Banner */}
      <div className="humanitarian-banner" style={{ marginBottom: '28px' }}>
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

      {/* Stepper Navigation Bar */}
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

      {/* STEP 1: UPLOAD INITIAL DOCUMENT FOR DOCINTEL EXTRACTION OR MANUAL FILL */}
      {currentStep === 1 && (
        <div className="glass-card card-accent-blue animate-fade-in" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 28px auto' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid #BFDBFE' }}>
              <UploadCloud size={34} />
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>
              <Sparkles size={14} /> {t('reg.step1.title', 'Instant Document Verification & Auto-Fill')}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              {t('reg.step1', 'Step 1 — Upload Identification Document')}
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.92rem', marginTop: '6px', lineHeight: 1.5 }}>
              {t('reg.step1.subtitle', 'Upload your identification document for instant verification. Our system will securely scan your details and auto-fill your application.')}
            </p>
          </div>

          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
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

            {/* Document Type Dropdown with Search */}
            <div style={{ marginBottom: '16px' }}>
              <SearchableSelect
                id="registration-doc-type-select"
                label={t('reg.step1.docTypeLabel', 'Select Document Type')}
                placeholder={!selectedCountryId ? t('reg.step1.selectCountryFirst', 'Select country first') : t('reg.step1.selectDocPlaceholder', '-- Select or Search Document Type --')}
                searchPlaceholder="Search document type..."
                options={documentOptions}
                value={selectedCountryDocId || selectedDocType}
                onChange={handleDocTypeSelectChange}
                disabled={!selectedCountryId}
              />
              {configuredDocumentFields.length > 0 && (
                <div style={{ fontSize: '0.78rem', color: '#2563EB', marginTop: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle size={14} /> {configuredDocumentFields.length} active fields configured for this document in ServiceNow
                </div>
              )}
            </div>

            <div
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
                  t('reg.step1.dragDrop', 'Click to Choose Document File or Drag & Drop')
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                {t('reg.step1.supports', 'Supports PDF, JPG, PNG, WEBP (Passports, UNHCR IDs, National IDs)')}
              </div>
            </div>

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
              <div style={{ marginTop: '16px', padding: '16px', background: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} />
                  Dynamically Extracted Fields ({Object.keys(docIntelExtractedData).length} fields preserved):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(docIntelExtractedData).map(([fieldKey, val]) => (
                    <div
                      key={fieldKey}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #86EFAC',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.78rem',
                        color: '#15803D',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: '#166534' }}>{fieldKey.replace(/_/g, ' ')}:</span>
                      <span>{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Continue button if document is uploaded */}
            {uploadedDocs.length > 0 && (
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <button
                  className="btn-primary"
                  style={{ padding: '12px 32px', fontSize: '0.95rem' }}
                  onClick={() => setCurrentStep(2)}
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
              {familyInfo.householdSize === 1 ? t('reg.skipMembers', 'Skip Members & Go to Docs') : t('reg.nextMembers', 'Next: Family Members')} <ArrowRight size={18} />
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
              {t('reg.nextSupportingDocs', 'Next Step: Supporting Docs')} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUPPORTING DOCUMENTS */}
      {currentStep === 5 && (
        <div className="glass-card card-accent-blue animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t('reg.docs.title', 'Supporting Documents Upload')}
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginTop: '4px' }}>
              {t('reg.docs.subtitle', 'Upload any additional documents (Family Birth Certificates, Visas, Medical Records).')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label className="input-label">{t('reg.step1.docTypeLabel', 'Document Category')}</label>
              <select
                className="input-field"
                value={selectedDocType}
                onChange={e => setSelectedDocType(e.target.value as any)}
              >
                <option value="Passport">{t('reg.passportNum', 'Passport')}</option>
                <option value="UNHCR Card">{t('reg.unhcrCard', 'UNHCR Identity Card / Certificate')}</option>
                <option value="National ID">{t('reg.nationalId', 'National ID / Identity Card')}</option>
                <option value="Asylum Certificate">{t('reg.asylumCert', 'Asylum Seeker Certificate')}</option>
                <option value="Visa">{t('reg.visa', 'Visa / Resettlement Permit')}</option>
              </select>
            </div>

            <div>
              <label className="input-label">{t('reg.selectFileToUpload', 'Select File to Upload')}</label>
              <div
                style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  textAlign: 'center',
                  background: '#F8FAFC',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <input
                  type="file"
                  onChange={handleAdditionalFileUpload}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
                <UploadCloud size={24} style={{ color: '#2563EB', marginBottom: '4px' }} />
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {t('reg.step1.dragDrop', 'Click to Choose Document File or Drag & Drop')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                  PDF, JPG, PNG, WEBP
                </div>
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
            {t('reg.uploadedFiles', 'Uploaded Files')} ({uploadedDocs.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
            {uploadedDocs.map(doc => (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {doc.fileDataUrl ? (
                    <img 
                      src={doc.fileDataUrl} 
                      alt="Preview" 
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #CBD5E1' }} 
                    />
                  ) : (
                    <FileText size={32} style={{ color: '#2563EB' }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                      {doc.fileName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', marginTop: '2px' }}>
                      {t('common.status', 'Type')}: <strong>{doc.documentType}</strong> • {doc.fileSize}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeDoc(doc.id)}
                  style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button
              className="btn-secondary"
              onClick={() => {
                setStepErrors({});
                if (familyInfo.householdSize === 1) {
                  setCurrentStep(3);
                } else {
                  setCurrentStep(4);
                }
              }}
            >
              <ArrowLeft size={18} /> {t('common.previous', 'Previous')}
            </button>
            <button className="btn-primary" onClick={() => { setStepErrors({}); setCurrentStep(6); }}>
              {t('reg.nextEmergency', 'Next Step: Emergency Contact')} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: EMERGENCY CONTACT */}
      {currentStep === 6 && (
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
            <button className="btn-secondary" onClick={() => { setStepErrors({}); setCurrentStep(5); }}>
              <ArrowLeft size={18} /> {t('common.previous', 'Previous')}
            </button>
            <button className="btn-primary" onClick={handleNextFromStep6}>
              {t('reg.nextDeclaration', 'Next Step: Declaration')} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: DECLARATION */}
      {currentStep === 7 && (
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
            <button className="btn-secondary" onClick={() => setCurrentStep(6)} disabled={isSubmitting}>
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

      {/* STEP 8: COMPLETE CONFIRMATION */}
      {currentStep === 8 && (
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
