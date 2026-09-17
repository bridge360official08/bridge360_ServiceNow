import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Files, 
  Users, 
  Cpu, 
  CheckSquare, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  PlusCircle
} from 'lucide-react';
import { NavTab } from '../../types';
import { Avatar } from '../common/Avatar';

export interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'applications', label: 'Applications', icon: <FileText size={18} />, badge: '6' },
    { id: 'documents', label: 'Documents', icon: <Files size={18} />, badge: '5' },
    { id: 'families', label: 'Families', icon: <Users size={18} /> },
    { id: 'extraction', label: 'Extraction', icon: <Cpu size={18} /> },
    { id: 'verification', label: 'Verification', icon: <CheckSquare size={18} />, badge: '12' },
    { id: 'wizard', label: 'New Application', icon: <PlusCircle size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '72px' : '250px',
        height: '100vh',
        backgroundColor: 'var(--color-navy-900)',
        color: 'var(--color-white)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'width var(--transition-normal)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        userSelect: 'none',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: '64px',
          padding: isCollapsed ? '0 16px' : '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-white)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <ShieldCheck size={20} />
          </div>
          {!isCollapsed && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-white)', letterSpacing: '-0.01em' }}>
                Bridge360
              </h2>
              <span style={{ fontSize: '10px', color: 'var(--color-neutral-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ServiceNow AI Shell
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-neutral-400)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
            }}
            title="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                width: '100%',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                padding: isCollapsed ? '0' : '0 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isActive ? 'var(--color-primary-600)' : 'transparent',
                color: isActive ? 'var(--color-white)' : 'var(--color-neutral-300)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                transition: 'all var(--transition-fast)',
              }}
              title={isCollapsed ? item.label : undefined}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                    color: 'var(--color-white)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse button when collapsed */}
      {isCollapsed && (
        <div style={{ padding: '12px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onToggleCollapse}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-neutral-400)',
              cursor: 'pointer',
              padding: '6px',
            }}
            title="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* User Profile Footer */}
      <div
        style={{
          padding: isCollapsed ? '12px 0' : '16px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: '12px',
        }}
      >
        <Avatar name="Prawin Balaji" size="sm" statusDot />
        {!isCollapsed && (
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-white)', whiteSpace: 'nowrap' }}>
              Prawin Balaji
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', display: 'block' }}>
              System Admin
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
