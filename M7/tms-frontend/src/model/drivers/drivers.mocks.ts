import { Driver, DriverRoute, CalendarEvent } from './driver.types';
import { getMockShipments } from '../shipments/shipments.mocks';
import { UIShipment } from '../shipments/ui.types';

const generateDriverRoutes = (driverId: string): DriverRoute[] => {
  const routes: DriverRoute[] = [];
  const now = new Date();
  
  // Generate routes for the past 3 months
  for (let i = 0; i < 12; i++) {
    const startDate = new Date(now.getTime() - (i * 7 + Math.random() * 3) * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + (1 + Math.random() * 2) * 24 * 60 * 60 * 1000);
    
    const origins = ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań'];
    const destinations = ['Łódź', 'Szczecin', 'Lublin', 'Katowice', 'Bydgoszcz'];
    
    const origin = origins[Math.floor(Math.random() * origins.length)];
    const destination = destinations[Math.floor(Math.random() * destinations.length)];
    
    routes.push({
      id: `route-${driverId}-${i}`,
      name: `${origin} → ${destination}`,
      startDate,
      endDate,
      origin,
      destination,
      distance: Math.floor(Math.random() * 800 + 200),
      status: i === 0 ? 'active' : i < 3 ? 'completed' : 'completed',
      points: [
        {
          lat: 52.2297 + (Math.random() - 0.5) * 2,
          lng: 21.0122 + (Math.random() - 0.5) * 4,
          timestamp: startDate,
          type: 'start',
          name: origin
        },
        {
          lat: 51.7592 + (Math.random() - 0.5) * 2,
          lng: 19.4560 + (Math.random() - 0.5) * 4,
          timestamp: new Date(startDate.getTime() + 4 * 60 * 60 * 1000),
          type: 'rest',
          name: 'Miejsce Odpoczynku'
        },
        {
          lat: 50.0647 + (Math.random() - 0.5) * 2,
          lng: 19.9450 + (Math.random() - 0.5) * 4,
          timestamp: endDate,
          type: 'end',
          name: destination
        }
      ]
    });
  }
  
  return routes.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
};

const generateCalendarEvents = (routes: DriverRoute[]): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  
  // Add route events
  routes.forEach(route => {
    events.push({
      id: `event-${route.id}`,
      title: `Trasa: ${route.name}`,
      start: route.startDate,
      end: route.endDate,
      type: 'route',
      description: `Trasa ${route.distance}km z ${route.origin} do ${route.destination}`,
      routeId: route.id
    });
  });
  
  // Add some sick leave and vacation events
  const now = new Date();
  events.push({
    id: 'sick-1',
    title: 'Zwolnienie Lekarskie',
    start: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
    end: new Date(now.getTime() - 43 * 24 * 60 * 60 * 1000),
    type: 'sick-leave',
    description: 'Zwolnienie medyczne'
  });
  
  events.push({
    id: 'vacation-1',
    title: 'Urlop Wypoczynkowy',
    start: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    end: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
    type: 'vacation',
    description: 'Urlop letni'
  });
  
  return events;
};

