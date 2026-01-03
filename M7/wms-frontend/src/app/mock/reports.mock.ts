import { OperationalMetrics, UtilizationReport, FinancialReport, AuditTrail } from '../features/reports/reports.model';

export const MOCK_OPERATIONAL_METRICS: OperationalMetrics = {
    throughput: 245,
    orderAccuracy: 98.5,
    avgProcessingTime: 12.3,
    errorRate: 1.5,
    detailedMetrics: [
        { name: 'Receiving Efficiency', value: 92 },
        { name: 'Picking Accuracy', value: 98 },
        { name: 'Shipping Speed', value: 87 },
        { name: 'Inventory Accuracy', value: 95 }
    ]
};

export const MOCK_UTILIZATION_REPORT: UtilizationReport = {
    spaceUtilization: [
        { zoneId: 1, zoneName: 'Zone A - Standard', utilization: 75, capacity: 10000, used: 7500 },
        { zoneId: 2, zoneName: 'Zone B - Refrigerated', utilization: 64, capacity: 5000, used: 3200 },
        { zoneId: 3, zoneName: 'Zone C - Frozen', utilization: 50, capacity: 3000, used: 1500 }
    ],
    equipmentUtilization: [
        { equipmentId: 1, equipmentType: 'Forklifts', utilization: 85, activeHours: 68, totalHours: 80 },
        { equipmentId: 2, equipmentType: 'Conveyor Belts', utilization: 92, activeHours: 184, totalHours: 200 },
        { equipmentId: 3, equipmentType: 'Pallet Jacks', utilization: 78, activeHours: 156, totalHours: 200 }
    ],
    personnelUtilization: [
        { role: 'Warehouse Workers', utilization: 88, activeEmployees: 22, totalEmployees: 25 },
        { role: 'Forklift Operators', utilization: 95, activeEmployees: 19, totalEmployees: 20 },
        { role: 'Quality Inspectors', utilization: 72, activeEmployees: 7, totalEmployees: 10 }
    ],
    detailedBreakdown: [
        { name: 'Zone A-1', type: 'Storage', capacity: '2,500 m³', used: '1,875 m³', utilization: 75 },
        { name: 'Zone A-2', type: 'Storage', capacity: '2,500 m³', used: '2,000 m³', utilization: 80 },
        { name: 'Dock 1', type: 'Loading', capacity: '8 hrs/day', used: '6.5 hrs/day', utilization: 81 },
        { name: 'Dock 2', type: 'Loading', capacity: '8 hrs/day', used: '7.2 hrs/day', utilization: 90 }
    ]
};

export const MOCK_FINANCIAL_REPORT: FinancialReport = {
    totalRevenue: 1250000,
    operatingCosts: 890000,
    netProfit: 360000,
    profitMargin: 28.8,
    revenueGrowth: 12.5,
    costIncrease: 8.2,
    outstandingInvoices: 125000,
    overdueCount: 8,
    revenueByService: [
        { serviceName: 'Storage Services', revenue: 750000, percentage: 60, color: '#3B82F6' },
        { serviceName: 'Handling Services', revenue: 300000, percentage: 24, color: '#10B981' },
        { serviceName: 'Value-Added Services', revenue: 125000, percentage: 10, color: '#F59E0B' },
        { serviceName: 'Transportation', revenue: 75000, percentage: 6, color: '#EF4444' }
    ],
    billingDetails: [
        { contractorName: 'Ward, Hall and Farley', amount: 45000, status: 'paid' },
        { contractorName: 'Hart and Sons', amount: 28000, status: 'pending' },
        { contractorName: 'Global Logistics', amount: 15000, status: 'overdue' },
        { contractorName: 'Tech Solutions', amount: 32000, status: 'paid' },
        { contractorName: 'Manufacturing Co', amount: 18000, status: 'pending' }
    ]
};

export const MOCK_AUDIT_TRAIL: AuditTrail = {
    summary: {
        totalEvents: 1247,
        userActions: 892,
        securityEvents: 23,
        systemEvents: 332
    },
    events: [
        {
            id: 1,
            timestamp: new Date('2025-01-13T14:30:00'),
            userName: 'John Manager',
            userRole: 'Warehouse Manager',
            actionType: 'update',
            resourceType: 'Storage Request',
            resourceId: 'SR-001',
            details: 'Approved storage request for ABC Corp',
            ipAddress: '192.168.1.100',
            status: 'success'
        },
        {
            id: 2,
            timestamp: new Date('2025-01-13T14:15:00'),
            userName: 'Sarah Coordinator',
            userRole: 'Logistics Coordinator',
            actionType: 'create',
            resourceType: 'Dock Appointment',
            resourceId: 'DA-045',
            details: 'Scheduled dock appointment for Swift Transport',
            ipAddress: '192.168.1.101',
            status: 'success'
        },
        {
            id: 3,
            timestamp: new Date('2025-01-13T13:45:00'),
            userName: 'Mike Worker',
            userRole: 'Warehouse Worker',
            actionType: 'update',
            resourceType: 'Inventory',
            resourceId: 'INV-123',
            details: 'Updated inventory count for ELEC-001',
            ipAddress: '192.168.1.102',
            status: 'success'
        },
        {
            id: 4,
            timestamp: new Date('2025-01-13T13:30:00'),
            userName: 'System',
            userRole: 'System',
            actionType: 'login',
            resourceType: 'User Session',
            resourceId: 'unknown',
            details: 'Failed login attempt with invalid credentials',
            ipAddress: '203.0.113.45',
            status: 'failed'
        },
        {
            id: 5,
            timestamp: new Date('2025-01-13T12:00:00'),
            userName: 'John Manager',
            userRole: 'Warehouse Manager',
            actionType: 'delete',
            resourceType: 'User Account',
            resourceId: 'USR-089',
            details: 'Deactivated user account for former employee',
            ipAddress: '192.168.1.100',
            status: 'success'
        }
    ],
    totalCount: 1247
}; 