import { pool } from '../database';
import logger from '../logger';

export const getDrivers = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM drivers LIMIT 100');
    return rows;
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching drivers', { error: err.message });
    throw error;
  }
};

export const getDriverById = async (id: string) => {
  try {
    const { rows } = await pool.query(
      `SELECT
        d.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id',              dl.id,
              'document_number', dl.document_number,
              'issue_date',      dl.issue_date,
              'expiry_date',     dl.expiry_date,
              'status',          dl.status,
              'code',            dlt.code,
              'name',            dlt.name,
              'description',     dlt.description
            )
          ) FILTER (WHERE dl.id IS NOT NULL),
          '[]'
        ) AS licenses
       FROM drivers d
       LEFT JOIN driver_licenses dl ON dl.driver_id = d.id
       LEFT JOIN driver_license_types dlt ON dlt.id = dl.license_type_id
       WHERE d.id = $1
       GROUP BY d.id`,
      [id]
    );
    return rows[0];
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching driver by id', { error: err.message });
    throw error;
  }
};

export const createDriver = async (data: {
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
