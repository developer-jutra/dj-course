import { count, eq, sql } from 'drizzle-orm';
import { db } from '../drizzle/drizzle.js';
import { vehicles, type NewVehicle } from '../drizzle/schema.js';
import logger from '../logger.js';

export const getVehicles = async (params: {
  limit: number;
  offset: number;
}) => {
  try {
    const [{ total }] = await db.select({ total: count() }).from(vehicles);

    const rows = await db
      .select({
        id: vehicles.id,
        make: vehicles.make,
        model: vehicles.model,
        year: vehicles.year,
        fuel_tank_capacity: vehicles.fuel_tank_capacity,
      })
      .from(vehicles)
      .orderBy(vehicles.id)
      .limit(params.limit)
      .offset(params.offset);

    return { rows, total };
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching vehicles', { error: err.message });
    throw error;
  }
};

export const getVehicleById = async (id: string) => {
  try {
    const result = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, parseInt(id)));
    return result[0];
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching vehicle by id', { error: err.message });
    throw error;
  }
};

export const createVehicle = async (data: {
  make?: string;
  model?: string;
  year?: number;
  fuel_tank_capacity?: number;
}) => {
  try {
    const [{ nextId }] = await db
      .select({ nextId: sql<number>`COALESCE(MAX(${vehicles.id}), 0) + 1` })
      .from(vehicles);

    const newVehicle: NewVehicle = {
      id: nextId,
      make: data.make ?? null,
      model: data.model ?? '',
      year: data.year ?? null,
      fuel_tank_capacity: data.fuel_tank_capacity?.toString() ?? null,
    };

    const [created] = await db.insert(vehicles).values(newVehicle).returning();
    return created;
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error creating vehicle', { error: err.message });
    throw error;
  }
};

export const updateVehicle = async (
  id: string,
  data: {
    make?: string;
    model?: string;
    year?: number;
    fuel_tank_capacity?: number;
  }
) => {
  try {
    const [updated] = await db
      .update(vehicles)
      .set({
        ...(data.make !== undefined && { make: data.make }),
        ...(data.model !== undefined && { model: data.model }),
        ...(data.year !== undefined && { year: data.year }),
        ...(data.fuel_tank_capacity !== undefined && {
          fuel_tank_capacity: data.fuel_tank_capacity.toString(),
        }),
      })
      .where(eq(vehicles.id, parseInt(id)))
      .returning();
    return updated;
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error updating vehicle', { error: err.message });
    throw error;
  }
};

export const deleteVehicle = async (id: string) => {
  try {
    const result = await db
      .delete(vehicles)
      .where(eq(vehicles.id, parseInt(id)));
    return (result.rowCount ?? 0) > 0;
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error deleting vehicle', { error: err.message });
    throw error;
  }
};
