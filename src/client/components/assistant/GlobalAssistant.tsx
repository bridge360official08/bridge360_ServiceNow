import React, { useEffect } from 'react';
import { FloatingMascot } from './FloatingMascot';
import { AssistantChatPanel } from './AssistantChatPanel';
import { useAssistant } from '../../store/AssistantContext';
import { useBridge360 } from '../../store/Bridge360Context';
import { AssistantService } from '../../services/AssistantService';
import { MessageCircle } from 'lucide-react';

export const GlobalAssistant: React.FC = () => {
  const {
    setPortal, portal, screenContext, setProactiveMessage,
    isOpen, setIsOpen, playAnimation, pendingApproval,
    proactiveAction, setProactiveAction
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

  const fabColor = portal === 'customer' ? '#8B5CF6' : '#0F172A';

  return (
    <>
      <FloatingMascot />
      <AssistantChatPanel />

      {/* Chat launcher (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open assistant"
        style={{
          position: 'fixed', bottom: '30px', right: '30px',
          width: '56px', height: '56px', borderRadius: '50%',
          backgroundColor: fabColor, color: 'white', border: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 9999,
          transition: 'transform 0.2s, background-color 0.2s',
          transform: isOpen ? 'scale(0)' : 'scale(1)',
        }}
      >
        <MessageCircle size={28} />
        {/* Draw attention when a supervised action is waiting for approval. */}
        {pendingApproval && !isOpen && (
          <span
            style={{
              position: 'absolute', top: '2px', right: '2px',
              width: '14px', height: '14px', borderRadius: '50%',
              backgroundColor: '#EF4444', border: '2px solid white',
              boxShadow: '0 0 0 rgba(239,68,68,0.5)',
              animation: 'b360-ping 1.6s cubic-bezier(0,0,0.2,1) infinite',
            }}
          />
        )}
      </button>

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
