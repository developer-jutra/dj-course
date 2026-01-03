// Types
export interface Expense {
  id: string;
  date: string;
  expenseType: string;
  category: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  transporter: string;
  vehicle: string;
  trip: string;
  odometer: number;
  notes: string;
  vendor: string;
  invoiceNumber: string;
  paymentDueDate: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partially Paid';
  recurrence: boolean;
  attachments: string[];
}
