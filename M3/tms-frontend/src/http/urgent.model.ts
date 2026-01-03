export type UrgentItemType = 'delay' | 'maintenance' | 'payment' | 'driver';

export interface UrgentItem {
  id: number;
  type: UrgentItemType;
  priority: 'high' | 'medium' | 'low';
  message: string;
  action: string;
  assignee: string;
}

export interface AvailableEmployee {
  id: string;
  name: string;
}

