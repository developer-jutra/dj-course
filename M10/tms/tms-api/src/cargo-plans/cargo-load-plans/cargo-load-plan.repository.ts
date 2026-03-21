import { CargoLoadPlan } from './cargo-load-plan';
import type { PalletUnit } from '../pallets/pallet-unit';
import { CargoLoadPlanStatus } from './cargo-load-plan.types';
import { TrailerFactory } from '../trailers';

/**
 * Repository interface (Domain layer).
 */
export interface CargoLoadPlanRepository {
  save(plan: CargoLoadPlan): Promise<void>;
  findById(id: string): Promise<CargoLoadPlan | null>;
  delete(id: string): Promise<void>;
}

/**
 * Mock SQL Repository implementation demonstrating rehydration.
 */
export class SqlCargoLoadPlanRepository implements CargoLoadPlanRepository {
  public async save(plan: CargoLoadPlan): Promise<void> {
    const dbModel = {
      id: plan.id,
      trailer_data: JSON.stringify(plan.trailer),
      total_ldm: plan.currentLdm,
      status: plan.status,
      units: JSON.stringify(plan.assignedUnits)
    };
    console.log(`Saving plan ${plan.id} to DB with LDM: ${dbModel.total_ldm}`);
  }

  public async findById(id: string): Promise<CargoLoadPlan | null> {
    // Mocking DB response
    const mockRow = {
      id: id,
      trailer_spec: TrailerFactory.standardCurtainside(),
      total_ldm: 1.2,
      units: [] as PalletUnit[],
      status: CargoLoadPlanStatus.DRAFT
    };

    return new CargoLoadPlan(
      mockRow.id,
      mockRow.trailer_spec,
      mockRow.total_ldm,
      mockRow.units,
      mockRow.status
    );
  }

  public async delete(id: string): Promise<void> {
    console.log(`Deleting plan ${id} from DB`);
  }
}

/**
 * In-memory repository – keeps aggregate instances in a Map.
 * Suitable for demos, tests, and local development without a database.
 */
export class InMemoryCargoLoadPlanRepository implements CargoLoadPlanRepository {
  private readonly store = new Map<string, CargoLoadPlan>();

  public async save(plan: CargoLoadPlan): Promise<void> {
    this.store.set(plan.id, plan);
  }

  public async findById(id: string): Promise<CargoLoadPlan | null> {
    return this.store.get(id) ?? null;
  }

  public async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