export const mockDrivers: Driver[] = [
  {
    id: 'driver-001',
    name: 'Jan Kowalski',
    email: 'jan.kowalski@gmail.com',
    phone: '+48 22 123 45 67',
    address: {
      street: 'ul. Marszałkowska 123',
      city: 'Warszawa',
      postalCode: '00-001',
      country: 'Polska'
    },
    contractType: 'full-time',
    salary: 7200,
    currency: 'PLN',
    licenseNumber: 'PL123456789',
    licenseExpiry: new Date(2026, 5, 15),
    hireDate: new Date(2020, 2, 1),
    currentLocation: {
      lat: 52.2297,
      lng: 21.0122,
      address: 'A2 koło Warszawy',
    },
    status: 'on-route',
    emergencyContact: {
      name: 'Anna Kowalska',
      phone: '+48 22 987 65 43',
      relationship: 'Żona'
    },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-002',
    name: 'Maria Nowak',
    email: 'maria.nowak@onet.pl',
    phone: '+48 12 234 56 78',
    address: {
      street: 'ul. Floriańska 456',
      city: 'Kraków',
      postalCode: '31-021',
      country: 'Polska'
    },
    contractType: 'full-time',
    salary: 7800,
    currency: 'PLN',
    licenseNumber: 'PL987654321',
    licenseExpiry: new Date(2025, 11, 30),
    hireDate: new Date(2019, 8, 15),
    currentLocation: {
      lat: 50.0647,
      lng: 19.9450,
      address: 'Terminal Portowy Kraków',
    },
    status: 'active',
    emergencyContact: {
      name: 'Piotr Nowak',
      phone: '+48 12 345 67 89',
      relationship: 'Ojciec'
    },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-003',
    name: 'Tomasz Wiśniewski',
    email: 'tomasz.wisniewski@wp.pl',
    phone: '+48 58 345 67 89',
    address: {
      street: 'ul. Długa 789',
      city: 'Gdańsk',
      postalCode: '80-827',
      country: 'Polska'
    },
    contractType: 'contractor',
    salary: 6500,
    currency: 'PLN',
    licenseNumber: 'PL456789123',
    licenseExpiry: new Date(2027, 3, 20),
    hireDate: new Date(2021, 6, 10),
    currentLocation: {
      lat: 54.3520,
      lng: 18.6466,
      address: 'Centrum Logistyczne Gdańsk',
    },
    status: 'resting',
    emergencyContact: {
      name: 'Katarzyna Wiśniewska',
      phone: '+48 58 456 78 90',
      relationship: 'Siostra'
    },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-004',
    name: 'Agnieszka Wójcik',
    email: 'agnieszka.wojcik@interia.pl',
    phone: '+48 61 456 78 90',
    address: {
      street: 'ul. Święty Marcin 321',
      city: 'Poznań',
      postalCode: '61-806',
      country: 'Polska'
    },
    contractType: 'full-time',
    salary: 8000,
    currency: 'PLN',
    licenseNumber: 'PL789123456',
    licenseExpiry: new Date(2026, 8, 10),
    hireDate: new Date(2018, 4, 20),
    currentLocation: {
      lat: 52.4064,
      lng: 16.9252,
      address: 'Lotnisko Poznań-Ławica Cargo',
    },
    status: 'on-route',
    emergencyContact: {
      name: 'Marek Wójcik',
      phone: '+48 61 567 89 01',
      relationship: 'Mąż'
    },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-005',
    name: 'Paweł Kaczmarek',
    email: 'pawel.kaczmarek@o2.pl',
    phone: '+48 71 567 89 01',
    address: {
      street: 'ul. Rynek 654',
      city: 'Wrocław',
      postalCode: '50-101',
      country: 'Polska'
    },
    contractType: 'contractor',
    salary: 6200,
    currency: 'PLN',
    licenseNumber: 'PL321654987',
    licenseExpiry: new Date(2025, 1, 5),
    hireDate: new Date(2022, 0, 15),
    status: 'off-duty',
    emergencyContact: {
      name: 'Magdalena Kaczmarek',
      phone: '+48 71 678 90 12',
      relationship: 'Córka'
    },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-006',
    name: 'Krystyna Zielińska',
    email: 'k.zielinska@example.com',
    phone: '+48 22 555 0101',
    address: { street: 'ul. Prosta 1', city: 'Warszawa', postalCode: '00-850', country: 'Polska' },
    contractType: 'full-time',
    salary: 7500,
    currency: 'PLN',
    licenseNumber: 'PLZ789012',
    licenseExpiry: new Date(2027, 8, 1),
    hireDate: new Date(2021, 1, 15),
    status: 'active',
    emergencyContact: { name: 'Adam Zieliński', phone: '+48 22 555 0102', relationship: 'Mąż' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-007',
    name: 'Marek Szymański',
    email: 'm.szymanski@example.com',
    phone: '+48 12 555 0202',
    address: { street: 'ul. Wawelska 5', city: 'Kraków', postalCode: '30-001', country: 'Polska' },
    contractType: 'contractor',
    salary: 6800,
    currency: 'PLN',
    licenseNumber: 'PLS123456',
    licenseExpiry: new Date(2025, 4, 20),
    hireDate: new Date(2022, 5, 1),
    status: 'on-route',
    currentLocation: { lat: 50.05, lng: 19.92, address: 'A4 near Kraków' },
    emergencyContact: { name: 'Ewa Szymańska', phone: '+48 12 555 0203', relationship: 'Żona' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-008',
    name: 'Elżbieta Dąbrowska',
    email: 'e.dabrowska@example.com',
    phone: '+48 58 555 0303',
    address: { street: 'ul. Neptuna 10', city: 'Gdańsk', postalCode: '80-500', country: 'Polska' },
    contractType: 'full-time',
    salary: 8200,
    currency: 'PLN',
    licenseNumber: 'PLD456789',
    licenseExpiry: new Date(2028, 1, 10),
    hireDate: new Date(2019, 10, 5),
    status: 'resting',
    emergencyContact: { name: 'Jan Dąbrowski', phone: '+48 58 555 0304', relationship: 'Syn' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-009',
    name: 'Grzegorz Lewandowski',
    email: 'g.lewandowski@example.com',
    phone: '+48 61 555 0404',
    address: { street: 'ul. Kozia 20', city: 'Poznań', postalCode: '61-875', country: 'Polska' },
    contractType: 'full-time',
    salary: 7900,
    currency: 'PLN',
    licenseNumber: 'PLL789123',
    licenseExpiry: new Date(2026, 6, 30),
    hireDate: new Date(2020, 7, 20),
    status: 'off-duty',
    emergencyContact: { name: 'Anna Lewandowska', phone: '+48 61 555 0405', relationship: 'Żona' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-010',
    name: 'Zofia Woźniak',
    email: 'z.wozniak@example.com',
    phone: '+48 71 555 0505',
    address: { street: 'ul. Odrzańska 30', city: 'Wrocław', postalCode: '50-114', country: 'Polska' },
    contractType: 'contractor',
    salary: 6300,
    currency: 'PLN',
    licenseNumber: 'PLW123789',
    licenseExpiry: new Date(2025, 9, 15),
    hireDate: new Date(2023, 2, 10),
    status: 'active',
    emergencyContact: { name: 'Piotr Woźniak', phone: '+48 71 555 0506', relationship: 'Brat' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-011',
    name: 'Andrzej Kozłowski',
    email: 'a.kozlowski@example.com',
    phone: '+48 42 555 0606',
    address: { street: 'ul. Piotrkowska 100', city: 'Łódź', postalCode: '90-001', country: 'Polska' },
    contractType: 'full-time',
    salary: 7300,
    currency: 'PLN',
    licenseNumber: 'PLK789456',
    licenseExpiry: new Date(2027, 11, 5),
    hireDate: new Date(2021, 8, 1),
    status: 'on-route',
    currentLocation: { lat: 51.77, lng: 19.45, address: 'S14 near Łódź' },
    emergencyContact: { name: 'Katarzyna Kozłowska', phone: '+48 42 555 0607', relationship: 'Żona' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-012',
    name: 'Barbara Jankowska',
    email: 'b.jankowska@example.com',
    phone: '+48 91 555 0707',
    address: { street: 'ul. Wały Chrobrego 2', city: 'Szczecin', postalCode: '70-500', country: 'Polska' },
    contractType: 'full-time',
    salary: 8100,
    currency: 'PLN',
    licenseNumber: 'PLJ456123',
    licenseExpiry: new Date(2028, 5, 25),
    hireDate: new Date(2018, 12, 1),
    status: 'active',
    emergencyContact: { name: 'Tomasz Jankowski', phone: '+48 91 555 0708', relationship: 'Mąż' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-013',
    name: 'Piotr Mazur',
    email: 'p.mazur@example.com',
    phone: '+48 81 555 0808',
    address: { street: 'ul. Krakowskie Przedmieście 50', city: 'Lublin', postalCode: '20-002', country: 'Polska' },
    contractType: 'contractor',
    salary: 6900,
    currency: 'PLN',
    licenseNumber: 'PLM789789',
    licenseExpiry: new Date(2026, 2, 12),
    hireDate: new Date(2022, 9, 18),
    status: 'resting',
    emergencyContact: { name: 'Alicja Mazur', phone: '+48 81 555 0809', relationship: 'Siostra' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-014',
    name: 'Jadwiga Kamińska',
    email: 'j.kaminska@example.com',
    phone: '+48 32 555 0909',
    address: { street: 'ul. Mariacka 15', city: 'Katowice', postalCode: '40-014', country: 'Polska' },
    contractType: 'full-time',
    salary: 7600,
    currency: 'PLN',
    licenseNumber: 'PLK123123',
    licenseExpiry: new Date(2027, 7, 22),
    hireDate: new Date(2020, 3, 30),
    status: 'off-duty',
    emergencyContact: { name: 'Krzysztof Kamiński', phone: '+48 32 555 0910', relationship: 'Mąż' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-015',
    name: 'Stanisław Głowacki',
    email: 's.glowacki@example.com',
    phone: '+48 52 555 1010',
    address: { street: 'ul. Gdańska 25', city: 'Bydgoszcz', postalCode: '85-005', country: 'Polska' },
    contractType: 'contractor',
    salary: 6400,
    currency: 'PLN',
    licenseNumber: 'PLG789456',
    licenseExpiry: new Date(2025, 10, 1),
    hireDate: new Date(2023, 1, 25),
    status: 'active',
    emergencyContact: { name: 'Henryk Głowacki', phone: '+48 52 555 1011', relationship: 'Ojciec' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-016',
    name: 'Teresa Zając',
    email: 't.zajac@example.com',
    phone: '+48 41 555 1111',
    address: { street: 'ul. Sienkiewicza 70', city: 'Kielce', postalCode: '25-501', country: 'Polska' },
    contractType: 'full-time',
    salary: 7100,
    currency: 'PLN',
    licenseNumber: 'PLZ456456',
    licenseExpiry: new Date(2028, 3, 14),
    hireDate: new Date(2021, 4, 11),
    status: 'on-route',
    currentLocation: { lat: 50.87, lng: 20.63, address: 'S7 near Kielce' },
    emergencyContact: { name: 'Weronika Zając', phone: '+48 41 555 1112', relationship: 'Córka' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-017',
    name: 'Michał Walczak',
    email: 'm.walczak@example.com',
    phone: '+48 85 555 1212',
    address: { street: 'ul. Lipowa 35', city: 'Białystok', postalCode: '15-424', country: 'Polska' },
    contractType: 'full-time',
    salary: 7800,
    currency: 'PLN',
    licenseNumber: 'PLW789789',
    licenseExpiry: new Date(2026, 9, 9),
    hireDate: new Date(2019, 6, 6),
    status: 'active',
    emergencyContact: { name: 'Oskar Walczak', phone: '+48 85 555 1213', relationship: 'Syn' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-018',
    name: 'Danuta Sikora',
    email: 'd.sikora@example.com',
    phone: '+48 89 555 1313',
    address: { street: 'ul. Stare Miasto 1', city: 'Olsztyn', postalCode: '10-026', country: 'Polska' },
    contractType: 'contractor',
    salary: 6700,
    currency: 'PLN',
    licenseNumber: 'PLS456789',
    licenseExpiry: new Date(2025, 3, 3),
    hireDate: new Date(2022, 11, 11),
    status: 'resting',
    emergencyContact: { name: 'Ryszard Sikora', phone: '+48 89 555 1314', relationship: 'Mąż' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-019',
    name: 'Robert Witkowski',
    email: 'r.witkowski@example.com',
    phone: '+48 48 555 1414',
    address: { street: 'ul. Żeromskiego 80', city: 'Radom', postalCode: '26-600', country: 'Polska' },
    contractType: 'full-time',
    salary: 7400,
    currency: 'PLN',
    licenseNumber: 'PLW456123',
    licenseExpiry: new Date(2027, 10, 19),
    hireDate: new Date(2020, 1, 29),
    status: 'off-duty',
    emergencyContact: { name: 'Grażyna Witkowska', phone: '+48 48 555 1415', relationship: 'Żona' },
    routes: [],
    calendarEvents: []
  },
  {
    id: 'driver-020',
    name: 'Irena Pawlak',
    email: 'i.pawlak@example.com',
    phone: '+48 15 555 1515',
    address: { street: 'ul. Mickiewicza 40', city: 'Tarnobrzeg', postalCode: '39-400', country: 'Polska' },
    contractType: 'contractor',
    salary: 6600,
    currency: 'PLN',
    licenseNumber: 'PLP123789',
    licenseExpiry: new Date(2026, 1, 28),
    hireDate: new Date(2023, 4, 15),
    status: 'active',
    emergencyContact: { name: 'Dariusz Pawlak', phone: '+48 15 555 1516', relationship: 'Mąż' },
    routes: [],
    calendarEvents: []
  }
];

// Generate routes and calendar events for each driver
mockDrivers.forEach(driver => {
  driver.routes = generateDriverRoutes(driver.id);
  driver.calendarEvents = generateCalendarEvents(driver.routes);
});

export const mockGetDrivers = (filters?: {
  status?: Driver['status'];
  contractType?: Driver['contractType'];
  search?: string;
}): Driver[] => {
  let drivers = [...mockDrivers];
      
  if (filters) {
    if (filters.status) {
      drivers = drivers.filter(driver => driver.status === filters.status);
    }
    if (filters.contractType) {
      drivers = drivers.filter(driver => driver.contractType === filters.contractType);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      drivers = drivers.filter(driver => 
        driver.name.toLowerCase().includes(searchLower) ||
        driver.email.toLowerCase().includes(searchLower) ||
        driver.phone.includes(filters.search!)
      );
    }
  }
  
  return drivers;
}

export const mockGetDriverDetails = (id: string): Driver | null => {
  const driver = mockDrivers.find(d => d.id === id) || null;
  return driver;
}

export const mockGetDriverShipments = (id: Driver['id']): UIShipment[] => {
  const driver = mockDrivers.find(d => d.id === id);
  if (!driver) return [];
  const shipments = getMockShipments({ driver: driver.name });
  return shipments.map(shipment => ({
    id: shipment.id,
    driver: shipment.route.vehicle.driver,
    status: shipment.route.status,
    origin: shipment.route.points[0]?.name || 'N/A',
    destination: shipment.route.points[shipment.route.points.length - 1]?.name || 'N/A',
    eta: shipment.route.estimatedCompletion.toLocaleString(),
  }));
}

export const mockFetchDriverRoutes = (id: string): Driver['routes'] => {
  const driver = mockDrivers.find(d => d.id === id);
  if (!driver) {
    throw new Error('Driver not found');
  }
  return driver.routes;
};

export const mockFetchDriverCalendar = (id: string): Driver['calendarEvents'] => {
  const driver = mockDrivers.find(d => d.id === id);
  if (!driver) {
    throw new Error('Driver not found');
  }
  return driver.calendarEvents;
};

export const mockUpdateDriver = (id: string, updates: Partial<Driver>): Driver => {
  const existingDriver = mockDrivers.find(d => d.id === id);
  if (!existingDriver) {
    throw new Error('Driver not found');
  }
  
  const updatedDriver: Driver = {
    ...existingDriver,
    ...updates
  };
  
  return updatedDriver;
};

export const mockUpdateDriverStatus = (id: string, status: Driver['status']): Driver => {
  const existingDriver = mockDrivers.find(d => d.id === id);
  if (!existingDriver) {
    throw new Error('Driver not found');
  }
  
  const updatedDriver: Driver = {
    ...existingDriver,
    status
  };
  
  return updatedDriver;
};
