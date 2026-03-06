// database.ts
import { Pool } from 'pg';
import logger from './logger';

// Parse DATABASE_URL to extract connection parameters
const parseConnectionString = (url: string) => {
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4], 10),
    database: match[5],
  };
};

const dbConfig = parseConnectionString(process.env.DATABASE_URL!);

const pool = new Pool(dbConfig);

// Function to get all vehicles (TMS schema)
const getVehicles = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM vehicles');
    return rows;
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching vehicles', { error: err.message });
    throw error;
  }
};

// Function to get vehicle by ID
const getVehicleById = async (id: string) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vehicles WHERE id = $1', [
      id,
    ]);
    return rows[0];
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching vehicle by id', { error: err.message });
    throw error;
  }
};

// Function to get transportation orders
const getTransportationOrders = async () => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM transportation_orders ORDER BY order_date DESC LIMIT 100'
    );
    return rows;
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching transportation orders', { error: err.message });
    throw error;
  }
};

// Function to get driver by ID
const getDriverById = async (id: string) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM drivers WHERE id = $1',
      [id]
    );
    return rows[0];
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching driver by id', { error: err.message });
    throw error;
  }
};

// Function to create a driver
const createDriver = async (data: {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  contract_type?: string;
  status?: string;
}) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO drivers (id, first_name, last_name, email, phone, contract_type, status)
       SELECT COALESCE(MAX(id), 0) + 1, $1, $2, $3, $4, $5, $6 FROM drivers
       RETURNING *`,
      [
        data.first_name ?? null,
        data.last_name ?? null,
        data.email ?? null,
        data.phone ?? null,
        data.contract_type ?? null,
        data.status ?? null,
      ]
    );
    return rows[0];
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error creating driver', { error: err.message });
    throw error;
  }
};

// Function to create a vehicle
const createVehicle = async (data: {
  make?: string;
  model?: string;
  year?: number;
  fuel_tank_capacity?: number;
}) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO vehicles (id, make, model, year, fuel_tank_capacity)
       SELECT COALESCE(MAX(id), 0) + 1, $1, $2, $3, $4 FROM vehicles
       RETURNING *`,
      [
        data.make ?? null,
        data.model ?? null,
        data.year ?? null,
        data.fuel_tank_capacity ?? null,
      ]
    );
    return rows[0];
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error creating vehicle', { error: err.message });
    throw error;
  }
};

// Function to update a vehicle
const updateVehicle = async (
  id: string,
  data: {
    make?: string;
    model?: string;
    year?: number;
    fuel_tank_capacity?: number;
  }
) => {
  try {
    const { rows } = await pool.query(
      `UPDATE vehicles SET
         make = COALESCE($2, make),
         model = COALESCE($3, model),
         year = COALESCE($4, year),
         fuel_tank_capacity = COALESCE($5, fuel_tank_capacity)
       WHERE id = $1
       RETURNING *`,
      [
        id,
        data.make ?? null,
        data.model ?? null,
        data.year ?? null,
        data.fuel_tank_capacity ?? null,
      ]
    );
    return rows[0];
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error updating vehicle', { error: err.message });
    throw error;
  }
};

// Function to delete a vehicle
const deleteVehicle = async (id: string) => {
  try {
    const result = await pool.query('DELETE FROM vehicles WHERE id = $1', [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error deleting vehicle', { error: err.message });
    throw error;
  }
};

export {
  pool,
  getVehicles,
  getVehicleById,
  getTransportationOrders,
  getDriverById,
  createDriver,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
