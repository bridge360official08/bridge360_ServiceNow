import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';

export type AssistantPortal = 'customer' | 'admin';

/** A supervised agent action awaiting officer approval (human-in-the-loop). */
export interface PendingApproval {
  conversationId: string;
  actionLabel: string;   // e.g. "Approve application APP-2026-000123"
  summary?: string;      // the agent's rationale / what will change
  raw?: any;             // extra payload carried back from the agent
}

/** Which ServiceNow record the admin Intern should reason over. */
export interface AgentTarget {
  table: string;       // e.g. 'u_bridge360_family'
  recordId: string;    // ServiceNow sys_id
  label?: string;      // human label, e.g. 'Al-Rashid family (APP-2026-000123)'
  language?: string;   // family's preferred language for drafts / messages
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  /** When set, this assistant turn is asking the officer to approve an action. */
  pendingApproval?: PendingApproval | null;
  /** Marks a transient error bubble (styled differently, not persisted as history). */
  isError?: boolean;
  /** Which brain produced this turn — drives a subtle provenance badge. */
  source?: 'servicenow' | 'gemini' | 'canned';
}

/**
 * Named animation/expression cues the rigged mascot can play. Sustained states
 * (idle/talk/think/alert) stay until changed; gestures (wave/nod/point/celebrate)
 * play once. `mascotAnimationKey` lets consumers re-fire the same gesture.
 */
export type MascotAnimation =
  | 'idle'
  | 'talk'
  | 'think'
  | 'alert'
  | 'wave'
  | 'nod'
  | 'point'
  | 'celebrate';

export interface AssistantActivity {
  kind: 'input' | 'action' | 'navigation' | 'error';
  detail: string;
  at: number;
}

export type AgentRunStatus = 'idle' | 'running' | 'completed' | 'error';
export type RunStageStatus = 'pending' | 'active' | 'done' | 'error';
export type RunProvenance = 'servicenow' | 'gemini' | 'rule_based' | 'local_fallback' | 'local' | 'simulated';

export interface RunStage {
  id: string;
  label: string;
  status: RunStageStatus;
  detail?: string;
}

export interface RunMemberRow {
  name: string;
  role?: string;
  status: string;
  confidence?: number;
  advisory?: string;
}

export interface RunResult {
  title?: string;
  summary?: string;
  recommendation?: string;
  confidence?: number;
  members?: RunMemberRow[];
  details?: any[];
  flags?: string[];
  decision?: { recommendation: string; justification: string };
  provenance?: RunProvenance;
  featureCards?: any;
  raw?: any;
}

type ActionHandler = (actionType: string, payload?: any) => void;

