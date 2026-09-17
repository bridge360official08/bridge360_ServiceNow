import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileText,
  Send,
  MessageSquare,
  Copy,
  Mail,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Info,
  Check,
  ArrowRight,
  ShieldAlert,
  Users,
  BrainCircuit,
  ListOrdered,
  FileSearch,
  ExternalLink
} from 'lucide-react';
import { FamilyRecord, DocumentRecord } from '../../types/bridge360';
import {
  runVerificationAgentEvaluation,
  AgentEvaluationResponse,
  AgentReasoningStep
} from '../../services/verificationAgentService';
import { VerificationDataPayload } from '../../services/aiVerificationService';

export interface VerificationAgentPanelProps {
  family: FamilyRecord;
  documents: DocumentRecord[];
  onApplyOfficerNote?: (note: string) => void;
  onRequestDocuments?: (docType: string, notes: string) => void;
  onApproveApplication?: () => void;
}

export const VerificationAgentPanel: React.FC<VerificationAgentPanelProps> = ({
  family,
  documents,
  onApplyOfficerNote,
  onRequestDocuments,
  onApproveApplication,
}) => {
  const [evaluation, setEvaluation] = useState<AgentEvaluationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'agent'; text: string; category?: string }>>([]);
  const [copiedNote, setCopiedNote] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<'reasoning' | 'household' | 'artifacts' | 'all'>('all');

  const executeAgentEvaluation = async (queryText?: string) => {
    setIsLoading(true);
    try {
      const payload: VerificationDataPayload = {
        family: {
          applicationId: family.applicationId,
          familyName: family.familyName,
          countryOfOrigin: family.countryOfOrigin,
          householdSize: family.householdSize,
          priority: family.priority,
          registrationStatus: family.registrationStatus,
          verificationStatus: family.verificationStatus,
        },
        members: [
          family.headOfFamily,
          ...(family.members || [])
        ].filter(Boolean),
        documents: documents.map(d => ({
          documentType: d.documentType,
          fileName: d.fileName,
          fileSize: d.fileSize,
          verificationStatus: d.verificationStatus,
          extractedFields: d.extractedFields,
          ocrRawText: d.ocrRawText
        }))
      };

      const result = await runVerificationAgentEvaluation(family.applicationId, payload, queryText);
      setEvaluation(result);

      if (queryText && result.query_response) {
        setChatHistory(prev => [
          ...prev,
          { sender: 'user', text: queryText },
          { sender: 'agent', text: result.query_response!.response, category: result.query_response!.category }
        ]);
        setUserQuery('');
      }
    } catch (e) {
      console.error('Agent evaluation error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    executeAgentEvaluation();
    setChatHistory([]);
  }, [family.id, family.applicationId]);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    executeAgentEvaluation(userQuery);
  };

  const handleQuickPrompt = (prompt: string) => {
    executeAgentEvaluation(prompt);
  };

  const handleCopyNote = () => {
    if (!evaluation?.draft_artifacts.officer_case_note) return;
    navigator.clipboard.writeText(evaluation.draft_artifacts.officer_case_note);
    if (onApplyOfficerNote) {
      onApplyOfficerNote(evaluation.draft_artifacts.officer_case_note);
    }
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  const handleUseDraftLetter = () => {
    const letter = evaluation?.draft_artifacts.document_request_letter;
    if (letter && onRequestDocuments) {
      onRequestDocuments(letter.suggested_doc_type, letter.body);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. AGENT HEADER BANNER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
          padding: '24px',
          borderRadius: '12px',
          color: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)',
          border: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            }}
          >
            <BrainCircuit size={26} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Bridge360 Family Verification Agent
              </h2>
              <span style={{ background: '#3B82F6', color: '#FFFFFF', fontSize: '0.70rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                Agentic AI
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '4px', margin: 0 }}>
              Autonomous multi-step evidence auditor &amp; interactive officer co-pilot • Feature #3
            </p>
          </div>
        </div>

        <button
          onClick={() => executeAgentEvaluation()}
          disabled={isLoading}
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'Running Agent Audit...' : 'Re-Run Agent Evaluation'}
        </button>
      </div>

      {/* 2. AGENT EXECUTIVE VERDICT & RISK SUMMARY */}
      {evaluation && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Executive Brief Card */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Agent Verdict &amp; Executive Assessment
              </span>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  background:
                    evaluation.overall_verdict === 'READY_FOR_APPROVAL' ? '#DCFCE7' :
                    evaluation.overall_verdict === 'READY_WITH_VARIATION_NOTE' ? '#FEF3C7' :
                    evaluation.overall_verdict === 'ADDITIONAL_DOCUMENTS_REQUESTED' ? '#EFF6FF' : '#FEE2E2',
                  color:
                    evaluation.overall_verdict === 'READY_FOR_APPROVAL' ? '#166534' :
                    evaluation.overall_verdict === 'READY_WITH_VARIATION_NOTE' ? '#92400E' :
                    evaluation.overall_verdict === 'ADDITIONAL_DOCUMENTS_REQUESTED' ? '#1E40AF' : '#991B1B',
                }}
              >
                {evaluation.overall_verdict.replace(/_/g, ' ')}
              </span>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#1E293B', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {evaluation.executive_brief}
            </p>

            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#64748B' }}>
              <ShieldCheck size={14} color="#16A34A" />
              <span>Recommended Officer Action: <strong style={{ color: '#0F172A' }}>{evaluation.recommended_action.replace(/_/g, ' ')}</strong></span>
            </div>
          </div>

          {/* Risk & Confidence Meter Card */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Confidence &amp; Risk Metrics
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
                    {evaluation.confidence_score}%
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Overall Evidence Confidence</div>
                </div>
                <div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      background:
                        evaluation.risk_level === 'LOW' ? '#DCFCE7' :
                        evaluation.risk_level === 'MEDIUM' ? '#FEF3C7' : '#FEE2E2',
                      color:
                        evaluation.risk_level === 'LOW' ? '#166534' :
                        evaluation.risk_level === 'MEDIUM' ? '#92400E' : '#991B1B',
                    }}
                  >
                    {evaluation.risk_level} RISK
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${evaluation.confidence_score}%`,
                    height: '100%',
                    background: evaluation.confidence_score >= 80 ? '#16A34A' : evaluation.confidence_score >= 60 ? '#D97706' : '#DC2626',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2.5 SPECIALIZED MULTI-AGENT EVALUATION SUITE */}
      {evaluation && evaluation.subagents && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#2563EB" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Autonomous Multi-Agent Evaluation Suite
            </h3>
            <span style={{ fontSize: '0.74rem', background: '#EFF6FF', color: '#2563EB', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', marginLeft: 'auto' }}>
              4 Specialized Agents Active
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* SUBAGENT 1: TRIAGE AGENT */}
            <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#DBEAFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                      🏷️
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>Triage Agent</div>
                  </div>
                  <span className={`badge ${evaluation.subagents.triage_agent.assigned_priority_tier === 'High' ? 'badge-high' : 'badge-indigo'}`}>
                    {evaluation.subagents.triage_agent.assigned_priority_tier} Priority
                  </span>
                </div>
                <div style={{ fontSize: '0.80rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>🌍 <strong>Origin Country:</strong> {evaluation.subagents.triage_agent.country_of_origin}</div>
                  <div>👨‍👩‍👧‍👦 <strong>Household Count:</strong> {evaluation.subagents.triage_agent.household_member_count} member(s)</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', background: '#F8FAFC', padding: '8px', borderRadius: '6px', marginTop: '4px', border: '1px solid #F1F5F9' }}>
                    {evaluation.subagents.triage_agent.vulnerability_notes}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.74rem', color: '#1E40AF', fontWeight: 700, borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                Status: Completed • Tier Assigned
              </div>
            </div>

            {/* SUBAGENT 2: DOCUMENT ANALYST AGENT */}
            <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F3E8FF', color: '#6B21A8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                      📄
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>Document Analyst Agent</div>
                  </div>
                  <span className={`badge ${evaluation.subagents.document_analyst_agent.file_structure_status === 'Verified' ? 'badge-high' : 'badge-medium'}`}>
                    {evaluation.subagents.document_analyst_agent.file_structure_status}
                  </span>
                </div>
                <div style={{ fontSize: '0.80rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>🛂 <strong>Passport Verified:</strong> {evaluation.subagents.document_analyst_agent.passport_uploaded ? '✓ Uploaded & Validated' : '❌ Missing'}</div>
                  <div>🆔 <strong>National ID:</strong> {evaluation.subagents.document_analyst_agent.national_id_uploaded ? '✓ Uploaded' : 'ℹ️ Not Provided'}</div>
                  <div>🔍 <strong>Name/Number Auth:</strong> {evaluation.subagents.document_analyst_agent.authenticated_name_matches ? '✓ Authenticated' : '⚠️ Unverified'}</div>
                </div>
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.74rem', color: '#6B21A8', fontWeight: 700, borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                {evaluation.subagents.document_analyst_agent.findings[0]}
              </div>
            </div>

            {/* SUBAGENT 3: RISK ASSESSMENT AGENT */}
            <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: evaluation.subagents.risk_assessment_agent.threat_score > 25 ? '#FEE2E2' : '#DCFCE7', color: evaluation.subagents.risk_assessment_agent.threat_score > 25 ? '#991B1B' : '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                      ⚠️
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>Risk Assessment Agent</div>
                  </div>
                  <span className={`badge ${evaluation.subagents.risk_assessment_agent.threat_score > 25 ? 'badge-low' : 'badge-high'}`}>
                    Threat: {evaluation.subagents.risk_assessment_agent.threat_score}/100
                  </span>
                </div>
                <div style={{ fontSize: '0.80rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>📅 <strong>DOB Anomaly Check:</strong> {evaluation.subagents.risk_assessment_agent.birth_date_mismatch ? '⚠️ DOB Mismatch/Anomaly' : '✓ No DOB Mismatch'}</div>
                  <div>🌳 <strong>Family Tree Integrity:</strong> {evaluation.subagents.risk_assessment_agent.incomplete_family_tree ? '⚠️ Incomplete Family Tree' : '✓ Fully Linked'}</div>
                  <div style={{ fontSize: '0.78rem', color: evaluation.subagents.risk_assessment_agent.threat_score > 0 ? '#B45309' : '#16A34A', background: '#F8FAFC', padding: '6px 8px', borderRadius: '6px', marginTop: '2px', fontWeight: 600 }}>
                    {evaluation.subagents.risk_assessment_agent.potential_flags[0]}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.74rem', color: '#991B1B', fontWeight: 700, borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                Risk Level: {evaluation.subagents.risk_assessment_agent.risk_level}
              </div>
            </div>

            {/* SUBAGENT 4: DECISION DRAFTER AGENT */}
            <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#D1FAE5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                      ⚖️
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>Decision Drafter Agent</div>
                  </div>
                  <span className="badge badge-high">
                    Draft Proposed
                  </span>
                </div>
                <div style={{ fontSize: '0.80rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>📌 <strong>Proposed Action:</strong> <strong style={{ color: '#2563EB' }}>{evaluation.subagents.decision_drafter_agent.proposed_recommendation}</strong></div>
                  <div style={{ fontSize: '0.78rem', color: '#334155', background: '#F8FAFC', padding: '8px', borderRadius: '6px', marginTop: '4px', border: '1px solid #F1F5F9', lineHeight: 1.4 }}>
                    {evaluation.subagents.decision_drafter_agent.comprehensive_justification.slice(0, 140)}...
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.74rem', color: '#065F46', fontWeight: 700, borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                Pre-Drafted Notes &amp; Letters Ready
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MULTI-STEP REASONING TRAIL */}
      {evaluation && (
        <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ListOrdered size={18} color="#2563EB" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Agent Autonomous Reasoning Trail
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#64748B', marginLeft: 'auto' }}>4 of 4 Steps Executed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {evaluation.reasoning_trail.map(step => (
              <div
                key={step.step}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 180px 1fr 100px',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: step.status === 'FLAGGED' ? '#FEF2F2' : step.status === 'WARNING' ? '#FFFBEB' : '#F8FAFC',
                  border: `1px solid ${step.status === 'FLAGGED' ? '#FECACA' : step.status === 'WARNING' ? '#FEF3C7' : '#E2E8F0'}`,
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                  {step.step}
                </div>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{step.title}</div>
                <div style={{ color: '#475569' }}>{step.summary}</div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: step.status === 'SUCCESS' ? '#DCFCE7' : step.status === 'WARNING' ? '#FEF3C7' : '#FEE2E2',
                      color: step.status === 'SUCCESS' ? '#166534' : step.status === 'WARNING' ? '#92400E' : '#991B1B',
                    }}
                  >
                    {step.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HOUSEHOLD & DEPENDENCY AUDIT MATRIX */}
      {evaluation && (
        <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#2563EB" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Household Member Identity &amp; Document Coverage Audit
              </h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
              Household Size: {evaluation.correlation_analysis.actual_members_count} member(s)
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.80rem' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Member Name</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Role / Relationship</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Date of Birth</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Document Attached</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Issued Credential</th>
                </tr>
              </thead>
              <tbody>
                {evaluation.correlation_analysis.member_audit.map((mem, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0F172A' }}>
                      {mem.name} {mem.is_head && <span style={{ fontSize: '0.70rem', background: '#EFF6FF', color: '#2563EB', padding: '1px 6px', borderRadius: '4px', marginLeft: '4px' }}>Head</span>}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>{mem.relationship}</td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>{mem.date_of_birth || 'N/A'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      {mem.has_direct_document ? (
                        <span style={{ color: '#16A34A', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.74rem' }}>
                          <Check size={14} /> Document Verified
                        </span>
                      ) : (
                        <span style={{ color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.74rem' }}>
                          <AlertTriangle size={14} /> Direct File Missing
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: mem.refugee_id ? '#16A34A' : '#94A3B8' }}>
                      {mem.refugee_id || 'Pending Mint'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PRE-DRAFTED ACTIONABLE ARTIFACTS */}
      {evaluation && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Artifact 1: Pre-drafted Officer Review Brief */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Pre-Drafted Officer Case Note
                </span>
                <span style={{ fontSize: '0.70rem', background: '#F1F5F9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  Ready to Apply
                </span>
              </div>
              <pre
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.76rem',
                  color: '#334155',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.45,
                  maxHeight: '140px',
                  overflowY: 'auto',
                }}
              >
                {evaluation.draft_artifacts.officer_case_note}
              </pre>
            </div>

            <button
              onClick={handleCopyNote}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '12px', fontSize: '0.80rem' }}
            >
              {copiedNote ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
              {copiedNote ? 'Copied & Populated to Officer Notes!' : 'Populate into Officer Notes'}
            </button>
          </div>

          {/* Artifact 2: Pre-drafted Document Request Letter */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Pre-Drafted Document Request
                </span>
                <span style={{ fontSize: '0.70rem', background: evaluation.draft_artifacts.document_request_letter ? '#EFF6FF' : '#F1F5F9', color: evaluation.draft_artifacts.document_request_letter ? '#2563EB' : '#94A3B8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  {evaluation.draft_artifacts.document_request_letter ? 'Action Suggested' : 'Not Required'}
                </span>
              </div>

              {evaluation.draft_artifacts.document_request_letter ? (
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px', fontSize: '0.76rem', color: '#334155' }}>
                  <div><strong>To:</strong> {evaluation.draft_artifacts.document_request_letter.recipient_email}</div>
                  <div><strong>Subject:</strong> {evaluation.draft_artifacts.document_request_letter.subject}</div>
                  <div style={{ marginTop: '6px', color: '#64748B', fontStyle: 'italic', maxHeight: '70px', overflowY: 'auto' }}>
                    "{evaluation.draft_artifacts.document_request_letter.body.slice(0, 120)}..."
                  </div>
                </div>
              ) : (
                <div style={{ padding: '24px 12px', textAlign: 'center', color: '#64748B', fontSize: '0.80rem' }}>
                  ✓ All essential documents are present. No additional document request is currently required.
                </div>
              )}
            </div>

            {evaluation.draft_artifacts.document_request_letter && (
              <button
                onClick={handleUseDraftLetter}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '12px', fontSize: '0.80rem' }}
              >
                <Mail size={14} /> Open Pre-Filled Request Modal
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. INTERACTIVE OFFICER Q&A CONSOLE */}
      <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <MessageSquare size={18} color="#2563EB" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Interactive Verification Co-Pilot Query Console
          </h3>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <button
            className="btn-secondary"
            style={{ fontSize: '0.76rem', padding: '5px 10px', borderRadius: '20px' }}
            onClick={() => handleQuickPrompt('Why were transliteration variations noted?')}
          >
            💬 Explain Transliteration Variations
          </button>
          <button
            className="btn-secondary"
            style={{ fontSize: '0.76rem', padding: '5px 10px', borderRadius: '20px' }}
            onClick={() => handleQuickPrompt('Which family members lack identity documents?')}
          >
            📄 Audit Missing Dependents Documents
          </button>
          <button
            className="btn-secondary"
            style={{ fontSize: '0.76rem', padding: '5px 10px', borderRadius: '20px' }}
            onClick={() => handleQuickPrompt('Summarize household relationships')}
          >
            👨‍👩‍👧‍👦 Summarize Household & Relationships
          </button>
          <button
            className="btn-secondary"
            style={{ fontSize: '0.76rem', padding: '5px 10px', borderRadius: '20px' }}
            onClick={() => handleQuickPrompt('What is the recommended next action for this officer?')}
          >
            ⚖️ Recommend Officer Next Step
          </button>
        </div>

        {/* Conversation Stream */}
        {chatHistory.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '240px', overflowY: 'auto', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {msg.sender === 'agent' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={16} />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    background: msg.sender === 'user' ? '#2563EB' : '#FFFFFF',
                    color: msg.sender === 'user' ? '#FFFFFF' : '#1E293B',
                    border: msg.sender === 'agent' ? '1px solid #E2E8F0' : 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSendQuery} style={{ display: 'flex', gap: '10px' }}>
          <input
            className="input-field"
            placeholder="Ask the Verification Agent about this family, document mismatches, or recommendations..."
            value={userQuery}
            onChange={e => setUserQuery(e.target.value)}
            style={{ fontSize: '0.84rem' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 18px', flexShrink: 0 }} disabled={isLoading || !userQuery.trim()}>
            <Send size={15} /> Ask Agent
          </button>
        </form>
      </div>
    </div>
  );
};
