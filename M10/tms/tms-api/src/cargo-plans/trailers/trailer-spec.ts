import { Weight } from '../../shared/weight';

export interface TrailerCapabilities {
  readonly hasClimateControl: boolean;
  readonly supportsSideLoading: boolean;
  readonly hasHighSecurityLock: boolean;
  readonly isBulkReady: boolean;
}

export interface TrailerSpec {
  readonly type: string;
  readonly capabilities: TrailerCapabilities;
  readonly canCarryPallets: boolean;
  readonly maxWeightCapacity: Weight;
}

export type PalletLoadableTrailerSpec = TrailerSpec & {
  readonly canCarryPallets: true;
  readonly widthMm: number;
  readonly heightMm: number;
  readonly maxLdm: number;
};

export function isPalletLoadable(spec: TrailerSpec): spec is PalletLoadableTrailerSpec {
  return spec.canCarryPallets === true && 'widthMm' in spec && 'maxLdm' in spec;
}
