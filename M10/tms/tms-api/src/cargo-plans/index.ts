/**
 * Cargo Plans – Bounded Context (DDD)
 *
 * Re-exports domain types, value objects, pallet-unit entity, services, aggregate, repository
 * and the application service.
 */

// Types & enums
export { CargoType, type CargoRequirements } from './cargo/cargo.types';
export { CargoLoadPlanStatus } from './cargo-load-plans/cargo-load-plan.types';

// Value Objects
export { PalletSpec, type Material } from './pallets/pallet-spec';
export { UnknownPalletTypeError } from './pallets/pallet-spec.errors';
export {
  type TrailerCapabilities,
  type TrailerSpec,
  type PalletLoadableTrailerSpec,
  isPalletLoadable,
  TrailerFactory,
  UnknownTrailerTypeError,
} from './trailers';

// Entities
export { PalletUnit } from './pallets/pallet-unit';

// Domain Services
export { LdmCalculator } from './ldm/ldm-calculator';

// Aggregate Root
export { CargoLoadPlan } from './cargo-load-plans/cargo-load-plan';

// Repository
export type { CargoLoadPlanRepository } from './cargo-load-plans/cargo-load-plan.repository';
export { SqlCargoLoadPlanRepository } from './cargo-load-plans/cargo-load-plan.repository';
export { InMemoryCargoLoadPlanRepository } from './cargo-load-plans/in-memory/cargo-load-plan.in-memory-repository';

// Commands
export {
  type CreateLoadPlanCommand,
  type AddCargoCommand,
  type RemoveCargoCommand,
  type ChangeTrailerCommand,
} from './cargo-plans.commands';

// Application Service
export { CargoPlansService, LoadPlanNotFoundError } from './cargo-plans-service';
