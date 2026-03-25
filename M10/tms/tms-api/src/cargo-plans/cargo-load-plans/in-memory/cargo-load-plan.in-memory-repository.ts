import { CargoLoadPlan } from '../cargo-load-plan';
import type { CargoLoadPlanRepository } from '../cargo-load-plan.repository';
import type { CargoLoadPlanDbRow } from '../cargo-load-plan.repository';
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
    units: assignedUnits.map(({ id, spec, cargoType, weight, totalHeightMm, requirements }) => {
      return {
        id,
        palletLabel: spec.label,
        cargoType: cargoType as unknown as ContractCargoType,
        weightKg: weight.valueInKg,
        totalHeightMm,
        requirements,
      };
    }),
  };
}

export class InMemoryCargoLoadPlanRepository implements CargoLoadPlanRepository {
  private readonly aggregateTable = new Map<string, CargoLoadPlan>();

  constructor(private readonly readStore: InMemoryCargoLoadPlanReadStore) {}

  public async create(plan: CargoLoadPlan): Promise<void> {
    const id = plan.getSnapshot().id;
    this.aggregateTable.set(id, plan);
    this.readStore.set(id, projectToRow(plan));
  }

  public async save(plan: CargoLoadPlan): Promise<void> {
    const id = plan.getSnapshot().id;
    this.aggregateTable.set(id, plan);
    this.readStore.set(id, projectToRow(plan));
  }

  public async findById(id: string): Promise<CargoLoadPlan | null> {
    return this.aggregateTable.get(id) ?? null;
  }

  public async delete(id: string): Promise<void> {
    this.aggregateTable.delete(id);
    this.readStore.delete(id);
  }
}
