import React, { useState } from 'react';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Briefcase,
  Share2,
  Building,
  Calendar,
  ShieldCheck,
  BarChart2,
  Shield,
  Settings,
  Info,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Layers,
  LogOut
} from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';
import { useAssistant, type AgentRun } from '../../store/AssistantContext';
import { Bridge360Logo } from '../common/Bridge360Logo';

interface AdminSidebarProps {
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  const { adminView, setAdminView, setSelectedFamilyId, partnerAgencies, referrals, t } = useBridge360();
  const {
    setProactiveMessage, setProactiveAction, playAnimation, addAgentRun, updateAgentRun,
    dispatchToAssistant, reportActivity,
  } = useAssistant();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const runSlotAvailabilityAudit = async () => {
    setProactiveAction(null);
    setProactiveMessage('Checking the partner-capacity data currently listed in Bridge360. This will not contact or book a partner.');
    reportActivity('action', 'Started partner capacity snapshot');
    playAnimation('think');

    const stages: AgentRun['stages'] = [
      { id: 'triage', label: 'Scout · Open referral demand', status: 'pending' },
      { id: 'docs', label: 'Prism · Group listed capacity', status: 'pending' },
      { id: 'completeness', label: 'Ledger · Validate capacity values', status: 'pending' },
      { id: 'support', label: 'Beacon · Identify constrained services', status: 'pending' },
      { id: 'risk', label: 'Aegis · Check availability source', status: 'pending' },
      { id: 'decision', label: 'Quill · Prepare a read-only summary', status: 'pending' },
    ];
    const runId = `capacity-audit-${Date.now()}`;
    addAgentRun({
      id: runId,
      title: 'Partner capacity snapshot',
      status: 'running',
      stages,
      startedAt: Date.now(),
    });

    const openReferrals = referrals.filter(referral =>
      referral.status === 'Pending' || referral.status === 'In Progress',
    );
    const activeAgencies = partnerAgencies.filter(agency => agency.status === 'Active');
    const capacityByType = new Map<string, number>();
    let totalListedSlots = 0;
    let invalidCapacityCount = 0;
    let zeroCapacityCount = 0;
    let summary = '';
    const stageDisplayDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 320;

    const runStage = async (stageId: string, check: () => string) => {
      const activeStages = stages.map(stage => ({
        ...stage,
        status: stage.id === stageId ? 'active' as const : stage.status,
      }));
      updateAgentRun(runId, { stages: activeStages });
      await new Promise<void>(resolve => window.requestAnimationFrame(() => resolve()));
      if (stageDisplayDelay) {
        await new Promise<void>(resolve => window.setTimeout(resolve, stageDisplayDelay));
      }
      const detail = check();
      const completedStages = stages.map(stage => ({
        ...stage,
        status: stage.id === stageId ? 'done' as const : stage.status,
        detail: stage.id === stageId ? detail : stage.detail,
      }));
      stages.splice(0, stages.length, ...completedStages);
      updateAgentRun(runId, { stages: completedStages });
      await new Promise<void>(resolve => window.requestAnimationFrame(() => resolve()));
    };

    try {
      await runStage('triage', () => `${openReferrals.length} referrals are Pending or In Progress.`);
      await runStage('docs', () => {
        for (const agency of activeAgencies) {
          if (Number.isFinite(agency.availableCapacity) && agency.availableCapacity > 0) {
            capacityByType.set(agency.type, (capacityByType.get(agency.type) || 0) + agency.availableCapacity);
            totalListedSlots += agency.availableCapacity;
          }
        }
        return `${activeAgencies.length} active agencies; ${totalListedSlots} positive-capacity slots are listed.`;
      });
      await runStage('completeness', () => {
        invalidCapacityCount = partnerAgencies.filter(agency =>
          !Number.isFinite(agency.availableCapacity) || agency.availableCapacity < 0,
        ).length;
        zeroCapacityCount = activeAgencies.filter(agency => agency.availableCapacity === 0).length;
        return invalidCapacityCount
          ? `${invalidCapacityCount} agency capacity value(s) need review.`
          : `${zeroCapacityCount} active agency/ies list zero capacity; remaining values are valid.`;
      });
      await runStage('support', () => {
        const availableTypes = [...capacityByType.keys()];
        const unavailableTypes = [...new Set(activeAgencies
          .filter(agency => agency.availableCapacity === 0)
          .map(agency => agency.type))];
        return `${availableTypes.length} service type(s) have listed capacity; zero-capacity active types: ${unavailableTypes.join(', ') || 'none'}.`;
      });
      await runStage('risk', () => 'This is stored Bridge360 capacity data; no live partner availability endpoint is connected.');
      await runStage('decision', () => {
        summary = `${activeAgencies.filter(agency => agency.availableCapacity > 0).length} active agencies list ${totalListedSlots} slots for ${openReferrals.length} open referral(s).`;
        return 'Read-only summary prepared. No referrals or partner records were changed.';
      });

      const resultSummary = `${summary} Stored dashboard data only; confirm availability with partners before placement.`;
      updateAgentRun(runId, {
        status: 'completed',
        resultSummary,
      });
      setProactiveMessage(null);
      setProactiveAction(null);
      reportActivity('action', 'Completed partner capacity snapshot');
      playAnimation('nod');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      updateAgentRun(runId, { status: 'error', resultSummary: `Capacity snapshot failed: ${message}` });
      setProactiveMessage(null);
      setProactiveAction(null);
      reportActivity('error', 'Partner capacity snapshot failed');
      console.error('Partner capacity snapshot failed.', error);
    }
  };

