import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, Eye, MoreHorizontal, Download } from 'lucide-react';
import { Application, ApplicationStatus, NavTab } from '../types';
import { apiService } from '../services/apiService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { Table, Column } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { PageHeader } from '../components/common/PageHeader';
import { Dropdown } from '../components/common/Dropdown';
import { useToast } from '../components/common/Toast';

export interface ApplicationsViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getApplications({
        search,
        status: statusFilter as ApplicationStatus | 'all',
        sortBy: sortBy as any,
      });
      setApplications(data);
    } catch (err) {
      showToast('error', 'Error loading applications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter, sortBy]);

  const totalPages = Math.ceil(applications.length / pageSize);
  const paginatedData = applications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<Application>[] = [
    {
      key: 'id',
      header: 'Application ID',
      render: (app) => (
        <span style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{app.id}</span>
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
      key: 'familyGroup',
      header: 'Family Group',
      render: (app) => <span style={{ color: 'var(--color-neutral-700)' }}>{app.familyGroup}</span>,
    },
    {
      key: 'documentsCount',
      header: 'Documents',
      align: 'center',
      render: (app) => <span style={{ fontWeight: 500 }}>{app.documentsCount} docs</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (app) => <Badge status={app.status} />,
    },
    {
      key: 'confidenceScore',
      header: 'Confidence',
      render: (app) => <ConfidenceBadge score={app.confidenceScore} />,
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      render: (app) => <span style={{ color: 'var(--color-neutral-500)', fontSize: '12px' }}>{app.updatedAt}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (app) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('verification')}
            title="Inspect Application"
          >
            <Eye size={16} />
          </Button>

          <Dropdown
            trigger={
              <Button variant="ghost" size="sm">
                <MoreHorizontal size={16} />
              </Button>
            }
            items={[
              { id: 'review', label: 'Verify Fields', onClick: () => onNavigate('verification') },
              { id: 'export', label: 'Export PDF Summary', onClick: () => showToast('info', 'Export', `Exporting summary for ${app.id}`) },
              { id: 'delete', label: 'Archive Record', danger: true, onClick: () => showToast('warning', 'Archive', `Archived ${app.id}`) },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Registration Applications"
        subtitle="Manage and verify document-assisted registration applications"
        breadcrumbs={['Bridge360', 'Applications']}
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download size={14} />}
              onClick={() => showToast('info', 'Export', 'Exporting applications CSV...')}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => onNavigate('wizard')}
            >
              New Application
            </Button>
          </div>
        }
      />

      {/* Filter & Controls Card */}
      <Card style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            alignItems: 'end',
          }}
        >
          <Input
            label="Search Applications"
            placeholder="Search by ID or applicant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />

          <Select
            label="Status Filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'Needs Verification', value: 'needs_verification' },
              { label: 'Processing', value: 'processing' },
              { label: 'Pending', value: 'pending' },
              { label: 'Verified', value: 'verified' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
            ]}
          />

          <Select
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { label: 'Last Updated', value: 'updatedAt' },
              { label: 'Confidence Score (High to Low)', value: 'confidenceScore' },
              { label: 'Applicant Name', value: 'applicantName' },
            ]}
          />

          <Button
            variant="secondary"
            leftIcon={<Filter size={14} />}
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
              setSortBy('updatedAt');
            }}
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Applications Table Card */}
      <Card style={{ padding: 0 }}>
        <Table
          columns={columns}
          data={paginatedData}
          keyExtractor={(app) => app.id}
          isLoading={isLoading}
          onRowClick={(app) => onNavigate('verification')}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={applications.length}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </Card>
    </div>
  );
};
