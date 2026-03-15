import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { vehicles } from '../drizzle/schema.js';
import { paginationSchema } from '../shared/pagination.types.js';

export const vehicleDtoSchema = createSelectSchema(vehicles);

export const vehicleListResponseSchema = z.object({
  data: z.array(vehicleDtoSchema),
  pagination: paginationSchema,
});

export const vehicleCreateInputSchema = createInsertSchema(vehicles)
  .omit({ id: true })
  .extend({
    fuel_tank_capacity: z.number().positive().optional().nullable(),
  });

export const vehicleUpdateInputSchema = vehicleCreateInputSchema.partial();

export type VehicleDto = z.infer<typeof vehicleDtoSchema>;
export type VehicleListResponse = z.infer<typeof vehicleListResponseSchema>;
export type VehicleCreateInput = z.infer<typeof vehicleCreateInputSchema>;
export type VehicleUpdateInput = z.infer<typeof vehicleUpdateInputSchema>;
