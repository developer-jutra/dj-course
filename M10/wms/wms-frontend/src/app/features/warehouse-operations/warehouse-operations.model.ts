export interface Task {
    id: number;
    title: string;
    description: string;
    assignedTo: string;
    assignedToId: number;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    dueDate: Date;
    estimatedHours: number;
    category: 'receiving' | 'shipping' | 'inventory' | 'maintenance' | 'quality';
    location: string;
}

export interface DockAppointment {
    id: number;
    dockId: number;
    dockName: string;
    carrierName: string;
    truckLicense: string;
    appointmentType: 'receiving' | 'shipping';
    scheduledStart: Date;
    scheduledEnd: Date;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    cargoDescription: string;
} 