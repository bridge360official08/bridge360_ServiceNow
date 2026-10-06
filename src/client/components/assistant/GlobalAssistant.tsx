import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FloatingMascot } from './FloatingMascot';
import { AssistantChatPanel } from './AssistantChatPanel';
import { useAssistant, type AssistantGuideTarget } from '../../store/AssistantContext';
import { useBridge360 } from '../../store/Bridge360Context';

interface DockPosition {
  right: number;
  bottom: number;
}

interface DragStart extends DockPosition {
  pointerX: number;
  pointerY: number;
  pointerId: number;
  moved: boolean;
}

interface ObservedElement {
  guide: AssistantGuideTarget;
  href?: string;
  element: Element;
}

const DOCK_POSITION_KEY = 'b360_assistant_dock_position';
const DOCK_WIDTH = 160;
const DOCK_HEIGHT = 300;

const readDockPosition = (): DockPosition => {
  try {
    const saved = localStorage.getItem(DOCK_POSITION_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (
        typeof parsed === 'object' && parsed !== null &&
        'right' in parsed && 'bottom' in parsed &&
        typeof parsed.right === 'number' && Number.isFinite(parsed.right) &&
        typeof parsed.bottom === 'number' && Number.isFinite(parsed.bottom)
      ) {
        return { right: parsed.right, bottom: parsed.bottom };
      }
    }
  } catch (error) {
    console.warn('Unable to read the saved assistant dock position.', error);
  }
  return { right: 30, bottom: 18 };
};

