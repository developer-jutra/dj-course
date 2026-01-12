import type { Invoice, PaymentMethod, CreditInfo } from './billing.model'

export const mockCreditInfo: CreditInfo = {
  limit: 50000,
  used: 15000
}

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    description: 'Transportation services - January',
    date: new Date('2024-01-31'),
    amount: 2500,
    status: 'Paid',
    dueDate: new Date('2024-02-29')
  },
  {
    id: '2',
    number: 'INV-2024-002',
    description: 'Warehousing services - February',
    date: new Date('2024-02-29'),
    amount: 1800,
    status: 'Unpaid',
    dueDate: new Date('2024-03-30')
  },
  {
    id: '3',
    number: 'INV-2024-003',
    description: 'Express delivery services',
    date: new Date('2024-03-15'),
    amount: 750,
    status: 'Overdue',
    dueDate: new Date('2024-03-20')
  }
]

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'Visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2025',
    isDefault: true
  },
  {
    id: '2',
    type: 'Mastercard',
    last4: '8888',
    expiryMonth: '06',
    expiryYear: '2026',
    isDefault: false
  }
] 