import { Schema, model } from 'mongoose'

const metricsSchema = new Schema({
  totalShipments: { type: Number, required: true },
  onTimeDelivery: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  storageVolume: { type: Number, required: true }
})

export const Metrics = model('Metrics', metricsSchema, 'metrics')
export default Metrics
