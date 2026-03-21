import { CargoType, type CargoRequirements } from '../cargo/cargo.types';
import { CargoLoadPlanStatus } from './cargo-load-plan.types';
import { PalletUnit } from '../pallets/pallet-unit';
import { PalletSpec } from '../pallets/pallet-spec';
import type { PalletLoadableTrailerSpec } from '../trailers';
import { Weight } from '../../shared/weight';

export interface AddCargoData {
  palletType: string;
  cargoType: CargoType;
  requirements: CargoRequirements;
  weight: Weight;
  cargoHeightMm: number;
}

export class CargoLoadPlan {
  private _assignedUnits: PalletUnit[];
  private _status: CargoLoadPlanStatus;
  private _currentLdm: number;

  constructor(
    public readonly id: string,
    private _trailer: PalletLoadableTrailerSpec,
    initialLdm: number, // Trust cached LDM from DB or calculated during command
    assignedUnits: PalletUnit[] = [],
    status: CargoLoadPlanStatus = CargoLoadPlanStatus.DRAFT
  ) {
    this._assignedUnits = [...assignedUnits];
    this._status = status;
    this._currentLdm = initialLdm;

    // Validate current state against invariants
    this.validateState(this._assignedUnits, this._trailer, this._currentLdm);
  }

  public get trailer(): PalletLoadableTrailerSpec {
    return this._trailer;
  }
  public get assignedUnits(): readonly PalletUnit[] {
    return Object.freeze([...this._assignedUnits]);
  }
  public get status(): CargoLoadPlanStatus {
    return this._status;
  }
  public get currentLdm(): number {
    return this._currentLdm;
  }

  public finalize(): void {
    if (this._assignedUnits.length === 0) throw new Error('Cannot finalize empty plan.');

    if (this._currentLdm > this._trailer.maxLdm) {
      throw new Error(`Infeasible plan: LDM ${this._currentLdm} exceeds limit.`);
    }

    this._status = CargoLoadPlanStatus.FINALIZED;
  }

  public addCargo(
    data: AddCargoData,
    ldmProvider: (u: PalletUnit[], t: PalletLoadableTrailerSpec) => number
  ): void {
    const spec = PalletSpec.fromType(data.palletType);
    const unit = PalletUnit.create(spec, data.cargoType, data.requirements, data.weight, data.cargoHeightMm);
    this.addPalletUnit(unit, ldmProvider);
  }

  public addPalletUnit(
    unit: PalletUnit,
    ldmProvider: (u: PalletUnit[], t: PalletLoadableTrailerSpec) => number
  ): void {
    this.ensurePlanIsEditable();
    const candidateUnits = [...this._assignedUnits, unit];
    const newLdm = ldmProvider(candidateUnits, this._trailer);

    this.validateState(candidateUnits, this._trailer, newLdm);

    this._assignedUnits = candidateUnits;
    this._currentLdm = newLdm;
  }

  public removePalletUnit(
    unitId: string,
    ldmProvider: (u: PalletUnit[], t: PalletLoadableTrailerSpec) => number
  ): void {
    this.ensurePlanIsEditable();
    const candidateUnits = this._assignedUnits.filter(u => u.id !== unitId);

    if (candidateUnits.length === this._assignedUnits.length) {
      throw new Error(`Unit with ID ${unitId} not found.`);
    }

    const newLdm = ldmProvider(candidateUnits, this._trailer);
    this.validateState(candidateUnits, this._trailer, newLdm);

    this._assignedUnits = candidateUnits;
    this._currentLdm = newLdm;
  }

  public replaceTrailer(
    newTrailer: PalletLoadableTrailerSpec,
    ldmProvider: (u: PalletUnit[], t: PalletLoadableTrailerSpec) => number
  ): void {
    this.ensurePlanIsEditable();
    const newLdm = ldmProvider(this._assignedUnits, newTrailer);
    this.validateState(this._assignedUnits, newTrailer, newLdm);

    this._trailer = newTrailer;
    this._currentLdm = newLdm;
  }

  private ensurePlanIsEditable(): void {
    if (this._status === CargoLoadPlanStatus.FINALIZED) throw new Error('Finalized plan cannot be modified.');
  }

  private validateState(units: PalletUnit[], trailer: PalletLoadableTrailerSpec, ldm: number): void {
    if (units.length === 0) return;

    const totalWeightKg = units.reduce((sum, u) => sum + u.weight.valueInKg, 0);
    if (totalWeightKg > trailer.maxWeightCapacity.valueInKg) {
      throw new Error(`Weight capacity exceeded: ${totalWeightKg}kg > ${trailer.maxWeightCapacity.valueInKg}kg`);
    }

    if (ldm > trailer.maxLdm) {
      throw new Error(`LDM capacity exceeded: ${ldm}m > ${trailer.maxLdm}m`);
    }

    this.checkCargoCompatibility(units);

    for (const unit of units) {
      this.validateTrailerCompatibility(unit, trailer);
    }
  }

  private validateTrailerCompatibility(unit: PalletUnit, trailer: PalletLoadableTrailerSpec): void {
    const { requirements: req } = unit;
    const { capabilities: cap } = trailer;

    if (unit.totalHeightMm > trailer.heightMm) {
      throw new Error(
        `Unit ${unit.id} is too tall (${unit.totalHeightMm}mm) for trailer ${trailer.type} (${trailer.heightMm}mm).`
      );
    }

    if (req.isTemperatureControlled && !cap.hasClimateControl) throw new Error('Climate control required.');
    if (req.requiresSideLoading && !cap.supportsSideLoading) throw new Error('Side loading required.');
    if (req.highSecurityRequired && !cap.hasHighSecurityLock) throw new Error('High security required.');
    if (req.isBulk && !cap.isBulkReady) throw new Error('Bulk-ready trailer required.');
  }

  private checkCargoCompatibility(units: PalletUnit[]): void {
    const hasDangerous = units.some(
      u => u.cargoType === CargoType.CHEMICAL || u.cargoType === CargoType.DANGEROUS_GOODS
    );
    const hasFood = units.some(u => u.cargoType === CargoType.FOOD);

    if (hasFood && hasDangerous) {
      throw new Error('Incompatible cargo: Cannot mix Food with Dangerous goods.');
    }
  }

  public getPlannedWeight(): Weight {
    return Weight.from(this._assignedUnits.reduce((sum, u) => sum + u.weight.valueInKg, 0), 'KG');
  }
}
