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
import { useAssistant } from '../../store/AssistantContext';
import { Bridge360Logo } from '../common/Bridge360Logo';

interface AdminSidebarProps {
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  const { adminView, setAdminView, setSelectedFamilyId, t } = useBridge360();
  const { setProactiveMessage, setProactiveAction, playAnimation } = useAssistant();
  const [collapsed, setCollapsed] = useState<boolean>(false);

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
                  if (item.key === 'family360') {
                    setSelectedFamilyId(null);
                    setProactiveMessage("Shall I summarize the active caseload and flag urgent families for review?");
                    setProactiveAction([
                      { 
                        label: 'Okay',
                        primary: true,
                        onClick: () => { 
                          setProactiveMessage("I am preparing the summary now!"); 
                          playAnimation('think'); 
                        } 
                      },
                      {
                        label: 'Reject',
                        onClick: () => {
                          setProactiveMessage("Understood, I'll be here if you need me.");
                          playAnimation('nod');
                        }
                      }
                    ]);
                    playAnimation('wave');
                  } else if (item.key === 'referrals') {
                    setProactiveMessage("Shall I check for available partner agency slots for the new referrals?");
                    setProactiveAction([
                      { 
                        label: 'Check Slots',
                        primary: true,
                        onClick: () => { 
                          setProactiveMessage("Checking slots with partners..."); 
                          playAnimation('think'); 
                        } 
                      },
                      {
                        label: 'Reject',
                        onClick: () => {
                          setProactiveMessage("Let me know if you need to check them later.");
                          playAnimation('nod');
                        }
                      }
                    ]);
                    playAnimation('point');
                  } else {
                    // Clear action for other generic tabs
                    setProactiveAction(null);
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
