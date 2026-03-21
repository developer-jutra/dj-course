import type {
  TrailerReadModel,
  TrailerType,
} from '../../types/data-contracts';
import type { PalletLoadableTrailerSpec } from './trailer-spec';

export function toTrailerReadModel(trailer: PalletLoadableTrailerSpec): TrailerReadModel {
  return {
    type: trailer.type as TrailerType,
    canCarryPallets: trailer.canCarryPallets,
    maxWeightCapacityKg: trailer.maxWeightCapacity.valueInKg,
    widthMm: trailer.widthMm,
    heightMm: trailer.heightMm,
    maxLdm: trailer.maxLdm,
    capabilities: trailer.capabilities,
  };
}
