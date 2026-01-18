<template>
  <div class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Live Tracking Map
    </h3>
    <div id="tracking-map" class="h-96 rounded-lg bg-gray-100 dark:bg-gray-700"></div>
    
    <!-- Map Legend -->
    <div class="mt-4 flex flex-wrap gap-4 text-sm">
      <div class="flex items-center">
        <span class="text-lg mr-2">🚛</span>
        <span class="text-gray-600 dark:text-gray-300">Current Position</span>
      </div>
      <div class="flex items-center">
        <span class="text-lg mr-2">📦</span>
        <span class="text-gray-600 dark:text-gray-300">Pickup</span>
      </div>
      <div class="flex items-center">
        <span class="text-lg mr-2">🏁</span>
        <span class="text-gray-600 dark:text-gray-300">Delivery</span>
      </div>
      <div class="flex items-center">
        <span class="text-lg mr-2">⛽</span>
        <span class="text-gray-600 dark:text-gray-300">Refueling</span>
      </div>
      <div class="flex items-center">
        <span class="text-lg mr-2">🛌</span>
        <span class="text-gray-600 dark:text-gray-300">Driver Rest</span>
      </div>
      <div class="flex items-center">
        <span class="text-lg mr-2">🏭</span>
        <span class="text-gray-600 dark:text-gray-300">Warehouse</span>
      </div>
      <div class="flex items-center">
        <span class="text-lg mr-2">🛃</span>
        <span class="text-gray-600 dark:text-gray-300">Customs</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrackingData } from './tracking.model'

interface Props {
  trackingData: TrackingData | null
}

const props = defineProps<Props>()

let map: any = null
let mapInitialized = false

// Watch for tracking data changes to initialize/update map
watch(() => props.trackingData, async (newTracking) => {
  if (newTracking && !mapInitialized) {
    // Wait for DOM to be updated
    await nextTick()
    // Small delay to ensure the map container is fully rendered
    setTimeout(async () => {
      await initializeMap()
      await updateMap()
    }, 100)
  } else if (newTracking && mapInitialized) {
    await updateMap()
  }
}, { immediate: true })

const initializeMap = async () => {
  if (typeof window !== 'undefined') {
    const mapContainer = document.getElementById('tracking-map')
    if (!mapContainer) {
      console.error('Map container not found')
      return
    }

    const L = await import('leaflet')
    
    map = L.map('tracking-map').setView([52.2297, 21.0122], 6)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
    
    mapInitialized = true
  }
}

