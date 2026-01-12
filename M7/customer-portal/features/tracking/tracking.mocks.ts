import type { TrackingData } from './tracking.model'

export const mockTrackingData: Record<string, TrackingData> = {
  'TRK123456789': {
    trackingNumber: 'TRK123456789',
    status: 'IN_TRANSIT',
    serviceType: 'FULL_TRUCKLOAD',
    origin: 'Warsaw, Poland',
    destination: 'Berlin, Germany',
    estimatedDelivery: '2024-01-17T16:00:00',
    route: [
      { lat: 52.2297, lng: 21.0122, name: 'Warsaw, Poland' },
      { lat: 52.0907, lng: 19.4794, name: 'Łódź, Poland' },
      { lat: 51.7592, lng: 19.4560, name: 'Kutno, Poland' },
      { lat: 52.4064, lng: 16.9252, name: 'Poznań, Poland' },
      { lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany' }
    ],
    currentPosition: { lat: 52.0907, lng: 19.4794 },
    trackingEvents: [
      { 
        lat: 52.2297, 
        lng: 21.0122, 
        type: 'pickup', 
        name: 'Warsaw Depot', 
        description: 'Cargo picked up from distribution center',
        estimatedTime: '2024-01-15T09:00:00',
        actualTime: '2024-01-15T09:30:00',
        isCompleted: true
      },
      { 
        lat: 52.1500, 
        lng: 20.2000, 
        type: 'refuel', 
        name: 'Gas Station A2', 
        description: 'Scheduled refueling stop',
        estimatedTime: '2024-01-15T11:00:00',
        actualTime: '2024-01-15T11:15:00',
        isCompleted: true
      },
      { 
        lat: 52.0907, 
        lng: 19.4794, 
        type: 'current', 
        name: 'Łódź Transit Hub', 
        description: 'Current location - sorting facility',
        estimatedTime: '2024-01-15T13:30:00',
        actualTime: '2024-01-15T14:00:00',
        isCompleted: true
      },
      { 
        lat: 52.4064, 
        lng: 16.9252, 
        type: 'warehouse', 
        name: 'Poznań Distribution Hub', 
        description: 'Transit through regional hub',
        estimatedTime: '2024-01-16T08:00:00',
        isCompleted: false
      },
      { 
        lat: 52.3000, 
        lng: 15.0000, 
        type: 'rest', 
        name: 'Highway Rest Area', 
        description: 'Mandatory driver rest period',
        estimatedTime: '2024-01-16T14:00:00',
        isCompleted: false
      },
      { 
        lat: 52.5200, 
        lng: 13.4050, 
        type: 'delivery', 
        name: 'Berlin Warehouse', 
        description: 'Final destination delivery point',
        estimatedTime: '2024-01-17T16:00:00',
        isCompleted: false
      }
    ],
    updates: [
      {
        id: '1',
        timestamp: new Date('2024-01-15T08:00:00'),
        status: 'PICKUP_SCHEDULED',
        location: 'Warsaw, Poland',
        description: 'Pickup scheduled for 08:00',
        estimatedTime: '2024-01-15T08:00:00'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-15T09:30:00'),
        status: 'PICKED_UP',
        location: 'Warsaw, Poland',
        description: 'Cargo successfully picked up',
        estimatedTime: '2024-01-15T09:00:00',
        actualTime: '2024-01-15T09:30:00'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-15T14:00:00'),
        status: 'IN_TRANSIT',
        location: 'Łódź, Poland',
        description: 'In transit to destination',
        estimatedTime: '2024-01-15T13:30:00',
        actualTime: '2024-01-15T14:00:00'
      }
    ]
  },
  'TRK987654321': {
    trackingNumber: 'TRK987654321',
    status: 'DELIVERED',
    serviceType: 'EXPRESS_DELIVERY',
    origin: 'Krakow, Poland',
    destination: 'Vienna, Austria',
    estimatedDelivery: '2024-01-13T10:00:00',
    actualDelivery: '2024-01-13T09:00:00',
    route: [
      { lat: 50.0647, lng: 19.9450, name: 'Krakow, Poland' },
      { lat: 49.2951, lng: 19.9494, name: 'Bielsko-Biała, Poland' },
      { lat: 49.1951, lng: 20.0688, name: 'Žilina, Slovakia' },
      { lat: 48.1486, lng: 17.1077, name: 'Bratislava, Slovakia' },
      { lat: 48.2082, lng: 16.3738, name: 'Vienna, Austria' }
    ],
    currentPosition: { lat: 48.2082, lng: 16.3738 },
    trackingEvents: [
      { 
        lat: 50.0647, 
        lng: 19.9450, 
        type: 'pickup', 
        name: 'Krakow Distribution Center', 
        description: 'Express cargo picked up',
        estimatedTime: '2024-01-12T11:00:00',
        actualTime: '2024-01-12T11:00:00',
        isCompleted: true
      },
      { 
        lat: 49.5000, 
        lng: 19.8000, 
        type: 'refuel', 
        name: 'Highway Service Station', 
        description: 'Refueling stop',
        estimatedTime: '2024-01-12T13:30:00',
        actualTime: '2024-01-12T13:25:00',
        isCompleted: true
      },
      { 
        lat: 49.1951, 
        lng: 20.0688, 
        type: 'customs', 
        name: 'Žilina Border Crossing', 
        description: 'Customs clearance completed',
        estimatedTime: '2024-01-12T16:00:00',
        actualTime: '2024-01-12T15:45:00',
        isCompleted: true
      },
      { 
        lat: 48.5000, 
        lng: 17.5000, 
        type: 'rest', 
        name: 'Driver Rest Area', 
        description: 'Mandatory driver rest period',
        estimatedTime: '2024-01-12T20:00:00',
        actualTime: '2024-01-12T20:00:00',
        isCompleted: true
      },
      { 
        lat: 48.1486, 
        lng: 17.1077, 
        type: 'warehouse', 
        name: 'Bratislava Hub', 
        description: 'Transit through distribution hub',
        estimatedTime: '2024-01-13T06:00:00',
        actualTime: '2024-01-13T05:45:00',
        isCompleted: true
      },
      { 
        lat: 48.2082, 
        lng: 16.3738, 
        type: 'delivery', 
        name: 'Vienna Delivery Point', 
        description: 'Successfully delivered',
        estimatedTime: '2024-01-13T10:00:00',
        actualTime: '2024-01-13T09:00:00',
        isCompleted: true
      }
    ],
    updates: [
      {
        id: '1',
        timestamp: new Date('2024-01-12T10:00:00'),
        status: 'PICKUP_SCHEDULED',
        location: 'Krakow, Poland',
        description: 'Express pickup scheduled',
        estimatedTime: '2024-01-12T11:00:00'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-12T11:00:00'),
        status: 'PICKED_UP',
        location: 'Krakow, Poland',
        description: 'Express cargo picked up',
        estimatedTime: '2024-01-12T11:00:00',
        actualTime: '2024-01-12T11:00:00'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-12T18:00:00'),
        status: 'IN_TRANSIT',
        location: 'Bratislava, Slovakia',
        description: 'Crossed border, in transit',
        estimatedTime: '2024-01-12T17:30:00',
        actualTime: '2024-01-12T18:00:00'
      },
      {
        id: '4',
        timestamp: new Date('2024-01-13T09:00:00'),
        status: 'DELIVERED',
        location: 'Vienna, Austria',
        description: 'Successfully delivered',
        estimatedTime: '2024-01-13T10:00:00',
        actualTime: '2024-01-13T09:00:00'
      }
    ]
  },
  'TRK456789123': {
    trackingNumber: 'TRK456789123',
    status: 'PICKUP_SCHEDULED',
    serviceType: 'OVERSIZED_CARGO',
    origin: 'Prague, Czech Republic',
    destination: 'Hamburg, Germany',
    estimatedDelivery: '2024-01-20T14:00:00',
    route: [
      { lat: 50.0755, lng: 14.4378, name: 'Prague, Czech Republic' },
      { lat: 50.7753, lng: 13.3089, name: 'Karlovy Vary, Czech Republic' },
      { lat: 50.1109, lng: 11.9603, name: 'Bayreuth, Germany' },
      { lat: 52.3759, lng: 9.7320, name: 'Hannover, Germany' },
      { lat: 53.5511, lng: 9.9937, name: 'Hamburg, Germany' }
    ],
    currentPosition: { lat: 50.0755, lng: 14.4378 },
    trackingEvents: [
      { 
        lat: 50.0755, 
        lng: 14.4378, 
        type: 'current', 
        name: 'Prague Depot', 
        description: 'Awaiting pickup - oversized cargo preparation',
        estimatedTime: '2024-01-19T10:00:00',
        isCompleted: false
      },
      { 
        lat: 50.5000, 
        lng: 13.8000, 
        type: 'refuel', 
        name: 'Highway Station', 
        description: 'Planned refuel stop',
        estimatedTime: '2024-01-19T13:00:00',
        isCompleted: false
      },
      { 
        lat: 50.1109, 
        lng: 11.9603, 
        type: 'customs', 
        name: 'German Border Checkpoint', 
        description: 'Customs inspection for oversized cargo',
        estimatedTime: '2024-01-19T16:30:00',
        isCompleted: false
      },
      { 
        lat: 52.0000, 
        lng: 10.0000, 
        type: 'rest', 
        name: 'Overnight Rest Area', 
        description: 'Mandatory overnight rest',
        estimatedTime: '2024-01-19T22:00:00',
        isCompleted: false
      },
      { 
        lat: 53.5511, 
        lng: 9.9937, 
        type: 'delivery', 
        name: 'Hamburg Port Terminal', 
        description: 'Final destination - port facility',
        estimatedTime: '2024-01-20T14:00:00',
        isCompleted: false
      }
    ],
    updates: [
      {
        id: '1',
        timestamp: new Date('2024-01-18T08:00:00'),
        status: 'PICKUP_SCHEDULED',
        location: 'Prague, Czech Republic',
        description: 'Oversized cargo pickup scheduled for tomorrow',
        estimatedTime: '2024-01-19T10:00:00'
      }
    ]
  },
  'TRK789123456': {
    trackingNumber: 'TRK789123456',
    status: 'IN_TRANSIT',
    serviceType: 'EXPRESS_DELIVERY',
    origin: 'Budapest, Hungary',
    destination: 'Amsterdam, Netherlands',
    estimatedDelivery: '2024-01-18T15:00:00',
    route: [
      { lat: 47.4979, lng: 19.0402, name: 'Budapest, Hungary' },
      { lat: 48.1486, lng: 17.1077, name: 'Bratislava, Slovakia' },
      { lat: 48.2082, lng: 16.3738, name: 'Vienna, Austria' },
      { lat: 48.1351, lng: 11.5820, name: 'Munich, Germany' },
      { lat: 50.1109, lng: 8.6821, name: 'Frankfurt, Germany' },
      { lat: 52.3676, lng: 4.9041, name: 'Amsterdam, Netherlands' }
    ],
    currentPosition: { lat: 48.1351, lng: 11.5820 },
    trackingEvents: [
      { 
        lat: 47.4979, 
        lng: 19.0402, 
        type: 'pickup', 
        name: 'Budapest Central Hub', 
        description: 'Express cargo collected',
        estimatedTime: '2024-01-16T10:30:00',
        actualTime: '2024-01-16T10:30:00',
        isCompleted: true
      },
      { 
        lat: 47.8000, 
        lng: 18.0000, 
        type: 'refuel', 
        name: 'M1 Service Station', 
        description: 'Refueling completed',
        estimatedTime: '2024-01-16T12:00:00',
        actualTime: '2024-01-16T12:10:00',
        isCompleted: true
      },
      { 
        lat: 48.1486, 
        lng: 17.1077, 
        type: 'warehouse', 
        name: 'Bratislava Transit Hub', 
        description: 'Quick transit through hub',
        estimatedTime: '2024-01-16T15:00:00',
        actualTime: '2024-01-16T14:45:00',
        isCompleted: true
      },
      { 
        lat: 48.0000, 
        lng: 14.0000, 
        type: 'rest', 
        name: 'Austrian Rest Area', 
        description: 'Driver rest period completed',
        estimatedTime: '2024-01-16T22:00:00',
        actualTime: '2024-01-16T22:00:00',
        isCompleted: true
      },
      { 
        lat: 48.1351, 
        lng: 11.5820, 
        type: 'current', 
        name: 'Munich Distribution Center', 
        description: 'Currently at distribution center',
        estimatedTime: '2024-01-17T08:00:00',
        actualTime: '2024-01-17T07:45:00',
        isCompleted: true
      },
      { 
        lat: 50.1109, 
        lng: 8.6821, 
        type: 'warehouse', 
        name: 'Frankfurt Major Hub', 
        description: 'Transit through main distribution hub',
        estimatedTime: '2024-01-17T14:00:00',
        isCompleted: false
      },
      { 
        lat: 52.3676, 
        lng: 4.9041, 
        type: 'delivery', 
        name: 'Amsterdam Delivery Center', 
        description: 'Final destination delivery',
        estimatedTime: '2024-01-18T15:00:00',
        isCompleted: false
      }
    ],
    updates: [
      {
        id: '1',
        timestamp: new Date('2024-01-16T09:00:00'),
        status: 'PICKUP_SCHEDULED',
        location: 'Budapest, Hungary',
        description: 'Express pickup scheduled',
        estimatedTime: '2024-01-16T10:30:00'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-16T10:30:00'),
        status: 'PICKED_UP',
        location: 'Budapest, Hungary',
        description: 'Cargo picked up successfully',
        estimatedTime: '2024-01-16T10:30:00',
        actualTime: '2024-01-16T10:30:00'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-17T08:00:00'),
        status: 'IN_TRANSIT',
        location: 'Munich, Germany',
        description: 'In transit, currently in Munich',
        estimatedTime: '2024-01-17T08:00:00',
        actualTime: '2024-01-17T07:45:00'
      }
    ]
  },
  'TRK321654987': {
    trackingNumber: 'TRK321654987',
    status: 'DELIVERED',
    serviceType: 'FULL_TRUCKLOAD',
    origin: 'Gdansk, Poland',
    destination: 'Stockholm, Sweden',
    estimatedDelivery: '2024-01-14T12:00:00',
    actualDelivery: '2024-01-14T11:00:00',
    route: [
      { lat: 54.3520, lng: 18.6466, name: 'Gdansk, Poland' },
      { lat: 55.6761, lng: 12.5683, name: 'Copenhagen, Denmark' },
      { lat: 55.7047, lng: 13.1910, name: 'Malmö, Sweden' },
      { lat: 57.7089, lng: 11.9746, name: 'Gothenburg, Sweden' },
      { lat: 59.3293, lng: 18.0686, name: 'Stockholm, Sweden' }
    ],
    currentPosition: { lat: 59.3293, lng: 18.0686 },
    trackingEvents: [
      { 
        lat: 54.3520, 
        lng: 18.6466, 
        type: 'pickup', 
        name: 'Gdansk Port Terminal', 
        description: 'Cargo loaded from port facility',
        estimatedTime: '2024-01-10T10:00:00',
        actualTime: '2024-01-10T10:00:00',
        isCompleted: true
      },
      { 
        lat: 54.8000, 
        lng: 17.0000, 
        type: 'refuel', 
        name: 'Polish Highway Station', 
        description: 'Refueling stop completed',
        estimatedTime: '2024-01-10T13:00:00',
        actualTime: '2024-01-10T12:45:00',
        isCompleted: true
      },
      { 
        lat: 55.6761, 
        lng: 12.5683, 
        type: 'customs', 
        name: 'Copenhagen Border Control', 
        description: 'Border crossing completed',
        estimatedTime: '2024-01-12T10:00:00',
        actualTime: '2024-01-12T09:30:00',
        isCompleted: true
      },
      { 
        lat: 55.7047, 
        lng: 13.1910, 
        type: 'warehouse', 
        name: 'Malmö Transit Terminal', 
        description: 'Transit through terminal',
        estimatedTime: '2024-01-12T16:00:00',
        actualTime: '2024-01-12T15:45:00',
        isCompleted: true
      },
      { 
        lat: 56.5000, 
        lng: 12.8000, 
        type: 'rest', 
        name: 'Swedish Rest Area', 
        description: 'Mandatory rest stop completed',
        estimatedTime: '2024-01-13T20:00:00',
        actualTime: '2024-01-13T20:00:00',
        isCompleted: true
      },
      { 
        lat: 57.7089, 
        lng: 11.9746, 
        type: 'refuel', 
        name: 'Gothenburg Service Station', 
        description: 'Final refuel before destination',
        estimatedTime: '2024-01-14T08:00:00',
        actualTime: '2024-01-14T07:45:00',
        isCompleted: true
      },
      { 
        lat: 59.3293, 
        lng: 18.0686, 
        type: 'delivery', 
        name: 'Stockholm Distribution Center', 
        description: 'Delivered successfully',
        estimatedTime: '2024-01-14T12:00:00',
        actualTime: '2024-01-14T11:00:00',
        isCompleted: true
      }
    ],
    updates: [
      {
        id: '1',
        timestamp: new Date('2024-01-10T08:00:00'),
        status: 'PICKUP_SCHEDULED',
        location: 'Gdansk, Poland',
        description: 'Pickup scheduled from port',
        estimatedTime: '2024-01-10T10:00:00'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-10T10:00:00'),
        status: 'PICKED_UP',
        location: 'Gdansk, Poland',
        description: 'Cargo loaded and departed',
        estimatedTime: '2024-01-10T10:00:00',
        actualTime: '2024-01-10T10:00:00'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-12T14:00:00'),
        status: 'IN_TRANSIT',
        location: 'Copenhagen, Denmark',
        description: 'Crossed border into Denmark',
        estimatedTime: '2024-01-12T15:00:00',
        actualTime: '2024-01-12T14:00:00'
      },
      {
        id: '4',
        timestamp: new Date('2024-01-14T11:00:00'),
        status: 'DELIVERED',
        location: 'Stockholm, Sweden',
        description: 'Successfully delivered to warehouse',
        estimatedTime: '2024-01-14T12:00:00',
        actualTime: '2024-01-14T11:00:00'
      }
    ]
  },
  'TRK654987321': {
    trackingNumber: 'TRK654987321',
    status: 'IN_TRANSIT',
    serviceType: 'LESS_THAN_TRUCKLOAD',
    origin: 'Bratislava, Slovakia',
    destination: 'Milan, Italy',
    estimatedDelivery: '2024-01-16T18:00:00',
    route: [
      { lat: 48.1486, lng: 17.1077, name: 'Bratislava, Slovakia' },
      { lat: 48.2082, lng: 16.3738, name: 'Vienna, Austria' },
      { lat: 47.2692, lng: 11.4041, name: 'Innsbruck, Austria' },
      { lat: 46.0748, lng: 11.1217, name: 'Bolzano, Italy' },
      { lat: 45.4642, lng: 9.1900, name: 'Milan, Italy' }
    ],
    currentPosition: { lat: 46.0748, lng: 11.1217 },
    trackingEvents: [
      { 
        lat: 48.1486, 
        lng: 17.1077, 
        type: 'pickup', 
        name: 'Bratislava Consolidation Hub', 
        description: 'LTL cargo consolidated and loaded',
        estimatedTime: '2024-01-14T11:00:00',
        actualTime: '2024-01-14T11:15:00',
        isCompleted: true
      },
      { 
        lat: 48.2082, 
        lng: 16.3738, 
        type: 'warehouse', 
        name: 'Vienna Sorting Terminal', 
        description: 'Cargo sorted and processed',
        estimatedTime: '2024-01-14T14:00:00',
        actualTime: '2024-01-14T13:45:00',
        isCompleted: true
      },
      { 
        lat: 47.8000, 
        lng: 13.0000, 
        type: 'refuel', 
        name: 'Alpine Service Station', 
        description: 'Mountain route refuel completed',
        estimatedTime: '2024-01-15T10:00:00',
        actualTime: '2024-01-15T10:20:00',
        isCompleted: true
      },
      { 
        lat: 47.2692, 
        lng: 11.4041, 
        type: 'rest', 
        name: 'Innsbruck Alpine Rest Stop', 
        description: 'Alpine route rest area',
        estimatedTime: '2024-01-15T14:00:00',
        actualTime: '2024-01-15T14:00:00',
        isCompleted: true
      },
      { 
        lat: 46.0748, 
        lng: 11.1217, 
        type: 'current', 
        name: 'Bolzano Border Crossing', 
        description: 'Crossed into Italy - customs cleared',
        estimatedTime: '2024-01-15T16:00:00',
        actualTime: '2024-01-15T15:45:00',
        isCompleted: true
      },
      { 
        lat: 45.4642, 
        lng: 9.1900, 
        type: 'delivery', 
        name: 'Milan Distribution Center', 
        description: 'Final destination delivery',
        estimatedTime: '2024-01-16T18:00:00',
        isCompleted: false
      }
    ],
    updates: [
      {
        id: '1',
        timestamp: new Date('2024-01-14T09:00:00'),
        status: 'PICKUP_SCHEDULED',
        location: 'Bratislava, Slovakia',
        description: 'LTL pickup scheduled',
        estimatedTime: '2024-01-14T11:00:00'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-14T11:00:00'),
        status: 'PICKED_UP',
        location: 'Bratislava, Slovakia',
        description: 'Cargo consolidated and loaded',
        estimatedTime: '2024-01-14T11:00:00',
        actualTime: '2024-01-14T11:15:00'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-15T16:00:00'),
        status: 'IN_TRANSIT',
        location: 'Bolzano, Italy',
        description: 'Crossed Alps, entering Italy',
        estimatedTime: '2024-01-15T16:00:00',
        actualTime: '2024-01-15T15:45:00'
      }
    ]
  }
} 