import { Document, DocumentEntity } from './document.types';

// Mock customers and suppliers
const mockCustomers: DocumentEntity[] = [
  { id: 'customer-001', name: 'Fabryka BMW', type: 'customer' },
  { id: 'customer-002', name: 'Mercedes-Benz Polska', type: 'customer' },
  { id: 'customer-003', name: 'Volkswagen Grupa', type: 'customer' },
  { id: 'customer-004', name: 'Siemens Polska', type: 'customer' },
  { id: 'customer-005', name: 'DHL Express Polska', type: 'customer' }
];

const mockSuppliers: DocumentEntity[] = [
  { id: 'supplier-001', name: 'Shell Polska', type: 'supplier' },
  { id: 'supplier-002', name: 'Orlen Paliwa', type: 'supplier' },
  { id: 'supplier-003', name: 'Serwis Mercedes Warszawa', type: 'supplier' },
  { id: 'supplier-004', name: 'Volvo Financial Services', type: 'supplier' },
  { id: 'supplier-005', name: 'PZU Ubezpieczenia', type: 'supplier' }
];

const mockCompany: DocumentEntity[] = [
  { id: 'company-001', name: 'Deliveroo TMS Sp. z o.o.', type: 'company' }
];

// These will be populated by the index file to avoid circular dependencies
export let vehicleEntities: DocumentEntity[] = [];
export let driverEntities: DocumentEntity[] = [];

export const setVehicleEntities = (entities: DocumentEntity[]) => {
  vehicleEntities = entities;
};

export const setDriverEntities = (entities: DocumentEntity[]) => {
  driverEntities = entities;
};

export const getDocumentEntities = (): DocumentEntity[] => [
  ...vehicleEntities,
  ...driverEntities,
  ...mockCustomers,
  ...mockSuppliers,
  ...mockCompany
];

