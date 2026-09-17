import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  Search,
  CheckCircle,
  Briefcase,
  Share2,
  Calendar,
  Users,
  Building,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  UserPlus,
  ShieldCheck,
  Eye,
  RefreshCw,
  Sparkles,
  X,
  Globe,
  BookOpen,
  Scale,
  ShieldAlert,
  Send,
  Lock,
  Check
} from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';
import {
  evidenceFoundationService
} from '../../services/evidenceFoundationService';
import {
  CountryRecord,
  CountryDocumentRecord,
  EvidenceRuleRecord,
  VerificationAuthorityRecord,
  VerificationRequestRecord
} from '../../types/bridge360';
import { useAssistant } from '../../store/AssistantContext';

export const AdminDashboardView: React.FC = () => {
  const {
    families,
    documents,
    cases,
    referrals,
    appointments,
    partnerAgencies,
    setAdminView,
    setSelectedFamilyId,
    refreshLiveAdminData,
    t
  } = useBridge360();
  const { setProactiveMessage, playAnimation } = useAssistant();

  const [activeTab, setActiveTab] = useState<'overview' | 'evidence_foundation'>('overview');
  const [evidenceSubTab, setEvidenceSubTab] = useState<'countries' | 'documents' | 'rules' | 'authorities' | 'requests'>('countries');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<any | null>(null);

  // Evidence Reference State
  const [countries, setCountries] = useState<CountryRecord[]>([]);
  const [countryDocs, setCountryDocs] = useState<CountryDocumentRecord[]>([]);
  const [evidenceRules, setEvidenceRules] = useState<EvidenceRuleRecord[]>([]);
  const [authorities, setAuthorities] = useState<VerificationAuthorityRecord[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequestRecord[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');

  useEffect(() => {
    loadEvidenceData();
  }, []);

  const loadEvidenceData = async () => {
    const [cList, dList, rList, aList, reqList] = await Promise.all([
      evidenceFoundationService.getCountries(),
      evidenceFoundationService.getCountryDocuments(),
      evidenceFoundationService.getEvidenceRules(),
      evidenceFoundationService.getVerificationAuthorities(),
      evidenceFoundationService.getVerificationRequests(),
    ]);
    setCountries(cList);
    setCountryDocs(dList);
    setEvidenceRules(rList);
    setAuthorities(aList);
    setVerificationRequests(reqList);
    if (cList.length > 0 && !selectedCountryId) {
      setSelectedCountryId(cList[0].id);
    }
  };

  // Dynamic Real-Time Metrics calculated from live ServiceNow database tables
  const totalApps = families.length;
  const pendingReg = families.filter(f => f.registrationStatus === 'Submitted').length;
  const pendingVer = families.filter(f => f.verificationStatus === 'Pending' || f.verificationStatus === 'In Review').length;
  const verifiedImmigrants = families.filter(f => f.verificationStatus === 'Verified' || f.registrationStatus === 'Approved').length;
  const activeCasesCount = cases.length;
  const activeReferralsCount = referrals.length;
  const upcomingAptsCount = appointments.filter(a => a.status === 'Scheduled').length;
  const registeredFamCount = families.length;
  const partnerCount = partnerAgencies.length;
  const highPriorityCount = families.filter(f => f.priority === 'Critical' || f.priority === 'High').length;

  const kpiCards = [
    { label: t('dash.totalApps', 'Total Applications'), val: totalApps, icon: FileText, color: '#2563EB', accent: '#3B82F6', target: 'family360' as const },
    { label: t('dash.pendingReg', 'Pending Registration'), val: pendingReg, icon: Clock, color: '#D97706', accent: '#F59E0B', target: 'verification' as const },
    { label: t('dash.pendingVer', 'Pending Verification'), val: pendingVer, icon: Search, color: '#9333EA', accent: '#A855F7', target: 'verification' as const },
    { label: t('dash.verifiedImmigrants', 'Verified Immigrants'), val: verifiedImmigrants, icon: CheckCircle, color: '#16A34A', accent: '#22C55E', target: 'family360' as const },
    { label: t('dash.activeCases', 'Active Cases'), val: activeCasesCount, icon: Briefcase, color: '#CA8A04', accent: '#EAB308', target: 'cases' as const },
    { label: t('dash.activeReferrals', 'Active Referrals'), val: activeReferralsCount, icon: Share2, color: '#0D9488', accent: '#14B8A6', target: 'referrals' as const },
    { label: t('dash.upcomingAppointments', 'Upcoming Appointments'), val: upcomingAptsCount, icon: Calendar, color: '#6366F1', accent: '#818CF8', target: 'appointments' as const },
    { label: t('dash.registeredFamilies', 'Registered Families'), val: registeredFamCount, icon: Users, color: '#4F46E5', accent: '#6366F1', target: 'family360' as const },
    { label: t('dash.partnerCount', 'Partner Agencies'), val: partnerCount, icon: Building, color: '#2563EB', accent: '#60A5FA', target: 'partner_agencies' as const },
    { label: t('dash.highPriorityCases', 'High Priority Cases'), val: highPriorityCount, icon: AlertTriangle, color: '#DC2626', accent: '#EF4444', target: 'cases' as const },
  ];

  // Dynamic Country Breakdown from live data
  const countryCounts: { [key: string]: number } = {};
  families.forEach(f => {
    const c = f.countryOfOrigin || 'Other';
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });
  const countryColors = ['#2563EB', '#16A34A', '#EA580C', '#9333EA', '#0D9488', '#DC2626'];
  const sortedCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxCountryVal = Math.max(1, ...sortedCountries.map(sc => sc[1]));

  const submittedCount = families.filter(f => f.registrationStatus === 'Submitted').length;
  const verifiedCount = families.filter(f => f.registrationStatus === 'Approved' || f.verificationStatus === 'Verified').length;
  const submittedPct = totalApps > 0 ? (submittedCount / totalApps) * 100 : 0;
  const verifiedPct = totalApps > 0 ? (verifiedCount / totalApps) * 100 : 0;

  const filteredFamilies = families.filter(f => {
    const query = searchTerm.toLowerCase();
    return (
      f.familyName.toLowerCase().includes(query) ||
      f.applicationId.toLowerCase().includes(query) ||
      (f.bridge360Id && f.bridge360Id.toLowerCase().includes(query)) ||
      f.countryOfOrigin.toLowerCase().includes(query) ||
      (f.headOfFamily?.firstName && f.headOfFamily.firstName.toLowerCase().includes(query)) ||
      (f.headOfFamily?.lastName && f.headOfFamily.lastName.toLowerCase().includes(query))
    );
  });

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshLiveAdminData();
    await loadEvidenceData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header & Quick Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t('dash.title', 'Operations Command Dashboard')}
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginTop: '2px' }}>
            {t('dash.subtitle', 'Live view synchronized with ServiceNow tables. Click any card or row to inspect details.')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-secondary"
            onClick={() => {
              setProactiveMessage("Syncing latest cases and rules from ServiceNow...");
              playAnimation('think');
              handleManualRefresh();
            }}
            disabled={isRefreshing}
            style={{ fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} className={isRefreshing ? 'spin' : ''} />
            {isRefreshing ? 'Syncing...' : t('dash.syncData', 'Sync Data')}
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              setProactiveMessage("Let's coordinate with the family and schedule a meeting.");
              playAnimation('wave');
              setAdminView('appointments');
            }}
            style={{ fontSize: '0.85rem', background: '#EFF6FF', color: '#2563EB', borderColor: '#BFDBFE' }}
          >
            <Calendar size={15} /> 📅 Schedule Appointment
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              setProactiveMessage("I'll prepare a blank case file for you to review.");
              playAnimation('nod');
              setAdminView('cases');
            }}
            style={{ fontSize: '0.85rem', background: '#FEF3C7', color: '#B45309', borderColor: '#FDE68A' }}
          >
            <Briefcase size={15} /> 💼 Open New Case
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setProactiveMessage("Starting a new family registration workflow...");
              playAnimation('wave');
              setAdminView('register');
            }}
            style={{ fontSize: '0.85rem' }}
          >
            <UserPlus size={15} /> {t('nav.newRegistration', 'New Registration')}
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setProactiveMessage("Transferring you to the specialist verification desk.");
              playAnimation('point');
              setAdminView('verification');
            }}
            style={{ fontSize: '0.85rem', background: '#9333EA', borderColor: '#9333EA' }}
          >
            <ShieldCheck size={15} /> {t('dash.verificationWorkspace', 'Verification Workspace')}
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            border: 'none',
            background: activeTab === 'overview' ? '#2563EB' : 'transparent',
            color: activeTab === 'overview' ? '#FFFFFF' : '#64748B',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          <TrendingUp size={16} /> Operational Overview
        </button>
        <button
          onClick={() => setActiveTab('evidence_foundation')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            border: 'none',
            background: activeTab === 'evidence_foundation' ? '#0F172A' : 'transparent',
            color: activeTab === 'evidence_foundation' ? '#FFFFFF' : '#64748B',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          <Globe size={16} /> Country Evidence Foundation &amp; Registries
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* 10 Interactive Real-Time KPI Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            {kpiCards.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  className="kpi-card"
                  onClick={() => setAdminView(kpi.target)}
                  title={`Click to open ${kpi.target}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: `${kpi.color}15`,
                        color: kpi.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>LIVE</span>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {kpi.val}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', fontWeight: 600, marginTop: '2px' }}>
                    {kpi.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2-Column Analytics Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', marginBottom: '28px' }}>
            {/* Verification Status Overview */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Registration &amp; Verification Progress
                </h3>
                <span className="badge badge-indigo">Real-Time</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px', color: 'var(--text-sub)' }}>
                    <span>Submitted (Awaiting Review)</span>
                    <span style={{ fontWeight: 700, color: '#D97706' }}>{submittedCount} ({submittedPct.toFixed(0)}%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${submittedPct}%`, background: '#F59E0B', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px', color: 'var(--text-sub)' }}>
                    <span>Verified &amp; Approved</span>
                    <span style={{ fontWeight: 700, color: '#16A34A' }}>{verifiedCount} ({verifiedPct.toFixed(0)}%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${verifiedPct}%`, background: '#22C55E', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Country of Origin Breakdown */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Country of Origin Breakdown
                </h3>
                <span className="badge badge-indigo">Caseload Distribution</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sortedCountries.map(([country, count], idx) => {
                  const pct = totalApps > 0 ? (count / totalApps) * 100 : 0;
                  const color = countryColors[idx % countryColors.length];
                  return (
                    <div key={country}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px', color: 'var(--text-sub)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{country}</span>
                        <span style={{ fontWeight: 700, color: color }}>{count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(count / maxCountryVal) * 100}%`, background: color, borderRadius: '3px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Master Registered Families Table */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Active Household Applications
                </h3>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.82rem', marginTop: '2px' }}>
                  {filteredFamilies.length} household records found
                </p>
              </div>

              <div style={{ position: 'relative', minWidth: '280px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search by name, ID, or country..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {filteredFamilies.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                <Users size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p style={{ fontWeight: 600 }}>No applications matching search criteria.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                      <th style={{ padding: '12px' }}>Application ID</th>
                      <th style={{ padding: '12px' }}>Family / Head of Household</th>
                      <th style={{ padding: '12px' }}>Country of Origin</th>
                      <th style={{ padding: '12px' }}>Size</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Created</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFamilies.map(fam => {
                      const isVerified = fam.verificationStatus === 'Verified' || fam.registrationStatus === 'Approved';
                      const famDoc = documents.find(d => d.applicationId === fam.applicationId || d.familyId === fam.id);
                      return (
                        <tr key={fam.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '14px', fontWeight: 700, color: '#2563EB' }}>
                            {fam.applicationId}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{fam.familyName}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                              {fam.headOfFamily?.firstName} {fam.headOfFamily?.lastName} ({fam.headOfFamily?.email || 'No email'})
                            </div>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{fam.countryOfOrigin}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Lang: {fam.primaryLanguage}</div>
                          </td>
                          <td style={{ padding: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {fam.householdSize} member(s)
                          </td>
                          <td style={{ padding: '14px' }}>
                            <span
                              className={`badge ${
                                isVerified
                                  ? 'badge-high'
                                  : fam.verificationStatus === 'Pending' || fam.verificationStatus === 'Requires Review'
                                  ? 'badge-medium'
                                  : 'badge-indigo'
                              }`}
                            >
                              {isVerified ? '✓ Verified & Approved' : '⏳ Pending Verification'}
                            </span>
                          </td>
                          <td style={{ padding: '14px', color: 'var(--text-sub)', fontSize: '0.82rem' }}>
                            {fam.arrivalDate || fam.createdAt?.split('T')[0] || 'Today'}
                          </td>
                          <td style={{ padding: '14px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              {famDoc && (
                                <button
                                  className="btn-secondary"
                                  style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                                  onClick={() => setSelectedDocPreview(famDoc)}
                                  title="View Uploaded Document"
                                >
                                  <FileText size={13} /> View Doc
                                </button>
                              )}
                              <button
                                className="btn-secondary"
                                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                onClick={() => {
                                  setSelectedFamilyId(fam.id);
                                  setAdminView('family360');
                                }}
                              >
                                <Eye size={13} /> Family 360
                              </button>
                              <button
                                className="btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                onClick={() => setAdminView('verification')}
                              >
                                <ShieldCheck size={13} /> Verify
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* ── Country Evidence Foundation & Registries Module ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Sub Navigation Bar */}
          <div style={{ display: 'flex', gap: '10px', background: '#F8FAFC', padding: '8px', borderRadius: '10px', border: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
            <button
              onClick={() => setEvidenceSubTab('countries')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                background: evidenceSubTab === 'countries' ? '#2563EB' : 'transparent',
                color: evidenceSubTab === 'countries' ? '#FFFFFF' : '#475569',
              }}
            >
              <Globe size={14} style={{ display: 'inline', marginRight: '6px' }} /> Countries ({countries.length})
            </button>
            <button
              onClick={() => setEvidenceSubTab('documents')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                background: evidenceSubTab === 'documents' ? '#2563EB' : 'transparent',
                color: evidenceSubTab === 'documents' ? '#FFFFFF' : '#475569',
              }}
            >
              <BookOpen size={14} style={{ display: 'inline', marginRight: '6px' }} /> Reference Documents ({countryDocs.length})
            </button>
            <button
              onClick={() => setEvidenceSubTab('rules')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                background: evidenceSubTab === 'rules' ? '#2563EB' : 'transparent',
                color: evidenceSubTab === 'rules' ? '#FFFFFF' : '#475569',
              }}
            >
              <Scale size={14} style={{ display: 'inline', marginRight: '6px' }} /> Evidence Rules ({evidenceRules.length})
            </button>
            <button
              onClick={() => setEvidenceSubTab('authorities')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                background: evidenceSubTab === 'authorities' ? '#2563EB' : 'transparent',
                color: evidenceSubTab === 'authorities' ? '#FFFFFF' : '#475569',
              }}
            >
              <Building size={14} style={{ display: 'inline', marginRight: '6px' }} /> Verification Authorities ({authorities.length})
            </button>
            <button
              onClick={() => setEvidenceSubTab('requests')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                background: evidenceSubTab === 'requests' ? '#2563EB' : 'transparent',
                color: evidenceSubTab === 'requests' ? '#FFFFFF' : '#475569',
              }}
            >
              <Send size={14} style={{ display: 'inline', marginRight: '6px' }} /> Verification Requests ({verificationRequests.length})
            </button>
          </div>

          {/* Sub-Tab 1: Countries */}
          {evidenceSubTab === 'countries' && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Country Intelligence Reference Catalog
                </h3>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.82rem', marginTop: '2px' }}>
                  Factual reference specifications, transliteration variations, and civil registration structure by country.
                </p>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                      <th style={{ padding: '12px' }}>Country</th>
                      <th style={{ padding: '12px' }}>ISO Codes</th>
                      <th style={{ padding: '12px' }}>Nationality</th>
                      <th style={{ padding: '12px' }}>Languages &amp; Scripts</th>
                      <th style={{ padding: '12px' }}>Naming Convention</th>
                      <th style={{ padding: '12px' }}>Civil Registry Structure</th>
                      <th style={{ padding: '12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countries.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#0F172A' }}>{c.countryName}</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ padding: '2px 6px', background: '#EFF6FF', color: '#2563EB', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem', marginRight: '4px' }}>{c.iso2}</span>
                          <span style={{ padding: '2px 6px', background: '#F1F5F9', color: '#475569', borderRadius: '4px', fontWeight: 600, fontSize: '0.75rem' }}>{c.iso3}</span>
                        </td>
                        <td style={{ padding: '14px', color: '#334155' }}>{c.nationality}</td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{c.officialLanguages}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{c.scriptsUsed}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ padding: '3px 8px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.78rem', textTransform: 'capitalize', fontWeight: 600 }}>
                            {c.namingConvention.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '14px', maxWidth: '300px', fontSize: '0.8rem', color: '#475569' }}>
                          {c.civilRegistryInfo || '—'}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span className={`badge ${c.active ? 'badge-high' : 'badge-medium'}`}>{c.active ? 'Active' : 'Inactive'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Documents */}
          {evidenceSubTab === 'documents' && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Country Reference Document Catalog
                </h3>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.82rem', marginTop: '2px' }}>
                  Reference document specifications, expected extracted fields, and physical security features.
                </p>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                      <th style={{ padding: '12px' }}>Document Name</th>
                      <th style={{ padding: '12px' }}>Country</th>
                      <th style={{ padding: '12px' }}>Category</th>
                      <th style={{ padding: '12px' }}>Issuing Authority</th>
                      <th style={{ padding: '12px' }}>Security Features</th>
                      <th style={{ padding: '12px' }}>Electronic Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countryDocs.map(d => (
                      <tr key={d.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{d.documentName}</div>
                          {d.localName && <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>{d.localName}</div>}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 600, color: '#2563EB' }}>{d.countryName}</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ padding: '3px 8px', background: '#F1F5F9', borderRadius: '6px', fontSize: '0.78rem', textTransform: 'capitalize', fontWeight: 600 }}>
                            {d.documentCategory.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '14px', fontSize: '0.82rem', color: '#334155' }}>{d.issuingAuthorityDesc || '—'}</td>
                        <td style={{ padding: '14px', maxWidth: '280px', fontSize: '0.78rem', color: '#64748B' }}>{d.securityFeatures || '—'}</td>
                        <td style={{ padding: '14px' }}>
                          <span className={`badge ${d.electronicVerificationAvailable ? 'badge-high' : 'badge-medium'}`}>
                            {d.electronicVerificationAvailable ? 'Available' : 'Manual / Reference Only'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Evidence Rules */}
          {evidenceSubTab === 'rules' && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Family &amp; Identity Evidence Satisfaction Rules
                </h3>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.82rem', marginTop: '2px' }}>
                  Rule matrices mapping relationship claims to primary and alternative acceptable document evidence.
                </p>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                      <th style={{ padding: '12px' }}>Country</th>
                      <th style={{ padding: '12px' }}>Evidence Claim</th>
                      <th style={{ padding: '12px' }}>Primary Acceptable Evidence</th>
                      <th style={{ padding: '12px' }}>Alternative Evidence</th>
                      <th style={{ padding: '12px' }}>Strictness</th>
                      <th style={{ padding: '12px' }}>Caseworker Guidance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evidenceRules.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#2563EB' }}>{r.countryName}</td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{r.description}</div>
                          <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>{r.claimType}</span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {r.primaryDocumentTypes.map((pt: string, pidx: number) => (
                              <span key={pidx} style={{ padding: '2px 6px', background: '#EFF6FF', color: '#1E40AF', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {pt}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {r.alternativeDocumentTypes.map((at: string, aidx: number) => (
                              <span key={aidx} style={{ padding: '2px 6px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '0.75rem' }}>
                                {at}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span className={`badge ${r.strictness === 'standard' ? 'badge-indigo' : 'badge-medium'}`}>
                            {r.strictness.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '14px', maxWidth: '300px', fontSize: '0.78rem', color: '#475569' }}>
                          {r.verificationGuidance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Verification Authorities */}
          {evidenceSubTab === 'authorities' && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Verification Authorities &amp; Registry Directory
                </h3>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.82rem', marginTop: '2px' }}>
                  Issuing bodies, UNHCR cross-check points, and bilateral verification channels.
                </p>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                      <th style={{ padding: '12px' }}>Authority Name</th>
                      <th style={{ padding: '12px' }}>Jurisdiction</th>
                      <th style={{ padding: '12px' }}>Verification Method</th>
                      <th style={{ padding: '12px' }}>Contact / Portal</th>
                      <th style={{ padding: '12px' }}>Turnaround SLA</th>
                      <th style={{ padding: '12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authorities.map(a => (
                      <tr key={a.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{a.authorityName}</div>
                          {a.countryName && <div style={{ fontSize: '0.75rem', color: '#2563EB' }}>{a.countryName}</div>}
                        </td>
                        <td style={{ padding: '14px', color: '#475569', fontSize: '0.82rem' }}>{a.jurisdiction}</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ padding: '3px 8px', background: '#F1F5F9', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                            {a.verificationMethod}
                          </span>
                        </td>
                        <td style={{ padding: '14px', fontSize: '0.8rem' }}>
                          {a.contactEmail && <div>{a.contactEmail}</div>}
                          {a.contactPortalUrl && (
                            <a href={a.contactPortalUrl} target="_blank" rel="noreferrer" style={{ color: '#2563EB', textDecoration: 'underline' }}>
                              Visit Portal
                            </a>
                          )}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#475569' }}>{a.responseSlaDays} days</td>
                        <td style={{ padding: '14px' }}>
                          <span className={`badge ${a.active ? 'badge-high' : 'badge-medium'}`}>{a.active ? 'Active' : 'Inactive'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 5: Verification Requests */}
          {evidenceSubTab === 'requests' && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  External Verification Request Log
                </h3>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.82rem', marginTop: '2px' }}>
                  Protection-governed verification requests dispatched for civil registry or bilateral cross-checking.
                </p>
              </div>

              {verificationRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                  <Send size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <p style={{ fontWeight: 600 }}>No external verification requests logged yet.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                        <th style={{ padding: '12px' }}>Request ID</th>
                        <th style={{ padding: '12px' }}>Target Applicant</th>
                        <th style={{ padding: '12px' }}>Authority</th>
                        <th style={{ padding: '12px' }}>Request Type</th>
                        <th style={{ padding: '12px' }}>Consent &amp; Protection</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px' }}>Outcome / Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verificationRequests.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '14px', fontWeight: 700, color: '#2563EB' }}>{r.requestId}</td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: 700, color: '#0F172A' }}>{r.memberName || 'Primary Applicant'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>App: {r.applicationId} • {r.countryName}</div>
                          </td>
                          <td style={{ padding: '14px', fontSize: '0.82rem', color: '#334155' }}>{r.authorityName}</td>
                          <td style={{ padding: '14px' }}>
                            <span style={{ padding: '2px 6px', background: '#F1F5F9', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                              {r.requestType.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.75rem' }}>
                              <span style={{ color: r.consentStatus === 'granted' ? '#16A34A' : '#D97706', fontWeight: 600 }}>
                                Consent: {r.consentStatus}
                              </span>
                              <span style={{ color: r.protectionReviewStatus === 'cleared_safe_to_contact' ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                                Protection: {r.protectionReviewStatus.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <span className={`badge ${r.status === 'verified' ? 'badge-high' : r.status === 'dispatched' ? 'badge-indigo' : 'badge-medium'}`}>
                              {r.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '14px', maxWidth: '260px', fontSize: '0.78rem', color: '#475569' }}>
                            {r.outcomeSummary || r.officerNotes || 'Inquiry logged.'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedDocPreview && (
        <div className="modal-overlay" onClick={() => setSelectedDocPreview(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', background: '#FFFFFF', color: '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>{selectedDocPreview.fileName}</h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Type: {selectedDocPreview.documentType} • Size: {selectedDocPreview.fileSize}</div>
                </div>
              </div>
              <button onClick={() => setSelectedDocPreview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Verification Status</span>
                <span className={`badge ${selectedDocPreview.verificationStatus === 'Verified' ? 'badge-high' : 'badge-medium'}`}>{selectedDocPreview.verificationStatus}</span>
              </div>

              <div>
                <label className="input-label" style={{ marginBottom: '6px' }}>Extracted Document Information</label>
                <div style={{ padding: '14px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.88rem', color: '#0F172A', maxHeight: '180px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {selectedDocPreview.ocrRawText || `Document Name: ${selectedDocPreview.fileName}\nType: ${selectedDocPreview.documentType}\nApplication ID: ${selectedDocPreview.applicationId}`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
              <button className="btn-primary" onClick={() => setSelectedDocPreview(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardView;
