import { useQuery } from '@tanstack/react-query';
import { fetchDocumentEntities } from '../../api/documents.api';

export const useDocumentEntitiesList = () => {
  return useQuery({
    queryKey: ['documentEntities', 'list'],
    queryFn: fetchDocumentEntities,
    staleTime: 15 * 60 * 1000, // 15 minutes (entities change rarely)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};