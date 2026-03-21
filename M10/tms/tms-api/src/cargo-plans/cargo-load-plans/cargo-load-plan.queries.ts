import type { WeightUnit } from '../../shared/weight';
import { Weight } from '../../shared/weight';
import type {
  LoadPlanResponse,
  CargoUnitResponse,
  WeightUnit as ContractWeightUnit,
} from '../../types/data-contracts';

export type CargoLoadPlanReadModel = LoadPlanResponse;

/**
 * What a SQL/in-memory query returns: contract types throughout, weights always in KG.
 * Derived from the API contract – no domain objects.
 */
export type CargoLoadPlanDbRow =
  Omit<LoadPlanResponse, 'weightUnit' | 'plannedWeight' | 'units'> & {
    readonly units: ReadonlyArray<
      Omit<CargoUnitResponse, 'weight'> & { readonly weightKg: number; readonly description?: string | null }
    >;
  };

// ── Interface (Application layer) ───────────────────────────────────────────

export interface CargoLoadPlanQueries {
  findPlan(id: string, weightUnit?: WeightUnit): Promise<CargoLoadPlanReadModel | null>;
}

// ── DB row → read model mapping ──────────────────────────────────────────────

export function toReadModel(row: CargoLoadPlanDbRow, weightUnit: WeightUnit): CargoLoadPlanReadModel {
  return {
    id: row.id,
    status: row.status,
    version: row.version,
    weightUnit: weightUnit as ContractWeightUnit,
    trailer: row.trailer,
    currentLdm: row.currentLdm,
    plannedWeight: Weight.from(
      row.units.reduce((sum, u) => sum + u.weightKg, 0),
      'KG',
    ).valueInUnit(weightUnit),
    units: row.units.map(({ weightKg, description, ...unit }) => ({
      ...unit,
      description: description ?? undefined,
      weight: Weight.from(weightKg, 'KG').valueInUnit(weightUnit),
    })),
  };
}
