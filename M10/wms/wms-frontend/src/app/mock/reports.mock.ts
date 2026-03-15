import { OperationalMetrics, UtilizationReport, FinancialReport, AuditTrail } from '../features/reports/reports.model';

export function getOperationalMetrics(period: string): OperationalMetrics {
    switch (period) {
        case 'today':
            return {
                throughput: 280,
                orderAccuracy: 99.2,
                avgProcessingTime: 10.5,
                errorRate: 0.8,
                detailedMetrics: [
                    { name: 'Receiving Efficiency', value: 95 },
                    { name: 'Picking Accuracy', value: 99 },
                    { name: 'Shipping Speed', value: 92 },
                    { name: 'Inventory Accuracy', value: 98 }
                ],
                dailyThroughputTrend: [
                    { date: '8am', value: 180 },
                    { date: '10am', value: 240 },
                    { date: '12pm', value: 320 },
                    { date: '2pm', value: 300 },
                    { date: '4pm', value: 280 },
                    { date: '6pm', value: 220 }
                ]
            };
        
        case 'week':
            return {
                throughput: 245,
                orderAccuracy: 98.5,
                avgProcessingTime: 12.3,
                errorRate: 1.5,
                detailedMetrics: [
                    { name: 'Receiving Efficiency', value: 92 },
                    { name: 'Picking Accuracy', value: 98 },
                    { name: 'Shipping Speed', value: 87 },
                    { name: 'Inventory Accuracy', value: 95 }
                ],
                dailyThroughputTrend: [
                    { date: 'Mon', value: 220 },
                    { date: 'Tue', value: 235 },
                    { date: 'Wed', value: 245 },
                    { date: 'Thu', value: 230 },
                    { date: 'Fri', value: 255 },
                    { date: 'Sat', value: 210 },
                    { date: 'Sun', value: 195 }
                ]
            };
        
        case 'month':
            return {
                throughput: 238,
                orderAccuracy: 97.8,
                avgProcessingTime: 13.2,
                errorRate: 2.2,
                detailedMetrics: [
                    { name: 'Receiving Efficiency', value: 89 },
                    { name: 'Picking Accuracy', value: 96 },
                    { name: 'Shipping Speed', value: 85 },
                    { name: 'Inventory Accuracy', value: 93 }
                ],
                dailyThroughputTrend: [
                    { date: 'Wk1', value: 225 },
                    { date: 'Wk2', value: 238 },
                    { date: 'Wk3', value: 245 },
                    { date: 'Wk4', value: 242 }
                ]
            };
        
        case 'quarter':
            return {
                throughput: 232,
                orderAccuracy: 97.2,
                avgProcessingTime: 13.8,
                errorRate: 2.8,
                detailedMetrics: [
                    { name: 'Receiving Efficiency', value: 87 },
                    { name: 'Picking Accuracy', value: 95 },
                    { name: 'Shipping Speed', value: 83 },
                    { name: 'Inventory Accuracy', value: 91 }
                ],
                dailyThroughputTrend: [
                    { date: 'Jan', value: 218 },
                    { date: 'Feb', value: 228 },
                    { date: 'Mar', value: 250 }
                ]
            };
        
        default:
            return getOperationalMetrics('week');
    }
}

