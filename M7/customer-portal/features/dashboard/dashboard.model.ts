export interface DashboardStat {
  name: string;
  value: string;
  icon: any; // Vue component
  color: string;
}

export interface QuickAction {
  name: string;
  description: string;
  icon: any; // Vue component
  href: string;
}

export interface RecentRequest {
  id: string;
  type: string;
  status: string;
  route: string;
  date: Date;
}

export interface RoutePerformance {
  route: string;
  shipments: number;
  onTimePercentage: number;
  avgCost: number;
  totalRevenue: number;
}

export interface Metrics {
  totalShipments: number;
  onTimeDelivery: number;
  totalCost: number;
  storageVolume: number;
} 