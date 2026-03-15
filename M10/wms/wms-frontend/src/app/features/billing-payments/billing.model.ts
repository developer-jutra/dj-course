export interface BillingOverview {
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  avgPaymentTime: number;
  collectionRate: number;
  avgInvoiceValue: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  contractorId: string;
  contractorName: string;
  issueDate: Date;
  dueDate: Date;
  amount: number;
  status: 'paid' | 'sent' | 'overdue' | 'draft';
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Payment {
  id: number;
  invoiceId: number;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  transactionId?: string;
}