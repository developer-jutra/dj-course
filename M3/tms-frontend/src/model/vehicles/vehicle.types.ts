export interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  type: 'standard' | 'tir' | 'refrigerated' | 'hazmat' | 'container' | 'tanker' | 'flatbed' | 'box-truck' | 'heavy-haul';
  status: 'available' | 'in-transit' | 'maintenance' | 'out-of-service';
  mileage: number;
  capacity: {
    weight: number; // tons
    volume: number; // cubic meters
  };
  cargoTypes: string[];
  currentDriver?: string;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  ownership: {
    type: 'owned' | 'leased' | 'rented' | 'financed';
    purchaseDate?: Date;
    purchasePrice?: number;
    leaseStart?: Date;
    leaseEnd?: Date;
    rentalStart?: Date;
    rentalEnd?: Date;
    loanStart?: Date;
    loanEnd?: Date;
    monthlyPayment?: number;
    leasingCompany?: string;
    rentalCompany?: string;
    bank?: string;
    loanAmount?: number;
  };
  documents: VehicleDocument[];
  maintenanceHistory: MaintenanceRecord[];
  maintenanceTasks: MaintenanceTask[];
}

export interface VehicleDocument {
  id: string;
  type: 'registration' | 'insurance' | 'inspection' | 'tir-carnet' | 'adr' | 'hazmat-permit' | 'other';
  number: string;
  issueDate: Date;
  expiryDate?: Date;
  issuingAuthority: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'routine' | 'repair' | 'inspection' | 'emergency';
  description: string;
  cost: number;
  mileage: number;
  duration: number; // hours
  serviceProvider: string;
  technician: string;
  status: 'completed' | 'in-progress' | 'pending' | 'cancelled';
  notes?: string;
}

export interface MaintenanceTask {
  id: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'overdue' | 'completed' | 'in-progress';
  type: 'routine' | 'repair' | 'inspection' | 'emergency';
  dueDate: string;
  estimatedCost: number;
  estimatedDuration: number; // in hours
  assignedTo?: string;
  notes?: string;
}