export const GlobalAssistant: React.FC = () => {
  const { setAdminView, partnerAgencies, referrals } = useBridge360();
  const {
    setPortal, portal, screenContext, setScreenContext, setProactiveMessage, proactiveMessage,
    isOpen, setIsOpen, playAnimation, pendingApproval,
    proactiveAction, setProactiveAction,
    assistantEnabled, setAssistantEnabled,
    mascotMode,
    guideTarget, setMascotMode, setGuideTarget, dispatchToAssistant, lastActivity, reportActivity,
  } = useAssistant();
  const [dockPosition, setDockPosition] = useState<DockPosition>(readDockPosition);
  const dragStartRef = useRef<DragStart | null>(null);
  const suppressClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const observedElementRef = useRef<ObservedElement | null>(null);
  const guideTargetElementRef = useRef<Element | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guideReturnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const launcherTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityAtRef = useRef(Date.now());
  const lastPointerSampleRef = useRef(0);

  const clampPosition = useCallback((position: DockPosition): DockPosition => ({
    right: Math.min(Math.max(0, position.right), Math.max(0, window.innerWidth - DOCK_WIDTH)),
    bottom: Math.min(Math.max(0, position.bottom), Math.max(0, window.innerHeight - DOCK_HEIGHT)),
  }), []);

  const saveDockPosition = useCallback((position: DockPosition) => {
    try {
      localStorage.setItem(DOCK_POSITION_KEY, JSON.stringify(position));
    } catch (error) {
      console.warn('Unable to save the assistant dock position.', error);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDockPosition(current => {
        const clamped = clampPosition(current);
        saveDockPosition(clamped);
        return clamped;
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampPosition, saveDockPosition]);

  useEffect(() => {
    if (lastActivity) lastActivityAtRef.current = lastActivity.at;
  }, [lastActivity]);

  const handleLauncherPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      ...dockPosition,
      pointerX: event.clientX,
      pointerY: event.clientY,
      pointerId: event.pointerId,
      moved: false,
    };
  };

  const handleLauncherPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const start = dragStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - start.pointerX;
    const deltaY = event.clientY - start.pointerY;
    if (!start.moved && Math.hypot(deltaX, deltaY) < 6) return;
    if (!start.moved) setIsDragging(true);
    start.moved = true;
    setDockPosition(clampPosition({
      right: start.right - deltaX,
      bottom: start.bottom - deltaY,
    }));
  };

  const handleLauncherPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const start = dragStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    if (start.moved) {
      suppressClickRef.current = event.type === 'pointerup';
      if (suppressClickRef.current) {
        window.setTimeout(() => { suppressClickRef.current = false; }, 0);
      }
      const finalPosition = clampPosition({
        right: start.right - (event.clientX - start.pointerX),
        bottom: start.bottom - (event.clientY - start.pointerY),
      });
      setDockPosition(finalPosition);
      saveDockPosition(finalPosition);
      setIsDragging(false);
    }
    dragStartRef.current = null;
  };

  const handleLauncherClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (launcherTapTimerRef.current !== null) {
      clearTimeout(launcherTapTimerRef.current);
      launcherTapTimerRef.current = null;
      setAssistantEnabled(!assistantEnabled);
      reportActivity('action', assistantEnabled ? 'Hid the assistant hologram' : 'Showed the assistant hologram');
      return;
    }
    launcherTapTimerRef.current = window.setTimeout(() => {
      launcherTapTimerRef.current = null;
      setIsOpen(!isOpen);
      reportActivity('action', isOpen ? 'Closed the assistant panel' : 'Opened the assistant panel');
    }, 300);
  };

  useEffect(() => () => {
    if (launcherTapTimerRef.current !== null) clearTimeout(launcherTapTimerRef.current);
  }, []);

  // Route → portal (admin vs customer).
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setPortal(hash.includes('/admin') ? 'admin' : 'customer');
      const parts = hash.replace(/^#\/?/, '').split('/');
      setScreenContext(parts.slice(1).join('_') || 'home');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setPortal]);

  const labelElement = useCallback((element: Element): string => {
    const aria = element.getAttribute('aria-label') || element.getAttribute('title');
    if (aria) return aria.trim().slice(0, 80);
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      if (element.labels?.[0]?.textContent?.trim()) return element.labels[0].textContent.trim().slice(0, 80);
      return (element.getAttribute('placeholder') || 'this field').trim().slice(0, 80);
    }
    return (element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  }, []);

  const inspectElement = useCallback((node: EventTarget | null): ObservedElement | null => {
    if (!(node instanceof Element) || node.closest('.b360-assistant-motion, .b360-assistant-doubtbox, [data-b360-assistant]')) return null;
    const element = node.closest('button, a, input, select, textarea, label, [role="button"], [tabindex]');
    if (!element) return null;
    const label = labelElement(element);
    if (!label) return null;
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    const href = element instanceof HTMLAnchorElement ? element.href : undefined;
    return {
      guide: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, label },
      href,
      element,
    };
  }, [labelElement]);

  const updateGuideTargetPosition = useCallback(() => {
    let element = guideTargetElementRef.current;
    if (!element?.isConnected) {
      const candidates = Array.from(document.querySelectorAll(
        'button, a, input, select, textarea, label, [role="button"], [tabindex]',
      ));
      const replacement = candidates
        .map(candidate => inspectElement(candidate))
        .find(candidate => candidate?.guide.label === guideTarget?.label);
      if (!replacement) return;
      element = replacement.element;
      guideTargetElementRef.current = element;
    }
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    if (!guideTarget) return;
    if (
      guideTarget.x === rect.x && guideTarget.y === rect.y &&
      guideTarget.width === rect.width && guideTarget.height === rect.height
    ) return;
    setGuideTarget({
      ...guideTarget,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    });
  }, [guideTarget, inspectElement, setGuideTarget]);

  const startGuidance = useCallback((target: ObservedElement | null, prompt: string) => {
    setProactiveMessage(null);
    setProactiveAction(null);
    setIsOpen(true);
    if (target) {
      if (guideReturnTimerRef.current) clearTimeout(guideReturnTimerRef.current);
      guideTargetElementRef.current = target.element;
      setGuideTarget(target.guide);
      setMascotMode('moving');
      playAnimation('point');
      guideReturnTimerRef.current = setTimeout(() => {
        guideTargetElementRef.current = null;
        setGuideTarget(null);
      }, 4500);
    }
    dispatchToAssistant(prompt);
  }, [dispatchToAssistant, playAnimation, setGuideTarget, setIsOpen, setMascotMode, setProactiveAction, setProactiveMessage]);

  useEffect(() => {
    if (!guideTarget || mascotMode !== 'moving') return undefined;
    const update = () => updateGuideTargetPosition();
    let frame = 0;
    const observer = new MutationObserver(() => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [guideTarget, mascotMode, updateGuideTargetPosition]);

  useEffect(() => {
    const noteActivity = (kind: 'input' | 'action', detail: string) => {
      lastActivityAtRef.current = Date.now();
      reportActivity(kind, detail);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (Date.now() - lastPointerSampleRef.current < 1200) return;
      lastPointerSampleRef.current = Date.now();
      const observed = inspectElement(event.target);
      if (observed) observedElementRef.current = observed;
      if (!(event.target instanceof Element && event.target.closest('.b360-assistant-motion, .b360-assistant-doubtbox, [data-b360-assistant]'))) {
        lastActivityAtRef.current = Date.now();
        reportActivity('input', observed ? `Cursor near ${observed.guide.label}` : 'Cursor movement');
      }
    };
    const handlePointerOver = (event: PointerEvent) => {
      const observed = inspectElement(event.target);
      if (
        !observed ||
        (observedElementRef.current?.element === observed.element && hoverTimerRef.current !== null)
      ) return;
      observedElementRef.current = observed;
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = setTimeout(() => {
        lastActivityAtRef.current = Date.now();
        reportActivity('input', `Focused on ${observed.guide.label}`);
        if (portal === 'customer' && !isOpen && !proactiveAction) {
          setProactiveMessage(`Would a quick explanation of “${observed.guide.label}” help?`);
          setProactiveAction([
            {
              label: 'Guide me',
              primary: true,
              onClick: () => startGuidance(observed, `Explain “${observed.guide.label}” in simple steps and help me complete it.`),
            },
            { label: 'Not now', onClick: () => {
              lastActivityAtRef.current = Date.now();
              setProactiveMessage(null);
              setProactiveAction(null);
            } },
          ]);
          playAnimation('point');
        } else if (portal === 'admin' && !isOpen && !proactiveAction && !proactiveMessage) {
          const label = observed.guide.label;
          setProactiveMessage(/referral|partner agency/i.test(label)
            ? 'I can review the listed partner capacity for this referral queue. I will not contact or book a partner.'
            : `Would a quick read-only review of “${label}” help?`);
          setProactiveAction([
            {
              label: /referral|partner agency/i.test(label) ? 'Open referrals' : 'Review this',
              primary: true,
              onClick: () => {
                if (/referral|partner agency/i.test(label)) {
                  setProactiveMessage(null);
                  setProactiveAction(null);
                  setAdminView('referrals');
                } else {
                  startGuidance(observed, `Give a concise, read-only explanation of “${label}” and identify a safe next step. Do not change records.`);
                }
              },
            },
            { label: 'No thanks', onClick: () => {
              lastActivityAtRef.current = Date.now();
              setProactiveMessage(null);
              setProactiveAction(null);
            } },
          ]);
          playAnimation('point');
        }
      }, 1400);
    };
    const handleAction = (event: Event) => {
      if (
        event.target instanceof Element &&
        event.target.closest('.b360-assistant-doubtbox, .b360-assistant-motion, [data-b360-assistant]')
      ) return;
      const observed = inspectElement(event.target);
      if (observed) observedElementRef.current = observed;
      noteActivity('action', observed ? `Used ${observed.guide.label}` : 'Interacted with the page');
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      const guidedElement = guideTargetElementRef.current;
      if (guidedElement?.isConnected && observed && observed.element !== guidedElement) {
        guideTargetElementRef.current = observed.element;
        setGuideTarget(observed.guide);
        setMascotMode('moving');
        playAnimation('point');
        if (guideReturnTimerRef.current) clearTimeout(guideReturnTimerRef.current);
        guideReturnTimerRef.current = setTimeout(() => {
          guideTargetElementRef.current = null;
          setGuideTarget(null);
        }, 4500);
        reportActivity('input', `Guidance redirected to ${observed.guide.label}`);
      }
    };
    const handleFocus = (event: FocusEvent) => {
      const observed = inspectElement(event.target);
      if (observed) {
        observedElementRef.current = observed;
        noteActivity('input', `Focused ${observed.guide.label}`);
      }
    };
    const clearHover = (event?: Event) => {
      if (event instanceof PointerEvent) {
        const from = inspectElement(event.target);
        const to = inspectElement(event.relatedTarget);
        if (from && to && from.guide.label === to.guide.label) return;
      }
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('pointerdown', handleAction, true);
    document.addEventListener('change', handleAction, true);
    document.addEventListener('input', handleAction);
    document.addEventListener('focusin', handleFocus, true);
    document.addEventListener('pointerout', clearHover, true);
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerdown', handleAction, true);
      document.removeEventListener('change', handleAction, true);
      document.removeEventListener('input', handleAction);
      document.removeEventListener('focusin', handleFocus, true);
      document.removeEventListener('pointerout', clearHover, true);
      clearHover();
    };
  }, [inspectElement, isOpen, playAnimation, portal, proactiveAction, proactiveMessage, reportActivity, setAdminView, setGuideTarget, setMascotMode, setProactiveAction, setProactiveMessage, startGuidance]);

  // Offer a contextual task after a quiet period; the assistant does not send
  // observed page content to an AI service until the user chooses an action.
  useEffect(() => {
    if (isOpen || proactiveAction || proactiveMessage) return undefined;
    const idleFor = Date.now() - lastActivityAtRef.current;
    const wait = Math.max(0, 18_000 - idleFor);
    const timer = setTimeout(() => {
      const focused = document.activeElement;
      if (focused instanceof HTMLInputElement || focused instanceof HTMLTextAreaElement || focused instanceof HTMLSelectElement) return;
      const target = observedElementRef.current;
      if (portal === 'admin') {
        if (/referral|partner_agenc/i.test(`${screenContext} ${target?.guide.label || ''}`)) {
          const listedSlots = partnerAgencies
            .filter(agency => agency.status === 'Active' && agency.availableCapacity > 0)
            .reduce((total, agency) => total + agency.availableCapacity, 0);
          const openReferralCount = referrals.filter(referral =>
            referral.status === 'Pending' || referral.status === 'In Progress',
          ).length;
          setProactiveMessage(
            `${openReferralCount} open referral(s); ${listedSlots} slots are listed in Bridge360 data. These are not live partner confirmations.`,
          );
          setProactiveAction([
            {
              label: 'Open referrals',
              primary: true,
              onClick: () => {
                setProactiveMessage(null);
                setProactiveAction(null);
                setAdminView('referrals');
              },
            },
            { label: 'No thanks', onClick: () => {
              lastActivityAtRef.current = Date.now();
              setProactiveMessage(null);
              setProactiveAction(null);
            } },
          ]);
          playAnimation('point');
          return;
        }
        const hasCaseTarget = Boolean(target && /case|family|application|verification/i.test(`${screenContext} ${target.guide.label}`));
        const label = target?.guide.label || 'this page';
        setProactiveMessage(hasCaseTarget
          ? `Would you like me to summarize ${label} and suggest next steps?`
          : `I’m ready to help with ${screenContext.replace(/[_-]/g, ' ')}. Want a quick summary or a guided walkthrough?`);
        setProactiveAction([
          {
            label: hasCaseTarget ? 'Summarize it' : 'Quick summary',
            primary: true,
            onClick: () => startGuidance(target, `Summarize the current ${screenContext.replace(/[_-]/g, ' ')} using authorized Bridge360 data. Provide key facts, outstanding work, and suggested next steps. Do not make changes.`),
          },
          {
            label: 'Show me how',
            onClick: () => startGuidance(target, `Show me a concise, step-by-step walkthrough of the current ${screenContext.replace(/[_-]/g, ' ')} page.`),
          },
          { label: 'No thanks', onClick: () => { setProactiveMessage(null); setProactiveAction(null); } },
        ]);
      } else {
        const label = target?.guide.label;
        const casePage = /case|family|application|verification/i.test(`${screenContext} ${label || ''}`);
        setProactiveMessage(casePage
          ? 'Would you like a simple summary of your case progress?'
          : label
          ? `Would you like help with “${label}”? I can explain it one small step at a time.`
          : 'Would you like me to explain what you can do on this page, one small step at a time?');
        setProactiveAction([
          {
            label: casePage ? 'Yes, summarize it' : 'Guide me',
            primary: true,
            onClick: () => startGuidance(target, casePage
              ? `Summarize my current case progress in simple language and explain one safe next step. Do not change any case data.`
              : label
              ? `Explain “${label}” in simple language and guide me through the next safe step.`
              : `Explain the ${screenContext.replace(/[_-]/g, ' ')} page in simple language and guide me through one safe next step.`),
          },
          ...(target?.href ? [{
            label: `Open ${label || 'page'}`,
            onClick: () => {
              const destination = new URL(target.href!, window.location.href);
              if (destination.origin === window.location.origin) window.location.assign(destination.href);
            },
          }] : []),
          { label: 'Not now', onClick: () => {
            lastActivityAtRef.current = Date.now();
            setProactiveMessage(null);
            setProactiveAction(null);
          } },
        ]);
      }
      playAnimation('wave');
    }, wait);
    return () => clearTimeout(timer);
  }, [isOpen, lastActivity, portal, proactiveAction, proactiveMessage, screenContext, partnerAgencies, referrals, setAdminView, setProactiveAction, setProactiveMessage, playAnimation, startGuidance]);

  const isCustomer = portal === 'customer';
  const fabColor = isCustomer ? '#8B5CF6' : '#38BDF8';
  const dockScale = mascotMode === 'docked' ? 0.82 : 1.06;
  const layoutWidth = document.documentElement.clientWidth;
  const layoutHeight = document.documentElement.clientHeight;
  const chatWidth = Math.min(320, layoutWidth - 24);
  const launcherCenter = layoutWidth - dockPosition.right - DOCK_WIDTH / 2;
  const chatRight = Math.min(
    Math.max(12, layoutWidth - launcherCenter - chatWidth / 2),
    Math.max(12, layoutWidth - chatWidth - 12),
  );
  const chatBottom = Math.min(dockPosition.bottom + 96, Math.max(12, layoutHeight - 120));
  const chatMaxHeight = Math.max(180, Math.min(390, layoutHeight - chatBottom - 12));
  const controlRight = isOpen
    ? chatRight + chatWidth / 2 - DOCK_WIDTH / 2
    : dockPosition.right;

  return (
    <>
      <FloatingMascot
        position={dockPosition}
        chatPanelPlacement={{
          right: chatRight,
          width: chatWidth,
          bottom: chatBottom,
          maxHeight: chatMaxHeight,
          viewportWidth: layoutWidth,
          viewportHeight: layoutHeight,
        }}
      />
      <AssistantChatPanel position={dockPosition} />

      {/* Chat control sits below the projector and is visually linked to its emitter. */}
      <div style={{
        position: 'fixed', bottom: `${dockPosition.bottom}px`, right: `${controlRight}px`,
        width: `${DOCK_WIDTH}px`, height: '84px',
        zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
        touchAction: 'none',
        transform: `scale(${dockScale})`,
        transformOrigin: 'top center',
        transition: 'transform .5s cubic-bezier(.2,.8,.2,1)',
      }} data-b360-assistant>
        {assistantEnabled && <span aria-hidden="true" className="b360-emitter-link" />}
        <button
          onClick={handleLauncherClick}
          onPointerDown={handleLauncherPointerDown}
          onPointerMove={handleLauncherPointerMove}
          onPointerUp={handleLauncherPointerUp}
          onPointerCancel={handleLauncherPointerUp}
          aria-label={`Open assistant; double-tap to ${assistantEnabled ? 'hide' : 'show'} hologram`}
          title="Hold and drag to move; double-tap to toggle hologram"
          style={{
            width: '60px', height: '60px', borderRadius: '16px',
            background: 'transparent', color: 'white', border: 'none',
            filter: `drop-shadow(0 0 8px ${fabColor}88)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1), filter .2s',
            transform: isOpen ? 'scale(.72)' : 'scale(1)',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          <svg width="60" height="60" viewBox="0 0 64 64" aria-hidden="true">
            <path
              d="M20 3.5h24q3 0 4.5 2.7l13 22.5q1.5 3.3 0 6.6l-13 22.5Q47 60.5 44 60.5H20q-3 0-4.5-2.7l-13-22.5q-1.5-3.3 0-6.6l13-22.5Q17 3.5 20 3.5Z"
              fill={isCustomer ? '#251044' : '#0B1C2F'}
              stroke={fabColor}
              strokeWidth="2"
            />
            <path
              d="M20.5 8h23q1.2 0 1.9 1.2l10.9 19q.8 1.8 0 3.6l-10.9 19q-.7 1.2-1.9 1.2h-23q-1.2 0-1.9-1.2l-10.9-19q-.8-1.8 0-3.6l10.9-19q.7-1.2 1.9-1.2Z"
              fill="none"
              stroke={isCustomer ? '#E9D5FF' : '#E0F2FE'}
              strokeOpacity=".65"
              strokeWidth=".8"
            />
            <path d="M32 15v4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="13" r="2.5" fill={fabColor} stroke="#FFFFFF" strokeWidth="1" />
            <path
              d="M22 25q0-4 4-4h12q4 0 4 4v13q0 4-4 4H26q-4 0-4-4V25Z"
              fill={isCustomer ? '#4C2580' : '#123B5A'}
              stroke="#FFFFFF"
              strokeWidth="1.7"
            />
            <path d="M22 28q0-7 10-7t10 7" fill="none" stroke={fabColor} strokeWidth="2" strokeLinecap="round" />
            <rect x="18.5" y="28" width="4" height="9" rx="2" fill={fabColor} stroke="#FFFFFF" strokeWidth="1" />
            <rect x="41.5" y="28" width="4" height="9" rx="2" fill={fabColor} stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="28" cy="31.5" r="1.8" fill="#FFFFFF" />
            <circle cx="36" cy="31.5" r="1.8" fill="#FFFFFF" />
            <path d="M28 37h8" stroke={isCustomer ? '#F5D0FE' : '#BAE6FD'} strokeWidth="1.7" strokeLinecap="round" />
          </svg>
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

      </div>

      <style>{`
        @keyframes b360-ping {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          70%  { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        .b360-emitter-link {
          position: absolute;
          width: 3px;
          height: 14px;
          top: -12px;
          left: 50%;
          border-radius: 4px;
          background: linear-gradient(to bottom, ${fabColor}00, ${fabColor}aa, #fff);
          box-shadow: 0 0 8px ${fabColor}99;
          transform-origin: center bottom;
          animation: b360-emitter-link 1.6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes b360-emitter-link {
          0%, 100% { opacity: .35; transform: translateX(-50%) scaleY(.82); }
          50% { opacity: .9; transform: translateX(-50%) scaleY(1); }
        }
      `}</style>
    </>
  );
};