const updateMap = async () => {
  if (!map || !props.trackingData || !mapInitialized) return
  
  const L = await import('leaflet')
  
  // Clear existing layers
  map.eachLayer((layer: any) => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer)
    }
  })
  
  const tracking = props.trackingData
  
  // Add route polyline
  const routeCoords: [number, number][] = tracking.route.map(point => [point.lat, point.lng])
  L.polyline(routeCoords, { color: '#059669', weight: 4, opacity: 0.7 }).addTo(map)
  
  // Add tracking event markers with enhanced tooltips and circular backgrounds
  tracking.trackingEvents.forEach((event) => {
    let iconHtml = ''
    let backgroundColor = ''
    let borderColor = ''
    let popupContent = ''
    
    switch (event.type) {
      case 'pickup':
        iconHtml = '📦'
        backgroundColor = '#10b981'
        borderColor = '#059669'
        popupContent = `<div class="font-semibold text-green-600 mb-2">✅ Pickup Completed</div>`
        break
      case 'delivery':
        iconHtml = '🏁'
        backgroundColor = event.isCompleted ? '#10b981' : '#3b82f6'
        borderColor = event.isCompleted ? '#059669' : '#2563eb'
        popupContent = event.isCompleted 
          ? `<div class="font-semibold text-green-600 mb-2">✅ Delivery Completed</div>`
          : `<div class="font-semibold text-blue-600 mb-2">📍 Delivery Destination</div>`
        break
      case 'refuel':
        iconHtml = '⛽'
        backgroundColor = event.isCompleted ? '#10b981' : '#3b82f6'
        borderColor = event.isCompleted ? '#059669' : '#2563eb'
        popupContent = event.isCompleted 
          ? `<div class="font-semibold text-green-600 mb-2">✅ Refueling Completed</div>`
          : `<div class="font-semibold text-blue-600 mb-2">⛽ Planned Refuel Stop</div>`
        break
      case 'rest':
        iconHtml = '🛌'
        backgroundColor = event.isCompleted ? '#10b981' : '#3b82f6'
        borderColor = event.isCompleted ? '#059669' : '#2563eb'
        popupContent = event.isCompleted 
          ? `<div class="font-semibold text-green-600 mb-2">✅ Rest Period Completed</div>`
          : `<div class="font-semibold text-blue-600 mb-2">🛌 Planned Rest Stop</div>`
        break
      case 'warehouse':
        iconHtml = '🏭'
        backgroundColor = event.isCompleted ? '#10b981' : '#3b82f6'
        borderColor = event.isCompleted ? '#059669' : '#2563eb'
        popupContent = event.isCompleted 
          ? `<div class="font-semibold text-green-600 mb-2">✅ Transit Completed</div>`
          : `<div class="font-semibold text-blue-600 mb-2">🏭 Transit Hub</div>`
        break
      case 'customs':
        iconHtml = '🛃'
        backgroundColor = event.isCompleted ? '#10b981' : '#3b82f6'
        borderColor = event.isCompleted ? '#059669' : '#2563eb'
        popupContent = event.isCompleted 
          ? `<div class="font-semibold text-green-600 mb-2">✅ Customs Cleared</div>`
          : `<div class="font-semibold text-blue-600 mb-2">🛃 Customs Checkpoint</div>`
        break
      case 'current':
        iconHtml = '🚛'
        backgroundColor = '#f59e0b'
        borderColor = '#d97706'
        popupContent = `<div class="font-semibold text-orange-600 mb-2">🚛 Current Position</div>`
        break
      default:
        iconHtml = '📍'
        backgroundColor = '#6b7280'
        borderColor = '#4b5563'
        popupContent = `<div class="font-semibold text-gray-600 mb-2">📍 ${event.name}</div>`
    }
    
    // Add location and description
    popupContent += `<div class="font-medium text-gray-800 mb-1">${event.name}</div>`
    popupContent += `<div class="text-gray-600 text-sm mb-3">${event.description}</div>`
    
    // Add timing information
    if (event.isCompleted && event.actualTime) {
      popupContent += `<div class="border-t pt-2 mt-2">`
      if (event.estimatedTime) {
        const estimatedDate = new Date(event.estimatedTime)
        const actualDate = new Date(event.actualTime)
        const timeDiff = actualDate.getTime() - estimatedDate.getTime()
        const minutesDiff = Math.round(timeDiff / (1000 * 60))
        
        popupContent += `<div class="text-xs text-gray-500 mb-1">Estimated: ${formatDateTime(event.estimatedTime)}</div>`
        popupContent += `<div class="text-xs font-medium ${minutesDiff <= 0 ? 'text-green-600' : 'text-orange-600'}">
          Actual: ${formatDateTime(event.actualTime)}
          ${minutesDiff !== 0 ? `(${minutesDiff > 0 ? '+' : ''}${minutesDiff} min)` : ' (On time)'}
        </div>`
      } else {
        popupContent += `<div class="text-xs font-medium text-green-600">Completed: ${formatDateTime(event.actualTime)}</div>`
      }
      popupContent += `</div>`
    } else if (!event.isCompleted && event.estimatedTime) {
      popupContent += `<div class="border-t pt-2 mt-2">`
      popupContent += `<div class="text-xs text-blue-600 font-medium">ETA: ${formatDateTime(event.estimatedTime)}</div>`
      popupContent += `</div>`
    }
    
    // Create custom icon with circular background
    const customIcon = L.divIcon({
      html: `
        <div style="
          width: 32px; 
          height: 32px; 
          background-color: ${backgroundColor}; 
          border: 3px solid ${borderColor}; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          ${iconHtml}
        </div>
      `,
      className: 'custom-map-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
    
    L.marker([event.lat, event.lng], { icon: customIcon })
      .bindPopup(popupContent, { maxWidth: 250 })
      .addTo(map)
  })
  
  // Fit map to route bounds
  const bounds = L.latLngBounds(routeCoords as [number, number][])
  map.fitBounds(bounds, { padding: [20, 20] })
}

const formatDateTime = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}
</script>

<style>
.custom-map-marker {
  background: transparent !important;
  border: none !important;
}
</style>
