import { CargoDocument } from '../features/cargo-management/cargo.model';

export const MOCK_CARGO_DOCUMENTS: CargoDocument[] = [
    {
      name: 'Shipping Manifest',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: new Date('2025-01-10')
    },
    {
      name: 'Quality Inspection Report',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: new Date('2025-01-10')
    },
    {
      name: 'Insurance Certificate',
      type: 'PDF',
      size: '0.9 MB',
      uploadDate: new Date('2025-01-10')
    }
]; 