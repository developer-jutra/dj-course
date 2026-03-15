import { BillingOverview, Invoice } from "../features/billing-payments/billing.model";

export const MOCK_BILLING_OVERVIEW: BillingOverview = {
    totalRevenue: 1250000,
    totalInvoices: 156,
    paidInvoices: 142,
    overdueInvoices: 8,
    avgPaymentTime: 18,
    collectionRate: 94.2,
    avgInvoiceValue: 8012
};

export const MOCK_INVOICES: Invoice[] = [
    {
      id: 1,
      invoiceNumber: 'INV-2025-001',
      contractorId: '6',
      contractorName: 'Ward, Hall and Farley',
      issueDate: new Date('2025-01-01'),
      dueDate: new Date('2025-01-31'),
      amount: 15000,
      status: 'paid',
      items: [],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-15')
    },
    {
      id: 2,
      invoiceNumber: 'INV-2025-002',
      contractorId: '7',
      contractorName: 'Hart and Sons',
      issueDate: new Date('2025-01-05'),
      dueDate: new Date('2025-02-04'),
      amount: 8500,
      status: 'sent',
      items: [],
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-01-05')
    },
    {
      id: 3,
      invoiceNumber: 'INV-2025-003',
      contractorId: '8',
      contractorName: 'Global Logistics',
      issueDate: new Date('2024-12-15'),
      dueDate: new Date('2025-01-14'),
      amount: 12000,
      status: 'overdue',
      items: [],
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 4,
      invoiceNumber: 'INV-2025-004',
      contractorId: '9',
      contractorName: 'Tech Solutions',
      issueDate: new Date('2025-01-10'),
      dueDate: new Date('2025-02-09'),
      amount: 6750,
      status: 'draft',
      items: [],
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-10')
    }
]; 