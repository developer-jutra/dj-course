import { OrderEvent } from "./order-events.model";

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
