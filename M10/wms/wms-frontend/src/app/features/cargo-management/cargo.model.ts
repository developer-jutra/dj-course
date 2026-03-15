// Cargo Event History
export interface CargoEventHistory {
  id: number;
  storageRecordId: number;
  eventTypeId: number;
  eventTypeName: string;
  eventTime: Date;
  employeeId: number;
  employeeName: string;
  details: any;
}

export interface CargoDocument {
  name: string;
  type: string;
  size: string;
  uploadDate: Date;
}

export interface CargoEvent {
  type: string;
  title: string;
  description: string;
  employee: string;
  timestamp: Date;
}

export interface CargoLocationHistory {
  location: string;
  details: string;
  movedDate: Date;
  duration: string;
} 