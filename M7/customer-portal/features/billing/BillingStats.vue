<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <CreditCardIcon class="h-8 w-8 text-primary-600" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              Credit Limit
            </dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">
              €{{ creditInfo.limit.toLocaleString() }}
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <BanknotesIcon class="h-8 w-8 text-green-600" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              Available Credit
            </dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">
              €{{ (creditInfo.limit - creditInfo.used).toLocaleString() }}
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-8 w-8 text-yellow-600" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              Outstanding Balance
            </dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">
              €{{ creditInfo.used.toLocaleString() }}
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <CalendarDaysIcon class="h-8 w-8 text-blue-600" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              Payment Terms
            </dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ paymentTerms }}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CreditCardIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon
} from '@heroicons/vue/24/outline'
import type { CreditInfo } from './billing.model'

defineProps<{
  creditInfo: CreditInfo
  paymentTerms: string
}>()
</script> 