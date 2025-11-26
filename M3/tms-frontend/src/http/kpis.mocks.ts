import { KPIs, KPIWidget } from "./kpis.model";

export const mockKPIs: KPIs = {
  ordersToday: 32,
  revenue: 1825,
  completionRate: 96,
  activeShipments: 24,
};

export const mockKPIWidgets: KPIWidget[] = [
  {
    title: 'Perfect Order Rate',
    value: '94.2%',
    description: 'Orders completed without errors, delays, or damage',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    trend: '+2.1%',
  },
  {
    title: 'Order Accuracy Rate',
    value: '97.8%',
    description: 'Orders fulfilled exactly as requested',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    trend: '+0.5%',
  },
  {
    title: 'Cost Per Delivery',
    value: '$12.45',
    description: 'Average total cost per delivery',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    trend: '-$0.23',
  },
  {
    title: 'On-Time Delivery Rate',
    value: '89.5%',
    description: 'Deliveries within promised window',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    trend: '+1.2%',
  },
  {
    title: 'Vehicle Utilization Rate',
    value: '78.3%',
    description: 'Time vehicles are actively transporting',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    trend: '+3.4%',
  },
];
