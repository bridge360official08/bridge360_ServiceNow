// AgentOrchestrator.ts
// Deterministic, advisory-only checks with visible per-agent progress for admins.

import { FamilyRecord, DocumentRecord } from '../types/bridge360';

export interface AgentResult {
  triage: {
    assignedOfficer: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    notes: string;
  };
  docAnalysis: {
    initialMatchCount: number;
    discrepancies: string[];
    status: 'Initial match only' | 'Needs Review' | 'Possible mismatch';
  };
  completenessReview: {
    missingItems: string[];
    status: 'Ready for officer review' | 'Needs information';
  };
  riskAssessment: {
    score: 'Low' | 'Medium' | 'High' | 'Critical';
    factors: string[];
  };
  // Draft recommendation + justification produced from the document analysis.
  decisionDraft: {
    recommendation: 'Officer review recommended' | 'Clarification recommended';
    justification: string;
  };
  supportPlan: {
    recommendations: string[];
  };
}

export type AdvisoryStageProgress = (
  stageId: 'triage' | 'docs' | 'completeness' | 'support' | 'risk' | 'decision',
  status: 'active' | 'done',
  detail?: string,
) => void;

export class AgentOrchestrator {
  /** Evaluate a family without changing its records or making a decision. */
  public static evaluate(
    family: FamilyRecord,
    documents: DocumentRecord[] = [],
  ): AgentResult {
    const triage = AgentOrchestrator.runTriageAgent(family);
    const docAnalysis = AgentOrchestrator.runDocAnalystAgent(family, documents);
    const completenessReview = AgentOrchestrator.runCompletenessAgent(family, documents);
    const riskAssessment = AgentOrchestrator.runRiskAssessmentAgent(docAnalysis, completenessReview);
    const decisionDraft = AgentOrchestrator.runDecisionDraftAgent(docAnalysis, completenessReview);
    const supportPlan = AgentOrchestrator.runSupportPlanningAgent(family);
    return { triage, docAnalysis, completenessReview, riskAssessment, decisionDraft, supportPlan };
  }

  static async runWorkflow(
    family: FamilyRecord,
    documents: DocumentRecord[],
    onProgress?: AdvisoryStageProgress,
  ): Promise<AgentResult> {
    const pause = () => new Promise<void>(resolve => setTimeout(resolve, 240));
    onProgress?.('triage', 'active');
    await pause();
    const triage = AgentOrchestrator.runTriageAgent(family);
    onProgress?.('triage', 'done', `${triage.assignedOfficer} · ${triage.priority} priority`);

    onProgress?.('docs', 'active');
    await pause();
    const docAnalysis = AgentOrchestrator.runDocAnalystAgent(family, documents);
    onProgress?.('docs', 'done', `${docAnalysis.initialMatchCount} initial text match(es)`);

    onProgress?.('completeness', 'active');
    await pause();
    const completenessReview = AgentOrchestrator.runCompletenessAgent(family, documents);
    onProgress?.('completeness', 'done', completenessReview.status);

    onProgress?.('support', 'active');
    await pause();
    const supportPlan = AgentOrchestrator.runSupportPlanningAgent(family);
    onProgress?.('support', 'done', `${supportPlan.recommendations.length} recommendation(s)`);

    onProgress?.('risk', 'active');
    await pause();
    const riskAssessment = AgentOrchestrator.runRiskAssessmentAgent(docAnalysis, completenessReview);
    onProgress?.('risk', 'done', `${riskAssessment.score} risk`);

    onProgress?.('decision', 'active');
    await pause();
    const decisionDraft = AgentOrchestrator.runDecisionDraftAgent(docAnalysis, completenessReview);
    onProgress?.('decision', 'done', decisionDraft.recommendation);

    return { triage, docAnalysis, completenessReview, supportPlan, riskAssessment, decisionDraft };
  }

  /** Report the current assignment without automatically routing or reprioritizing. */
  private static runTriageAgent(family: FamilyRecord): AgentResult['triage'] {
    const assignedOfficer = family.assignedOfficer || 'Officer assignment required';
    const priorityByValue: Record<string, AgentResult['triage']['priority']> = {
      low: 'Low',
      normal: 'Medium',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical',
    };
    const priority = priorityByValue[family.priority?.toLowerCase() || ''] || 'Medium';
    const notes = family.assignedOfficer
      ? `Current officer assignment is ${family.assignedOfficer}; this agent does not reassign cases.`
      : 'No officer was assigned by this advisory review. An authorized officer can select the assignee.';
    return { assignedOfficer, priority, notes };
  }

