// src/shared/result.ts
// Railway Oriented Programming – przepływ błędów jako część sygnatury metody

export type Result<T, E = Error> = Success<T, E> | Failure<T, E>;

export class Success<T, E> {
  readonly success = true as const;
  constructor(readonly value: T) {}
}

export class Failure<T, E> {
  readonly success = false as const;
  constructor(readonly error: E) {}
}

export const ok = <T, E>(value: T): Result<T, E> => new Success(value);
export const fail = <T, E>(error: E): Result<T, E> => new Failure(error);
