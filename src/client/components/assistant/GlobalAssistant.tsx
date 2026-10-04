import React, { useEffect } from 'react';
import { FloatingMascot } from './FloatingMascot';
import { AssistantChatPanel } from './AssistantChatPanel';
import { useAssistant } from '../../store/AssistantContext';
import { useBridge360 } from '../../store/Bridge360Context';
import { AssistantService } from '../../services/AssistantService';
import { MessageCircle, X } from 'lucide-react';

export const GlobalAssistant: React.FC = () => {
  const {
    setPortal, portal, screenContext, setProactiveMessage,
    isOpen, setIsOpen, playAnimation, pendingApproval,
    proactiveAction, setProactiveAction,
    assistantEnabled, setAssistantEnabled,
  } = useAssistant();
  const { language } = useBridge360();

  // Route → portal (admin vs customer).
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setPortal(hash.includes('/admin') ? 'admin' : 'customer');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setPortal]);

  // Proactive floating-mascot tip. SN-primary for chat; proactive uses the fast
  // path (Gemini → friendly canned) so navigation stays snappy and multilingual.
  // Debounced so rapid navigation doesn't spam, and re-runs when the language
  // changes so the bubble follows the user's selected language.
  useEffect(() => {
    if (screenContext === 'home') {
      setProactiveMessage('');
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (proactiveAction) return; // Skip automatic tips if a manual interactive action is set
      const tip = await AssistantService.proactiveTip(portal, screenContext, language);
      if (!cancelled && tip) {
        setProactiveMessage(tip);
        playAnimation('wave');
      }
    }, 500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [screenContext, portal, language, setProactiveMessage, playAnimation, proactiveAction]);

  const isCustomer = portal === 'customer';
  const fabColor = isCustomer ? '#8B5CF6' : '#22D3EE';
  const fabBg = isCustomer
    ? 'linear-gradient(135deg, #7C3AED, #A855F7)'
    : 'linear-gradient(135deg, #0F172A, #164E63)';

  return (
    <>
      <FloatingMascot />
      <AssistantChatPanel />

      {/* Chat launcher (FAB) — bottom-left, below the hologram cage */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '140px',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open assistant"
          style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: fabBg, color: 'white', border: 'none',
            boxShadow: `0 4px 20px ${fabColor}44, 0 0 30px ${fabColor}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s',
            transform: isOpen ? 'scale(0)' : 'scale(1)',
          }}
        >
          <MessageCircle size={24} />
          {/* Approval badge */}
          {pendingApproval && !isOpen && (
            <span style={{
              position: 'absolute', top: '0px', right: '0px',
              width: '12px', height: '12px', borderRadius: '50%',
              backgroundColor: '#EF4444', border: '2px solid white',
              animation: 'b360-ping 1.6s cubic-bezier(0,0,0.2,1) infinite',
            }} />
          )}
        </button>

        {/* Disable toggle — slider to hide the hologram mascot */}
        {!isOpen && (
          <button
            onClick={() => setAssistantEnabled(!assistantEnabled)}
            title={assistantEnabled ? 'Hide AI assistant' : 'Show AI assistant'}
            aria-label={assistantEnabled ? 'Hide AI assistant' : 'Show AI assistant'}
            style={{
              position: 'relative',
              width: '36px', height: '20px',
              borderRadius: '10px',
              backgroundColor: assistantEnabled ? `${fabColor}88` : '#475569',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color .25s',
              flexShrink: 0,
            }}
          >
            <span style={{
              position: 'absolute',
              top: '2px',
              left: assistantEnabled ? '18px' : '2px',
              width: '16px', height: '16px',
              borderRadius: '50%',
              backgroundColor: 'white',
              transition: 'left .25s cubic-bezier(.34,1.56,.64,1)',
              boxShadow: '0 1px 3px rgba(0,0,0,.25)',
            }} />
          </button>
        )}
      </div>

      <style>{`
        @keyframes b360-ping {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          70%  { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
      `}</style>
    </>
  );
};
