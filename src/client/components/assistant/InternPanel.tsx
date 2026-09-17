import React, { useState } from 'react';
import {
  Sparkles, FileText, Scale, Mail, MessageSquare,
  Check, Ban, Copy, NotebookPen, Loader2, ShieldCheck,
} from 'lucide-react';
import { useAssistant } from '../../store/AssistantContext';
import { useBridge360 } from '../../store/Bridge360Context';
import {
  snAgentCaseSummary, snAgentDraftDecision, snAgentDraftMessage, snAgentApplyDecision,
  type SNApplyDecisionResponse,
} from '../../services/snApi';

// Local id counter for injected chat messages + result cards.
let _iid = 0;
const iid = () => `intern-${Date.now()}-${_iid++}`;
const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

type ResultKind = 'summary' | 'decision' | 'message';

interface ResultCard {
  id: string;
  kind: ResultKind;
  title: string;
  text: string;
  source?: 'servicenow' | 'canned';
  /** Decision cards carry Apply controls. */
  applicable?: boolean;
}

export interface InternPanelProps {
  /** ServiceNow sys_id of the family — required for the real case tools. */
  familySysId?: string;
  /** Human label, e.g. "Al-Rashid family (APP-2026-000123)". */
  familyLabel: string;
  /** Local family.id — used to attach drafts as officer notes. */
  localFamilyId: string;
  /** Family's preferred language for drafts / customer messages. */
  language?: string;
  /** Tighter layout for the verification sidebar. */
  compact?: boolean;
  /**
   * Called after a supervised decision is applied on the backend so the parent
   * view can reflect the new state locally (mint IDs, flip status, etc.).
   */
  onApplied?: (decision: 'verify' | 'reject', res: SNApplyDecisionResponse) => void;
}

/**
 * The admin "AI Intern" surface. Each quick action runs a fast, deterministic
 * backend case tool, renders the result INLINE, and mirrors it into the chat
 * thread (the "Both" experience). Decision drafts expose supervised Apply
 * buttons; every draft can be copied or filed as an officer note.
 */
