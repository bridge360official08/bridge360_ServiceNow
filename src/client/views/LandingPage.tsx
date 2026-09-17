import React, { useState } from 'react';
import {
  Shield, User, ArrowRight, Globe, Heart, FileText,
  Lock, Mail, Eye, EyeOff, AlertCircle, Sparkles,
  Users, Building, Layers, X
} from 'lucide-react';

const ADMIN_EMAIL = 'bridge360official08@gmail.com';
const ADMIN_PASSWORD = 'bridge360';

interface LandingPageProps {
  onLaunchCustomer: () => void;
  onLaunchAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchCustomer, onLaunchAdmin }) => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    await new Promise(r => setTimeout(r, 800));
    if (adminEmail.trim().toLowerCase() === ADMIN_EMAIL && adminPass === ADMIN_PASSWORD) {
      setLoggingIn(false);
      setShowAdminModal(false);
      onLaunchAdmin();
    } else {
      setLoggingIn(false);
      setLoginError('Invalid credentials. Please check your email and password.');
    }
  };



  const features = [
    { icon: '🛂', title: 'Smart Registration', desc: 'AI-assisted family intake with OCR document extraction and real-time validation across all family members.' },
    { icon: '📋', title: 'Case Management', desc: 'Full lifecycle case tracking from intake through resettlement with automated ServiceNow workflows.' },
    { icon: '🤝', title: 'Partner Referrals', desc: 'Seamless inter-agency referrals to NGOs, health clinics, legal aid, and housing with live email alerts.' },
    { icon: '🤖', title: 'AI Verification Suite', desc: 'Multi-agent AI: Triage Agent, Document Analyst, Risk Assessment, and Decision Drafter agents.' },
    { icon: '📧', title: 'Real-time Notifications', desc: 'Instant email and portal notifications for every case update, referral, appointment, and status change.' },
    { icon: '🔒', title: 'Secure OTP Access', desc: 'Passwordless customer portal with email OTP for secure, frictionless document tracking and communication.' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 40%, #0F172A 100%)',
      fontFamily: "'Inter', system-ui, sans-serif",
      overflowX: 'hidden',
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '20px 60px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(15,23,42,0.7)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Layers size={22} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px' }}>Bridge360</div>
            <div style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Refugee Case Management</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onLaunchCustomer}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.4)',
              color: '#93C5FD', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer',
            }}
          >
            <User size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Family Portal
          </button>
          <button
            onClick={() => setShowAdminModal(true)}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              border: 'none', color: '#FFFFFF', fontWeight: 700, fontSize: '0.86rem',
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            }}
          >
            <Shield size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Admin Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 60px 60px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '250px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />




        {/* Portal Cards */}
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '780px', margin: '0 auto' }}>
          <div
            onClick={onLaunchCustomer}
            style={{
              flex: 1, minWidth: '300px', padding: '36px 30px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(37, 99, 235, 0.35)',
              borderRadius: '20px', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(37,99,235,0.1)';
              e.currentTarget.style.borderColor = 'rgba(37,99,235,0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(37,99,235,0.35)';
            }}
          >
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px', boxShadow: '0 8px 20px rgba(37,99,235,0.4)',
            }}>
              <User size={26} color="white" />
            </div>
            <div style={{ color: '#60A5FA', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Family Self-Service</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>Customer Portal</h2>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.65, marginBottom: '24px' }}>
              Register your family, upload identity documents, track your application status, and communicate with case managers securely — no password needed.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#60A5FA', fontWeight: 700, fontSize: '0.88rem' }}>
              Enter Family Portal <ArrowRight size={16} />
            </div>
          </div>

          <div
            onClick={() => setShowAdminModal(true)}
            style={{
              flex: 1, minWidth: '300px', padding: '36px 30px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(124, 58, 237, 0.35)',
              borderRadius: '20px', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(124,58,237,0.1)';
              e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)';
            }}
          >
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #6D28D9, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px', boxShadow: '0 8px 20px rgba(124,58,237,0.4)',
            }}>
              <Shield size={26} color="white" />
            </div>
            <div style={{ color: '#A78BFA', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Operational Workspace</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>Admin Operations</h2>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.65, marginBottom: '24px' }}>
              Full-spectrum case management with AI verification agents, Family 360, referral management, analytics dashboards, and ServiceNow live sync.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#A78BFA', fontWeight: 700, fontSize: '0.88rem' }}>
              Staff Login Required <Lock size={14} />
            </div>
          </div>
        </div>
      </section>



      {/* Features */}
      <section style={{ padding: '70px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Built for Humanitarian Operations
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto' }}>
            Every feature designed in partnership with UNHCR workflows and ServiceNow best practices.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '18px' }}>
          {features.map((f, i) => (
            <div key={i}
              style={{
                padding: '26px', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', transition: 'all 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '0.83rem', color: '#64748B', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '28px 60px', borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ color: '#475569', fontSize: '0.8rem' }}>
          © 2026 Bridge360 — Refugee Family Case Management System · Built on ServiceNow
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.8rem' }}>
          <Heart size={13} style={{ color: '#F43F5E' }} />
          Made with compassion for displaced families worldwide
        </div>
      </footer>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowAdminModal(false)}
        >
          <div
            style={{
              background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px',
              position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAdminModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.08)', border: 'none',
                borderRadius: '8px', color: '#94A3B8', cursor: 'pointer',
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #6D28D9, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', boxShadow: '0 10px 30px rgba(124,58,237,0.4)',
              }}>
                <Shield size={28} color="white" />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '6px' }}>Admin Login</h2>
              <p style={{ color: '#64748B', fontSize: '0.84rem' }}>Bridge360 Operations Workspace</p>
            </div>

            {loginError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)',
                borderRadius: '10px', padding: '12px 14px', marginBottom: '18px',
                color: '#FCA5A5', fontSize: '0.84rem',
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      placeholder="bridge360official08@gmail.com"
                      required
                      style={{
                        width: '100%', padding: '13px 13px 13px 40px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '10px', color: '#FFFFFF', fontSize: '0.88rem',
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={adminPass}
                      onChange={e => setAdminPass(e.target.value)}
                      placeholder="Enter your password"
                      required
                      style={{
                        width: '100%', padding: '13px 40px 13px 40px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '10px', color: '#FFFFFF', fontSize: '0.88rem',
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                style={{
                  width: '100%', padding: '14px',
                  background: loggingIn ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6D28D9, #7C3AED)',
                  border: 'none', borderRadius: '10px', color: '#FFFFFF',
                  fontWeight: 800, fontSize: '0.95rem',
                  cursor: loggingIn ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 18px rgba(124,58,237,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <Shield size={16} />
                {loggingIn ? 'Authenticating...' : 'Access Admin Workspace'}
              </button>
            </form>

            <div style={{
              marginTop: '18px', padding: '12px 14px',
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '10px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '4px' }}>Demo Credentials</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                bridge360official08@gmail.com / bridge360
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

