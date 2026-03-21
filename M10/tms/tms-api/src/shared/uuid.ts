import { randomUUID } from 'crypto';
import type { Brand } from './brands';

// export type _UUID = Brand<string, 'UUID'>
// export type UUID<TEntity extends string = string> = Brand<string, `UUID_${TEntity}`>;

export type UUID<T extends string = string> = string extends T
  ? Brand<string, 'UUID'> // universal UUID brand for all UUIDs:
  : Brand<string, `UUID_${T}`>; // alternatively you could create a brand for each UUID type

// examples:
type UUID_CargoLoadPlan = UUID<'CargoLoadPlan'>; // brand: 'UUID_CargoLoadPlan'
type UUID_CargoUnit = UUID<'CargoUnit'>; // brand: 'UUID_CargoUnit'
type UUID_universal = UUID; // brand: 'UUID'

// simplistic implementation:
export const UUID_simplistic = {
  newUUID: (): UUID => randomUUID() as UUID,
  from: (uuid: string): UUID => uuid as UUID,
};

export const UUID = {
  newUUID: <T extends string = string>(): UUID<T> => randomUUID() as UUID<T>,
  from: <T extends string = string>(uuid: string): UUID<T> => uuid as UUID<T>,
};

// example:
const uuid_generic = UUID.newUUID();
const uuid_cargo_load_plan = UUID.newUUID<('CargoLoadPlan')>();
const uuid_cargo_unit = UUID.from<('CargoUnit')>('123e4567-e89b-12d3-a456-426614174000');
