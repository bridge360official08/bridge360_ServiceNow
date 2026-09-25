import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Check,
  X,
  FileText,
  Mail,
  Send,
  User,
  ExternalLink,
  Download,
  Search,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Calendar,
  Phone,
  MapPin,
  Globe,
  AlertCircle,
  Save,
  Flag,
  UploadCloud,
  ChevronRight,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Info,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  Cpu,
  BrainCircuit,
  BookOpen,
  Scale,
  Lock
} from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';
import { snRequestAdditionalDocuments } from '../../services/snApi';
import {
  FamilyRecord,
  DocumentRecord,
  CountryRecord,
  CountryDocumentRecord,
  EvidenceRuleRecord,
  VerificationAuthorityRecord,
  VerificationRequestRecord
} from '../../types/bridge360';
import { evidenceFoundationService } from '../../services/evidenceFoundationService';
import {
  requestAIVerificationSummary,
  VerificationDataPayload,
  AIVerificationSummaryResponse,
  CountryEvidenceCompliance
} from '../../services/aiVerificationService';
import { VerificationAgentPanel } from '../../components/admin/VerificationAgentPanel';

export const VerificationView: React.FC = () => {
  const {
    families,
    documents,
    updateVerificationStatus,
    approveEntireApplication,
    rejectApplication,
    setSelectedFamilyId,
    setAdminView,
    addFamilyNote,
  } = useBridge360();

  // Navigation Levels: 'queue' (Queue of Registered Families) | 'application_workspace' (Officer Document Verification)
  const [navLevel, setNavLevel] = useState<'queue' | 'application_workspace'>('queue');

  // Active Family & Document Selection
  const [selectedFamId, setSelectedFamId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Document Viewer Canvas Controls
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Search & Filter State in Queue
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Decision Modals
  const [showRequestDocModal, setShowRequestDocModal] = useState<boolean>(false);
  const [requestedDocType, setRequestedDocType] = useState<string>('National ID Card');
  const [requestNotes, setRequestNotes] = useState<string>('Please provide a clearer, color scan of your identity document.');
  const [isSendingRequest, setIsSendingRequest] = useState<boolean>(false);
  const [requestSuccessMsg, setRequestSuccessMsg] = useState<string>('');

  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('Uploaded document is incomplete or unreadable.');

  // Officer Workspace Notes
  const [officerNote, setOfficerNote] = useState<string>('');
  const [officerNoteSaved, setOfficerNoteSaved] = useState<boolean>(false);

  // AI Verification Summary State
  const [aiSummary, setAiSummary] = useState<AIVerificationSummaryResponse | null>(null);
  const [isLoadingAiSummary, setIsLoadingAiSummary] = useState<boolean>(false);
  const [aiSummaryError, setAiSummaryError] = useState<string | null>(null);
  const [showComparisonTable, setShowComparisonTable] = useState<boolean>(true);

  // Subtab State: 'officer_workspace' vs 'verification_agent' (Feature #3)
  const [workspaceTab, setWorkspaceTab] = useState<'officer_workspace' | 'verification_agent'>('officer_workspace');

  // Ref to scroll to AI result panel
  const aiResultPanelRef = useRef<HTMLDivElement>(null);

  // Country Evidence Intelligence & External Verification State
  const [countryInfo, setCountryInfo] = useState<CountryRecord | null>(null);
  const [countryDocCatalog, setCountryDocCatalog] = useState<CountryDocumentRecord[]>([]);
  const [countryRules, setCountryRules] = useState<EvidenceRuleRecord[]>([]);
  const [relationshipFindings, setRelationshipFindings] = useState<any[]>([]);
  const [authorities, setAuthorities] = useState<VerificationAuthorityRecord[]>([]);
  const [familyVerificationRequests, setFamilyVerificationRequests] = useState<VerificationRequestRecord[]>([]);

  // External Verification Request Modal State
  const [showExternalVerifyModal, setShowExternalVerifyModal] = useState<boolean>(false);
  const [verifyTargetMemberId, setVerifyTargetMemberId] = useState<string>('');
  const [verifyTargetDocId, setVerifyTargetDocId] = useState<string>('');
  const [verifyAuthorityId, setVerifyAuthorityId] = useState<string>('');
  const [verifyRequestType, setVerifyRequestType] = useState<'document_authenticity' | 'civil_status_lookup' | 'unhcr_crosscheck' | 'consular_query'>('unhcr_crosscheck');
  const [verifyConsentGranted, setVerifyConsentGranted] = useState<boolean>(false);
  const [verifyProtectionCleared, setVerifyProtectionCleared] = useState<boolean>(false);
  const [verifyNotes, setVerifyNotes] = useState<string>('Bilateral inquiry for identity confirmation under standard humanitarian procedure.');
  const [verifySuccessMsg, setVerifySuccessMsg] = useState<string | null>(null);
  const [verifyErrorMsg, setVerifyErrorMsg] = useState<string | null>(null);
  const [isSubmittingVerifyReq, setIsSubmittingVerifyReq] = useState<boolean>(false);

  // Find the selected family from real live database, or default to first family
  const activeFamily: FamilyRecord = families.find(f => f.id === selectedFamId || f.applicationId === selectedFamId) || families[0] || {
    id: 'APP-2026-000001',
    applicationId: 'APP-2026-000001',
    bridge360Id: 'RID-2026-000001',
    familyName: 'Applicant Family',
    countryOfOrigin: 'Syria',
    arrivalDate: '2026-08-14',
    householdSize: 1,
    primaryLanguage: 'English',
    immigrationStatus: 'Asylum Applicant',
    needsInterpreter: false,
    priority: 'Normal',
    assignedOfficer: 'Sarah Jenkins',
    registrationStatus: 'Submitted',
    verificationStatus: 'Pending',
    caseStatus: 'New',
    headOfFamily: {
      id: 'MEM-1',
      familyId: 'APP-2026-000001',
      isHeadOfFamily: true,
      relationshipToHead: 'Self',
      firstName: 'Applicant',
      lastName: 'Family',
      gender: 'Male',
      dateOfBirth: '1995-03-15',
      nationality: 'Syrian',
      maritalStatus: 'Single',
      documentIds: [],
    },
    members: [],
    createdAt: '2026-08-14',
    updatedAt: '2026-08-14',
  };

  // Real Uploaded Documents for this specific family
  const familyDocs: DocumentRecord[] = documents.filter(
    d => d.familyId === activeFamily.id || d.applicationId === activeFamily.applicationId || d.familyId === activeFamily.applicationId
  );

  const activeDoc: DocumentRecord | undefined = familyDocs.find(d => d.id === selectedDocId) || familyDocs[0];

  // Helper stats for Family Card in Queue
  const getFamilyStats = (fam: FamilyRecord) => {
    const totalMembers = 1 + (fam.members ? fam.members.length : 0);
    const famDocs = documents.filter(d => d.familyId === fam.id || d.applicationId === fam.applicationId);
    const verifiedDocs = famDocs.filter(d => d.verificationStatus === 'Verified').length;
    const pendingDocs = Math.max(0, famDocs.length - verifiedDocs);

    return {
      totalMembers,
      docCount: famDocs.length,
      verifiedDocs,
      pendingDocs,
    };
  };

  // Filtered Families for Queue
  const filteredFamilies = families.filter(fam => {
    const matchesSearch =
      fam.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fam.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fam.headOfFamily?.firstName && fam.headOfFamily.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (fam.headOfFamily?.lastName && fam.headOfFamily.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (fam.bridge360Id && fam.bridge360Id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      fam.countryOfOrigin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry = filterCountry === 'All' || fam.countryOfOrigin === filterCountry;
    const matchesStatus = filterStatus === 'All' || fam.registrationStatus === filterStatus;

    return matchesSearch && matchesCountry && matchesStatus;
  });

  // Action Handlers
  const handleOpenWorkspace = (famId: string) => {
    setSelectedFamId(famId);
    setAiSummary(null);
    setAiSummaryError(null);
    const fDocs = documents.filter(d => d.familyId === famId || d.applicationId === famId);
    if (fDocs.length > 0) {
      setSelectedDocId(fDocs[0].id);
    }
    setNavLevel('application_workspace');
  };

  // Load Country Evidence & Verification Requests when active family changes
  React.useEffect(() => {
    if (!activeFamily) return;
    const loadCountryIntelligence = async () => {
      const c = await evidenceFoundationService.getCountryByOrigin(activeFamily.countryOfOrigin);
      if (c) {
        setCountryInfo(c);
        const [docs, rules, auths, vReqs] = await Promise.all([
          evidenceFoundationService.getCountryDocuments(c.id),
          evidenceFoundationService.getEvidenceRules(c.id),
          evidenceFoundationService.getVerificationAuthorities(c.id),
          evidenceFoundationService.getVerificationRequests(activeFamily.applicationId),
        ]);
        setCountryDocCatalog(docs);
        setCountryRules(rules);
        setAuthorities(auths);
        setFamilyVerificationRequests(vReqs);

        const famDocs = documents.filter(
          d => d.familyId === activeFamily.id || d.applicationId === activeFamily.applicationId
        );
        const findings = evidenceFoundationService.evaluateRelationshipEvidence(
          rules,
          famDocs,
          [activeFamily.headOfFamily, ...(activeFamily.members || [])].filter(Boolean)
        );
        setRelationshipFindings(findings);
      } else {
        // Fallback for countries with no loaded evidence rules (e.g. Ethiopia)
        setCountryInfo(null);
        setCountryDocCatalog([]);
        setCountryRules([]);
        setRelationshipFindings([]);
        
        const [auths, vReqs] = await Promise.all([
          evidenceFoundationService.getVerificationAuthorities(), // Loads global authorities (UNHCR)
          evidenceFoundationService.getVerificationRequests(activeFamily.applicationId),
        ]);
        setAuthorities(auths);
        setFamilyVerificationRequests(vReqs);
      }
    };
    loadCountryIntelligence();
  }, [activeFamily?.id, activeFamily?.countryOfOrigin, documents]);

  // Auto-select the first verification authority when list is loaded
  React.useEffect(() => {
    if (authorities && authorities.length > 0 && !verifyAuthorityId) {
      setVerifyAuthorityId(authorities[0].id);
    }
  }, [authorities, verifyAuthorityId]);

  const handleOpenExternalVerifyModal = () => {
    setVerifyTargetMemberId(activeFamily.headOfFamily?.id || '');
    setVerifyTargetDocId(activeDoc?.id || '');
    setVerifyAuthorityId(authorities[0]?.id || '');
    setVerifyConsentGranted(false);
    setVerifyProtectionCleared(false);
    setVerifySuccessMsg(null);
    setVerifyErrorMsg(null);
    setShowExternalVerifyModal(true);
  };

  const handleCreateExternalVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyErrorMsg(null);
    setVerifySuccessMsg(null);

    // Guardrail Check: Protection Review & Consent Validation
    if (!verifyConsentGranted) {
      setVerifyErrorMsg('Applicant consent is required before dispatching external verification inquiries.');
      return;
    }

    if (!verifyProtectionCleared) {
      setVerifyErrorMsg('Protection Review must be cleared to confirm origin contact does not pose risk of refoulement or endanger family members.');
      return;
    }

    setIsSubmittingVerifyReq(true);
    const targetMember = [activeFamily.headOfFamily, ...(activeFamily.members || [])].find(m => m?.id === verifyTargetMemberId);
    const targetAuthority = authorities.find(a => a.id === verifyAuthorityId);
    const targetDocument = familyDocs.find(d => d.id === verifyTargetDocId);

    const res = await evidenceFoundationService.createVerificationRequest({
      familyId: activeFamily.id,
      applicationId: activeFamily.applicationId,
      familyName: activeFamily.familyName,
      memberId: verifyTargetMemberId,
      memberName: `${targetMember?.firstName || ''} ${targetMember?.lastName || ''}`.trim() || 'Primary Applicant',
      documentId: targetDocument?.id,
      documentName: targetDocument?.fileName || targetDocument?.documentType,
      countryId: countryInfo?.id || 'CTRY-GEN',
      countryName: countryInfo?.countryName || activeFamily.countryOfOrigin,
      authorityId: verifyAuthorityId,
      authorityName: targetAuthority?.authorityName || 'Verification Authority',
      requestType: verifyRequestType,
      status: 'pending_dispatch',
      consentRequired: true,
      consentStatus: 'granted',
      protectionReviewRequired: true,
      protectionReviewStatus: 'cleared_safe_to_contact',
      assignedOfficer: activeFamily.assignedOfficer || 'Current Officer',
      officerNotes: verifyNotes,
    });

    setIsSubmittingVerifyReq(false);
    if (res.success && res.request) {
      setVerifySuccessMsg(`Verification Request ${res.request.requestId} logged & pending dispatch.`);
      setFamilyVerificationRequests(prev => [res.request!, ...prev]);
      setTimeout(() => {
        setShowExternalVerifyModal(false);
      }, 1500);
    } else {
      setVerifyErrorMsg(res.message || 'Failed to create verification request.');
    }
  };

  const handleGenerateAiSummary = async () => {
    if (!activeFamily) return;
    setIsLoadingAiSummary(true);
    setAiSummaryError(null);

    try {
      const payload: VerificationDataPayload = {
        family: {
          applicationId: activeFamily.applicationId,
          familyName: activeFamily.familyName,
          countryOfOrigin: activeFamily.countryOfOrigin,
          householdSize: activeFamily.householdSize,
          priority: activeFamily.priority,
          registrationStatus: activeFamily.registrationStatus,
          verificationStatus: activeFamily.verificationStatus,
        },
        members: [
          activeFamily.headOfFamily,
          ...(activeFamily.members || [])
        ].filter(Boolean),
        documents: familyDocs.map(d => ({
          documentType: d.documentType,
          fileName: d.fileName,
          fileSize: d.fileSize,
          verificationStatus: d.verificationStatus,
          extractedFields: d.extractedFields,
          ocrRawText: d.ocrRawText
        }))
      };

      const response = await requestAIVerificationSummary(activeFamily.applicationId, payload);

      // Phase 2: Enrich with local country evidence compliance data
      // This covers local dev when SN evidence tables may not exist yet
      if (!response.country_evidence_compliance && countryInfo) {
        const allMembers = [activeFamily.headOfFamily, ...(activeFamily.members || [])].filter(Boolean);
        const localRuleFindings = evidenceFoundationService.evaluateRelationshipEvidence(
          countryRules, familyDocs, allMembers
        );

        const localCompliance: CountryEvidenceCompliance = {
          country: {
            sys_id: countryInfo.id,
            country_name: countryInfo.countryName,
            iso2: countryInfo.iso2,
            iso3: countryInfo.iso3,
            nationality: countryInfo.nationality,
            official_languages: countryInfo.officialLanguages,
            scripts_used: countryInfo.scriptsUsed,
            naming_convention: countryInfo.namingConvention,
            civil_registry_info: countryInfo.civilRegistryInfo || '',
          },
          relevant_document_types: countryDocCatalog.map(d => ({
            document_name: d.documentName,
            local_name: d.localName || '',
            category: d.documentCategory,
            issuing_authority: d.issuingAuthorityDesc || '',
            security_features: d.securityFeatures || '',
            electronic_verification: d.electronicVerificationAvailable ?? false,
          })),
          detected_documents: familyDocs.map(d => {
            const matched = countryDocCatalog.find(cd =>
              cd.documentName.toLowerCase().includes((d.documentType || '').toLowerCase().replace(/[\s\-_]+/g, ' ')) ||
              (d.documentType || '').toLowerCase().replace(/[\s\-_]+/g, ' ').includes(cd.documentName.toLowerCase())
            );
            return {
              uploaded_document: d.fileName || d.documentType,
              document_type: d.documentType,
              matched_country_reference: matched?.documentName || null,
              evidence_category: matched?.documentCategory || 'supporting',
              evidence_purpose: matched ? ({
                identity: 'Identity Verification',
                family_relationship: 'Family Relationship Evidence',
                civil_status: 'Civil Status Confirmation',
                address: 'Address Verification',
                supporting: 'Supporting Documentation',
              } as Record<string, string>)[matched.documentCategory] || 'Supporting' : 'Supporting',
            };
          }),
          applicable_evidence_rules: countryRules,
          relationship_evidence: localRuleFindings.map(f => ({
            claim_type: f.claimType,
            description: f.relationshipDescription,
            status: (f.isSatisfied ? (f.alternativeEvidenceAccepted ? 'PARTIAL' : 'SATISFIED') : 'MISSING') as 'SATISFIED' | 'PARTIAL' | 'MISSING' | 'UNABLE_TO_VERIFY',
            satisfying_documents: f.satisfyingDocuments,
            missing_primary_evidence: f.missingPrimaryEvidence,
            used_alternative: f.alternativeEvidenceAccepted,
            strictness: 'standard',
            guidance: f.guidance,
          })),
          verification_authorities: authorities.map(a => ({
            authority_name: a.authorityName,
            verification_method: a.verificationMethod,
            api_available: a.apiAvailable,
            response_sla_days: a.responseSlaDays,
          })),
          external_verification_requests: familyVerificationRequests.map(vr => ({
            request_id: vr.requestId,
            status: vr.status,
            request_type: vr.requestType,
            authority_name: vr.authorityName,
            consent_status: vr.consentStatus,
            protection_review_status: vr.protectionReviewStatus,
            dispatched_at: vr.dispatchedAt || '',
            outcome_summary: vr.outcomeSummary || '',
          })),
          evidence_rules_applied: countryRules.length,
          satisfied_claims: localRuleFindings.filter(f => f.isSatisfied && !f.alternativeEvidenceAccepted).length,
          partial_claims: localRuleFindings.filter(f => f.isSatisfied && f.alternativeEvidenceAccepted).length,
          missing_claims: localRuleFindings.filter(f => !f.isSatisfied).length,
          unable_to_verify_claims: 0,
          external_verification_available: authorities.some(a => a.verificationMethod !== 'REFERENCE_ONLY'),
          external_verification_pending: familyVerificationRequests.some(vr => ['dispatched', 'in_progress', 'pending_dispatch'].includes(vr.status)),
          external_verification_completed: familyVerificationRequests.some(vr => ['verified', 'inconclusive', 'discrepancy_flagged'].includes(vr.status)),
        };

        response.country_evidence_compliance = localCompliance;
      }

      setAiSummary(response);
      if (!response.success && response.message) {
        setAiSummaryError(response.message);
      }
      // Auto-switch to the Family Verification Agent tab so results are visible
      setWorkspaceTab('verification_agent');
      // Scroll to result panel after brief delay (let DOM update)
      setTimeout(() => {
        aiResultPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err: any) {
      setAiSummaryError(err?.message || 'Failed to generate AI verification summary.');
      // Still switch tab so error is visible
      setWorkspaceTab('verification_agent');
      setTimeout(() => {
        aiResultPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } finally {
      setIsLoadingAiSummary(false);
    }
  };

  const handleApproveApplication = () => {
    if (!activeFamily) return;
    if (activeDoc) {
      updateVerificationStatus(activeFamily.applicationId, activeDoc.id, 'Verified');
    }
    approveEntireApplication(activeFamily.applicationId);
    alert(`Application for ${activeFamily.headOfFamily?.firstName} ${activeFamily.headOfFamily?.lastName} has been Approved and Verified! Official ID issued.`);
  };

  const handleConfirmReject = () => {
    if (!activeFamily) return;
    if (activeDoc) {
      updateVerificationStatus(activeFamily.applicationId, activeDoc.id, 'Rejected', rejectReason);
    }
    rejectApplication(activeFamily.applicationId, rejectReason);
    setShowRejectModal(false);
    alert(`Application has been rejected. Notification email sent to applicant.`);
  };

  const handleSendDocRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFamily) return;
    setIsSendingRequest(true);
    try {
      const res = await snRequestAdditionalDocuments(
        activeFamily.applicationId,
        requestedDocType,
        requestNotes
      );
      if (res.success) {
        setRequestSuccessMsg(`Document request email sent to ${activeFamily.headOfFamily?.email || 'applicant'}!`);
        setTimeout(() => {
          setShowRequestDocModal(false);
          setRequestSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      console.warn('Error requesting docs:', err);
    } finally {
      setIsSendingRequest(false);
    }
  };

  const handleSaveOfficerNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerNote.trim() || !activeFamily) return;
    addFamilyNote(activeFamily.id, officerNote);
    setOfficerNoteSaved(true);
    setTimeout(() => {
      setOfficerNote('');
      setOfficerNoteSaved(false);
    }, 2000);
  };

  // =========================================================================
  // VIEW 1: QUEUE LIST OF REGISTERED APPLICANTS & FAMILIES
  // =========================================================================
  if (navLevel === 'queue') {
    return (
      <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
              Documents &amp; Verification Queue
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>
              Select any registered applicant to review their real uploaded identity documents and approve their application.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <span className="badge badge-indigo" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} /> Total Registered: {families.length}
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ color: '#94A3B8' }} />
            <input
              className="input-field"
              placeholder="Search by Applicant Name, ID, or Country..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select className="input-field" value={filterCountry} onChange={e => setFilterCountry(e.target.value)} style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
              <option value="All">All Countries</option>
              <option value="Syria">Syria</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Ukraine">Ukraine</option>
              <option value="Sudan">Sudan</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
            </select>

            <select className="input-field" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Queue Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '20px' }}>
          {filteredFamilies.map(fam => {
            const stats = getFamilyStats(fam);
            const headName = `${fam.headOfFamily?.firstName || ''} ${fam.headOfFamily?.lastName || ''}`.trim() || fam.familyName;
            const isApproved = fam.registrationStatus?.toLowerCase() === 'approved' || fam.verificationStatus?.toLowerCase() === 'verified';

            return (
              <div
                key={fam.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                        {headName.toUpperCase()}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: 700, marginTop: '2px' }}>
                        App ID: {fam.applicationId}
                      </div>
                    </div>
                    <span className={`badge ${isApproved ? 'badge-high' : 'badge-medium'}`}>
                      {isApproved ? 'Approved' : fam.registrationStatus}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', margin: '14px 0', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <span style={{ color: '#64748B' }}>Country: </span>
                      <strong style={{ color: '#0F172A' }}>{fam.countryOfOrigin}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Household: </span>
                      <strong style={{ color: '#0F172A' }}>{stats.totalMembers} Member(s)</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Phone: </span>
                      <strong style={{ color: '#0F172A' }}>{fam.headOfFamily?.mobileNumber || '—'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Email: </span>
                      <strong style={{ color: '#0F172A' }}>{fam.headOfFamily?.email || '—'}</strong>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ color: '#64748B' }}>Uploaded Documents: </span>
                      <strong style={{ color: '#2563EB' }}>{stats.docCount} Document(s) On File</strong>
                    </div>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '10px' }}
                  onClick={() => handleOpenWorkspace(fam.id)}
                >
                  <Eye size={16} /> Review Uploaded Documents
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: APPLICATION VERIFICATION WORKSPACE (REAL UPLOADED DOCUMENTS)
  // =========================================================================
  const head = activeFamily.headOfFamily || ({} as any);
  const fullName = `${head.firstName || ''} ${head.middleName ? head.middleName + ' ' : ''}${head.lastName || ''}`.trim() || activeFamily.familyName;
  const isApproved = activeFamily.registrationStatus?.toLowerCase() === 'approved' || activeFamily.verificationStatus?.toLowerCase() === 'verified';

  return (
    <div style={{ maxWidth: '1500px', margin: '20px auto', padding: '0 24px' }}>
      {/* Top Breadcrumb & Return to Queue */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#64748B' }}>
          <button
            onClick={() => setNavLevel('queue')}
            style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
          >
            <ArrowLeft size={16} /> Back to Verification Queue
          </button>
          <span>/</span>
          <span>Verification</span>
          <span>/</span>
          <strong style={{ color: '#0F172A' }}>{fullName}</strong>
        </div>

        <button
          className="btn-secondary"
          style={{ fontSize: '0.82rem' }}
          onClick={() => {
            setSelectedFamilyId(activeFamily.id);
            setAdminView('family360');
          }}
        >
          <ExternalLink size={14} /> Open Full Family 360 Record
        </button>
      </div>

      {/* Top Decision Bar */}
      <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0F172A' }}>
            {fullName.toUpperCase()}
          </div>
          <span className={`badge ${isApproved ? 'badge-high' : 'badge-medium'}`}>
            Status: {isApproved ? 'Approved & Verified' : activeFamily.registrationStatus}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Feature 2: Run AI Verification Button */}
          <button
            id="btn-run-ai-verification-top"
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              borderColor: '#6366F1',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.35)',
            }}
            onClick={handleGenerateAiSummary}
            disabled={isLoadingAiSummary}
          >
            <Sparkles size={16} className={isLoadingAiSummary ? 'animate-spin' : ''} />
            {isLoadingAiSummary ? 'Running AI Verification...' : 'Run AI Verification'}
          </button>

          {/* Officer Decision Actions (Hidden when application is already Approved & Verified) */}
          {!isApproved ? (
            <>
              <button
                className="btn-primary"
                style={{ background: '#16A34A', borderColor: '#16A34A', fontSize: '0.85rem' }}
                onClick={handleApproveApplication}
              >
                <Check size={16} /> Approve &amp; Verify Application
              </button>
              <button
                className="btn-secondary"
                style={{ color: '#9333EA', borderColor: '#E9D5FF', background: '#FAF5FF', fontSize: '0.85rem' }}
                onClick={() => setShowRequestDocModal(true)}
              >
                <Mail size={15} /> Request Additional Document
              </button>
              <button
                className="btn-secondary"
                style={{ color: '#DC2626', borderColor: '#FECACA', background: '#FEF2F2', fontSize: '0.85rem' }}
                onClick={() => setShowRejectModal(true)}
              >
                <X size={15} /> Reject Application
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#065F46',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle size={16} style={{ color: '#10B981' }} />
                <span>Officially Approved &amp; Verified</span>
              </div>
              <button
                className="btn-secondary"
                style={{ color: '#9333EA', borderColor: '#E9D5FF', background: '#FAF5FF', fontSize: '0.82rem' }}
                onClick={() => setShowRequestDocModal(true)}
              >
                <Mail size={14} /> Request Document Correction
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Subtab Navigation: Workspace vs Family Verification Agent (Feature #3) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setWorkspaceTab('officer_workspace')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: workspaceTab === 'officer_workspace' ? '#2563EB' : '#E2E8F0',
            background: workspaceTab === 'officer_workspace' ? '#2563EB' : '#FFFFFF',
            color: workspaceTab === 'officer_workspace' ? '#FFFFFF' : '#475569',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
            boxShadow: workspaceTab === 'officer_workspace' ? '0 2px 6px rgba(37, 99, 235, 0.25)' : '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <FileText size={16} /> Officer Workspace &amp; Document Review
        </button>
        <button
          onClick={() => setWorkspaceTab('verification_agent')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: workspaceTab === 'verification_agent' ? '#7C3AED' : '#E2E8F0',
            background: workspaceTab === 'verification_agent' ? 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)' : '#FFFFFF',
            color: workspaceTab === 'verification_agent' ? '#FFFFFF' : '#475569',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
            boxShadow: workspaceTab === 'verification_agent' ? '0 2px 8px rgba(124, 58, 237, 0.3)' : '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <BrainCircuit size={16} /> Family Verification Agent <span style={{ background: workspaceTab === 'verification_agent' ? 'rgba(255,255,255,0.2)' : '#F5F3FF', color: workspaceTab === 'verification_agent' ? '#FFFFFF' : '#7C3AED', fontSize: '0.70rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>Feature #3</span>
        </button>
      </div>

      {/* VIEW A: FEATURE #3 VERIFICATION AGENT PANEL */}
      {workspaceTab === 'verification_agent' && (
        <div ref={aiResultPanelRef}>
          <VerificationAgentPanel
            family={activeFamily}
            documents={familyDocs}
            onApplyOfficerNote={(note) => {
              setOfficerNote(note);
              setWorkspaceTab('officer_workspace');
            }}
            onRequestDocuments={(docType, notes) => {
              setRequestedDocType(docType);
              setRequestNotes(notes);
              setShowRequestDocModal(true);
            }}
            onApproveApplication={handleApproveApplication}
          />
        </div>
      )}

      {/* VIEW B: OFFICER WORKSPACE & DOCUMENT VIEWER */}
      {workspaceTab === 'officer_workspace' && (
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* LEFT COLUMN: REAL UPLOADED DOCUMENT VIEWER & FILE PREVIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Real Uploaded Document Preview */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} style={{ color: '#2563EB' }} /> Uploaded Identification Documents ({familyDocs.length})
              </h3>

              {/* Document Selector Pills */}
              {familyDocs.length > 1 && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  {familyDocs.map(doc => (
                    <button
                      key={doc.id}
                      className={activeDoc?.id === doc.id ? 'btn-primary' : 'btn-secondary'}
                      style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                      onClick={() => setSelectedDocId(doc.id)}
                    >
                      {doc.fileName || doc.documentType}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Document Details Banner */}
            {activeDoc ? (
              <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.82rem' }}>
                <div>
                  <strong style={{ color: '#0F172A' }}>{activeDoc.fileName}</strong>
                  <span style={{ color: '#64748B', marginLeft: '8px' }}>({activeDoc.fileSize} • Uploaded {activeDoc.uploadedAt})</span>
                </div>
                <span className={`badge ${activeDoc.verificationStatus === 'Verified' ? 'badge-high' : 'badge-medium'}`}>
                  {activeDoc.verificationStatus}
                </span>
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px', marginBottom: '14px' }}>
                No separate document files uploaded. Details extracted from initial intake registration.
              </div>
            )}

            {/* Viewer Controls */}
            <div style={{ background: '#F1F5F9', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setZoomLevel(prev => Math.min(prev + 20, 200))}>
                  <ZoomIn size={14} /> Zoom In
                </button>
                <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setZoomLevel(prev => Math.max(prev - 20, 60))}>
                  <ZoomOut size={14} /> Zoom Out
                </button>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>{zoomLevel}%</span>
                <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setRotation(prev => (prev + 90) % 360)}>
                  <RotateCw size={14} /> Rotate
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setIsFullScreen(!isFullScreen)}>
                  <Maximize2 size={14} /> {isFullScreen ? 'Exit' : 'Full Screen'}
                </button>
              </div>
            </div>

            {/* Document Content Canvas (Displays the REAL uploaded document image/file) */}
            <div
              style={isFullScreen ? {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 999999,
                background: '#0F172A',
                padding: '30px',
                overflowY: 'auto'
              } : {
                background: '#0F172A',
                borderRadius: '10px',
                padding: '20px',
                minHeight: '420px',
                overflowY: 'auto',
                maxHeight: '580px',
                border: '1px solid #334155'
              }}
            >
              {isFullScreen && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <button
                    className="btn-secondary"
                    style={{ background: '#1E293B', color: '#FFFFFF', borderColor: '#475569', padding: '6px 16px', fontWeight: 700 }}
                    onClick={() => setIsFullScreen(false)}
                  >
                    <Maximize2 size={16} /> Exit Full Screen
                  </button>
                </div>
              )}
              <div style={{ transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`, transformOrigin: 'top center', transition: 'transform 0.2s ease', background: '#FFFFFF', borderRadius: '8px', padding: '20px', color: '#0F172A', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', fontFamily: 'sans-serif' }}>
                
                {/* Header with Document Metadata */}
                <div style={{ borderBottom: '2px solid #2563EB', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>{fullName}</div>
                    <div style={{ fontSize: '0.82rem', color: '#64748B' }}>{head.email || 'Email on file'} • {head.mobileNumber || 'Phone on file'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {activeDoc?.documentType || 'Uploaded Document'}
                    </span>
                    <span className={`badge ${activeDoc?.verificationStatus === 'Verified' ? 'badge-high' : 'badge-medium'}`} style={{ fontSize: '0.72rem' }}>
                      {activeDoc?.verificationStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* REAL UPLOADED DOCUMENT DISPLAY */}
                {(() => {
                  const docImage = activeDoc?.fileDataUrl || 
                                   activeDoc?.previewUrl || 
                                   (activeDoc ? localStorage.getItem(`bridge360_doc_preview_${activeDoc.id}`) : null) || 
                                   (activeDoc ? localStorage.getItem(`bridge360_doc_preview_${activeDoc.applicationId}`) : null) ||
                                   (activeDoc ? localStorage.getItem(`bridge360_doc_preview_${activeDoc.applicationId}_${activeDoc.fileName}`) : null) ||
                                   localStorage.getItem('bridge360_latest_uploaded_doc');

                  if (docImage && (docImage.startsWith('data:image') || docImage.startsWith('blob:') || docImage.startsWith('http'))) {
                    return (
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <img
                          src={docImage}
                          alt={activeDoc?.fileName || 'Uploaded Identity Document'}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '440px',
                            objectFit: 'contain',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            display: 'block',
                            margin: '0 auto',
                          }}
                        />
                      </div>
                    );
                  }

                  if (docImage) {
                    return (
                      <div style={{ marginBottom: '16px', background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <iframe
                          src={docImage}
                          title={activeDoc?.fileName || 'Uploaded Document'}
                          style={{ width: '100%', height: '420px', border: 'none', borderRadius: '6px' }}
                        />
                      </div>
                    );
                  }

                  // High-fidelity Official Identity Document Card representation if raw binary is not cached
                  return (
                    <div style={{ background: '#F8FAFC', border: '2px dashed #CBD5E1', borderRadius: '8px', padding: '20px', marginBottom: '16px', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Official Identity Document Scan • {activeDoc?.documentType || 'Passport'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>File: {activeDoc?.fileName} ({activeDoc?.fileSize})</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', background: '#FFFFFF', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <div style={{ width: '100%', height: '130px', background: '#EFF6FF', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#2563EB', border: '1px solid #BFDBFE' }}>
                          <User size={48} />
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, marginTop: '4px' }}>OFFICIAL PHOTO</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                          <div><strong style={{ color: '#64748B' }}>Full Name:</strong> <span style={{ fontWeight: 800, color: '#0F172A' }}>{fullName}</span></div>
                          <div><strong style={{ color: '#64748B' }}>Document Number:</strong> <span style={{ fontWeight: 700, color: '#2563EB', fontFamily: 'monospace' }}>{head.passportNumber || head.nationalId || 'N/A'}</span></div>
                          <div><strong style={{ color: '#64748B' }}>Nationality:</strong> <span style={{ fontWeight: 700 }}>{head.nationality || activeFamily.countryOfOrigin}</span></div>
                          <div><strong style={{ color: '#64748B' }}>Date of Birth:</strong> <span>{head.dateOfBirth}</span> • <strong style={{ color: '#64748B' }}>Gender:</strong> <span>{head.gender}</span></div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Actual Extracted Document Text / OCR Output */}
                {activeDoc?.ocrRawText && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Raw Text Extracted from Document:
                    </div>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.82rem', lineHeight: 1.5, color: '#334155', fontFamily: 'monospace', background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0', maxHeight: '160px', overflowY: 'auto' }}>
                      {activeDoc.ocrRawText}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Officer Notes Area */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
              Officer Verification Notes
            </h3>

            <form onSubmit={handleSaveOfficerNote}>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Enter verification notes, remarks, or interview notes..."
                value={officerNote}
                onChange={e => setOfficerNote(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                {officerNoteSaved && <span style={{ color: '#16A34A', fontSize: '0.82rem', fontWeight: 700 }}>✓ Note saved successfully!</span>}
                <button type="submit" className="btn-primary" style={{ marginLeft: 'auto', fontSize: '0.82rem', padding: '6px 14px' }}>
                  <Save size={14} /> Save Note
                </button>
              </div>
            </form>
          </div>

          {/* COUNTRY EVIDENCE INTELLIGENCE & EXTERNAL VERIFICATION (SUPPORTING FOUNDATION) */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Country Evidence Intelligence
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    {countryInfo ? `${countryInfo.countryName} (${countryInfo.iso2}/${countryInfo.iso3}) • ${countryInfo.officialLanguages}` : activeFamily.countryOfOrigin}
                  </div>
                </div>
              </div>

              <button
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderColor: '#2563EB', color: '#2563EB' }}
                onClick={handleOpenExternalVerifyModal}
              >
                <Send size={13} /> Initiate External Verification
              </button>
            </div>

            {/* Factual Reference Overview */}
            {countryInfo && (
              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#334155', marginBottom: '14px', lineHeight: 1.5 }}>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <div><strong>Naming Pattern:</strong> <span style={{ textTransform: 'capitalize' }}>{countryInfo.namingConvention.replace(/_/g, ' ')}</span></div>
                  <div><strong>Scripts:</strong> {countryInfo.scriptsUsed}</div>
                </div>
                {countryInfo.civilRegistryInfo && (
                  <div style={{ color: '#64748B', fontSize: '0.76rem', borderTop: '1px solid #E2E8F0', paddingTop: '6px', marginTop: '6px' }}>
                    <strong>Registry Structure:</strong> {countryInfo.civilRegistryInfo}
                  </div>
                )}
              </div>
            )}

            {/* Relationship Evidence Compliance Matrix */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Family Relationship &amp; Identity Evidence Status:
              </div>

              {relationshipFindings.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
                  No country-specific evidence rules loaded for this jurisdiction. Standard review applies.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {relationshipFindings.map((finding, fidx) => (
                    <div
                      key={fidx}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${finding.isSatisfied ? '#BBF7D0' : '#FECACA'}`,
                        background: finding.isSatisfied ? '#F0FDF4' : '#FEF2F2',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        fontSize: '0.82rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: finding.isSatisfied ? '#166534' : '#991B1B' }}>
                          {finding.relationshipDescription}
                        </strong>
                        <span className={`badge ${finding.isSatisfied ? 'badge-high' : 'badge-medium'}`}>
                          {finding.isSatisfied ? '✓ Evidence Satisfied' : 'Pending / Missing Document'}
                        </span>
                      </div>
                      {finding.isSatisfied && finding.satisfyingDocuments.length > 0 && (
                        <div style={{ fontSize: '0.75rem', color: '#15803D' }}>
                          Satisfied by: {finding.satisfyingDocuments.join(', ')} {finding.alternativeEvidenceAccepted && '(Alternative Accepted)'}
                        </div>
                      )}
                      {!finding.isSatisfied && finding.missingPrimaryEvidence.length > 0 && (
                        <div style={{ fontSize: '0.75rem', color: '#B91C1C' }}>
                          Expected primary: {finding.missingPrimaryEvidence.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active External Verification Requests */}
            {familyVerificationRequests.length > 0 && (
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Logged Verification Inquiries ({familyVerificationRequests.length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {familyVerificationRequests.map(vReq => (
                    <div key={vReq.id} style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <div>
                        <strong style={{ color: '#2563EB' }}>{vReq.requestId}</strong>: {vReq.authorityName} ({vReq.memberName})
                      </div>
                      <span className={`badge ${vReq.status === 'verified' ? 'badge-high' : vReq.status === 'dispatched' ? 'badge-indigo' : 'badge-medium'}`}>
                        {vReq.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REAL APPLICANT INFORMATION & EXTRACTED ATTRIBUTES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Applicant Master Information */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} style={{ color: '#2563EB' }} /> Applicant Profile Information
              </h3>
              <span className="badge badge-indigo">Primary Applicant</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.88rem' }}>
              <div>
                <div style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 600 }}>Full Name</div>
                <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{fullName}</div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 600 }}>Application ID</div>
                <div style={{ fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>{activeFamily.applicationId}</div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 600 }}>Refugee ID (RID)</div>
                <div style={{ fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>
                  {activeFamily.bridge360Id || head.refugeeId || 'Issued upon verification'}
                </div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 600 }}>Country of Origin</div>
                <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{activeFamily.countryOfOrigin}</div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 600 }}>Phone Number</div>
                <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{head.mobileNumber || '—'}</div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 600 }}>Email Address</div>
                <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{head.email || '—'}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 600 }}>Residential Address</div>
                <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {head.address || 'Address provided on file'}{head.city ? `, ${head.city}` : ''}{head.postalCode ? ` - ${head.postalCode}` : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Details Breakdown */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
              Extracted Identity Attributes
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748B' }}>Applicant Name:</span>
                <strong style={{ color: '#0F172A' }}>{fullName}</strong>
              </div>
              {head.email && (
                <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748B' }}>Email:</span>
                  <strong style={{ color: '#0F172A' }}>{head.email}</strong>
                </div>
              )}
              {head.mobileNumber && (
                <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748B' }}>Phone:</span>
                  <strong style={{ color: '#0F172A' }}>{head.mobileNumber}</strong>
                </div>
              )}
              {head.address && (
                <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748B' }}>Address:</span>
                  <strong style={{ color: '#0F172A' }}>{head.address}</strong>
                </div>
              )}
              <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748B' }}>Country of Origin:</span>
                <strong style={{ color: '#0F172A' }}>{activeFamily.countryOfOrigin}</strong>
              </div>
            </div>
          </div>

          {/* AI VERIFICATION SUMMARY CARD (REUSABLE GENERATIVE AI CAPABILITY) */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      AI Verification Summary
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span>Generative AI Verification Intelligence</span>
                      <span>•</span>
                      <span style={{ color: '#2563EB', fontWeight: 600 }}>Advisory Only</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                id="btn-run-ai-verification-card"
                className="btn-primary"
                style={{
                  fontSize: '0.82rem',
                  padding: '7px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                  borderColor: '#6366F1',
                }}
                onClick={handleGenerateAiSummary}
                disabled={isLoadingAiSummary}
              >
                <Sparkles size={14} className={isLoadingAiSummary ? 'animate-spin' : ''} />
                {isLoadingAiSummary ? 'Running AI Verification...' : aiSummary ? 'Re-run AI Verification' : 'Run AI Verification'}
              </button>
            </div>

            {/* ERROR STATE */}
            {aiSummaryError && (
              <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#DC2626', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <div>
                  <strong>AI Analysis Notice:</strong> {aiSummaryError}
                </div>
              </div>
            )}

            {/* LOADING STATE */}
            {isLoadingAiSummary && (
              <div style={{ padding: '36px 20px', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', border: '1px dashed #CBD5E1', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #E2E8F0', borderTopColor: '#2563EB', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>
                  Evaluating Document Evidence &amp; Running Deterministic Comparison...
                </div>
                <div style={{ color: '#64748B', fontSize: '0.80rem', marginTop: '4px' }}>
                  Comparing intake registration with extracted OCR attributes &amp; generating advisory assessment.
                </div>
              </div>
            )}

            {/* UNGENERATED PLACEHOLDER */}
            {!aiSummary && !isLoadingAiSummary && (
              <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '10px', border: '1px dashed #CBD5E1', textAlign: 'center' }}>
                <Cpu size={32} style={{ color: '#94A3B8', margin: '0 auto 10px', display: 'block' }} />
                <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.90rem', marginBottom: '6px' }}>
                  AI Verification Summary Not Yet Generated
                </div>
                <p style={{ color: '#64748B', fontSize: '0.82rem', maxWidth: '440px', margin: '0 auto 14px', lineHeight: 1.5 }}>
                  Click <strong>Run AI Verification</strong> to execute the deterministic discrepancy engine and generative AI verifier across all uploaded documents.
                </p>
                <button
                  id="btn-run-ai-verification-placeholder"
                  className="btn-primary"
                  style={{
                    fontSize: '0.84rem',
                    padding: '8px 18px',
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                    borderColor: '#6366F1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onClick={handleGenerateAiSummary}
                >
                  <Sparkles size={15} /> Run AI Verification
                </button>
              </div>
            )}

            {/* GENERATED AI SUMMARY CONTENT */}
            {aiSummary && !isLoadingAiSummary && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 1. Status & Confidence Banner */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Verification Risk / Review Indicator
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          background:
                            aiSummary.overall_status === 'LOW' ? '#DCFCE7' :
                            aiSummary.overall_status === 'MEDIUM' ? '#FEF3C7' :
                            aiSummary.overall_status === 'HIGH' ? '#FEE2E2' :
                            aiSummary.overall_status === 'ELEVATED' ? '#FFEDD5' : '#F3E8FF',
                          color:
                            aiSummary.overall_status === 'LOW' ? '#166534' :
                            aiSummary.overall_status === 'MEDIUM' ? '#92400E' :
                            aiSummary.overall_status === 'HIGH' ? '#991B1B' :
                            aiSummary.overall_status === 'ELEVATED' ? '#9A3412' : '#6B21A8',
                        }}
                      >
                        {aiSummary.overall_status === 'LOW' && <CheckCircle2 size={14} />}
                        {aiSummary.overall_status === 'MEDIUM' && <AlertTriangle size={14} />}
                        {aiSummary.overall_status === 'HIGH' && <ShieldAlert size={14} />}
                        {aiSummary.overall_status || 'LOW'} RISK
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Overall Evidence Confidence
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                      <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${aiSummary.summary_stats?.overall_confidence || 0}%`,
                            height: '100%',
                            background:
                              (aiSummary.summary_stats?.overall_confidence || 0) >= 80 ? '#16A34A' :
                              (aiSummary.summary_stats?.overall_confidence || 0) >= 60 ? '#D97706' : '#DC2626',
                            borderRadius: '4px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>
                        {aiSummary.summary_stats?.overall_confidence || 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Summary Statistics Metrics Bar */}
                {aiSummary.summary_stats && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    <div style={{ background: '#F8FAFC', padding: '10px 8px', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                        {aiSummary.summary_stats.documents_analyzed}
                      </div>
                      <div style={{ fontSize: '0.70rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                        Docs Analyzed
                      </div>
                    </div>

                    <div style={{ background: '#F0FDF4', padding: '10px 8px', borderRadius: '8px', border: '1px solid #DCFCE7', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16A34A' }}>
                        {aiSummary.summary_stats.fields_matched}
                      </div>
                      <div style={{ fontSize: '0.70rem', color: '#166534', fontWeight: 600, marginTop: '2px' }}>
                        Matched
                      </div>
                    </div>

                    <div style={{ background: '#FFFBEB', padding: '10px 8px', borderRadius: '8px', border: '1px solid #FEF3C7', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#D97706' }}>
                        {aiSummary.summary_stats.possible_variations}
                      </div>
                      <div style={{ fontSize: '0.70rem', color: '#92400E', fontWeight: 600, marginTop: '2px' }}>
                        Variations
                      </div>
                    </div>

                    <div style={{ background: '#FEF2F2', padding: '10px 8px', borderRadius: '8px', border: '1px solid #FEE2E2', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#DC2626' }}>
                        {aiSummary.summary_stats.mismatches}
                      </div>
                      <div style={{ fontSize: '0.70rem', color: '#991B1B', fontWeight: 600, marginTop: '2px' }}>
                        Mismatches
                      </div>
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '10px 8px', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#64748B' }}>
                        {aiSummary.summary_stats.missing_evidence}
                      </div>
                      <div style={{ fontSize: '0.70rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                        Missing/Unavail
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. AI Generated Assessment & Narrative */}
                {aiSummary.ai_explanation ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Overall Assessment */}
                    <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.80rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Sparkles size={14} style={{ color: '#2563EB' }} /> Overall Assessment
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.55, margin: 0 }}>
                        {aiSummary.ai_explanation.overall_assessment || aiSummary.ai_explanation.summary}
                      </p>
                    </div>

                    {/* Identity Consistency & Document Evidence */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Identity Consistency
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                          {aiSummary.ai_explanation.identity_consistency || 'Identity attributes verified across submitted documentation.'}
                        </p>
                      </div>

                      <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Document Evidence
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                          {aiSummary.ai_explanation.document_evidence || 'Official identification documents evaluated.'}
                        </p>
                      </div>
                    </div>

                    {/* Family / Relationship Evidence (if present) */}
                    {aiSummary.ai_explanation.family_relationship_evidence && (
                      <div style={{ background: '#F0FDF4', padding: '12px 14px', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Family &amp; Relationship Evidence
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.5, margin: 0 }}>
                          {aiSummary.ai_explanation.family_relationship_evidence}
                        </p>
                      </div>
                    )}

                    {/* Missing / Alternative Evidence (if present) */}
                    {aiSummary.ai_explanation.missing_alternative_evidence && (
                      <div style={{ background: '#FFFBEB', padding: '12px 14px', borderRadius: '8px', border: '1px solid #FEF3C7' }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Missing or Alternative Evidence Note
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#92400E', lineHeight: 1.5, margin: 0 }}>
                          {aiSummary.ai_explanation.missing_alternative_evidence}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Fallback when AI explanation is unavailable but deterministic comparison succeeded */
                  <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.80rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      Deterministic Verification Summary
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.55, margin: 0 }}>
                      {aiSummary.summary_stats?.fields_matched || 0} fields matched exactly across {aiSummary.summary_stats?.documents_analyzed || 0} uploaded document(s).
                      {aiSummary.summary_stats?.possible_variations ? ` ${aiSummary.summary_stats.possible_variations} possible name/transliteration variation(s) detected.` : ''}
                      {aiSummary.summary_stats?.mismatches ? ` ${aiSummary.summary_stats.mismatches} mismatch(es) require human verification.` : ''}
                    </p>
                  </div>
                )}

                {/* ─── PHASE 2: COUNTRY EVIDENCE CONTEXT ──────────────────────── */}
                {aiSummary.country_evidence_compliance?.country && (() => {
                  const ce = aiSummary.country_evidence_compliance!;
                  const country = ce.country!;
                  return (
                    <div style={{ border: '1px solid #DBEAFE', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ background: '#EFF6FF', padding: '12px 14px', borderBottom: '1px solid #DBEAFE', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={16} style={{ color: '#2563EB' }} />
                        <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1E40AF' }}>
                          Country Evidence Context — {country.country_name} ({country.iso2}/{country.iso3})
                        </span>
                      </div>
                      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {/* Country Factual Summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
                          <div><strong style={{ color: '#64748B' }}>Nationality:</strong> <span style={{ color: '#0F172A' }}>{country.nationality}</span></div>
                          <div><strong style={{ color: '#64748B' }}>Languages:</strong> <span style={{ color: '#0F172A' }}>{country.official_languages}</span></div>
                          <div><strong style={{ color: '#64748B' }}>Naming Convention:</strong> <span style={{ color: '#0F172A', textTransform: 'capitalize' }}>{country.naming_convention.replace(/_/g, ' ')}</span></div>
                          <div><strong style={{ color: '#64748B' }}>Scripts:</strong> <span style={{ color: '#0F172A' }}>{country.scripts_used}</span></div>
                        </div>

                        {/* Relevant Document Types from Country Catalog */}
                        {ce.relevant_document_types.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                              Country Document Types ({ce.relevant_document_types.length})
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {ce.relevant_document_types.map((dt, dti) => (
                                <span key={dti} style={{
                                  padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600,
                                  background: dt.category === 'identity' ? '#EFF6FF' : dt.category === 'family_relationship' ? '#F0FDF4' : '#F8FAFC',
                                  color: dt.category === 'identity' ? '#1D4ED8' : dt.category === 'family_relationship' ? '#166534' : '#475569',
                                  border: `1px solid ${dt.category === 'identity' ? '#BFDBFE' : dt.category === 'family_relationship' ? '#BBF7D0' : '#E2E8F0'}`
                                }}>
                                  {dt.document_name}{dt.local_name ? ` (${dt.local_name})` : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Detected Documents Cross-Reference */}
                        {ce.detected_documents.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                              Uploaded Documents — Evidence Purpose
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {ce.detected_documents.map((dd, ddi) => (
                                <div key={ddi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.78rem' }}>
                                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{dd.uploaded_document}</span>
                                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.70rem', color: '#64748B' }}>{dd.evidence_purpose}</span>
                                    {dd.matched_country_reference && (
                                      <span style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '0.68rem', fontWeight: 700, background: '#DCFCE7', color: '#166534' }}>
                                        ✓ {dd.matched_country_reference}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* ─── PHASE 2: FAMILY RELATIONSHIP EVIDENCE ──────────────────── */}
                {aiSummary.country_evidence_compliance?.relationship_evidence && aiSummary.country_evidence_compliance.relationship_evidence.length > 0 && (
                  <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ background: '#F0FDF4', padding: '10px 14px', borderBottom: '1px solid #DCFCE7', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Scale size={15} style={{ color: '#16A34A' }} />
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#166534' }}>
                        Family Relationship Evidence Evaluation
                      </span>
                    </div>
                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {aiSummary.country_evidence_compliance.relationship_evidence.map((re, rei) => {
                        const statusColors: Record<string, { bg: string; fg: string; border: string }> = {
                          'SATISFIED': { bg: '#DCFCE7', fg: '#166534', border: '#BBF7D0' },
                          'PARTIAL': { bg: '#FEF3C7', fg: '#92400E', border: '#FDE68A' },
                          'MISSING': { bg: '#FEE2E2', fg: '#991B1B', border: '#FECACA' },
                          'UNABLE_TO_VERIFY': { bg: '#F1F5F9', fg: '#475569', border: '#CBD5E1' },
                        };
                        const sc = statusColors[re.status] || statusColors['UNABLE_TO_VERIFY'];
                        return (
                          <div key={rei} style={{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${sc.border}`, background: sc.bg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.80rem' }}>
                            <div>
                              <strong style={{ color: sc.fg }}>{re.description}</strong>
                              {re.satisfying_documents.length > 0 && (
                                <div style={{ fontSize: '0.72rem', color: sc.fg, opacity: 0.8, marginTop: '2px' }}>
                                  Satisfied by: {re.satisfying_documents.join(', ')}{re.used_alternative ? ' (Alternative)' : ''}
                                </div>
                              )}
                              {re.status === 'MISSING' && re.missing_primary_evidence.length > 0 && (
                                <div style={{ fontSize: '0.72rem', color: sc.fg, opacity: 0.8, marginTop: '2px' }}>
                                  Expected: {re.missing_primary_evidence.join(', ')}
                                </div>
                              )}
                            </div>
                            <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.70rem', fontWeight: 700, background: '#FFFFFF', color: sc.fg, border: `1px solid ${sc.border}` }}>
                              {re.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ─── PHASE 2: EXTERNAL VERIFICATION STATUS ──────────────────── */}
                {aiSummary.country_evidence_compliance && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {/* External Verification Availability */}
                    <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>External Verification</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700,
                          background: aiSummary.country_evidence_compliance.external_verification_completed ? '#DCFCE7' :
                            aiSummary.country_evidence_compliance.external_verification_pending ? '#FEF3C7' :
                            aiSummary.country_evidence_compliance.external_verification_available ? '#EFF6FF' : '#F1F5F9',
                          color: aiSummary.country_evidence_compliance.external_verification_completed ? '#166534' :
                            aiSummary.country_evidence_compliance.external_verification_pending ? '#92400E' :
                            aiSummary.country_evidence_compliance.external_verification_available ? '#1D4ED8' : '#475569',
                        }}>
                          {aiSummary.country_evidence_compliance.external_verification_completed ? '✓ Completed' :
                            aiSummary.country_evidence_compliance.external_verification_pending ? '⏳ Pending' :
                            aiSummary.country_evidence_compliance.external_verification_available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      {aiSummary.country_evidence_compliance.verification_authorities.length > 0 && (
                        <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#64748B' }}>
                          {aiSummary.country_evidence_compliance.verification_authorities.map(a => a.authority_name).join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Evidence Compliance Summary */}
                    <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Evidence Compliance</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#16A34A' }}>{aiSummary.country_evidence_compliance.satisfied_claims}</div>
                          <div style={{ fontSize: '0.66rem', color: '#166534', fontWeight: 600 }}>Satisfied</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#D97706' }}>{aiSummary.country_evidence_compliance.partial_claims}</div>
                          <div style={{ fontSize: '0.66rem', color: '#92400E', fontWeight: 600 }}>Partial</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#DC2626' }}>{aiSummary.country_evidence_compliance.missing_claims}</div>
                          <div style={{ fontSize: '0.66rem', color: '#991B1B', fontWeight: 600 }}>Missing</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#64748B' }}>{aiSummary.country_evidence_compliance.unable_to_verify_claims}</div>
                          <div style={{ fontSize: '0.66rem', color: '#475569', fontWeight: 600 }}>Unable</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Deterministic Field Comparison Table (Collapsible) */}
                {aiSummary.comparison?.field_results && aiSummary.comparison.field_results.length > 0 && (
                  <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setShowComparisonTable(!showComparisonTable)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#F8FAFC',
                        border: 'none',
                        borderBottom: showComparisonTable ? '1px solid #E2E8F0' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        color: '#0F172A',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={14} style={{ color: '#2563EB' }} />
                        Deterministic Field Comparison Matrix ({aiSummary.comparison.field_results.length} fields)
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        {showComparisonTable ? 'Hide Details ▲' : 'Show Details ▼'}
                      </span>
                    </button>

                    {showComparisonTable && (
                      <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                          <thead>
                            <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', color: '#475569', textAlign: 'left' }}>
                              <th style={{ padding: '8px 10px', fontWeight: 700 }}>Field</th>
                              <th style={{ padding: '8px 10px', fontWeight: 700 }}>Registration</th>
                              <th style={{ padding: '8px 10px', fontWeight: 700 }}>Extracted Doc</th>
                              <th style={{ padding: '8px 10px', fontWeight: 700 }}>State</th>
                              <th style={{ padding: '8px 10px', fontWeight: 700 }}>Detail</th>
                            </tr>
                          </thead>
                          <tbody>
                            {aiSummary.comparison.field_results.map((field, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                                <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0F172A' }}>
                                  {field.field_name}
                                </td>
                                <td style={{ padding: '8px 10px', color: '#334155' }}>
                                  {field.registration_value}
                                </td>
                                <td style={{ padding: '8px 10px', color: '#0F172A', fontWeight: 600 }}>
                                  {field.extracted_value}
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.70rem',
                                      fontWeight: 700,
                                      background:
                                        field.state === 'MATCHED' ? '#DCFCE7' :
                                        field.state === 'POSSIBLE_VARIATION' ? '#FEF3C7' :
                                        field.state === 'MISMATCHED' ? '#FEE2E2' :
                                        field.state === 'MISSING' ? '#F1F5F9' : '#F8FAFC',
                                      color:
                                        field.state === 'MATCHED' ? '#166534' :
                                        field.state === 'POSSIBLE_VARIATION' ? '#92400E' :
                                        field.state === 'MISMATCHED' ? '#991B1B' :
                                        field.state === 'MISSING' ? '#475569' : '#64748B',
                                    }}
                                  >
                                    {field.state}
                                  </span>
                                </td>
                                <td style={{ padding: '8px 10px', color: '#64748B', fontSize: '0.74rem' }}>
                                  {field.detail}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Advisory Recommendation Box */}
                <div
                  style={{
                    background:
                      aiSummary.overall_status === 'HIGH' || (aiSummary.summary_stats?.mismatches || 0) > 0 ? '#FEF2F2' :
                      aiSummary.overall_status === 'MEDIUM' || (aiSummary.summary_stats?.possible_variations || 0) > 0 ? '#FFFBEB' : '#F0FDF4',
                    border: `1px solid ${
                      aiSummary.overall_status === 'HIGH' || (aiSummary.summary_stats?.mismatches || 0) > 0 ? '#FECACA' :
                      aiSummary.overall_status === 'MEDIUM' || (aiSummary.summary_stats?.possible_variations || 0) > 0 ? '#FEF3C7' : '#DCFCE7'
                    }`,
                    borderRadius: '10px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <ShieldCheck size={18} style={{ color: aiSummary.overall_status === 'HIGH' ? '#DC2626' : aiSummary.overall_status === 'MEDIUM' ? '#D97706' : '#16A34A' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>
                      AI Advisory Recommendation
                    </span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '0.70rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        color: '#475569',
                      }}
                    >
                      ADVISORY ONLY
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: aiSummary.overall_status === 'HIGH' ? '#991B1B' : aiSummary.overall_status === 'MEDIUM' ? '#92400E' : '#166534', marginBottom: '4px' }}>
                    {aiSummary.ai_explanation?.recommendation ||
                      (aiSummary.overall_status === 'LOW' ? 'Recommend Verification & Approval' : 'Manual Officer Review Recommended')}
                  </div>

                  <p style={{ fontSize: '0.80rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    {aiSummary.ai_explanation?.recommendation_reason ||
                      'Identity attributes match registered data with satisfactory confidence. Final verification decision remains with the authorized officer.'}
                  </p>

                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #CBD5E1', fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Info size={12} /> The authorized human verification officer remains solely responsible for the final decision. AI cannot execute verification actions.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* MODAL 1: REQUEST ADDITIONAL DOCUMENT */}
      {showRequestDocModal && (
        <div className="modal-overlay" onClick={() => setShowRequestDocModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', background: '#FFFFFF', color: '#0F172A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#F5F3FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Request Additional Document</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Sends email notice to <strong>{head.email || fullName}</strong>
                </p>
              </div>
            </div>

            {requestSuccessMsg ? (
              <div style={{ padding: '16px', background: '#DCFCE7', color: '#166534', borderRadius: '8px', fontWeight: 700, textAlign: 'center' }}>
                ✓ {requestSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSendDocRequest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="input-label">Required Document</label>
                  <select className="input-field" value={requestedDocType} onChange={e => setRequestedDocType(e.target.value)}>
                    <option value="National ID Card">National ID Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Proof of Address">Proof of Address / Lease Agreement</option>
                    <option value="Birth Certificate">Birth Certificate</option>
                    <option value="Marriage Certificate">Marriage Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Instructions for Applicant</label>
                  <textarea className="input-field" rows={3} value={requestNotes} onChange={e => setRequestNotes(e.target.value)} required />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowRequestDocModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={isSendingRequest}>
                    <Send size={14} /> {isSendingRequest ? 'Sending...' : 'Send Request Email'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: REJECT APPLICATION */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', background: '#FFFFFF', color: '#0F172A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <XCircle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Reject Application</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Applicant will receive rejection email with correction instructions.</p>
              </div>
            </div>

            <div>
              <label className="input-label">Reason for Rejection *</label>
              <textarea className="input-field" rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button type="button" className="btn-secondary" style={{ color: '#DC2626', borderColor: '#FECACA' }} onClick={handleConfirmReject}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 3: INITIATE EXTERNAL VERIFICATION (PROTECTION CONTROLLED) */}
      {showExternalVerifyModal && (
        <div className="modal-overlay" onClick={() => setShowExternalVerifyModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', background: '#FFFFFF', color: '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>Initiate External Verification</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Controlled bilateral inquiry for {activeFamily.familyName} ({activeFamily.applicationId})</p>
                </div>
              </div>
              <button onClick={() => setShowExternalVerifyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            {verifySuccessMsg ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#16A34A' }}>
                <CheckCircle size={36} style={{ margin: '0 auto 10px' }} />
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{verifySuccessMsg}</div>
              </div>
            ) : (
              <form onSubmit={handleCreateExternalVerification} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {verifyErrorMsg && (
                  <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', color: '#DC2626', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={15} />
                    <span>{verifyErrorMsg}</span>
                  </div>
                )}

                {/* Refugee Protection Warning Banner */}
                <div style={{ padding: '12px 14px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', color: '#92400E', fontSize: '0.78rem', lineHeight: 1.5 }}>
                  <strong>Refugee Protection Protocol:</strong> External contact with origin state authorities is strictly prohibited without formal protection clearance to prevent risk of refoulement.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="input-label">Target Applicant Member</label>
                    <select
                      className="input-field"
                      value={verifyTargetMemberId}
                      onChange={e => setVerifyTargetMemberId(e.target.value)}
                    >
                      <option value={activeFamily.headOfFamily?.id || 'MEM-HEAD'}>
                        {activeFamily.headOfFamily?.firstName} {activeFamily.headOfFamily?.lastName} (Head)
                      </option>
                      {(activeFamily.members || []).map(m => (
                        <option key={m.id} value={m.id}>
                          {m.firstName} {m.lastName} ({m.relationshipToHead})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Target Document Under Query</label>
                    <select
                      className="input-field"
                      value={verifyTargetDocId}
                      onChange={e => setVerifyTargetDocId(e.target.value)}
                    >
                      {familyDocs.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.documentType} ({d.fileName})
                        </option>
                      ))}
                      <option value="">General Household Manifest</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="input-label">Verification Authority / Channel</label>
                    <select
                      className="input-field"
                      value={verifyAuthorityId}
                      onChange={e => setVerifyAuthorityId(e.target.value)}
                      required
                    >
                      {authorities.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.authorityName} [{a.verificationMethod}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Inquiry Purpose</label>
                    <select
                      className="input-field"
                      value={verifyRequestType}
                      onChange={e => setVerifyRequestType(e.target.value as any)}
                    >
                      <option value="unhcr_crosscheck">UNHCR Refugee Registry Cross-Check</option>
                      <option value="document_authenticity">Document Forensic Authenticity Check</option>
                      <option value="civil_status_lookup">Civil Status Record Verification</option>
                      <option value="consular_query">Consular Identity Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="input-label">Officer Justification &amp; Notes</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    value={verifyNotes}
                    onChange={e => setVerifyNotes(e.target.value)}
                  />
                </div>

                {/* Mandatory Checkboxes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#0F172A', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={verifyConsentGranted}
                      onChange={e => setVerifyConsentGranted(e.target.checked)}
                    />
                    <span><strong>Applicant Consent Granted:</strong> Applicant has formally consented to bilateral verification.</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#0F172A', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={verifyProtectionCleared}
                      onChange={e => setVerifyProtectionCleared(e.target.checked)}
                    />
                    <span><strong>Protection Review Cleared:</strong> Inquiry channel poses no security risk to applicant or family.</span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowExternalVerifyModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={isSubmittingVerifyReq}>
                    <Send size={14} /> {isSubmittingVerifyReq ? 'Dispatching...' : 'Dispatch Verification Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationView;
