export interface WarehouseAssignment {
  warehouseId: number;
  warehouseName: string;
  assignedFrom: Date;
  assignedUntil?: Date;
  isActive: boolean;
} 