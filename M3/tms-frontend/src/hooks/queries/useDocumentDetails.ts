import { useQuery } from '@tanstack/react-query';
import { fetchDocumentById } from '../../http/documents.http';

export const useDocumentDetails = (id: string) => {
  return useQuery({
    queryKey: ['documents', 'details', id],
    queryFn: () => fetchDocumentById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};