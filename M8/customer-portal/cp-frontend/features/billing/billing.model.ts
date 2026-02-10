export interface Invoice {
  id: string;
  number: string;
  description: string;
  date: Date;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  dueDate: Date;
}

export interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export interface CreditInfo {
  limit: number;
  used: number;
} 