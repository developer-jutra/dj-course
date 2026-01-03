import { Payment } from './payments.model';

export const mockPayments: Payment[] = [
  { id: 'PAY001', amount: '$2,500', status: 'Paid', date: '2024-06-06', method: 'Bank Transfer', invoice: 'INV-001' },
  { id: 'PAY002', amount: '$1,800', status: 'Pending', date: '2024-06-05', method: 'Credit Card', invoice: 'INV-002' },
  { id: 'PAY003', amount: '$3,200', status: 'Paid', date: '2024-06-04', method: 'Check', invoice: 'INV-003' },
  { id: 'PAY004', amount: '$4,750', status: 'Paid', date: '2024-06-03', method: 'Bank Transfer', invoice: 'INV-004' },
  { id: 'PAY005', amount: '$925', status: 'Pending', date: '2024-06-02', method: 'Credit Card', invoice: 'INV-005' },
  { id: 'PAY006', amount: '$1,340', status: 'Paid', date: '2024-06-01', method: 'Check', invoice: 'INV-006' },
  { id: 'PAY007', amount: '$6,200', status: 'Paid', date: '2024-05-31', method: 'Bank Transfer', invoice: 'INV-007' },
  { id: 'PAY008', amount: '$2,680', status: 'Pending', date: '2024-05-30', method: 'Credit Card', invoice: 'INV-008' },
  { id: 'PAY009', amount: '$815', status: 'Paid', date: '2024-05-29', method: 'Bank Transfer', invoice: 'INV-009' },
  { id: 'PAY010', amount: '$1,980', status: 'Pending', date: '2024-05-28', method: 'Check', invoice: 'INV-010' },
  { id: 'PAY011', amount: '$3,450', status: 'Paid', date: '2024-05-27', method: 'Credit Card', invoice: 'INV-011' },
  { id: 'PAY012', amount: '$5,125', status: 'Paid', date: '2024-05-26', method: 'Bank Transfer', invoice: 'INV-012' },
];