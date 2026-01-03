import { Shipment, RouteData, RoutePoint, Vehicle } from './logistics.types';

const createMockRoute = (
  id: string,
  name: string,
  points: Omit<RoutePoint, 'id'>[],
  vehicle: Vehicle,
  status: RouteData['status'] = 'active'
): RouteData => {
  const routePoints: RoutePoint[] = points.map((point, index) => ({
    ...point,
    id: `${id}-point-${index + 1}`
  }));

  // Calculate basic metrics
  const totalDistance = Math.random() * 800 + 200; // 200-1000 km
  const estimatedDuration = Math.floor(totalDistance / 80 * 60); // Assuming 80 km/h average

  const startTime = new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000);
  const estimatedCompletion = new Date(startTime.getTime() + estimatedDuration * 60 * 60 * 1000);

  return {
    id,
    name,
    points: routePoints,
    vehicle,
    totalDistance,
    estimatedDuration,
    status,
    startTime,
    estimatedCompletion
  };
};

export const mockShipments: Shipment[] = [
  {
    id: 'ship-001',
    name: 'Warszawa → Kraków Express',
    customer: 'Fabryka BMW',
    priority: 'high',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    route: createMockRoute(
      'route-001',
      'Warszawa → Kraków Express',
      [
        {
          coordinates: { lat: 52.2297, lng: 21.0122 }, // Warszawa
          type: 'pickup',
          name: 'Centrum Dystrybucji Warszawa',
          address: 'ul. Marszałkowska 1, Warszawa, Polska',
          estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000),
          estimatedDeparture: new Date(Date.now() + 3 * 60 * 60 * 1000),
          duration: 60,
          notes: 'Główne miejsce odbioru - 15 palet'
        },
        {
          coordinates: { lat: 51.7592, lng: 19.4560 }, // Łódź
          type: 'rest',
          name: 'Miejsce Odpoczynku Łódź',
          address: 'MOP A2, Łódź, Polska',
          estimatedArrival: new Date(Date.now() + 6 * 60 * 60 * 1000),
          estimatedDeparture: new Date(Date.now() + 6.75 * 60 * 60 * 1000),
          duration: 45,
          notes: 'Obowiązkowy odpoczynek kierowcy'
        },
        {
          coordinates: { lat: 50.0647, lng: 19.9450 }, // Kraków
          type: 'delivery',
          name: 'Fabryka BMW Kraków',
          address: 'ul. Wadowicka 130, Kraków, Polska',
          estimatedArrival: new Date(Date.now() + 10 * 60 * 60 * 1000),
          duration: 90,
          notes: 'Dostawa końcowa - 15 palet, rampa 7'
        }
      ],
      {
        id: 'vehicle-001',
        coordinates: { lat: 52.2, lng: 21.0 },
        heading: 180,
        speed: 85,
        driver: 'Jan Kowalski',
        plateNumber: 'WA-LOG 2024'
      },
      'active'
    )
  },
  {
    id: 'ship-002',
    name: 'Gdańsk → Wrocław Trasa',
    customer: 'Mercedes-Benz Polska',
    priority: 'urgent',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000),
    route: createMockRoute(
      'route-002',
      'Gdańsk → Wrocław Trasa',
      [
        {
          coordinates: { lat: 54.3520, lng: 18.6466 }, // Gdańsk
          type: 'pickup',
          name: 'Terminal Portowy Gdańsk',
          address: 'ul. Portowa 1, Gdańsk, Polska',
          estimatedArrival: new Date(Date.now() + 1 * 60 * 60 * 1000),
          estimatedDeparture: new Date(Date.now() + 2 * 60 * 60 * 1000),
          duration: 60,
          notes: 'Odbiór kontenera - pilna dostawa'
        },
        {
          coordinates: { lat: 51.1079, lng: 17.0385 }, // Wrocław
          type: 'delivery',
          name: 'Fabryka Mercedes-Benz',
          address: 'ul. Żmigrodzka 120, Wrocław, Polska',
          estimatedArrival: new Date(Date.now() + 8 * 60 * 60 * 1000),
          duration: 45,
          notes: 'Dostawa do linii produkcyjnej'
        }
      ],
      {
        id: 'vehicle-002',
        coordinates: { lat: 54.3, lng: 18.6 },
        heading: 225,
        speed: 90,
        driver: 'Maria Nowak',
        plateNumber: 'GD-EX 1234'
      },
      'active'
    )
  },
  {
    id: 'ship-003',
    name: 'Poznań → Lublin Multi-Stop',
    customer: 'Volkswagen Grupa',
    priority: 'medium',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    route: createMockRoute(
      'route-003',
      'Poznań → Lublin Multi-Stop',
      [
        {
          coordinates: { lat: 52.4064, lng: 16.9252 }, // Poznań
          type: 'pickup',
          name: 'Centrum Logistyczne Poznań',
          address: 'ul. Bukowska 1, Poznań, Polska',
          estimatedArrival: new Date(Date.now() + 4 * 60 * 60 * 1000),
          estimatedDeparture: new Date(Date.now() + 5 * 60 * 60 * 1000),
          duration: 60,
          notes: 'Odbiór części dla VW'
        },
        {
          coordinates: { lat: 51.2465, lng: 22.5684 }, // Lublin
          type: 'delivery',
          name: 'Fabryka VW Lublin',
          address: 'ul. Fabryczna 1, Lublin, Polska',
          estimatedArrival: new Date(Date.now() + 12 * 60 * 60 * 1000),
          duration: 75,
          notes: 'Dostawa precyzyjnych części'
        }
      ],
      {
        id: 'vehicle-003',
        coordinates: { lat: 52.4, lng: 16.9 },
        heading: 90,
        speed: 75,
        driver: 'Tomasz Wiśniewski',
        plateNumber: 'PO-VW 5678'
      },
      'planned'
    )
  },
  {
    id: 'ship-004',
    name: 'Łódź → Katowice Express',
    customer: 'Siemens Polska',
    priority: 'high',
    createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000),
    route: createMockRoute(
      'route-004',
      'Łódź → Katowice Express',
      [
        {
          coordinates: { lat: 51.7592, lng: 19.4560 }, // Łódź
          type: 'pickup',
          name: 'Lotnisko Łódź Cargo',
          address: 'ul. Generała Stefana Roweckiego 33, Łódź, Polska',
          estimatedArrival: new Date(Date.now() + 3 * 60 * 60 * 1000),
          estimatedDeparture: new Date(Date.now() + 4 * 60 * 60 * 1000),
          duration: 60,
          notes: 'Odbiór sprzętu high-tech'
        },
        {
          coordinates: { lat: 50.2649, lng: 19.0238 }, // Katowice
          type: 'delivery',
          name: 'Siemens Centrala',
          address: 'ul. Żwirki i Wigury 1, Katowice, Polska',
          estimatedArrival: new Date(Date.now() + 7 * 60 * 60 * 1000),
          duration: 45,
          notes: 'Wrażliwy sprzęt - ostrożnie'
        }
      ],
      {
        id: 'truck-004',
        coordinates: { lat: 51.7, lng: 19.4 },
        heading: 135,
        speed: 80,
        driver: 'Agnieszka Wójcik',
        plateNumber: 'LD-SIE 9012'
      },
      'delayed'
    )
  },
  {
    id: 'ship-005',
    name: 'Wrocław → Szczecin Zakończone',
    customer: 'DHL Express Polska',
    priority: 'low',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    route: createMockRoute(
      'route-005',
      'Wrocław → Szczecin Zakończone',
      [
        {
          coordinates: { lat: 51.1079, lng: 17.0385 }, // Wrocław
          type: 'pickup',
          name: 'Hub DHL Wrocław',
          address: 'ul. Lotnicza 2, Wrocław, Polska',
          estimatedArrival: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          estimatedDeparture: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
          duration: 60,
          notes: 'Odbiór paczek ekspresowych'
        },
        {
          coordinates: { lat: 53.4285, lng: 14.5528 }, // Szczecin
          type: 'delivery',
          name: 'Hub DHL Szczecin',
          address: 'ul. Portowa 1, Szczecin, Polska',
          estimatedArrival: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
          duration: 30,
          notes: 'Transfer między hubami zakończony'
        }
      ],
      {
        id: 'truck-005',
        coordinates: { lat: 53.4, lng: 14.5 },
        heading: 0,
        speed: 0,
        driver: 'Paweł Kaczmarek',
        plateNumber: 'WR-DHL 3456'
      },
      'completed'
    )
  },
  {
    id: 'ship-006',
    name: 'Szczecin -> Hamburg',
    customer: 'Hapag-Lloyd',
    priority: 'high',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    route: createMockRoute(
      'route-006',
      'Szczecin -> Hamburg',
      [
        {
          coordinates: { lat: 53.428, lng: 14.552 },
          type: 'pickup',
          name: 'Port Szczecin',
          address: 'ul. Bytomska 7, Szczecin, Polska',
          estimatedArrival: new Date(Date.now() + 1 * 60 * 60 * 1000),
          estimatedDeparture: new Date(Date.now() + 2 * 60 * 60 * 1000),
          duration: 60,
          notes: 'Odbiór kontenera'
        },
        {
          coordinates: { lat: 53.551, lng: 9.993 },
          type: 'delivery',
          name: 'Port Hamburg',
          address: 'Hafen Hamburg, Germany',
          estimatedArrival: new Date(Date.now() + 6 * 60 * 60 * 1000),
          duration: 90,
          notes: 'Dostawa do terminala'
        }
      ],
      {
        id: 'vehicle-008',
        coordinates: { lat: 53.428, lng: 14.552 },
        heading: 270,
        speed: 90,
        driver: 'Elżbieta Dąbrowska',
        plateNumber: 'SZ-LKW 888'
      },
      'active'
    )
  },
  {
    id: 'ship-007',
    name: 'Białystok -> Vilnius',
    customer: 'Lietuvos Geležinkeliai',
    priority: 'medium',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    route: createMockRoute(
      'route-007',
      'Białystok -> Vilnius',
      [
        {
          coordinates: { lat: 53.132, lng: 23.168 },
          type: 'pickup',
          name: 'Terminal kontenerowy, Białystok',
          address: 'ul. Kolejowa 1, Białystok, Polska',
          estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000),
          estimatedDeparture: new Date(Date.now() + 3 * 60 * 60 * 1000),
          duration: 60,
          notes: 'Odbiór kontenera dla kolei litewskich'
        },
        {
          coordinates: { lat: 54.687, lng: 25.279 },
          type: 'delivery',
          name: 'Vilnius Intermodal Terminal',
          address: 'Vaidotai, Lithuania',
          estimatedArrival: new Date(Date.now() + 8 * 60 * 60 * 1000),
          duration: 120,
          notes: 'Dostawa do terminala intermodalnego'
        }
      ],
      {
        id: 'vehicle-011',
        coordinates: { lat: 53.132, lng: 23.168 },
        heading: 45,
        speed: 80,
        driver: 'Andrzej Kozłowski',
        plateNumber: 'BI-TR 112'
      },
      'active'
    )
  },
  {
    id: 'ship-008',
    name: 'Chyżne -> Budapest',
    customer: 'Waberer\'s International',
    priority: 'high',
    createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    route: createMockRoute(
      'route-008',
      'Chyżne -> Budapest',
      [
        {
          coordinates: { lat: 49.299, lng: 19.949 },
          type: 'pickup',
          name: 'Przejście graniczne Chyżne',
          address: 'Chyżne, Polska',
          estimatedArrival: new Date(Date.now() + 1 * 60 * 60 * 1000),
          estimatedDeparture: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
          duration: 30,
          notes: 'Przejęcie ładunku'
        },
        {
          coordinates: { lat: 47.497, lng: 19.040 },
          type: 'delivery',
          name: 'Waberer\'s Logistics Center',
          address: 'Budapest, Hungary',
          estimatedArrival: new Date(Date.now() + 7 * 60 * 60 * 1000),
          duration: 90,
          notes: 'Dostawa do centrum logistycznego'
        }
      ],
      {
        id: 'vehicle-015',
        coordinates: { lat: 49.299, lng: 19.949 },
        heading: 180,
        speed: 85,
        driver: 'Stanisław Głowacki',
        plateNumber: 'ZAK-TRK 007'
      },
      'active'
    )
  }
];
