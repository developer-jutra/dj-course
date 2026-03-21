/**
 * Step definitions for Pallet Spec value object (pure domain, no I/O).
 */
import { When, Then } from '@cucumber/cucumber';
import assert from 'assert';

import { PalletSpec } from './pallet-spec';
import { CargoType } from '../cargo/cargo.types';
import type { Material } from './pallet-spec';
import { Weight } from '../../shared/weight';

type FactoryKey = 'epal1' | 'industrial' | 'half' | 'cp1' | 'cp3' | 'h1';

function getFactory(key: FactoryKey): () => PalletSpec {
  const map: Record<FactoryKey, () => PalletSpec> = {
    epal1: PalletSpec.epal1,
    industrial: PalletSpec.industrial,
    half: PalletSpec.half,
    cp1: PalletSpec.cp1,
    cp3: PalletSpec.cp3,
    h1: PalletSpec.h1,
  };
  const fn = map[key];
  if (!fn) throw new Error(`Unknown factory: ${key}`);
  return fn;
}

function parseMaterial(s: string): Material {
  const allowed: Material[] = ['Wood', 'Plastic', 'Metal', 'HDPE'];
  if (!allowed.includes(s as Material)) throw new Error(`Unknown material: ${s}`);
  return s as Material;
}

function parseCargoTypes(s: string): CargoType[] {
  if (!s || s.trim().length === 0) return [];
  const map: Record<string, CargoType> = {
    GENERAL: CargoType.GENERAL,
    FOOD: CargoType.FOOD,
    CHEMICAL: CargoType.CHEMICAL,
    ELECTRONICS: CargoType.ELECTRONICS,
    ADR: CargoType.DANGEROUS_GOODS,
  };
  return s.split(/\s+/).map((t) => {
    const ct = map[t];
    if (!ct) throw new Error(`Unknown cargo type: ${t}`);
    return ct;
  });
}

function parseDimensions(s: string): { width: number; length: number; height: number } {
  const parts = s.split('x').map((p) => parseInt(p.trim(), 10));
  if (parts.length !== 3) throw new Error(`Invalid dimensions format: ${s}`);
  return { width: parts[0], length: parts[1], height: parts[2] };
}

interface PalletSpecWorld {
  lastSpec?: PalletSpec;
  lastError?: Error;
}

When('I create pallet spec using {word}', function (this: PalletSpecWorld, factoryKey: string) {
  this.lastError = undefined;
  this.lastSpec = getFactory(factoryKey as FactoryKey)();
});

When(
  'I try to create pallet spec with label {string} material {word} cargo types {string} dimensions {string} max load {int}',
  function (
    this: PalletSpecWorld,
    label: string,
    materialStr: string,
    cargoTypesStr: string,
    dimensionsStr: string,
    maxLoadKg: number
  ) {
    this.lastSpec = undefined;
    this.lastError = undefined;
    try {
      const material = parseMaterial(materialStr);
      const allowedCargoTypes = parseCargoTypes(cargoTypesStr);
      const { width, length, height } = parseDimensions(dimensionsStr);
      this.lastSpec = new PalletSpec(label, material, allowedCargoTypes, width, length, height, Weight.from(maxLoadKg, 'KG'));
    } catch (e) {
      this.lastError = e as Error;
    }
  }
);

Then('the pallet spec should be created successfully', function (this: PalletSpecWorld) {
  assert(this.lastSpec, 'Expected pallet spec to be created');
});

Then('the spec label should be {string}', function (this: PalletSpecWorld, expected: string) {
  assert(this.lastSpec, 'Expected pallet spec to exist');
  assert.strictEqual(this.lastSpec!.label, expected, `Expected label "${expected}", got "${this.lastSpec!.label}"`);
});

Then('the spec dimensions should be {int} x {int} x {int} mm', function (this: PalletSpecWorld, w: number, l: number, h: number) {
  assert(this.lastSpec, 'Expected pallet spec to exist');
  assert.strictEqual(this.lastSpec!.width, w, `Expected width ${w}, got ${this.lastSpec!.width}`);
  assert.strictEqual(this.lastSpec!.length, l, `Expected length ${l}, got ${this.lastSpec!.length}`);
  assert.strictEqual(this.lastSpec!.height, h, `Expected height ${h}, got ${this.lastSpec!.height}`);
});

Then('the spec max load should be {int} kg', function (this: PalletSpecWorld, expected: number) {
  assert(this.lastSpec, 'Expected pallet spec to exist');
  assert.strictEqual(this.lastSpec!.maxLoadCapacity.valueInKg, expected, `Expected maxLoadCapacity ${expected}kg, got ${this.lastSpec!.maxLoadCapacity.valueInKg}kg`);
});

Then('the spec material should be {string}', function (this: PalletSpecWorld, expected: string) {
  assert(this.lastSpec, 'Expected pallet spec to exist');
  assert.strictEqual(this.lastSpec!.material, expected, `Expected material "${expected}", got "${this.lastSpec!.material}"`);
});

// "it should fail with {string}" reused from cargo-load-plan.steps.ts (shared Cucumber world)
