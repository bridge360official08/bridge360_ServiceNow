import React, { useState } from 'react';
import { Search, Bell, Eye, ChevronRight, Globe } from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';
import { SUPPORTED_LANGUAGES } from '../../utils/i18n';

export const AdminHeader: React.FC = () => {
  const {
    adminView,
    setAdminView,
    setActivePortal,
    families,
    setSelectedFamilyId,
    notifications,
    setNotifications,
    markNotificationRead,
    language,
    setLanguage,
    t,
  } = useBridge360();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);

  const adminNotifs = notifications.filter(n => n.recipient === 'admin');
  const unreadAdminNotifs = adminNotifs.filter(n => !n.read);

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const lower = q.toLowerCase();
    const matches = families.filter(
      f =>
        f.familyName.toLowerCase().includes(lower) ||
        f.bridge360Id.toLowerCase().includes(lower) ||
        f.applicationId.toLowerCase().includes(lower) ||
        f.headOfFamily.firstName.toLowerCase().includes(lower)
    );
    setSearchResults(matches);
    setShowSearchDropdown(true);
  };

  const getBreadcrumbLabel = () => {
    switch (adminView) {
      case 'dashboard': return t('nav.dashboard', 'Dashboard');
      case 'register': return t('nav.registerFamily', 'Register Family');
      case 'family360': return t('nav.families', 'Families / Family 360');
      case 'cases': return t('nav.cases', 'Cases');
      case 'referrals': return t('nav.referrals', 'Referrals');
      case 'partner_agencies': return t('nav.partnerAgencies', 'Partner Agencies');
      case 'appointments': return t('nav.appointments', 'Appointments');
      case 'verification': return t('nav.verification', 'Documents & Verification');
      case 'analytics': return t('nav.analytics', 'Reports & Analytics');
      case 'users_roles': return t('nav.usersRoles', 'Users & Roles');
      case 'settings': return t('nav.settings', 'System Info');
      default: return t('nav.dashboard', 'Dashboard');
    }
  };

  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        height: '64px',
      }}
    >
      {/* Title & Breadcrumbs */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
          {getBreadcrumbLabel()}
        </h2>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
          <span 
            onClick={() => setAdminView('dashboard')} 
            style={{ cursor: 'pointer', textDecoration: 'none', color: '#2563EB', fontWeight: 600 }}
            title="Go to Home Dashboard"
          >
            {t('nav.home', 'Home')}
          </span> 
          <ChevronRight size={12} /> 
          <span 
            onClick={() => setAdminView(adminView)} 
            style={{ cursor: 'pointer', fontWeight: 600 }}
          >
            {getBreadcrumbLabel()}
          </span>
        </div>
      </div>

      {/* Center Top Search Bar */}
      <div style={{ position: 'relative', width: '380px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-sub)' }} />
          <input
            className="input-field"
            placeholder={t('nav.searchPlaceholder', 'Search families, RID, APP-ID...')}
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            style={{ paddingLeft: '36px', height: '36px', fontSize: '0.85rem', background: '#F8FAFC', borderRadius: '20px' }}
          />
        </div>

        {showSearchDropdown && searchResults.length > 0 && (
          <div className="glass-card" style={{ position: 'absolute', top: '42px', left: 0, right: 0, zIndex: 200, padding: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {searchResults.map(f => (
              <div
                key={f.id}
                style={{ padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}
                onClick={() => {
                  setSelectedFamilyId(f.id);
                  setAdminView('family360');
                  setShowSearchDropdown(false);
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{f.familyName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{f.bridge360Id} • {f.countryOfOrigin}</div>
                </div>
                <span className="badge badge-indigo">{f.registrationStatus}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Utilities & Profile Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
        <div
          style={{ position: 'relative', cursor: 'pointer', padding: '6px', borderRadius: '8px', background: showNotifDropdown ? '#EFF6FF' : 'transparent' }}
          onClick={() => setShowNotifDropdown(!showNotifDropdown)}
        >
          <Bell size={20} style={{ color: showNotifDropdown ? '#2563EB' : '#64748B' }} />
          {unreadAdminNotifs.length > 0 && (
            <span style={{ position: 'absolute', top: '2px', right: '2px', background: '#EF4444', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.68rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {unreadAdminNotifs.length}
            </span>
          )}
        </div>

        {/* Notifications Dropdown Modal */}
        {showNotifDropdown && (
          <div
            style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '380px',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              zIndex: 300,
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>Notifications &amp; Alerts</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="badge badge-indigo">{adminNotifs.length} Total</span>
                {adminNotifs.length > 0 && (
                  <button 
                    onClick={() => {
                      setNotifications(prev => prev.filter(n => n.recipient !== 'admin'));
                    }}
                    style={{ fontSize: '0.72rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontWeight: 700, color: '#EF4444' }}
                    title="Clear all notifications"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
              {adminNotifs.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                  No new notifications.
                </div>
              ) : (
                adminNotifs.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px 12px',
                      background: n.read ? '#F8FAFC' : '#EFF6FF',
                      border: n.read ? '1px solid #E2E8F0' : '1px solid #BFDBFE',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.link) setAdminView(n.link as any);
                      setShowNotifDropdown(false);
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{n.title}</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 400 }}>{n.timestamp}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px', lineHeight: 1.4 }}>
                      {n.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Multi-Language Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              position: 'relative',
              transition: 'all 0.2s',
            }}
          >
            <Globe size={18} />
          </button>
          {showLangDropdown && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '200px',
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '1px solid #E2E8F0',
              zIndex: 100,
              padding: '8px'
            }}>
              {SUPPORTED_LANGUAGES.map(lang => (
                <div
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    setShowLangDropdown(false);
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: language === lang.code ? '#EFF6FF' : 'transparent',
                    color: language === lang.code ? '#2563EB' : '#0F172A',
                    fontWeight: language === lang.code ? 700 : 500,
                    fontSize: '0.85rem'
                  }}
                >
                  {lang.flag} {lang.nativeName} ({lang.name})
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#2563EB',
            color: 'white',
            fontWeight: 800,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setAdminView('settings')}
          title="Admin Settings & Profile (Click to open Settings)"
        >
          A
        </div>
      </div>
    </header>
  );
};
