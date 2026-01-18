<template>
  <div class="card p-6">
    <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Credit Usage
    </h2>
    <div class="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
      <div
        class="bg-primary-600 h-4 rounded-full transition-all duration-300"
        :style="{ width: `${usagePercentage}%` }"
      ></div>
    </div>
    <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
      <span>€0</span>
      <span>€{{ creditInfo.limit.toLocaleString() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreditInfo } from './billing.model'

const props = defineProps<{
  creditInfo: CreditInfo
}>()

const usagePercentage = computed(() => {
  return Math.round((props.creditInfo.used / props.creditInfo.limit) * 100)
})
</script> 