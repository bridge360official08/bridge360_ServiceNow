import React, { useEffect, useState } from 'react';
import { Users, Plus, Eye } from 'lucide-react';
import { FamilyGroup, NavTab } from '../types';
import { apiService } from '../services/apiService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Table, Column } from '../components/common/Table';
import { PageHeader } from '../components/common/PageHeader';
import { useToast } from '../components/common/Toast';

export interface FamiliesViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const FamiliesView: React.FC<FamiliesViewProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [families, setFamilies] = useState<FamilyGroup[]>([]);

  useEffect(() => {
    apiService.getFamilies().then(setFamilies);
  }, []);

  const columns: Column<FamilyGroup>[] = [
    {
      key: 'familyName',
      header: 'Family Group',
      render: (f) => <span style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{f.familyName}</span>,
    },
    {
      key: 'primaryApplicant',
      header: 'Primary Applicant',
      render: (f) => <span>{f.primaryApplicant}</span>,
    },
    {
      key: 'membersCount',
      header: 'Members',
      align: 'center',
      render: (f) => <span>{f.membersCount} members</span>,
    },
    {
      key: 'applicationsCount',
      header: 'Applications',
      align: 'center',
      render: (f) => <span>{f.applicationsCount} apps</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (f) => <Badge status={f.status.toLowerCase()} />,
    },
    {
      key: 'registeredDate',
      header: 'Registered',
      render: (f) => <span style={{ color: 'var(--color-neutral-500)', fontSize: '12px' }}>{f.registeredDate}</span>,
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Family Groups Registry"
        subtitle="Manage family units and grouped registration applications"
        breadcrumbs={['Bridge360', 'Families']}
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => showToast('info', 'New Family', 'Create new family group registration')}
          >
            New Family Group
          </Button>
        }
      />

      <Card style={{ padding: 0 }}>
        <Table columns={columns} data={families} keyExtractor={(f) => f.id} />
      </Card>
    </div>
  );
};
