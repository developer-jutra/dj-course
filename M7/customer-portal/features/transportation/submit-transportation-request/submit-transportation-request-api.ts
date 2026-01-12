import type { SubmitTransportationRequestForm, SubmitTransportationRequestResponse } from './submit-transportation-request.model'
import { mockTransportationRequests } from '../transportation-requests-listing/transportation-request.mocks'
import type { TransportationRequest } from '../transportation-requests-listing/transportation-request.model'
import { RequestStatus, Priority, CargoType, PackagingType, LoadingType, FacilityType, TransportServiceType } from '../transportation-requests-listing/transportation-request.model'

export async function submitTransportationRequest(data: SubmitTransportationRequestForm): Promise<SubmitTransportationRequestResponse> {
  // TODO: replace with real HTTP call
  console.log('🚀 submitTransportationRequest called with data:', data)
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Generate request number
  const requestNumber = `TR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
  
  // Transform form data to TransportationRequest
  const newRequest: TransportationRequest = {
    id: requestNumber,
    requestNumber,
    type: 'TRANSPORTATION',
    status: RequestStatus.SUBMITTED,
    priority: data.priority as Priority,
    pickupLocation: {
      address: {
        street: data.pickupLocation.address.street,
        city: data.pickupLocation.address.city,
        country: data.pickupLocation.address.country,
        postalCode: '' // Not provided in form, using empty string
      },
      contactPerson: data.pickupLocation.contactPerson,
      contactPhone: data.pickupLocation.contactPhone,
      contactEmail: data.pickupLocation.contactEmail || '',
      operatingHours: data.pickupLocation.operatingHours as any,
      loadingType: data.pickupLocation.loadingType as LoadingType,
      facilityType: data.pickupLocation.facilityType as FacilityType
    },
    deliveryLocation: {
      address: {
        street: data.deliveryLocation.address.street,
        city: data.deliveryLocation.address.city,
        country: data.deliveryLocation.address.country,
        postalCode: '' // Not provided in form, using empty string
      },
      contactPerson: data.deliveryLocation.contactPerson,
      contactPhone: data.deliveryLocation.contactPhone,
      contactEmail: data.deliveryLocation.contactEmail || '',
      operatingHours: data.deliveryLocation.operatingHours as any,
      loadingType: data.deliveryLocation.loadingType as LoadingType,
      facilityType: data.deliveryLocation.facilityType as FacilityType
    },
    cargo: {
      description: data.cargo.description,
      cargoType: data.cargo.cargoType as CargoType,
      weight: data.cargo.weight,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: 'cm'
      },
      value: data.cargo.value,
      currency: data.cargo.currency,
      packaging: data.cargo.packaging as PackagingType,
      stackable: data.cargo.stackable,
      fragile: data.cargo.fragile,
      quantity: data.cargo.quantity,
      unitType: data.cargo.unitType
    },
    serviceType: data.serviceType as TransportServiceType,
    vehicleRequirements: {
      vehicleType: 'TRUCK' as any,
      capacity: 0,
      specialEquipment: [],
      driverRequirements: []
    },
    requestedPickupDate: new Date(data.requestedPickupDate),
    requestedDeliveryDate: data.requestedDeliveryDate ? new Date(data.requestedDeliveryDate) : new Date(),
    specialInstructions: data.specialInstructions,
    requiresInsurance: data.requiresInsurance,
    requiresCustomsClearance: data.requiresCustomsClearance,
    currency: data.currency,
    progressUpdates: [],
    createdBy: '1', // TODO: Get from auth store
    companyId: '1', // TODO: Get from auth store
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  // Add to mock data array
  // IMPORTANT: We're mutating the exported const array - this works because arrays are reference types
  mockTransportationRequests.unshift(newRequest) // Add to beginning so it appears first
  
  // Debug: Log the new request and total count
  // Using console.warn to make it more visible
  console.warn('✅✅✅ NEW TRANSPORTATION REQUEST ADDED ✅✅✅')
  console.log('✅ New transportation request added:', {
    id: newRequest.id,
    requestNumber: newRequest.requestNumber,
    status: newRequest.status,
    pickupCity: newRequest.pickupLocation.address.city,
    deliveryCity: newRequest.deliveryLocation.address.city
  })
  console.log('📊 Total requests in mockTransportationRequests array:', mockTransportationRequests.length)
  console.log('📋 First 3 request IDs:', mockTransportationRequests.slice(0, 3).map(r => r.id))
  console.log('🔍 Array reference check:', mockTransportationRequests === mockTransportationRequests ? 'SAME' : 'DIFFERENT')
  
  return {
    success: true,
    message: 'Transportation request submitted successfully',
    requestNumber
  }
} 