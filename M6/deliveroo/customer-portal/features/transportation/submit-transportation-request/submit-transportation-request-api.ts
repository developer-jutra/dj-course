import type { SubmitTransportationRequestForm, SubmitTransportationRequestResponse } from './submit-transportation-request.model'
import { createTransportationRequest } from '../transportation-requests-listing/transportation-requests-api'

export async function submitTransportationRequest(
  data: SubmitTransportationRequestForm
): Promise<SubmitTransportationRequestResponse> {
  return await createTransportationRequest(data as unknown as Record<string, unknown>)
}
