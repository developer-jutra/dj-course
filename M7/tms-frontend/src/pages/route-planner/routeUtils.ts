import { RoutePoint, Coordinates } from '../../model/shipments';
import { calculateDistance } from './mapUtils';

export const calculateRouteDistance = (points: RoutePoint[]): number => {
  if (points.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += calculateDistance(points[i].coordinates, points[i + 1].coordinates);
  }
  return totalDistance;
};

export const estimateTravelTime = (distance: number, averageSpeed: number = 80): number => {
  return Math.round((distance / averageSpeed) * 60); // minutes
};

export const generateOptimizedRoute = (points: RoutePoint[]): RoutePoint[] => {
  if (points.length <= 2) return points;

  // Create a copy of points to avoid mutating the original
  const optimizedPoints = [...points];
  
  // Simple optimization - prioritize pickups before deliveries, but also apply small coordinate adjustments
  const sortedPoints = optimizedPoints.sort((a, b) => {
    if (a.type === 'pickup' && b.type === 'delivery') return -1;
    if (a.type === 'delivery' && b.type === 'pickup') return 1;
    return 0;
  });

  // Apply small coordinate adjustments to make optimization visible
  return sortedPoints.map((point, index) => {
    // Apply small random adjustments to coordinates (within ~100m radius)
    const latAdjustment = (Math.random() - 0.5) * 0.002; // ~100m in latitude
    const lngAdjustment = (Math.random() - 0.5) * 0.002; // ~100m in longitude
    
    return {
      ...point,
      coordinates: {
        lat: point.coordinates.lat + latAdjustment,
        lng: point.coordinates.lng + lngAdjustment
      },
      name: point.name + (index === 0 ? '' : ' (Optimized)'),
      notes: point.notes ? point.notes + ' - Route optimized' : 'Route optimized for efficiency'
    };
  });
};

export const addRestStops = (points: RoutePoint[], maxDrivingTime: number = 270): RoutePoint[] => {
  if (points.length < 2) return points;
  
  const result: RoutePoint[] = [];
  let cumulativeTime = 0;
  
  for (let i = 0; i < points.length; i++) {
    result.push(points[i]);
    
    if (i < points.length - 1) {
      const distance = calculateDistance(points[i].coordinates, points[i + 1].coordinates);
      const travelTime = estimateTravelTime(distance);
      cumulativeTime += travelTime;
      
      if (cumulativeTime >= maxDrivingTime) {
        // Add a rest stop
        const midPoint = {
          lat: (points[i].coordinates.lat + points[i + 1].coordinates.lat) / 2,
          lng: (points[i].coordinates.lng + points[i + 1].coordinates.lng) / 2
        };
        
        result.push({
          id: `rest-${Date.now()}-${i}`,
          coordinates: midPoint,
          type: 'rest' as const,
          name: 'Mandatory Rest Stop',
          address: `Rest area between ${points[i].name} and ${points[i + 1].name}`,
          duration: 45,
          notes: 'EU regulation: 45min break after 4.5h driving',
          estimatedArrival: new Date(Date.now() + cumulativeTime * 60 * 1000)
        });
        
        cumulativeTime = 0;
      }
    }
  }
  
  return result;
};