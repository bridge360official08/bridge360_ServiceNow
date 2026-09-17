import React, { useState, useEffect } from 'react';
import { useAssistant } from '../../store/AssistantContext';
import { CustomerMascotSVG, AdminMascotSVG } from './MascotSVGs';

export const FloatingMascot: React.FC = () => {
  const { 
    portal, 
    proactiveMessage, 
    proactiveAction, 
    setProactiveMessage, 
    setProactiveAction, 
    mascotAnimation, 
    mascotAnimationKey, 
    isThinking 
  } = useAssistant();
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Effective cue: "think" while the assistant is working, "talk" while a
  // proactive line types out, otherwise whatever gesture was last played.
  const effectiveAnimation = isThinking
    ? 'think'
    : isTyping
    ? 'talk'
    : mascotAnimation;

  // Typewriter effect for proactive message
  useEffect(() => {
    if (!proactiveMessage) return;
    setIsTyping(true);
    setDisplayText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < proactiveMessage.length) {
        setDisplayText(proactiveMessage.substring(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 40); // typing speed
    
    return () => clearInterval(timer);
  }, [proactiveMessage]);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  if (isCollapsed) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 9997,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={() => setIsCollapsed(false)}
          title="Open AI Guide"
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: portal === 'customer' ? 'linear-gradient(135deg, #7C3AED, #2563EB)' : 'linear-gradient(135deg, #059669, #0284C7)',
            border: '2px solid #FFFFFF',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#FFFFFF',
            fontSize: '1.4rem'
          }}
        >
          🤖
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9997,
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      {/* Mascot Avatar */}
      <div 
        style={{
          width: '140px',
          height: '160px',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
      >
        {/* Minimize Button */}
        <button
          onClick={() => setIsCollapsed(true)}
          title="Minimize Assistant"
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#1E293B',
            color: '#FFFFFF',
            border: '1px solid #475569',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {portal === 'customer'
          ? <CustomerMascotSVG animation={effectiveAnimation} animationKey={mascotAnimationKey} />
          : <AdminMascotSVG animation={effectiveAnimation} animationKey={mascotAnimationKey} />}
      </div>

      {/* Proactive Speech Bubble */}
      {proactiveMessage && (
        <div
          className="animate-slide-up"
          style={{
            backgroundColor: 'white',
            padding: '12px 18px',
            borderRadius: '16px',
            borderBottomLeftRadius: '4px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
            maxWidth: '260px',
            marginBottom: '20px',
            fontSize: '0.88rem',
            color: '#1E293B',
            position: 'relative',
            border: `2px solid ${portal === 'customer' ? '#8B5CF6' : '#10B981'}`,
            pointerEvents: 'auto',
          }}
        >
          <div style={{ fontWeight: 700, color: portal === 'customer' ? '#7C3AED' : '#059669', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{portal === 'customer' ? 'Your Guide' : 'AI Intern'}</span>
            <button
              onClick={() => setIsCollapsed(true)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Minimize
            </button>
          </div>
          <div style={{ lineHeight: 1.5, minHeight: '40px' }}>
            {displayText}
          </div>
          {proactiveAction && proactiveAction.length > 0 && displayText === proactiveMessage && (
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {proactiveAction.map((action, idx) => (
                <button
                  key={idx}
                  style={{
                    background: action.primary ? (portal === 'customer' ? '#8B5CF6' : '#10B981') : 'transparent',
                    color: action.primary ? 'white' : (portal === 'customer' ? '#8B5CF6' : '#10B981'),
                    border: action.primary ? 'none' : `1px solid ${portal === 'customer' ? '#8B5CF6' : '#10B981'}`,
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    action.onClick();
                    setProactiveAction(null);
                    setProactiveMessage(null);
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
          {/* Tail of the bubble pointing left to the mascot */}
          <div
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: '-10px',
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderLeft: `2px solid ${portal === 'customer' ? '#8B5CF6' : '#10B981'}`,
              borderBottom: `2px solid ${portal === 'customer' ? '#8B5CF6' : '#10B981'}`,
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      )}

      {/* Global CSS injected for the speech-bubble entrance */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
