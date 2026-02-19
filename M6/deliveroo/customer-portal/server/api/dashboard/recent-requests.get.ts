import { ensureConnection } from '~/model/connection'
import { RecentRequest } from '~/model/RecentRequest'

export default defineEventHandler(async () => {
  await ensureConnection()
  const requests = await RecentRequest.find({})
    .sort({ date: -1 })
    .lean()
  return requests
})
