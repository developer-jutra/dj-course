// Payment
export interface Payment {
  id: number;
  storageRecordId: number;
  contractorId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentDate?: Date;
  externalReference?: string;
  createdAt: Date;
  updatedAt: Date;
} 