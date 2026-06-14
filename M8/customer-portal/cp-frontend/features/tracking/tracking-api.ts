import type { TrackingData } from './tracking.model'

export async function getTrackingByNumber(trackingNumber: string): Promise<TrackingData | null> {
  try {
    const data = await $fetch<TrackingData>(`/api/tracking/${encodeURIComponent(trackingNumber)}`)
    return {
      ...data,
      updates: data.updates.map(u => ({ ...u, timestamp: new Date(u.timestamp) }))
    }
  } catch (error: any) {
    if (error?.statusCode === 404 || error?.response?.status === 404) {
      return null
    }
    throw error
  }
}
