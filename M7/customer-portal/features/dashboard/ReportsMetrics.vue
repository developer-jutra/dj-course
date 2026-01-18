<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <TruckIcon class="h-8 w-8 text-blue-600" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              Total Shipments
            </dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ metrics.totalShipments }}
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <CheckCircleIcon class="h-8 w-8 text-green-600" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              On-Time Delivery
            </dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ metrics.onTimeDelivery }}%
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <CurrencyEuroIcon class="h-8 w-8 text-yellow-600" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              Total Cost
            </dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">
              €{{ metrics.totalCost.toLocaleString() }}
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <BuildingStorefrontIcon class="h-8 w-8 text-purple-600" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              Storage Volume
            </dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ metrics.storageVolume }} m³
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  TruckIcon,
  CheckCircleIcon,
  CurrencyEuroIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline'
import type { Metrics } from './dashboard.model'

interface Props {
  metrics: Metrics
}

defineProps<Props>()
</script> 