  const menuItems = [
    { key: 'dashboard', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard },
    { key: 'register', label: t('nav.registerFamily', 'Register Family'), icon: UserPlus },
    { key: 'family360', label: t('nav.families', 'Families'), icon: Users },
    { key: 'cases', label: t('nav.cases', 'Cases'), icon: Briefcase },
    { key: 'referrals', label: t('nav.referrals', 'Referrals'), icon: Share2 },
    { key: 'tickets', label: t('nav.tickets', 'Support Tickets'), icon: MessageSquare },
    { key: 'partner_agencies', label: t('nav.partnerAgencies', 'Partner Agencies'), icon: Building },
    { key: 'appointments', label: t('nav.appointments', 'Appointments'), icon: Calendar },
    { key: 'verification', label: t('nav.verification', 'Documents / Verification'), icon: ShieldCheck },
    { key: 'analytics', label: t('nav.analytics', 'Reports & Analytics'), icon: BarChart2 },
    { key: 'users_roles', label: t('nav.usersRoles', 'Users & Roles'), icon: Shield },
    { key: 'settings', label: t('nav.settings', 'Info'), icon: Info },
  ];

  return (
    <aside
      style={{
        width: collapsed ? '70px' : '240px',
        background: '#0F172A',
        color: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'width 0.2s ease',
        flexShrink: 0,
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div>
        {/* Logo Header */}
        <div
          style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: '#0B1120',
          }}
        >
          <Bridge360Logo size={36} />
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Bridge<span style={{ color: '#60A5FA' }}>360</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('app.adminOperations', 'Admin Operations')}
              </div>
            </div>
          )}
        </div>

        {/* Menu Navigation Items */}
        <nav style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = adminView === item.key || (item.key === 'analytics' && adminView === 'reports');

            return (
              <button
                key={item.key}
                onClick={() => {
                  setAdminView(item.key as any);
                  setProactiveMessage(null);
                  setProactiveAction(null);
                  if (item.key === 'family360') {
                    setSelectedFamilyId(null);
                    setProactiveMessage("Shall I summarize the active caseload and flag urgent families for review?");
                    setProactiveAction([
                      { 
                        label: 'Summarize caseload',
                        primary: true,
                        onClick: () => { 
                          setProactiveMessage(null);
                          setProactiveAction(null);
                          dispatchToAssistant('Provide a read-only summary of the active Bridge360 caseload, highlighting aggregate workload and safe next steps. Do not change records or approvals.');
                        } 
                      },
                      {
                        label: 'No thanks',
                        onClick: () => {
                          setProactiveMessage(null);
                          setProactiveAction(null);
                          reportActivity('action', 'Dismissed caseload suggestion');
                        }
                      }
                    ]);
                    playAnimation('wave');
                  } else if (item.key === 'referrals') {
                    setProactiveMessage('Shall I review the capacity currently listed for partner agencies? This uses Bridge360 data only; it does not contact partners.');
                    setProactiveAction([
                      { 
                        label: 'Check listed capacity',
                        primary: true,
                        onClick: () => { void runSlotAvailabilityAudit(); },
                      },
                      {
                        label: 'No thanks',
                        onClick: () => {
                          setProactiveMessage(null);
                          setProactiveAction(null);
                          reportActivity('action', 'Dismissed referral capacity suggestion');
                        }
                      }
                    ]);
                    playAnimation('point');
                  } else {
                    // Standard greetings
                    if (item.key === 'register') {
                      setProactiveMessage("Ready to guide a new family through registration.");
                      playAnimation('nod');
                    } else if (item.key === 'cases') {
                      setProactiveMessage("Caseload loaded. Let's see who needs attention today.");
                      playAnimation('alert');
                    }
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  background: isActive ? '#2563EB' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#1E293B';
                    e.currentTarget.style.color = '#F8FAFC';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                  }
                }}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={19} style={{ flexShrink: 0, color: isActive ? '#FFFFFF' : '#60A5FA' }} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapse Sidebar and Logout */}
      <div style={{ padding: '14px 10px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: '#0B1120', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'transparent',
              color: '#EF4444',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
            }}
            title={collapsed ? "Log Out" : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>{t('nav.logout', 'Log Out')}</span>}
          </button>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'transparent',
            color: '#94A3B8',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#1E293B';
            e.currentTarget.style.color = '#F8FAFC';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#94A3B8';
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /> <span>{t('nav.collapseNav', 'Collapse Navigation')}</span></>}
        </button>
      </div>
    </aside>
  );
};
