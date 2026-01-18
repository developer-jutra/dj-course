import { InvoiceItem } from '../features/billing-payments/billing.model';

export const MOCK_INVOICE_ITEMS: InvoiceItem[] = [
  {
    id: 1,
    description: 'Storage Services - Zone A (January 2025)',
    quantity: 1,
    unitPrice: 12000,
    totalPrice: 12000
  },
  {
    id: 2,
    description: 'Handling Services - Cargo Processing',
    quantity: 5,
    unitPrice: 500,
    totalPrice: 2500
  },
  {
    id: 3,
    description: 'Additional Security Services',
    quantity: 1,
    unitPrice: 300,
    totalPrice: 300
  }
]; 