import { CargoType } from '../cargo/cargo.types';
import { Weight } from '../../shared/weight';

export type Material = 'Wood' | 'Plastic' | 'Metal' | 'HDPE';

export class UnknownPalletTypeError extends Error {
  constructor(type: string, allowed: string[]) {
    super(`Unknown pallet type: '${type}'. Allowed: ${allowed.join(', ')}`);
    this.name = 'UnknownPalletTypeError';
  }
}

const REGISTRY: Record<string, () => PalletSpec> = {
  'epal1': () => PalletSpec.epal1(),
  'industrial': () => PalletSpec.industrial(),
  'half': () => PalletSpec.half(),
  'cp1': () => PalletSpec.cp1(),
  'cp3': () => PalletSpec.cp3(),
  'h1': () => PalletSpec.h1(),
};

/**
 * Immutable definition of a pallet type (Value Object).
 */
export class PalletSpec {
  static fromType(type: string): PalletSpec {
    const factory = REGISTRY[type];
    if (!factory) throw new UnknownPalletTypeError(type, Object.keys(REGISTRY));
    return factory();
  }

  static allowedTypes(): string[] {
    return Object.keys(REGISTRY);
  }

  constructor(
    public readonly label: string,
    public readonly material: Material,
    public readonly allowedCargoTypes: CargoType[],
    public readonly width: number,
    public readonly length: number,
    public readonly height: number, // Base height of the empty pallet
    public readonly maxLoadCapacity: Weight
  ) {
    this.validate();
    Object.freeze(this);
  }

  private validate(): void {
    if (!this.label || this.label.trim().length === 0) {
      throw new Error('Label cannot be empty');
    }
    if (!this.allowedCargoTypes || this.allowedCargoTypes.length === 0) {
      throw new Error('Pallet must have at least one allowed cargo type');
    }
    if (this.width <= 0 || this.length <= 0 || this.height <= 0) {
      throw new Error('Dimensions must be positive values');
    }
    if (this.maxLoadCapacity.valueInKg <= 0) {
      throw new Error('Max load capacity must be a positive value');
    }
  }

  static epal1(): PalletSpec {
    return new PalletSpec('EPAL 1', 'Wood', [CargoType.GENERAL, CargoType.FOOD, CargoType.ELECTRONICS], 800, 1200, 144, Weight.from(4000, 'KG'));
  }

  static industrial(): PalletSpec {
    return new PalletSpec('ISO-2', 'Wood', [CargoType.GENERAL, CargoType.ELECTRONICS], 1000, 1200, 162, Weight.from(1500, 'KG'));
  }

  static half(): PalletSpec {
    return new PalletSpec('EPAL-6', 'Wood', [CargoType.GENERAL, CargoType.FOOD], 600, 800, 144, Weight.from(750, 'KG'));
  }

  static cp1(): PalletSpec {
    return new PalletSpec('CP1', 'Wood', [CargoType.CHEMICAL, CargoType.DANGEROUS_GOODS], 1000, 1200, 138, Weight.from(1190, 'KG'));
  }

  static cp3(): PalletSpec {
    return new PalletSpec('CP-3', 'Wood', [CargoType.CHEMICAL, CargoType.DANGEROUS_GOODS], 1140, 1140, 138, Weight.from(1200, 'KG'));
  }

  static h1(): PalletSpec {
    return new PalletSpec('H1', 'HDPE', [CargoType.FOOD], 800, 1200, 160, Weight.from(5000, 'KG'));
  }
}
