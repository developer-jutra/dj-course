import type {
  LoadPlanResponse,
  CargoUnitResponse,
  CargoType as ContractCargoType,
  CargoLoadPlanStatus as ContractCargoLoadPlanStatus,
  WeightUnit as ContractWeightUnit,
} from '../../types/data-contracts';
import { CargoType } from '../cargo/cargo.types';
import { CargoLoadPlanStatus } from './cargo-load-plan.types';
import { toTrailerReadModel } from '../trailers';
import type { CargoLoadPlan } from './cargo-load-plan';
import type { WeightUnit } from '../../shared/weight';

export type CargoLoadPlanReadModel = LoadPlanResponse;

// ── ACL: domain → contract mappings ─────────────────────────────────────────

function mapCargoType(value: CargoType): ContractCargoType {
  switch (value) {
    case CargoType.FOOD:            return 'FOOD';
    case CargoType.CHEMICAL:        return 'CHEMICAL';
    case CargoType.ELECTRONICS:     return 'ELECTRONICS';
    case CargoType.DANGEROUS_GOODS: return 'ADR';
    case CargoType.GENERAL:         return 'GENERAL';
  }
}

function mapStatus(value: CargoLoadPlanStatus): ContractCargoLoadPlanStatus {
  switch (value) {
    case CargoLoadPlanStatus.DRAFT:     return 'DRAFT';
    case CargoLoadPlanStatus.FINALIZED: return 'FINALIZED';
  }
}

function mapUnit(
  u: CargoLoadPlan['assignedUnits'][number],
  weightUnit: WeightUnit,
): CargoUnitResponse {
  return {
    id: u.id,
    palletLabel: u.spec.label,
    cargoType: mapCargoType(u.cargoType),
    weight: u.weight.valueInUnit(weightUnit),
    totalHeightMm: u.totalHeightMm,
    requirements: u.requirements,
  };
}

// ── Read model factory ───────────────────────────────────────────────────────

export function toCargoLoadPlanReadModel(
  plan: CargoLoadPlan,
  weightUnit: WeightUnit = 'KG',
): CargoLoadPlanReadModel {
  return {
    id: plan.id,
    status: mapStatus(plan.status),
    weightUnit: weightUnit as ContractWeightUnit,
    trailer: toTrailerReadModel(plan.trailer),
    currentLdm: plan.currentLdm,
    plannedWeight: plan.getPlannedWeight().valueInUnit(weightUnit),
    units: plan.assignedUnits.map(u => mapUnit(u, weightUnit)),
  };
}
