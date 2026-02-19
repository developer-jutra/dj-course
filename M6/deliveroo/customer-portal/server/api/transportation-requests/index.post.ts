import { ensureConnection } from '~/model/connection'
import { TransportationRequest } from '~/model/TransportationRequest'

export default defineEventHandler(async (event) => {
  await ensureConnection()

  const body = await readBody(event)
  const requestNumber = `TR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

  const doc = {
    requestNumber,
    type: 'TRANSPORTATION',
    status: 'SUBMITTED',
    priority: body.priority ?? 'NORMAL',
    pickupLocation: {
      address: {
        street: body.pickupLocation?.address?.street ?? '',
        city: body.pickupLocation?.address?.city ?? '',
        country: body.pickupLocation?.address?.country ?? '',
        postalCode: body.pickupLocation?.address?.postalCode ?? ''
      },
      contactPerson: body.pickupLocation?.contactPerson ?? '',
      contactPhone: body.pickupLocation?.contactPhone ?? '',
      contactEmail: body.pickupLocation?.contactEmail ?? '',
      operatingHours: body.pickupLocation?.operatingHours ?? {},
      loadingType: body.pickupLocation?.loadingType ?? 'DOCK',
      facilityType: body.pickupLocation?.facilityType ?? 'WAREHOUSE'
    },
    deliveryLocation: {
      address: {
        street: body.deliveryLocation?.address?.street ?? '',
        city: body.deliveryLocation?.address?.city ?? '',
        country: body.deliveryLocation?.address?.country ?? '',
        postalCode: body.deliveryLocation?.address?.postalCode ?? ''
      },
      contactPerson: body.deliveryLocation?.contactPerson ?? '',
      contactPhone: body.deliveryLocation?.contactPhone ?? '',
      contactEmail: body.deliveryLocation?.contactEmail ?? '',
      operatingHours: body.deliveryLocation?.operatingHours ?? {},
      loadingType: body.deliveryLocation?.loadingType ?? 'DOCK',
      facilityType: body.deliveryLocation?.facilityType ?? 'WAREHOUSE'
    },
    cargo: {
      description: body.cargo?.description ?? '',
      cargoType: body.cargo?.cargoType ?? 'GENERAL_CARGO',
      weight: body.cargo?.weight ?? 0,
      dimensions: body.cargo?.dimensions ?? { length: 0, width: 0, height: 0, unit: 'cm' },
      value: body.cargo?.value ?? 0,
      currency: body.cargo?.currency ?? 'EUR',
      packaging: body.cargo?.packaging ?? 'PALLETS',
      stackable: body.cargo?.stackable ?? false,
      fragile: body.cargo?.fragile ?? false,
      quantity: body.cargo?.quantity ?? 0,
      unitType: body.cargo?.unitType ?? 'pallets'
    },
    serviceType: body.serviceType ?? 'FULL_TRUCKLOAD',
    vehicleRequirements: body.vehicleRequirements ?? {
      vehicleType: 'TRUCK',
      capacity: 2000,
      specialEquipment: [],
      driverRequirements: []
    },
    requestedPickupDate: body.requestedPickupDate ? new Date(body.requestedPickupDate) : new Date(),
    requestedDeliveryDate: body.requestedDeliveryDate ? new Date(body.requestedDeliveryDate) : new Date(),
    requiresInsurance: body.requiresInsurance ?? false,
    requiresCustomsClearance: body.requiresCustomsClearance ?? false,
    currency: body.currency ?? 'EUR',
    progressUpdates: [],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  await TransportationRequest.create(doc)

  return {
    success: true,
    message: 'Transportation request submitted successfully',
    requestNumber
  }
})
