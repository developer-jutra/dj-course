import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { resolve } from 'path';

import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../vehicles/vehicles.queries.js';
import logger from '../logger.js';

const PROTO_PATH = resolve(__dirname, '../../proto/vehicle.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const vehicleProto: any = grpc.loadPackageDefinition(packageDefinition).vehicle;

const GRPC_PORT = '0.0.0.0:50051';

function mapVehicleToProto(vehicle: {
  id: number;
  make: string | null;
  model: string;
  year: number | null;
  fuel_tank_capacity: string | null;
}) {
  return {
    id: vehicle.id,
    make: vehicle.make ?? '',
    model: vehicle.model ?? '',
    year: vehicle.year ?? 0,
    fuel_tank_capacity: vehicle.fuel_tank_capacity
      ? parseFloat(vehicle.fuel_tank_capacity)
      : 0,
  };
}

const serviceHandlers = {
  getVehicles: async (call: any, callback: any) => {
    try {
      const { limit = 20, offset = 0 } = call.request;
      const result = await getVehicles({ limit, offset });
      callback(null, {
        rows: result.rows.map(mapVehicleToProto),
        total: result.total,
      });
    } catch (error: unknown) {
      const err = error as Error;
      logger.error('gRPC getVehicles error', { error: err.message });
      callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }
  },

  getVehicleById: async (call: any, callback: any) => {
    try {
      const { id } = call.request;
      const vehicle = await getVehicleById(id);
      if (!vehicle) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: `Vehicle with id ${id} not found`,
        });
      }
      callback(null, mapVehicleToProto(vehicle));
    } catch (error: unknown) {
      const err = error as Error;
      logger.error('gRPC getVehicleById error', { error: err.message });
      callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }
  },

  createVehicle: async (call: any, callback: any) => {
    try {
      const { make, model, year, fuel_tank_capacity } = call.request;
      const vehicle = await createVehicle({
        make: make || undefined,
        model: model || undefined,
        year: year || undefined,
        fuel_tank_capacity: fuel_tank_capacity || undefined,
      });
      callback(null, mapVehicleToProto(vehicle));
    } catch (error: unknown) {
      const err = error as Error;
      logger.error('gRPC createVehicle error', { error: err.message });
      callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }
  },

  updateVehicle: async (call: any, callback: any) => {
    try {
      const { id, make, model, year, fuel_tank_capacity } = call.request;
      const vehicle = await updateVehicle(id, {
        ...(make !== undefined && { make }),
        ...(model !== undefined && { model }),
        ...(year !== undefined && { year }),
        ...(fuel_tank_capacity !== undefined && { fuel_tank_capacity }),
      });
      if (!vehicle) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: `Vehicle with id ${id} not found`,
        });
      }
      callback(null, mapVehicleToProto(vehicle));
    } catch (error: unknown) {
      const err = error as Error;
      logger.error('gRPC updateVehicle error', { error: err.message });
      callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }
  },

  deleteVehicle: async (call: any, callback: any) => {
    try {
      const { id } = call.request;
      const success = await deleteVehicle(id);
      if (!success) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: `Vehicle with id ${id} not found`,
        });
      }
      callback(null, { success });
    } catch (error: unknown) {
      const err = error as Error;
      logger.error('gRPC deleteVehicle error', { error: err.message });
      callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }
  },
};

export function startGrpcServer(): void {
  const server = new grpc.Server();
  server.addService(vehicleProto.VehicleService.service, serviceHandlers);

  server.bindAsync(GRPC_PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      logger.error('Failed to start gRPC server', { error: err.message });
      return;
    }
    logger.info(`gRPC server running on port ${port}`);
  });
}

// Auto-start when run directly (e.g. task run-grpc-server)
const scriptPath = process.argv[1] ?? '';
if (scriptPath.endsWith('grpc/server.ts') || scriptPath.endsWith('grpc/server.js')) {
  startGrpcServer();
}
