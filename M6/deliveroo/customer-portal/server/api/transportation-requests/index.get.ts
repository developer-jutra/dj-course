import { ensureConnection } from '~/model/connection'
import { TransportationRequest } from '~/model/TransportationRequest'

export default defineEventHandler(async (event) => {
  await ensureConnection()

  const query = getQuery(event)
  const status = query.status as string | undefined
  const serviceType = query.serviceType as string | undefined
  const dateFrom = query.dateFrom as string | undefined

  let filter: Record<string, unknown> = {}

  if (status) filter.status = status
  if (serviceType) filter.serviceType = serviceType
  if (dateFrom) {
    filter.requestedPickupDate = { $gte: new Date(dateFrom) }
  }

  const requests = await TransportationRequest.find(filter)
    .sort({ createdAt: -1 })
    .lean()

  return requests.map((r) => ({
    ...r,
    id: r.requestNumber
  }))
})
