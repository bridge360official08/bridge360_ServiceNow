/**
 * Evidence Foundation Service
 * 
 * Client service for Country Evidence Intelligence, Reference Document Catalogs,
 * Evidence Satisfaction Rules, and Protection-Controlled Verification Requests.
 * 
 * Reusable by Admin Portal and Verification Workspace.
 */

import {
  CountryRecord,
  CountryDocumentRecord,
  CountryDocumentFieldRecord,
  EvidenceRuleRecord,
  VerificationAuthorityRecord,
  VerificationRequestRecord,
  DocumentRecord,
  FamilyMember
} from '../types/bridge360';

import {
  INITIAL_COUNTRIES,
  INITIAL_COUNTRY_DOCUMENTS,
  INITIAL_EVIDENCE_RULES,
  INITIAL_VERIFICATION_AUTHORITIES,
  INITIAL_VERIFICATION_REQUESTS
} from '../store/evidenceReferenceData';

import { snGetTableRecords, snInsertTableRecord, snUpdateTableRecord } from './snApi';

export class EvidenceFoundationService {
  private localCountries: CountryRecord[] = [...INITIAL_COUNTRIES];
  private localDocuments: CountryDocumentRecord[] = [...INITIAL_COUNTRY_DOCUMENTS];
  private localRules: EvidenceRuleRecord[] = [...INITIAL_EVIDENCE_RULES];
  private localAuthorities: VerificationAuthorityRecord[] = [...INITIAL_VERIFICATION_AUTHORITIES];
  private localRequests: VerificationRequestRecord[] = [...INITIAL_VERIFICATION_REQUESTS];

  // ── 1. Country Intelligence ─────────────────────────────────────────────

  public async getCountries(): Promise<CountryRecord[]> {
    try {
      const records = await snGetTableRecords<any>('u_bridge360_country', 'u_active=true');
      if (records && records.length > 0) {
        return records.map((r: any) => ({
          id: r.sys_id,
          countryName: r.u_country_name || '',
          iso2: r.u_iso2 || '',
          iso3: r.u_iso3 || '',
          nationality: r.u_nationality || '',
          officialLanguages: r.u_official_languages || '',
          scriptsUsed: r.u_scripts_used || '',
          transliterationNotes: r.u_transliteration_notes || '',
          namingConvention: r.u_naming_convention || 'family_surname',
          civilRegistryInfo: r.u_civil_registry_info || '',
          active: r.u_active === 'true' || r.u_active === true,
          notes: r.u_notes || '',
        }));
      }
    } catch (e) {
      console.warn('Could not load countries from ServiceNow, using reference catalog:', e);
    }
    return this.localCountries;
  }

  public async getCountryByOrigin(originName: string): Promise<CountryRecord | undefined> {
    const countries = await this.getCountries();
    if (!originName) return countries[0];

    const clean = originName.toLowerCase().trim();
    return countries.find(c =>
      c.countryName.toLowerCase().includes(clean) ||
      c.nationality.toLowerCase().includes(clean) ||
      clean.includes(c.countryName.toLowerCase()) ||
      c.iso2.toLowerCase() === clean ||
      c.iso3.toLowerCase() === clean
    );
  }

  // ── 2. Reference Documents Catalog ──────────────────────────────────────

  public async getCountryDocuments(countryId?: string): Promise<CountryDocumentRecord[]> {
    try {
      const query = countryId ? `u_country=${countryId}^u_active=true` : 'u_active=true';
      const records = await snGetTableRecords<any>('u_bridge360_country_document', query);
      if (records && records.length > 0) {
        return records.map((r: any) => ({
          id: r.sys_id,
          countryId: r.u_country?.value || r.u_country || '',
          countryName: r.u_country?.display_value || '',
          documentName: r.u_document_name || '',
          localName: r.u_local_name || '',
          documentCategory: r.u_document_category || 'identity',
          issuingAuthorityDesc: r.u_issuing_authority_desc || '',
          securityFeatures: r.u_security_features || '',
          typicalFields: r.u_typical_fields || '',
          validityPeriodDesc: r.u_validity_period_desc || '',
          electronicVerificationAvailable: r.u_electronic_verification_available === 'true' || r.u_electronic_verification_available === true,
          active: r.u_active === 'true' || r.u_active === true,
          notes: r.u_notes || '',
        }));
      } else {
        throw new Error('No country documents returned from ServiceNow');
      }
    } catch (e) {
      console.warn('Using local country document catalog fallback:', e);
    }

    if (countryId) {
      return this.localDocuments.filter(d => d.countryId === countryId || d.countryName.toLowerCase() === countryId.toLowerCase());
    }
    return this.localDocuments;
  }

