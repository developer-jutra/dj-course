import React, { useState, useEffect } from 'react';
import { Document, DocumentEntity } from '../../model/documents';
import { Plus, FileText } from 'lucide-react';
import { AddDocumentForm } from './AddDocumentForm';
import { DocumentFilters } from './DocumentFilters';
import { DocumentTile } from './DocumentTile';
import { DocumentWarnings } from './DocumentWarnings';

interface DocumentsListProps {
  documents: Document[];
  entities: DocumentEntity[];
  initialFilters?: {
    entityType?: Document['entityType'];
    entityId?: string;
  };
  onDocumentSelect?: (document: Document) => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({ 
  documents: initialDocuments, 
  entities, 
  initialFilters,
  onDocumentSelect 
}) => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntityType, setFilterEntityType] = useState<'all' | Document['entityType']>(
    initialFilters?.entityType || 'all'
  );
  const [filterEntityId, setFilterEntityId] = useState<'all' | string>(
    initialFilters?.entityId || 'all'
  );
  const [filterDocumentType, setFilterDocumentType] = useState<'all' | Document['type']>('all');
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Apply initial filters when component mounts or initialFilters change
  useEffect(() => {
    if (initialFilters?.entityType) {
      setFilterEntityType(initialFilters.entityType);
    }
    if (initialFilters?.entityId) {
      setFilterEntityId(initialFilters.entityId);
    }
  }, [initialFilters]);

  // Update local documents when prop changes
  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  // Filter entities based on selected entity type
  const availableEntities = filterEntityType === 'all' 
    ? entities 
    : entities.filter(entity => entity.type === filterEntityType);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.number && doc.number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.issuingAuthority && doc.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesEntityType = filterEntityType === 'all' || doc.entityType === filterEntityType;
    const matchesEntity = filterEntityId === 'all' || doc.entityId === filterEntityId;
    const matchesDocumentType = filterDocumentType === 'all' || doc.type === filterDocumentType;
    
    return matchesSearch && matchesEntityType && matchesEntity && matchesDocumentType;
  });

  const handleAddDocument = async (documentData: Partial<Document>) => {
    setIsAddingDocument(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create new document with generated ID
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

    // Add to local state
    setDocuments(prev => [newDocument, ...prev]);
    
    console.log('Sending to backend:', newDocument);
    
    setIsAddingDocument(false);
    setShowAddDocument(false);
  };

  const handleEditName = (documentId: string, currentName: string) => {
    setEditingDocumentId(documentId);
    setEditingName(currentName);
  };

  const handleSaveEdit = (documentId: string, newName: string) => {
    // Update document name in local state
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, name: newName, updatedAt: new Date() }
        : doc
    ));

    // Find the updated document and log it
    const updatedDocument = documents.find(doc => doc.id === documentId);
    if (updatedDocument) {
      const newDocument = { ...updatedDocument, name: newName, updatedAt: new Date() };
      console.log('Sending to backend:', newDocument);
    }
    
    setEditingDocumentId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingDocumentId(null);
    setEditingName('');
  };

  const handleView = (document: Document) => {
    // This will be handled by the DocumentTile component now
    console.log('View document:', document.name);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterEntityType('all');
    setFilterEntityId('all');
    setFilterDocumentType('all');
  };

  const hasActiveFilters = searchTerm !== '' || filterEntityType !== 'all' || filterEntityId !== 'all' || filterDocumentType !== 'all';

  // Get page title based on filters
  const getPageTitle = () => {
    if (filterEntityType !== 'all' && filterEntityId !== 'all') {
      const entity = entities.find(e => e.id === filterEntityId);
      return `Documents - ${entity?.name || 'Unknown Entity'}`;
    } else if (filterEntityType !== 'all') {
      const getEntityTypeLabel = (type: Document['entityType']) => {
        const labels = {
          'vehicle': 'Vehicle',
          'customer': 'Customer',
          'supplier': 'Supplier',
          'driver': 'Driver',
          'company': 'Company',
          'other': 'Other'
        };
        return labels[type];
      };
      return `${getEntityTypeLabel(filterEntityType)} Documents`;
    }
    return 'Document Management';
  };

  const getPageDescription = () => {
    if (filterEntityType !== 'all' && filterEntityId !== 'all') {
      const entity = entities.find(e => e.id === filterEntityId);
      return `Manage documents for ${entity?.name || 'this entity'}`;
    } else if (filterEntityType !== 'all') {
      const getEntityTypeLabel = (type: Document['entityType']) => {
        const labels = {
          'vehicle': 'Vehicle',
          'customer': 'Customer',
          'supplier': 'Supplier',
          'driver': 'Driver',
          'company': 'Company',
          'other': 'Other'
        };
        return labels[type];
      };
      return `Manage all ${getEntityTypeLabel(filterEntityType).toLowerCase()} documents`;
    }
    return 'Manage all company documents and certificates';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
            <p className="text-gray-600">{getPageDescription()}</p>
          </div>
          <button
            onClick={() => setShowAddDocument(true)}
            disabled={isAddingDocument}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isAddingDocument 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            {isAddingDocument ? 'Adding...' : 'Add Document'}
          </button>
        </div>
      </div>

      {/* Alerts */}
      <DocumentWarnings documents={documents} />

      {/* Search and Filters */}
      <DocumentFilters
        searchTerm={searchTerm}
        filterEntityType={filterEntityType}
        filterEntityId={filterEntityId}
        filterDocumentType={filterDocumentType}
        availableEntities={availableEntities}
        onSearchChange={setSearchTerm}
        onEntityTypeChange={setFilterEntityType}
        onEntityIdChange={setFilterEntityId}
        onDocumentTypeChange={setFilterDocumentType}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredDocuments.length}
      />

      {/* Add Document Form */}
      {showAddDocument && (
        <AddDocumentForm
          entities={entities}
          onSave={handleAddDocument}
          onCancel={() => setShowAddDocument(false)}
          isLoading={isAddingDocument}
        />
      )}

      {/* Documents List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDocuments.map((document) => (
          <DocumentTile
            key={document.id}
            document={document}
            onView={handleView}
            onEdit={handleEditName}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            editingDocumentId={editingDocumentId}
            editingName={editingName}
            onEditingNameChange={setEditingName}
          />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new document.</p>
        </div>
      )}
    </div>
  );
};