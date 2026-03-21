import { pool } from '../../database';
import { OptimisticLockError } from '../../shared/optimistic-lock-error';
import { UUID } from '../../shared/uuid';
import { CargoLoadPlan } from './cargo-load-plan';
import { CargoLoadPlanStatus } from './cargo-load-plan.types';
import { PalletUnit } from '../pallets/pallet-unit';
import { PalletSpec } from '../pallets/pallet-spec';
import { TrailerFactory } from '../trailers';
import { Weight } from '../../shared/weight';
import type { PoolClient } from 'pg';

export interface CargoLoadPlanRepository {
  save(plan: CargoLoadPlan): Promise<void>;
  findById(id: string): Promise<CargoLoadPlan | null>;
  delete(id: string): Promise<void>;
}

export class SqlCargoLoadPlanRepository implements CargoLoadPlanRepository {
  public async save(plan: CargoLoadPlan): Promise<void> {
    const { id, trailer, status, currentLdm, assignedUnits, version } = plan.getSnapshot();
    const trailerTypeKey = TrailerFactory.toTypeKey(trailer);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      if (version === 0) {
        await client.query(
          `INSERT INTO cargo_plans.cargo_load_plans (id, trailer_type, status, current_ldm, version)
           VALUES ($1, $2, $3, $4, 1)`,
          [id, trailerTypeKey, status, currentLdm],
        );
      } else {
        const { rowCount } = await client.query(
          `UPDATE cargo_plans.cargo_load_plans
           SET trailer_type = $1, status = $2, current_ldm = $3, version = version + 1
           WHERE id = $4 AND version = $5`,
          [trailerTypeKey, status, currentLdm, id, version],
        );
        if (rowCount === 0) {
          const currentVersion = await this.fetchVersion(client, id);
          await client.query('ROLLBACK');
          throw new OptimisticLockError('CargoLoadPlan', id, version, currentVersion ?? -1);
        }
      }

      await client.query(
        'DELETE FROM cargo_plans.cargo_load_plan_units WHERE load_plan_id = $1',
        [id],
      );

      for (const unit of assignedUnits) {
        const palletTypeKey = PalletSpec.toTypeKey(unit.spec);
        const cargoHeightMm = unit.totalHeightMm - unit.spec.height;
        await client.query(
          `INSERT INTO cargo_plans.cargo_load_plan_units
             (id, load_plan_id, pallet_type, cargo_type, description, weight_kg, cargo_height_mm,
              is_temperature_controlled, requires_side_loading, is_bulk, high_security_required)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            unit.id,
            id,
            palletTypeKey,
            unit.cargoType,
            null, // description – API-created units have none
            unit.weight.valueInKg,
            cargoHeightMm,
            unit.requirements.isTemperatureControlled,
            unit.requirements.requiresSideLoading,
            unit.requirements.isBulk,
            unit.requirements.highSecurityRequired,
          ],
        );
      }

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  public async findById(id: string): Promise<CargoLoadPlan | null> {
    const { rows: planRows } = await pool.query(
      `SELECT id, trailer_type, status, current_ldm, version
       FROM cargo_plans.cargo_load_plans
       WHERE id = $1`,
      [id],
    );

    if (planRows.length === 0) return null;

    const row = planRows[0];
    const trailer = TrailerFactory.fromType(row.trailer_type);

    const { rows: unitRows } = await pool.query(
      `SELECT id, pallet_type, cargo_type, weight_kg, cargo_height_mm,
              is_temperature_controlled, requires_side_loading, is_bulk, high_security_required
       FROM cargo_plans.cargo_load_plan_units
       WHERE load_plan_id = $1`,
      [id],
    );

    const units: PalletUnit[] = unitRows.map(u => {
      const spec = PalletSpec.fromType(u.pallet_type);
      return new PalletUnit(
        UUID.from<'CargoUnit'>(u.id),
        spec,
        u.cargo_type,
        {
          isTemperatureControlled: u.is_temperature_controlled,
          requiresSideLoading: u.requires_side_loading,
          isBulk: u.is_bulk,
          highSecurityRequired: u.high_security_required,
        },
        Weight.from(parseFloat(u.weight_kg), 'KG'),
        parseInt(u.cargo_height_mm, 10),
      );
    });

    return new CargoLoadPlan(
      UUID.from<'CargoLoadPlan'>(row.id),
      trailer,
      parseFloat(row.current_ldm),
      units,
      row.status as CargoLoadPlanStatus,
      row.version,
    );
  }

  public async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM cargo_plans.cargo_load_plans WHERE id = $1', [id]);
  }

  private async fetchVersion(client: PoolClient, id: string): Promise<number | null> {
    const { rows } = await client.query(
      'SELECT version FROM cargo_plans.cargo_load_plans WHERE id = $1',
      [id],
    );
    return rows.length > 0 ? rows[0].version : null;
  }
}
