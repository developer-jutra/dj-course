import { atom } from 'jotai';

export interface ShipmentFilters {
  driver: string;
  status: string;
  location: string;
}

export const shipmentFiltersAtom = atom<ShipmentFilters>({
  driver: '',
  status: '',
  location: '',
}); 