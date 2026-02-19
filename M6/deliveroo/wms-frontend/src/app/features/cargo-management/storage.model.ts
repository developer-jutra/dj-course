import { CargoEventHistory } from './cargo.model';
import { Payment } from '../billing-payments/payment.model';

// Storage Record
export interface StorageRecord {
  id: number;
  requestId: number;
  contractorId: number;
  shelfId: number;
  shelfLocation: string;
  actualEntryDate: Date;
  actualExitDate?: Date;
  cargoDescription: string;
  cargoWeight: number;
  cargoVolume: number;
  events: CargoEventHistory[];
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
} 