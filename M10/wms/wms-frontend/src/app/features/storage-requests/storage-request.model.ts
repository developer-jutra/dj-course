import { StorageReservation } from '../../features/reservations/reservation.model';

// Storage Request
export interface StorageRequest {
  id: number;
  contractorId: string;
  contractorName: string;
  warehouseId: number;
  requestedEntryDate: Date;
  requestedExitDate: Date;
  status: 'pending' | 'accepted' | 'rejected';
  decisionEmployeeId?: number;
  decisionEmployeeName?: string;
  decisionDate?: Date;
  cargoDetails: CargoDetails;
  reservations: StorageReservation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CargoDetails {
  description: string;
  weight: number;
  volume: number;
  requiresRefrigeration: boolean;
  requiresFreezing: boolean;
  isHazardous: boolean;
  hazardousClassification?: string;
  specialHandlingInstructions?: string;
  containsPerishables: boolean;
  estimatedValue?: number;
  currency?: string;
} 