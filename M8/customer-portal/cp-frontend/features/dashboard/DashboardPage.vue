<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Welcome back, {{ authStore.user?.firstName }}! Here's what's happening with your logistics.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="mb-8">
      <DashboardStats />
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <QuickActions />
    </div>

    <!-- Recent Requests -->
    <div class="mb-8">
      <YourRequests />
    </div>

    <!-- Active Deliveries -->
    <div class="mb-8">
      <ActiveDeliveries />
    </div>

    <!-- Reports & Analytics Section -->
    <div class="mb-8">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Reports & Analytics
      </h2>
      
      <!-- Date Range Filter -->
      <ReportsDateFilter 
        :date-range="dateRange"
        :is-loading="isLoading"
        @update:date-range="dateRange = $event"
        @update:is-loading="isLoading = $event"
      />

      <!-- Key Metrics -->
      <ReportsMetrics v-if="metrics" :metrics="metrics" />

      <!-- Charts Section -->
      <div v-if="metrics" class="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <ShipmentTrendsChart />
        <CostBreakdownChart :metrics="metrics" />
      </div>

      <!-- Performance Table -->
      <RoutePerformanceTable v-if="routePerformance" :route-performance="routePerformance" />

      <!-- Export Options -->
      <ReportsExport />
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardStats from './DashboardStats.vue'
import QuickActions from './QuickActions.vue'
import YourRequests from './YourRequests.vue'
import ActiveDeliveries from './ActiveDeliveries.vue'
import ReportsDateFilter from './ReportsDateFilter.vue'
import ReportsMetrics from './ReportsMetrics.vue'
import ShipmentTrendsChart from './ShipmentTrendsChart.vue'
import CostBreakdownChart from './CostBreakdownChart.vue'
import RoutePerformanceTable from './RoutePerformanceTable.vue'
import ReportsExport from './ReportsExport.vue'

const authStore = useAuthStore()

// Reports data
const dateRange = reactive({
  from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  to: new Date().toISOString().split('T')[0]
})

// Fetch data from MongoDB
const { data: metrics, pending: metricsLoading } = await useFetch('/api/dashboard/metrics')
const { data: routePerformance, pending: routePerformanceLoading } = await useFetch('/api/dashboard/route-performance')

const isLoading = computed(() => metricsLoading.value || routePerformanceLoading.value)
</script>
