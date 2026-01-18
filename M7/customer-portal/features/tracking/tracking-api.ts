import { ref, readonly, onMounted } from 'vue'
import { mockTrackingData } from './tracking.mocks'
import type { TrackingData } from './tracking.model'

export async function getTrackingByNumber(trackingNumber: string): Promise<TrackingData | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return mockTrackingData[trackingNumber.trim()] || null
}

export async function getAllTracking(): Promise<Record<string, TrackingData>> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockTrackingData
}

// Tracking composables
export function useTrackingDetails(trackingNumber: string) {
  const data = ref<TrackingData | null>(null)
  const isLoading = ref(false)
  const isError = ref(false)

  const refetch = async () => {
    if (!trackingNumber) return
    
    isLoading.value = true
    isError.value = false
    try {
      data.value = await getTrackingByNumber(trackingNumber)
    } catch (error) {
      isError.value = true
      console.error('Error fetching tracking data:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    isError: readonly(isError),
    refetch
  }
}

export function useActiveTracking() {
  const data = ref<TrackingData[]>([])
  const isLoading = ref(false)
  const isError = ref(false)

  const refetch = async () => {
    isLoading.value = true
    isError.value = false
    try {
      const allTracking = await getAllTracking()
      data.value = Object.values(allTracking)
        .filter(tracking => tracking.status === 'IN_TRANSIT')
        .sort((a, b) => {
          if (!a.estimatedDelivery || !b.estimatedDelivery) return 0
          return new Date(a.estimatedDelivery).getTime() - new Date(b.estimatedDelivery).getTime()
        })
    } catch (error) {
      isError.value = true
      console.error('Error fetching active tracking:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    refetch()
  })

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    isError: readonly(isError),
    refetch
  }
}

export function useTrackingByNumber(trackingNumber: string) {
  const data = ref<TrackingData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchTracking = async () => {
    if (!trackingNumber) return

    isLoading.value = true
    error.value = null

    try {
      data.value = await getTrackingByNumber(trackingNumber)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      console.error('Error fetching tracking:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    isLoading,
    error,
    fetchTracking
  }
}

export function useAllTracking() {
  const data = ref<TrackingData[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchTracking = async () => {
    isLoading.value = true
    error.value = null

    try {
      const allTracking = await getAllTracking()
      data.value = Object.values(allTracking)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      console.error('Error fetching all tracking:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    isLoading,
    error,
    fetchTracking
  }
} 