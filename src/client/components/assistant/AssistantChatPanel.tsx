import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAssistant, type ChatMessage, type PendingApproval } from '../../store/AssistantContext';
import { useBridge360 } from '../../store/Bridge360Context';
import { AssistantService } from '../../services/AssistantService';
import { GeminiService } from '../../services/GeminiService';
import { AdminMascotSVG, CustomerMascotSVG, MASCOT_IDLE_GESTURES } from './MascotSVGs';
import { Send, X, Bot, User, Sparkles, Check, Ban, ShieldCheck, Settings2, Power } from 'lucide-react';

// Module-level id counter so two messages added in the same millisecond can't collide.
let _mid = 0;
const mkId = () => `m-${Date.now()}-${_mid++}`;
const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const AssistantChatPanel: React.FC<{ position: { right: number; bottom: number } }> = ({ position }) => {
  const {
    isOpen, setIsOpen, portal, screenContext, guideTarget, mascotMode,
    assistantEnabled, setAssistantEnabled,
    messages, addMessage, updateMessage,
    triggerAction, reportActivity,
    isThinking, setIsThinking, playAnimation,
    conversationId, setConversationId,
    pendingApproval, setPendingApproval,
    agentTarget, pendingPrompt, clearPendingPrompt,
  } = useAssistant();
  const { language, t } = useBridge360();

  const [inputText, setInputText] = useState('');
  const [companionAnimation, setCompanionAnimation] = useState(() =>
    MASCOT_IDLE_GESTURES[Math.floor(Math.random() * MASCOT_IDLE_GESTURES.length)],
  );
  const [companionAnimationKey, setCompanionAnimationKey] = useState(0);
  const [assistantSettingsOpen, setAssistantSettingsOpen] = useState(false);
  const [viewport, setViewport] = useState(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  }));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handledKeyRef = useRef(0);

  useEffect(() => {
    const updateViewport = () => setViewport({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    });
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const chooseGesture = () => {
      setCompanionAnimation(MASCOT_IDLE_GESTURES[Math.floor(Math.random() * MASCOT_IDLE_GESTURES.length)]);
      setCompanionAnimationKey(key => key + 1);
      timer = setTimeout(chooseGesture, 2600 + Math.random() * 1800);
    };
    timer = setTimeout(chooseGesture, 1800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isThinking]);

  // Core send. Takes the text directly so it can be driven both by the input
  // box and by programmatic dispatch (admin quick-actions). Threads the current
  // agentTarget as case context so the Intern reasons over the selected family.
  const sendText = useCallback(async (userText: string) => {
    if (!userText || isThinking) return;
    // `messages` here is the history BEFORE this turn — what Gemini should replay
    // (the SN path uses conversationId for memory).
    const priorHistory = messages;

    addMessage({ id: mkId(), sender: 'user', text: userText, timestamp: now() });
    reportActivity('input', userText);
    setIsThinking(true);
    playAnimation('think');

    try {
      const reply = await AssistantService.send(userText, {
        role: portal,
        screenContext,
        language,
        history: priorHistory,
        conversationId,
        targetTable: agentTarget?.table,
        targetRecordId: agentTarget?.recordId,
      });

      if (reply.conversationId) setConversationId(reply.conversationId);
      if (reply.action) triggerAction(reply.action);

      const pending: PendingApproval | null = reply.pendingApproval ?? null;
      addMessage({
        id: mkId(),
        sender: 'assistant',
        text: reply.text,
        timestamp: now(),
        pendingApproval: pending,
        isError: reply.isError,
        source: reply.source,
      });
      if (pending) setPendingApproval(pending);
      playAnimation(pending ? 'alert' : 'talk');
    } finally {
      setIsThinking(false);
    }
  }, [messages, isThinking, portal, screenContext, language, conversationId, agentTarget,
      addMessage, reportActivity, setIsThinking, playAnimation, setConversationId, triggerAction, setPendingApproval]);

  // Auto-send a programmatic prompt injected via dispatchToAssistant(). Guarded
  // by a handled-key ref so it fires once per dispatch (and survives StrictMode).
  useEffect(() => {
    if (!isOpen || !pendingPrompt || isThinking) return;
    if (pendingPrompt.key === handledKeyRef.current) return;
    handledKeyRef.current = pendingPrompt.key;
    const text = pendingPrompt.text;
    clearPendingPrompt();
    void sendText(text);
  }, [isOpen, pendingPrompt, isThinking, sendText, clearPendingPrompt]);

  if (!isOpen) return null;

  const isCustomer = portal === 'customer';
  const accent = isCustomer ? '#A855F7' : '#22D3EE';
  const accentDim = isCustomer ? '#7C3AED' : '#0E7490';
  const panelBg = isCustomer
    ? 'linear-gradient(135deg, rgba(49,10,90,.95) 0%, rgba(30,5,60,.92) 100%)'
    : 'linear-gradient(135deg, rgba(10,16,30,.96) 0%, rgba(19,41,74,.93) 100%)';
  const title = isCustomer
    ? t('assistant.customerTitle', 'Bridge360 Guide')
    : t('assistant.adminTitle', 'AI Intern Assistant');
  const ChatMascot = isCustomer ? CustomerMascotSVG : AdminMascotSVG;
  const rtl = language === 'ar' || language === 'fa';
  const panelWidth = Math.min(320, viewport.width - 24);
  const launcherCenter = viewport.width - position.right - 80;
  const panelRight = Math.min(
    Math.max(12, viewport.width - launcherCenter - panelWidth / 2),
    Math.max(12, viewport.width - panelWidth - 12),
  );
  const panelBottom = Math.min(position.bottom + 96, Math.max(12, viewport.height - 120));
  const panelMaxHeight = Math.max(180, Math.min(390, viewport.height - panelBottom - 12));
  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: `${panelBottom}px`,
    right: `${panelRight}px`,
    width: `${panelWidth}px`,
    maxHeight: `${panelMaxHeight}px`,
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const userText = inputText.trim();
    if (!userText || isThinking) return;
    setInputText('');
    void sendText(userText);
  };

  const handleApprove = async (approve: boolean, msg: ChatMessage) => {
    const cid = msg.pendingApproval?.conversationId || conversationId;
    if (!cid || isThinking) return;

    // Resolve the prompt so its buttons disappear immediately.
    updateMessage(msg.id, { pendingApproval: null });
    setPendingApproval(null);
    setIsThinking(true);
    playAnimation('think');

    try {
      const reply = await AssistantService.approve(cid, approve);
      if (reply.conversationId) setConversationId(reply.conversationId);
      if (reply.action) triggerAction(reply.action);
      addMessage({
        id: mkId(),
        sender: 'assistant',
        text: reply.text || (approve
          ? t('assistant.approved', 'Approved — applying the change now.')
          : t('assistant.rejected', 'Understood — I won\'t make that change.')),
        timestamp: now(),
        isError: reply.isError,
        source: reply.source,
      });
      playAnimation(approve ? 'celebrate' : 'nod');
    } finally {
      setIsThinking(false);
    }
  };

  const sourceBadge = (src?: ChatMessage['source']) => {
    if (!src || src === 'gemini') return null;
    const map = {
      servicenow: { label: t('assistant.srcSn', 'ServiceNow AI'), color: '#22C55E', icon: true },
      gemini: { label: t('assistant.srcGemini', 'Gemini'), color: '#38BDF8', icon: false },
      canned: { label: t('assistant.srcOffline', 'offline mode'), color: '#64748B', icon: false },
    } as const;
    const cfg = map[src];
    if (!cfg) return null;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.62rem', color: cfg.color, marginTop: '3px' }}>
        {cfg.icon && <ShieldCheck size={10} />} {cfg.label}
      </span>
    );
  };

  return (
    <div
      className="b360-assistant-doubtbox"
      dir={rtl ? 'rtl' : 'ltr'}
      style={{
        ...panelStyle,
        isolation: 'isolate',
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        pointerEvents: 'none',
        animation: 'doubtbox-in .35s cubic-bezier(.16,1,.3,1) forwards',
      }}
    >
      <div className="b360-chat-companion" aria-hidden="true" style={{
        position: 'absolute', top: '-54px', right: '8px',
        width: '54px', height: '68px',
        display: guideTarget && mascotMode === 'moving' ? 'none' : 'flex',
        alignItems: 'center', justifyContent: 'center',
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${accent}30 0%, ${accent}0A 48%, transparent 74%)`,
        filter: `drop-shadow(0 0 8px ${accent}70)`,
        pointerEvents: 'none',
        zIndex: 2,
      }}>
        <ChatMascot
          animation={isThinking ? 'think' : companionAnimation}
          animationKey={companionAnimationKey}
        />
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        maxHeight: 'inherit',
        overflow: 'hidden',
        pointerEvents: 'auto',
        background: panelBg,
        backdropFilter: 'blur(16px)',
        borderRadius: '18px',
        border: `1px solid ${accent}30`,
        boxShadow: `0 20px 60px rgba(0,0,0,.38), 0 0 34px ${accent}22, inset 0 0 60px ${accent}08`,
      }}>
      {/* Header — glassy strip */}
      <div style={{
        padding: '11px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `1px solid ${accent}20`,
        background: `${accent}08`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color={accent} />
          <span style={{ fontWeight: 700, fontSize: '.88rem', color: '#F1F5F9' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <button
            onClick={() => setAssistantSettingsOpen(open => !open)}
            aria-label={t('assistant.settings', 'Assistant settings')}
            aria-expanded={assistantSettingsOpen}
            aria-controls="b360-assistant-settings"
            title={t('assistant.settings', 'Assistant settings')}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '6px 8px', borderRadius: '8px',
              border: `1px solid ${accent}30`, background: `${accent}0A`,
              color: '#CBD5E1', cursor: 'pointer', fontSize: '.7rem',
            }}
          >
            <Settings2 size={16} />
            <span>{t('assistant.settings', 'Settings')}</span>
          </button>
          {assistantSettingsOpen && (
            <div
              id="b360-assistant-settings"
              role="group"
              aria-label={t('assistant.settings', 'Assistant settings')}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: 'min(230px, calc(100vw - 64px))', padding: '12px',
                borderRadius: '12px', border: `1px solid ${accent}45`,
                background: 'rgba(10, 15, 28, .98)',
                boxShadow: '0 12px 32px rgba(0,0,0,.4)',
                zIndex: 20,
              }}
            >
              <div style={{ fontSize: '.72rem', color: '#94A3B8', marginBottom: '8px' }}>
                {t('assistant.floatingMascot', 'Floating hologram')}
              </div>
              <button
                onClick={() => setAssistantEnabled(!assistantEnabled)}
                aria-pressed={assistantEnabled}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '9px 10px', borderRadius: '9px',
                  border: `1px solid ${accent}35`,
                  background: `${accent}14`, color: '#F1F5F9',
                  cursor: 'pointer', textAlign: 'left', fontSize: '.8rem', fontWeight: 600,
                }}
              >
                <Power size={14} color={assistantEnabled ? accent : '#94A3B8'} />
                {assistantEnabled
                  ? t('assistant.hideHologram', 'Hide hologram')
                  : t('assistant.showHologram', 'Show hologram')}
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setAssistantSettingsOpen(false);
              setIsOpen(false);
            }}
            aria-label={t('assistant.close', 'Close')}
            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px', transition: 'color .15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F1F5F9')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px',
        display: 'flex', flexDirection: 'column', gap: '12px',
        scrollbarWidth: 'thin',
        scrollbarColor: `${accent}30 transparent`,
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center', color: '#94A3B8', marginTop: '30px', fontSize: '.88rem',
            padding: '0 12px', lineHeight: 1.5,
          }}>
            {isCustomer
              ? t('assistant.greetCustomer', "Hi there! I'm your friendly guide. How can I help you today?")
              : t('assistant.greetAdmin', "Hello. I'm ready to assist with case summaries and verifications.")}
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end', maxWidth: '88%' }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                background: msg.sender === 'user' ? '#334155' : `${accent}25`,
                color: msg.sender === 'user' ? '#CBD5E1' : accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${msg.sender === 'user' ? '#475569' : accent + '40'}`,
              }}>
                {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '14px',
                  borderBottomRightRadius: msg.sender === 'user' ? '4px' : '14px',
                  borderBottomLeftRadius: msg.sender === 'assistant' ? '4px' : '14px',
                  backgroundColor: msg.isError ? 'rgba(239,68,68,.12)'
                    : msg.sender === 'user' ? `${accentDim}40`
                    : 'rgba(255,255,255,.06)',
                  color: msg.isError ? '#FCA5A5' : '#E2E8F0',
                  border: `1px solid ${msg.isError ? 'rgba(239,68,68,.25)' : msg.sender === 'user' ? `${accent}30` : 'rgba(255,255,255,.08)'}`,
                  fontSize: '.87rem', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                  fontWeight: 500,
                }}>
                  {msg.text}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '3px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#64748B' }}>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && sourceBadge(msg.source)}
                </div>
              </div>
            </div>

            {/* Human-in-the-loop: supervised action awaiting the officer's go-ahead */}
            {msg.pendingApproval && (
              <div style={{
                marginTop: '8px', marginLeft: '34px', maxWidth: '88%',
                background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.25)',
                borderRadius: '12px', padding: '10px 12px',
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '4px' }}>
                  {t('assistant.approvalNeeded', 'Approval needed')}
                </div>
                <div style={{ fontSize: '.82rem', color: '#FDE68A', fontWeight: 700 }}>
                  {msg.pendingApproval.actionLabel}
                </div>
                {msg.pendingApproval.summary && (
                  <div style={{ fontSize: '.78rem', color: '#FCD34D', marginTop: '4px', lineHeight: 1.4, opacity: .85 }}>
                    {msg.pendingApproval.summary}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button
                    onClick={() => handleApprove(true, msg)}
                    disabled={isThinking}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                      padding: '7px 10px', borderRadius: '8px', border: 'none', cursor: isThinking ? 'not-allowed' : 'pointer',
                      backgroundColor: '#22C55E', color: '#052E16', fontSize: '.8rem', fontWeight: 700, opacity: isThinking ? 0.5 : 1,
                      transition: 'opacity .15s',
                    }}
                  >
                    <Check size={13} /> {t('assistant.approve', 'Approve')}
                  </button>
                  <button
                    onClick={() => handleApprove(false, msg)}
                    disabled={isThinking}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                      padding: '7px 10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,.4)', cursor: isThinking ? 'not-allowed' : 'pointer',
                      backgroundColor: 'transparent', color: '#FCA5A5', fontSize: '.8rem', fontWeight: 700, opacity: isThinking ? 0.5 : 1,
                      transition: 'opacity .15s',
                    }}
                  >
                    <Ban size={13} /> {t('assistant.reject', 'Reject')}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '50%',
              background: `${accent}25`, color: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${accent}40`,
            }}>
              <Bot size={13} />
            </div>
            <div style={{
              padding: '12px 16px', borderRadius: '14px', borderBottomLeftRadius: '4px',
              background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)',
            }}>
              <div className="typing-indicator"><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input — pill style "what's your doubt mate?" */}
      <div style={{
        padding: '9px 11px',
        borderTop: `1px solid ${accent}15`,
        background: `${accent}05`,
      }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            className="b360-chat-input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isCustomer
              ? t('assistant.placeholder', "What's your doubt, mate?...")
              : t('assistant.placeholder', 'Ask me anything...')}
            style={{
              flex: 1, padding: '10px 16px',
              borderRadius: '24px',
              border: `1.5px solid ${accent}30`,
              background: 'rgba(255,255,255,.05)',
              color: '#F1F5F9',
              fontSize: '.88rem', fontWeight: 500,
              outline: 'none',
              transition: 'border-color .2s, box-shadow .2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = `${accent}80`;
              e.target.style.boxShadow = `0 0 0 3px ${accent}15`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = `${accent}30`;
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            aria-label={t('assistant.send', 'Send')}
            style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: inputText.trim() && !isThinking
                ? `linear-gradient(135deg, ${accent}, ${accentDim})`
                : '#334155',
              color: 'white', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: inputText.trim() && !isThinking ? 'pointer' : 'not-allowed',
              transition: 'background .2s, transform .15s',
              flexShrink: 0,
            }}
          >
            <Send size={15} style={{ marginLeft: rtl ? 0 : '2px', marginRight: rtl ? '2px' : 0 }} />
          </button>
        </form>
        <div style={{
          textAlign: 'center', marginTop: '5px',
          fontSize: '0.6rem', color: '#475569',
        }}>
          {t('assistant.poweredBy', 'Powered by ServiceNow AI')}
          <span style={{ color: accent }}> • Bridge360</span>
        </div>
      </div>
      </div>

      <style>{`
        .b360-chat-input-text {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: #F1F5F9 !important;
          -webkit-text-fill-color: #F1F5F9 !important;
          caret-color: #F1F5F9 !important;
          user-select: text !important;
          -webkit-user-select: text !important;
        }
        .b360-chat-input-text::placeholder {
          color: #94A3B8 !important;
          -webkit-text-fill-color: #94A3B8 !important;
        }
        @keyframes doubtbox-in {
          0% { opacity: 0; transform: translateY(20px) scale(.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .typing-indicator { display: flex; gap: 4px; }
        .typing-indicator span {
          width: 6px; height: 6px; background-color: ${accent}; border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .b360-chat-companion,
          .b360-chat-companion * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};
