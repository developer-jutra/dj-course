import { Weight } from '../../shared/weight';

/** Defines specific functional features of a transport trailer. */
export interface TrailerCapabilities {
  /** Indicates presence of temperature regulation systems. Example cargo: Frozen meat. */
  readonly hasClimateControl: boolean;
  /** Confirms if cargo can be loaded from the side. Example cargo: Long timber. */
  readonly supportsSideLoading: boolean;
  /** Specifies reinforced locking mechanisms for high-value goods. Example cargo: Electronics. */
  readonly hasHighSecurityLock: boolean;
  /** Determines suitability for transporting loose bulk materials. Example cargo: Grain. */
  readonly isBulkReady: boolean;
}

/** General physical and functional description of a trailer. */
export interface TrailerSpec {
  /** Categorization of the trailer chassis or body style. Example: "Reefer". */
  readonly type: string;
  /** Embedded set of specific operational capabilities and features. */
  readonly capabilities: TrailerCapabilities;
  /** Boolean flag for standard palletized cargo compatibility. Example: True. */
  readonly canCarryPallets: boolean;
  /** Absolute limit of cargo mass the trailer supports. Example: 24000kg. */
  readonly maxWeightCapacity: Weight;
}

/** Specialized specification for trailers designed for pallet transport. */
export type PalletLoadableTrailerSpec = TrailerSpec & {
  /** Explicit requirement for pallet loading capability. Example: True. */
  readonly canCarryPallets: true;
  /** Internal horizontal span of the trailer in millimeters. Example: 2450. */
  readonly widthMm: number;
  /** Internal vertical clearance of the trailer in millimeters. Example: 2700. */
  readonly heightMm: number;
  /** Maximum loading meters available for cargo placement. Example: 13.6 (typical for TIR 😎). */
  readonly maxLdm: number;
};

export function isPalletLoadable(spec: TrailerSpec): spec is PalletLoadableTrailerSpec {
  return spec.canCarryPallets === true && 'widthMm' in spec && 'maxLdm' in spec;
}
