import React from 'react';
import { Cpu, RefreshCw, CheckCircle2, Shield } from 'lucide-react';
import { NavTab } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { PageHeader } from '../components/common/PageHeader';
import { useToast } from '../components/common/Toast';

export interface ExtractionViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const ExtractionView: React.FC<ExtractionViewProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  return (
    <div className="fade-in">
      <PageHeader
        title="AI Extraction Engine"
        subtitle="Document OCR processing pipeline and confidence threshold metrics"
        breadcrumbs={['Bridge360', 'Extraction']}
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw size={14} />}
            onClick={() => showToast('info', 'Pipeline Status', 'AI Extraction service online and healthy.')}
          >
            Refresh Pipeline
          </Button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Card title="Extraction Service Health" subtitle="ServiceNow Integration Pipeline">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)' }}>
              <span>OCR Pipeline Engine</span>
              <Badge status="approved">Active / Operational</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)' }}>
              <span>Confidence Threshold</span>
              <span style={{ fontWeight: 600 }}>85% Auto-Accept</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--color-neutral-50)', borderRadius: 'var(--radius-sm)' }}>
              <span>Supported Document Types</span>
              <span style={{ fontWeight: 500 }}>Passport, Birth Cert, National ID</span>
            </div>
          </div>
        </Card>

        <Card title="Extraction Statistics" subtitle="Today's document processing performance">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span>Average Extraction Accuracy</span>
                <span style={{ fontWeight: 700, color: 'var(--color-success-text)' }}>94.2%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-neutral-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '94.2%', height: '100%', backgroundColor: 'var(--color-success-solid)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span>Verification Auto-Pass Rate</span>
                <span style={{ fontWeight: 700, color: 'var(--color-info-text)' }}>88.0%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-neutral-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '88%', height: '100%', backgroundColor: 'var(--color-info-solid)' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
