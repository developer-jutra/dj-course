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
export {
  type TrailerCapabilities,
  type TrailerSpec,
  type PalletLoadableTrailerSpec,
  isPalletLoadable,
  TrailerFactory
} from './trailers';

// Entities
export { PalletUnit } from './pallets/pallet-unit';

// Domain Services
export { LdmCalculator } from './ldm/ldm-calculator';

// Aggregate Root
export { CargoLoadPlan } from './cargo-load-plans/cargo-load-plan';

// Repository
export type { CargoLoadPlanRepository } from './cargo-load-plans/cargo-load-plan.repository';
export { SqlCargoLoadPlanRepository, InMemoryCargoLoadPlanRepository } from './cargo-load-plans/cargo-load-plan.repository';

// Commands
export {
  type CreateLoadPlanCommand,
  type AddCargoCommand,
  type RemoveCargoCommand,
  type ChangeTrailerCommand,
} from './cargo-plans.commands';

// Application Service
export {
  CargoPlansService,
  LoadPlanNotFoundError,
  UnknownTrailerTypeError,
  UnknownPalletTypeError,
} from './cargo-plans-service';
