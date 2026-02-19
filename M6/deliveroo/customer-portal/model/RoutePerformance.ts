import { Schema, model } from 'mongoose'

const routePerformanceSchema = new Schema({
  route: { type: String, required: true },
  shipments: { type: Number, required: true },
  onTimePercentage: { type: Number, required: true },
  avgCost: { type: Number, required: true },
  totalRevenue: { type: Number, required: true }
})

export const RoutePerformance = model('RoutePerformance', routePerformanceSchema, 'route_performance')
export default RoutePerformance
