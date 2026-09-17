import React, { useState, useEffect } from 'react';
import { Bridge360Provider, useBridge360 } from './store/Bridge360Context';
import { CustomerLandingView } from './views/customer/CustomerLandingView';
import { TrackStatusView } from './views/customer/TrackStatusView';
import { CustomerDashboardView } from './views/customer/CustomerDashboardView';
import { RegistrationEngine } from './components/registration/RegistrationEngine';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { Family360View } from './views/admin/Family360View';
import { VerificationView } from './views/admin/VerificationView';
import { CaseManagementView } from './views/admin/CaseManagementView';
import { ReferralsView } from './views/admin/ReferralsView';
import { AppointmentsView } from './views/admin/AppointmentsView';
import { AnalyticsReportsView } from './views/admin/AnalyticsReportsView';
import { PartnerAgenciesView } from './views/admin/PartnerAgenciesView';
import { UsersRolesView } from './views/admin/UsersRolesView';
import { SettingsView } from './views/admin/SettingsView';
import { AdminTicketsView } from './views/admin/AdminTicketsView';
import { LandingPage } from './views/LandingPage';
import { User, Shield, Layers, ArrowRight, Sparkles, Building, ExternalLink, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from './utils/i18n';
import { Bridge360Logo } from './components/common/Bridge360Logo';
import './styles/index.css';

// Helper to determine route from URL hash or localStorage
function parseRouteFromUrl() {
  const hash = window.location.hash || '';
  const search = window.location.search || '';

  if (hash.startsWith('#/admin')) {
    const parts = hash.split('/');
    const view = parts[2] || 'dashboard';
    return { portal: 'admin' as const, adminView: view as any, customerMode: 'landing' as const };
  }
  
  if (hash.startsWith('#/customer')) {
    const parts = hash.split('/');
    const mode = parts[2] === 'track' ? 'track_login' : parts[2] === 'register' ? 'register' : parts[2] === 'dashboard' ? 'dashboard' : 'landing';
    return { portal: 'customer' as const, adminView: 'dashboard' as any, customerMode: mode as any };
  }

  if (hash === '#/gateway' || hash === '#/landing') {
    return { portal: 'landing' as const, adminView: 'dashboard' as any, customerMode: 'landing' as const };
  }

  if (search.includes('portal=customer')) {
    return { portal: 'customer' as const, adminView: 'dashboard' as any, customerMode: 'landing' as const };
  }
  
  if (search.includes('portal=admin')) {
    return { portal: 'admin' as const, adminView: 'dashboard' as any, customerMode: 'landing' as const };
  }

  // Only restore from localStorage when navigating with a hash (not on fresh app load)
  // On fresh load (no hash), always show landing page
  if (!hash) {
    return { portal: 'landing' as const, adminView: 'dashboard' as any, customerMode: 'landing' as const };
  }

  return { portal: 'landing' as const, adminView: 'dashboard' as any, customerMode: 'landing' as const };
}

const MainAppContent: React.FC = () => {
  const { adminView, setAdminView, authenticatedAppId, setAuthenticatedAppId, setLiveDashboardData, language, setLanguage, t } = useBridge360();

  const [selectedPortal, setSelectedPortal] = useState<'landing' | 'gateway' | 'customer' | 'admin'>(() => {
    const r = parseRouteFromUrl();
    return r.portal;
  });

  const [customerMode, setCustomerModeState] = useState<'landing' | 'register' | 'track_login' | 'dashboard'>(() => {
    const r = parseRouteFromUrl();
    return r.customerMode;
  });

  const [trackDefaultAppId, setTrackDefaultAppId] = useState<string>('');

  // Synchronize hash on boot if not present
  useEffect(() => {
    const initial = parseRouteFromUrl();
    if (!window.location.hash) {
      if (initial.portal === 'admin') {
        window.location.hash = `#/admin/${initial.adminView}`;
      } else if (initial.portal === 'customer') {
        window.location.hash = `#/customer/${initial.customerMode === 'track_login' ? 'track' : initial.customerMode}`;
      }
    }
    if (initial.portal === 'admin' && initial.adminView) {
      setAdminView(initial.adminView);
    }
  }, []);

  // Listen for hash changes (browser back/forward or direct navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const r = parseRouteFromUrl();
      setSelectedPortal(r.portal);
      if (r.portal === 'admin') {
        setAdminView(r.adminView);
        localStorage.setItem('bridge360_portal', 'admin');
        localStorage.setItem('bridge360_admin_view', r.adminView);
      } else if (r.portal === 'customer') {
        setCustomerModeState(r.customerMode);
        localStorage.setItem('bridge360_portal', 'customer');
        localStorage.setItem('bridge360_customer_mode', r.customerMode);
      } else if (r.portal === 'landing') {
        localStorage.removeItem('bridge360_portal');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setAdminView]);

  // Navigate admin view with URL Hash synchronization
  const navigateAdminView = (view: any) => {
    setAdminView(view);
    localStorage.setItem('bridge360_portal', 'admin');
    localStorage.setItem('bridge360_admin_view', view);
    window.location.hash = `#/admin/${view}`;
  };

  // Navigate customer mode with URL Hash synchronization
  const navigateCustomerMode = (mode: 'landing' | 'register' | 'track_login' | 'dashboard') => {
    setCustomerModeState(mode);
    localStorage.setItem('bridge360_portal', 'customer');
    localStorage.setItem('bridge360_customer_mode', mode);
    const hashSub = mode === 'track_login' ? 'track' : mode === 'landing' ? 'home' : mode;
    window.location.hash = `#/customer/${hashSub}`;
  };

  const handleSelectCustomerAction = (action: 'register' | 'track') => {
    if (action === 'register') {
      navigateCustomerMode('register');
    } else {
      if (authenticatedAppId) {
        navigateCustomerMode('dashboard');
      } else {
        navigateCustomerMode('track_login');
      }
    }
  };

  const handleRegistrationTrackRedirect = (appId: string) => {
    setTrackDefaultAppId(appId);
    navigateCustomerMode('track_login');
  };

  // Switch to customer portal
  const launchCustomerPortal = () => {
    setSelectedPortal('customer');
    localStorage.setItem('bridge360_portal', 'customer');
    navigateCustomerMode('landing');
  };

  // Switch to admin portal
  const launchAdminPortal = () => {
    setSelectedPortal('admin');
    localStorage.setItem('bridge360_portal', 'admin');
    navigateAdminView('dashboard');
  };

  // Return to landing page — clear ALL saved navigation state
  const launchLandingPage = () => {
    setSelectedPortal('landing');
    localStorage.removeItem('bridge360_portal');
    localStorage.removeItem('bridge360_admin_view');
    localStorage.removeItem('bridge360_customer_mode');
    setCustomerModeState('landing');
    window.location.hash = '';
  };

  // Landing Page (default entry point)
  if (selectedPortal === 'landing' || selectedPortal === 'gateway') {
    return (
      <LandingPage
        onLaunchCustomer={launchCustomerPortal}
        onLaunchAdmin={launchAdminPortal}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* PORTAL 1: CUSTOMER PORTAL WEBSITE */}
      {selectedPortal === 'customer' && (
        <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
          {/* Customer Portal Navigation Header */}
          <nav
            style={{
              padding: '16px 32px',
              background: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              direction: 'ltr',
            }}
          >
            <div
              className="notranslate"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => navigateCustomerMode('landing')}
            >
              <Bridge360Logo
                size={34}
                showText={true}
                badgeText="CUSTOMER PORTAL"
                badgeColor="#16A34A"
                badgeBg="#DCFCE7"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {customerMode !== 'dashboard' ? (
                <>
                  <button
                    className={customerMode === 'landing' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => navigateCustomerMode('landing')}
                  >
                    {t('nav.home', 'Home')}
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    Signed in as <strong style={{ color: '#0F172A' }}>{authenticatedAppId || 'Applicant'}</strong>
                  </span>
                </div>
              )}

              {/* Multi-Language Dropdown */}
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  outline: 'none',
                  marginLeft: '6px',
                }}
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </nav>

          {/* Customer Views */}
          {customerMode === 'landing' && <CustomerLandingView onSelectAction={handleSelectCustomerAction} />}
          {customerMode === 'register' && (
            <RegistrationEngine
              mode="customer"
              onCompleteTrack={handleRegistrationTrackRedirect}
            />
          )}
          {customerMode === 'track_login' && (
            <TrackStatusView
              defaultAppId={trackDefaultAppId}
              onBack={() => navigateCustomerMode('landing')}
              onAuthenticated={() => navigateCustomerMode('dashboard')}
            />
          )}
          {customerMode === 'dashboard' && (
            <CustomerDashboardView
              onLogout={() => {
                setAuthenticatedAppId(null);
                setLiveDashboardData(null);
                launchLandingPage();
              }}
            />
          )}
        </div>
      )}

      {/* PORTAL 2: ADMIN WORKSPACE WEBSITE (Left Sidebar + Header + Content) */}
      {selectedPortal === 'admin' && (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
          {/* Left Dark Sidebar */}
          <AdminSidebar onLogout={launchLandingPage} />

          {/* Right Content Workspace */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <AdminHeader />
            <main style={{ flex: 1, background: '#F8FAFC', overflowY: 'auto' }}>
              {adminView === 'dashboard' && <AdminDashboardView />}
              {adminView === 'register' && <RegistrationEngine mode="admin" />}
              {adminView === 'family360' && <Family360View />}
              {adminView === 'cases' && <CaseManagementView />}
              {adminView === 'referrals' && <ReferralsView onManageAgencies={() => setAdminView('partner_agencies')} />}
              {adminView === 'tickets' && <AdminTicketsView />}
              {adminView === 'partner_agencies' && <PartnerAgenciesView />}
              {adminView === 'appointments' && <AppointmentsView />}
              {adminView === 'verification' && <VerificationView />}
              {adminView === 'analytics' && <AnalyticsReportsView />}
              {adminView === 'reports' && <AnalyticsReportsView />}
              {adminView === 'users_roles' && <UsersRolesView />}
              {adminView === 'settings' && <SettingsView />}
            </main>
          </div>
        </div>
      )}
      
      {/* Render Assistant only when not on landing page */}
      {!(selectedPortal === 'customer' && customerMode === 'landing') && <GlobalAssistant />}
    </div>
  );
};

import { AssistantProvider } from './store/AssistantContext';
import { GlobalAssistant } from './components/assistant/GlobalAssistant';

export default function App() {
  return (
    <Bridge360Provider>
      <AssistantProvider>
        <MainAppContent />
      </AssistantProvider>
    </Bridge360Provider>
  );
}
