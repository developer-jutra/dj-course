/**
 * Common types of cargo in logistics.
 */
export enum CargoType {
  FOOD = 'FOOD',
  CHEMICAL = 'CHEMICAL',
  ELECTRONICS = 'ELECTRONICS',
  DANGEROUS_GOODS = 'ADR',
  GENERAL = 'GENERAL',
}

const CONTRACT_TO_DOMAIN_CARGO_TYPE: Record<string, CargoType> = {
  FOOD:        CargoType.FOOD,
  CHEMICAL:    CargoType.CHEMICAL,
  ELECTRONICS: CargoType.ELECTRONICS,
  ADR:         CargoType.DANGEROUS_GOODS,
  GENERAL:     CargoType.GENERAL,
};

export function parseCargoType(value: string): CargoType | undefined {
  return CONTRACT_TO_DOMAIN_CARGO_TYPE[value];
}

/**
 * Specific requirements for the cargo being transported.
 */
export interface CargoRequirements {
  readonly isTemperatureControlled: boolean;
  readonly requiresSideLoading: boolean;
  readonly isBulk: boolean;
  readonly highSecurityRequired: boolean;
}
