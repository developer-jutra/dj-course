export interface ShipmentStatus {
  id: string;
  name: string;
  timestamp: string;
  icon: 'package' | 'truck' | 'check' | 'box';
  completed: boolean;
  description?: string;
}

export interface ShipmentTimelineData {
  id: string;
  trackingId: string;
  statuses: ShipmentStatus[];
  currentStatusIndex: number;
} 