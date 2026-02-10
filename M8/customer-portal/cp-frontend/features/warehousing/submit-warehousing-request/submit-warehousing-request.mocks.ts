import type { SubmitWarehousingRequestResponse } from './submit-warehousing-request.model'

export const mockSubmitWarehousingRequestResponse: SubmitWarehousingRequestResponse = {
  success: true,
  message: 'Warehousing request submitted successfully',
  requestNumber: `WH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
} 