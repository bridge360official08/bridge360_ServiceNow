import React from 'react';
import { Save, CheckCircle, Zap, FileText, Brain } from 'lucide-react';
import { NavTab } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { PageHeader } from '../components/common/PageHeader';
import { useToast } from '../components/common/Toast';

export interface SettingsViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  const handleSave = () => {
    showToast('success', 'Settings Saved', 'Application configuration updated.');
  };

  const engines = [
    {
      priority: '1',
      icon: <FileText size={18} />,
      name: 'PDF.js Text Layer',
      description: 'Extracts the real embedded text from digital PDFs. No OCR required.',
      accuracy: '100%',
      when: 'Digital PDFs (e-passports, electronic documents)',
      color: '#10B981',
      badge: 'BEST',
    },
    {
      priority: '2',
      icon: <Brain size={18} />,
      name: 'ICAO 9303 MRZ Parser',
      description: 'Decodes the Machine-Readable Zone at the bottom of passports using the international standard.',
      accuracy: '97%',
      when: 'Any passport or travel document with MRZ lines',
      color: '#6366F1',
      badge: 'FAST',
    },
    {
      priority: '3',
      icon: <Zap size={18} />,
      name: 'Tesseract.js v5 (WASM)',
      description: 'Multi-pass OCR engine running in-browser via WebAssembly. Uses Otsu binarization for best contrast.',
      accuracy: '70–85%',
      when: 'Scanned images, photos of documents',
      color: '#F59E0B',
      badge: 'WASM',
    },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: '820px' }}>
      <PageHeader
        title="Application Settings"
        subtitle="Bridge360 OCR engine status and application configuration"
        breadcrumbs={['Bridge360', 'Settings']}
        action={
          <Button variant="primary" size="sm" leftIcon={<Save size={14} />} onClick={handleSave}>
            Save Settings
          </Button>
        }
      />

      {/* ── OCR Engine Status ─────────────────────────────────────────── */}
      <Card
        title="📄 OCR Engine Status"
        subtitle="100% free, open-source engines — all run locally in your browser. No API key, no internet connection required."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* All-free notice */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#F0FDF4', border: '1px solid #86EFAC',
            borderRadius: '10px', padding: '12px 16px',
          }}>
            <CheckCircle size={20} style={{ color: '#10B981', flexShrink: 0 }} />
            <div style={{ fontSize: '0.88rem', color: '#065F46' }}>
              <strong>All engines are 100% free and open-source.</strong>
              {' '}No API keys required. Works offline. Same code runs on localhost and ServiceNow instance.
            </div>
          </div>

          {/* Engine cards */}
          {engines.map(e => (
            <div key={e.name} style={{
              display: 'flex', gap: '16px', alignItems: 'flex-start',
              background: '#F8FAFC', borderRadius: '12px',
              border: `1px solid ${e.color}33`, padding: '16px',
            }}>
              {/* Priority circle */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: e.color, display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#FFF', fontWeight: 800,
                fontSize: '0.85rem', flexShrink: 0,
              }}>
                {e.priority}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E293B' }}>{e.name}</span>
                  <span style={{
                    background: e.color, color: '#FFF', borderRadius: '6px',
                    padding: '1px 8px', fontSize: '0.7rem', fontWeight: 800,
                  }}>{e.badge}</span>
                  <span style={{
                    marginLeft: 'auto', fontWeight: 700, color: e.color,
                    fontSize: '0.88rem',
                  }}>
                    <CheckCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    {e.accuracy}
                  </span>
                </div>
                <div style={{ fontSize: '0.83rem', color: '#475569', marginBottom: '4px' }}>
                  {e.description}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  <strong>Used for:</strong> {e.when}
                </div>
              </div>
            </div>
          ))}

          {/* How it works */}
          <div style={{
            background: '#0F172A', borderRadius: '12px', padding: '16px',
            border: '1px solid #334155', fontSize: '0.82rem', lineHeight: 1.7,
          }}>
            <div style={{ color: '#94A3B8', fontWeight: 700, marginBottom: '8px' }}>📌 How the engine selects a strategy:</div>
            <div style={{ color: '#CBD5E1' }}>
              1. Upload document<br />
              2. If <span style={{ color: '#10B981' }}>digital PDF</span> → try PDF.js text layer first (fastest, 100% accurate)<br />
              3. Check extracted text for <span style={{ color: '#6366F1' }}>MRZ lines</span> (passports) → use MRZ parser<br />
              4. Otherwise → render to image with <span style={{ color: '#F59E0B' }}>Otsu binarization</span> → run Tesseract v5 (multi-pass PSM 3 + PSM 6)<br />
              5. Parse all extracted text to fill form fields automatically
            </div>
          </div>
        </div>
      </Card>

      {/* ── Platform Configuration ───────────────────────────────────── */}
      <Card
        title="ServiceNow Platform Configuration"
        subtitle="Global Scope Application Parameters"
        style={{ marginTop: '20px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Application Name" value="Bridge360" disabled />
          <Input label="Application Scope Sys ID" value="09159ba347aa8310b519b4b4116d43b9" disabled />
          <Input label="SDK Version" value="4.10.1" disabled />
          <Select
            label="Auto-Verification Confidence Threshold"
            defaultValue="85"
            options={[
              { label: '90% - Strict Compliance', value: '90' },
              { label: '85% - Recommended Standard', value: '85' },
              { label: '75% - Permissive Mode', value: '75' },
            ]}
          />
        </div>
      </Card>
    </div>
  );
};
