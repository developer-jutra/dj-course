import { Schema, model } from 'mongoose'

const dashboardStatSchema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  iconName: { type: String, required: true },
  color: { type: String, required: true },
  visible: { type: Boolean, default: true }
})

export const DashboardStat = model('DashboardStat', dashboardStatSchema, 'dashboard_stats')
export default DashboardStat
