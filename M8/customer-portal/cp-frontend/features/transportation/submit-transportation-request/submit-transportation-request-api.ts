import type { SubmitTransportationRequestForm, SubmitTransportationRequestResponse } from './submit-transportation-request.model'

export async function submitTransportationRequest(data: SubmitTransportationRequestForm): Promise<SubmitTransportationRequestResponse> {
  // Mongoose will validate based on schema when saving on the server
  // Only send fields that have values - mongoose handles optional fields
  const response = await $fetch('/api/transportation', {
    method: 'POST',
    body: {
      priority: data.priority,
      pickupLocation: {
        address: {
          street: data.pickupLocation.address.street,
          city: data.pickupLocation.address.city,
          country: data.pickupLocation.address.country,
          ...(data.pickupLocation.address?.postalCode && { postalCode: data.pickupLocation.address.postalCode })
        },
        contactPerson: data.pickupLocation.contactPerson,
        contactPhone: data.pickupLocation.contactPhone,
        ...(data.pickupLocation.contactEmail && { contactEmail: data.pickupLocation.contactEmail }),
        ...(data.pickupLocation.operatingHours && { operatingHours: data.pickupLocation.operatingHours }),
        loadingType: data.pickupLocation.loadingType,
        facilityType: data.pickupLocation.facilityType
      },
      deliveryLocation: {
        address: {
          street: data.deliveryLocation.address.street,
          city: data.deliveryLocation.address.city,
          country: data.deliveryLocation.address.country,
          ...(data.deliveryLocation.address?.postalCode && { postalCode: data.deliveryLocation.address.postalCode })
        },
        contactPerson: data.deliveryLocation.contactPerson,
        contactPhone: data.deliveryLocation.contactPhone,
        ...(data.deliveryLocation.contactEmail && { contactEmail: data.deliveryLocation.contactEmail }),
        ...(data.deliveryLocation.operatingHours && { operatingHours: data.deliveryLocation.operatingHours }),
        loadingType: data.deliveryLocation.loadingType,
        facilityType: data.deliveryLocation.facilityType
      },
      cargo: {
        description: data.cargo.description,
        cargoType: data.cargo.cargoType,
        weight: data.cargo.weight,
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
          unit: 'cm'
        },
        value: data.cargo.value,
        currency: data.cargo.currency,
        packaging: data.cargo.packaging,
        stackable: data.cargo.stackable,
        fragile: data.cargo.fragile,
        quantity: data.cargo.quantity,
        unitType: data.cargo.unitType
      },
      serviceType: data.serviceType,
      requestedPickupDate: data.requestedPickupDate,
      requestedDeliveryDate: data.requestedDeliveryDate,
      specialInstructions: data.specialInstructions,
      requiresInsurance: data.requiresInsurance,
      requiresCustomsClearance: data.requiresCustomsClearance,
      currency: data.currency
    }
  })
  
  return {
    success: response.success,
    message: response.message,
    requestNumber: response.requestNumber
  }
} 