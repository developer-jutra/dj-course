import { Schema, model } from 'mongoose'

const transportationRequestSchema = new Schema(
  {
    requestNumber: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    pickupLocation: { type: Schema.Types.Mixed },
    deliveryLocation: { type: Schema.Types.Mixed },
    cargo: { type: Schema.Types.Mixed },
    serviceType: { type: String },
    vehicleRequirements: { type: Schema.Types.Mixed },
    requestedPickupDate: { type: Date },
    requestedDeliveryDate: { type: Date },
    requiresInsurance: { type: Boolean },
    requiresCustomsClearance: { type: Boolean },
    currency: { type: String },
    trackingNumber: { type: String },
    progressUpdates: { type: [Schema.Types.Mixed], default: [] },
    createdBy: { type: String },
    companyId: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  { collection: 'transportation_requests' }
)

export const TransportationRequest = model('TransportationRequest', transportationRequestSchema)
export default TransportationRequest
