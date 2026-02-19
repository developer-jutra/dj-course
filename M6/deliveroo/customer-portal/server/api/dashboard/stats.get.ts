import { ensureConnection } from '~/model/connection'
import { DashboardStat } from '~/model/DashboardStat'

export default defineEventHandler(async () => {
  await ensureConnection()
  const stats = await DashboardStat.find({ visible: true }).lean()
  return stats
})