export const InternPanel: React.FC<InternPanelProps> = ({
  familySysId, familyLabel, localFamilyId, language, compact, onApplied,
}) => {
  const { dispatchToAssistant, addMessage, setIsOpen, playAnimation } = useAssistant();
  const { addFamilyNote, t } = useBridge360();

  const [busy, setBusy] = useState<ResultKind | 'apply' | null>(null);
  const [cards, setCards] = useState<ResultCard[]>([]);
  const [applied, setApplied] = useState<'verify' | 'reject' | null>(null);
  const [error, setError] = useState<string>('');

  const disabled = !familySysId;

  // Push a user→assistant pair into the chat so the inline result is mirrored
  // there too, and surface the panel.
  const mirrorToChat = (ask: string, answer: string, source?: 'servicenow' | 'canned') => {
    addMessage({ id: iid(), sender: 'user', text: ask, timestamp: clock() });
    addMessage({ id: iid(), sender: 'assistant', text: answer, timestamp: clock(), source });
    setIsOpen(true);
    playAnimation('talk');
  };

  const pushCard = (card: Omit<ResultCard, 'id'>) => {
    setCards(prev => [{ id: iid(), ...card }, ...prev]);
  };

  const runSummary = async () => {
    if (disabled || busy) return;
    setBusy('summary'); setError('');
    try {
      const res = await snAgentCaseSummary(familySysId!, language);
      if (res.success && res.summary) {
        pushCard({ kind: 'summary', title: t('intern.summaryTitle', 'Case summary & next actions'), text: res.summary, source: res.source });
        mirrorToChat(t('intern.askSummary', 'Summarize this case and recommend next actions.'), res.summary, res.source);
      } else {
        setError(res.message || t('intern.failed', 'The Intern could not complete that just now.'));
      }
    } finally {
      setBusy(null);
    }
  };

  const runDecision = async () => {
    if (disabled || busy) return;
    setBusy('decision'); setError('');
    try {
      const res = await snAgentDraftDecision(familySysId!, language);
      if (res.success && res.draft) {
        pushCard({ kind: 'decision', title: t('intern.decisionTitle', 'Draft decision & justification'), text: res.draft, source: res.source, applicable: true });
        mirrorToChat(t('intern.askDecision', 'Draft a verification decision and justification for this case.'), res.draft, res.source);
      } else {
        setError(res.message || t('intern.failed', 'The Intern could not complete that just now.'));
      }
    } finally {
      setBusy(null);
    }
  };

  const runMessage = async () => {
    if (disabled || busy) return;
    setBusy('message'); setError('');
    try {
      const res = await snAgentDraftMessage(familySysId!, 'status_update', language);
      if (res.success && res.draft) {
        pushCard({ kind: 'message', title: t('intern.messageTitle', 'Draft customer message'), text: res.draft, source: res.source });
        mirrorToChat(t('intern.askMessage', 'Draft a warm status-update message for this family in their language.'), res.draft, res.source);
      } else {
        setError(res.message || t('intern.failed', 'The Intern could not complete that just now.'));
      }
    } finally {
      setBusy(null);
    }
  };

  const applyDecision = async (decision: 'verify' | 'reject') => {
    if (disabled || busy) return;
    const label = decision === 'verify'
      ? t('intern.confirmVerify', 'Apply VERIFY? This mints the family/refugee IDs and flips the application to Verified.')
      : t('intern.confirmReject', 'Apply REJECT? This marks the application rejected and notifies the applicant.');
    if (!window.confirm(label)) return;
    setBusy('apply'); setError('');
    try {
      const res = await snAgentApplyDecision(familySysId!, decision);
      if (res.success) {
        setApplied(decision);
        const done = decision === 'verify'
          ? t('intern.verified', 'Decision applied — application verified.') + (res.bridge360Id ? ` (${res.bridge360Id})` : '')
          : t('intern.rejected', 'Decision applied — application rejected.');
        pushCard({ kind: 'decision', title: t('intern.applied', 'Decision applied'), text: done, source: 'servicenow' });
        mirrorToChat(decision === 'verify' ? 'Apply the verification decision.' : 'Reject this application.', done, 'servicenow');
        playAnimation(decision === 'verify' ? 'celebrate' : 'nod');
        if (onApplied) onApplied(decision, res);
      } else {
        setError(res.message || t('intern.failed', 'The Intern could not complete that just now.'));
      }
    } finally {
      setBusy(null);
    }
  };

  const openChat = () => {
    dispatchToAssistant(t('intern.askSummary', 'Summarize this case and recommend next actions.'));
  };

  const btn = (
    key: ResultKind | 'chat',
    icon: React.ReactNode,
    label: string,
    onClick: () => void,
  ) => (
    <button
      key={key}
      onClick={onClick}
      disabled={(disabled && key !== 'chat') || !!busy}
      title={disabled && key !== 'chat' ? t('intern.needSync', 'This family is not yet synced to ServiceNow.') : label}
      style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: compact ? '7px 10px' : '8px 12px',
        borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF',
        color: '#0F172A', fontSize: '0.8rem', fontWeight: 600,
        cursor: (disabled && key !== 'chat') || busy ? 'not-allowed' : 'pointer',
        opacity: (disabled && key !== 'chat') || busy ? 0.55 : 1,
      }}
    >
      {busy === key ? <Loader2 size={14} className="intern-spin" /> : icon}
      {label}
    </button>
  );

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: '12px', padding: compact ? '16px' : '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', color: '#E2E8F0',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(16,185,129,0.15)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>{t('intern.title', 'AI Intern')}</h3>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{familyLabel}</div>
          </div>
        </div>
        <span style={{ fontSize: '0.65rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={11} /> ServiceNow AI
        </span>
      </div>

      <div style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '10px 0 14px' }}>
        {t('intern.blurb', 'Delegate the slow parts. Results appear here and in the chat — nothing changes until you approve it.')}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {btn('summary', <FileText size={14} />, t('intern.summarize', 'Summarize case'), runSummary)}
        {btn('decision', <Scale size={14} />, t('intern.draftDecision', 'Draft decision'), runDecision)}
        {btn('message', <Mail size={14} />, t('intern.draftMessage', 'Draft message'), runMessage)}
        {btn('chat', <MessageSquare size={14} />, t('intern.discuss', 'Discuss'), openChat)}
      </div>

      {disabled && (
        <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#FBBF24' }}>
          {t('intern.needSync', 'This family is not yet synced to ServiceNow.')}
        </div>
      )}

      {error && (
        <div style={{ marginTop: '12px', padding: '10px 12px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(248,113,113,0.4)', borderRadius: '8px', fontSize: '0.8rem', color: '#FCA5A5' }}>
          {error}
        </div>
      )}

      {/* Inline result cards */}
      {cards.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
          {cards.map(card => (
            <div key={card.id} style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '14px', color: '#0F172A' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>{card.title}</span>
                {card.source && (
                  <span style={{ fontSize: '0.62rem', color: card.source === 'servicenow' ? '#16A34A' : '#94A3B8', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    {card.source === 'servicenow' ? <><ShieldCheck size={10} /> ServiceNow AI</> : t('assistant.srcOffline', 'offline mode')}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.84rem', lineHeight: 1.5, color: '#1E293B', whiteSpace: 'pre-wrap' }}>{card.text}</div>

              {/* Card actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { void navigator.clipboard?.writeText(card.text); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 9px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#475569', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  <Copy size={12} /> {t('common.copy', 'Copy')}
                </button>
                <button
                  onClick={() => addFamilyNote(localFamilyId, card.text)}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 9px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#475569', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  <NotebookPen size={12} /> {t('intern.addNote', 'Add to notes')}
                </button>

                {/* Supervised apply on decision drafts */}
                {card.applicable && applied === null && (
                  <>
                    <button
                      onClick={() => applyDecision('verify')}
                      disabled={busy === 'apply'}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#16A34A', color: '#FFFFFF', fontSize: '0.74rem', fontWeight: 700, cursor: busy === 'apply' ? 'not-allowed' : 'pointer', opacity: busy === 'apply' ? 0.6 : 1 }}
                    >
                      <Check size={12} /> {t('intern.applyVerify', 'Verify & mint IDs')}
                    </button>
                    <button
                      onClick={() => applyDecision('reject')}
                      disabled={busy === 'apply'}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #FCA5A5', background: '#FFFFFF', color: '#DC2626', fontSize: '0.74rem', fontWeight: 700, cursor: busy === 'apply' ? 'not-allowed' : 'pointer', opacity: busy === 'apply' ? 0.6 : 1 }}
                    >
                      <Ban size={12} /> {t('intern.applyReject', 'Reject')}
                    </button>
                  </>
                )}
                {card.applicable && applied !== null && (
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: applied === 'verify' ? '#16A34A' : '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {applied === 'verify' ? <Check size={12} /> : <Ban size={12} />}
                    {applied === 'verify' ? t('intern.verified', 'Applied — verified') : t('intern.rejected', 'Applied — rejected')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .intern-spin { animation: intern-spin 0.9s linear infinite; }
        @keyframes intern-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default InternPanel;
