export interface TrackingEvent {
  lat: number;
  lng: number;
  type: 'pickup' | 'delivery' | 'refuel' | 'rest' | 'warehouse' | 'customs' | 'current';
  name: string;
  description: string;
  estimatedTime?: string; // ISO string for planned events
  actualTime?: string; // ISO string for completed events
  isCompleted: boolean;
}

export interface TrackingUpdate {
  id: string;
  timestamp: Date;
  status: string;
  location?: string;
  description: string;
  estimatedTime?: Date | string; // Enhanced to support both Date and string
  actualTime?: Date | string; // Enhanced to support both Date and string
}

export interface TrackingData {
  trackingNumber: string;
  status: string;
  serviceType: string;
  origin: string;
  destination: string;
  route: Array<{ lat: number; lng: number; name: string }>;
  currentPosition: { lat: number; lng: number };
  trackingEvents: TrackingEvent[];
  updates: TrackingUpdate[];
  estimatedDelivery?: string;
  actualDelivery?: string;
} 