import type { TrackingData, TrackingEvent } from './tracking.model'

interface GeoJSONFeature {
  type: 'Feature'
  geometry: { type: 'Point' | 'LineString'; coordinates: number[] | number[][] }
  properties: Record<string, any>
}

interface TrackingFeatureCollection {
  type: 'FeatureCollection'
  trackingNumber: string
  status: string
  serviceType: string
  origin: string
  destination: string
  estimatedDelivery?: string
  actualDelivery?: string
  updates: Array<{
    id: string
    timestamp: string
    status: string
    location?: string
    description: string
    estimatedTime?: string
    actualTime?: string
  }>
  features: GeoJSONFeature[]
}

function adaptFeatureCollection(fc: TrackingFeatureCollection): TrackingData {
  const routeFeature = fc.features.find(
    f => f.properties.kind === 'route' && f.geometry.type === 'LineString'
  )
  const eventFeatures = fc.features.filter(f => f.properties.kind === 'event')
  const vehicleFeature = fc.features.find(f => f.properties.kind === 'vehicle')

  const route = routeFeature
    ? (routeFeature.geometry.coordinates as number[][]).map((c, i) => ({
        lng: c[0],
        lat: c[1],
        name: routeFeature.properties.waypoints?.[i] ?? ''
      }))
    : []

  const trackingEvents: TrackingEvent[] = eventFeatures.map(f => {
    const [lng, lat] = f.geometry.coordinates as number[]
    return {
      lat,
      lng,
      type: f.properties.type,
      name: f.properties.name,
      description: f.properties.description,
      estimatedTime: f.properties.estimatedTime ?? undefined,
      actualTime: f.properties.actualTime ?? undefined,
      isCompleted: f.properties.isCompleted
    }
  })

  const currentPosition = vehicleFeature
    ? {
        lng: (vehicleFeature.geometry.coordinates as number[])[0],
        lat: (vehicleFeature.geometry.coordinates as number[])[1]
      }
    : { lat: 0, lng: 0 }

  return {
    trackingNumber: fc.trackingNumber,
    status: fc.status,
    serviceType: fc.serviceType,
    origin: fc.origin,
    destination: fc.destination,
    estimatedDelivery: fc.estimatedDelivery,
    actualDelivery: fc.actualDelivery,
    route,
    currentPosition,
    trackingEvents,
    updates: fc.updates.map(u => ({ ...u, timestamp: new Date(u.timestamp) }))
  }
}

export async function getTrackingByNumber(trackingNumber: string): Promise<TrackingData | null> {
  try {
    const fc = await $fetch<TrackingFeatureCollection>(
      `/api/tracking/${encodeURIComponent(trackingNumber)}`
    )
    return adaptFeatureCollection(fc)
  } catch (error: any) {
    if (error?.statusCode === 404 || error?.response?.status === 404) {
      return null
    }
    throw error
  }
}
