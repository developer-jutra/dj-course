import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';

import { CargoLoadPlan, type AddCargoData } from './cargo-load-plan';
import { LdmCalculator } from '../ldm/ldm-calculator';
import { TrailerFactory } from '../trailers';
import { CargoType } from '../cargo/cargo.types';
import { CargoLoadPlanStatus } from './cargo-load-plan.types';
import type { PalletUnit } from '../pallets/pallet-unit';
import type { PalletLoadableTrailerSpec } from '../trailers';
import { Weight } from '../../shared/weight';
import { UUID } from '../../shared/uuid';

const ldmProvider = (u: PalletUnit[], t: PalletLoadableTrailerSpec) => LdmCalculator.calculate(u, t);

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

interface CargoLoadPlanWorld {
  plan?: CargoLoadPlan;
  lastError?: { message: string };
}

Given('an empty load plan with standard curtainside trailer', function (this: CargoLoadPlanWorld) {
  const trailer = TrailerFactory.standardCurtainside();
  this.plan = new CargoLoadPlan(UUID.from<'CargoLoadPlan'>('plan-1'), trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('an empty load plan with trailer having max weight {int} kg', function (this: CargoLoadPlanWorld, maxWeight: number) {
  const trailer = trailerWithMaxWeight(maxWeight);
  this.plan = new CargoLoadPlan(UUID.from<'CargoLoadPlan'>('plan-1'), trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('an empty load plan with trailer having max LDM {float} m', function (this: CargoLoadPlanWorld, maxLdm: number) {
  const trailer = trailerWithMaxLdm(maxLdm);
  this.plan = new CargoLoadPlan(UUID.from<'CargoLoadPlan'>('plan-1'), trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('an empty load plan with trailer having height {int} mm', function (this: CargoLoadPlanWorld, heightMm: number) {
  const trailer = trailerWithHeight(heightMm);
  this.plan = new CargoLoadPlan(UUID.from<'CargoLoadPlan'>('plan-1'), trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('a load plan with standard curtainside trailer', function (this: CargoLoadPlanWorld) {
  const trailer = TrailerFactory.standardCurtainside();
  this.plan = new CargoLoadPlan(UUID.from<'CargoLoadPlan'>('plan-1'), trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('a load plan with refrigerated trailer', function (this: CargoLoadPlanWorld) {
  const trailer = TrailerFactory.refrigerated();
  this.plan = new CargoLoadPlan(UUID.from<'CargoLoadPlan'>('plan-1'), trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('a load plan with trailer having max weight {int} kg', function (this: CargoLoadPlanWorld, maxWeight: number) {
  const trailer = trailerWithMaxWeight(maxWeight);
  this.plan = new CargoLoadPlan(UUID.from<'CargoLoadPlan'>('plan-1'), trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('a load plan with trailer having max LDM {float} m', function (this: CargoLoadPlanWorld, maxLdm: number) {
  const trailer = trailerWithMaxLdm(maxLdm);
  this.plan = new CargoLoadPlan(UUID.from<'CargoLoadPlan'>('plan-1'), trailer, 0, [], CargoLoadPlanStatus.DRAFT);
});

Given('the plan has a general cargo pallet unit with weight {int} kg', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  const data: AddCargoData = { palletType: 'epal1', cargoType: CargoType.GENERAL, weight: Weight.from(weight, 'KG'), cargoHeightMm: 100 };
  this.plan.addCargoToPlan(data, ldmProvider);
});

Given('the plan has a food pallet unit with weight {int} kg', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  const data: AddCargoData = { palletType: 'h1', cargoType: CargoType.FOOD, weight: Weight.from(weight, 'KG'), cargoHeightMm: 100 };
  this.plan.addCargoToPlan(data, ldmProvider);
});

Given('the plan is finalized', function (this: CargoLoadPlanWorld) {
  assert(this.plan);
  this.plan.finalize();
});

When('I try to finalize the plan', function (this: CargoLoadPlanWorld) {
  assert(this.plan);
  const result = this.plan.finalize();
  if (!result.success) this.lastError = result.error;
});

When('I finalize the plan', function (this: CargoLoadPlanWorld) {
  assert(this.plan);
  this.plan.finalize();
});

When('I try to add a general cargo pallet unit with weight {int} kg', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  const data: AddCargoData = { palletType: 'epal1', cargoType: CargoType.GENERAL, weight: Weight.from(weight, 'KG'), cargoHeightMm: 100 };
  const result = this.plan.addCargoToPlan(data, ldmProvider);
  if (!result.success) this.lastError = result.error;
});

When('I try to add another general cargo pallet unit with weight {int} kg', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  const data: AddCargoData = { palletType: 'epal1', cargoType: CargoType.GENERAL, weight: Weight.from(weight, 'KG'), cargoHeightMm: 100 };
  const result = this.plan.addCargoToPlan(data, ldmProvider);
  if (!result.success) this.lastError = result.error;
});

When('I try to remove pallet unit with id {string}', function (this: CargoLoadPlanWorld, unitId: string) {
  assert(this.plan);
  const result = this.plan.removeCargoFromPlan(unitId, ldmProvider);
  if (!result.success) this.lastError = result.error;
});

When('I try to replace trailer with mega trailer', function (this: CargoLoadPlanWorld) {
  assert(this.plan);
  const result = this.plan.replaceTrailer(TrailerFactory.megaTrailer(), ldmProvider);
  if (!result.success) this.lastError = result.error;
});

When('I try to add a dangerous goods pallet unit with weight {int} kg', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  const data: AddCargoData = { palletType: 'cp1', cargoType: CargoType.DANGEROUS_GOODS, weight: Weight.from(weight, 'KG'), cargoHeightMm: 100 };
  const result = this.plan.addCargoToPlan(data, ldmProvider);
  if (!result.success) this.lastError = result.error;
});

When('I try to add a chemical pallet unit with weight {int} kg', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  const data: AddCargoData = { palletType: 'cp1', cargoType: CargoType.CHEMICAL, weight: Weight.from(weight, 'KG'), cargoHeightMm: 100 };
  const result = this.plan.addCargoToPlan(data, ldmProvider);
  if (!result.success) this.lastError = result.error;
});

When('I try to add a food pallet unit with weight {int} kg and temperature control required', function (this: CargoLoadPlanWorld, weight: number) {
  assert(this.plan);
  const data: AddCargoData = { palletType: 'h1', cargoType: CargoType.FOOD, weight: Weight.from(weight, 'KG'), cargoHeightMm: 100 };
  const result = this.plan.addCargoToPlan(data, ldmProvider);
  if (!result.success) this.lastError = result.error;
});

When('I try to add a general cargo pallet unit with total height {int} mm and weight {int} kg', function (this: CargoLoadPlanWorld, totalHeightMm: number, weightKg: number) {
  assert(this.plan);
  const epal1BaseHeightMm = 144;
  const data: AddCargoData = { palletType: 'epal1', cargoType: CargoType.GENERAL, weight: Weight.from(weightKg, 'KG'), cargoHeightMm: totalHeightMm - epal1BaseHeightMm };
  const result = this.plan.addCargoToPlan(data, ldmProvider);
  if (!result.success) this.lastError = result.error;
});

Then('the plan status should be FINALIZED', function (this: CargoLoadPlanWorld) {
  assert(this.plan);
  assert.strictEqual(this.plan.isFinalized(), true);
});

Then('the plan status should be DRAFT', function (this: CargoLoadPlanWorld) {
  assert(this.plan);
  assert.strictEqual(this.plan.isFinalized(), false);
});

Then('it should fail with {string}', function (this: CargoLoadPlanWorld, expectedSubstring: string) {
  assert(this.lastError, `Expected error containing "${expectedSubstring}" but no error was thrown`);
  assert(
    this.lastError!.message.includes(expectedSubstring),
    `Expected error message to contain "${expectedSubstring}" but got: ${this.lastError!.message}`
  );
});
