import { ensureConnection } from '~/model/connection'
import { WarehousingRequest } from '~/model/WarehousingRequest'

export default defineEventHandler(async (event) => {
  await ensureConnection()

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Request ID is required' })
  }

  const doc = await WarehousingRequest.findOne({ requestNumber: id }).lean()
  if (!doc) {
    throw createError({ statusCode: 404, message: 'Warehousing request not found' })
  }

  return {
    ...doc,
    id: doc.requestNumber
  }
})
