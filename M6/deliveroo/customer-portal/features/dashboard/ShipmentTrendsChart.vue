<template>
  <div class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Shipment Trends
    </h3>
    <div class="h-64">
      <Line
        :data="shipmentTrendsData"
        :options="shipmentTrendsOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

// Shipment Trends Chart Data
const shipmentTrendsData = computed(() => {
  const colorMode = useColorMode()
  const isDark = colorMode.value === 'dark'
  
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Transportation',
        data: [42, 38, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
        borderColor: '#2563eb', // primary-600
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Warehousing',
        data: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
        borderColor: '#16a34a', // success-600
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

// Shipment Trends Chart Options
const shipmentTrendsOptions = computed(() => {
  const colorMode = useColorMode()
  const isDark = colorMode.value === 'dark'
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDark ? '#d1d5db' : '#4b5563'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDark ? '#d1d5db' : '#4b5563'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#d1d5db' : '#4b5563',
          usePointStyle: true,
          pointStyle: 'circle'
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
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw} shipments`
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