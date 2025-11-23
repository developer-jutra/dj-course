import { Document, DocumentEntity, sampleDocuments, getDocumentEntities } from '../model/documents';
import { createApiResponse, simulateApiError } from './utils';

/**
 * Documents API - Simulates HTTP endpoints for document management
 */

/**
 * GET /api/documents
 * Fetches all documents with optional filtering
 */
export const fetchDocuments = async (filters?: {
  entityType?: Document['entityType'];
  entityId?: string;
  type?: Document['type'];
}): Promise<Document[]> => {
  simulateApiError(0.02, 'Failed to fetch documents');
  
  let documents = [...sampleDocuments];
  
  if (filters) {
    if (filters.entityType) {
      documents = documents.filter(doc => doc.entityType === filters.entityType);
    }
    if (filters.entityId) {
      documents = documents.filter(doc => doc.entityId === filters.entityId);
    }
    if (filters.type) {
      documents = documents.filter(doc => doc.type === filters.type);
    }
  }
  
  return createApiResponse(documents);
};

/**
 * GET /api/documents/:id
 * Fetches a single document by ID
 */
export const fetchDocumentById = async (id: string): Promise<Document | null> => {
  simulateApiError(0.02, 'Failed to fetch document');
  
  const document = sampleDocuments.find(doc => doc.id === id) || null;
  return createApiResponse(document);
};

/**
 * GET /api/document-entities
 * Fetches all available entities for document association
 */
export const fetchDocumentEntities = async (): Promise<DocumentEntity[]> => {
  simulateApiError(0.01, 'Failed to fetch document entities');
  
  return createApiResponse(getDocumentEntities());
};

/**
 * POST /api/documents
 * Creates a new document
 */
export const createDocument = async (documentData: Partial<Document>): Promise<Document> => {
  simulateApiError(0.03, 'Failed to create document');
  
  const newDocument: Document = {
    id: `doc-${Date.now()}`,
    name: documentData.name!,
    type: documentData.type!,
    entityType: documentData.entityType!,
    entityId: documentData.entityId!,
    entityName: documentData.entityName!,
    number: documentData.number,
    issueDate: documentData.issueDate!,
    expiryDate: documentData.expiryDate,
    issuingAuthority: documentData.issuingAuthority,
    fileUrl: '/documents/mock-document.pdf',
    fileSize: 1024000,
    mimeType: 'application/pdf',
    notes: documentData.notes,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return createApiResponse(newDocument);
};

/**
 * PUT /api/documents/:id
 * Updates an existing document
 */
export const updateDocument = async (id: string, updates: Partial<Document>): Promise<Document> => {
  simulateApiError(0.03, 'Failed to update document');
  
  const existingDocument = sampleDocuments.find(doc => doc.id === id);
  if (!existingDocument) {
    throw new Error('Document not found');
  }
  
  const updatedDocument: Document = {
    ...existingDocument,
    ...updates,
    updatedAt: new Date()
  };
  
  return createApiResponse(updatedDocument);
};

/**
 * DELETE /api/documents/:id
 * Deletes a document
 */
export const deleteDocument = async (id: string): Promise<void> => {
  simulateApiError(0.03, 'Failed to delete document');
  
  const documentExists = sampleDocuments.some(doc => doc.id === id);
  if (!documentExists) {
    throw new Error('Document not found');
  }
  
  return createApiResponse(undefined);
};