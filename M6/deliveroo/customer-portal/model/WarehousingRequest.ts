import { Schema, model } from 'mongoose'

const warehousingRequestSchema = new Schema(
  {
    requestNumber: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    storageType: { type: String },
    estimatedVolume: { type: Number },
    estimatedWeight: { type: Number },
    cargo: { type: Schema.Types.Mixed },
    estimatedStorageDuration: { type: Schema.Types.Mixed },
    plannedStartDate: { type: Date },
    plannedEndDate: { type: Date },
    handlingServices: { type: [String], default: [] },
    valueAddedServices: { type: [String], default: [] },
    securityLevel: { type: String },
    requiresTemperatureControl: { type: Boolean },
    requiresHumidityControl: { type: Boolean },
    requiresSpecialHandling: { type: Boolean },
    currency: { type: String },
    billingType: { type: String },
    storageLocation: { type: String },
    inventoryStatus: { type: String },
    progressUpdates: { type: [Schema.Types.Mixed], default: [] },
    createdBy: { type: String },
    companyId: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  { collection: 'warehousing_requests' }
)

export const WarehousingRequest = model('WarehousingRequest', warehousingRequestSchema)
export default WarehousingRequest
