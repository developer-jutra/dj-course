// Inventory Management
export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  zoneId: number;
  zoneName: string;
  shelfId: number;
  shelfLocation: string;
  weight: number;
  volume: number;
  value: number;
  currency: string;
  status: 'available' | 'reserved' | 'damaged' | 'expired';
  expiryDate?: Date;
  batchNumber?: string;
  serialNumber?: string;
  lastUpdated: Date;
  contractorId?: string;
  contractorName?: string;
}

export interface InventoryAdjustment {
  id: number;
  itemId: number;
  itemSku: string;
  itemName: string;
  adjustmentType: 'increase' | 'decrease' | 'correction';
  quantityBefore: number;
  quantityAfter: number;
  quantityChanged: number;
  reason: string;
  employeeId: number;
  employeeName: string;
  createdAt: Date;
  notes?: string;
}

export interface StockTransfer {
  id: number;
  itemId: number;
  itemSku: string;
  itemName: string;
  fromLocationId: number;
  fromLocation: string;
  toLocationId: number;
  toLocation: string;
  quantity: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  requestedBy: number;
  requestedByName: string;
  approvedBy?: number;
  approvedByName?: string;
  transferredBy?: number;
  transferredByName?: string;
  requestedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

export interface InventoryOverview {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  expiringSoonItems: number;
  damagedItems: number;
  categoryBreakdown: {
    category: string;
    count: number;
    value: number;
  }[];
  zoneUtilization: {
    zoneId: number;
    zoneName: string;
    utilization: number;
    itemCount: number;
  }[];
} 