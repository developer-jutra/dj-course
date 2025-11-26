import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { DocumentsList } from './documents/DocumentsList';
import { LoadingPage, ErrorMessage } from '../components';
import { useDocumentsList, useDocumentEntitiesList } from '../hooks/queries';
import { Document } from '../model/documents';

export const DocumentsPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Get filters from URL params
  const initialFilters = {
    entityType: searchParams.get('entityType') as Document['entityType'] | undefined,
    entityId: searchParams.get('entityId') || undefined
  };

  const { 
    data: documents = [], 
    isLoading: documentsLoading, 
    error: documentsError, 
    refetch: refetchDocuments 
  } = useDocumentsList(initialFilters);

  const { 
    data: entities = [], 
    isLoading: entitiesLoading, 
    error: entitiesError, 
    refetch: refetchEntities 
  } = useDocumentEntitiesList();

  const isLoading = documentsLoading || entitiesLoading;
  const error = documentsError || entitiesError;

  const handleRetry = () => {
    refetchDocuments();
    refetchEntities();
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorMessage 
          error={error instanceof Error ? error.message : 'Failed to load documents'} 
          onRetry={handleRetry} 
        />
      </div>
    );
  }

  return (
    <DocumentsList 
      documents={documents}
      entities={entities}
      initialFilters={initialFilters}
    />
  );
};