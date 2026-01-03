import { Reservation } from "../features/reservations/reservations.model";

export const MOCK_RESERVATIONS: Reservation[] = [
    {
        id: 1,
        contractorId: '6',
        contractorName: 'Ward, Hall and Farley',
        storageRequestId: 1,
        location: {
            zone: 'Zone A',
            aisle: 'Aisle 1',
            rack: 'Rack 1',
            shelf: 'Shelf 3',
            fullLocation: 'Zone A - Aisle 1 - Rack 1 - Shelf 3'
        },
        reservedFrom: new Date('2025-01-10'),
        reservedUntil: new Date('2025-02-10'),
        reservedWeight: 500,
        reservedVolume: 25,
        status: 'active',
        payment: {
            amount: 2500,
            currency: 'USD',
            status: 'paid',
            dueDate: new Date('2025-01-15'),
            paidDate: new Date('2025-01-12')
        },
        createdAt: new Date('2025-01-08'),
        updatedAt: new Date('2025-01-12')
    },
    {
        id: 2,
        contractorId: '7',
        contractorName: 'Hart and Sons',
        storageRequestId: 2,
        location: {
            zone: 'Zone B',
            aisle: 'Aisle 2',
            rack: 'Rack 1',
            shelf: 'Shelf 1',
            fullLocation: 'Zone B - Aisle 2 - Rack 1 - Shelf 1'
        },
        reservedFrom: new Date('2025-01-15'),
        reservedUntil: new Date('2025-03-15'),
        reservedWeight: 800,
        reservedVolume: 40,
        status: 'active',
        payment: {
            amount: 4800,
            currency: 'USD',
            status: 'paid',
            dueDate: new Date('2025-01-20'),
            paidDate: new Date('2025-01-18')
        },
        createdAt: new Date('2025-01-12'),
        updatedAt: new Date('2025-01-18')
    },
    {
        id: 3,
        contractorId: '8',
        contractorName: 'Global Logistics',
        storageRequestId: 3,
        location: {
            zone: 'Zone A',
            aisle: 'Aisle 3',
            rack: 'Rack 2',
            shelf: 'Shelf 2',
            fullLocation: 'Zone A - Aisle 3 - Rack 2 - Shelf 2'
        },
        reservedFrom: new Date('2025-02-01'),
        reservedUntil: new Date('2025-04-01'),
        reservedWeight: 1200,
        reservedVolume: 60,
        status: 'pending',
        payment: {
            amount: 7200,
            currency: 'USD',
            status: 'pending',
            dueDate: new Date('2025-02-05')
        },
        createdAt: new Date('2025-01-25'),
        updatedAt: new Date('2025-01-25')
    },
    {
        id: 4,
        contractorId: '9',
        contractorName: 'Tech Solutions',
        storageRequestId: 4,
        location: {
            zone: 'Zone C',
            aisle: 'Aisle 1',
            rack: 'Rack 1',
            shelf: 'Shelf 1',
            fullLocation: 'Zone C - Aisle 1 - Rack 1 - Shelf 1'
        },
        reservedFrom: new Date('2024-12-01'),
        reservedUntil: new Date('2025-01-01'),
        reservedWeight: 300,
        reservedVolume: 15,
        status: 'expired',
        payment: {
            amount: 1800,
            currency: 'USD',
            status: 'paid',
            dueDate: new Date('2024-12-05'),
            paidDate: new Date('2024-12-03')
        },
        createdAt: new Date('2024-11-25'),
        updatedAt: new Date('2025-01-01')
    }
]; 