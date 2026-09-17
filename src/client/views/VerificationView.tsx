import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Edit3, 
  ShieldCheck, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  FileSearch,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ExtractedField, NavTab } from '../types';
import { apiService } from '../services/apiService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { PageHeader } from '../components/common/PageHeader';
import { useToast } from '../components/common/Toast';

export interface VerificationViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [fields, setFields] = useState<ExtractedField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>('field-4');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    const loadFields = async () => {
      const data = await apiService.getExtractedFields();
      setFields(data);
    };
    loadFields();
  }, []);

  const handleAction = async (fieldId: string, status: 'accepted' | 'edited' | 'rejected', val?: string) => {
    await apiService.updateFieldStatus(fieldId, status, val);
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, status, extractedValue: val ?? f.extractedValue } : f))
    );
    setIsEditing(null);
    showToast('success', 'Field Updated', `Marked field as ${status}.`);
  };

  const handleVerifyAll = () => {
    setFields((prev) => prev.map((f) => ({ ...f, status: 'accepted' })));
    showToast('success', 'Verification Complete', 'All extracted fields accepted into ServiceNow record.');
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  return (
    <div className="fade-in">
      <PageHeader
        title="Document Field Verification"
        subtitle="Review, audit, and accept AI-extracted identity attributes before saving to ServiceNow"
        breadcrumbs={['Bridge360', 'Verification', 'APP-2026-0801']}
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="outline" size="sm" onClick={() => onNavigate('applications')}>
              Back to Applications
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ShieldCheck size={14} />}
              onClick={handleVerifyAll}
            >
              Verify All & Approve
            </Button>
          </div>
        }
      />

      {/* Main Split Interface */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* Left Pane: Interactive Document Preview Placeholder */}
        <Card
          title="Document Preview: Passport_Prawin_Balaji.pdf"
          subtitle="Page 1 of 1 • Bounding Box Overlay Active"
          headerAction={
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </Button>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-navy-800)' }}>
                {zoomLevel}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </Button>
            </div>
          }
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '520px',
              backgroundColor: '#f1f5f9',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-neutral-300)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Mock Passport Document Graphics Container */}
            <div
              style={{
                width: '85%',
                height: '85%',
                backgroundColor: 'var(--color-white)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-md)',
                padding: '24px',
                position: 'relative',
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Document Header Mock */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileSearch size={24} color="var(--color-navy-900)" />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                      PASSPORT / REPUBLIQUE DE L'UNION
                    </h4>
                    <span style={{ fontSize: '10px', color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                      Official Identity Document
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-700)' }}>
                  Z9847102B
                </span>
              </div>

              {/* Bounding Box Highlights overlaying mock document text */}
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '16px', flex: 1 }}>
                {/* Photo Placeholder */}
                <div
                  style={{
                    width: '100px',
                    height: '120px',
                    backgroundColor: 'var(--color-neutral-200)',
                    borderRadius: 'var(--radius-xs)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-neutral-500)',
                    fontSize: '11px',
                    border: '1px dashed var(--color-neutral-400)',
                  }}
                >
                  Applicant Photo
                </div>

                {/* Extracted Fields Mock Layout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {fields.map((f) => {
                    const isSelected = f.id === selectedFieldId;
                    const isLowConfidence = f.confidenceScore < 70;

                    return (
                      <div
                        key={f.id}
                        onClick={() => setSelectedFieldId(f.id)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-xs)',
                          border: isSelected
                            ? '2px solid var(--color-primary-600)'
                            : isLowConfidence
                            ? '1px dashed var(--color-warning-solid)'
                            : '1px solid var(--color-neutral-200)',
                          backgroundColor: isSelected
                            ? 'var(--color-primary-50)'
                            : isLowConfidence
                            ? 'var(--color-warning-bg)'
                            : 'var(--color-white)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-neutral-500)', display: 'block' }}>
                          {f.fieldName}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                          {f.extractedValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Pane: Extracted Fields Review Panel */}
        <Card title="Extracted Field Attributes" subtitle="Click any field to verify or edit value">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {fields.map((field) => {
              const isSelected = field.id === selectedFieldId;
              const isEditingThis = isEditing === field.id;

              return (
                <div
                  key={field.id}
                  onClick={() => setSelectedFieldId(field.id)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--color-primary-600)' : '1px solid var(--color-neutral-200)',
                    backgroundColor: isSelected ? 'var(--color-neutral-50)' : 'var(--color-white)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-navy-800)' }}>
                      {field.fieldName}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ConfidenceBadge score={field.confidenceScore} />
                      {field.status === 'accepted' && (
                        <span style={{ fontSize: '11px', color: 'var(--color-success-text)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                          <CheckCircle2 size={12} /> Accepted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Value Row / Edit Form */}
                  {isEditingThis ? (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        style={{
                          flex: 1,
                          height: '32px',
                          padding: '0 8px',
                          fontSize: '13px',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--color-primary-600)',
                          outline: 'none',
                        }}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAction(field.id, 'edited', editValue)}
                      >
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                        {field.extractedValue}
                      </span>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(field.id, 'accepted');
                          }}
                          title="Accept Field"
                        >
                          <Check size={14} color="var(--color-success-solid)" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(field.id);
                            setEditValue(field.extractedValue);
                          }}
                          title="Edit Field"
                        >
                          <Edit3 size={14} color="var(--color-primary-600)" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(field.id, 'rejected');
                          }}
                          title="Reject Field"
                        >
                          <X size={14} color="var(--color-error-solid)" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
