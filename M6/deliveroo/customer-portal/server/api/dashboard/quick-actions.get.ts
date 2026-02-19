import { ensureConnection } from '~/model/connection'
import { QuickAction } from '~/model/QuickAction'

export default defineEventHandler(async () => {
  await ensureConnection()
  const actions = await QuickAction.find({}).lean()
  return actions
})
