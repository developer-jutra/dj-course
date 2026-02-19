import { ensureConnection } from '~/model/connection'
import { WarehousingRequest } from '~/model/WarehousingRequest'

export default defineEventHandler(async (event) => {
  await ensureConnection()

  const body = await readBody(event)
  const requestNumber = `WH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

  const doc = {
    requestNumber,
    type: 'WAREHOUSING',
    status: 'SUBMITTED',
    priority: body.priority ?? 'NORMAL',
    storageType: body.storageType ?? 'AMBIENT',
    estimatedVolume: body.estimatedVolume ?? 0,
    estimatedWeight: body.estimatedWeight ?? 0,
    cargo: {
      description: body.cargo?.description ?? '',
      cargoType: body.cargo?.cargoType ?? 'GENERAL_CARGO',
      weight: body.estimatedWeight ?? 0,
      dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
      value: body.cargo?.value ?? 0,
      currency: body.cargo?.currency ?? 'EUR',
      packaging: body.cargo?.packaging ?? 'PALLETS',
      stackable: true,
      fragile: false,
      quantity: body.cargo?.quantity ?? 0,
      unitType: body.cargo?.unitType ?? 'pallets'
    },
    estimatedStorageDuration: body.estimatedStorageDuration ?? { value: 1, unit: 'months' },
    plannedStartDate: body.plannedStartDate ? new Date(body.plannedStartDate) : new Date(),
    plannedEndDate: body.plannedEndDate ? new Date(body.plannedEndDate) : undefined,
    handlingServices: body.handlingServices ?? [],
    valueAddedServices: body.valueAddedServices ?? [],
    securityLevel: body.securityLevel ?? 'STANDARD',
    requiresTemperatureControl: body.requiresTemperatureControl ?? false,
    requiresHumidityControl: body.requiresHumidityControl ?? false,
    requiresSpecialHandling: body.requiresSpecialHandling ?? false,
    currency: body.cargo?.currency ?? 'EUR',
    billingType: body.billingType ?? 'MONTHLY',
    inventoryStatus: 'PENDING_ARRIVAL',
    progressUpdates: [],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  await WarehousingRequest.create(doc)

  return {
    success: true,
    message: 'Warehousing request submitted successfully',
    requestNumber
  }
})
