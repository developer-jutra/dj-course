/**
 * Common types of cargo in logistics.
 * 🔥 This is a significant simplification of the real world. 🔥
 * (logistics is a highly complex domain)
 */
export enum CargoType {
  /** Perishable goods requiring hygiene standards, e.g. fresh meat. */
  FOOD = 'FOOD',
  /** Industrial substances requiring specialized handling, e.g. liquid polymers. */
  CHEMICAL = 'CHEMICAL',
  /** High-value sensitive hardware, e.g. smartphone components. */
  ELECTRONICS = 'ELECTRONICS',
  /** Hazardous materials under ADR regulations, e.g. lithium batteries. */
  DANGEROUS_GOODS = 'ADR',
  /** Standard non-specialized packaged goods, e.g. palletized clothing. */
  GENERAL = 'GENERAL',
}

const CONTRACT_TO_DOMAIN_CARGO_TYPE: Record<string, CargoType> = {
  FOOD: CargoType.FOOD,
  CHEMICAL: CargoType.CHEMICAL,
  ELECTRONICS: CargoType.ELECTRONICS,
  ADR: CargoType.DANGEROUS_GOODS,
  GENERAL: CargoType.GENERAL,
};

export function parseCargoType(value: string): CargoType | undefined {
  return CONTRACT_TO_DOMAIN_CARGO_TYPE[value];
}

/**
 * Specific requirements for the cargo being transported.
 */
export interface CargoRequirements {
  /** Maintains specific thermal conditions, e.g. frozen vegetables. */
  readonly isTemperatureControlled: boolean;
  /** Access through the vehicle side, e.g. long timber. */
  readonly requiresSideLoading: boolean;
  /** Unpacked goods transported in volume, e.g. loose grain. */
  readonly isBulk: boolean;
  /** Enhanced theft protection measures, e.g. designer jewelry. */
  readonly highSecurityRequired: boolean;
}

const CARGO_TYPE_REQUIREMENTS: Record<CargoType, CargoRequirements> = {
  [CargoType.FOOD]:           { isTemperatureControlled: true,  requiresSideLoading: false, isBulk: false, highSecurityRequired: false },
  [CargoType.CHEMICAL]:       { isTemperatureControlled: false, requiresSideLoading: false, isBulk: false, highSecurityRequired: false },
  [CargoType.ELECTRONICS]:    { isTemperatureControlled: false, requiresSideLoading: false, isBulk: false, highSecurityRequired: true  },
  [CargoType.DANGEROUS_GOODS]:{ isTemperatureControlled: false, requiresSideLoading: false, isBulk: false, highSecurityRequired: true  },
  [CargoType.GENERAL]:        { isTemperatureControlled: false, requiresSideLoading: false, isBulk: false, highSecurityRequired: false },
};

export function requirementsFor(type: CargoType): CargoRequirements {
  return CARGO_TYPE_REQUIREMENTS[type];
}