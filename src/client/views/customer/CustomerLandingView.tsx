import React from 'react';
import { UserPlus, Search, ArrowRight, Sparkles, FileText, Lock, MessageSquare, HeartHandshake, Shield, Globe2, Building2 } from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';

interface Props {
  onSelectAction: (action: 'register' | 'track') => void;
}

export const CustomerLandingView: React.FC<Props> = ({ onSelectAction }) => {
  const { t } = useBridge360();

  return (
    <div style={{ maxWidth: '1150px', margin: '20px auto', padding: '0 20px' }}>
      {/* Two Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '44px' }}>
        {/* New Registration Card */}
        <div
          className="glass-card card-accent-blue"
          style={{
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => onSelectAction('register')}
        >
          <div>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid #BFDBFE',
              }}
            >
              <UserPlus size={28} />
            </div>
            <span className="badge badge-indigo" style={{ marginBottom: '10px' }}>{t('nav.newRegistration', 'New Registration')}</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
              {t('reg.title', 'Register Your Family')}
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {t('reg.step1.subtitle', 'Begin your application by uploading a photo of your ID. We\'ll read the details to save you time. You can register your whole family here securely.')}
            </p>
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: '0.95rem' }}>
            {t('reg.step1.manualBtn', 'New Registration')} <ArrowRight size={18} />
          </button>
        </div>

        {/* Track Status Card */}
        <div
          className="glass-card card-accent-emerald"
          style={{
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => onSelectAction('track')}
        >
          <div>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid #A7F3D0',
              }}
            >
              <Search size={28} />
            </div>
            <span className="badge badge-emerald" style={{ marginBottom: '10px' }}>{t('nav.trackStatus', 'Track Status')}</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
              {t('reg.complete.track', 'Track Application Status')}
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {t('landing.track.desc', 'Check the status of your application, view your upcoming appointments, and message your case worker safely.')}
            </p>
          </div>
          <button className="btn-emerald" style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: '0.95rem' }}>
            {t('nav.trackStatus', 'Track Application Status')} <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} style={{ color: '#2563EB' }} /> {t('landing.saveTime.title', 'Save Time')}
          </div>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem', lineHeight: 1.5 }}>
            {t('landing.saveTime.desc', "Just take a photo of your ID and we'll fill out the forms for you automatically to make the process easier.")}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={20} style={{ color: '#10B981' }} /> {t('landing.simpleAccess.title', 'Simple Access')}
          </div>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem', lineHeight: 1.5 }}>
            {t('landing.simpleAccess.desc', 'No need to remember passwords. Just use your phone number or email to receive a secure login code.')}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} style={{ color: '#8B5CF6' }} /> {t('landing.directHelp.title', 'Direct Help')}
          </div>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem', lineHeight: 1.5 }}>
            {t('landing.directHelp.desc', 'Send messages directly to the people helping with your case and get updates on your housing and healthcare.')}
          </div>
        </div>
      </div>
    </div>
  );
};
