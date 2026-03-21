/**
 * Step definitions for Pallet Unit entity (pure domain, no I/O).
 */
import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';

import { PalletUnit } from './pallet-unit';
import { PalletSpec } from './pallet-spec';
import { CargoType } from '../cargo/cargo.types';
import { Weight } from '../../shared/weight';

type PalletSpecKey = 'EPAL1' | 'H1' | 'CP1' | 'Industrial' | 'Half';

function getPalletSpec(key: PalletSpecKey): PalletSpec {
  switch (key) {
    case 'EPAL1':
      return PalletSpec.epal1();
    case 'H1':
      return PalletSpec.h1();
    case 'CP1':
      return PalletSpec.cp1();
    case 'Industrial':
      return PalletSpec.industrial();
    case 'Half':
      return PalletSpec.half();
    default:
      throw new Error(`Unknown pallet spec: ${key}`);
  }
}

function parseCargoType(type: string): CargoType {
  const map: Record<string, CargoType> = {
    GENERAL: CargoType.GENERAL,
    FOOD: CargoType.FOOD,
    CHEMICAL: CargoType.CHEMICAL,
    ELECTRONICS: CargoType.ELECTRONICS,
    ADR: CargoType.DANGEROUS_GOODS,
  };
  const resolved = map[type];
  if (!resolved) throw new Error(`Unknown cargo type: ${type}`);
  return resolved;
}

interface PalletUnitWorld {
  palletSpec?: PalletSpec;
  lastUnit?: PalletUnit;
  lastError?: Error;
}

Given('{word} pallet spec', function (this: PalletUnitWorld, specKey: PalletSpecKey) {
  this.palletSpec = getPalletSpec(specKey);
});

When(
  'I create a pallet unit with id {string} cargo type {word} weight {int} kg cargo height {int} mm',
  function (this: PalletUnitWorld, id: string, cargoTypeStr: string, weightKg: number, cargoHeightMm: number) {
    assert(this.palletSpec);
    const cargoType = parseCargoType(cargoTypeStr);
    this.lastUnit = new PalletUnit(id, this.palletSpec!, cargoType, {
      isTemperatureControlled: false,
      requiresSideLoading: false,
      isBulk: false,
      highSecurityRequired: false,
    }, Weight.from(weightKg, 'KG'), cargoHeightMm);
  }
);

When(
  'I try to create a pallet unit with id {string} cargo type {word} weight {int} kg cargo height {int} mm',
  function (this: PalletUnitWorld, id: string, cargoTypeStr: string, weightKg: number, cargoHeightMm: number) {
    assert(this.palletSpec);
    try {
      const cargoType = parseCargoType(cargoTypeStr);
      this.lastUnit = new PalletUnit(id, this.palletSpec!, cargoType, {
        isTemperatureControlled: false,
        requiresSideLoading: false,
        isBulk: false,
        highSecurityRequired: false,
      }, Weight.from(weightKg, 'KG'), cargoHeightMm);
    } catch (e) {
      this.lastError = e as Error;
    }
  }
);

Then('the pallet unit should be created successfully', function (this: PalletUnitWorld) {
  assert(this.lastUnit, 'Expected pallet unit to be created');
});

Then('total height should be {int} mm', function (this: PalletUnitWorld, expectedMm: number) {
  assert(this.lastUnit, 'Expected pallet unit to exist');
  assert.strictEqual(
    this.lastUnit!.totalHeightMm,
    expectedMm,
    `Expected totalHeightMm=${expectedMm}, got ${this.lastUnit!.totalHeightMm}`
  );
});

// "it should fail with {string}" reused from cargo-load-plan.steps.ts (shared Cucumber world)
