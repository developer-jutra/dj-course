import { UUID } from '../shared/uuid';
import { ok, fail, type Result } from '../shared/result';
import { CargoLoadPlan, type CargoLoadPlanDomainError } from './cargo-load-plans/cargo-load-plan';
import type { PalletUnit } from './pallets/pallet-unit';
import { LdmCalculator } from './ldm/ldm-calculator';
import { TrailerFactory, type PalletLoadableTrailerSpec } from './trailers';
import type { CargoLoadPlanRepository } from './cargo-load-plans/cargo-load-plan.repository';
import type { CargoLoadPlanQueries, CargoLoadPlanReadModel } from './cargo-load-plans/cargo-load-plan.queries';
import { OptimisticLockError } from '../shared/optimistic-lock-error';
import type {
  CreateLoadPlanCommand,
  AddCargoCommand,
  RemoveCargoCommand,
  ChangeTrailerCommand,
} from './cargo-plans.commands';
import type { WeightUnit } from '../shared/weight';

// ── Interface ───────────────────────────────────────────────────────────────

interface CargoPlansApplicationService {
  // Tworzy nowy plan przejazdu dla konkretnej naczepy
  createLoadPlan(command: CreateLoadPlanCommand): Promise<Result<string, CargoPlanServiceError>>;

  // Główna operacja dodawania towaru
  addCargoToPlan(command: AddCargoCommand): Promise<Result<void, CargoPlanServiceError>>;

  // Usuwanie towaru (zwalnianie LDM/wagi)
  removeCargoFromPlan(command: RemoveCargoCommand): Promise<Result<void, CargoPlanServiceError>>;

  // Zmiana typu naczepy w trakcie planowania (wymaga re-walidacji wszystkich ładunków)
  changeTrailerType(command: ChangeTrailerCommand): Promise<Result<void, CargoPlanServiceError>>;

  // Oznaczenie planu jako gotowy / zablokowanie dalszych zmian
  finalizeLoadPlan(loadPlanId: string): Promise<Result<void, CargoPlanServiceError>>;

  // Odczyt stanu planu (read-side, nie dotyka agregatu)
  findPlan(id: string, weightUnit?: WeightUnit): Promise<CargoLoadPlanReadModel | null>;
}

// ── Errors ──────────────────────────────────────────────────────────────────

export class LoadPlanNotFoundError {
  readonly kind = 'LoadPlanNotFoundError' as const;
  readonly message: string;
  constructor(readonly id: string) {
    this.message = `Load plan '${id}' not found`;
  }
}

export type CargoPlanServiceError =
  | LoadPlanNotFoundError
  | CargoLoadPlanDomainError
  | OptimisticLockError;

// ── Implementation ──────────────────────────────────────────────────────────

export class CargoPlansService implements CargoPlansApplicationService {
  private readonly ldmProvider = (units: PalletUnit[], trailer: PalletLoadableTrailerSpec) =>
    LdmCalculator.calculate(units, trailer);

  constructor(
    private readonly repository: CargoLoadPlanRepository,
    private readonly queries: CargoLoadPlanQueries,
  ) {}

  async createLoadPlan(command: CreateLoadPlanCommand): Promise<Result<string, CargoPlanServiceError>> {
    const trailer = TrailerFactory.fromType(command.trailerType);
    const id = UUID.newUUID<'CargoLoadPlan'>();
    const plan = new CargoLoadPlan(id, trailer, 0);
    try {
      await this.repository.save(plan);
    } catch (e) {
      return fail(this.normalizeError(e));
    }
    return ok(id);
  }

  async addCargoToPlan(command: AddCargoCommand): Promise<Result<void, CargoPlanServiceError>> {
    const planResult = await this.findLoadPlan(command.loadPlanId);
    if (!planResult.success) return planResult;

    const domainResult = planResult.value.addCargo(command, this.ldmProvider);
    if (!domainResult.success) return domainResult;

    try {
      await this.repository.save(planResult.value);
    } catch (e) {
      return fail(this.normalizeError(e));
    }
    return ok(undefined);
  }

  async removeCargoFromPlan(command: RemoveCargoCommand): Promise<Result<void, CargoPlanServiceError>> {
    const planResult = await this.findLoadPlan(command.loadPlanId);
    if (!planResult.success) return planResult;

    const domainResult = planResult.value.removePalletUnit(command.unitId, this.ldmProvider);
    if (!domainResult.success) return domainResult;

    try {
      await this.repository.save(planResult.value);
    } catch (e) {
      return fail(this.normalizeError(e));
    }
    return ok(undefined);
  }

  async changeTrailerType(command: ChangeTrailerCommand): Promise<Result<void, CargoPlanServiceError>> {
    const planResult = await this.findLoadPlan(command.loadPlanId);
    if (!planResult.success) return planResult;

    const newTrailer = TrailerFactory.fromType(command.trailerType);
    const domainResult = planResult.value.replaceTrailer(newTrailer, this.ldmProvider);
    if (!domainResult.success) return domainResult;

    try {
      await this.repository.save(planResult.value);
    } catch (e) {
      return fail(this.normalizeError(e));
    }
    return ok(undefined);
  }

  async finalizeLoadPlan(loadPlanId: string): Promise<Result<void, CargoPlanServiceError>> {
    const planResult = await this.findLoadPlan(loadPlanId);
    if (!planResult.success) return planResult;

    const domainResult = planResult.value.finalize();
    if (!domainResult.success) return domainResult;

    try {
      await this.repository.save(planResult.value);
    } catch (e) {
      return fail(this.normalizeError(e));
    }
    return ok(undefined);
  }

  async findPlan(id: string, weightUnit?: WeightUnit): Promise<CargoLoadPlanReadModel | null> {
    return this.queries.findPlan(id, weightUnit);
  }

  private async findLoadPlan(id: string): Promise<Result<CargoLoadPlan, CargoPlanServiceError>> {
    const plan = await this.repository.findById(id);
    if (!plan) return fail(new LoadPlanNotFoundError(id));
    return ok(plan);
  }

  private normalizeError(e: unknown): OptimisticLockError {
    if (e instanceof OptimisticLockError) return e;
    throw e;
  }
}
