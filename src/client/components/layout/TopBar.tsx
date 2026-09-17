import React from 'react';
import { Search, Bell, Menu, Shield } from 'lucide-react';
import { NavTab } from '../../types';
import { Input } from '../common/Input';
import { Avatar } from '../common/Avatar';
import { Dropdown } from '../common/Dropdown';
import { useToast } from '../common/Toast';

export interface TopBarProps {
  activeTab: NavTab;
  onToggleSidebar?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onLogout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onLogout,
}) => {
  const { showToast } = useToast();

  const getPageTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard': return 'Application Dashboard';
      case 'applications': return 'Registration Applications';
      case 'documents': return 'Document Management';
      case 'families': return 'Family Groups';
      case 'extraction': return 'AI Extraction Engine';
      case 'verification': return 'Document Field Verification';
      case 'wizard': return 'Registration Wizard';
      case 'settings': return 'System Settings';
      default: return 'Bridge360';
    }
  };

  const handleNotificationClick = () => {
    showToast('info', 'Notifications', 'You have 3 pending verification tasks requiring review.');
  };

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--color-white)',
        borderBottom: '1px solid var(--color-neutral-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Left: Mobile Toggle & Page Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-neutral-600)',
              cursor: 'pointer',
              display: 'flex',
              padding: '6px',
            }}
            aria-label="Toggle Navigation"
          >
            <Menu size={20} />
          </button>
        )}

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy-900)' }}>
            {getPageTitle(activeTab)}
          </h2>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <Input
          placeholder="Search applications, applicants, documents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </div>

      {/* Right: Actions, Notifications, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Environment Indicator */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--color-primary-800)',
            backgroundColor: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-100)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <Shield size={12} />
          ServiceNow SDK 4.10.1
        </span>

        {/* Notifications Button */}
        <button
          onClick={handleNotificationClick}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            color: 'var(--color-neutral-600)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Notifications"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-error-solid)',
            }}
          />
        </button>

        {/* User Dropdown */}
        <Dropdown
          trigger={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar name="Prawin Balaji" size="sm" />
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-navy-800)' }}>
                Prawin Balaji
              </span>
            </div>
          }
          items={[
            { id: 'profile', label: 'User Profile', onClick: () => showToast('info', 'Profile', 'Logged in as Prawin Balaji (System Admin)') },
            { id: 'instance', label: 'ServiceNow Scope: Global', onClick: () => showToast('info', 'ServiceNow Scope', 'Application Scope ID: 09159ba347aa8310b519b4b4116d43b9') },
            { id: 'logout', label: 'Sign Out', danger: true, onClick: onLogout || (() => showToast('warning', 'Sign Out', 'Sign out requested')) },
          ]}
        />
      </div>
    </header>
  );
};
