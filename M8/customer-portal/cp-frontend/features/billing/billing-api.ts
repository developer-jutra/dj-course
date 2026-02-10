import { ref, readonly, onMounted } from 'vue'
import { mockCreditInfo, mockInvoices, mockPaymentMethods } from './billing.mocks'
import type { Invoice, PaymentMethod, CreditInfo } from './billing.model'

export async function getCreditInfo(): Promise<CreditInfo> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockCreditInfo
}

export async function getInvoices(): Promise<Invoice[]> {
  await new Promise(resolve => setTimeout(resolve, 600))
  return mockInvoices
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  await new Promise(resolve => setTimeout(resolve, 400))
  return mockPaymentMethods
}

export async function downloadInvoice(invoice: Invoice) {
  // Only run on client side
  if (process.server) return
  
  // Dynamically import PDF generator only on client side
  const { generateInvoicePDF } = await import('~/lib/pdf/invoicePdfGenerator')
  await generateInvoicePDF(invoice)
}

export async function payInvoice(invoiceId: string) {
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log(`Processing payment for invoice: ${invoiceId}`)
}

// Billing composables
export function useBillingInfo() {
  const creditInfoData = ref<CreditInfo | null>(null)
  const invoicesData = ref<Invoice[]>([])
  const paymentMethodsData = ref<PaymentMethod[]>([])
  const isLoading = ref(false)
  const isError = ref(false)

  const fetchCreditInfo = async () => {
    try {
      creditInfoData.value = await getCreditInfo()
    } catch (error) {
      console.error('Error fetching credit info:', error)
    }
  }

  const fetchInvoices = async () => {
    try {
      invoicesData.value = await getInvoices()
    } catch (error) {
      console.error('Error fetching invoices:', error)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      paymentMethodsData.value = await getPaymentMethods()
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    }
  }

  const fetchAll = async () => {
    isLoading.value = true
    isError.value = false
    try {
      await Promise.all([
        fetchCreditInfo(),
        fetchInvoices(),
        fetchPaymentMethods()
      ])
    } catch (error) {
      isError.value = true
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchAll()
  })

  const setDefaultPaymentMethod = async (method: any) => {
    try {
      const updatedMethods = paymentMethodsData.value.map(m => ({
        ...m,
        isDefault: m.id === method.id
      }))
      paymentMethodsData.value = updatedMethods
    } catch (error) {
      console.error('Error setting default payment method:', error)
    }
  }

  return {
    creditInfoQuery: {
      data: readonly(creditInfoData),
      isLoading: readonly(isLoading),
      isError: readonly(isError)
    },
    invoicesQuery: {
      data: readonly(invoicesData),
      isLoading: readonly(isLoading),
      isError: readonly(isError)
    },
    paymentMethodsQuery: {
      data: readonly(paymentMethodsData),
      isLoading: readonly(isLoading),
      isError: readonly(isError)
    },
    setDefaultPaymentMethodMutation: {
      mutate: setDefaultPaymentMethod,
      isPending: readonly(isLoading)
    }
  }
} 