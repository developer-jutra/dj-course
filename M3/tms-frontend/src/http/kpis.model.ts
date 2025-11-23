export interface KPIs {
  ordersToday: number;
  revenue: number;
  completionRate: number;
  activeShipments: number;
}

export interface KPIWidget {
  title: string;
  value: string;
  description: string;
  color: string;
  bgColor: string;
  trend: string;
}