  // ── 2b. Country Document Fields (Dynamic from u_bridge360_country_document_field) ──

  public async getCountryDocumentFields(countryDocumentId: string): Promise<CountryDocumentFieldRecord[]> {
    if (!countryDocumentId) return [];
    try {
      const query = `u_country_document=${countryDocumentId}^u_active=true`;
      const records = await snGetTableRecords<any>('u_bridge360_country_document_field', query);
      if (records && records.length > 0) {
        return records.map((r: any) => ({
          id: r.sys_id,
          countryDocumentId: r.u_country_document?.value || r.u_country_document || '',
          fieldName: r.u_field_name || '',
          fieldType: (r.u_field_type || 'text') as 'text' | 'date' | 'image',
          active: r.u_active === 'true' || r.u_active === true,
          notes: r.u_notes || '',
        }));
      }
    } catch (e) {
      console.warn('Could not fetch document fields from ServiceNow:', e);
    }
    return [];
  }

  // ── 3. Evidence Rules ───────────────────────────────────────────────────

  public async getEvidenceRules(countryId?: string): Promise<EvidenceRuleRecord[]> {
    try {
      const query = countryId ? `u_country=${countryId}^u_active=true` : 'u_active=true';
      const records = await snGetTableRecords<any>('u_bridge360_evidence_rule', query);
      if (records && records.length > 0) {
        return records.map((r: any) => ({
          id: r.sys_id,
          countryId: r.u_country?.value || r.u_country || '',
          countryName: r.u_country?.display_value || '',
          claimType: r.u_claim_type || 'primary_identity',
          description: r.u_description || '',
          primaryDocumentTypes: (r.u_primary_document_types || '').split(',').map((s: string) => s.trim()),
          alternativeDocumentTypes: (r.u_alternative_document_types || '').split(',').map((s: string) => s.trim()).filter(Boolean),
          minConfidenceThreshold: parseInt(r.u_min_confidence_threshold || '70', 10),
          strictness: r.u_strictness || 'standard',
          verificationGuidance: r.u_verification_guidance || '',
          active: r.u_active === 'true' || r.u_active === true,
        }));
      } else {
        throw new Error('No evidence rules returned from ServiceNow');
      }
    } catch (e) {
      console.warn('Using local evidence rules fallback:', e);
    }

    if (countryId) {
      return this.localRules.filter(r => r.countryId === countryId || r.countryName.toLowerCase() === countryId.toLowerCase());
    }
    return this.localRules;
  }

  /**
   * Evaluate whether a household's uploaded documents satisfy evidence rules
   */
  public evaluateRelationshipEvidence(
    countryRules: EvidenceRuleRecord[],
    uploadedDocuments: DocumentRecord[],
    members: FamilyMember[]
  ): Array<{
    claimType: string;
    relationshipDescription: string;
    isSatisfied: boolean;
    satisfyingDocuments: string[];
    missingPrimaryEvidence: string[];
    alternativeEvidenceAccepted: boolean;
    guidance: string;
  }> {
    const findings: any[] = [];
    const docTypes = uploadedDocuments.map(d => (d.documentType || '').toLowerCase().replace(/[\s\-_]+/g, '_'));

    for (const rule of countryRules) {
      const satisfyingDocs: string[] = [];
      let satisfied = false;
      let usedAlternative = false;

      // Check primary documents
      for (const pType of rule.primaryDocumentTypes) {
        const normP = pType.toLowerCase().replace(/[\s\-_]+/g, '_');
        const match = uploadedDocuments.find(d => {
          const dt = (d.documentType || '').toLowerCase().replace(/[\s\-_]+/g, '_');
          const fn = (d.fileName || '').toLowerCase().replace(/[\s\-_]+/g, '_');
          return dt.includes(normP) || normP.includes(dt) || fn.includes(normP);
        });
        if (match) {
          satisfyingDocs.push(match.fileName || match.documentType);
          satisfied = true;
        }
      }

      // Check alternative documents if not yet satisfied
      if (!satisfied && rule.alternativeDocumentTypes) {
        for (const aType of rule.alternativeDocumentTypes) {
          const normA = aType.toLowerCase().replace(/[\s\-_]+/g, '_');
          const match = uploadedDocuments.find(d => {
            const dt = (d.documentType || '').toLowerCase().replace(/[\s\-_]+/g, '_');
            const fn = (d.fileName || '').toLowerCase().replace(/[\s\-_]+/g, '_');
            return dt.includes(normA) || normA.includes(dt) || fn.includes(normA);
          });
          if (match) {
            satisfyingDocs.push(match.fileName || match.documentType);
            satisfied = true;
            usedAlternative = true;
          }
        }
      }

      findings.push({
        claimType: rule.claimType,
        relationshipDescription: rule.description,
        isSatisfied: satisfied,
        satisfyingDocuments: satisfyingDocs,
        missingPrimaryEvidence: satisfied ? [] : rule.primaryDocumentTypes,
        alternativeEvidenceAccepted: usedAlternative,
        guidance: rule.verificationGuidance || 'Review document forensic characteristics and official seals.',
      });
    }

    return findings;
  }

