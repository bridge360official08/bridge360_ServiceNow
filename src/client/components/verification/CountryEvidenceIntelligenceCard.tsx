import React from 'react';
import {
  Globe2, FileText, Scale, Landmark, Languages, Type, Users2, SatelliteDish,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

// ============================================================================
// Bridge360 — Feature 2 UI: Country Evidence Intelligence Card
// ----------------------------------------------------------------------------
// Presentational only. Renders the `country_evidence_compliance` block produced
// by Bridge360AIVerification.generateVerificationContext(...): the country
// profile, relevant reference documents, applicable evidence rules, verification
// authorities, and external verification status. No agent/REST calls — the
// parent supplies `compliance` once the verification agent is connected later.
// ============================================================================

export interface CountryProfile {
  country_name: string;
  iso2?: string;
  iso3?: string;
  nationality?: string;
  official_languages?: string;
  scripts_used?: string;
  naming_convention?: string;
  civil_registry_info?: string;
}

export interface EvidenceDocumentType {
  document_name?: string;
  document_category?: string;
  local_name?: string;
  issuing_authority_desc?: string;
}

export interface EvidenceRuleSummary {
  description?: string;
  claim_type?: string;
  strictness?: string;
  primary_document_types?: string;
  min_confidence_threshold?: number;
}

export interface VerificationAuthoritySummary {
  authority_name: string;
  verification_method?: string;
  api_available?: boolean;
  response_sla_days?: number;
}

export interface ExternalVerificationRequestSummary {
  authority_name?: string;
  status?: string;
}

/** Mirrors `country_evidence_compliance` from the verification context. */
export interface CountryEvidenceCompliance {
  country: CountryProfile | null;
  relevant_document_types?: EvidenceDocumentType[];
  applicable_evidence_rules?: EvidenceRuleSummary[];
  verification_authorities?: VerificationAuthoritySummary[];
  external_verification_requests?: ExternalVerificationRequestSummary[];
  evidence_rules_applied?: number;
  external_verification_available?: boolean;
  external_verification_pending?: number;
  external_verification_completed?: number;
}

export interface CountryEvidenceIntelligenceCardProps {
  compliance?: CountryEvidenceCompliance | null;
}

type Tone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

function humanize(token?: string): string {
  return (token || '').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function requestStatusTone(status?: string): Tone {
  switch ((status || '').toLowerCase()) {
    case 'verified': return 'success';
    case 'discrepancy_flagged': return 'error';
    case 'cancelled':
    case 'inconclusive': return 'neutral';
    case 'in_progress':
    case 'dispatched': return 'info';
    default: return 'warning';
  }
}

function methodTone(method?: string): Tone {
  switch ((method || '').toUpperCase()) {
    case 'AUTHORIZED_API': return 'success';
    case 'MANUAL_REQUEST': return 'info';
    case 'REFERENCE_ONLY': return 'neutral';
    default: return 'warning';
  }
}

const sectionTitle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '7px',
  fontSize: '12px', fontWeight: 700, color: 'var(--color-neutral-600)',
  textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px',
};

const factRow: React.CSSProperties = {
  display: 'flex', gap: '8px', fontSize: '12.5px', lineHeight: 1.5, marginBottom: '4px',
};
const factLabel: React.CSSProperties = { color: 'var(--color-neutral-500)', minWidth: '118px' };
const factValue: React.CSSProperties = { color: 'var(--color-navy-800)', fontWeight: 500 };

const listItem: React.CSSProperties = {
  padding: '9px 12px', borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-neutral-200)', backgroundColor: 'var(--color-neutral-50)',
  marginBottom: '6px',
};

const Fact: React.FC<{ label: string; value?: string }> = ({ label, value }) =>
  value ? (
    <div style={factRow}>
      <span style={factLabel}>{label}</span>
      <span style={factValue}>{value}</span>
    </div>
  ) : null;

