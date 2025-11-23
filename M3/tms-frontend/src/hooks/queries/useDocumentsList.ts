import { useQuery } from '@tanstack/react-query';
import { fetchDocuments } from '../../api/documents.api';
import { Document } from '../../model/documents';

interface UseDocumentsListOptions {
  entityType?: Document['entityType'];
  entityId?: string;
  type?: Document['type'];
}

export const useDocumentsList = (filters?: UseDocumentsListOptions) => {
  return useQuery({
    queryKey: ['documents', 'list', filters],
    queryFn: () => fetchDocuments(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes (documents change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};