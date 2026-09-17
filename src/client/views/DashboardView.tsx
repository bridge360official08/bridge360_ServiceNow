import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Clock, 
  Cpu, 
  AlertTriangle, 
  PlusCircle, 
  Upload, 
  CheckSquare, 
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Application, StatItem, ActivityLog, NavTab } from '../types';
import { apiService } from '../services/apiService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { Table, Column } from '../components/common/Table';
import { PageHeader } from '../components/common/PageHeader';
import { useToast } from '../components/common/Toast';

export interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [s, a, act] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getApplications(),
          apiService.getRecentActivities(),
        ]);
        setStats(s);
        setApplications(a.slice(0, 5));
        setActivities(act);
      } catch (err) {
        showToast('error', 'Failed to load dashboard', 'Could not fetch system metrics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText size={20} color="var(--color-primary-600)" />;
      case 'Clock': return <Clock size={20} color="var(--color-warning-solid)" />;
      case 'Cpu': return <Cpu size={20} color="var(--color-info-solid)" />;
      case 'AlertTriangle': return <AlertTriangle size={20} color="var(--color-error-solid)" />;
      default: return <FileText size={20} />;
    }
  };

  const columns: Column<Application>[] = [
    {
      key: 'id',
      header: 'Application',
      render: (app) => (
        <div>
          <span style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{app.id}</span>
          <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-neutral-500)' }}>{app.familyGroup}</span>
        </div>
      ),
    },
    {
      key: 'applicantName',
      header: 'Applicant',
      render: (app) => (
        <div>
          <span style={{ fontWeight: 500, color: 'var(--color-navy-900)' }}>{app.applicantName}</span>
          <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-neutral-500)' }}>{app.applicantEmail}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (app) => <Badge status={app.status} />,
    },
    {
      key: 'documentsCount',
      header: 'Documents',
      align: 'center',
      render: (app) => <span style={{ fontWeight: 500 }}>{app.documentsCount} docs</span>,
    },
    {
      key: 'confidenceScore',
      header: 'Confidence',
      render: (app) => <ConfidenceBadge score={app.confidenceScore} />,
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (app) => <span style={{ color: 'var(--color-neutral-500)', fontSize: '12px' }}>{app.updatedAt}</span>,
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Application Dashboard"
        subtitle="AI-Powered Document Extraction & Registration System Overview"
        breadcrumbs={['Bridge360', 'Dashboard']}
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Upload size={14} />}
              onClick={() => onNavigate('documents')}
            >
              Upload Document
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle size={14} />}
              onClick={() => onNavigate('wizard')}
            >
              New Application
            </Button>
          </div>
        }
      />

      {/* Welcome Banner */}
      <div
        style={{
          padding: '20px 24px',
          backgroundColor: 'var(--color-navy-900)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-white)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-white)' }}>
            Welcome to Bridge360 Shell
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-neutral-300)', marginTop: '4px', maxWidth: '600px' }}>
            Production-grade ServiceNow global application shell running on SDK 4.10.1 and Fluent UI Page framework.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<CheckSquare size={14} />}
            onClick={() => onNavigate('verification')}
          >
            Review 12 Pending Fields
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {stats.map((stat) => (
          <Card key={stat.id} style={{ padding: '0' }}>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-neutral-600)' }}>
                  {stat.title}
                </span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-neutral-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getStatIcon(stat.icon)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                  {stat.value}
                </span>
                {stat.changePercent && (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: stat.trend === 'up' ? 'var(--color-success-text)' : stat.trend === 'down' ? 'var(--color-info-text)' : 'var(--color-neutral-600)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <TrendingUp size={12} />
                    {stat.changePercent}
                  </span>
                )}
              </div>

              {stat.subtext && (
                <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '4px', display: 'block' }}>
                  {stat.subtext}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Two Column Section: Recent Applications Table & Activity Stream */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '20px',
        }}
      >
        {/* Recent Applications Card */}
        <Card
          title="Recent Applications"
          subtitle="Latest document registration applications in queue"
          headerAction={
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight size={14} />}
              onClick={() => onNavigate('applications')}
            >
              View All
            </Button>
          }
        >
          <Table
            columns={columns}
            data={applications}
            keyExtractor={(app) => app.id}
            isLoading={isLoading}
            onRowClick={(app) => onNavigate('verification')}
          />
        </Card>

        {/* Activity & Quick Actions Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Actions */}
          <Card title="Quick Actions" subtitle="Frequently used registration tools">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button
                variant="outline"
                leftIcon={<PlusCircle size={16} />}
                onClick={() => onNavigate('wizard')}
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                Create New Application Wizard
              </Button>
              <Button
                variant="outline"
                leftIcon={<Upload size={16} />}
                onClick={() => onNavigate('documents')}
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                Upload Document for Extraction
              </Button>
              <Button
                variant="outline"
                leftIcon={<CheckSquare size={16} />}
                onClick={() => onNavigate('verification')}
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                Review Verification Queue
              </Button>
            </div>
          </Card>

          {/* Activity Stream */}
          <Card title="Activity Log" subtitle="Real-time system events">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    fontSize: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-neutral-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                    }}
                  >
                    <Activity size={14} color="var(--color-primary-600)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>
                      {act.title}
                    </span>
                    <p style={{ color: 'var(--color-neutral-600)', margin: '2px 0' }}>
                      {act.description}
                    </p>
                    <span style={{ color: 'var(--color-neutral-400)', fontSize: '11px' }}>
                      {act.timestamp} • {act.user}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
