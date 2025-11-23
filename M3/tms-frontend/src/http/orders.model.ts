export interface Order {
  id: number;
  customer: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Canceled' | 'Returned';
  amount: string;
  date: string;
}

export interface IncomingRequest {
  id: string;
  customer: string;
  address: string;
  preferredDate: string;
  cargoType: string;
  mass: string;
  volume: string;
  estimatedCost: string;
  estimatedTime: string;
  distance: string;
  approved: boolean;
  conflicts: boolean;
}

export interface InTransitOrder {
  id: string;
  customer: string;
  driver: string;
  elapsedTime: string;
  distanceCovered: string;
  totalDistance: string;
  delay: boolean;
  estimatedDelay: string | null;
  status: string;
}

export interface DeliveredOrder {
  id: string;
  customer: string;
  deliveredAt: string;
  recipient: string;
  signatureLink: string;
  accepted: boolean;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue' | 'partially paid' | 'cancelled';
  dueDate: string;
  paymentDate: string | null;
  payer: string;
  payee: string;
  currency: string;
  transactionId: string | null;
  invoiceLink: string;
}