interface AssistantContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  portal: AssistantPortal;
  setPortal: (portal: AssistantPortal) => void;
  screenContext: string;
  setScreenContext: (context: string) => void;


  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  updateMessage: (id: string, patch: Partial<ChatMessage>) => void;
  clearMessages: () => void;

  /**
   * Dispatch an action to every registered handler (multi-registrant) plus the
   * legacy single handler. Views register with `registerActionHandler`.
   */
  triggerAction: (actionType: string, payload?: any) => void;
  registerActionHandler: (handler: ActionHandler) => () => void;
  /** Legacy single-registrant API — kept for backward compatibility. */
  onActionTriggered: ActionHandler | null;
  setOnActionTriggered: (cb: ActionHandler | null) => void;

  /** Proactive floating-mascot line. */
  proactiveMessage: string | null;
  setProactiveMessage: (msg: string | null) => void;
  proactiveAction: { label: string; onClick: () => void; primary?: boolean }[] | null;
  setProactiveAction: (action: { label: string; onClick: () => void; primary?: boolean }[] | null) => void;

  /** Assistant "is working" indicator (drives typing dots + think animation). */
  isThinking: boolean;
  setIsThinking: (v: boolean) => void;

  /** Current mascot animation cue + a key that changes on every trigger. */
  mascotAnimation: MascotAnimation;
  mascotAnimationKey: number;
  playAnimation: (a: MascotAnimation) => void;

  /** Human-in-the-loop: a supervised agent action awaiting approval. */
  pendingApproval: PendingApproval | null;
  setPendingApproval: (p: PendingApproval | null) => void;

  /** Multi-turn conversation id for the ServiceNow agent (reset per portal). */
  conversationId: string | null;
  setConversationId: (id: string | null) => void;

  /** Lightweight activity feed so the assistant can react proactively. */
  lastActivity: AssistantActivity | null;
  reportActivity: (kind: AssistantActivity['kind'], detail: string) => void;

  /** Case context for the admin Intern — which SN record to reason over. */
  agentTarget: AgentTarget | null;
  setAgentTarget: (t: AgentTarget | null) => void;

  /**
   * Programmatic prompt injection: a view calls `dispatchToAssistant(text)` to
   * open the chat and auto-send a pre-filled objective to the agent (with the
   * current agentTarget as case context). The chat panel watches `pendingPrompt`
   * and clears it once handled (`key` lets the same text be dispatched again).
   */
  pendingPrompt: { text: string; key: number } | null;
  dispatchToAssistant: (text: string) => void;
  clearPendingPrompt: () => void;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export const AssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [portal, setPortalState] = useState<AssistantPortal>('customer');
  const [screenContext, setScreenContext] = useState<string>('home');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [proactiveMessage, setProactiveMessage] = useState<string | null>(null);
  const [proactiveAction, setProactiveAction] = useState<{ label: string; onClick: () => void; primary?: boolean }[] | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [mascotAnimation, setMascotAnimation] = useState<MascotAnimation>('idle');
  const [mascotAnimationKey, setMascotAnimationKey] = useState(0);
  const [pendingApproval, setPendingApproval] = useState<PendingApproval | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState<AssistantActivity | null>(null);
  const [agentTarget, setAgentTarget] = useState<AgentTarget | null>(null);
  const [pendingPrompt, setPendingPrompt] = useState<{ text: string; key: number } | null>(null);
  const promptKeyRef = useRef(0);

  // Multi-registrant action handlers live in a ref (no re-render on register).
  const handlersRef = useRef<Set<ActionHandler>>(new Set());
  // Legacy single handler mirrored to a ref so triggerAction stays stable.
  const legacyHandlerRef = useRef<ActionHandler | null>(null);
  const [onActionTriggered, setOnActionTriggeredState] = useState<ActionHandler | null>(null);

  const setPortal = useCallback((p: AssistantPortal) => setPortalState(p), []);

  // Different portal → different agent → start a fresh conversation.
  useEffect(() => {
    setConversationId(null);
  }, [portal]);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const updateMessage = useCallback((id: string, patch: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, ...patch } : m)));
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  const registerActionHandler = useCallback((handler: ActionHandler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  const setOnActionTriggered = useCallback((cb: ActionHandler | null) => {
    legacyHandlerRef.current = cb;
    setOnActionTriggeredState(() => cb);
  }, []);

  const triggerAction = useCallback((actionType: string, payload?: any) => {
    handlersRef.current.forEach(h => {
      try {
        h(actionType, payload);
      } catch (e) {
        console.error('Assistant action handler error:', e);
      }
    });
    if (legacyHandlerRef.current) {
      try {
        legacyHandlerRef.current(actionType, payload);
      } catch (e) {
        console.error('Assistant legacy action handler error:', e);
      }
    }
  }, []);

  const playAnimation = useCallback((a: MascotAnimation) => {
    setMascotAnimation(a);
    setMascotAnimationKey(k => k + 1);
  }, []);

  const reportActivity = useCallback((kind: AssistantActivity['kind'], detail: string) => {
    setLastActivity({ kind, detail, at: Date.now() });
  }, []);

  const dispatchToAssistant = useCallback((text: string) => {
    promptKeyRef.current += 1;
    setPendingPrompt({ text, key: promptKeyRef.current });
    setIsOpen(true);
  }, []);

  const clearPendingPrompt = useCallback(() => setPendingPrompt(null), []);

  return (
    <AssistantContext.Provider
      value={{
        isOpen,
        setIsOpen,
        portal,
        setPortal,
        screenContext,
        setScreenContext,
        messages,
        addMessage,
        updateMessage,
        clearMessages,
        triggerAction,
        registerActionHandler,
        onActionTriggered,
        setOnActionTriggered,
        proactiveMessage,
        setProactiveMessage,
        proactiveAction,
        setProactiveAction,
        isThinking,
        setIsThinking,
        mascotAnimation,
        mascotAnimationKey,
        playAnimation,
        pendingApproval,
        setPendingApproval,
        conversationId,
        setConversationId,
        lastActivity,
        reportActivity,
        agentTarget,
        setAgentTarget,
        pendingPrompt,
        dispatchToAssistant,
        clearPendingPrompt,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
};
