import { CargoLoadPlan } from '../cargo-load-plan';
import type { CargoLoadPlanRepository } from '../cargo-load-plan.repository';
import type { CargoLoadPlanDbRow } from '../cargo-load-plan.queries';
import type { InMemoryCargoLoadPlanReadStore } from './cargo-load-plan.in-memory-queries';
import { toTrailerReadModel } from '../../trailers';
import type {
  CargoLoadPlanStatus as ContractCargoLoadPlanStatus,
  CargoType as ContractCargoType,
} from '../../../types/data-contracts';

function projectToRow(plan: CargoLoadPlan): CargoLoadPlanDbRow {
  const { id, trailer, status, currentLdm, assignedUnits, version } = plan.getSnapshot();
  return {
    id,
    status: status as unknown as ContractCargoLoadPlanStatus,
    trailer: toTrailerReadModel(trailer),
    currentLdm,
    version,
    units: assignedUnits.map(u => ({
      id: u.id,
      palletLabel: u.spec.label,
      cargoType: u.cargoType as unknown as ContractCargoType,
      weightKg: u.weight.valueInKg,
      totalHeightMm: u.totalHeightMm,
      requirements: u.requirements,
    })),
  };
}

export class InMemoryCargoLoadPlanRepository implements CargoLoadPlanRepository {
  private readonly aggregateTable = new Map<string, CargoLoadPlan>();

  constructor(private readonly readStore: InMemoryCargoLoadPlanReadStore) {}

  public async save(plan: CargoLoadPlan): Promise<void> {
    this.aggregateTable.set(plan.id, plan);
    this.readStore.set(plan.id, projectToRow(plan));
  }

  public async findById(id: string): Promise<CargoLoadPlan | null> {
    return this.aggregateTable.get(id) ?? null;
  }

  public async delete(id: string): Promise<void> {
    this.aggregateTable.delete(id);
    this.readStore.delete(id);
  }
}
