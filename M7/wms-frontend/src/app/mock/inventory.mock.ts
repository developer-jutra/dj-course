import { InventoryItem, InventoryOverview } from '../features/inventory/inventory.model';

export const MOCK_INVENTORY_OVERVIEW: InventoryOverview = {
  totalItems: 1250,
  totalValue: 2500000,
  lowStockItems: 15,
  expiringSoonItems: 8,
  damagedItems: 3,
  categoryBreakdown: [
    { category: 'Electronics', count: 450, value: 1200000 },
    { category: 'Clothing', count: 300, value: 450000 },
    { category: 'Food', count: 500, value: 850000 },
  ],
  zoneUtilization: [
    { zoneId: 1, zoneName: 'Zone A', utilization: 75, itemCount: 450 },
    { zoneId: 2, zoneName: 'Zone B', utilization: 64, itemCount: 300 },
  ],
};

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 1,
    sku: 'ELEC-001',
    name: 'Electronics Package',
    description: 'Consumer electronics shipment',
    category: 'Electronics',
    quantity: 100,
    unit: 'pieces',
    location: 'Zone A-1-R1-S3',
    zoneId: 1,
    zoneName: 'Zone A - Standard',
    shelfId: 1,
    shelfLocation: 'A-1-R1-S3',
    weight: 500,
    volume: 25,
    value: 15000,
    currency: 'USD',
    status: 'available',
    lastUpdated: new Date(),
    contractorId: '6',
    contractorName: 'Ward, Hall and Farley',
  },
]; 