export const CountryEvidenceIntelligenceCard: React.FC<CountryEvidenceIntelligenceCardProps> = ({
  compliance,
}) => {
  const country = compliance?.country ?? null;
  const documents = compliance?.relevant_document_types ?? [];
  const rules = compliance?.applicable_evidence_rules ?? [];
  const authorities = compliance?.verification_authorities ?? [];
  const requests = compliance?.external_verification_requests ?? [];

  const isoBadges = country && (country.iso2 || country.iso3) ? (
    <span style={{ display: 'inline-flex', gap: '6px' }}>
      {country.iso2 && <Badge variant="info">{country.iso2}</Badge>}
      {country.iso3 && <Badge variant="neutral">{country.iso3}</Badge>}
    </span>
  ) : undefined;

  return (
    <Card
      title="Country Evidence Intelligence"
      subtitle={country ? country.country_name : 'Reference profile & evidence requirements'}
      headerAction={isoBadges}
    >
      {!country ? (
        <div
          style={{
            padding: '22px', textAlign: 'center', borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--color-neutral-300)', backgroundColor: 'var(--color-neutral-50)',
            color: 'var(--color-neutral-500)', fontSize: '13px',
          }}
        >
          No country profile resolved yet. This card populates once the verification agent is connected.
        </div>
      ) : (
        <>
          {/* Country profile */}
          <div style={{ marginBottom: '20px' }}>
            <div style={sectionTitle}><Globe2 size={14} /> Country Profile</div>
            <Fact label="Nationality" value={country.nationality} />
            <Fact label="Naming convention" value={humanize(country.naming_convention)} />
            {country.official_languages && (
              <div style={factRow}>
                <span style={factLabel}><Languages size={12} style={{ verticalAlign: '-1px', marginRight: '4px' }} />Languages</span>
                <span style={factValue}>{country.official_languages}</span>
              </div>
            )}
            {country.scripts_used && (
              <div style={factRow}>
                <span style={factLabel}><Type size={12} style={{ verticalAlign: '-1px', marginRight: '4px' }} />Scripts</span>
                <span style={factValue}>{country.scripts_used}</span>
              </div>
            )}
            {country.civil_registry_info && (
              <div style={{ ...factRow, marginTop: '6px' }}>
                <span style={factLabel}><Landmark size={12} style={{ verticalAlign: '-1px', marginRight: '4px' }} />Civil registry</span>
                <span style={{ ...factValue, fontWeight: 400, color: 'var(--color-neutral-700)' }}>{country.civil_registry_info}</span>
              </div>
            )}
          </div>

          {/* Reference documents */}
          {documents.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={sectionTitle}><FileText size={14} /> Reference Documents ({documents.length})</div>
              {documents.map((d, i) => (
                <div key={i} style={listItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                      {d.document_name || 'Document'}
                    </span>
                    {d.document_category && <Badge variant="neutral">{humanize(d.document_category)}</Badge>}
                  </div>
                  {(d.local_name || d.issuing_authority_desc) && (
                    <p style={{ fontSize: '11.5px', color: 'var(--color-neutral-500)', marginTop: '3px' }}>
                      {[d.local_name, d.issuing_authority_desc].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Evidence rules */}
          {rules.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={sectionTitle}><Scale size={14} /> Applicable Evidence Rules ({rules.length})</div>
              {rules.map((r, i) => (
                <div key={i} style={listItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                    {r.claim_type && <Badge variant="info">{humanize(r.claim_type)}</Badge>}
                    {r.strictness && <Badge variant="warning">{humanize(r.strictness)}</Badge>}
                    {typeof r.min_confidence_threshold === 'number' && (
                      <span style={{ fontSize: '11px', color: 'var(--color-neutral-500)', marginLeft: 'auto' }}>
                        min conf. {r.min_confidence_threshold}%
                      </span>
                    )}
                  </div>
                  {r.description && (
                    <p style={{ fontSize: '12.5px', color: 'var(--color-navy-800)', lineHeight: 1.45 }}>{r.description}</p>
                  )}
                  {r.primary_document_types && (
                    <p style={{ fontSize: '11.5px', color: 'var(--color-neutral-500)', marginTop: '3px' }}>
                      Accepts: {r.primary_document_types}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Verification authorities */}
          {authorities.length > 0 && (
            <div style={{ marginBottom: requests.length > 0 ? '20px' : 0 }}>
              <div style={sectionTitle}><Users2 size={14} /> Verification Authorities ({authorities.length})</div>
              {authorities.map((a, i) => (
                <div key={i} style={{ ...listItem, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                    {a.authority_name}
                  </span>
                  {typeof a.response_sla_days === 'number' && (
                    <span style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>~{a.response_sla_days}d</span>
                  )}
                  {a.api_available && <Badge variant="success">API</Badge>}
                  {a.verification_method && <Badge variant={methodTone(a.verification_method)}>{humanize(a.verification_method)}</Badge>}
                </div>
              ))}
            </div>
          )}

          {/* External verification status */}
          {(requests.length > 0 ||
            compliance?.external_verification_pending != null ||
            compliance?.external_verification_completed != null) && (
            <div>
              <div style={sectionTitle}><SatelliteDish size={14} /> External Verification</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: requests.length > 0 ? '10px' : 0 }}>
                <Badge variant={compliance?.external_verification_available ? 'success' : 'neutral'}>
                  {compliance?.external_verification_available ? 'Channel available' : 'No live channel'}
                </Badge>
                {compliance?.external_verification_pending != null && (
                  <Badge variant="warning">{compliance.external_verification_pending} pending</Badge>
                )}
                {compliance?.external_verification_completed != null && (
                  <Badge variant="info">{compliance.external_verification_completed} completed</Badge>
                )}
              </div>
              {requests.map((rq, i) => (
                <div key={i} style={{ ...listItem, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ flex: 1, fontSize: '12.5px', color: 'var(--color-navy-800)' }}>
                    {rq.authority_name || 'Authority'}
                  </span>
                  {rq.status && <Badge variant={requestStatusTone(rq.status)}>{humanize(rq.status)}</Badge>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
};
