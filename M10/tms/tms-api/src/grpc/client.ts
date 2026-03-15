import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { resolve } from 'path';
import { promisify } from 'util';

const PROTO_PATH = resolve(__dirname, '../../proto/vehicle.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const vehicleProto: any = grpc.loadPackageDefinition(packageDefinition).vehicle;

const client = new vehicleProto.VehicleService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

const getVehicles = promisify(client.getVehicles.bind(client));
const getVehicleById = promisify(client.getVehicleById.bind(client));
const createVehicle = promisify(client.createVehicle.bind(client));
const updateVehicle = promisify(client.updateVehicle.bind(client));
const deleteVehicle = promisify(client.deleteVehicle.bind(client));

async function main() {
  console.log('--- gRPC client test ---\n');

  // GetVehicles
  const list: any = await getVehicles({ limit: 5, offset: 0 });
  console.log(`GetVehicles – fetched ${list.rows.length} of ${list.total} total:`);
  list.rows.forEach((v: any) => {
    console.log(`  [${v.id}] ${v.make} ${v.model} (${v.year}) – tank: ${v.fuel_tank_capacity}L`);
  });

  // GetVehicleById
  const firstId = list.rows[0]?.id;
  if (firstId) {
    const vehicle: any = await getVehicleById({ id: String(firstId) });
    console.log(`\nGetVehicleById(${firstId}): ${vehicle.make} ${vehicle.model}`);
  }

  // CreateVehicle
  const created: any = await createVehicle({
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    fuel_tank_capacity: 0,
  });
  console.log(`\nCreateVehicle: [${created.id}] ${created.make} ${created.model}`);

  // UpdateVehicle
  const updated: any = await updateVehicle({
    id: String(created.id),
    model: 'Model 3 Performance',
    year: 2025,
  });
  console.log(`\nUpdateVehicle(${created.id}): ${updated.make} ${updated.model} (${updated.year})`);

  // DeleteVehicle
  const deleted: any = await deleteVehicle({ id: String(created.id) });
  console.log(`\nDeleteVehicle(${created.id}): success=${deleted.success}`);

  console.log('\n--- Done ---');
  client.close();
}

main().catch((err) => {
  console.error('gRPC client error:', err);
  client.close();
  process.exit(1);
});
