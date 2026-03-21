import { randomUUID } from 'crypto';
import { ok, fail, type Result } from '../shared/result';
import { CargoLoadPlan } from './cargo-load-plans/cargo-load-plan';
import type { PalletUnit } from './pallets/pallet-unit';
import { LdmCalculator } from './ldm/ldm-calculator';
import { TrailerFactory, UnknownTrailerTypeError, type PalletLoadableTrailerSpec } from './trailers';
import { UnknownPalletTypeError } from './pallets/pallet-spec';
import type { CargoLoadPlanRepository } from './cargo-load-plans/cargo-load-plan.repository';
import type {
  CreateLoadPlanCommand,
  AddCargoCommand,
  RemoveCargoCommand,
  ChangeTrailerCommand,
} from './cargo-plans.commands';

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

  // Pobranie planu załadunkowego
  getLoadPlan(id: string): Promise<Result<CargoLoadPlan, CargoPlanServiceError>>;
}

// ── Errors ──────────────────────────────────────────────────────────────────

export class LoadPlanNotFoundError extends Error {
  constructor(id: string) {
    super(`Load plan '${id}' not found`);
    this.name = 'LoadPlanNotFoundError';
  }
}

export { UnknownTrailerTypeError, UnknownPalletTypeError };

export type CargoPlanServiceError =
  | LoadPlanNotFoundError
  | UnknownTrailerTypeError
  | UnknownPalletTypeError
  | Error;

// ── Implementation ──────────────────────────────────────────────────────────

export class CargoPlansService implements CargoPlansApplicationService {
  private readonly ldmProvider = (units: PalletUnit[], trailer: PalletLoadableTrailerSpec) =>
    LdmCalculator.calculate(units, trailer);

  constructor(private readonly repository: CargoLoadPlanRepository) {}

  async createLoadPlan(command: CreateLoadPlanCommand): Promise<Result<string, CargoPlanServiceError>> {
    try {
      const trailer = TrailerFactory.fromType(command.trailerType);
      const id = randomUUID();
      const plan = new CargoLoadPlan(id, trailer, 0);
      await this.repository.save(plan);
      return ok(id);
    } catch (e) {
      return fail(this.normalizeError(e));
    }
  }

  async addCargoToPlan(command: AddCargoCommand): Promise<Result<void, CargoPlanServiceError>> {
    const planResult = await this.findPlan(command.loadPlanId);
    if (!planResult.success) return planResult;

    try {
      planResult.value.addCargo(command, this.ldmProvider);
      await this.repository.save(planResult.value);
      return ok(undefined);
    } catch (e) {
      return fail(this.normalizeError(e));
    }
  }

  async removeCargoFromPlan(command: RemoveCargoCommand): Promise<Result<void, CargoPlanServiceError>> {
    const planResult = await this.findPlan(command.loadPlanId);
    if (!planResult.success) return planResult;

    try {
      planResult.value.removePalletUnit(command.unitId, this.ldmProvider);
      await this.repository.save(planResult.value);
      return ok(undefined);
    } catch (e) {
      return fail(this.normalizeError(e));
    }
  }

  async changeTrailerType(command: ChangeTrailerCommand): Promise<Result<void, CargoPlanServiceError>> {
    const planResult = await this.findPlan(command.loadPlanId);
    if (!planResult.success) return planResult;

    try {
      const newTrailer = TrailerFactory.fromType(command.trailerType);
      planResult.value.replaceTrailer(newTrailer, this.ldmProvider);
      await this.repository.save(planResult.value);
      return ok(undefined);
    } catch (e) {
      return fail(this.normalizeError(e));
    }
  }

  async finalizeLoadPlan(loadPlanId: string): Promise<Result<void, CargoPlanServiceError>> {
    const planResult = await this.findPlan(loadPlanId);
    if (!planResult.success) return planResult;

    try {
      planResult.value.finalize();
      await this.repository.save(planResult.value);
      return ok(undefined);
    } catch (e) {
      return fail(this.normalizeError(e));
    }
  }

  async getLoadPlan(id: string): Promise<Result<CargoLoadPlan, CargoPlanServiceError>> {
    return this.findPlan(id);
  }

  private async findPlan(id: string): Promise<Result<CargoLoadPlan, CargoPlanServiceError>> {
    const plan = await this.repository.findById(id);
    if (!plan) return fail(new LoadPlanNotFoundError(id));
    return ok(plan);
  }

  private normalizeError(e: unknown): CargoPlanServiceError {
    if (e instanceof LoadPlanNotFoundError || e instanceof UnknownTrailerTypeError || e instanceof UnknownPalletTypeError) {
      return e;
    }
    return e instanceof Error ? e : new Error(String(e));
  }
}
