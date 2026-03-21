import { randomUUID } from 'crypto';
import { CargoType } from '../cargo/cargo.types';
import { CargoRequirements } from '../cargo/cargo.types';
import { PalletSpec } from './pallet-spec';
import { Weight } from '../../shared/weight';

/**
 * Domain Entity representing a physical pallet with cargo.
 */
export class PalletUnit {
  public readonly totalHeightMm: number;

  static create(
    spec: PalletSpec,
    cargoType: CargoType,
    requirements: CargoRequirements,
    weight: Weight,
    cargoHeightMm: number,
  ): PalletUnit {
    return new PalletUnit(randomUUID(), spec, cargoType, requirements, weight, cargoHeightMm);
  }

  constructor(
    public readonly id: string,
    public readonly spec: PalletSpec,
    public readonly cargoType: CargoType,
    public readonly requirements: CargoRequirements,
    public readonly weight: Weight,
    cargoHeightMm: number
  ) {
    this.totalHeightMm = spec.height + cargoHeightMm;
    this.validateConsistency();
  }

  private validateConsistency(): void {
    if (!this.spec.allowedCargoTypes.includes(this.cargoType)) {
      throw new Error(`Cargo type ${this.cargoType} is not allowed on ${this.spec.label}`);
    }
    if (this.weight.valueInKg > this.spec.maxLoadCapacity.valueInKg) {
      throw new Error(`Weight ${this.weight.valueInKg}kg exceeds ${this.spec.label} capacity`);
    }
  }
}
