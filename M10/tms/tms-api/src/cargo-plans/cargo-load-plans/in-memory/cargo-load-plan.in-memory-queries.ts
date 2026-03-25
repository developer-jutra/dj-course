import type { WeightUnit } from '../../../shared/weight';
import type {
  CargoLoadPlanDbRow,
  CargoLoadPlanQueries,
  CargoLoadPlanReadModel,
} from '../cargo-load-plan.queries';
import { toReadModel } from '../cargo-load-plan.queries';

export class InMemoryCargoLoadPlanReadStore {
  private readonly table = new Map<string, CargoLoadPlanDbRow>();

  set(id: string, row: CargoLoadPlanDbRow): void {
    this.table.set(id, row);
  }

  get(id: string): CargoLoadPlanDbRow | null {
    return this.table.get(id) ?? null;
  }

  delete(id: string): void {
    this.table.delete(id);
  }
}

export class InMemoryCargoLoadPlanQueries implements CargoLoadPlanQueries {
  constructor(private readonly readStore: InMemoryCargoLoadPlanReadStore) {}

  async findPlan(id: string, weightUnit: WeightUnit = 'KG'): Promise<CargoLoadPlanReadModel | null> {
    const row = this.readStore.get(id);
    if (!row) return null;
    return toReadModel(row, weightUnit);
  }
}
