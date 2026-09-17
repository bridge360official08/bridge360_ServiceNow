import React, { useState } from 'react';
import { Search, KeyRound, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft, Loader2, RefreshCw, Mail } from 'lucide-react';
import { useBridge360 } from '../../store/Bridge360Context';
import { snSendOTP, snVerifyOTP } from '../../services/snApi';

import { useAssistant } from '../../store/AssistantContext';

interface Props {
  onBack: () => void;
  onAuthenticated: () => void;
  defaultAppId?: string;
}

export const TrackStatusView: React.FC<Props> = ({ onBack, onAuthenticated, defaultAppId = '' }) => {
  const { setAuthenticatedAppId, setLiveDashboardData, families } = useBridge360();
  const { setScreenContext } = useAssistant();

  const [inputAppId, setInputAppId] = useState<string>(defaultAppId || '');
  const [step, setStep]             = useState<'enter_id' | 'enter_otp'>('enter_id');
  
  React.useEffect(() => {
    setScreenContext(`track_status_${step}`);
  }, [step, setScreenContext]);

  const [otpCode, setOtpCode]       = useState<string>('');
  const [errorMsg, setErrorMsg]     = useState<string>('');
  const [maskedEmail, setMaskedEmail] = useState<string>('');
  const [loading, setLoading]       = useState<boolean>(false);

  const [activeOtp, setActiveOtp]   = useState<string>('');
  const [otpNoticeMsg, setOtpNoticeMsg] = useState<string>('');

  // ── Step 1: Enter Application ID / Family ID → send OTP ──────────────────
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmed = inputAppId.trim().toUpperCase();
    if (!trimmed) {
      setErrorMsg('Please enter your Application ID, Refugee ID, or Family ID.');
      return;
    }

    setLoading(true);

    const result = await snSendOTP(trimmed);
    setLoading(false);

    if (result.success && result.otp) {
      setActiveOtp(result.otp);
    }

    const senderEmail = 'bridge360official08@gmail.com';

    if (result.success) {
      setMaskedEmail(result.maskedEmail || 'your registered email address');
      setOtpNoticeMsg(`Security OTP sent from ${senderEmail} to ${result.maskedEmail || 'recipient'}! Please check your email inbox.`);
      setStep('enter_otp');
      return;
    }

    // Also check local context families — match by applicationId, bridge360Id, familyId, or any member's refugeeId
    const localMatch = families.find(
      f =>
        f.applicationId.toUpperCase() === trimmed ||
        (f.bridge360Id && f.bridge360Id.toUpperCase() === trimmed) ||
        (f.familyId && f.familyId.toUpperCase() === trimmed) ||
        (f.headOfFamily?.refugeeId && f.headOfFamily.refugeeId.toUpperCase() === trimmed) ||
        (f.members && f.members.some((m: any) => m.refugeeId && m.refugeeId.toUpperCase() === trimmed))
    );
    if (localMatch) {
      const email = localMatch.headOfFamily?.email || '';
      const masked = email ? email.replace(/(.{2}).+(@.+)/, '$1***$2') : 'your registered email address';
      const demoOtp = String(Math.floor(100000 + Math.random() * 900000));
      setActiveOtp(demoOtp);
      setMaskedEmail(masked);
      setOtpNoticeMsg(`[DEMO] OTP: ${demoOtp} — In production this would be emailed to ${masked}`);
      setStep('enter_otp');
      return;
    }

    setErrorMsg(result.message || 'We could not find that ID. Please check and try again.');
  };

  // ── Step 2: Enter OTP → verify → load dashboard ──────────────────────────
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const entered = otpCode.trim();
    if (!entered || entered.length < 6) {
      setErrorMsg('Please enter the 6-digit security code sent to your email.');
      return;
    }

    setLoading(true);
    const result = await snVerifyOTP(inputAppId.trim().toUpperCase(), entered);
    setLoading(false);

    if (result.success && result.family) {
      setLiveDashboardData({
        family:    result.family!,
        members:   result.members   || [],
        documents: result.documents || [],
        cases:     result.cases     || [],
        tickets:   result.tickets   || [],
      });
      setAuthenticatedAppId(result.family.applicationId || result.family.familyId || result.family.bridge360Id);
      onAuthenticated();
      return;
    }

    // Local fallback — also match by refugeeId and familyId
    const localMatch = families.find(
      f =>
        f.applicationId.toUpperCase() === inputAppId.trim().toUpperCase() ||
        (f.bridge360Id && f.bridge360Id.toUpperCase() === inputAppId.trim().toUpperCase()) ||
        (f.familyId && f.familyId.toUpperCase() === inputAppId.trim().toUpperCase()) ||
        (f.headOfFamily?.refugeeId && f.headOfFamily.refugeeId.toUpperCase() === inputAppId.trim().toUpperCase()) ||
        (f.members && f.members.some((m: any) => m.refugeeId && m.refugeeId.toUpperCase() === inputAppId.trim().toUpperCase()))
    );
    if (localMatch && activeOtp && entered === activeOtp) {
      // Determine if logging in as an individual member (by their refugeeId)
      const loggedInMember = localMatch.members?.find((m: any) =>
        m.refugeeId && m.refugeeId.toUpperCase() === inputAppId.trim().toUpperCase()
      );
      const isIndividualLogin = loggedInMember ||
        (localMatch.headOfFamily?.refugeeId && localMatch.headOfFamily.refugeeId.toUpperCase() === inputAppId.trim().toUpperCase());

      setLiveDashboardData({
        family: {
          sys_id: localMatch.id,
          applicationId: localMatch.applicationId,
          bridge360Id: localMatch.bridge360Id,
          familyId: localMatch.familyId,
          familyName: localMatch.familyName,
          countryOfOrigin: localMatch.countryOfOrigin,
          householdSize: localMatch.householdSize,
          primaryLanguage: localMatch.primaryLanguage,
          immigrationStatus: localMatch.immigrationStatus,
          needsInterpreter: localMatch.needsInterpreter,
          priority: localMatch.priority,
          assignedOfficer: localMatch.assignedOfficer,
          registrationStatus: localMatch.registrationStatus,
          verificationStatus: localMatch.verificationStatus,
          caseStatus: localMatch.caseStatus,
          email: localMatch.headOfFamily?.email || '',
        },
        members: [
          {
            sys_id: localMatch.headOfFamily.id,
            isHead: true,
            relationship: 'Self',
            firstName: localMatch.headOfFamily.firstName,
            middleName: localMatch.headOfFamily.middleName || '',
            lastName: localMatch.headOfFamily.lastName,
            gender: localMatch.headOfFamily.gender,
            dateOfBirth: localMatch.headOfFamily.dateOfBirth,
            nationality: localMatch.headOfFamily.nationality,
            passportNumber: localMatch.headOfFamily.passportNumber || '',
            nationalId: localMatch.headOfFamily.nationalId || '',
            mobileNumber: localMatch.headOfFamily.mobileNumber || '',
            email: localMatch.headOfFamily.email || '',
            address: localMatch.headOfFamily.address || '',
            city: localMatch.headOfFamily.city || '',
            state: localMatch.headOfFamily.state || '',
            postalCode: localMatch.headOfFamily.postalCode || '',
            refugeeId: localMatch.headOfFamily.refugeeId || '',
          },
          ...localMatch.members.map(m => ({
            sys_id: m.id,
            isHead: false,
            relationship: m.relationshipToHead || 'Member',
            firstName: m.firstName,
            middleName: '',
            lastName: m.lastName,
            gender: m.gender,
            dateOfBirth: m.dateOfBirth,
            nationality: m.nationality,
            passportNumber: '',
            nationalId: '',
            mobileNumber: '',
            email: '',
            address: '',
            city: '',
            state: '',
            postalCode: '',
            refugeeId: (m as any).refugeeId || '',
          })),
        ],
        documents: [],
        cases: [],
        tickets: [],
      });
      // Use the input ID so the customer dashboard can find the family via bridge360Id/familyId too
      setAuthenticatedAppId(inputAppId.trim().toUpperCase());
      onAuthenticated();
      return;
    }

    setErrorMsg(result.message || 'Incorrect security code. Please check your email inbox and enter the exact 6-digit code received.');
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    setLoading(true);
    setErrorMsg('');
    const result = await snSendOTP(inputAppId.trim().toUpperCase());
    setLoading(false);
    if (!result.success) {
      setErrorMsg(result.message || 'Could not resend code. Please try again.');
    } else {
      setErrorMsg('');
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '50px auto', padding: '0 20px' }}>
      <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '16px' }}>
        <ArrowLeft size={16} /> Back to Portal Landing
      </button>

      <div className="glass-card animate-fade-in" style={{ padding: '32px' }}>
        {step === 'enter_id' ? (
          <form onSubmit={handleRequestOTP}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Search size={24} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Track Your Application
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Enter your Application ID, Refugee ID, or Family ID. We'll send a one-time security code to your registered email.
            </p>

            {errorMsg && (
              <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#B91C1C', fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label className="input-label">Application ID / Refugee ID / Family ID *</label>
              <input
                className="input-field"
                placeholder="e.g. APP-2026-000001 or RID-2026-000001"
                value={inputAppId}
                onChange={e => setInputAppId(e.target.value.toUpperCase())}
                autoFocus
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? <><Loader2 size={18} className="spin" /> Sending Code…</> : <>Send Security Code <ArrowRight size={18} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <KeyRound size={24} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Enter Security Code
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginBottom: '20px' }}>
              We have sent a 6-digit security code to <strong>{maskedEmail}</strong> for <code>{inputAppId}</code>.
            </p>

            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              color: '#475569'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#1E293B' }}>
                <Mail size={16} style={{ color: '#2563EB', flexShrink: 0 }} />
                <span>Security Code Sent</span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                {otpNoticeMsg || `Please check your inbox at ${maskedEmail} for the 6-digit verification code.`}
              </p>
              {/* Demo OTP display — shows when the code is generated locally */}
              {activeOtp && otpNoticeMsg && otpNoticeMsg.startsWith('[DEMO]') && (
                <div style={{ marginTop: '10px', padding: '8px 12px', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#92400E' }}>Demo OTP Code:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.2em', color: '#1E293B' }}>{activeOtp}</span>
                </div>
              )}
            </div>

            {errorMsg && (
              <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#B91C1C', fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label className="input-label">6-Digit Security Code *</label>
              <input
                className="input-field"
                placeholder="______"
                maxLength={6}
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                style={{ fontSize: '1.5rem', letterSpacing: '0.25em', textAlign: 'center', fontWeight: 800 }}
                autoFocus
              />
            </div>

            <button type="submit" className="btn-emerald" style={{ width: '100%', justifyContent: 'center', marginBottom: '14px' }} disabled={loading}>
              {loading ? <><Loader2 size={18} className="spin" /> Verifying…</> : <>Verify &amp; Access Dashboard <ShieldCheck size={18} /></>}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <button type="button" style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontWeight: 600 }} onClick={() => setStep('enter_id')}>
                ← Change ID
              </button>
              <button type="button" style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={handleResend} disabled={loading}>
                <RefreshCw size={13} /> Resend code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
