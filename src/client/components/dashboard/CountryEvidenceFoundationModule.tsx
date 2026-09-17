import React from 'react';
import { Globe2, FileText, Scale, Landmark, SatelliteDish, Database } from 'lucide-react';

// ============================================================================
// Bridge360 — Feature 2 UI: Country Evidence Foundation Module (Admin Dashboard)
// ----------------------------------------------------------------------------
// Presentational only. A dashboard module summarizing the Feature 2 reference
// registries that back the AI verification engine:
//   • u_bridge360_country                 (Country Evidence Intelligence)
//   • u_bridge360_country_document         (Country Reference Document)
//   • u_bridge360_evidence_rule            (Family & Identity Evidence Rule)
//   • u_bridge360_verification_authority   (Verification Authority Directory)
//   • u_bridge360_verification_request     (External Verification Request)
// It renders metrics passed in via props — it does NOT query ServiceNow or call
// any agent. Wire `metrics`/`onOpenRegistry` from the dashboard later; matches
// the existing dashboard's .glass-card / .kpi-card visual language.
// ============================================================================

export type CountryEvidenceRegistry =
  | 'country' | 'document' | 'rule' | 'authority' | 'request';

export interface CountryEvidenceFoundationMetrics {
  countries?: number;
  activeCountries?: number;
  referenceDocuments?: number;
  evidenceRules?: number;
  verificationAuthorities?: number;
  authoritiesWithApi?: number;
  externalRequests?: number;
  pendingRequests?: number;
}

export interface CountryEvidenceFoundationModuleProps {
  metrics?: CountryEvidenceFoundationMetrics | null;
  /** Optional: open the corresponding registry when a tile is clicked. */
  onOpenRegistry?: (registry: CountryEvidenceRegistry) => void;
}

interface TileDef {
  key: CountryEvidenceRegistry;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  value?: number;
  sub?: string;
}

function fmt(n?: number): string {
  return typeof n === 'number' ? String(n) : '—';
}

export const CountryEvidenceFoundationModule: React.FC<CountryEvidenceFoundationModuleProps> = ({
  metrics,
  onOpenRegistry,
}) => {
  const m = metrics ?? {};

  const tiles: TileDef[] = [
    {
      key: 'country', label: 'Countries', icon: Globe2, color: '#2563EB',
      value: m.countries,
      sub: typeof m.activeCountries === 'number' ? `${m.activeCountries} active` : undefined,
    },
    {
      key: 'document', label: 'Reference Documents', icon: FileText, color: '#0D9488',
      value: m.referenceDocuments,
    },
    {
      key: 'rule', label: 'Evidence Rules', icon: Scale, color: '#9333EA',
      value: m.evidenceRules,
    },
    {
      key: 'authority', label: 'Verification Authorities', icon: Landmark, color: '#D97706',
      value: m.verificationAuthorities,
      sub: typeof m.authoritiesWithApi === 'number' ? `${m.authoritiesWithApi} with live API` : undefined,
    },
    {
      key: 'request', label: 'External Requests', icon: SatelliteDish, color: '#4F46E5',
      value: m.externalRequests,
      sub: typeof m.pendingRequests === 'number' ? `${m.pendingRequests} pending` : undefined,
    },
  ];

  const hasData = !!metrics;

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px', height: '38px', borderRadius: '8px',
              background: '#2563EB15', color: '#2563EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Database size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Country Evidence Foundation
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.82rem', marginTop: '2px' }}>
              Reference registries powering AI verification &amp; external checks
            </p>
          </div>
        </div>
        <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>Feature 2</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {tiles.map((tile) => {
          const Icon = tile.icon;
          const clickable = !!onOpenRegistry;
          return (
            <div
              key={tile.key}
              className={clickable ? 'kpi-card' : undefined}
              onClick={clickable ? () => onOpenRegistry(tile.key) : undefined}
              title={clickable ? `Open ${tile.label} registry` : undefined}
              style={
                clickable
                  ? undefined
                  : {
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      background: '#F8FAFC',
                    }
              }
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '38px', height: '38px', borderRadius: '8px',
                    background: `${tile.color}15`, color: tile.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
                {fmt(tile.value)}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', fontWeight: 600, marginTop: '2px' }}>
                {tile.label}
              </div>
              {tile.sub && (
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                  {tile.sub}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!hasData && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '14px' }}>
          Metrics populate once the Country Evidence registries are synchronized from ServiceNow.
        </p>
      )}
    </div>
  );
};

export default CountryEvidenceFoundationModule;
