<template>
  <div class="card">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">
        Recent Invoices
      </h2>
      <button @click="exportAll" class="btn-outline">
        <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
        Export All
      </button>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Invoice
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Amount
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Due Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="invoice in invoices"
            :key="invoice.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ invoice.number }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ invoice.description }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ formatDate(invoice.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              €{{ invoice.amount.toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getInvoiceStatusColor(invoice.status)
                ]"
              >
                {{ invoice.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ formatDate(invoice.dueDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-3">
                <button
                  @click="downloadInvoice(invoice)"
                  class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <DocumentArrowDownIcon class="w-5 h-5 mr-1" />
                  <span>Download</span>
                </button>
                <button
                  v-if="invoice.status === 'Unpaid'"
                  @click="payInvoice(invoice)"
                  class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <CreditCardIcon class="w-5 h-5 mr-1" />
                  <span>Pay Now</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DocumentArrowDownIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline'
import type { Invoice } from './billing.model'

defineProps<{
  invoices: Invoice[]
}>()

const emit = defineEmits<{
  downloadInvoice: [invoice: Invoice]
  payInvoice: [invoice: Invoice]
  exportAll: []
}>()

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const getInvoiceStatusColor = (status: string) => {
  const colors = {
    'Paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Unpaid': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Overdue': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const downloadInvoice = (invoice: Invoice) => {
  emit('downloadInvoice', invoice)
}

const payInvoice = (invoice: Invoice) => {
  emit('payInvoice', invoice)
}

const exportAll = () => {
  emit('exportAll')
}
</script> 