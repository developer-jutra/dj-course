<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Billing & Payments
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage your billing information and payment history
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="card p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading billing information...</p>
    </div>

    <template v-else>
      <!-- Credit Overview -->
      <div class="mb-8">
        <BillingStats :credit-info="creditInfo" :payment-terms="paymentTerms" />
      </div>

      <!-- Credit Usage Chart -->
      <div class="mb-8">
        <CreditUsageChart :credit-info="creditInfo" />
      </div>

      <!-- Recent Invoices -->
      <div class="mb-8">
        <InvoicesTable 
          :invoices="invoices" 
          @download-invoice="handleDownload"
          @pay-invoice="handlePayment"
          @export-all="exportAll"
        />
      </div>

      <!-- Payment Methods -->
      <PaymentMethods 
        :payment-methods="paymentMethods"
        @set-default-payment-method="setDefaultPaymentMethod"
        @remove-payment-method="removePaymentMethod"
        @add-payment-method="addPaymentMethod"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { 
  getCreditInfo, 
  getInvoices, 
  getPaymentMethods, 
  downloadInvoice, 
  payInvoice 
} from './billing-api'
import type { Invoice, PaymentMethod, CreditInfo } from './billing.model'
import BillingStats from './BillingStats.vue'
import CreditUsageChart from './CreditUsageChart.vue'
import InvoicesTable from './InvoicesTable.vue'
import PaymentMethods from './PaymentMethods.vue'

const paymentTerms = ref('30 days')

// State management
const creditInfo = ref<CreditInfo>({ limit: 0, used: 0 })
const invoices = ref<Invoice[]>([])
const paymentMethods = ref<PaymentMethod[]>([])
const isLoading = ref(false)
const isError = ref(false)

const loadBillingInfo = async () => {
  isLoading.value = true
  isError.value = false
  
  try {
    const results = await Promise.all([
      getCreditInfo(),
      getInvoices(),
      getPaymentMethods()
    ])
    
    creditInfo.value = results[0]
    invoices.value = results[1]
    paymentMethods.value = results[2]
  } catch (error) {
    isError.value = true
    console.error('Error fetching billing information:', error)
  } finally {
    isLoading.value = false
  }
}

// Load billing info on mount
onMounted(() => {
  loadBillingInfo()
})

// Payment method handlers
const setDefaultPaymentMethod = async (method: PaymentMethod) => {
  try {
    // Update local state immediately for better UX
    paymentMethods.value = paymentMethods.value.map(m => ({
      ...m,
      isDefault: m.id === method.id
    }))
    
    // In a real app, you'd make an API call here
    console.log('Setting default payment method:', method.id)
  } catch (error) {
    console.error('Error setting default payment method:', error)
    // Revert on error
    await loadBillingInfo()
  }
}

const removePaymentMethod = async (method: PaymentMethod) => {
  if (confirm('Are you sure you want to remove this payment method?')) {
    try {
      // Remove from local state immediately for better UX
      paymentMethods.value = paymentMethods.value.filter(m => m.id !== method.id)
      
      // In a real app, you'd make an API call here
      console.log('Removing payment method:', method.id)
    } catch (error) {
      console.error('Error removing payment method:', error)
      // Revert on error
      await loadBillingInfo()
    }
  }
}

const addPaymentMethod = () => {
  console.log('Add payment method')
  // In a real app, you'd open a modal or redirect to add payment method
}

// Invoice handlers
const handleDownload = async (invoice: Invoice) => {
  try {
    await downloadInvoice(invoice)
  } catch (error) {
    console.error('Error downloading invoice:', error)
  }
}

const handlePayment = async (invoice: Invoice) => {
  try {
    await payInvoice(invoice.id)
  } catch (error) {
    console.error('Error processing payment:', error)
  }
}

const exportAll = () => {
  console.log('Exporting all invoices')
  // In a real app, you'd download all invoices
}
</script>
