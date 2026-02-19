import type { SubmitWarehousingRequestForm, SubmitWarehousingRequestResponse } from './submit-warehousing-request.model'
import { createWarehousingRequest } from '../warehousing-requests-listing/warehousing-requests-api'

export async function submitWarehousingRequest(
  data: SubmitWarehousingRequestForm
): Promise<SubmitWarehousingRequestResponse> {
  return await createWarehousingRequest(data as unknown as Record<string, unknown>)
}
