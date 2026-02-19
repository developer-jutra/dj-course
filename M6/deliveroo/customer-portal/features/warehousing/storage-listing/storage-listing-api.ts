import type { StorageItem } from './storage-listing.model'
import { mockStorageItems } from './storage-listing.mocks'

export async function getStorageItems(filters: any = {}): Promise<StorageItem[]> {
  await new Promise(resolve => setTimeout(resolve, 500))

  let items = [...mockStorageItems]

  if (filters.status) {
    items = items.filter(item => item.status === filters.status)
  }
  if (filters.cargoType) {
    items = items.filter(item => item.cargoType === filters.cargoType)
  }
  return items
} 