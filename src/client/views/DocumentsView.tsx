import React, { useEffect, useState } from 'react';
import { Search, Upload, FileText, CheckCircle, AlertTriangle, Eye, Download } from 'lucide-react';
import { DocumentItem, DocumentType, NavTab } from '../types';
import { apiService } from '../services/apiService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { PageHeader } from '../components/common/PageHeader';
import { useToast } from '../components/common/Toast';

export interface DocumentsViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    const loadDocs = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getDocuments({ search, type: typeFilter as DocumentType | 'all' });
        setDocuments(data);
      } catch (err) {
        showToast('error', 'Error loading documents');
      } finally {
        setIsLoading(false);
      }
    };
    loadDocs();
  }, [search, typeFilter]);

  const handleUploadSimulated = () => {
    showToast('success', 'Document Uploaded', 'Passport_Prawin_Balaji.pdf has been queued for OCR extraction.');
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="Document Management"
        subtitle="Uploaded identity documents, attachments, and OCR extraction status"
        breadcrumbs={['Bridge360', 'Documents']}
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Upload size={14} />}
            onClick={handleUploadSimulated}
          >
            Upload Document
          </Button>
        }
      />

      {/* Filter Bar */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', alignItems: 'end' }}>
          <Input
            label="Search Documents"
            placeholder="Search by file name or applicant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />

          <Select
            label="Document Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { label: 'All Document Types', value: 'all' },
              { label: 'Passport', value: 'passport' },
              { label: 'Birth Certificate', value: 'birth_certificate' },
              { label: 'National ID', value: 'national_id' },
              { label: 'Marriage Certificate', value: 'marriage_certificate' },
              { label: 'Utility Bill', value: 'utility_bill' },
            ]}
          />
        </div>
      </Card>

      {/* Document Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}
      >
        {documents.map((doc) => (
          <Card key={doc.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-primary-50)',
                    border: '1px solid var(--color-primary-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-600)',
                  }}
                >
                  <FileText size={22} />
                </div>
                <Badge status={doc.status} />
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy-900)', wordBreak: 'break-all' }}>
                {doc.name}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                Applicant: {doc.applicantName} • {doc.applicationId}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--color-neutral-200)',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', display: 'block' }}>
                    Confidence Score
                  </span>
                  <ConfidenceBadge score={doc.confidenceScore} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', display: 'block' }}>
                    Uploaded
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--color-neutral-700)', fontWeight: 500 }}>
                    {doc.uploadedAt}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Eye size={14} />}
                onClick={() => onNavigate('verification')}
                style={{ flex: 1 }}
              >
                Inspect OCR
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => showToast('info', 'Download', `Downloading ${doc.name}`)}
              >
                <Download size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
