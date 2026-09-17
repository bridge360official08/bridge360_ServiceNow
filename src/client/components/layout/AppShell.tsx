import React, { useState } from 'react';
import { NavTab } from '../../types';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ToastProvider } from '../common/Toast';
import { DashboardView } from '../../views/DashboardView';
import { ApplicationsView } from '../../views/ApplicationsView';
import { DocumentsView } from '../../views/DocumentsView';
import { VerificationView } from '../../views/VerificationView';
import { WizardView } from '../../views/WizardView';
import { FamiliesView } from '../../views/FamiliesView';
import { ExtractionView } from '../../views/ExtractionView';
import { SettingsView } from '../../views/SettingsView';

export const AppShellContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'applications':
        return <ApplicationsView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'documents':
        return <DocumentsView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'verification':
        return <VerificationView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'wizard':
        return <WizardView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'families':
        return <FamiliesView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'extraction':
        return <ExtractionView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'settings':
        return <SettingsView onNavigate={(tab) => setActiveTab(tab)} />;
      default:
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div className="main-wrapper">
        <TopBar
          activeTab={activeTab}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="content-area">{renderActiveView()}</main>
      </div>
    </div>
  );
};

export const AppShell: React.FC = () => {
  return (
    <ToastProvider>
      <AppShellContent />
    </ToastProvider>
  );
};