  /** Compare extracted text for an initial name match; this is not identity verification. */
  private static runDocAnalystAgent(
    family: FamilyRecord,
    documents: DocumentRecord[],
  ): AgentResult['docAnalysis'] {
    const surname = (family.headOfFamily?.lastName || family.familyName || '').trim().toLowerCase();
    const discrepancies: string[] = [];
    let matchedCount = 0;
    let possibleMismatch = false;

    for (const doc of documents) {
      const haystack = [
        doc.ocrRawText || '',
        ...(doc.extractedFields || []).map(f => f.value || ''),
      ]
        .join(' ')
        .toLowerCase();

      if (!surname || !haystack) {
        discrepancies.push(`${doc.documentType}: applicant name or readable extracted text is unavailable for comparison.`);
      } else if (haystack.includes(surname)) {
        matchedCount++;
      } else {
        possibleMismatch = true;
        discrepancies.push(
          `${doc.documentType}: applicant family name was not found in extracted text; officer inspection required.`,
        );
      }
    }

    const status: AgentResult['docAnalysis']['status'] = possibleMismatch
      ? 'Possible mismatch'
      : discrepancies.length || !documents.length
        ? 'Needs Review'
        : 'Initial match only';

    return { initialMatchCount: matchedCount, discrepancies, status };
  }

  private static runCompletenessAgent(
    family: FamilyRecord,
    documents: DocumentRecord[],
  ): AgentResult['completenessReview'] {
    const missingItems: string[] = [];
    const head = family.headOfFamily;
    if (!head?.firstName?.trim()) missingItems.push('Applicant first name');
    if (!head?.lastName?.trim()) missingItems.push('Applicant family name');
    if (!head?.dateOfBirth?.trim()) missingItems.push('Applicant date of birth');
    if (documents.length === 0) missingItems.push('Identity document');
    if ((family.members?.length || 0) + 1 < (family.householdSize || 1)) {
      missingItems.push('Household member details');
    }
    return {
      missingItems,
      status: missingItems.length ? 'Needs information' : 'Ready for officer review',
    };
  }

  private static runSupportPlanningAgent(family: FamilyRecord): AgentResult['supportPlan'] {
    const recommendations: string[] = [];
    if (family.needsInterpreter) {
      recommendations.push(
        family.primaryLanguage
          ? `Confirm interpreter availability for the recorded language: ${family.primaryLanguage}.`
          : 'Confirm the applicant’s preferred language and arrange interpreter support if needed.',
      );
    }
    if (family.householdSize > 1) {
      recommendations.push('Check that each household member has the required identity evidence and support needs recorded.');
    }
    return { recommendations };
  }

  /** Assess record integrity without scoring personal or protected characteristics. */
  private static runRiskAssessmentAgent(
    docAnalysis: AgentResult['docAnalysis'],
    completenessReview: AgentResult['completenessReview'],
  ): AgentResult['riskAssessment'] {
    const factors: string[] = [];
    let score: AgentResult['riskAssessment']['score'] = 'Low';
    if (completenessReview.missingItems.length) {
      score = 'Medium';
      factors.push(`Record completeness needs review: ${completenessReview.missingItems.join(', ')}.`);
    }
    if (docAnalysis.status === 'Possible mismatch') {
      score = 'High';
      factors.push('A possible document-to-record mismatch needs human inspection.');
    }

    return { score, factors };
  }

  /** Draft a non-binding recommendation from the record checks. */
  private static runDecisionDraftAgent(
    docAnalysis: AgentResult['docAnalysis'],
    completenessReview: AgentResult['completenessReview'],
  ): AgentResult['decisionDraft'] {
    if (docAnalysis.status !== 'Initial match only' || completenessReview.missingItems.length > 0) {
      return {
        recommendation: 'Clarification recommended',
        justification: [
          docAnalysis.discrepancies.length
            ? `Document analysis found ${docAnalysis.discrepancies.length} possible mismatch(es).`
            : '',
          completenessReview.missingItems.length
            ? `Missing information: ${completenessReview.missingItems.join(', ')}.`
            : '',
          'This is a draft for officer review; it does not verify or reject the application.',
        ].filter(Boolean).join(' '),
      };
    }
    return {
      recommendation: 'Officer review recommended',
      justification: `Initial text matching found no obvious discrepancy across ${docAnalysis.initialMatchCount} document(s). This is not identity verification or an approval; an officer must inspect the evidence and decide.`,
    };
  }
}
