// Additional types and utilities for the new order form

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
}

export interface NewOrderFormData {
  customer: Customer | null;
  contactInfo: string;
  cargoType: string[];
  specialHandling: string;
  weight: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'm';
  };
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: Date | null;
  deliveryDate: Date | null;
  priority: 'standard' | 'express' | 'urgent';
}

export const mockCustomers: Customer[] = [
  { id: '1', name: 'Tech Solutions Inc', email: 'contact@techsolutions.com', company: 'Tech Solutions Inc' },
  { id: '2', name: 'Global Trading Co', email: 'orders@globaltrading.com', company: 'Global Trading Co' },
  { id: '3', name: 'Retail Store Chain', email: 'logistics@retailchain.com', company: 'Retail Store Chain' },
  { id: '4', name: 'Manufacturing Corp', email: 'shipping@manufacturing.com', company: 'Manufacturing Corp' },
  { id: '5', name: 'Electronics Distributor', email: 'orders@electronics.com', company: 'Electronics Distributor' },
  { id: '6', name: 'ABC Corp', email: 'contact@abccorp.com', company: 'ABC Corp' },
  { id: '7', name: 'XYZ Ltd', email: 'info@xyzltd.com', company: 'XYZ Ltd' },
];

export const cargoTypes = [
  'General Cargo',
  'Hazardous Materials (HazMat)',
  'Perishable Goods',
  'Frozen Goods',
  'Fragile Items',
  'Oversized Cargo',
  'Liquid Cargo',
  'Live Animals',
  'Other'
];

export const priorityLevels = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'urgent', label: 'Urgent' }
];

export const weightUnits = [
  { value: 'kg', label: 'kg' },
  { value: 'lbs', label: 'lbs' }
];

export const dimensionUnits = [
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' }
];

export const initialFormData: NewOrderFormData = {
  customer: null,
  contactInfo: '',
  cargoType: [],
  specialHandling: '',
  weight: {
    value: 0,
    unit: 'kg'
  },
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
    unit: 'cm'
  },
  pickupLocation: '',
  deliveryLocation: '',
  pickupDate: null,
  deliveryDate: null,
  priority: 'standard'
};

export const validateFormData = (data: NewOrderFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.customer) {
    errors.customer = 'Customer selection is required';
  }

  if (data.cargoType.length === 0) {
    errors.cargoType = 'At least one cargo type must be selected';
  }

  if (!data.weight.value || data.weight.value <= 0) {
    errors.weight = 'Weight must be a positive number';
  }

  if (!data.dimensions.length || data.dimensions.length <= 0) {
    errors.dimensionsLength = 'Length must be a positive number';
  }

  if (!data.dimensions.width || data.dimensions.width <= 0) {
    errors.dimensionsWidth = 'Width must be a positive number';
  }

  if (!data.dimensions.height || data.dimensions.height <= 0) {
    errors.dimensionsHeight = 'Height must be a positive number';
  }

  if (!data.pickupLocation.trim()) {
    errors.pickupLocation = 'Pickup location is required';
  }

  if (!data.deliveryLocation.trim()) {
    errors.deliveryLocation = 'Delivery location is required';
  }

  if (!data.pickupDate) {
    errors.pickupDate = 'Pickup date is required';
  } else if (data.pickupDate < new Date()) {
    errors.pickupDate = 'Pickup date cannot be in the past';
  }

  if (!data.deliveryDate) {
    errors.deliveryDate = 'Delivery date is required';
  } else if (data.pickupDate && data.deliveryDate < data.pickupDate) {
    errors.deliveryDate = 'Delivery date must be on or after pickup date';
  }

  if (!data.priority) {
    errors.priority = 'Priority level is required';
  }

  return errors;
};