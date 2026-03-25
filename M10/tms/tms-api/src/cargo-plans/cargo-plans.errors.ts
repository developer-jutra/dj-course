import { type CargoLoadPlanDomainError } from './cargo-load-plans/cargo-load-plan.errors';
import { OptimisticLockError } from '../shared/optimistic-lock-error';

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
