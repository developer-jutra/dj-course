export interface OperationalMetrics {
  throughput: number;
  orderAccuracy: number;
  avgProcessingTime: number;
  errorRate: number;
  detailedMetrics: {
    name: string;
    value: number;
  }[];
  dailyThroughputTrend?: {
    date: string;
    value: number;
  }[];
}

export interface UtilizationReport {
  spaceUtilization: {
    zoneId: number;
    zoneName: string;
    utilization: number;
    capacity: number;
    used: number;
  }[];
  equipmentUtilization: {
    equipmentId: number;
    equipmentType: string;
    utilization: number;
    activeHours: number;
    totalHours: number;
  }[];
  personnelUtilization: {
    role: string;
    utilization: number;
    activeEmployees: number;
    totalEmployees: number;
  }[];
  detailedBreakdown: {
    name: string;
    type: string;
    capacity: string;
    used: string;
    utilization: number;
  }[];
}

export interface FinancialReport {
  totalRevenue: number;
  operatingCosts: number;
  netProfit: number;
  profitMargin: number;
  revenueGrowth: number;
  costIncrease: number;
  outstandingInvoices: number;
  overdueCount: number;
  revenueByService: {
    serviceName: string;
    revenue: number;
    percentage: number;
    color: string;
  }[];
  billingDetails: {
    contractorName: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
  }[];
}

export interface AuditTrail {
  summary: {
    totalEvents: number;
    userActions: number;
    securityEvents: number;
    systemEvents: number;
  };
  events: {
    id: number;
    timestamp: Date;
    userName: string;
    userRole: string;
    actionType: string;
    resourceType: string;
    resourceId: string;
    details: string;
    ipAddress: string;
    status: 'success' | 'failed' | 'warning';
  }[];
  totalCount: number;
}