  // ── 4. Verification Authorities Directory ───────────────────────────────

  public async getVerificationAuthorities(countryId?: string): Promise<VerificationAuthorityRecord[]> {
    try {
      const query = countryId ? `u_country=${countryId}^ORu_countryISEMPTY^u_active=true` : 'u_active=true';
      const records = await snGetTableRecords<any>('u_bridge360_verification_authority', query);
      if (records && records.length > 0) {
        return records.map((r: any) => ({
          id: r.sys_id,
          authorityName: r.u_authority_name || '',
          countryId: r.u_country?.value || r.u_country || '',
          countryName: r.u_country?.display_value || '',
          jurisdiction: r.u_jurisdiction || 'National Civil Registry',
          verificationMethod: r.u_verification_method || 'REFERENCE_ONLY',
          apiAvailable: r.u_api_available === 'true' || r.u_api_available === true,
          contactEmail: r.u_contact_email || '',
          contactPortalUrl: r.u_contact_portal_url || '',
          responseSlaDays: parseInt(r.u_response_sla_days || '14', 10),
          active: r.u_active === 'true' || r.u_active === true,
          notes: r.u_notes || '',
        }));
      } else {
        throw new Error('No verification authorities returned from ServiceNow');
      }
    } catch (e) {
      console.warn('Using local authorities directory fallback:', e);
    }

    if (countryId) {
      return this.localAuthorities.filter(a => !a.countryId || a.countryId === countryId);
    }
    return this.localAuthorities;
  }

  // ── 5. Verification Requests Workflow (Protection Controlled) ───────────

  public async getVerificationRequests(applicationId?: string): Promise<VerificationRequestRecord[]> {
    try {
      const query = applicationId ? `u_family.u_application_id=${applicationId}` : '';
      const records = await snGetTableRecords<any>('u_bridge360_verification_request', query);
      if (records && records.length > 0) {
        return records.map((r: any) => ({
          id: r.sys_id,
          requestId: r.u_request_id || '',
          familyId: r.u_family?.value || r.u_family || '',
          applicationId: r.u_family?.display_value || applicationId || '',
          familyName: '',
          memberId: r.u_member?.value || r.u_member || '',
          memberName: r.u_member?.display_value || '',
          documentId: r.u_document?.value || r.u_document || '',
          documentName: r.u_document?.display_value || '',
          countryId: r.u_country?.value || r.u_country || '',
          countryName: r.u_country?.display_value || '',
          countryDocumentId: r.u_country_document?.value || '',
          countryDocumentName: r.u_country_document?.display_value || '',
          authorityId: r.u_authority?.value || r.u_authority || '',
          authorityName: r.u_authority?.display_value || '',
          requestType: r.u_request_type || 'document_authenticity',
          status: r.u_status || 'draft',
          consentRequired: r.u_consent_required === 'true' || r.u_consent_required === true,
          consentStatus: r.u_consent_status || 'pending',
          protectionReviewRequired: r.u_protection_review_required === 'true' || r.u_protection_review_required === true,
          protectionReviewStatus: r.u_protection_review_status || 'pending',
          assignedOfficer: r.u_assigned_officer || '',
          dispatchedAt: r.u_dispatched_at || '',
          completedAt: r.u_completed_at || '',
          outcomeSummary: r.u_outcome_summary || '',
          officerNotes: r.u_officer_notes || '',
          createdAt: r.sys_created_on || new Date().toISOString(),
        }));
      } else {
        throw new Error('No verification requests returned from ServiceNow');
      }
    } catch (e) {
      console.warn('Using local verification request fallback:', e);
    }

    if (applicationId) {
      return this.localRequests.filter(r => r.applicationId === applicationId || r.familyId === applicationId);
    }
    return this.localRequests;
  }

