export interface SubmitWarehousingRequestForm {
  storageType: string;
  securityLevel: string;
  estimatedVolume: number;
  estimatedWeight: number;
  estimatedStorageDuration: {
    value: number;
    unit: 'days' | 'weeks' | 'months' | 'years';
  };
  plannedStartDate: string;
  plannedEndDate: string;
  handlingServices: string[];
  valueAddedServices: string[];
  requiresTemperatureControl: boolean;
  requiresHumidityControl: boolean;
  requiresSpecialHandling: boolean;
  specialInstructions: string;
  billingType: string;
  cargo: {
    description: string;
    cargoType: string;
    packaging: string;
    quantity: number;
    unitType: string;
    value: number;
    currency: string;
  };
  priority: string;
}

export interface SubmitWarehousingRequestResponse {
  success: boolean;
  message: string;
  requestNumber: string;
} 