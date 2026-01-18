export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'invoice' | 'registration' | 'insurance' | 'inspection' | 'tir-carnet' | 'adr' | 'hazmat-permit' | 'license' | 'certificate' | 'other';
  entityType: 'vehicle' | 'customer' | 'supplier' | 'driver' | 'company' | 'other';
  entityId: string;
  entityName: string;
  number?: string;
  issueDate: Date;
  expiryDate?: Date;
  issuingAuthority?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentEntity {
  id: string;
  name: string;
  type: Document['entityType'];
}