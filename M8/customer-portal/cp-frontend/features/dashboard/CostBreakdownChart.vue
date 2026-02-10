<template>
  <div class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Cost Breakdown
    </h3>
    <div class="h-64">
      <Doughnut
        :data="costBreakdownData"
        :options="costBreakdownOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { Metrics } from './dashboard.model'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  metrics: Metrics
}

const props = defineProps<Props>()

// Cost Breakdown Chart Data
const costBreakdownData = computed(() => {
  const colorMode = useColorMode()
  const isDark = colorMode.value === 'dark'
  
  return {
    labels: ['Transportation', 'Warehousing', 'Customs', 'Insurance', 'Handling'],
    datasets: [
      {
        data: [45, 25, 10, 12, 8],
        backgroundColor: [
          '#2563eb', // primary-600
          '#16a34a', // success-600
          '#ea580c', // accent-600
          '#9333ea', // purple-600
          '#0d9488', // secondary-600
        ],
        borderColor: isDark ? '#1f2937' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 15
      }
    ]
  }
})

// Cost Breakdown Chart Options
const costBreakdownOptions = computed(() => {
  const colorMode = useColorMode()
  const isDark = colorMode.value === 'dark'
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: isDark ? '#d1d5db' : '#4b5563',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#4b5563',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}% (€${(props.metrics.totalCost * context.raw / 100).toLocaleString()})`
          }
        }
      }
    }
  }
})

// Watch for color mode changes to update charts
const colorMode = useColorMode()
watch(colorMode, () => {
  // Force chart re-render by triggering a reactive update
  nextTick()
})
</script> 