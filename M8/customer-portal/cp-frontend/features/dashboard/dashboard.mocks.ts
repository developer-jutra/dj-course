import type { DashboardStat, QuickAction, RecentRequest, RoutePerformance, Metrics } from './dashboard.model'
import {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  MapIcon
} from '@heroicons/vue/24/outline'

export const mockDashboardStats: DashboardStat[] = [
  {
    name: 'Active Shipments',
    value: '12',
    icon: TruckIcon,
    color: 'text-blue-600'
  },
  {
    name: 'Stored Items',
    value: '45',
    icon: BuildingStorefrontIcon,
    color: 'text-green-600'
  },
  {
    name: 'Pending Requests',
    value: '3',
    icon: ClockIcon,
    color: 'text-yellow-600'
  },
  {
    name: 'Completed This Month',
    value: '28',
    icon: CheckCircleIcon,
    color: 'text-purple-600'
  }
]

export const mockQuickActions: QuickAction[] = [
  {
    name: 'New Transportation Request',
    description: 'Book a new shipment',
    icon: TruckIcon,
    href: '/dashboard/transportation/new'
  },
  {
    name: 'New Warehousing Request',
    description: 'Request storage space',
    icon: BuildingStorefrontIcon,
    href: '/dashboard/warehousing/new'
  },
  {
    name: 'Track Shipment',
    description: 'Check shipment status',
    icon: MapIcon,
    href: '/dashboard/tracking'
  }
]

export const mockRecentRequests: RecentRequest[] = [
  {
    id: 'TR-2024-001',
    type: 'Transportation',
    status: 'In Transit',
    route: 'Warsaw → Berlin',
    date: new Date('2024-01-15')
  },
  {
    id: 'WH-2024-002',
    type: 'Warehousing',
    status: 'Stored',
    route: 'Krakow Warehouse',
    date: new Date('2024-01-14')
  },
  {
    id: 'TR-2024-003',
    type: 'Transportation',
    status: 'Delivered',
    route: 'Gdansk → Hamburg',
    date: new Date('2024-01-13')
  }
]

export const mockMetrics: Metrics = {
  totalShipments: 156,
  onTimeDelivery: 94.2,
  totalCost: 45750,
  storageVolume: 2340
}

export const mockRoutePerformance: RoutePerformance[] = [
  {
    route: 'Warsaw → Berlin',
    shipments: 45,
    onTimePercentage: 96,
    avgCost: 850,
    totalRevenue: 38250
  },
  {
    route: 'Krakow → Vienna',
    shipments: 32,
    onTimePercentage: 91,
    avgCost: 720,
    totalRevenue: 23040
  },
  {
    route: 'Gdansk → Hamburg',
    shipments: 28,
    onTimePercentage: 98,
    avgCost: 950,
    totalRevenue: 26600
  },
  {
    route: 'Wroclaw → Prague',
    shipments: 22,
    onTimePercentage: 89,
    avgCost: 650,
    totalRevenue: 14300
  },
  {
    route: 'Poznan → Amsterdam',
    shipments: 29,
    onTimePercentage: 93,
    avgCost: 1200,
    totalRevenue: 34800
  }
] 