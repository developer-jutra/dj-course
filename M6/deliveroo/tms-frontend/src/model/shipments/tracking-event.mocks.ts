import { TrackingEvent } from "./tracking-event.model";

export const mockTrackingEvents: TrackingEvent[] = [
  {
    id: 1,
    status: 'Package Picked Up',
    location: 'New York, NY', // Replaced shipment?.origin
    timestamp: '2024-01-15 14:15:00',
    description: 'Package collected from sender'
  },
  {
    id: 2,
    status: 'In Transit',
    location: 'Newark, NJ',
    timestamp: '2024-01-15 16:30:00',
    description: 'Package in transit to destination'
  },
  {
    id: 3,
    status: 'In Transit',
    location: 'Hartford, CT',
    timestamp: '2024-01-16 09:45:00',
    description: 'Package continues journey'
  }
];