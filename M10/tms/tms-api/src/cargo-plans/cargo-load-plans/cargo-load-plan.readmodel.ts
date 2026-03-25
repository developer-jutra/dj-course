import type { WeightUnit } from '../../shared/weight';
import { Weight } from '../../shared/weight';
import type {
  CargoLoadPlanReadModel,
  WeightUnit as ContractWeightUnit,
} from '../../types/data-contracts';
import type { CargoLoadPlanDbRow } from './cargo-load-plan.repository';

export function toReadModel(
  row: CargoLoadPlanDbRow,
  weightUnit: WeightUnit,
): CargoLoadPlanReadModel {
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
