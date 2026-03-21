import { CargoType, requirementsFor } from '../cargo/cargo.types';
import { CargoLoadPlanStatus } from './cargo-load-plan.types';
import { PalletUnit } from '../pallets/pallet-unit';
import { PalletSpec } from '../pallets/pallet-spec';
import type { PalletLoadableTrailerSpec } from '../trailers';
import { Weight } from '../../shared/weight';
import { ok, fail, type Result } from '../../shared/result';
import { UUID } from '../../shared/uuid';
import {
  PlanAlreadyFinalizedError,
  EmptyPlanError,
  WeightCapacityExceededError,
  LdmCapacityExceededError,
  CargoTooTallForTrailerError,
  TrailerCapabilityMismatchError,
  IncompatibleCargoColoadingError,
  CargoUnitNotFoundError,
  type CargoLoadPlanDomainError,
} from './cargo-load-plan.errors';

export type { CargoLoadPlanDomainError };
export {
  PlanAlreadyFinalizedError,
  EmptyPlanError,
  WeightCapacityExceededError,
  LdmCapacityExceededError,
  CargoTooTallForTrailerError,
  TrailerCapabilityMismatchError,
  IncompatibleCargoColoadingError,
  CargoUnitNotFoundError,
} from './cargo-load-plan.errors';

export interface AddCargoData {
  palletType: string;
  cargoType: CargoType;
  weight: Weight;
  cargoHeightMm: number;
}

export class CargoLoadPlan {
  private _assignedUnits: PalletUnit[];
  private _status: CargoLoadPlanStatus;
  private _currentLdm: number;
  private _version: number;

  constructor(
    public readonly id: UUID<'CargoLoadPlan'>,
    private _trailer: PalletLoadableTrailerSpec,
    initialLdm: number, // Trust cached LDM from DB or calculated during command
    assignedUnits: PalletUnit[] = [],
    status: CargoLoadPlanStatus = CargoLoadPlanStatus.DRAFT,
    version: number = 0
  ) {
    this._assignedUnits = [...assignedUnits];
    this._status = status;
    this._currentLdm = initialLdm;
    this._version = version;

    // Validate invariants on reconstruction – throw because corrupt state from DB is unexpected
    const integrityResult = this.ensureLoadIntegrity(this._assignedUnits, this._trailer, this._currentLdm);
    if (!integrityResult.success) throw integrityResult.error;
  }

  public getSnapshot() {
    return {
      id: this.id,
      trailer: this._trailer,
      status: this._status,
      currentLdm: this._currentLdm,
      assignedUnits: Object.freeze([...this._assignedUnits]) as readonly PalletUnit[],
      version: this._version,
    };
  }

  public finalize(): Result<void, EmptyPlanError | LdmCapacityExceededError> {
    if (this._assignedUnits.length === 0) return fail(new EmptyPlanError());

    if (this._currentLdm > this._trailer.maxLdm) {
      return fail(new LdmCapacityExceededError(this._currentLdm, this._trailer.maxLdm));
    }

    this._status = CargoLoadPlanStatus.FINALIZED;
    return ok(undefined);
  }

  public addCargo(
    data: AddCargoData,
    ldmProvider: (u: PalletUnit[], t: PalletLoadableTrailerSpec) => number
  ): Result<void, CargoLoadPlanDomainError> {
    // PalletSpec.fromType throws UnknownPalletTypeError for invalid types – intentionally not
    // wrapped here; it propagates as an input-validation error to the application layer.
    const spec = PalletSpec.fromType(data.palletType);
    const requirements = requirementsFor(data.cargoType);
    const unitResult = PalletUnit.create(spec, data.cargoType, requirements, data.weight, data.cargoHeightMm);
    if (!unitResult.success) return fail(unitResult.error);
    return this.addPalletUnit(unitResult.value, ldmProvider);
  }

  public addPalletUnit(
    unit: PalletUnit,
    ldmProvider: (u: PalletUnit[], t: PalletLoadableTrailerSpec) => number
  ): Result<void, CargoLoadPlanDomainError> {
    const guardResult = this.ensurePlanNotFinalized();
    if (!guardResult.success) return guardResult;

    const candidateUnits = [...this._assignedUnits, unit];
    const newLdm = ldmProvider(candidateUnits, this._trailer);
    const integrityResult = this.ensureLoadIntegrity(candidateUnits, this._trailer, newLdm);
    if (!integrityResult.success) return integrityResult;

    this._assignedUnits = candidateUnits;
    this._currentLdm = newLdm;
    return ok(undefined);
  }

  public removePalletUnit(
    unitId: string,
    ldmProvider: (u: PalletUnit[], t: PalletLoadableTrailerSpec) => number
  ): Result<void, CargoLoadPlanDomainError> {
    const guardResult = this.ensurePlanNotFinalized();
    if (!guardResult.success) return guardResult;

    const candidateUnits = this._assignedUnits.filter(u => u.id !== unitId);
    if (candidateUnits.length === this._assignedUnits.length) {
      return fail(new CargoUnitNotFoundError(unitId));
    }

    const newLdm = ldmProvider(candidateUnits, this._trailer);
    const integrityResult = this.ensureLoadIntegrity(candidateUnits, this._trailer, newLdm);
    if (!integrityResult.success) return integrityResult;

    this._assignedUnits = candidateUnits;
    this._currentLdm = newLdm;
    return ok(undefined);
  }

