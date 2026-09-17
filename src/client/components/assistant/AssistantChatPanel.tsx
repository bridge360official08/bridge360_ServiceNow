import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAssistant, type ChatMessage, type PendingApproval } from '../../store/AssistantContext';
import { useBridge360 } from '../../store/Bridge360Context';
import { AssistantService } from '../../services/AssistantService';
import { Send, X, Bot, User, Sparkles, Check, Ban, ShieldCheck } from 'lucide-react';

// Module-level id counter so two messages added in the same millisecond can't collide.
let _mid = 0;
const mkId = () => `m-${Date.now()}-${_mid++}`;
const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const AssistantChatPanel: React.FC = () => {
  const {
    isOpen, setIsOpen, portal, screenContext,
    messages, addMessage, updateMessage,
    triggerAction, reportActivity,
    isThinking, setIsThinking, playAnimation,
    conversationId, setConversationId,
    pendingApproval, setPendingApproval,
    agentTarget, pendingPrompt, clearPendingPrompt,
  } = useAssistant();
  const { language, t } = useBridge360();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handledKeyRef = useRef(0);

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
  const primaryColor = isCustomer ? '#8B5CF6' : '#0F172A';
  const accent = isCustomer ? '#7C3AED' : '#10B981';
  const title = isCustomer
    ? t('assistant.customerTitle', 'Bridge360 Guide')
    : t('assistant.adminTitle', 'AI Intern Assistant');
  const rtl = language === 'ar' || language === 'fa';

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
    if (!src) return null;
    const map = {
      servicenow: { label: t('assistant.srcSn', 'ServiceNow AI'), color: '#16A34A', icon: true },
      gemini: { label: t('assistant.srcGemini', 'Gemini'), color: '#2563EB', icon: false },
      canned: { label: t('assistant.srcOffline', 'offline mode'), color: '#94A3B8', icon: false },
    } as const;
    const cfg = map[src];
    if (!cfg) return null;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem', color: cfg.color, marginTop: '3px' }}>
        {cfg.icon && <ShieldCheck size={11} />} {cfg.label}
      </span>
    );
  };

  return (
    <div
      className="animate-slide-up"
      dir={rtl ? 'rtl' : 'ltr'}
      style={{
        position: 'fixed', bottom: '120px', right: '30px',
        width: '350px', height: '520px', backgroundColor: 'white',
        borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        zIndex: 9998, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        border: `1px solid ${isCustomer ? '#E9D5FF' : '#CBD5E1'}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: isCustomer
            ? 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)'
            : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: 'white', padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={18} />
          <span style={{ fontWeight: 600 }}>{title}</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          aria-label={t('assistant.close', 'Close')}
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#F8FAFC' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#64748B', marginTop: '40px', fontSize: '0.9rem' }}>
            {isCustomer
              ? t('assistant.greetCustomer', "Hi there! I'm your friendly guide. How can I help you today?")
              : t('assistant.greetAdmin', "Hello. I'm ready to assist with case summaries and verifications.")}
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end', maxWidth: '85%' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: msg.sender === 'user' ? '#E2E8F0' : primaryColor,
                color: msg.sender === 'user' ? '#475569' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '16px',
                  borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.sender === 'assistant' ? '4px' : '16px',
                  backgroundColor: msg.isError ? '#FEF2F2' : (msg.sender === 'user' ? primaryColor : 'white'),
                  color: msg.isError ? '#B91C1C' : (msg.sender === 'user' ? 'white' : '#1E293B'),
                  border: msg.sender === 'assistant' ? `1px solid ${msg.isError ? '#FECACA' : '#E2E8F0'}` : 'none',
                  fontSize: '0.9rem', lineHeight: 1.45, whiteSpace: 'pre-wrap',
                }}>
                  {msg.text}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && sourceBadge(msg.source)}
                </div>
              </div>
            </div>

            {/* Human-in-the-loop: supervised action awaiting the officer's go-ahead */}
            {msg.pendingApproval && (
              <div style={{
                marginTop: '10px', marginLeft: '36px', maxWidth: '85%',
                background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '12px 14px',
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '4px' }}>
                  {t('assistant.approvalNeeded', 'Approval needed')}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#78350F', fontWeight: 600 }}>
                  {msg.pendingApproval.actionLabel}
                </div>
                {msg.pendingApproval.summary && (
                  <div style={{ fontSize: '0.8rem', color: '#92400E', marginTop: '4px', lineHeight: 1.4 }}>
                    {msg.pendingApproval.summary}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button
                    onClick={() => handleApprove(true, msg)}
                    disabled={isThinking}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '8px 10px', borderRadius: '8px', border: 'none', cursor: isThinking ? 'not-allowed' : 'pointer',
                      backgroundColor: '#16A34A', color: 'white', fontSize: '0.82rem', fontWeight: 600, opacity: isThinking ? 0.6 : 1,
                    }}
                  >
                    <Check size={14} /> {t('assistant.approve', 'Approve')}
                  </button>
                  <button
                    onClick={() => handleApprove(false, msg)}
                    disabled={isThinking}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '8px 10px', borderRadius: '8px', border: '1px solid #FCA5A5', cursor: isThinking ? 'not-allowed' : 'pointer',
                      backgroundColor: 'white', color: '#DC2626', fontSize: '0.82rem', fontWeight: 600, opacity: isThinking ? 0.6 : 1,
                    }}
                  >
                    <Ban size={14} /> {t('assistant.reject', 'Reject')}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: primaryColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={14} />
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', backgroundColor: 'white', border: '1px solid #E2E8F0' }}>
              <div className="typing-indicator"><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px', backgroundColor: 'white', borderTop: '1px solid #E2E8F0' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('assistant.placeholder', 'Type your message...')}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '24px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            aria-label={t('assistant.send', 'Send')}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: inputText.trim() && !isThinking ? primaryColor : '#CBD5E1',
              color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: inputText.trim() && !isThinking ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s',
            }}
          >
            <Send size={16} style={{ marginLeft: rtl ? 0 : '2px', marginRight: rtl ? '2px' : 0 }} />
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.65rem', color: '#CBD5E1' }}>
          {t('assistant.poweredBy', 'Powered by ServiceNow AI')}
          <span style={{ color: accent }}> • Bridge360</span>
        </div>
      </div>

      <style>{`
        .typing-indicator { display: flex; gap: 4px; }
        .typing-indicator span {
          width: 6px; height: 6px; background-color: #94A3B8; border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
      `}</style>
    </div>
  );
};
