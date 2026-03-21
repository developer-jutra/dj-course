export class UnknownPalletTypeError extends Error {
  constructor(type: string, allowed: string[]) {
    super(`Unknown pallet type: '${type}'. Allowed: ${allowed.join(', ')}`);
    this.name = 'UnknownPalletTypeError';
  }
}

export class PalletWeightExceedsCapacityError {
  readonly kind = 'PalletWeightExceedsCapacityError' as const;
  readonly message: string;
  constructor(readonly actualKg: number, readonly maxKg: number, readonly palletLabel: string) {
    this.message = `Weight ${actualKg}kg exceeds ${palletLabel} capacity (${maxKg}kg)`;
  }
}

export class PalletCargoTypeNotAllowedError {
  readonly kind = 'PalletCargoTypeNotAllowedError' as const;
  readonly message: string;
  constructor(readonly cargoType: string, readonly palletLabel: string) {
    this.message = `Cargo type ${cargoType} is not allowed on ${palletLabel}`;
  }
}

export type PalletDomainError =
  | PalletWeightExceedsCapacityError
  | PalletCargoTypeNotAllowedError;