export function getUtilizationReport(period: string): UtilizationReport {
    switch (period) {
        case 'week':
            return {
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
        
        case 'month':
            return {
                spaceUtilization: [
                    { zoneId: 1, zoneName: 'Zone A - Standard', utilization: 82, capacity: 10000, used: 8200 },
                    { zoneId: 2, zoneName: 'Zone B - Refrigerated', utilization: 71, capacity: 5000, used: 3550 },
                    { zoneId: 3, zoneName: 'Zone C - Frozen', utilization: 58, capacity: 3000, used: 1740 }
                ],
                equipmentUtilization: [
                    { equipmentId: 1, equipmentType: 'Forklifts', utilization: 88, activeHours: 528, totalHours: 600 },
                    { equipmentId: 2, equipmentType: 'Conveyor Belts', utilization: 94, activeHours: 1410, totalHours: 1500 },
                    { equipmentId: 3, equipmentType: 'Pallet Jacks', utilization: 81, activeHours: 1215, totalHours: 1500 }
                ],
                personnelUtilization: [
                    { role: 'Warehouse Workers', utilization: 91, activeEmployees: 23, totalEmployees: 25 },
                    { role: 'Forklift Operators', utilization: 97, activeEmployees: 19, totalEmployees: 20 },
                    { role: 'Quality Inspectors', utilization: 78, activeEmployees: 8, totalEmployees: 10 }
                ],
                detailedBreakdown: [
                    { name: 'Zone A-1', type: 'Storage', capacity: '2,500 m³', used: '2,050 m³', utilization: 82 },
                    { name: 'Zone A-2', type: 'Storage', capacity: '2,500 m³', used: '2,150 m³', utilization: 86 },
                    { name: 'Dock 1', type: 'Loading', capacity: '8 hrs/day', used: '7.0 hrs/day', utilization: 88 },
                    { name: 'Dock 2', type: 'Loading', capacity: '8 hrs/day', used: '7.5 hrs/day', utilization: 94 }
                ]
            };
        
        case 'quarter':
            return {
                spaceUtilization: [
                    { zoneId: 1, zoneName: 'Zone A - Standard', utilization: 78, capacity: 10000, used: 7800 },
                    { zoneId: 2, zoneName: 'Zone B - Refrigerated', utilization: 68, capacity: 5000, used: 3400 },
                    { zoneId: 3, zoneName: 'Zone C - Frozen', utilization: 54, capacity: 3000, used: 1620 }
                ],
                equipmentUtilization: [
                    { equipmentId: 1, equipmentType: 'Forklifts', utilization: 86, activeHours: 1548, totalHours: 1800 },
                    { equipmentId: 2, equipmentType: 'Conveyor Belts', utilization: 93, activeHours: 4185, totalHours: 4500 },
                    { equipmentId: 3, equipmentType: 'Pallet Jacks', utilization: 79, activeHours: 3555, totalHours: 4500 }
                ],
                personnelUtilization: [
                    { role: 'Warehouse Workers', utilization: 89, activeEmployees: 22, totalEmployees: 25 },
                    { role: 'Forklift Operators', utilization: 96, activeEmployees: 19, totalEmployees: 20 },
                    { role: 'Quality Inspectors', utilization: 75, activeEmployees: 8, totalEmployees: 10 }
                ],
                detailedBreakdown: [
                    { name: 'Zone A-1', type: 'Storage', capacity: '2,500 m³', used: '1,950 m³', utilization: 78 },
                    { name: 'Zone A-2', type: 'Storage', capacity: '2,500 m³', used: '2,075 m³', utilization: 83 },
                    { name: 'Dock 1', type: 'Loading', capacity: '8 hrs/day', used: '6.8 hrs/day', utilization: 85 },
                    { name: 'Dock 2', type: 'Loading', capacity: '8 hrs/day', used: '7.3 hrs/day', utilization: 91 }
                ]
            };
        
        case 'year':
            return {
                spaceUtilization: [
                    { zoneId: 1, zoneName: 'Zone A - Standard', utilization: 73, capacity: 10000, used: 7300 },
                    { zoneId: 2, zoneName: 'Zone B - Refrigerated', utilization: 62, capacity: 5000, used: 3100 },
                    { zoneId: 3, zoneName: 'Zone C - Frozen', utilization: 48, capacity: 3000, used: 1440 }
                ],
                equipmentUtilization: [
                    { equipmentId: 1, equipmentType: 'Forklifts', utilization: 84, activeHours: 6048, totalHours: 7200 },
                    { equipmentId: 2, equipmentType: 'Conveyor Belts', utilization: 91, activeHours: 16380, totalHours: 18000 },
                    { equipmentId: 3, equipmentType: 'Pallet Jacks', utilization: 77, activeHours: 13860, totalHours: 18000 }
                ],
                personnelUtilization: [
                    { role: 'Warehouse Workers', utilization: 87, activeEmployees: 22, totalEmployees: 25 },
                    { role: 'Forklift Operators', utilization: 94, activeEmployees: 19, totalEmployees: 20 },
                    { role: 'Quality Inspectors', utilization: 70, activeEmployees: 7, totalEmployees: 10 }
                ],
                detailedBreakdown: [
                    { name: 'Zone A-1', type: 'Storage', capacity: '2,500 m³', used: '1,825 m³', utilization: 73 },
                    { name: 'Zone A-2', type: 'Storage', capacity: '2,500 m³', used: '1,950 m³', utilization: 78 },
                    { name: 'Dock 1', type: 'Loading', capacity: '8 hrs/day', used: '6.4 hrs/day', utilization: 80 },
                    { name: 'Dock 2', type: 'Loading', capacity: '8 hrs/day', used: '7.0 hrs/day', utilization: 88 }
                ]
            };
        
        default:
            return getUtilizationReport('month');
    }
}

export function getFinancialReport(period: string): FinancialReport {
    switch (period) {
        case 'month':
            return {
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
        
        case 'quarter':
            return {
                totalRevenue: 3680000,
                operatingCosts: 2610000,
                netProfit: 1070000,
                profitMargin: 29.1,
                revenueGrowth: 15.2,
                costIncrease: 9.8,
                outstandingInvoices: 342000,
                overdueCount: 15,
                revenueByService: [
                    { serviceName: 'Storage Services', revenue: 2208000, percentage: 60, color: '#3B82F6' },
                    { serviceName: 'Handling Services', revenue: 883200, percentage: 24, color: '#10B981' },
                    { serviceName: 'Value-Added Services', revenue: 368000, percentage: 10, color: '#F59E0B' },
                    { serviceName: 'Transportation', revenue: 220800, percentage: 6, color: '#EF4444' }
                ],
                billingDetails: [
                    { contractorName: 'Ward, Hall and Farley', amount: 135000, status: 'paid' },
                    { contractorName: 'Hart and Sons', amount: 84000, status: 'paid' },
                    { contractorName: 'Global Logistics', amount: 62000, status: 'pending' },
                    { contractorName: 'Tech Solutions', amount: 96000, status: 'paid' },
                    { contractorName: 'Manufacturing Co', amount: 54000, status: 'overdue' }
                ]
            };
        
        case 'year':
            return {
                totalRevenue: 14850000,
                operatingCosts: 10520000,
                netProfit: 4330000,
                profitMargin: 29.2,
                revenueGrowth: 18.5,
                costIncrease: 11.3,
                outstandingInvoices: 892000,
                overdueCount: 32,
                revenueByService: [
                    { serviceName: 'Storage Services', revenue: 8910000, percentage: 60, color: '#3B82F6' },
                    { serviceName: 'Handling Services', revenue: 3564000, percentage: 24, color: '#10B981' },
                    { serviceName: 'Value-Added Services', revenue: 1485000, percentage: 10, color: '#F59E0B' },
                    { serviceName: 'Transportation', revenue: 891000, percentage: 6, color: '#EF4444' }
                ],
                billingDetails: [
                    { contractorName: 'Ward, Hall and Farley', amount: 540000, status: 'paid' },
                    { contractorName: 'Hart and Sons', amount: 336000, status: 'paid' },
                    { contractorName: 'Global Logistics', amount: 225000, status: 'pending' },
                    { contractorName: 'Tech Solutions', amount: 384000, status: 'paid' },
                    { contractorName: 'Manufacturing Co', amount: 216000, status: 'overdue' }
                ]
            };
        
        case 'custom':
            // For custom range, return similar to quarter data
            return getFinancialReport('quarter');
        
        default:
            return getFinancialReport('month');
    }
}

export function getAuditTrails(filter: string, dateFrom: string, dateTo: string): AuditTrail {
    const baseEvents = [
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
            status: 'success' as const
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
            status: 'success' as const
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
            status: 'success' as const
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
            status: 'failed' as const
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
            status: 'success' as const
        },
        {
            id: 6,
            timestamp: new Date('2025-01-13T11:20:00'),
            userName: 'Admin',
            userRole: 'System Admin',
            actionType: 'update',
            resourceType: 'System Settings',
            resourceId: 'SYS-001',
            details: 'Updated notification preferences',
            ipAddress: '192.168.1.50',
            status: 'success' as const
        },
        {
            id: 7,
            timestamp: new Date('2025-01-13T10:45:00'),
            userName: 'Jane Supervisor',
            userRole: 'Warehouse Supervisor',
            actionType: 'create',
            resourceType: 'Task Assignment',
            resourceId: 'TA-089',
            details: 'Assigned inventory check to team B',
            ipAddress: '192.168.1.103',
            status: 'success' as const
        },
        {
            id: 8,
            timestamp: new Date('2025-01-13T09:30:00'),
            userName: 'System',
            userRole: 'System',
            actionType: 'login',
            resourceType: 'User Session',
            resourceId: 'unknown',
            details: 'Suspicious login attempt detected',
            ipAddress: '198.51.100.23',
            status: 'warning' as const
        }
    ];

    // Filter events based on filter parameter
    let filteredEvents = baseEvents;
    
    if (filter !== 'all') {
        filteredEvents = baseEvents.filter(event => {
            switch (filter) {
                case 'user':
                    return event.userRole !== 'System';
                case 'system':
                    return event.userRole === 'System';
                case 'security':
                    return event.actionType === 'login' || event.status === 'failed' || event.status === 'warning';
                case 'data':
                    return event.actionType === 'create' || event.actionType === 'update' || event.actionType === 'delete';
                default:
                    return true;
            }
        });
    }

    const totalEvents = filteredEvents.length;
    const userActions = filteredEvents.filter(e => e.userRole !== 'System').length;
    const securityEvents = filteredEvents.filter(e => e.actionType === 'login' || e.status === 'failed' || e.status === 'warning').length;
    const systemEvents = filteredEvents.filter(e => e.userRole === 'System').length;

    return {
        summary: {
            totalEvents: filter === 'all' ? 1247 : totalEvents * 155, // Scaled for realism
            userActions: userActions * 112,
            securityEvents: securityEvents * 3,
            systemEvents: systemEvents * 166
        },
        events: filteredEvents,
        totalCount: filter === 'all' ? 1247 : totalEvents * 155
    };
}
