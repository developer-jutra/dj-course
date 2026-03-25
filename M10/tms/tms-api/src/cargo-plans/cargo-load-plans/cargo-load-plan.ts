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

export interface AddCargoData {
  palletType: string;
  cargoType: CargoType;
  weight: Weight;
  cargoHeightMm: number;
}

export class CargoLoadPlan {
  constructor(
    private readonly id: UUID<'CargoLoadPlan'>,
    private trailer: PalletLoadableTrailerSpec,
    private currentLdm: number,
    private assignedUnits: PalletUnit[] = [],
    private status: CargoLoadPlanStatus = CargoLoadPlanStatus.DRAFT,
    private version: number = 0
  ) {
    this.assignedUnits = [...assignedUnits];

    // 🔥🔥🔥 Validate invariants on reconstruction – throw because corrupt state from DB is unexpected
    const integrityResult = this.ensureLoadIntegrity(this.assignedUnits, this.trailer, this.currentLdm);
    if (!integrityResult.success) throw integrityResult.error;
  }

  public getSnapshot() {
    return {
      id: this.id,
      trailer: this.trailer,
      status: this.status,
      currentLdm: this.currentLdm,
      assignedUnits: Object.freeze(this.assignedUnits.map(u => u.getSnapshot())),
      version: this.version,
    };
  }

  public finalize(): Result<void, PlanAlreadyFinalizedError | EmptyPlanError | LdmCapacityExceededError> {
    const guardResult = this.ensurePlanNotFinalized();
    if (!guardResult.success) return guardResult;

    if (this.assignedUnits.length === 0) return fail(new EmptyPlanError());

    if (this.currentLdm > this.trailer.maxLdm) {
      return fail(new LdmCapacityExceededError(this.currentLdm, this.trailer.maxLdm));
    }

    this.status = CargoLoadPlanStatus.FINALIZED;
    return ok(undefined);
  }

  public addCargoToPlan(
    data: AddCargoData,
    // 🔥🔥🔥 strategy (not double dispatch)
    ldmProvider: (u: PalletUnit[], t: PalletLoadableTrailerSpec) => number
  ): Result<void, CargoLoadPlanDomainError> {
    const guardResult = this.ensurePlanNotFinalized();
    if (!guardResult.success) return guardResult;

    const spec = PalletSpec.fromType(data.palletType);
    const requirements = requirementsFor(data.cargoType);

    const unitResult = PalletUnit.create(spec, data.cargoType, requirements, data.weight, data.cargoHeightMm);
    if (!unitResult.success) return fail(unitResult.error);

    const candidateUnits = [...this.assignedUnits, unitResult.value];
    const newLdm = ldmProvider(candidateUnits, this.trailer);
    const integrityResult = this.ensureLoadIntegrity(candidateUnits, this.trailer, newLdm);
    if (!integrityResult.success) return integrityResult;

    this.assignedUnits = candidateUnits;
    this.currentLdm = newLdm;
    return ok(undefined);
  }

  public removeCargoFromPlan(
    unitId: string,
    ldmProvider: (u: PalletUnit[], t: PalletLoadableTrailerSpec) => number
  ): Result<void, CargoLoadPlanDomainError> {
    const guardResult = this.ensurePlanNotFinalized();
    if (!guardResult.success) return guardResult;

    const candidateUnits = this.assignedUnits.filter(u => u.getSnapshot().id !== unitId);
    if (candidateUnits.length === this.assignedUnits.length) {
      return fail(new CargoUnitNotFoundError(unitId));
    }

    const newLdm = ldmProvider(candidateUnits, this.trailer);
    const integrityResult = this.ensureLoadIntegrity(candidateUnits, this.trailer, newLdm);
    if (!integrityResult.success) return integrityResult;

    this.assignedUnits = candidateUnits;
    this.currentLdm = newLdm;
    return ok(undefined);
  }

  public replaceTrailer(
    newTrailer: PalletLoadableTrailerSpec,
    ldmProvider: (u: PalletUnit[], t: PalletLoadableTrailerSpec) => number
  ): Result<void, CargoLoadPlanDomainError> {
    const guardResult = this.ensurePlanNotFinalized();
    if (!guardResult.success) return guardResult;

    const newLdm = ldmProvider(this.assignedUnits, newTrailer);
    const integrityResult = this.ensureLoadIntegrity(this.assignedUnits, newTrailer, newLdm);
    if (!integrityResult.success) return integrityResult;

    this.trailer = newTrailer;
    this.currentLdm = newLdm;
    return ok(undefined);
  }

  public isFinalized(): boolean {
    return this.status === CargoLoadPlanStatus.FINALIZED;
  }

  private ensurePlanNotFinalized(): Result<void, PlanAlreadyFinalizedError> {
    if (this.status === CargoLoadPlanStatus.FINALIZED) {
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
    // 🤨🤨🤨 so unit's weight is of type Weight (VO) but their sum totalWeightKg is a primitive (number)?
    // (╯°□°)╯︵ ┻━┻ 
    const totalWeightKg = units.reduce((sum, u) => sum + u.getSnapshot().weight.valueInKg, 0);
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
    if (unit.getSnapshot().totalHeightMm > trailer.heightMm) {
      return fail(new CargoTooTallForTrailerError(unit.getSnapshot().id, unit.getSnapshot().totalHeightMm, trailer.type, trailer.heightMm));
    }
    return ok(undefined);
  }

  private ensureTrailerSatisfiesCargoRequirements(
    unit: PalletUnit,
    trailer: PalletLoadableTrailerSpec
  ): Result<void, TrailerCapabilityMismatchError> {
    const { requirements: req } = unit.getSnapshot();
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
      u => u.getSnapshot().cargoType === CargoType.CHEMICAL || u.getSnapshot().cargoType === CargoType.DANGEROUS_GOODS
    );
    const hasFood = units.some(u => u.getSnapshot().cargoType === CargoType.FOOD);

    if (hasFood && hasDangerous) {
      return fail(new IncompatibleCargoColoadingError());
    }
    return ok(undefined);
  }
}
