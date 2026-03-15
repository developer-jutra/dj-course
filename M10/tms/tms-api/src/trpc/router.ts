import { z } from 'zod';

import { router, publicProcedure } from './trpc';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../vehicles/vehicles.queries';

export const appRouter = router({
  getVehicles: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        offset: z.number().min(0),
      })
    )
    .query(async ({ input }) => {
      return await getVehicles({ limit: input.limit, offset: input.offset });
    }),

  getVehicleById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await getVehicleById(input);
    }),

  createVehicle: publicProcedure
    .input(
      z.object({
        make: z.string().optional(),
        model: z.string().optional(),
        year: z.number().optional(),
        fuel_tank_capacity: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await createVehicle(input);
    }),

  updateVehicle: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          make: z.string().optional(),
          model: z.string().optional(),
          year: z.number().optional(),
          fuel_tank_capacity: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      return await updateVehicle(input.id, input.data);
    }),

  deleteVehicle: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await deleteVehicle(input);
    }),
});

export type AppRouter = typeof appRouter;
