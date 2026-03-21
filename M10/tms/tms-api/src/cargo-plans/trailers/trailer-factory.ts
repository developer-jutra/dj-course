import type { PalletLoadableTrailerSpec } from './trailer-spec';
import type { TrailerSpec } from './trailer-spec';
import { Weight } from '../../shared/weight';
import { UnknownTrailerTypeError } from './trailer-factory.errors';

export { UnknownTrailerTypeError } from './trailer-factory.errors';

const REGISTRY: Record<string, () => PalletLoadableTrailerSpec> = {
  'standard-curtainside': () => TrailerFactory.standardCurtainside(),
  'mega': () => TrailerFactory.megaTrailer(),
  'reefer': () => TrailerFactory.refrigerated(),
};

export class TrailerFactory {
  static fromType(type: string): PalletLoadableTrailerSpec {
    const factory = REGISTRY[type];
    if (!factory) throw new UnknownTrailerTypeError(type, Object.keys(REGISTRY));
    return factory();
  }

  static toTypeKey(trailer: PalletLoadableTrailerSpec): string {
    const entry = Object.entries(REGISTRY).find(([, factory]) => factory().type === trailer.type);
    if (!entry) throw new UnknownTrailerTypeError(trailer.type, Object.keys(REGISTRY));
    return entry[0];
  }

  static allowedTypes(): string[] {
    return Object.keys(REGISTRY);
  }

  static standardCurtainside(): PalletLoadableTrailerSpec {
    return {
      type: 'Standard Curtainside',
      capabilities: { hasClimateControl: false, supportsSideLoading: true, hasHighSecurityLock: false, isBulkReady: false },
      canCarryPallets: true,
      maxWeightCapacity: Weight.from(24000, 'KG'),
      maxLdm: 13.6,
      widthMm: 2480,
      heightMm: 2700
    };
  }

  static megaTrailer(): PalletLoadableTrailerSpec {
    return {
      type: 'Mega Trailer',
      capabilities: { hasClimateControl: false, supportsSideLoading: true, hasHighSecurityLock: false, isBulkReady: false },
      canCarryPallets: true,
      maxWeightCapacity: Weight.from(24000, 'KG'),
      maxLdm: 13.6,
      widthMm: 2480,
      heightMm: 3000
    };
  }

  static refrigerated(): PalletLoadableTrailerSpec {
    return {
      type: 'Reefer',
      capabilities: { hasClimateControl: true, supportsSideLoading: false, hasHighSecurityLock: true, isBulkReady: false },
      canCarryPallets: true,
      maxWeightCapacity: Weight.from(22000, 'KG'),
      maxLdm: 13.4,
      widthMm: 2460,
      heightMm: 2600
    };
  }

  static tankTrailer(): TrailerSpec {
    return {
      type: 'Tanker',
      capabilities: { hasClimateControl: false, supportsSideLoading: false, hasHighSecurityLock: false, isBulkReady: true },
      canCarryPallets: false,
      maxWeightCapacity: Weight.from(25000, 'KG')
    };
  }
}