  public async createVerificationRequest(req: Partial<VerificationRequestRecord>): Promise<{
    success: boolean;
    request?: VerificationRequestRecord;
    message?: string;
  }> {
    const requestId = 'VR-2026-' + Math.floor(100000 + Math.random() * 900000);
    
    // Guardrail Check: Protection Review & Consent Validation
    if (req.status === 'dispatched' || req.status === 'pending_dispatch') {
      if (req.consentRequired && req.consentStatus !== 'granted' && req.consentStatus !== 'exempt_legal') {
        return {
          success: false,
          message: 'Cannot dispatch verification request: Applicant consent is required and currently pending or withheld.'
        };
      }
      if (req.protectionReviewRequired && req.protectionReviewStatus !== 'cleared_safe_to_contact' && req.protectionReviewStatus !== 'exempt') {
        return {
          success: false,
          message: 'Cannot dispatch verification request: Protection review is pending or flagged DO NOT CONTACT.'
        };
      }
    }

    const newRecord: VerificationRequestRecord = {
      id: 'VREQ-' + Date.now(),
      requestId: requestId,
      familyId: req.familyId || '',
      applicationId: req.applicationId || '',
      familyName: req.familyName || '',
      memberId: req.memberId || '',
      memberName: req.memberName || '',
      documentId: req.documentId || '',
      documentName: req.documentName || '',
      countryId: req.countryId || '',
      countryName: req.countryName || '',
      countryDocumentId: req.countryDocumentId || '',
      countryDocumentName: req.countryDocumentName || '',
      authorityId: req.authorityId || '',
      authorityName: req.authorityName || '',
      requestType: req.requestType || 'document_authenticity',
      status: req.status || 'draft',
      consentRequired: req.consentRequired ?? true,
      consentStatus: req.consentStatus || 'pending',
      protectionReviewRequired: req.protectionReviewRequired ?? true,
      protectionReviewStatus: req.protectionReviewStatus || 'pending',
      assignedOfficer: req.assignedOfficer || 'Current Officer',
      dispatchedAt: (req.status === 'dispatched' || req.status === 'pending_dispatch') ? new Date().toISOString().split('T')[0] : undefined,
      completedAt: undefined,
      outcomeSummary: req.outcomeSummary || '',
      officerNotes: req.officerNotes || '',
      createdAt: new Date().toISOString(),
    };

    try {
      const snFields = {
        u_request_id: newRecord.requestId,
        u_family: newRecord.familyId,
        u_member: newRecord.memberId,
        u_document: newRecord.documentId,
        u_country: newRecord.countryId,
        u_authority: newRecord.authorityId,
        u_request_type: newRecord.requestType,
        u_status: newRecord.status,
        u_consent_required: newRecord.consentRequired,
        u_consent_status: newRecord.consentStatus,
        u_protection_review_required: newRecord.protectionReviewRequired,
        u_protection_review_status: newRecord.protectionReviewStatus,
        u_assigned_officer: newRecord.assignedOfficer,
        u_officer_notes: newRecord.officerNotes,
      };
      const snRes = await snInsertTableRecord('u_bridge360_verification_request', snFields);
      if (snRes && snRes.sys_id) {
        newRecord.id = snRes.sys_id;
      }
    } catch (e) {
      console.warn('Logged request locally (SN insert skipped in local mock mode):', e);
    }

    this.localRequests.unshift(newRecord);
    return {
      success: true,
      request: newRecord,
      message: 'Verification request created successfully in Bridge360.'
    };
  }
}

export const evidenceFoundationService = new EvidenceFoundationService();
