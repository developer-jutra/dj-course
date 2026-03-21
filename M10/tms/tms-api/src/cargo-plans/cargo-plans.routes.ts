import { Request, Response } from 'express';
import express from 'express';

import logger from '../logger';
import { service } from './fake-dependency-injection';
import { LoadPlanNotFoundError, type CargoPlanServiceError } from './cargo-plans-service';
import { OptimisticLockError } from '../shared/optimistic-lock-error';
import { TrailerFactory } from './trailers';
import { PalletSpec } from './pallets/pallet-spec';
import { CargoPlans } from '../types/CargoPlansRoute';
import { ErrorResponse } from '../types/data-contracts';
import { parseCargoType } from './cargo/cargo.types';
import { Weight } from '../shared/weight';

const router = express.Router();

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
  if (!trailerType || !TrailerFactory.allowedTypes().includes(trailerType)) {
    return res
      .status(400)
      .json({ error: `Unknown trailerType: '${trailerType}'. Allowed: ${TrailerFactory.allowedTypes().join(', ')}` });
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
  const weightUnit = Weight.parseUnit(req.query.weightUnit);
  const readModel = await service.findPlan(req.params.id, weightUnit);
  if (!readModel) {
    logger.warn('Failed to fetch load plan', { plan_id: req.params.id });
    return res.status(404).json({ error: `Load plan '${req.params.id}' not found` });
  }
  res.json(readModel);
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
  const { palletType, cargoType: rawCargoType, weightKg, cargoHeightMm } = req.body;
  if (!palletType || !PalletSpec.allowedTypes().includes(palletType)) {
    return res
      .status(400)
      .json({ error: `Unknown palletType: '${palletType}'. Allowed: ${PalletSpec.allowedTypes().join(', ')}` });
  }
  const cargoType = parseCargoType(rawCargoType);
  if (!cargoType) {
    return res.status(400).json({ error: `Unknown cargoType: ${rawCargoType}` });
  }
  const result = await service.addCargoToPlan({
    loadPlanId: req.params.id,
    palletType,
    cargoType,
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
  if (!trailerType || !TrailerFactory.allowedTypes().includes(trailerType)) {
    return res
      .status(400)
      .json({ error: `Unknown trailerType: '${trailerType}'. Allowed: ${TrailerFactory.allowedTypes().join(', ')}` });
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
  err: CargoPlanServiceError,
  context: string
): Response<ErrorResponse> {
  if (err instanceof OptimisticLockError) {
    logger.warn(context, { error: err.message });
    return res.status(409).json({ error: err.message });
  }
  switch (err.kind) {
    case 'LoadPlanNotFoundError':
      logger.warn(context, { error: err.message });
      return res.status(404).json({ error: err.message });
    case 'PlanAlreadyFinalizedError':
      logger.warn(context, { error: err.message });
      return res.status(409).json({ error: err.message });
    case 'EmptyPlanError':
      logger.warn(context, { error: err.message });
      return res.status(422).json({ error: err.message });
    case 'WeightCapacityExceededError':
      logger.warn(context, { error: err.message });
      return res.status(422).json({ error: err.message });
    case 'LdmCapacityExceededError':
      logger.warn(context, { error: err.message });
      return res.status(422).json({ error: err.message });
    case 'CargoTooTallForTrailerError':
      logger.warn(context, { error: err.message });
      return res.status(422).json({ error: err.message });
    case 'TrailerCapabilityMismatchError':
      logger.warn(context, { error: err.message });
      return res.status(422).json({ error: err.message });
    case 'IncompatibleCargoColoadingError':
      logger.warn(context, { error: err.message });
      return res.status(409).json({ error: err.message });
    case 'CargoUnitNotFoundError':
      logger.warn(context, { error: err.message });
      return res.status(404).json({ error: err.message });
    case 'PalletWeightExceedsCapacityError':
      logger.warn(context, { error: err.message });
      return res.status(422).json({ error: err.message });
    case 'PalletCargoTypeNotAllowedError':
      logger.warn(context, { error: err.message });
      return res.status(422).json({ error: err.message });
  }
}

export default router;
