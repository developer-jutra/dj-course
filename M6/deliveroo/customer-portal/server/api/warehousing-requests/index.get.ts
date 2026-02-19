import { ensureConnection } from '~/model/connection'
import { WarehousingRequest } from '~/model/WarehousingRequest'

export default defineEventHandler(async (event) => {
  await ensureConnection()

  const query = getQuery(event)
  const status = query.status as string | undefined
  const priority = query.priority as string | undefined
  const storageType = query.storageType as string | undefined
  const securityLevel = query.securityLevel as string | undefined
  const dateFrom = query.dateFrom as string | undefined
  const dateTo = query.dateTo as string | undefined
  const page = parseInt((query.page as string) || '1')
  const limit = parseInt((query.limit as string) || '10')

  const filter: Record<string, unknown> = {}

  if (status) filter.status = status
  if (priority) filter.priority = priority
  if (storageType) filter.storageType = storageType
  if (securityLevel) filter.securityLevel = securityLevel
  if (dateFrom || dateTo) {
    const dateCond: Record<string, Date> = {}
    if (dateFrom) dateCond.$gte = new Date(dateFrom)
    if (dateTo) dateCond.$lte = new Date(dateTo)
    filter.plannedStartDate = dateCond
  }

  const [docs, total] = await Promise.all([
    WarehousingRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    WarehousingRequest.countDocuments(filter)
  ])

  const data = docs.map((r) => ({
    id: r.requestNumber,
    requestNumber: r.requestNumber,
    type: 'Warehousing' as const,
    status: r.status,
    details: r.cargo?.description ?? 'Storage',
    subDetails: `${r.storageType ?? ''} - ${r.estimatedVolume ?? 0} m³`,
    date: r.plannedStartDate ?? r.createdAt,
    priority: r.priority,
    trackingNumber: undefined,
    storageType: r.storageType,
    securityLevel: r.securityLevel,
    volume: r.estimatedVolume ?? 0
  }))

  return {
    data,
    total,
    page,
    limit
  }
})
