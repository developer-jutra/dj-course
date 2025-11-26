import { Vehicle } from './vehicle.types';

export const vehicles: Vehicle[] = [
  {
    id: 'vehicle-001',
    plateNumber: 'WA-LOG 2024',
    make: 'Mercedes-Benz',
    model: 'Actros 1851',
    year: 2022,
    type: 'standard',
    status: 'available',
    mileage: 125000,
    capacity: {
      weight: 26,
      volume: 90
    },
    cargoTypes: ['ogólne', 'paletowe', 'suche'],
    currentDriver: 'Jan Kowalski',
    currentLocation: {
      lat: 52.2297,
      lng: 21.0122,
      address: 'Centrum Dystrybucji Warszawa',
    },
    ownership: {
      type: 'owned',
      purchaseDate: new Date(2022, 2, 15),
      purchasePrice: 480000
    },
    documents: [
      {
        id: 'doc-001-1',
        type: 'registration',
        number: 'REJ-WA-LOG-2024',
        issueDate: new Date(2022, 2, 15),
        expiryDate: new Date(2025, 2, 15),
        issuingAuthority: 'Wydział Komunikacji Warszawa'
      },
      {
        id: 'doc-001-2',
        type: 'insurance',
        number: 'UB-001-2024',
        issueDate: new Date(2024, 0, 1),
        expiryDate: new Date(2025, 0, 1),
        issuingAuthority: 'PZU Ubezpieczenia'
      },
      {
        id: 'doc-001-3',
        type: 'inspection',
        number: 'PKD-001-2024',
        issueDate: new Date(2024, 5, 10),
        expiryDate: new Date(2025, 5, 10),
        issuingAuthority: 'Stacja Kontroli Pojazdów'
      }
    ],
    maintenanceHistory: [
      {
        id: 'maint-001-1',
        date: '2024-10-15T00:00:00.000Z',
        type: 'routine',
        description: 'Przegląd okresowy - wymiana oleju, filtrów',
        cost: 1800,
        mileage: 124500,
        duration: 3,
        serviceProvider: 'Serwis Mercedes Warszawa',
        technician: 'Marek Kowalczyk',
        status: 'completed',
        notes: 'Wszystkie systemy sprawdzone, brak usterek'
      },
      {
        id: 'maint-001-2',
        date: '2024-09-08T00:00:00.000Z',
        type: 'repair',
        description: 'Wymiana klocków hamulcowych',
        cost: 2720,
        mileage: 123800,
        duration: 4,
        serviceProvider: 'Serwis Mercedes Warszawa',
        technician: 'Anna Nowak',
        status: 'completed',
        notes: 'Wymieniono przednie klocki hamulcowe, płyn hamulcowy'
      },
      {
        id: 'maint-001-3',
        date: '2024-08-22T00:00:00.000Z',
        type: 'inspection',
        description: 'Roczny przegląd techniczny',
        cost: 480,
        mileage: 123200,
        duration: 2,
        serviceProvider: 'Stacja Kontroli Pojazdów',
        technician: 'Piotr Wiśniewski',
        status: 'completed',
        notes: 'Przegląd zaliczony bez usterek'
      }
    ],
    maintenanceTasks: [
      {
        id: 'task-001-1',
        description: 'Wymiana oleju silnikowego',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedCost: 500,
        estimatedDuration: 2,
        status: 'pending',
        type: 'routine',
        assignedTo: 'Marek Kowalczyk',
        notes: 'Standardowa wymiana co 15 000 km'
      },
      {
        id: 'task-001-2',
        description: 'Kontrola układu hamulcowego',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedCost: 300,
        estimatedDuration: 1,
        status: 'overdue',
        type: 'inspection',
        assignedTo: 'Anna Nowak',
        notes: 'Pilna kontrola po zgłoszeniu kierowcy'
      }
    ]
  },
  {
    id: 'vehicle-002',
    plateNumber: 'GD-EX 1234',
    make: 'Volvo',
    model: 'FH16 750',
    year: 2021,
    type: 'tir',
    status: 'in-transit',
    mileage: 180000,
    capacity: {
      weight: 40,
      volume: 120
    },
    cargoTypes: ['ogólne', 'paletowe', 'międzynarodowe'],
    currentDriver: 'Maria Nowak',
    currentLocation: {
      lat: 52.5200,
      lng: 13.4050,
      address: 'Berlin, Germany',
    },
    ownership: {
      type: 'leased',
      leaseStart: new Date(2021, 5, 1),
      leaseEnd: new Date(2026, 5, 1),
      monthlyPayment: 11200,
      leasingCompany: 'Volvo Financial Services'
    },
    documents: [
      {
        id: 'doc-002-1',
        type: 'registration',
        number: 'REJ-GD-EX-1234',
        issueDate: new Date(2021, 5, 1),
        expiryDate: new Date(2024, 5, 1),
        issuingAuthority: 'Wydział Komunikacji Gdańsk'
      },
      {
        id: 'doc-002-2',
        type: 'insurance',
        number: 'UB-002-2024',
        issueDate: new Date(2024, 0, 1),
        expiryDate: new Date(2025, 0, 1),
        issuingAuthority: 'Warta Ubezpieczenia'
      },
      {
        id: 'doc-002-3',
        type: 'tir-carnet',
        number: 'TIR-002-2024',
        issueDate: new Date(2024, 2, 1),
        expiryDate: new Date(2025, 2, 1),
        issuingAuthority: 'Polski Związek Motorowy'
      }
    ],
    maintenanceHistory: [
      {
        id: 'maint-002-1',
        date: '2024-10-20T00:00:00.000Z',
        type: 'routine',
        description: 'Główny serwis - 180 tys. km',
        cost: 4800,
        mileage: 180000,
        duration: 8,
        serviceProvider: 'Serwis Volvo Gdańsk',
        technician: 'Erik Larsson',
        status: 'completed',
        notes: 'Kompletny serwis silnika, wymiana wszystkich płynów'
      },
      {
        id: 'maint-002-2',
        date: '2024-08-15T00:00:00.000Z',
        type: 'repair',
        description: 'Naprawa skrzyni biegów',
        cost: 10000,
        mileage: 178500,
        duration: 12,
        serviceProvider: 'Serwis Volvo Gdańsk',
        technician: 'Erik Larsson',
        status: 'completed',
        notes: 'Wymiana sprzęgła skrzyni, test OK'
      },
      {
        id: 'maint-002-3',
        date: '2024-06-10T00:00:00.000Z',
        type: 'emergency',
        description: 'Naprawa układu pneumatycznego',
        cost: 3500,
        mileage: 175000,
        duration: 6,
        serviceProvider: 'Serwis Mobilny 24h',
        technician: 'Janusz Szybki',
        status: 'completed',
        notes: 'Nagła awaria na autostradzie A1'
      }
    ],
    maintenanceTasks: [
      {
        id: 'task-002-1',
        description: 'Wymiana opon na zimowe',
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedCost: 2000,
        estimatedDuration: 4,
        status: 'pending',
        type: 'routine',
        assignedTo: 'Serwis Oponiarski "Gumex"',
        notes: 'Komplet opon zimowych Michelin'
      },
      {
        id: 'task-002-2',
        description: 'Naprawa oświetlenia naczepy',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedCost: 400,
        estimatedDuration: 1.5,
        status: 'overdue',
        type: 'repair',
        assignedTo: 'Elektryk zakładowy',
        notes: 'Spalona lewa lampa stopu'
      }
    ]
  },
  {
    id: 'vehicle-003',
    plateNumber: 'PO-VW 5678',
    make: 'Scania',
    model: 'R 450',
    year: 2020,
    type: 'refrigerated',
    status: 'maintenance',
    mileage: 220000,
    capacity: {
      weight: 24,
      volume: 80
    },
    cargoTypes: ['chłodnicze', 'mrożone', 'farmaceutyczne'],
    currentDriver: 'Tomasz Wiśniewski',
    currentLocation: {
      lat: 47.4979,
      lng: 19.0402,
      address: 'Budapest, Hungary',
    },
    ownership: {
      type: 'financed',
      loanAmount: 380000,
      monthlyPayment: 7400,
      loanStart: new Date(2020, 8, 1),
      loanEnd: new Date(2025, 8, 1),
      bank: 'PKO Bank Polski'
    },
    documents: [
      {
        id: 'doc-003-1',
        type: 'registration',
        number: 'REJ-PO-VW-5678',
        issueDate: new Date(2020, 8, 1),
        expiryDate: new Date(2023, 8, 1),
        issuingAuthority: 'Wydział Komunikacji Poznań'
      },
      {
        id: 'doc-003-2',
        type: 'insurance',
        number: 'UB-003-2024',
        issueDate: new Date(2024, 0, 1),
        expiryDate: new Date(2025, 0, 1),
        issuingAuthority: 'Generali Ubezpieczenia'
      },
      {
        id: 'doc-003-3',
        type: 'adr',
        number: 'ADR-003-2024',
        issueDate: new Date(2024, 3, 1),
        expiryDate: new Date(2025, 3, 1),
        issuingAuthority: 'Urząd Transportu Drogowego'
      }
    ],
    maintenanceHistory: [
      {
        id: 'maint-003-1',
        date: '2024-10-25T00:00:00.000Z',
        type: 'repair',
        description: 'Naprawa agregatu chłodniczego',
        cost: 12800,
        mileage: 220000,
        duration: 16,
        serviceProvider: 'Serwis Carrier Poznań',
        technician: 'Jan Chłodny',
        status: 'in-progress',
        notes: 'Wymiana sprężarki w toku'
      },
      {
        id: 'maint-003-2',
        date: '2024-09-10T00:00:00.000Z',
        type: 'routine',
        description: 'Przegląd okresowy i kontrola',
        cost: 3400,
        mileage: 218500,
        duration: 6,
        serviceProvider: 'Serwis Scania Poznań',
        technician: 'Sven Andersson',
        status: 'completed',
        notes: 'Wszystkie systemy OK oprócz agregatu'
      }
    ],
    maintenanceTasks: [
      {
        id: 'task-003-1',
        description: 'Dokończenie naprawy agregatu chłodniczego',
        dueDate: '2024-10-28T00:00:00.000Z',
        estimatedCost: 12800,
        estimatedDuration: 16,
        status: 'in-progress',
        type: 'emergency',
        assignedTo: 'Jan Chłodny',
        notes: 'Krytyczne dla transportu chłodniczego'
      },
      {
        id: 'task-003-2',
        description: 'Kalibracja systemu monitoringu temperatury',
        dueDate: '2024-11-05T00:00:00.000Z',
        estimatedCost: 800,
        estimatedDuration: 2,
        status: 'pending',
        type: 'routine',
        assignedTo: 'Jan Chłodny',
        notes: 'Wymagane po naprawie chłodzenia'
      }
    ]
  },
  {
    id: 'vehicle-004',
    plateNumber: 'LD-SIE 9012',
    make: 'MAN',
    model: 'TGX 18.500',
    year: 2023,
    type: 'hazmat',
    status: 'available',
    mileage: 45000,
    capacity: {
      weight: 26,
      volume: 85
    },
    cargoTypes: ['materiały-niebezpieczne', 'chemikalia', 'towary-niebezpieczne'],
    currentDriver: 'Agnieszka Wójcik',
    currentLocation: {
      lat: 44.4268,
      lng: 26.1025,
      address: 'Bucharest, Romania',
    },
    ownership: {
      type: 'owned',
      purchaseDate: new Date(2023, 1, 10),
      purchasePrice: 540000
    },
    documents: [
      {
        id: 'doc-004-1',
        type: 'registration',
        number: 'REJ-LD-SIE-9012',
        issueDate: new Date(2023, 1, 10),
        expiryDate: new Date(2026, 1, 10),
        issuingAuthority: 'Wydział Komunikacji Łódź'
      },
      {
        id: 'doc-004-2',
        type: 'insurance',
        number: 'UB-004-2024',
        issueDate: new Date(2024, 0, 1),
        expiryDate: new Date(2025, 0, 1),
        issuingAuthority: 'Ergo Hestia Ubezpieczenia'
      },
      {
        id: 'doc-004-3',
        type: 'adr',
        number: 'ADR-004-2024',
        issueDate: new Date(2024, 1, 1),
        expiryDate: new Date(2025, 1, 1),
        issuingAuthority: 'Urząd Transportu Drogowego'
      },
      {
        id: 'doc-004-4',
        type: 'hazmat-permit',
        number: 'MAT-004-2024',
        issueDate: new Date(2024, 0, 15),
        expiryDate: new Date(2025, 0, 15),
        issuingAuthority: 'Główny Inspektorat Transportu Drogowego'
      }
    ],
    maintenanceHistory: [
      {
        id: 'maint-004-1',
        date: '2024-09-05T00:00:00.000Z',
        type: 'routine',
        description: 'Pierwszy główny przegląd',
        cost: 2600,
        mileage: 40000,
        duration: 4,
        serviceProvider: 'Serwis MAN Łódź',
        technician: 'Wolfgang Bauer',
        status: 'completed',
        notes: 'Pojazd w doskonałym stanie'
      },
      {
        id: 'maint-004-2',
        date: '2024-06-20T00:00:00.000Z',
        type: 'inspection',
        description: 'Kontrola wyposażenia do materiałów niebezpiecznych',
        cost: 1200,
        mileage: 35000,
        duration: 3,
        serviceProvider: 'Serwis Kontroli Materiałów Niebezpiecznych',
        technician: 'Dr. Bezpieczeństwo Chemiczne',
        status: 'completed',
        notes: 'Całe wyposażenie bezpieczeństwa certyfikowane'
      }
    ],
    maintenanceTasks: [
      {
        id: 'task-004-1',
        description: 'Roczna certyfikacja wyposażenia do materiałów niebezpiecznych',
        dueDate: '2025-06-20T00:00:00.000Z',
        estimatedCost: 1400,
        estimatedDuration: 3,
        status: 'pending',
        type: 'routine',
        assignedTo: 'Dr. Bezpieczeństwo Chemiczne',
        notes: 'Wymagana roczna certyfikacja bezpieczeństwa'
      },
      {
        id: 'task-004-2',
        description: 'Kontrola systemu gaśniczego',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedCost: 600,
        estimatedDuration: 2,
        status: 'pending',
        type: 'inspection',
        assignedTo: 'Straż Pożarna - Dział Prewencji',
        notes: 'Coroczna kontrola sprzętu gaśniczego'
      },
      {
        id: 'task-004-3',
        description: 'Wymiana uszczelek w zaworach',
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedCost: 1200,
        estimatedDuration: 4,
        status: 'overdue',
        type: 'repair',
        assignedTo: 'Serwis Specjalistyczny "Chem-Tech"',
        notes: 'Wykryto drobne nieszczelności'
      }
    ]
  },
  {
    id: 'vehicle-005',
    plateNumber: 'WR-DHL 3456',
    make: 'DAF',
    model: 'XF 480',
    year: 2021,
    type: 'container',
    status: 'available',
    mileage: 160000,
    capacity: {
      weight: 44,
      volume: 140
    },
    cargoTypes: ['kontenery', 'intermodalne', 'ogólne'],
    currentDriver: 'Paweł Kaczmarek',
    currentLocation: {
      lat: 48.3794,
      lng: 31.1656,
      address: 'Kropyvnytskyi, Ukraine',
    },
    ownership: {
      type: 'leased',
      rentalStart: new Date(2024, 0, 1),
      rentalEnd: new Date(2024, 11, 31),
      monthlyPayment: 8800,
      rentalCompany: 'DAF Rental Services'
    },
    documents: [
      {
        id: 'doc-005-1',
        type: 'registration',
        number: 'REJ-WR-DHL-3456',
        issueDate: new Date(2021, 3, 15),
        expiryDate: new Date(2024, 3, 15),
        issuingAuthority: 'Wydział Komunikacji Wrocław'
      },
      {
        id: 'doc-005-2',
        type: 'insurance',
        number: 'UB-005-2024',
        issueDate: new Date(2024, 0, 1),
        expiryDate: new Date(2025, 0, 1),
        issuingAuthority: 'Compensa Ubezpieczenia'
      }
    ],
    maintenanceHistory: [
      {
        id: 'maint-005-1',
        date: '2024-08-30T00:00:00.000Z',
        type: 'routine',
        description: 'Przegląd okresowy',
        cost: 3000,
        mileage: 158000,
        duration: 5,
        serviceProvider: 'Serwis DAF Wrocław',
        technician: 'Jan van der Berg',
        status: 'completed',
        notes: 'Wszystkie systemy działają prawidłowo'
      }
    ],
    maintenanceTasks: [
      {
        id: 'task-005-1',
        description: 'Smarowanie mechanizmu podnoszenia',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedCost: 300,
        estimatedDuration: 1,
        status: 'pending',
        type: 'routine',
        assignedTo: 'Jan van der Berg'
      }
    ]
  },
  {
    id: 'vehicle-006',
    plateNumber: 'KR-TAN 7890',
    make: 'Iveco',
    model: 'Stralis NP 460',
    year: 2022,
    type: 'tanker',
    status: 'out-of-service',
    mileage: 95000,
    capacity: {
      weight: 40,
      volume: 35
    },
    cargoTypes: ['płyny', 'paliwo', 'chemikalia'],
    currentLocation: {
      lat: 50.0647,
      lng: 19.9450,
      address: 'Serwis Kraków',
    },
    ownership: {
      type: 'leased',
      leaseStart: new Date(2022, 4, 1),
      leaseEnd: new Date(2027, 4, 1),
      monthlyPayment: 12800,
      leasingCompany: 'Iveco Capital'
    },
    documents: [
      {
        id: 'doc-006-1',
        type: 'registration',
        number: 'REJ-KR-TAN-7890',
        issueDate: new Date(2022, 4, 1),
        expiryDate: new Date(2025, 4, 1),
        issuingAuthority: 'Wydział Komunikacji Kraków'
      },
      {
        id: 'doc-006-2',
        type: 'insurance',
        number: 'UB-006-2024',
        issueDate: new Date(2024, 0, 1),
        expiryDate: new Date(2025, 0, 1),
        issuingAuthority: 'Uniqa Ubezpieczenia'
      },
      {
        id: 'doc-006-3',
        type: 'adr',
        number: 'ADR-006-2024',
        issueDate: new Date(2024, 2, 1),
        expiryDate: new Date(2025, 2, 1),
        issuingAuthority: 'Urząd Transportu Drogowego'
      }
    ],
    maintenanceHistory: [
      {
        id: 'maint-006-1',
        date: '2024-10-22T00:00:00.000Z',
        type: 'emergency',
        description: 'Awaria silnika - główna naprawa',
        cost: 34000,
        mileage: 95000,
        duration: 48,
        serviceProvider: 'Serwis Iveco Kraków',
        technician: 'Marco Rossi',
        status: 'in-progress',
        notes: 'Wymagana przebudowa silnika, części w zamówieniu'
      },
      {
        id: 'maint-006-2',
        date: '2024-07-15T00:00:00.000Z',
        type: 'inspection',
        description: 'Test ciśnienia zbiornika',
        cost: 1800,
        mileage: 92000,
        duration: 4,
        serviceProvider: 'Serwis Kontroli Zbiorników',
        technician: 'Inspektor Bezpieczeństwa',
        status: 'completed',
        notes: 'Zbiornik certyfikowany na kolejny rok'
      }
    ],
    maintenanceTasks: [
      {
        id: 'task-006-1',
        description: 'Dokończenie przebudowy silnika',
        dueDate: '2024-11-01T00:00:00.000Z',
        estimatedCost: 34000,
        estimatedDuration: 48,
        status: 'in-progress',
        type: 'emergency',
        assignedTo: 'Marco Rossi',
        notes: 'Krytyczna naprawa - pojazd poza eksploatacją'
      },
      {
        id: 'task-006-2',
        description: 'Kontrola bezpieczeństwa po naprawie',
        dueDate: '2024-11-05T00:00:00.000Z',
        estimatedCost: 800,
        estimatedDuration: 3,
        status: 'pending',
        type: 'inspection',
        assignedTo: 'Inspektor Bezpieczeństwa',
        notes: 'Wymagane przed powrotem do eksploatacji'
      },
      {
        id: 'task-006-3',
        description: 'Testy drogowe po naprawie silnika',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedCost: 1000,
        estimatedDuration: 8,
        status: 'in-progress',
        type: 'inspection',
        assignedTo: 'Marco Rossi',
        notes: 'Sprawdzenie osiągów i zużycia paliwa'
      }
    ]
  },
  {
    id: 'vehicle-007',
    plateNumber: 'KR-TRK 777',
    make: 'DAF',
    model: 'XF 480',
    year: 2021,
    type: 'box-truck',
    status: 'available',
    mileage: 150000,
    capacity: { weight: 18, volume: 55 },
    cargoTypes: ['drobnicowe', 'kurierskie'],
    currentDriver: 'Marek Szymański',
    currentLocation: { lat: 50.061, lng: 19.937, address: 'Rynek Główny, Kraków' },
    ownership: { type: 'owned', purchaseDate: new Date(2021, 6, 1), purchasePrice: 420000 },
    documents: [],
    maintenanceHistory: [],
    maintenanceTasks: []
  },
  {
    id: 'vehicle-008',
    plateNumber: 'SZ-LKW 888',
    make: 'Renault',
    model: 'T High 520',
    year: 2022,
    type: 'heavy-haul',
    status: 'in-transit',
    mileage: 95000,
    capacity: { weight: 60, volume: 0 },
    cargoTypes: ['ponadgabarytowe', 'maszyny budowlane'],
    currentDriver: 'Elżbieta Dąbrowska',
    currentLocation: { lat: 53.428, lng: 14.552, address: 'A6 koło Szczecina' },
    ownership: { type: 'leased', leaseStart: new Date(2022, 1, 1), leaseEnd: new Date(2027, 1, 1), monthlyPayment: 13000, leasingCompany: 'Renault Trucks Financial' },
    documents: [],
    maintenanceHistory: [],
    maintenanceTasks: []
  },
  {
    id: 'vehicle-009',
    plateNumber: 'LU-TR 999',
    make: 'Iveco',
    model: 'S-Way',
    year: 2021,
    type: 'tanker',
    status: 'available',
    mileage: 160000,
    capacity: { weight: 25, volume: 30 },
    cargoTypes: ['paliwa', 'chemia płynna'],
    currentDriver: 'Grzegorz Lewandowski',
    currentLocation: { lat: 51.246, lng: 22.568, address: 'Terminal paliwowy, Lublin' },
    ownership: { type: 'owned', purchaseDate: new Date(2021, 8, 15), purchasePrice: 460000 },
    documents: [],
    maintenanceHistory: [],
    maintenanceTasks: []
  },
  {
    id: 'vehicle-010',
    plateNumber: 'KT-CAR 101',
    make: 'Ford',
    model: 'F-Max',
    year: 2022,
    type: 'standard',
    status: 'available',
    mileage: 80000,
    capacity: { weight: 26, volume: 90 },
    cargoTypes: ['ogólne', 'AGD'],
    currentDriver: 'Zofia Woźniak',
    currentLocation: { lat: 50.264, lng: 19.023, address: 'MOP Katowice' },
    ownership: { type: 'financed', loanStart: new Date(2022, 3, 1), loanEnd: new Date(2027, 3, 1), monthlyPayment: 8000, bank: 'Santander Consumer Bank' },
    documents: [],
    maintenanceHistory: [],
    maintenanceTasks: []
  },
  {
    id: 'vehicle-011',
    plateNumber: 'BI-TR 112',
    make: 'MAN',
    model: 'TGX 18.510',
    year: 2023,
    type: 'container',
    status: 'in-transit',
    mileage: 45000,
    capacity: { weight: 28, volume: 0 },
    cargoTypes: ['kontenery 20ft', 'kontenery 40ft'],
    currentDriver: 'Andrzej Kozłowski',
    currentLocation: { lat: 53.132, lng: 23.168, address: 'Terminal kontenerowy, Białystok' },
    ownership: { type: 'owned', purchaseDate: new Date(2023, 1, 10), purchasePrice: 550000 },
    documents: [],
    maintenanceHistory: [],
    maintenanceTasks: []
  },
  {
    id: 'vehicle-012',
    plateNumber: 'RZE-GO 123',
    make: 'Volvo',
    model: 'FM 460',
    year: 2020,
    type: 'flatbed',
    status: 'available',
    mileage: 250000,
    capacity: { weight: 22, volume: 0 },
    cargoTypes: ['stal', 'drewno', 'materiały budowlane'],
    currentDriver: 'Barbara Jankowska',
    currentLocation: { lat: 50.041, lng: 21.999, address: 'Huta, Rzeszów' },
    ownership: { type: 'owned', purchaseDate: new Date(2020, 5, 20), purchasePrice: 380000 },
    documents: [],
    maintenanceHistory: [],
    maintenanceTasks: []
  },
  {
    id: 'vehicle-013',
    plateNumber: 'OLS-AUTO 456',
    make: 'Mercedes-Benz',
    model: 'Atego 1224',
    year: 2022,
    type: 'box-truck',
    status: 'maintenance',
    mileage: 110000,
    capacity: { weight: 12, volume: 40 },
    cargoTypes: ['meble', 'elektronika'],
    currentDriver: 'Piotr Mazur',
    currentLocation: { lat: 53.778, lng: 20.48, address: 'Serwis MB, Olsztyn' },
    ownership: { type: 'leased', leaseStart: new Date(2022, 4, 1), leaseEnd: new Date(2026, 4, 1), monthlyPayment: 7500, leasingCompany: 'Mercedes-Benz Leasing' },
    documents: [],
    maintenanceHistory: [],
    maintenanceTasks: []
  },
  {
    id: 'vehicle-014',
    plateNumber: 'Gdynia-14',
    make: 'Scania',
    model: 'P 360',
    year: 2021,
    type: 'container',
    status: 'available',
    mileage: 180000,
    capacity: { weight: 20, volume: 0 },
    cargoTypes: ['kontenery 20ft'],
    currentDriver: 'Jadwiga Kamińska',
    currentLocation: { lat: 54.518, lng: 18.53, address: 'Port Gdynia' },
    ownership: { type: 'rented', rentalStart: new Date(2023, 10, 1), monthlyPayment: 6000, rentalCompany: 'Gdynia Port Rentals' },
    documents: [],
    maintenanceHistory: [],
    maintenanceTasks: []
  },
  {
    id: 'vehicle-015',
    plateNumber: 'ZAK-TRK 007',
    make: 'DAF',
    model: 'CF 450',
    year: 2020,
    type: 'tir',
    status: 'in-transit',
    mileage: 320000,
    capacity: { weight: 24, volume: 88 },
    cargoTypes: ['ogólne', 'międzynarodowe'],
    currentDriver: 'Stanisław Głowacki',
    currentLocation: { lat: 49.299, lng: 19.949, address: 'Przejście graniczne Chyżne' },
    ownership: { type: 'owned', purchaseDate: new Date(2020, 9, 1), purchasePrice: 410000 },
    documents: [],
    maintenanceHistory: [],
    maintenanceTasks: []
  }
];

export const vehicleCoordinates = vehicles.reduce((acc, vehicle) => {
  if (vehicle.currentLocation) {
    acc[vehicle.id] = {
      latitude: vehicle.currentLocation.lat,
      longitude: vehicle.currentLocation.lng,
    };
  }
  return acc;
}, {} as Record<string, { latitude: number; longitude: number; }>)