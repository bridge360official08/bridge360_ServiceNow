import React, { useState } from 'react';
import {
  Shield, User, ArrowRight, Globe, Heart, FileText,
  Lock, Mail, Eye, EyeOff, AlertCircle, Sparkles,
  Users, Building, Layers, X, Server, CheckCircle2
} from 'lucide-react';
import { BRIDGE360_EMBLEM, BRIDGE360_LOGO_FULL } from '../assets/bridge360LogoAsset';

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
    await new Promise(r => setTimeout(r, 600));
    const email = adminEmail.trim().toLowerCase();
    const isDefaultAdmin = (email === ADMIN_EMAIL || email === 'admin') && adminPass === ADMIN_PASSWORD;
    if (isDefaultAdmin) {
      setLoggingIn(false);
      setShowAdminModal(false);
      onLaunchAdmin();
    } else {
      setLoggingIn(false);
      setLoginError('Invalid credentials. Please check your email and password and try again.');
    }
  };

  const features = [
    { icon: '🛂', title: 'Smart Intake & Two-Tier OCR', desc: 'Native ServiceNow Document Intelligence with automatic fallback extraction for passports, civil certificates, and identity cards.' },
    { icon: '📋', title: 'Enterprise Case Management', desc: 'End-to-end lifecycle tracking from intake to resettlement with automated ServiceNow workflow execution.' },
    { icon: '🤝', title: 'Inter-Agency Referrals', desc: 'Seamless humanitarian referrals to UNHCR, health clinics, legal aid, and housing partners with real-time status sync.' },
    { icon: '🤖', title: 'AI-Assisted Verification Suite', desc: 'Six advisory checks for triage, document text matching, completeness, support planning, record integrity, and decision drafting.' },
    { icon: '📧', title: 'Real-Time Notification Engine', desc: 'Automated email alerts, appointment scheduling, and immediate status change updates for case workers and families.' },
    { icon: '🔒', title: 'Secure Passwordless Access', desc: 'Self-service customer portal with application ID + PIN verification ensuring data privacy and zero friction.' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, #0F2D44 0%, #071927 50%, #030C14 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#FFFFFF',
      overflowX: 'hidden',
      position: 'relative',
    }}>
      {/* Background Animated Cover Aura */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1200px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(48, 184, 150, 0.12) 0%, rgba(2, 132, 199, 0.08) 40%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(50px)',
        zIndex: 0,
      }} />

      {/* ServiceNow Polaris Navigation Bar */}
      <nav style={{
        padding: '16px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(48, 184, 150, 0.2)',
        background: 'rgba(7, 25, 39, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      }}>
        {/* Brand & Instance Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={BRIDGE360_EMBLEM}
            alt="Bridge360 Official Logo"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              objectFit: 'cover',
              background: '#FFFFFF',
              boxShadow: '0 0 20px rgba(48, 184, 150, 0.45)',
              border: '2px solid rgba(48, 184, 150, 0.4)',
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px' }}>Bridge360</span>
              <span style={{
                background: 'rgba(48, 184, 150, 0.15)',
                border: '1px solid rgba(48, 184, 150, 0.4)',
                color: '#30B896',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                UI16 / Polaris
              </span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              ServiceNow Refugee Case Management Platform
            </div>
          </div>
        </div>

        {/* Live Instance Status & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Instance Connection Pill */}
          <div className="sn-live-indicator" style={{ display: 'none' }}>
            <span className="sn-live-dot" />
            <span>dev187180 Live</span>
          </div>

          <button
            onClick={onLaunchCustomer}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'rgba(2, 132, 199, 0.12)',
              border: '1px solid rgba(2, 132, 199, 0.5)',
              color: '#38BDF8',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(2, 132, 199, 0.25)';
              e.currentTarget.style.borderColor = '#38BDF8';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(2, 132, 199, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(2, 132, 199, 0.5)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <User size={15} />
            Family Portal
          </button>

          <button
            onClick={() => setShowAdminModal(true)}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284C7 0%, #10B981 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(48, 184, 150, 0.4)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(48, 184, 150, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(48, 184, 150, 0.4)';
            }}
          >
            <Shield size={15} />
            Admin Login
          </button>
        </div>
      </nav>

      {/* Hero Section with Cover Animations */}
      <section style={{
        padding: '72px 24px 60px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        {/* Bridge360 Global Emblem */}
        <div style={{ marginBottom: '20px' }}>
          <img
            src={BRIDGE360_EMBLEM}
            alt="Bridge360 Official Emblem"
            style={{
              width: '92px',
              height: '92px',
              borderRadius: '50%',
              objectFit: 'cover',
              background: '#FFFFFF',
              padding: '3px',
              boxShadow: '0 0 40px rgba(48, 184, 150, 0.45), 0 10px 30px rgba(0, 0, 0, 0.5)',
              border: '3px solid rgba(48, 184, 150, 0.6)',
              display: 'inline-block',
            }}
          />
        </div>

        {/* Polaris Architecture Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(48, 184, 150, 0.1)',
          border: '1px solid rgba(48, 184, 150, 0.35)',
          borderRadius: '9999px',
          padding: '6px 18px',
          marginBottom: '24px',
          boxShadow: '0 0 16px rgba(48, 184, 150, 0.2)',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#30B896',
            boxShadow: '0 0 10px #30B896',
          }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#30B896', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            ServiceNow Scoped App • dev187180 Active
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '-1px',
          lineHeight: 1.15,
          marginBottom: '20px',
        }}>
          Next-Generation Humanitarian Intake
          <br />
          <span style={{
            background: 'linear-gradient(90deg, #38BDF8 0%, #30B896 50%, #81E7CD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Accelerated by ServiceNow AI
          </span>
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: '#94A3B8',
          maxWidth: '680px',
          margin: '0 auto 48px',
          lineHeight: 1.6,
        }}>
          Empathetic self-service document intake for refugee families paired with an intelligent,
          automated verification workspace for humanitarian case officers.
        </p>

        {/* Dual Portal Hero Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          maxWidth: '860px',
          margin: '0 auto',
        }}>
          {/* Customer Portal Card */}
          <div
            onClick={onLaunchCustomer}
            style={{
              padding: '38px 32px',
              background: 'linear-gradient(180deg, rgba(14, 37, 56, 0.7) 0%, rgba(7, 25, 39, 0.85) 100%)',
              border: '1px solid rgba(2, 132, 199, 0.4)',
              borderRadius: '20px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
              e.currentTarget.style.borderColor = '#38BDF8';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(2, 132, 199, 0.3), 0 0 20px rgba(2, 132, 199, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'rgba(2, 132, 199, 0.4)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.35)';
            }}
          >
            {/* Top Accent Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(2, 132, 199, 0.15)',
              border: '1px solid rgba(2, 132, 199, 0.3)',
              color: '#38BDF8',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              marginBottom: '20px',
            }}>
              Family Self-Service
            </div>

            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: '0 8px 20px rgba(2, 132, 199, 0.4)',
            }}>
              <User size={26} color="white" />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
              Customer Portal
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.65, marginBottom: '28px' }}>
              Register your family, upload identity documents, track your application status, and communicate
              with case officers securely — no password required.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              padding: '10px 18px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
            }}>
              Enter Family Portal <ArrowRight size={16} />
            </div>
          </div>

          {/* Admin Operations Card */}
          <div
            onClick={() => setShowAdminModal(true)}
            style={{
              padding: '38px 32px',
              background: 'linear-gradient(180deg, rgba(14, 37, 56, 0.7) 0%, rgba(7, 25, 39, 0.85) 100%)',
              border: '1px solid rgba(48, 184, 150, 0.4)',
              borderRadius: '20px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
              e.currentTarget.style.borderColor = '#30B896';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(48, 184, 150, 0.3), 0 0 20px rgba(48, 184, 150, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'rgba(48, 184, 150, 0.4)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.35)';
            }}
          >
            {/* Top Accent Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(48, 184, 150, 0.15)',
              border: '1px solid rgba(48, 184, 150, 0.3)',
              color: '#30B896',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              marginBottom: '20px',
            }}>
              Operational Workspace
            </div>

            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
            }}>
              <Shield size={26} color="white" />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
              Admin Operations
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.65, marginBottom: '28px' }}>
              Full-spectrum case management with AI verification agents, Family 360, referral tracking,
              analytics dashboards, and ServiceNow live sync.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              padding: '10px 18px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}>
              Staff Login Required <Lock size={15} />
            </div>
          </div>
        </div>
      </section>

      {/* Built for Humanitarian Operations Section */}
      <section style={{
        padding: '70px 24px',
        maxWidth: '1180px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Built for Humanitarian Operations
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.98rem', maxWidth: '520px', margin: '0 auto' }}>
            Every feature designed in partnership with UNHCR workflows and ServiceNow enterprise architecture.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                padding: '28px 24px',
                background: 'rgba(14, 37, 56, 0.45)',
                border: '1px solid rgba(48, 184, 150, 0.18)',
                borderRadius: '16px',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(14, 37, 56, 0.75)';
                e.currentTarget.style.borderColor = 'rgba(48, 184, 150, 0.45)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(14, 37, 56, 0.45)';
                e.currentTarget.style.borderColor = 'rgba(48, 184, 150, 0.18)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '1.9rem', marginBottom: '14px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F1F5F9', marginBottom: '8px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Footer */}
      <footer style={{
        padding: '30px 48px',
        borderTop: '1px solid rgba(48, 184, 150, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'rgba(7, 25, 39, 0.9)',
      }}>
        <div style={{ color: '#64748B', fontSize: '0.82rem' }}>
          © 2026 Bridge360 — ServiceNow Refugee Case Management Platform · Active Instance dev187180
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.82rem' }}>
          <Heart size={14} style={{ color: '#F43F5E' }} />
          Dedicated to displaced families and humanitarian frontline staff worldwide
        </div>
      </footer>

      {/* Admin Login Modal (ServiceNow UI16 Styling) */}
      {showAdminModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 12, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowAdminModal(false)}
        >
          <div
            style={{
              background: '#071927',
              border: '1px solid rgba(48, 184, 150, 0.35)',
              borderRadius: '20px',
              padding: '40px',
              width: '100%',
              maxWidth: '430px',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(48, 184, 150, 0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAdminModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '8px',
                color: '#94A3B8',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#FFFFFF',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 24px rgba(48, 184, 150, 0.4)',
                border: '2px solid rgba(48, 184, 150, 0.5)',
              }}>
                <img
                  src={BRIDGE360_EMBLEM}
                  alt="Bridge360 Logo"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '6px' }}>
                Admin Operations
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.84rem' }}>
                ServiceNow Scoped Workspace Authentication
              </p>
            </div>

            {loginError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '18px',
                color: '#FCA5A5',
                fontSize: '0.84rem',
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: '#94A3B8',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    Email / Staff User
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input
                      type="text"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      placeholder="admin or bridge360official08@gmail.com"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        background: 'rgba(14, 37, 56, 0.6)',
                        border: '1px solid rgba(48, 184, 150, 0.3)',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = '#30B896'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(48, 184, 150, 0.3)'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: '#94A3B8',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    Staff Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={adminPass}
                      onChange={e => setAdminPass(e.target.value)}
                      placeholder="Enter staff password"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 42px',
                        background: 'rgba(14, 37, 56, 0.6)',
                        border: '1px solid rgba(48, 184, 150, 0.3)',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = '#30B896'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(48, 184, 150, 0.3)'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer',
                      }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loggingIn
                    ? 'rgba(48, 184, 150, 0.5)'
                    : 'linear-gradient(135deg, #0284C7 0%, #10B981 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
                  cursor: loggingIn ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 18px rgba(48, 184, 150, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Shield size={16} />
                {loggingIn ? 'Authenticating with ServiceNow...' : 'Access Admin Workspace'}
              </button>
            </form>

            <div style={{
              marginTop: '20px',
              padding: '12px 14px',
              background: 'rgba(48, 184, 150, 0.08)',
              border: '1px solid rgba(48, 184, 150, 0.25)',
              borderRadius: '10px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                Default Staff Access
              </div>
              <div style={{ fontSize: '0.8rem', color: '#30B896', fontFamily: 'monospace', fontWeight: 600 }}>
                bridge360official08@gmail.com / bridge360
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
