// AgentOrchestrator.ts
// Deterministic, rule-based multi-agent pipeline used for INSTANT UI feedback
// in the admin workspace. It runs four "agents" (triage, document analysis,
// risk assessment, decision drafting) with no network/LLM dependency, then
// best-effort writes the outcome back to ServiceNow.

import { FamilyRecord, DocumentRecord } from '../types/bridge360';
import { snUpdateTableRecord } from './snApi';

export interface AgentResult {
  triage: {
    assignedOfficer: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    notes: string;
  };
  docAnalysis: {
    verifiedCount: number;
    discrepancies: string[];
    status: 'Verified' | 'Needs Review' | 'Flagged';
  };
  riskAssessment: {
    score: 'Low' | 'Medium' | 'High' | 'Critical';
    factors: string[];
  };
  // Draft recommendation + justification produced from the document analysis.
  decisionDraft: {
    recommendation: 'Approved' | 'Requires Clarification' | 'Rejected';
    justification: string;
  };
}

/** Age in whole years from an ISO/date string; 0 when unparseable. */
function ageFromDob(dob?: string): number {
  if (!dob) return 0;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export class AgentOrchestrator {
  /**
   * Run the full pipeline for one family, then write the results back to the
   * ServiceNow family record (best-effort; a failed write only warns).
   */
  public static evaluate(
    family: FamilyRecord,
    documents: DocumentRecord[] = [],
    membersCount: number = 1,
  ): AgentResult {
    const triage = AgentOrchestrator.runTriageAgent(family);
    const docAnalysis = AgentOrchestrator.runDocAnalystAgent(family, documents);
    const riskAssessment = AgentOrchestrator.runRiskAssessmentAgent(family, membersCount);
    const decisionDraft = AgentOrchestrator.runDecisionDraftAgent(docAnalysis);
    return { triage, docAnalysis, riskAssessment, decisionDraft };
  }

  static async runWorkflow(
    family: FamilyRecord,
    documents: DocumentRecord[],
    membersCount: number,
  ): Promise<AgentResult> {
    const triage = AgentOrchestrator.runTriageAgent(family);
    const docAnalysis = AgentOrchestrator.runDocAnalystAgent(family, documents);
    const riskAssessment = AgentOrchestrator.runRiskAssessmentAgent(family, membersCount);
    const decisionDraft = AgentOrchestrator.runDecisionDraftAgent(docAnalysis);

    try {
      await snUpdateTableRecord('u_bridge360_family', (family as any).sys_id || family.id, {
        u_priority: triage.priority,
        u_assigned_officer: triage.assignedOfficer,
        u_verification_status: docAnalysis.status,
        u_registration_status: decisionDraft.recommendation,
      });
    } catch (e) {
      console.warn('AgentOrchestrator: failed to write results back to ServiceNow:', e);
    }

    return { triage, docAnalysis, riskAssessment, decisionDraft };
  }

  /** Route the case to an officer by country of origin; interpreter escalates. */
  private static runTriageAgent(family: FamilyRecord): AgentResult['triage'] {
    const country = (family.countryOfOrigin || '').toLowerCase();
    let assignedOfficer = 'Sarah Jenkins';
    let priority: AgentResult['triage']['priority'] = 'Medium';
    let notes: string;

    if (country.includes('syria') || country.includes('iraq')) {
      assignedOfficer = 'Sarah Jenkins';
      priority = 'High';
      notes = `High-conflict region (${family.countryOfOrigin}) — routed to regional specialist ${assignedOfficer}.`;
    } else if (country.includes('venezuela') || country.includes('colombia')) {
      assignedOfficer = 'Carlos Ruiz';
      priority = 'Medium';
      notes = `Latin America caseload — routed to ${assignedOfficer}.`;
    } else if (country.includes('ukraine')) {
      assignedOfficer = 'Yelena Kozlov';
      priority = 'High';
      notes = `Eastern Europe caseload — routed to ${assignedOfficer}.`;
    } else {
      assignedOfficer = 'Sarah Jenkins';
      priority = 'Medium';
      notes = `General intake — routed to duty officer ${assignedOfficer}.`;
    }

    if (family.needsInterpreter && priority !== 'High') {
      priority = 'High';
      notes += ' Interpreter required — escalated to High priority.';
    }

    return { assignedOfficer, priority, notes };
  }

  /**
   * Compare each document's extracted/OCR text against the family surname.
   * A document whose text does not contain the surname is flagged; the flag
   * string embeds the documentType so consumers can match it to the record.
   */
  private static runDocAnalystAgent(
    family: FamilyRecord,
    documents: DocumentRecord[],
  ): AgentResult['docAnalysis'] {
    const surname = (family.headOfFamily?.lastName || family.familyName || '').trim().toLowerCase();
    const discrepancies: string[] = [];
    let verifiedCount = 0;

    for (const doc of documents) {
      const haystack = [
        doc.ocrRawText || '',
        ...(doc.extractedFields || []).map(f => f.value || ''),
      ]
        .join(' ')
        .toLowerCase();

      if (surname && haystack.includes(surname)) {
        verifiedCount++;
      } else {
        discrepancies.push(
          `${doc.documentType}: family name "${family.headOfFamily?.lastName || family.familyName}" not found in extracted text.`,
        );
      }
    }

    const status: AgentResult['docAnalysis']['status'] =
      discrepancies.length === 0 ? 'Verified' : 'Flagged';

    return { verifiedCount, discrepancies, status };
  }

  /** Score risk from household size, elderly members, and interpreter need. */
  private static runRiskAssessmentAgent(
    family: FamilyRecord,
    membersCount: number,
  ): AgentResult['riskAssessment'] {
    const factors: string[] = [];
    let score: AgentResult['riskAssessment']['score'] = 'Low';

    if (membersCount > 5) {
      score = 'Medium';
      factors.push(`Large household (${membersCount} members) increases coordination complexity.`);
    }

    const people = [family.headOfFamily, ...(family.members || [])].filter(Boolean);
    if (people.some(p => ageFromDob(p?.dateOfBirth) > 65)) {
      score = 'High';
      factors.push('Elderly member (65+) present — prioritize medical and mobility support.');
    }

    if (family.needsInterpreter) {
      factors.push('Language barrier — interpreter required for all interactions.');
    }

    return { score, factors };
  }

  /** Draft an approval recommendation from the document analysis outcome. */
  private static runDecisionDraftAgent(
    docAnalysis: AgentResult['docAnalysis'],
  ): AgentResult['decisionDraft'] {
    if (docAnalysis.status !== 'Verified' || docAnalysis.discrepancies.length > 0) {
      return {
        recommendation: 'Requires Clarification',
        justification: `Document analysis flagged ${docAnalysis.discrepancies.length} discrepancy(ies). Recommend requesting clarification from the applicant before a final decision.`,
      };
    }
    return {
      recommendation: 'Approved',
      justification: `All ${docAnalysis.verifiedCount} document(s) verified against family records with no discrepancies. Case meets the approval criteria.`,
    };
  }
}
