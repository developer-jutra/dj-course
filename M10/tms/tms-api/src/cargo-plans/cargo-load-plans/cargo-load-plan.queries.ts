import { pool } from '../../database';
import type { WeightUnit } from '../../shared/weight';
import type { CargoLoadPlanReadModel } from '../../types/data-contracts';
import { PalletSpec } from '../pallets/pallet-spec';
import { TrailerFactory, toTrailerReadModel } from '../trailers';
import type { CargoLoadPlanDbRow } from './cargo-load-plan.repository';
import { toReadModel } from './cargo-load-plan.readmodel';

export type { CargoLoadPlanDbRow, CargoLoadPlanReadModel };
export { toReadModel } from './cargo-load-plan.readmodel';

// ── Interface (Application layer) ───────────────────────────────────────────

export interface CargoLoadPlanQueries {
  findPlan(id: string, weightUnit?: WeightUnit): Promise<CargoLoadPlanReadModel | null>;
}

// ── SQL implementation ───────────────────────────────────────────────────────

export class SqlCargoLoadPlanQueries implements CargoLoadPlanQueries {
  async findPlan(id: string, weightUnit: WeightUnit = 'KG'): Promise<CargoLoadPlanReadModel | null> {
    const { rows: planRows } = await pool.query(
      `SELECT id, trailer_type, status, current_ldm, version
       FROM cargo_plans.cargo_load_plans
       WHERE id = $1`,
      [id],
    );

    if (planRows.length === 0) return null;

    const planRow = planRows[0];
    const trailer = TrailerFactory.fromType(planRow.trailer_type);

    const { rows: unitRows } = await pool.query(
      `SELECT id, pallet_type, cargo_type, description, weight_kg, cargo_height_mm,
              is_temperature_controlled, requires_side_loading, is_bulk, high_security_required
       FROM cargo_plans.cargo_load_plan_units
       WHERE load_plan_id = $1`,
      [id],
    );

    const row: CargoLoadPlanDbRow = {
      id: planRow.id,
      status: planRow.status,
      trailer: toTrailerReadModel(trailer),
      currentLdm: parseFloat(planRow.current_ldm),
      version: planRow.version,
      units: unitRows.map(u => {
        const spec = PalletSpec.fromType(u.pallet_type);
        return {
          id: u.id,
          palletLabel: spec.label,
          cargoType: u.cargo_type,
          description: u.description ?? null,
          weightKg: parseFloat(u.weight_kg),
          totalHeightMm: spec.height + parseInt(u.cargo_height_mm, 10),
          requirements: {
            isTemperatureControlled: u.is_temperature_controlled,
            requiresSideLoading: u.requires_side_loading,
            isBulk: u.is_bulk,
            highSecurityRequired: u.high_security_required,
          },
        };
      }),
    };

    return toReadModel(row, weightUnit);
  }
}