export const mockDocuments: Document[] = [
  // Vehicle documents
  {
    id: 'doc-001',
    name: 'Dowód Rejestracyjny Mercedes Actros',
    type: 'registration',
    entityType: 'vehicle',
    entityId: 'vehicle-001',
    entityName: 'Mercedes-Benz Actros 1851 (WA-LOG 2024)',
    number: 'REJ-WA-LOG-2024',
    issueDate: new Date(2022, 2, 15),
    expiryDate: new Date(2025, 2, 15),
    issuingAuthority: 'Wydział Komunikacji Warszawa',
    fileUrl: '/documents/registration-wa-log-2024.pdf',
    fileSize: 1024000,
    mimeType: 'application/pdf',
    createdAt: new Date(2022, 2, 15),
    updatedAt: new Date(2022, 2, 15)
  },
  {
    id: 'doc-002',
    name: 'Polisa Ubezpieczeniowa Mercedes Actros',
    type: 'insurance',
    entityType: 'vehicle',
    entityId: 'vehicle-001',
    entityName: 'Mercedes-Benz Actros 1851 (WA-LOG 2024)',
    number: 'UB-001-2024',
    issueDate: new Date(2024, 0, 1),
    expiryDate: new Date(2025, 0, 1),
    issuingAuthority: 'PZU Ubezpieczenia',
    fileUrl: '/documents/insurance-wa-log-2024.pdf',
    fileSize: 512000,
    mimeType: 'application/pdf',
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 0, 1)
  },
  {
    id: 'doc-003',
    name: 'Przegląd Techniczny Mercedes Actros',
    type: 'inspection',
    entityType: 'vehicle',
    entityId: 'vehicle-001',
    entityName: 'Mercedes-Benz Actros 1851 (WA-LOG 2024)',
    number: 'PKD-001-2024',
    issueDate: new Date(2024, 5, 10),
    expiryDate: new Date(2025, 5, 10),
    issuingAuthority: 'Stacja Kontroli Pojazdów',
    fileUrl: '/documents/inspection-wa-log-2024.pdf',
    fileSize: 256000,
    mimeType: 'application/pdf',
    createdAt: new Date(2024, 5, 10),
    updatedAt: new Date(2024, 5, 10)
  },
  
  // Customer contracts
  {
    id: 'doc-004',
    name: 'Umowa Ramowa z BMW',
    type: 'contract',
    entityType: 'customer',
    entityId: 'customer-001',
    entityName: 'Fabryka BMW',
    number: 'UMW-BMW-2024-001',
    issueDate: new Date(2024, 0, 15),
    expiryDate: new Date(2025, 0, 15),
    fileUrl: '/documents/contract-bmw-2024.pdf',
    fileSize: 2048000,
    mimeType: 'application/pdf',
    notes: 'Umowa na transport części samochodowych',
    createdAt: new Date(2024, 0, 15),
    updatedAt: new Date(2024, 0, 15)
  },
  {
    id: 'doc-005',
    name: 'Umowa Serwisowa Mercedes-Benz',
    type: 'contract',
    entityType: 'customer',
    entityId: 'customer-002',
    entityName: 'Mercedes-Benz Polska',
    number: 'UMW-MB-2024-002',
    issueDate: new Date(2024, 1, 1),
    expiryDate: new Date(2025, 1, 1),
    fileUrl: '/documents/contract-mercedes-2024.pdf',
    fileSize: 1536000,
    mimeType: 'application/pdf',
    notes: 'Transport pilnych dostaw',
    createdAt: new Date(2024, 1, 1),
    updatedAt: new Date(2024, 1, 1)
  },
  
  // Supplier contracts
  {
    id: 'doc-006',
    name: 'Umowa Dostawy Paliwa Shell',
    type: 'contract',
    entityType: 'supplier',
    entityId: 'supplier-001',
    entityName: 'Shell Polska',
    number: 'UMW-SHELL-2024-001',
    issueDate: new Date(2024, 0, 1),
    expiryDate: new Date(2024, 11, 31),
    fileUrl: '/documents/contract-shell-2024.pdf',
    fileSize: 1024000,
    mimeType: 'application/pdf',
    notes: 'Umowa na dostawę paliwa dla floty',
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 0, 1)
  },
  {
    id: 'doc-007',
    name: 'Umowa Leasingu Volvo',
    type: 'contract',
    entityType: 'supplier',
    entityId: 'supplier-004',
    entityName: 'Volvo Financial Services',
    number: 'LEASE-VOLVO-2021-001',
    issueDate: new Date(2021, 5, 1),
    expiryDate: new Date(2026, 5, 1),
    fileUrl: '/documents/lease-volvo-2021.pdf',
    fileSize: 3072000,
    mimeType: 'application/pdf',
    notes: 'Leasing pojazdu GD-EX 1234',
    createdAt: new Date(2021, 5, 1),
    updatedAt: new Date(2021, 5, 1)
  },
  
  // Driver licenses
  {
    id: 'doc-008',
    name: 'Prawo Jazdy Jan Kowalski',
    type: 'license',
    entityType: 'driver',
    entityId: 'driver-001',
    entityName: 'Jan Kowalski',
    number: 'PL123456789',
    issueDate: new Date(2020, 2, 1),
    expiryDate: new Date(2026, 5, 15),
    issuingAuthority: 'Wydział Komunikacji Warszawa',
    fileUrl: '/documents/license-jan-kowalski.pdf',
    fileSize: 512000,
    mimeType: 'application/pdf',
    createdAt: new Date(2020, 2, 1),
    updatedAt: new Date(2020, 2, 1)
  },
  {
    id: 'doc-009',
    name: 'Certyfikat ADR Maria Nowak',
    type: 'certificate',
    entityType: 'driver',
    entityId: 'driver-002',
    entityName: 'Maria Nowak',
    number: 'ADR-MN-2024-001',
    issueDate: new Date(2024, 2, 1),
    expiryDate: new Date(2025, 2, 1),
    issuingAuthority: 'Urząd Transportu Drogowego',
    fileUrl: '/documents/adr-maria-nowak.pdf',
    fileSize: 256000,
    mimeType: 'application/pdf',
    notes: 'Certyfikat do przewozu materiałów niebezpiecznych',
    createdAt: new Date(2024, 2, 1),
    updatedAt: new Date(2024, 2, 1)
  },
  
  // Company documents
  {
    id: 'doc-010',
    name: 'Licencja Transportowa',
    type: 'license',
    entityType: 'company',
    entityId: 'company-001',
    entityName: 'Deliveroo TMS Sp. z o.o.',
    number: 'LIC-TRANS-2023-001',
    issueDate: new Date(2023, 0, 1),
    expiryDate: new Date(2028, 0, 1),
    issuingAuthority: 'Główny Inspektorat Transportu Drogowego',
    fileUrl: '/documents/transport-license-2023.pdf',
    fileSize: 1024000,
    mimeType: 'application/pdf',
    notes: 'Licencja na krajowy i międzynarodowy transport drogowy',
    createdAt: new Date(2023, 0, 1),
    updatedAt: new Date(2023, 0, 1)
  }
];