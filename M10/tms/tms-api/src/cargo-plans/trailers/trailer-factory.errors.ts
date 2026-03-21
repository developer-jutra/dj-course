export class UnknownTrailerTypeError extends Error {
  constructor(type: string, allowed: string[]) {
    super(`Unknown trailer type: '${type}'. Allowed: ${allowed.join(', ')}`);
    this.name = 'UnknownTrailerTypeError';
  }
}
