import { Schema, model } from 'mongoose'

const recentRequestSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  route: { type: String, required: true },
  date: { type: Date, required: true }
})

export const RecentRequest = model('RecentRequest', recentRequestSchema, 'recent_requests')
export default RecentRequest
