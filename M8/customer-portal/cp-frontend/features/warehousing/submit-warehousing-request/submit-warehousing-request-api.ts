import type { SubmitWarehousingRequestForm, SubmitWarehousingRequestResponse } from './submit-warehousing-request.model'

export async function submitWarehousingRequest(
  data: SubmitWarehousingRequestForm
): Promise<SubmitWarehousingRequestResponse> {
  const response = await $fetch('/api/warehousing', {
    method: 'POST',
    body: {
      priority: data.priority,
      storageType: data.storageType,
    estimatedVolume: data.estimatedVolume,
    estimatedWeight: data.estimatedWeight,
    cargo: {
      description: data.cargo.description,
        cargoType: data.cargo.cargoType,
      weight: data.estimatedWeight,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: 'cm'
      },
      value: data.cargo.value,
      currency: data.cargo.currency,
        packaging: data.cargo.packaging,
      stackable: true,
      fragile: false,
      quantity: data.cargo.quantity,
      unitType: data.cargo.unitType
    },
    estimatedStorageDuration: data.estimatedStorageDuration,
      plannedStartDate: data.plannedStartDate,
      plannedEndDate: data.plannedEndDate,
      handlingServices: data.handlingServices,
      valueAddedServices: data.valueAddedServices,
      securityLevel: data.securityLevel,
    requiresTemperatureControl: data.requiresTemperatureControl,
    requiresHumidityControl: data.requiresHumidityControl,
    requiresSpecialHandling: data.requiresSpecialHandling,
    specialInstructions: data.specialInstructions,
    currency: data.cargo.currency,
      billingType: data.billingType
    }
  })
  
  return {
    success: response.success,
    message: response.message,
    requestNumber: response.requestNumber
  }
} 