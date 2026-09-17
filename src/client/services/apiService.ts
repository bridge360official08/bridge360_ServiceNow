import { 
  Application, 
  DocumentItem, 
  ExtractedField, 
  FamilyGroup, 
  ActivityLog, 
  StatItem,
  ApplicationStatus,
  DocumentType
} from '../types';
import { 
  MOCK_APPLICATIONS, 
  MOCK_DOCUMENTS, 
  MOCK_EXTRACTED_FIELDS, 
  MOCK_FAMILIES, 
  MOCK_ACTIVITIES, 
  MOCK_STAT_ITEMS 
} from './mockData';

/**
 * Bridge360 Service Abstraction Layer
 * 
 * DESIGN RULE:
 * UI components call this service rather than using direct state or raw fetches.
 * For Phase 1, this layer returns typed promises backed by mock data.
 * For Phase 2+, this layer can be plugged into ServiceNow REST endpoints
 * (e.g. /api/global/bridge360/...) seamlessly without changing UI component signatures.
 */
export class Bridge360Service {
  /**
   * Fetch Dashboard Statistics
   */
  public async getDashboardStats(): Promise<StatItem[]> {
    return Promise.resolve([...MOCK_STAT_ITEMS]);
  }

  /**
   * Fetch Applications with optional filtering
   */
  public async getApplications(filters?: {
    search?: string;
    status?: ApplicationStatus | 'all';
    sortBy?: 'updatedAt' | 'confidenceScore' | 'applicantName';
  }): Promise<Application[]> {
    let result = [...MOCK_APPLICATIONS];

    if (filters?.status && filters.status !== 'all') {
      result = result.filter(app => app.status === filters.status);
    }

    if (filters?.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      result = result.filter(app => 
        app.applicantName.toLowerCase().includes(q) || 
        app.id.toLowerCase().includes(q) ||
        app.familyGroup.toLowerCase().includes(q)
      );
    }

    if (filters?.sortBy === 'confidenceScore') {
      result.sort((a, b) => b.confidenceScore - a.confidenceScore);
    }

    return Promise.resolve(result);
  }

  /**
   * Fetch Single Application Details
   */
  public async getApplicationById(id: string): Promise<Application | null> {
    const found = MOCK_APPLICATIONS.find(app => app.id === id);
    return Promise.resolve(found || null);
  }

  /**
   * Fetch Documents
   */
  public async getDocuments(filters?: {
    search?: string;
    type?: DocumentType | 'all';
  }): Promise<DocumentItem[]> {
    let result = [...MOCK_DOCUMENTS];

    if (filters?.type && filters.type !== 'all') {
      result = result.filter(doc => doc.type === filters.type);
    }

    if (filters?.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      result = result.filter(doc => 
        doc.name.toLowerCase().includes(q) || 
        doc.applicantName.toLowerCase().includes(q) ||
        doc.id.toLowerCase().includes(q)
      );
    }

    return Promise.resolve(result);
  }

  /**
   * Fetch Extracted Fields for a Document / Application verification view
   */
  public async getExtractedFields(documentId?: string): Promise<ExtractedField[]> {
    return Promise.resolve([...MOCK_EXTRACTED_FIELDS]);
  }

  /**
   * Update Field Extraction Status (Accept, Edit, Reject)
   */
  public async updateFieldStatus(
    fieldId: string, 
    status: 'accepted' | 'edited' | 'rejected', 
    newValue?: string
  ): Promise<boolean> {
    const field = MOCK_EXTRACTED_FIELDS.find(f => f.id === fieldId);
    if (field) {
      field.status = status;
      if (newValue !== undefined) {
        field.extractedValue = newValue;
      }
    }
    return Promise.resolve(true);
  }

  /**
   * Fetch Family Groups
   */
  public async getFamilies(): Promise<FamilyGroup[]> {
    return Promise.resolve([...MOCK_FAMILIES]);
  }

  /**
   * Fetch Recent Activity Log
   */
  public async getRecentActivities(): Promise<ActivityLog[]> {
    return Promise.resolve([...MOCK_ACTIVITIES]);
  }
}

export const apiService = new Bridge360Service();
