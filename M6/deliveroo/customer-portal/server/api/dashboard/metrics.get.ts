import { ensureConnection } from '~/model/connection'
import { Metrics } from '~/model/Metrics'

export default defineEventHandler(async () => {
  await ensureConnection()
  const metrics = await Metrics.findOne({}).lean()
  return metrics ?? { totalShipments: 0, onTimeDelivery: 0, totalCost: 0, storageVolume: 0 }
})
