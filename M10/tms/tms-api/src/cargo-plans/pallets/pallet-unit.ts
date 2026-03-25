import { CargoType } from '../cargo/cargo.types';
import { CargoRequirements } from '../cargo/cargo.types';
import { PalletSpec } from './pallet-spec';
import { Weight } from '../../shared/weight';
import { UUID } from '../../shared/uuid';
import { ok, fail, type Result } from '../../shared/result';
import {
  PalletWeightExceedsCapacityError,
  PalletCargoTypeNotAllowedError,
  type PalletDomainError,
} from './pallet-spec.errors';

/**
 * Domain Entity representing a physical pallet with cargo.
 */
export class PalletUnit {
  private readonly totalHeightMm: number; // (!) 🤨🤨🤨

  // 🔥🔥🔥 Constructor is private - only 'create' or 'rehydrate' can call it
  private constructor(
    private readonly id: UUID<'CargoUnit'>,
    private readonly spec: PalletSpec,
    private readonly cargoType: CargoType,
    private readonly requirements: CargoRequirements,
    private readonly weight: Weight,
    cargoHeightMm: number
  ) {
    this.totalHeightMm = spec.height + cargoHeightMm;
  }

  public getSnapshot() {
    return {
      id: this.id,
      spec: this.spec,
      cargoType: this.cargoType,
      requirements: this.requirements,
      weight: this.weight,
      totalHeightMm: this.totalHeightMm,
    };
  }

  static create(
    spec: PalletSpec,
    cargoType: CargoType,
    requirements: CargoRequirements,
    weight: Weight,
    cargoHeightMm: number,
  ): Result<PalletUnit, PalletDomainError> {
    if (!spec.isCargoTypeAllowed(cargoType)) {
      return fail(new PalletCargoTypeNotAllowedError(cargoType, spec.label));
    }
    if (spec.isWeightExceeded(weight)) {
      return fail(new PalletWeightExceedsCapacityError(weight.valueInKg, spec.maxLoadCapacity.valueInKg, spec.label));
    }
    return ok(new PalletUnit(UUID.newUUID<'CargoUnit'>(), spec, cargoType, requirements, weight, cargoHeightMm));
  }

  static rehydrate(
    id: UUID<'CargoUnit'>,
    spec: PalletSpec,
    cargoType: CargoType,
    requirements: CargoRequirements,
    weight: Weight,
    cargoHeightMm: number
  ): PalletUnit {
    return new PalletUnit(id, spec, cargoType, requirements, weight, cargoHeightMm);
  }
}
