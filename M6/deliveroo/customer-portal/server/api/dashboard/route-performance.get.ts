import { ensureConnection } from '~/model/connection'
import { RoutePerformance } from '~/model/RoutePerformance'

export default defineEventHandler(async () => {
  await ensureConnection()
  const routes = await RoutePerformance.find({}).lean()
  return routes
})
