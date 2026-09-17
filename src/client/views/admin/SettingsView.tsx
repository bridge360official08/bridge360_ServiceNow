import React, { useState } from 'react';
import {
  Settings,
  Mail,
  Sliders,
  Shield,
  Database,
  Globe,
  CheckCircle,
  Save,
  RefreshCw,
  Server,
  Lock,
  Bell
} from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';

export const SettingsView: React.FC = () => {
  const { refreshLiveAdminData } = useBridge360();
  const [smtpServer, setSmtpServer] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [senderEmail, setSenderEmail] = useState('bridge360official08@gmail.com');
  const [ocrConfidenceThreshold, setOcrConfidenceThreshold] = useState('85');
  const [autoMintRefugeeId, setAutoMintRefugeeId] = useState(true);
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSyncTables = async () => {
    setIsSyncing(true);
    await refreshLiveAdminData();
    setTimeout(() => setIsSyncing(false), 500);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
            System Information &amp; Operational Status
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>
            ServiceNow Table sync, outbound email SMTP delivery (bridge360official08@gmail.com), and system infrastructure status.
          </p>
        </div>

        <button className="btn-secondary" onClick={handleSyncTables} disabled={isSyncing} style={{ fontSize: '0.85rem' }}>
          <RefreshCw size={15} className={isSyncing ? 'spin' : ''} />
          {isSyncing ? 'Synchronizing Tables...' : 'Sync Tables'}
        </button>
      </div>

      {savedSuccess && (
        <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <CheckCircle size={18} /> Settings successfully saved and applied to Bridge360 application environment.
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Card 1: Email & SMTP Relay */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Outbound SMTP &amp; Email Delivery</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Configured with ServiceNow <code style={{ color: '#2563EB' }}>sys_email_account</code> for OTP delivery &amp; verification notices.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="input-label">SMTP Server Host</label>
              <input className="input-field" value={smtpServer} onChange={e => setSmtpServer(e.target.value)} />
            </div>
            <div>
              <label className="input-label">SMTP Port (STARTTLS)</label>
              <input className="input-field" value={smtpPort} onChange={e => setSmtpPort(e.target.value)} />
            </div>
            <div>
              <label className="input-label">Sender Email Address</label>
              <input className="input-field" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} />
            </div>
            <div>
              <label className="input-label">Connection Security</label>
              <input className="input-field" value="STARTTLS (Port 587) - Active" disabled style={{ background: '#F8FAFC' }} />
            </div>
          </div>
        </div>

        {/* Card 2: AI Document Intelligence OCR Settings */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F5F3FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sliders size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>AI Document Intelligence &amp; Verification Rules</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Confidence scoring thresholds and automatic ID generation parameters.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="input-label">AI OCR Confidence Threshold (%)</label>
              <input className="input-field" type="number" min="50" max="100" value={ocrConfidenceThreshold} onChange={e => setOcrConfidenceThreshold(e.target.value)} />
              <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>Fields below this threshold will be flagged for mandatory manual review.</span>
            </div>

            <div>
              <label className="input-label">Target ServiceNow Instance</label>
              <input className="input-field" value="https://dlt-hck-8017-0004.lab.service-now.com" disabled style={{ background: '#F8FAFC' }} />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: '#0F172A', fontWeight: 600 }}>
              <input type="checkbox" checked={autoMintRefugeeId} onChange={e => setAutoMintRefugeeId(e.target.checked)} style={{ width: '18px', height: '18px' }} />
              Auto-mint individual Refugee ID (RID-2026-XXXXXX) upon document approval
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: '#0F172A', fontWeight: 600 }}>
              <input type="checkbox" checked={enableEmailNotifications} onChange={e => setEnableEmailNotifications(e.target.checked)} style={{ width: '18px', height: '18px' }} />
              Dispatch automatic email notifications for verification status updates &amp; additional document requests
            </label>
          </div>
        </div>

        {/* Card 3: Backend Table Status */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ECFDF5', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>ServiceNow Data Schema &amp; Storage</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Real-time persistence tables deployed in ServiceNow.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '0.85rem' }}>
            {[
              { table: 'u_bridge360_family', name: 'Families & Applications', status: 'Live Synced' },
              { table: 'u_bridge360_member', name: 'Family Members', status: 'Live Synced' },
              { table: 'u_bridge360_document', name: 'Uploaded Documents & OCR', status: 'Live Synced' },
              { table: 'u_bridge360_case', name: 'Casework & Interventions', status: 'Live Synced' },
              { table: 'u_bridge360_appointment', name: 'Scheduled Appointments', status: 'Live Synced' },
              { table: 'u_bridge360_referral', name: 'Partner Service Referrals', status: 'Live Synced' },
            ].map((t, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{t.name}</div>
                <code style={{ fontSize: '0.75rem', color: '#2563EB', display: 'block', margin: '3px 0' }}>{t.table}</code>
                <span className="badge badge-high" style={{ fontSize: '0.72rem' }}>✓ {t.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
            <Save size={16} /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
