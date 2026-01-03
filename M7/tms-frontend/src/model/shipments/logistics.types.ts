export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RoutePoint {
  id: string;
  coordinates: Coordinates;
  type: 'pickup' | 'delivery' | 'rest' | 'fuel' | 'border';
  name: string;
  address?: string;
  estimatedArrival?: Date;
  estimatedDeparture?: Date;
  notes?: string;
  duration?: number; // minutes
}

export interface Vehicle {
  id: string;
  coordinates: Coordinates;
  heading: number;
  speed: number; // km/h
  driver: string;
  plateNumber: string;
}

export interface RouteData {
  id: string;
  name: string;
  points: RoutePoint[];
  vehicle: Vehicle;
  totalDistance: number; // km
  estimatedDuration: number; // minutes
  status: 'planned' | 'active' | 'completed' | 'delayed';
  startTime?: Date;
  estimatedCompletion?: Date;
}

export interface Shipment {
  id: string;
  name: string;
  customer: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  route: RouteData;
  createdAt: Date;
  dueDate?: Date;
}