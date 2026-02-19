import { ensureConnection } from '~/model/connection'
import { TransportationRequest } from '~/model/TransportationRequest'

export default defineEventHandler(async (event) => {
  await ensureConnection()

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Request ID is required' })
  }

  const doc = await TransportationRequest.findOne({ requestNumber: id }).lean()
  if (!doc) {
    throw createError({ statusCode: 404, message: 'Transportation request not found' })
  }

  return {
    ...doc,
    id: doc.requestNumber
  }
})
