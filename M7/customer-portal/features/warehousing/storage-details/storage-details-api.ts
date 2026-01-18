import { useQuery } from '@tanstack/vue-query'
import type { StorageItem } from '~/features/warehousing/storage-listing/storage-listing.model'
import { mockStorageItems } from '~/features/warehousing/storage-listing/storage-listing.mocks'

// Fetch single storage item by ID
export async function getStorageItemDetails(id: string): Promise<StorageItem> {
  await new Promise(resolve => setTimeout(resolve, 500))
  const item = mockStorageItems.find(item => item.id === id)
  if (!item) throw new Error('Storage item not found')
  return item
}

// Composable using TanStack Query
export function useStorageItemDetails(id: string) {
  return useQuery({
    queryKey: ['storage', 'details', id],
    queryFn: () => getStorageItemDetails(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  })
} 