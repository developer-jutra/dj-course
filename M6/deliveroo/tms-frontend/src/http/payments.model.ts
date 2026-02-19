export interface Payment {
  id: string;
  amount: string;
  status: 'Paid' | 'Pending';
  date: string;
  method: 'Bank Transfer' | 'Credit Card' | 'Check';
  invoice: string;
}