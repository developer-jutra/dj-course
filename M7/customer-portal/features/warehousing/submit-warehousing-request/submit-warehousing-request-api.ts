import type { SubmitWarehousingRequestForm, SubmitWarehousingRequestResponse } from './submit-warehousing-request.model'
import { mockWarehousingRequests as detailedMockRequests } from '../warehousing-request-details/warehousing-request-details.mocks'
import { mockWarehousingRequests as listingMockRequests } from '../warehousing-requests-listing/warehousing-requests.mocks'
import type { WarehousingRequest } from '../warehousing-request-details/warehousing-request-details.model'
import type { WarehousingRequestItem } from '../warehousing-requests-listing/warehousing-requests.model'
import { RequestStatus, Priority, StorageType, SecurityLevel, BillingType, InventoryStatus, HandlingService, ValueAddedService, CargoType, PackagingType } from '../warehousing-request-details/warehousing-request-details.model'

export async function submitWarehousingRequest(
  data: SubmitWarehousingRequestForm
): Promise<SubmitWarehousingRequestResponse> {
  // TODO: replace with real HTTP call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Generate request number
  const requestNumber = `WH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
  
  // Transform form data to WarehousingRequest
  const newRequest: WarehousingRequest = {
    id: requestNumber,
    requestNumber,
    type: 'WAREHOUSING',
    status: RequestStatus.SUBMITTED,
    priority: data.priority as Priority,
    storageType: data.storageType as StorageType,
    estimatedVolume: data.estimatedVolume,
    estimatedWeight: data.estimatedWeight,
    cargo: {
      description: data.cargo.description,
      cargoType: data.cargo.cargoType as CargoType,
      weight: data.estimatedWeight,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: 'cm'
      },
      value: data.cargo.value,
      currency: data.cargo.currency,
      packaging: data.cargo.packaging as PackagingType,
      stackable: true,
      fragile: false,
      quantity: data.cargo.quantity,
      unitType: data.cargo.unitType
    },
    estimatedStorageDuration: data.estimatedStorageDuration,
    plannedStartDate: new Date(data.plannedStartDate),
    plannedEndDate: data.plannedEndDate ? new Date(data.plannedEndDate) : undefined,
    handlingServices: data.handlingServices as HandlingService[],
    valueAddedServices: data.valueAddedServices as ValueAddedService[],
    securityLevel: data.securityLevel as SecurityLevel,
    requiresTemperatureControl: data.requiresTemperatureControl,
    requiresHumidityControl: data.requiresHumidityControl,
    requiresSpecialHandling: data.requiresSpecialHandling,
    specialInstructions: data.specialInstructions,
    currency: data.cargo.currency,
    billingType: data.billingType as BillingType,
    inventoryStatus: InventoryStatus.PENDING_ARRIVAL,
    progressUpdates: [],
    createdBy: '1', // TODO: Get from auth store
    companyId: '1', // TODO: Get from auth store
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  // Add to detailed mock data array (for details page)
  detailedMockRequests.unshift(newRequest) // Add to beginning so it appears first
  
  // Also add to listing mock data array (for listing page)
  const storageTypeLabel = data.storageType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  const listingItem: WarehousingRequestItem = {
    id: requestNumber,
    requestNumber,
    type: 'Warehousing',
    status: RequestStatus.SUBMITTED,
    details: `${storageTypeLabel} Storage`,
    subDetails: `${data.cargo.description} - ${data.estimatedVolume} m³`,
    date: new Date(),
    priority: data.priority,
    storageType: data.storageType,
    securityLevel: data.securityLevel,
    volume: data.estimatedVolume
  }
  listingMockRequests.unshift(listingItem) // Add to beginning so it appears first
  
  console.log('✅ New warehousing request added:', {
    id: newRequest.id,
    requestNumber: newRequest.requestNumber,
    status: newRequest.status,
    storageType: newRequest.storageType
  })
  console.log('📊 Total requests in detailedMockRequests array:', detailedMockRequests.length)
  console.log('📊 Total requests in listingMockRequests array:', listingMockRequests.length)
  
  return {
    success: true,
    message: 'Warehousing request submitted successfully',
    requestNumber
  }
} 