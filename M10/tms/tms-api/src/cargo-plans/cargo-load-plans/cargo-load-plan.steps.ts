import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';

import { CargoLoadPlan } from './cargo-load-plan';
import { PalletUnit } from '../pallets/pallet-unit';
import { PalletSpec } from '../pallets/pallet-spec';
import { LdmCalculator } from '../ldm/ldm-calculator';
import { TrailerFactory } from '../trailers';
import { CargoType } from '../cargo/cargo.types';
import { CargoLoadPlanStatus } from './cargo-load-plan.types';
import type { PalletLoadableTrailerSpec } from '../trailers';
import { Weight } from '../../shared/weight';

const ldmProvider = (u: PalletUnit[], t: PalletLoadableTrailerSpec) => LdmCalculator.calculate(u, t);

// Minimal trailer specs for edge-case tests
function trailerWithMaxWeight(maxWeightKg: number): PalletLoadableTrailerSpec {
  return {
    ...TrailerFactory.standardCurtainside(),
    maxWeightCapacity: Weight.from(maxWeightKg, 'KG'),
  };
}

function trailerWithMaxLdm(maxLdm: number): PalletLoadableTrailerSpec {
  return {
    ...TrailerFactory.standardCurtainside(),
    maxLdm,
  };
}

function trailerWithHeight(heightMm: number): PalletLoadableTrailerSpec {
  return {
    ...TrailerFactory.standardCurtainside(),
    heightMm,
  };
}

function createPalletUnit(
  id: string,
  spec: PalletSpec,
  cargoType: CargoType,
  weightKg: number,
  cargoHeightMm: number,
  requirements: { isTemperatureControlled?: boolean; requiresSideLoading?: boolean; isBulk?: boolean; highSecurityRequired?: boolean } = {}
) {
  return new PalletUnit(id, spec, cargoType, {
    isTemperatureControlled: requirements.isTemperatureControlled ?? false,
    requiresSideLoading: requirements.requiresSideLoading ?? false,
    isBulk: requirements.isBulk ?? false,
    highSecurityRequired: requirements.highSecurityRequired ?? false,
  }, Weight.from(weightKg, 'KG'), cargoHeightMm);
}

function generalPallet(id: string, weightKg: number, cargoHeightMm = 100): PalletUnit {
  return createPalletUnit(id, PalletSpec.epal1(), CargoType.GENERAL, weightKg, cargoHeightMm);
}

function foodPallet(id: string, weightKg: number, opts?: { temperatureControlled?: boolean }): PalletUnit {
  return createPalletUnit(id, PalletSpec.h1(), CargoType.FOOD, weightKg, 100, {
    isTemperatureControlled: opts?.temperatureControlled ?? false,
  });
}

function dangerousGoodsPallet(id: string, weightKg: number): PalletUnit {
  return createPalletUnit(id, PalletSpec.cp1(), CargoType.DANGEROUS_GOODS, weightKg, 100);
}

function chemicalPallet(id: string, weightKg: number): PalletUnit {
  return createPalletUnit(id, PalletSpec.cp1(), CargoType.CHEMICAL, weightKg, 100);
}

/** Pallet with custom total height: totalHeightMm = spec.height + cargoHeightMm */
function palletWithHeight(id: string, totalHeightMm: number, weightKg: number): PalletUnit {
  const spec = PalletSpec.epal1();
  const cargoHeightMm = totalHeightMm - spec.height;
  return createPalletUnit(id, spec, CargoType.GENERAL, weightKg, cargoHeightMm);
}

interface CargoLoadPlanWorld {
  plan?: CargoLoadPlan;
  lastError?: Error;
  lastUnit?: PalletUnit;
}

