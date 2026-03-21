import type { CargoType, CargoRequirements } from './cargo/cargo.types';
import type { Weight } from '../shared/weight';

export interface CreateLoadPlanCommand {
  trailerType: string;
}

export interface AddCargoCommand {
  loadPlanId: string;
  palletType: string;
  cargoType: CargoType;
  requirements: CargoRequirements;
  weight: Weight;
  cargoHeightMm: number;
}

export interface RemoveCargoCommand {
  loadPlanId: string;
  unitId: string;
}

export interface ChangeTrailerCommand {
  loadPlanId: string;
  trailerType: string;
}
