export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contractType: 'full-time' | 'contractor';
  salary: number;
  currency: string;
  licenseNumber: string;
  licenseExpiry: Date;
  hireDate: Date;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'active' | 'on-route' | 'resting' | 'off-duty' | 'sick-leave';
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  routes: DriverRoute[];
  calendarEvents: CalendarEvent[];
}

export interface DriverRoute {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  origin: string;
  destination: string;
  distance: number;
  status: 'completed' | 'active' | 'planned' | 'cancelled';
  points: {
    lat: number;
    lng: number;
    timestamp: Date;
    type: 'start' | 'stop' | 'rest' | 'end';
    name: string;
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'route' | 'rest' | 'sick-leave' | 'vacation' | 'training';
  description?: string;
  routeId?: string;
}