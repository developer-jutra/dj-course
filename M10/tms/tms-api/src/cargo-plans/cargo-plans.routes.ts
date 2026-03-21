import { Request, Response } from 'express';
import express from 'express';

import logger from '../logger';
import { InMemoryCargoLoadPlanRepository } from './cargo-load-plans/cargo-load-plan.repository';
import {
  CargoPlansService,
  LoadPlanNotFoundError,
  UnknownTrailerTypeError,
  UnknownPalletTypeError,
} from './cargo-plans-service';
import { TrailerFactory } from './trailers';
import { CargoPlans } from '../types/CargoPlansRoute';
import { ErrorResponse } from '../types/data-contracts';
import { parseCargoType } from './cargo/cargo.types';
import { toCargoLoadPlanReadModel } from './cargo-load-plans/cargo-load-plan.readmodel';
import { Weight, type WeightUnit } from '../shared/weight';

const router = express.Router();
const service = new CargoPlansService(new InMemoryCargoLoadPlanRepository());

const ALLOWED_WEIGHT_UNITS: WeightUnit[] = ['KG', 'TONNE', 'LB'];

function parseWeightUnit(raw: unknown): WeightUnit {
  if (typeof raw === 'string' && ALLOWED_WEIGHT_UNITS.includes(raw as WeightUnit)) {
    return raw as WeightUnit;
  }
  return 'KG';
}

// ── POST / — Create a new load plan ────────────────────────────────────────

router.post('/', async (
  req: Request<
    CargoPlans.CreateLoadPlan.RequestParams,
    CargoPlans.CreateLoadPlan.ResponseBody | ErrorResponse,
    CargoPlans.CreateLoadPlan.RequestBody,
    CargoPlans.CreateLoadPlan.RequestQuery
  >,
  res: Response<CargoPlans.CreateLoadPlan.ResponseBody | ErrorResponse>,
) => {
  const { trailerType } = req.body;
  if (!trailerType || typeof trailerType !== 'string') {
    return res
      .status(400)
      .json({ error: `trailerType is required. Allowed: ${TrailerFactory.allowedTypes().join(', ')}` });
  }

  const result = await service.createLoadPlan({ trailerType });
  if (!result.success) {
    return handleResultError(res, result.error, 'Failed to create load plan');
  }

  logger.info('Load plan created', { plan_id: result.value, trailer_type: trailerType });
  res.status(201).json({ id: result.value });
});

// ── GET /:id — Get load plan details ────────────────────────────────────────

router.get('/:id', async (
  req: Request<
    CargoPlans.GetLoadPlan.RequestParams,
    CargoPlans.GetLoadPlan.ResponseBody | ErrorResponse,
    CargoPlans.GetLoadPlan.RequestBody,
    CargoPlans.GetLoadPlan.RequestQuery
  >,
  res: Response<CargoPlans.GetLoadPlan.ResponseBody | ErrorResponse>,
) => {
  const weightUnit = parseWeightUnit(req.query.weightUnit);
  const result = await service.getLoadPlan(req.params.id);
  if (!result.success) {
    return handleResultError(res, result.error, 'Failed to fetch load plan');
  }
  res.json(toCargoLoadPlanReadModel(result.value, weightUnit));
});

// ── POST /:id/cargo — Add cargo to plan ─────────────────────────────────────

router.post('/:id/cargo', async (
  req: Request<
    CargoPlans.AddCargoToLoadPlan.RequestParams,
    CargoPlans.AddCargoToLoadPlan.ResponseBody | ErrorResponse,
    CargoPlans.AddCargoToLoadPlan.RequestBody,
    CargoPlans.AddCargoToLoadPlan.RequestQuery
  >,
  res: Response<CargoPlans.AddCargoToLoadPlan.ResponseBody | ErrorResponse>,
) => {
  const { palletType, cargoType: rawCargoType, requirements, weightKg, cargoHeightMm } = req.body;
  const cargoType = parseCargoType(rawCargoType);
  if (!cargoType) {
    return res.status(400).json({ error: `Unknown cargoType: ${rawCargoType}` });
  }
  const result = await service.addCargoToPlan({
    loadPlanId: req.params.id,
    palletType,
    cargoType,
    requirements,
    weight: Weight.from(weightKg, 'KG'),
    cargoHeightMm,
  });
  if (!result.success) {
    return handleResultError(res, result.error, 'Failed to add cargo to plan');
  }
  logger.info('Cargo added to plan', { plan_id: req.params.id, pallet_type: palletType });
  res.status(204).send();
});

