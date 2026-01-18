export interface SubmitTransportationRequestForm {
  serviceType: string;
  pickupLocation: {
    address: { street: string; city: string; country: string };
    contactPerson: string;
    contactPhone: string;
    contactEmail: string;
    loadingType: string;
    facilityType: string;
    operatingHours: Record<string, { open: string; close: string }>;
  };
  deliveryLocation: {
    address: { street: string; city: string; country: string };
    contactPerson: string;
    contactPhone: string;
    contactEmail: string;
    loadingType: string;
    facilityType: string;
    operatingHours: Record<string, { open: string; close: string }>;
  };
  cargo: {
    description: string;
    cargoType: string;
    weight: number;
    packaging: string;
    quantity: number;
    unitType: string;
    value: number;
    currency: string;
    fragile: boolean;
    stackable: boolean;
  };
  requestedPickupDate: string;
  requestedDeliveryDate: string;
  specialInstructions: string;
  requiresInsurance: boolean;
  requiresCustomsClearance: boolean;
  priority: string;
  currency: string;
}

export interface SubmitTransportationRequestResponse {
  success: boolean;
  message: string;
  requestNumber: string;
}