  public replaceTrailer(
    newTrailer: PalletLoadableTrailerSpec,
    ldmProvider: (u: PalletUnit[], t: PalletLoadableTrailerSpec) => number
  ): Result<void, CargoLoadPlanDomainError> {
    const guardResult = this.ensurePlanNotFinalized();
    if (!guardResult.success) return guardResult;

    const newLdm = ldmProvider(this._assignedUnits, newTrailer);
    const integrityResult = this.ensureLoadIntegrity(this._assignedUnits, newTrailer, newLdm);
    if (!integrityResult.success) return integrityResult;

    this._trailer = newTrailer;
    this._currentLdm = newLdm;
    return ok(undefined);
  }

  private ensurePlanNotFinalized(): Result<void, PlanAlreadyFinalizedError> {
    if (this._status === CargoLoadPlanStatus.FINALIZED) {
      return fail(new PlanAlreadyFinalizedError());
    }
    return ok(undefined);
  }

  private ensureLoadIntegrity(
    units: PalletUnit[],
    trailer: PalletLoadableTrailerSpec,
    ldm: number
  ): Result<void, CargoLoadPlanDomainError> {
    if (units.length === 0) return ok(undefined);

    const weightResult = this.ensureWeightCapacityNotExceeded(units, trailer);
    if (!weightResult.success) return weightResult;

    const ldmResult = this.ensureLdmCapacityNotExceeded(ldm, trailer);
    if (!ldmResult.success) return ldmResult;

    const coloadResult = this.ensureCargoColoadingCompatibility(units);
    if (!coloadResult.success) return coloadResult;

    for (const unit of units) {
      const spatialResult = this.ensureCargoSpatialFit(unit, trailer);
      if (!spatialResult.success) return spatialResult;

      const capabilityResult = this.ensureTrailerSatisfiesCargoRequirements(unit, trailer);
      if (!capabilityResult.success) return capabilityResult;
    }

    return ok(undefined);
  }

  private ensureWeightCapacityNotExceeded(
    units: PalletUnit[],
    trailer: PalletLoadableTrailerSpec
  ): Result<void, CargoLoadPlanDomainError> {
    const totalWeightKg = units.reduce((sum, u) => sum + u.weight.valueInKg, 0);
    if (totalWeightKg > trailer.maxWeightCapacity.valueInKg) {
      return fail(new WeightCapacityExceededError(totalWeightKg, trailer.maxWeightCapacity.valueInKg));
    }
    return ok(undefined);
  }

  private ensureLdmCapacityNotExceeded(
    ldm: number,
    trailer: PalletLoadableTrailerSpec
  ): Result<void, CargoLoadPlanDomainError> {
    if (ldm > trailer.maxLdm) {
      return fail(new LdmCapacityExceededError(ldm, trailer.maxLdm));
    }
    return ok(undefined);
  }

  private ensureCargoSpatialFit(
    unit: PalletUnit,
    trailer: PalletLoadableTrailerSpec
  ): Result<void, CargoTooTallForTrailerError> {
    if (unit.totalHeightMm > trailer.heightMm) {
      return fail(new CargoTooTallForTrailerError(unit.id, unit.totalHeightMm, trailer.type, trailer.heightMm));
    }
    return ok(undefined);
  }

  private ensureTrailerSatisfiesCargoRequirements(
    unit: PalletUnit,
    trailer: PalletLoadableTrailerSpec
  ): Result<void, TrailerCapabilityMismatchError> {
    const { requirements: req } = unit;
    const { capabilities: cap } = trailer;

    if (req.isTemperatureControlled && !cap.hasClimateControl) {
      return fail(new TrailerCapabilityMismatchError('Climate control required'));
    }
    if (req.requiresSideLoading && !cap.supportsSideLoading) {
      return fail(new TrailerCapabilityMismatchError('side loading required'));
    }
    if (req.highSecurityRequired && !cap.hasHighSecurityLock) {
      return fail(new TrailerCapabilityMismatchError('high security lock required'));
    }
    if (req.isBulk && !cap.isBulkReady) {
      return fail(new TrailerCapabilityMismatchError('bulk-ready trailer required'));
    }

    return ok(undefined);
  }

  private ensureCargoColoadingCompatibility(
    units: PalletUnit[]
  ): Result<void, IncompatibleCargoColoadingError> {
    const hasDangerous = units.some(
      u => u.cargoType === CargoType.CHEMICAL || u.cargoType === CargoType.DANGEROUS_GOODS
    );
    const hasFood = units.some(u => u.cargoType === CargoType.FOOD);

    if (hasFood && hasDangerous) {
      return fail(new IncompatibleCargoColoadingError());
    }
    return ok(undefined);
  }
}
