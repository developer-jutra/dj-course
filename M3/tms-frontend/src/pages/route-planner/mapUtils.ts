import L from 'leaflet';
import { Coordinates, RoutePoint } from '../model/shipments';

export const defaultMapCenter: Coordinates = { lat: 52.520008, lng: 13.404954 }; // Berlin
export const defaultZoom = 6;

export const createCustomIcon = (type: string, color: string): L.DivIcon => {
  const iconMap: Record<string, string> = {
    pickup: '📦',
    delivery: '🏭',
    rest: '🛏️',
    fuel: '⛽',
    border: '🛂',
    truck: '🚛'
  };

  return L.divIcon({
    html: `
      <div class="custom-marker" style="background-color: ${color};">
        <span class="marker-icon">${iconMap[type] || '📍'}</span>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getPointColor = (type: RoutePoint['type']): string => {
  const colors = {
    pickup: '#10B981',
    delivery: '#F59E0B',
    rest: '#8B5CF6',
    fuel: '#EF4444',
    border: '#6B7280'
  };
  return colors[type];
};

export const formatCoordinates = (coords: Coordinates): string => {
  return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
};