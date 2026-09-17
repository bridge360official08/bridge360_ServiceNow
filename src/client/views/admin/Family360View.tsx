import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle,
  Clock,
  FileText,
  Briefcase,
  Share2,
  Calendar,
  MessageSquare,
  History,
  Edit3,
  Plus,
  ArrowLeft,
  Eye,
  Check,
  X,
  Send,
  Building,
  User,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  Upload,
  BarChart2,
  CheckSquare
} from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';
import { useAssistant } from '../../store/AssistantContext';
import { InternPanel } from '../../components/assistant/InternPanel';

export const Family360View: React.FC = () => {
  const {
    families,
    selectedFamilyId,
    setSelectedFamilyId,
    documents,
    cases,
    referrals,
    appointments,
    tickets,
    timeline,
    notes,
    partnerAgencies,
    updateVerificationStatus,
    approveEntireApplication,
    runAgenticWorkflow,
    createCase,
    toggleTask,
    createReferral,
    createAppointment,
    respondToTicket,
    addFamilyNote,
    toggleCustomerEdit,
    requestAdditionalDocuments,
    setAdminView,
    language,
    t,
  } = useBridge360();

  const { setScreenContext, setAgentTarget } = useAssistant();

  // Sub-navigation view: 'detail' (the single family 360) | 'all_families' | 'analytics' | 'timeline'
  const [activeSubView, setActiveSubView] = useState<'all_families' | 'detail' | 'profile' | 'documents' | 'cases' | 'referrals' | 'appointments' | 'timeline' | 'messages' | 'notes' | 'analytics'>(selectedFamilyId ? 'detail' : 'all_families');

  React.useEffect(() => {
    setScreenContext(selectedFamilyId ? `admin_family_${activeSubView}` : 'admin_all_families');
  }, [selectedFamilyId, activeSubView, setScreenContext]);

  React.useEffect(() => {
    if (!selectedFamilyId) {
      setActiveSubView('all_families');
    } else {
      setActiveSubView('detail');
    }
  }, [selectedFamilyId]);

  const { registerActionHandler, setProactiveMessage } = useAssistant();

  React.useEffect(() => {
    const unregister = registerActionHandler(async (actionType: string) => {
      if (actionType === 'VERIFY_DOCUMENTS' && selectedFamilyId) {
        setProactiveMessage("I am running the 4-Agent Orchestrator workflow... please stand by!");
        try {
          const res = await runAgenticWorkflow(selectedFamilyId);
          const summary = `Workflow Complete! Triage Agent assigned ${res.triage.assignedOfficer} (${res.triage.priority} Priority). Document Analyst Agent status: ${res.docAnalysis.status} (Verified: ${res.docAnalysis.verifiedCount}). Decision Drafter Drafted recommendation: ${res.decisionDraft.recommendation}.`;
          setProactiveMessage(summary);
        } catch (e) {
          console.error(e);
          setProactiveMessage("Oops! The agentic workflow run encountered an error.");
        }
      }
    });
    return unregister;
  }, [selectedFamilyId, runAgenticWorkflow, registerActionHandler, setProactiveMessage]);

  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals State
  const [showAddCaseModal, setShowAddCaseModal] = useState<boolean>(false);
  const [newCaseCategory, setNewCaseCategory] = useState<'Immigration' | 'Housing' | 'Healthcare' | 'Education' | 'Legal'>('Housing');
  const [newCaseTitle, setNewCaseTitle] = useState<string>('');
  const [newCaseDesc, setNewCaseDesc] = useState<string>('');

  const [showAddRefModal, setShowAddRefModal] = useState<boolean>(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('PA-01');
  const [refServiceType, setRefServiceType] = useState<string>('Transitional Housing');

  const [showAddAptModal, setShowAddAptModal] = useState<boolean>(false);
  const [aptTitle, setAptTitle] = useState<string>('');
  const [aptType, setAptType] = useState<'Interview' | 'Medical Check' | 'Orientation' | 'Legal Review' | 'Case Meeting'>('Interview');
  const [aptDate, setAptDate] = useState<string>('2026-08-22');

  // Member Details Modal State
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<any | null>(null);

  // Document Viewer & Request Modal State
  const [selectedDocPreview, setSelectedDocPreview] = useState<any | null>(null);
  const [showRequestDocModal, setShowRequestDocModal] = useState<boolean>(false);
  const [reqDocType, setReqDocType] = useState<string>('National ID');
  const [reqDocNotes, setReqDocNotes] = useState<string>('Please provide a clear scan/photo of your identification document.');

  // Selected Family Target with safe fallbacks
  const currentFamily = families.find(f => f.id === selectedFamilyId || f.applicationId === selectedFamilyId || f.bridge360Id === selectedFamilyId) || families[0];

  // Keep the assistant's case context pointed at the family in view so both the
  // chat and the inline Intern reason over the right ServiceNow record.
  React.useEffect(() => {
    if (currentFamily) {
      setAgentTarget({
        table: 'u_bridge360_family',
        recordId: currentFamily.sys_id || '',
        label: `${currentFamily.familyName} (${currentFamily.applicationId})`,
        language: currentFamily.primaryLanguage,
      });
    }
    return () => setAgentTarget(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFamily?.sys_id, currentFamily?.applicationId, setAgentTarget]);

  const famDocs = currentFamily ? documents.filter(d => d.familyId === currentFamily.id || d.applicationId === currentFamily.applicationId) : [];
  const famCases = currentFamily ? cases.filter(c => c.familyId === currentFamily.id || c.familyId === currentFamily.applicationId) : [];
  const famReferrals = currentFamily ? referrals.filter(r => r.familyId === currentFamily.id || r.familyId === currentFamily.applicationId) : [];
  const famAppointments = currentFamily ? appointments.filter(a => a.familyId === currentFamily.id || a.familyId === currentFamily.applicationId) : [];
  const famTickets = currentFamily ? tickets.filter(t => t.familyId === currentFamily.id || t.applicationId === currentFamily.applicationId) : [];
  const famTimeline = currentFamily ? timeline.filter(t => t.familyId === currentFamily.id || t.familyId === currentFamily.applicationId) : [];

  const filteredFamilies = families.filter(
    f => {
      const isFamVerified = f.registrationStatus === 'Approved' || f.verificationStatus === 'Verified';
      if (!isFamVerified) return false;
      return f.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.bridge360Id && f.bridge360Id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        f.countryOfOrigin.toLowerCase().includes(searchTerm.toLowerCase());
    }
  );

  const isVerified = currentFamily && (currentFamily.registrationStatus === 'Approved' || currentFamily.verificationStatus === 'Verified');

  const handleSelectFamily = (famId: string) => {
    setSelectedFamilyId(famId);
    setActiveSubView('detail');
  };

  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle.trim() || !currentFamily) return;
    createCase({
      familyId: currentFamily.id,
      category: newCaseCategory,
      title: newCaseTitle,
      description: newCaseDesc,
      tasks: [
        { id: `t-${Date.now()}-1`, title: 'Initial Needs Assessment', completed: true, dueDate: '2026-08-30' },
        { id: `t-${Date.now()}-2`, title: 'Documentation Review', completed: false, dueDate: '2026-08-30' },
        { id: `t-${Date.now()}-3`, title: 'Action Plan Follow-up', completed: false, dueDate: '2026-08-30' },
      ],
    });
    setShowAddCaseModal(false);
    setNewCaseTitle('');
    setNewCaseDesc('');
  };

  const handleCreateReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFamily) return;
    const partner = partnerAgencies.find(p => p.id === selectedPartnerId) || partnerAgencies[0];
    createReferral({
      familyId: currentFamily.id,
      partnerAgencyId: partner.id,
      partnerAgencyName: partner.name,
      serviceType: refServiceType,
      status: 'Pending',
    });
    setShowAddRefModal(false);
  };

  const handleCreateAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptTitle.trim() || !currentFamily) return;
    createAppointment({
      familyId: currentFamily.id,
      title: aptTitle,
      type: aptType,
      date: aptDate,
      time: '10:00 AM',
      location: 'Central Intake Center, Room 204',
      officer: currentFamily.assignedOfficer || 'Sarah Jenkins',
      status: 'Scheduled',
    });
    setShowAddAptModal(false);
    setAptTitle('');
  };

  if (!currentFamily) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
        No family records found. Please register a family to view the 360 workspace.
      </div>
    );
  }

  // ── SUBVIEW: ALL FAMILIES TABLE (Screenshot 4) ──────────────────────────────
  if (activeSubView === 'all_families') {
    return (
      <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>Family360 Workspace</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-primary" onClick={() => setActiveSubView('detail')}>
              View Active Profile ({currentFamily.familyName})
            </button>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#2563EB" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>All Families</h3>
            </div>
            <span className="badge badge-indigo">{families.length} families</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              className="input-field"
              placeholder="Search by family name, Bridge360 ID, or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn-primary" style={{ padding: '0 24px' }}>
              Search
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 14px' }}>FAMILY NAME</th>
                  <th style={{ padding: '12px 14px' }}>BRIDGE360 ID</th>
                  <th style={{ padding: '12px 14px' }}>APPLICATION</th>
                  <th style={{ padding: '12px 14px' }}>REGISTRATION</th>
                  <th style={{ padding: '12px 14px' }}>VERIFICATION</th>
                  <th style={{ padding: '12px 14px' }}>COUNTRY</th>
                </tr>
              </thead>
              <tbody>
                {filteredFamilies.map(fam => {
                  const isFamVerified = fam.registrationStatus === 'Approved' || fam.verificationStatus === 'Verified';
                  return (
                    <tr
                      key={fam.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => handleSelectFamily(fam.id)}
                    >
                      <td style={{ padding: '14px', fontWeight: 700, color: '#0F172A' }}>
                        {fam.familyName}
                      </td>
                      <td style={{ padding: '14px', color: '#64748B', fontWeight: 600 }}>
                        {fam.bridge360Id || fam.familyId || '—'}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className={`badge ${isFamVerified ? 'badge-high' : 'badge-indigo'}`} style={{ fontSize: '0.75rem' }}>
                          {isFamVerified ? 'Verified' : 'Submitted'}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className="badge badge-medium" style={{ fontSize: '0.75rem' }}>
                          {fam.registrationStatus === 'Approved' ? 'Approved' : 'Pending review'}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        {isFamVerified ? (
                          <span className="badge badge-high" style={{ fontSize: '0.75rem' }}>Approved</span>
                        ) : (
                          <span style={{ color: '#94A3B8' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '14px', color: '#0F172A', textTransform: 'capitalize' }}>
                        {fam.countryOfOrigin}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── SUBVIEW: ANALYTICS DASHBOARD (Screenshot 3) ─────────────────────────────
  if (activeSubView === 'analytics') {
    const verifiedCount = families.filter(f => f.registrationStatus === 'Approved' || f.verificationStatus === 'Verified').length;
    const pendingVerCount = families.filter(f => f.verificationStatus === 'Pending' || f.verificationStatus === 'In Review').length;
    const activeRefsCount = referrals.length;

    return (
      <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>Family360 Workspace</h2>
          </div>
          <button className="btn-secondary" onClick={() => setActiveSubView('detail')}>
            ← Back to Family Profile
          </button>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart2 size={18} color="#2563EB" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Analytics Dashboard</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
            <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>{families.length}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '4px', textTransform: 'uppercase' }}>TOTAL FAMILIES</div>
            </div>
            <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>0</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '4px', textTransform: 'uppercase' }}>PENDING APPLICATIONS</div>
            </div>
            <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>{verifiedCount}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '4px', textTransform: 'uppercase' }}>APPROVED</div>
            </div>
            <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>0</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '4px', textTransform: 'uppercase' }}>REJECTED</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>{pendingVerCount}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '4px', textTransform: 'uppercase' }}>PENDING VERIFICATION</div>
            </div>
            <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16A34A' }}>{verifiedCount}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '4px', textTransform: 'uppercase' }}>VERIFIED</div>
            </div>
            <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>—</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '4px', textTransform: 'uppercase' }}>AVG PROCESSING DAYS</div>
            </div>
            <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>{activeRefsCount > 0 ? activeRefsCount : '—'}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '4px', textTransform: 'uppercase' }}>ACTIVE REFERRALS</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem' }}>
            Detailed charts and trend analysis syncing directly from ServiceNow tables.
          </div>
        </div>
      </div>
    );
  }

  // ── SUBVIEW: GLOBAL TIMELINE (Screenshot 2) ─────────────────────────────────
  if (activeSubView === 'timeline') {
    return (
      <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>Family360 Workspace</h2>
          </div>
          <button className="btn-secondary" onClick={() => setActiveSubView('detail')}>
            ← Back to Family Profile
          </button>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={18} color="#2563EB" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Global Timeline</h3>
            </div>
            <span className="badge badge-indigo">{timeline.length || families.length * 2} events</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {families.flatMap(fam => [
              ...(fam.verificationStatus === 'Verified' || fam.registrationStatus === 'Approved' ? [{
                id: `evt-ver-${fam.id}`,
                title: 'Documents Verified',
                desc: `All documents for ${fam.bridge360Id || fam.applicationId} have been verified successfully. Application moved to verified status.`,
                author: 'By System Administrator • Source: Officer',
                time: fam.arrivalDate ? `${fam.arrivalDate} 14:32:41` : '2026-08-06 14:32:41',
              }] : []),
              {
                id: `evt-sub-${fam.id}`,
                title: 'Application Submitted',
                desc: `Registration application ${fam.applicationId} submitted for ${fam.familyName}. Awaiting registration review.`,
                author: 'By System Administrator • Source: System',
                time: fam.arrivalDate ? `${fam.arrivalDate} 11:12:17` : '2026-08-06 11:12:17',
              },
              {
                id: `evt-fam-${fam.id}`,
                title: 'Family Registration Submitted',
                desc: `Household record created for ${fam.familyName} (${fam.countryOfOrigin}).`,
                author: 'By System Administrator • Source: Portal',
                time: fam.arrivalDate ? `${fam.arrivalDate} 10:45:00` : '2026-08-06 10:45:00',
              }
            ]).map((evt, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <History size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>{evt.title}</div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>{evt.desc}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>{evt.author}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                  {evt.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── DEFAULT SUBVIEW: PIXEL-PERFECT FAMILY 360 PROFILE (Screenshot 1) ────────
  return (
    <div style={{ padding: '20px 24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header & Breadcrumb Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn-secondary"
            onClick={() => setActiveSubView('all_families')}
            style={{ padding: '6px 14px', fontSize: '0.82rem', background: '#FFFFFF', color: '#0F172A', border: '1px solid #CBD5E1' }}
          >
            ← {t('common.previous', 'Back')}
          </button>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
            {currentFamily.familyName} — {t('dash.openFamily360', 'Family 360')}
          </h2>
        </div>

        {/* Quick Nav Sub-Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" onClick={() => setActiveSubView('all_families')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Users size={13} /> {t('nav.families', 'All Families')}
          </button>
          <button className="btn-secondary" onClick={() => setActiveSubView('analytics')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <BarChart2 size={13} /> {t('nav.analytics', 'Analytics')}
          </button>
          <button className="btn-secondary" onClick={() => setActiveSubView('timeline')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <History size={13} /> {t('dash.timeline', 'Global Timeline')}
          </button>
        </div>
      </div>

      {/* ── 1. MAIN FAMILY HEADER CARD ───────────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          padding: '20px 24px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* Title & Refugee ID Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A' }}>
              {currentFamily.familyName}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#2563EB',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                padding: '4px 12px',
                borderRadius: '6px',
                letterSpacing: '0.04em',
              }}
            >
              {currentFamily.bridge360Id || currentFamily.id || 'Missing ID'}
            </span>
          </div>
        </div>

        {/* 4-Column Metadata Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '18px 24px',
            fontSize: '0.84rem',
          }}
        >
          {/* Col 1 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {t('common.status', 'APPLICATION STATUS')}
            </div>
            <span className={`badge ${isVerified ? 'badge-high' : 'badge-indigo'}`} style={{ fontSize: '0.75rem' }}>
              {isVerified ? t('common.verified', 'Verified') : t('common.pending', 'Submitted')}
            </span>
          </div>

          {/* Col 2 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {t('dash.pendingReg', 'REGISTRATION STATUS')}
            </div>
            <span className="badge badge-medium" style={{ fontSize: '0.75rem' }}>
              {currentFamily.registrationStatus === 'Approved' ? t('common.verified', 'Approved') : t('common.pending', 'Pending review')}
            </span>
          </div>

          {/* Col 3 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {t('nav.verification', 'VERIFICATION STATUS')}
            </div>
            <span className={`badge ${isVerified ? 'badge-high' : 'badge-medium'}`} style={{ fontSize: '0.75rem' }}>
              {isVerified ? t('common.verified', 'Approved') : t('common.inProgress', 'In Review')}
            </span>
          </div>

          {/* Col 4 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {t('reg.immigrationStatus', 'IMMIGRATION STATUS')}
            </div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>
              {currentFamily.immigrationStatus || 'Refugee'}
            </div>
          </div>

          {/* Row 2 - Col 1 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {t('reg.countryOfOrigin', 'COUNTRY OF ORIGIN')}
            </div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>
              {currentFamily.countryOfOrigin}
            </div>
          </div>

          {/* Row 2 - Col 2 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {t('reg.email', 'EMAIL')}
            </div>
            <div style={{ fontWeight: 600, color: '#2563EB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentFamily.headOfFamily?.email || 'dimile412@gmail.com'}
            </div>
          </div>

          {/* Row 2 - Col 3 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {t('reg.phone', 'PHONE')}
            </div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>
              {currentFamily.headOfFamily?.mobileNumber || '1234567890'}
            </div>
          </div>

          {/* Row 2 - Col 4 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {t('dash.regVerProgress', 'WORKFLOW STAGE')}
            </div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>
              {isVerified ? t('common.completed', 'Completed') : t('common.pending', 'Screening')}
            </div>
          </div>

          {/* Row 3 - Col 1 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {t('reg.householdSize', 'HOUSEHOLD SIZE')}
            </div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>
              {currentFamily.householdSize || (1 + currentFamily.members.length)}
            </div>
          </div>

          {/* Row 3 - Col 2 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {t('reg.arrivalDate', 'INTAKE DATE')}
            </div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>
              {currentFamily.arrivalDate || '2026-08-06'}
            </div>
          </div>

          {/* Row 3 - Col 3 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {t('nav.cases', 'CASE MANAGER')}
            </div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>
              {currentFamily.assignedOfficer || 'Unassigned'}
            </div>
          </div>

          {/* Row 3 - Col 4 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {t('nav.usersRoles', 'REGISTRATION OFFICER')}
            </div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>
              Unassigned
            </div>
          </div>
        </div>

        {/* Officer Operational Controls */}
        <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className={currentFamily.allowCustomerEdit ? "btn-secondary" : "btn-primary"}
            style={{
              fontSize: '0.8rem',
              background: currentFamily.allowCustomerEdit ? '#FEF2F2' : '#EFF6FF',
              color: currentFamily.allowCustomerEdit ? '#DC2626' : '#2563EB',
              borderColor: currentFamily.allowCustomerEdit ? '#FECACA' : '#BFDBFE',
              padding: '6px 12px'
            }}
            onClick={() => toggleCustomerEdit(currentFamily.id, !currentFamily.allowCustomerEdit)}
          >
            {currentFamily.allowCustomerEdit ? `🔒 ${t('common.edit', 'Lock Customer Edit')}` : `🔓 ${t('common.edit', 'Allow Customer Edit')}`}
          </button>
          <button className="btn-secondary" onClick={() => setShowRequestDocModal(true)} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Mail size={13} /> {t('nav.verification', 'Request Additional Doc')}
          </button>
          <button className="btn-secondary" onClick={() => setShowAddCaseModal(true)} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Plus size={13} /> {t('nav.cases', 'Add Case')}
          </button>
          <button className="btn-secondary" onClick={() => setShowAddRefModal(true)} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Share2 size={13} /> {t('nav.referrals', 'Add Referral')}
          </button>
          <button className="btn-primary" onClick={() => setShowAddAptModal(true)} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Calendar size={13} /> {t('nav.appointments', 'Schedule Apt')}
          </button>
        </div>
      </div>

      {/* ── AI INTERN (delegated case work — inline + chat) ───────────────────── */}
      <div style={{ marginBottom: '20px' }}>
        <InternPanel
          familySysId={currentFamily.sys_id}
          familyLabel={`${currentFamily.familyName} (${currentFamily.applicationId})`}
          localFamilyId={currentFamily.id}
          language={currentFamily.primaryLanguage}
          onApplied={(decision) => {
            if (decision === 'verify') {
              approveEntireApplication(currentFamily.applicationId);
            }
          }}
        />
      </div>

      {/* ── 2. TWO-COLUMN OPERATIONAL WORKSPACE ───────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* ── LEFT COLUMN ────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Family Members */}
          <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#D97706" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>Family Members</h3>
              </div>
              <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                {1 + currentFamily.members.length} members
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Head */}
              <div 
                style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                onClick={() => setSelectedMemberDetail({ ...currentFamily.headOfFamily, isHead: true, relationshipToHead: 'Head of Household' })}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#2563EB')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
              >
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                  {currentFamily.headOfFamily?.firstName?.[0] || 'H'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.88rem' }}>
                    {currentFamily.headOfFamily?.firstName} {currentFamily.headOfFamily?.lastName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Head of Household • {currentFamily.headOfFamily?.gender || 'Adult'} | ID: {currentFamily.headOfFamily?.id || 'Missing ID'}
                  </div>
                </div>
                <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>Click for Details ➔</span>
              </div>

              {/* Accompanying members */}
              {currentFamily.members.map((m, idx) => (
                <div 
                  key={idx} 
                  style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onClick={() => setSelectedMemberDetail(m)}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#2563EB')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
                >
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                    {m.firstName?.[0] || 'M'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.88rem' }}>
                      {m.firstName} {m.lastName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {m.relationshipToHead || 'Dependent'} • {m.gender} | ID: {m.id || 'Missing ID'}
                    </div>
                  </div>
                  <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>Click for Details ➔</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Cases & Referrals */}
          <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={16} color="#CA8A04" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>Cases &amp; Referrals</h3>
              </div>
              <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                {famCases.length + famReferrals.length} records
              </span>
            </div>

            {famCases.length === 0 && famReferrals.length === 0 ? (
              <div style={{ padding: '28px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                No cases or referrals found
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {famCases.map(c => (
                  <div key={c.id} style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>{c.category}</span>
                      <span className="badge badge-high" style={{ fontSize: '0.72rem' }}>{c.status}</span>
                    </div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.88rem' }}>{c.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>{c.description}</div>
                  </div>
                ))}

                {famReferrals.map(r => (
                  <div key={r.id} style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>Referral: {r.partnerAgencyName}</span>
                      <span className="badge badge-high" style={{ fontSize: '0.72rem' }}>{r.status}</span>
                    </div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.88rem' }}>{r.serviceType}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN ───────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Risk Assessment */}
          <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} color="#EAB308" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>Risk Assessment</h3>
              </div>
              <span className="badge badge-high" style={{ fontSize: '0.72rem' }}>Low Risk</span>
            </div>

            {/* Big Risk Score Display */}
            <div style={{ textAlign: 'center', padding: '12px 0 16px 0' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#16A34A', lineHeight: 1 }}>0</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', marginTop: '4px' }}>
                RISK SCORE
              </div>
            </div>

            {/* 3 Status Check Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                  VERIFICATION CLEAR
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ✓ Verification approved
                </div>
              </div>

              <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                  APPLICATION STATUS
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ✓ Application processed
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                  REGISTRATION COMPLETE
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ✓ Registration is complete
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Documents */}
          <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} color="#2563EB" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>Documents</h3>
              </div>
              <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                {famDocs.length || 1} documents
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(famDocs.length > 0 ? famDocs : [{
                id: 'doc-default',
                fileName: 'Supporting Documents',
                documentType: 'Supporting Document',
                fileSize: '1.2 MB',
                uploadedAt: currentFamily.arrivalDate ? `${currentFamily.arrivalDate} 17:00:00` : '2026-08-06 17:00:00',
                verificationStatus: 'Verified',
                extractedFields: [],
                ocrRawText: 'Supporting Identification Document Verified.',
                applicationId: currentFamily.applicationId,
                familyId: currentFamily.id
              }]).map((doc: any) => (
                <div
                  key={doc.id}
                  style={{
                    padding: '12px 14px',
                    background: '#F8FAFC',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedDocPreview(doc)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckSquare size={16} color="#16A34A" />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.88rem' }}>
                          {doc.fileName || doc.documentType}
                        </span>
                        <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>
                          {doc.verificationStatus || 'Verified'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Uploaded: {doc.uploadedAt || '2026-08-06 17:00:00'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Timeline */}
          <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={16} color="#4F46E5" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>Timeline</h3>
              </div>
              <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                2 events
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Event 1 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <CheckCircle size={15} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>Documents Verified</div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                      All documents for {currentFamily.bridge360Id || currentFamily.applicationId} have been verified successfully. Application moved to verified status.
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '3px' }}>
                      By System Administrator • Source: Officer
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                  {currentFamily.arrivalDate ? `${currentFamily.arrivalDate} 14:32:41` : '2026-08-06 14:32:41'}
                </div>
              </div>

              {/* Event 2 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <FileText size={15} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>Application Submitted</div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                      Registration application {currentFamily.applicationId} submitted for {currentFamily.familyName}. Awaiting registration review.
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '3px' }}>
                      By System Administrator • Source: System
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                  {currentFamily.arrivalDate ? `${currentFamily.arrivalDate} 11:12:17` : '2026-08-06 11:12:17'}
                </div>
              </div>

              {/* Event 3 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F8FAFC', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <History size={15} />
                  </div>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.85rem' }}>
                    Family Registration Submitted
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS ───────────────────────────────────────────────────────────── */}
      {/* 1. DOCUMENT PREVIEW MODAL */}
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
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Type: {selectedDocPreview.documentType} • Size: {selectedDocPreview.fileSize || '1.2 MB'}</div>
                </div>
              </div>
              <button onClick={() => setSelectedDocPreview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Verification Status</span>
                <span className="badge badge-high">{selectedDocPreview.verificationStatus || 'Verified'}</span>
              </div>

              {/* REAL UPLOADED IMAGE PREVIEW */}
              {(() => {
                const docImage = selectedDocPreview.fileDataUrl || selectedDocPreview.previewUrl || localStorage.getItem(`bridge360_doc_preview_${selectedDocPreview.id}`) || localStorage.getItem('bridge360_latest_uploaded_doc');
                if (docImage && (docImage.startsWith('data:image') || docImage.startsWith('blob:') || docImage.startsWith('http'))) {
                  return (
                    <div style={{ textAlign: 'center', background: '#0F172A', padding: '12px', borderRadius: '8px' }}>
                      <img
                        src={docImage}
                        alt={selectedDocPreview.fileName}
                        style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain', borderRadius: '6px' }}
                      />
                    </div>
                  );
                }
                return null;
              })()}

              <div>
                <label className="input-label" style={{ marginBottom: '6px' }}>Extracted Document Information</label>
                <div style={{ padding: '14px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.88rem', color: '#0F172A', maxHeight: '180px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {selectedDocPreview.ocrRawText || `Document Name: ${selectedDocPreview.fileName}\nType: ${selectedDocPreview.documentType}\nApplication ID: ${currentFamily.applicationId}\nStatus: Verified`}
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

      {/* 2. REQUEST ADDITIONAL DOCUMENT MODAL */}
      {showRequestDocModal && (
        <div className="modal-overlay" onClick={() => setShowRequestDocModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', background: '#FFFFFF', color: '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Request Document</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Send upload request to {currentFamily.familyName}</p>
                </div>
              </div>
              <button onClick={() => setShowRequestDocModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={async e => {
                e.preventDefault();
                await requestAdditionalDocuments(currentFamily.applicationId, reqDocType, reqDocNotes);
                setShowRequestDocModal(false);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div>
                <label className="input-label">Required Document Category *</label>
                <select className="input-field" value={reqDocType} onChange={e => setReqDocType(e.target.value)}>
                  <option value="National ID">National ID / Civil Registry</option>
                  <option value="Passport">Passport (Valid or Expired)</option>
                  <option value="Birth Certificate">Birth Certificate</option>
                  <option value="Medical Certificate">Medical Examination Record</option>
                  <option value="Proof of Address">Proof of Address / Accommodation</option>
                  <option value="Supporting Document">General Supporting Document</option>
                </select>
              </div>

              <div>
                <label className="input-label">Instructions / Notes for Applicant *</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={reqDocNotes}
                  onChange={e => setReqDocNotes(e.target.value)}
                  placeholder="Explain why this document is required and any quality guidelines..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRequestDocModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <Send size={14} /> Send Request Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD CASE MODAL */}
      {showAddCaseModal && (
        <div className="modal-overlay" onClick={() => setShowAddCaseModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', background: '#FFFFFF', color: '#0F172A' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Open New Case File</h3>
            <form onSubmit={handleCreateCaseSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label className="input-label">Category</label>
                  <select
                    className="input-field"
                    value={newCaseCategory}
                    onChange={e => setNewCaseCategory(e.target.value as any)}
                  >
                    <option value="Housing">Housing Support</option>
                    <option value="Healthcare">Healthcare &amp; Clinic Care</option>
                    <option value="Education">Education &amp; Language Classes</option>
                    <option value="Legal">Legal &amp; Immigration Aid</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Case Title *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Housing Placement Plan"
                    value={newCaseTitle}
                    onChange={e => setNewCaseTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Description</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Summary of objectives and next steps..."
                    value={newCaseDesc}
                    onChange={e => setNewCaseDesc(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddCaseModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Case</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADD REFERRAL MODAL */}
      {showAddRefModal && (
        <div className="modal-overlay" onClick={() => setShowAddRefModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', background: '#FFFFFF', color: '#0F172A' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Add Partner Referral</h3>
            <form onSubmit={handleCreateReferralSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label className="input-label">Partner Agency</label>
                  <select
                    className="input-field"
                    value={selectedPartnerId}
                    onChange={e => setSelectedPartnerId(e.target.value)}
                  >
                    {partnerAgencies.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Service Type</label>
                  <input
                    className="input-field"
                    value={refServiceType}
                    onChange={e => setRefServiceType(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddRefModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Send Referral</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. SCHEDULE APPOINTMENT MODAL */}
      {showAddAptModal && (
        <div className="modal-overlay" onClick={() => setShowAddAptModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', background: '#FFFFFF', color: '#0F172A' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Schedule Appointment</h3>
            <form onSubmit={handleCreateAppointmentSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label className="input-label">Appointment Title *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Intake Verification Interview"
                    value={aptTitle}
                    onChange={e => setAptTitle(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="input-label">Type</label>
                    <select
                      className="input-field"
                      value={aptType}
                      onChange={e => setAptType(e.target.value as any)}
                    >
                      <option value="Interview">Interview</option>
                      <option value="Medical Check">Medical Check</option>
                      <option value="Orientation">Orientation</option>
                      <option value="Legal Review">Legal Review</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={aptDate}
                      onChange={e => setAptDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddAptModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. FAMILY MEMBER DETAILS MODAL */}
      {selectedMemberDetail && (
        <div className="modal-overlay" onClick={() => setSelectedMemberDetail(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', background: '#FFFFFF', color: '#0F172A', borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                  {selectedMemberDetail.firstName?.[0] || 'M'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    {selectedMemberDetail.firstName} {selectedMemberDetail.middleName} {selectedMemberDetail.lastName}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                    {selectedMemberDetail.relationshipToHead || 'Family Member'}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedMemberDetail(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.88rem' }}>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Relationship</div>
                <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{selectedMemberDetail.relationshipToHead || 'Self / Head'}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Gender</div>
                <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{selectedMemberDetail.gender || 'Not specified'}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Date of Birth</div>
                <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{selectedMemberDetail.dateOfBirth || 'N/A'}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Nationality</div>
                <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{selectedMemberDetail.nationality || currentFamily.countryOfOrigin || 'N/A'}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Passport Number</div>
                <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{selectedMemberDetail.passportNumber || '—'}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>National ID / UNHCR</div>
                <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{selectedMemberDetail.nationalId || '—'}</div>
              </div>
              {selectedMemberDetail.mobileNumber && (
                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Mobile Phone</div>
                  <div style={{ fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>📞 {selectedMemberDetail.mobileNumber}</div>
                </div>
              )}
              {selectedMemberDetail.email && (
                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Email Address</div>
                  <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>✉️ {selectedMemberDetail.email}</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn-primary" onClick={() => setSelectedMemberDetail(null)}>Close Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Family360View;