Given('an empty load plan with standard curtainside trailer', function (this: CargoLoadPlanWorld) {
  const trailer = TrailerFactory.standardCurtainside();
  this.plan = new CargoLoadPlan('plan-1', trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('an empty load plan with trailer having max weight {int} kg', function (this: CargoLoadPlanWorld, maxWeight: number) {
  const trailer = trailerWithMaxWeight(maxWeight);
  this.plan = new CargoLoadPlan('plan-1', trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('an empty load plan with trailer having max LDM {float} m', function (this: CargoLoadPlanWorld, maxLdm: number) {
  const trailer = trailerWithMaxLdm(maxLdm);
  this.plan = new CargoLoadPlan('plan-1', trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('an empty load plan with trailer having height {int} mm', function (this: CargoLoadPlanWorld, heightMm: number) {
  const trailer = trailerWithHeight(heightMm);
  this.plan = new CargoLoadPlan('plan-1', trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('a load plan with standard curtainside trailer', function (this: CargoLoadPlanWorld) {
  const trailer = TrailerFactory.standardCurtainside();
  this.plan = new CargoLoadPlan('plan-1', trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('a load plan with refrigerated trailer', function (this: CargoLoadPlanWorld) {
  const trailer = TrailerFactory.refrigerated();
  this.plan = new CargoLoadPlan('plan-1', trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('a load plan with trailer having max weight {int} kg', function (this: CargoLoadPlanWorld, maxWeight: number) {
  const trailer = trailerWithMaxWeight(maxWeight);
  this.plan = new CargoLoadPlan('plan-1', trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('a load plan with trailer having max LDM {float} m', function (this: CargoLoadPlanWorld, maxLdm: number) {
  const trailer = trailerWithMaxLdm(maxLdm);
  this.plan = new CargoLoadPlan('plan-1', trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('the plan has a general cargo pallet unit with weight {int} kg', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  const unit = generalPallet('unit-1', weight);
  this.plan.addPalletUnit(unit, ldmProvider);
});

Given('the plan has a food pallet unit with weight {int} kg', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  const unit = foodPallet('unit-1', weight);
  this.plan.addPalletUnit(unit, ldmProvider);
});

Given('the plan is finalized', function (this: CargoLoadPlanWorld) {
  assert(this.plan);
  this.plan.finalize();
});

When('I try to finalize the plan', function (this: CargoLoadPlanWorld) {
  assert(this.plan);
  try {
    this.plan.finalize();
  } catch (e) {
    this.lastError = e as Error;
  }
});

When('I finalize the plan', function (this: CargoLoadPlanWorld) {
  assert(this.plan);
  this.plan.finalize();
});

When('I try to add a general cargo pallet unit with weight {int} kg', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  try {
    const unit = generalPallet('unit-1', weight);
    this.plan.addPalletUnit(unit, ldmProvider);
  } catch (e) {
    this.lastError = e as Error;
  }
});

When('I try to add another general cargo pallet unit with weight {int} kg', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  try {
    const unit = generalPallet('unit-2', weight);
    this.plan.addPalletUnit(unit, ldmProvider);
  } catch (e) {
    this.lastError = e as Error;
  }
});

When('I try to remove pallet unit with id {string}', function (this: CargoLoadPlanWorld, unitId: string) {
  assert(this.plan);
  try {
    this.plan.removePalletUnit(unitId, ldmProvider);
  } catch (e) {
    this.lastError = e as Error;
  }
});

When('I try to replace trailer with mega trailer', function (this: CargoLoadPlanWorld) {
  assert(this.plan);
  try {
    this.plan.replaceTrailer(TrailerFactory.megaTrailer(), ldmProvider);
  } catch (e) {
    this.lastError = e as Error;
  }
});

When('I try to add a dangerous goods pallet unit with weight {int} kg', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  try {
    const unit = dangerousGoodsPallet('unit-2', weight);
    this.plan.addPalletUnit(unit, ldmProvider);
  } catch (e) {
    this.lastError = e as Error;
  }
});

When('I try to add a chemical pallet unit with weight {int} kg', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  try {
    const unit = chemicalPallet('unit-2', weight);
    this.plan.addPalletUnit(unit, ldmProvider);
  } catch (e) {
    this.lastError = e as Error;
  }
});

When('I try to add a food pallet unit with weight {int} kg and temperature control required', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  try {
    const unit = foodPallet('unit-1', weight, { temperatureControlled: true });
    this.plan.addPalletUnit(unit, ldmProvider);
  } catch (e) {
    this.lastError = e as Error;
  }
});

When('I try to add a general cargo pallet unit with total height {int} mm and weight {int} kg', function (this: CargoLoadPlanWorld, totalHeightMm: number, weightKg: number) {
  assert(this.plan);
  try {
    const unit = palletWithHeight('unit-1', totalHeightMm, weightKg);
    this.plan.addPalletUnit(unit, ldmProvider);
  } catch (e) {
    this.lastError = e as Error;
  }
});

Then('the plan status should be {word}', function (this: CargoLoadPlanWorld, status: string) {
  assert(this.plan);
  assert.strictEqual(this.plan.status, status as CargoLoadPlanStatus);
});

Then('it should fail with {string}', function (this: CargoLoadPlanWorld, expectedSubstring: string) {
  assert(this.lastError, `Expected error containing "${expectedSubstring}" but no error was thrown`);
  assert(
    this.lastError!.message.includes(expectedSubstring),
    `Expected error message to contain "${expectedSubstring}" but got: ${this.lastError!.message}`
  );
});
