import { Order, OrderEvent } from '@/http/orders.model';
import { IncomingRequest, InTransitOrder, DeliveredOrder, Payment } from './orders.model';

export const mockOrders: Order[] = [
  { id: 1, customer: 'Jan Kowalski', status: 'Processing', amount: '$1,250', date: '2024-06-06' },
  { id: 2, customer: 'Anna Nowak', status: 'Shipped', amount: '$890', date: '2024-06-05' },
  { id: 3, customer: 'Piotr Wiśniewski', status: 'Delivered', amount: '$2,100', date: '2024-06-04' },
  { id: 4, customer: 'Magdalena Dąbrowska', status: 'Canceled', amount: '$450', date: '2024-06-03' },
  { id: 5, customer: 'Jakub Lewandowski', status: 'Returned', amount: '$1,600', date: '2024-06-02' },
  { id: 6, customer: 'Katarzyna Zielińska', status: 'Processing', amount: '$3,750', date: '2024-06-06' },
  { id: 7, customer: 'Tomasz Szymański', status: 'Shipped', amount: '$925', date: '2024-06-05' },
  { id: 8, customer: 'Monika Woźniak', status: 'Delivered', amount: '$1,340', date: '2024-06-04' },
  { id: 9, customer: 'Marcin Kozłowski', status: 'Processing', amount: '$2,680', date: '2024-06-03' },
  { id: 10, customer: 'Agnieszka Jankowska', status: 'Shipped', amount: '$815', date: '2024-06-02' },
  { id: 11, customer: 'Paweł Mazur', status: 'Delivered', amount: '$1,980', date: '2024-06-01' },
  { id: 12, customer: 'Beata Krawczyk', status: 'Canceled', amount: '$520', date: '2024-05-31' },
  { id: 13, customer: 'Krzysztof Adamczyk', status: 'Processing', amount: '$4,200', date: '2024-05-30' },
  { id: 14, customer: 'Ewa Jankowiak', status: 'Returned', amount: '$1,125', date: '2024-05-29' },
  { id: 15, customer: 'Bartosz Wójcik', status: 'Delivered', amount: '$2,850', date: '2024-05-28' },
];

export const mockIncomingRequests: IncomingRequest[] = [
  {
    id: 'REQ001',
    customer: 'ABC Corp',
    address: '123 Main St, New York, NY',
    preferredDate: '2024-01-25',
    cargoType: 'Electronics',
    mass: '500 kg',
    volume: '2.5 m³',
    estimatedCost: '$450',
    estimatedTime: '4 hours',
    distance: '120 km',
    approved: false,
    conflicts: false,
  },
  {
    id: 'REQ002',
    customer: 'XYZ Ltd',
    address: '456 Oak Ave, Boston, MA',
    preferredDate: '2024-01-26',
    cargoType: 'Furniture',
    mass: '800 kg',
    volume: '5.0 m³',
    estimatedCost: '$650',
    estimatedTime: '6 hours',
    distance: '180 km',
    approved: true,
    conflicts: true,
  },
];

export const mockInTransitOrders: InTransitOrder[] = [
  {
    id: 'SH001',
    customer: 'Tech Solutions Inc',
    driver: 'Mike Johnson',
    elapsedTime: '2h 30m',
    distanceCovered: '85 km',
    totalDistance: '150 km',
    delay: false,
    estimatedDelay: null,
    status: 'On Schedule',
  },
  {
    id: 'SH002',
    customer: 'Global Trading Co',
    driver: 'Sarah Lee',
    elapsedTime: '4h 15m',
    distanceCovered: '120 km',
    totalDistance: '200 km',
    delay: true,
    estimatedDelay: '45 minutes',
    status: 'Delayed',
  },
];

export const mockDeliveredOrders: DeliveredOrder[] = [
  {
    id: 'DL001',
    customer: 'Retail Store',
    deliveredAt: '2024-01-20 14:30',
    recipient: 'John Smith',
    signatureLink: 'http://signatures.deliveroo.com/DL001',
    accepted: true,
  },
  {
    id: 'DL002',
    customer: 'Office Supplies Co',
    deliveredAt: '2024-01-21 09:15',
    recipient: 'Mary Johnson',
    signatureLink: 'http://signatures.deliveroo.com/DL002',
    accepted: true,
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY001',
    orderId: 'ORD001',
    amount: '$1,250',
    status: 'paid',
    dueDate: '2024-01-15',
    paymentDate: '2024-01-14',
    payer: 'ABC Corp',
    payee: 'Deliveroo LLC',
    currency: 'USD',
    transactionId: 'TXN123456',
    invoiceLink: 'http://invoicing.deliveroo.com/invoice/PAY001',
  },
  {
    id: 'PAY002',
    orderId: 'ORD002',
    amount: '$850',
    status: 'overdue',
    dueDate: '2024-01-10',
    paymentDate: null,
    payer: 'XYZ Ltd',
    payee: 'Deliveroo LLC',
    currency: 'USD',
    transactionId: null,
    invoiceLink: 'http://invoicing.deliveroo.com/invoice/PAY002',
  },
];

export const mockOrderEvents: OrderEvent[] = [
  {
    id: 1,
    status: 'Order Created',
    timestamp: '2024-06-06 10:00:00',
    description: 'Order placed by customer',
    employee: 'System',
    details: 'Initial order creation and validation'
  },
  {
    id: 2,
    status: 'Payment Confirmed',
    timestamp: '2024-06-06 10:15:00',
    description: 'Payment successfully processed',
    employee: 'Payment System',
    details: 'Credit card payment of $1,250 processed'
  },
  {
    id: 3,
    status: 'Order Approved',
    timestamp: '2024-06-06 11:30:00',
    description: 'Order approved for processing',
    employee: 'Sarah Johnson',
    details: 'Order review completed and approved for shipment preparation'
  },
  {
    id: 4,
    status: 'Preparing Shipment',
    timestamp: '2024-06-06 14:20:00',
    description: 'Shipment preparation started',
    employee: 'Mike Wilson',
    details: 'Items picked from warehouse and packaging initiated'
  },
  {
    id: 5,
    status: 'Ready for Pickup',
    timestamp: '2024-06-06 16:45:00',
    description: 'Package ready for carrier pickup',
    employee: 'David Chen',
    details: 'Final quality check completed, package sealed and labeled'
  }
];