// ── DELETE /:id/cargo/:unitId — Remove cargo from plan ──────────────────────

router.delete('/:id/cargo/:unitId', async (
  req: Request<
    CargoPlans.RemoveCargoFromLoadPlan.RequestParams,
    CargoPlans.RemoveCargoFromLoadPlan.ResponseBody | ErrorResponse,
    CargoPlans.RemoveCargoFromLoadPlan.RequestBody,
    CargoPlans.RemoveCargoFromLoadPlan.RequestQuery
  >,
  res: Response<CargoPlans.RemoveCargoFromLoadPlan.ResponseBody | ErrorResponse>,
) => {
  const result = await service.removeCargoFromPlan({
    loadPlanId: req.params.id,
    unitId: req.params.unitId,
  });
  if (!result.success) {
    return handleResultError(res, result.error, 'Failed to remove cargo from plan');
  }
  logger.info('Cargo removed from plan', { plan_id: req.params.id, unit_id: req.params.unitId });
  res.status(204).send();
});

// ── PUT /:id/trailer — Change trailer type ──────────────────────────────────

router.put('/:id/trailer', async (
  req: Request<
    CargoPlans.ChangeTrailerType.RequestParams,
    CargoPlans.ChangeTrailerType.ResponseBody | ErrorResponse,
    CargoPlans.ChangeTrailerType.RequestBody,
    CargoPlans.ChangeTrailerType.RequestQuery
  >,
  res: Response<CargoPlans.ChangeTrailerType.ResponseBody | ErrorResponse>,
) => {
  const { trailerType } = req.body;
  if (!trailerType || typeof trailerType !== 'string') {
    return res
      .status(400)
      .json({ error: `trailerType is required. Allowed: ${TrailerFactory.allowedTypes().join(', ')}` });
  }

  const result = await service.changeTrailerType({
    loadPlanId: req.params.id,
    trailerType,
  });
  if (!result.success) {
    return handleResultError(res, result.error, 'Failed to change trailer type');
  }
  logger.info('Trailer type changed', { plan_id: req.params.id, trailer_type: trailerType });
  res.status(204).send();
});

// ── POST /:id/finalize — Finalize the plan ──────────────────────────────────

router.post('/:id/finalize', async (
  req: Request<
    CargoPlans.FinalizeLoadPlan.RequestParams,
    CargoPlans.FinalizeLoadPlan.ResponseBody | ErrorResponse,
    CargoPlans.FinalizeLoadPlan.RequestBody,
    CargoPlans.FinalizeLoadPlan.RequestQuery
  >,
  res: Response<CargoPlans.FinalizeLoadPlan.ResponseBody | ErrorResponse>,
) => {
  const result = await service.finalizeLoadPlan(req.params.id);
  if (!result.success) {
    return handleResultError(res, result.error, 'Failed to finalize load plan');
  }
  logger.info('Load plan finalized', { plan_id: req.params.id });
  res.status(204).send();
});

// ── Error handling ──────────────────────────────────────────────────────────

function handleResultError(
  res: Response,
  err: unknown,
  context: string
): Response<ErrorResponse> {
  const error = err as Error;
  if (err instanceof LoadPlanNotFoundError) {
    logger.warn(context, { error: error.message });
    return res.status(404).json({ error: error.message });
  }
  if (err instanceof UnknownTrailerTypeError || err instanceof UnknownPalletTypeError) {
    logger.warn(context, { error: error.message });
    return res.status(400).json({ error: error.message });
  }
  logger.warn(context, { error: error.message });
  return res.status(400).json({ error: error.message });
}

export default router;
