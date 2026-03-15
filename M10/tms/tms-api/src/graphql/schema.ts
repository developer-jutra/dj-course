import DataLoader from 'dataloader';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLResolveInfo, FieldNode } from 'graphql';
import { pool } from '../database';
import logger from '../logger';

const DRIVER_FIELD_TO_COLUMN: Record<string, string> = {
  id: 'id',
  firstName: 'first_name',
  lastName: 'last_name',
  email: 'email',
  phone: 'phone',
  contractType: 'contract_type',
  status: 'status',
};

function getDriverColumns(info: GraphQLResolveInfo): string {
  const fieldNode = info.fieldNodes[0];
  const selections = fieldNode.selectionSet?.selections ?? [];

  const columns = new Set<string>(['id']); // id zawsze potrzebne dla DataLoadera licenses

  for (const sel of selections) {
    if (sel.kind !== 'Field') continue;
    const gqlField = (sel as FieldNode).name.value;
    const col = DRIVER_FIELD_TO_COLUMN[gqlField];
    if (col) columns.add(col);
  }

  return [...columns].join(', ');
}

type MappedLicense = ReturnType<typeof mapLicense>;

const licensesLoader = new DataLoader<number, MappedLicense[]>(async (driverIds) => {
  const { rows } = await pool.query(
    `SELECT dl.*, dlt.id AS lt_id, dlt.code AS lt_code, dlt.name AS lt_name, dlt.description AS lt_description
     FROM driver_licenses dl
     JOIN driver_license_types dlt ON dlt.id = dl.license_type_id
     WHERE dl.driver_id = ANY($1)`,
    [driverIds as number[]]
  );
  return driverIds.map((id) => rows.filter((r) => r.driver_id === id).map(mapLicense));
});

const typeDefs = `#graphql
  type Driver {
    id: Int!
    firstName: String
    lastName: String
    email: String
    phone: String
    contractType: String
    status: String
    licenses: [DriverLicense!]!
  }

  type LicenseType {
    id: Int!
    code: String!
    name: String!
    description: String
  }

  type DriverLicense {
    id: Int!
    driverId: Int!
    licenseType: LicenseType!
    documentNumber: String
    issueDate: String
    expiryDate: String!
    status: String
  }

  type Query {
    getDriver(id: Int!): Driver
    listDrivers: [Driver!]!
  }

  type Mutation {
    addDriverLicense(driverId: Int!, licenseTypeId: Int!, expiryDate: String!): DriverLicense
  }
`;

const resolvers = {
  Query: {
    getDriver: async (_: unknown, { id }: { id: number }, _ctx: unknown, info: GraphQLResolveInfo) => {
      try {
        const columns = getDriverColumns(info);
        const { rows } = await pool.query(`SELECT ${columns} FROM drivers WHERE id = $1`, [id]);
        if (!rows[0]) return null;
        return mapDriver(rows[0]);
      } catch (err) {
        logger.error('GraphQL getDriver error', { error: (err as Error).message });
        throw err;
      }
    },
    listDrivers: async (_: unknown, _args: unknown, _ctx: unknown, info: GraphQLResolveInfo) => {
      try {
        const columns = getDriverColumns(info);
        const { rows } = await pool.query(`SELECT ${columns} FROM drivers LIMIT 100`);
        return rows.map(mapDriver);
      } catch (err) {
        logger.error('GraphQL listDrivers error', { error: (err as Error).message });
        throw err;
      }
    },
  },
  Driver: {
    licenses: async (parent: { id: number }) => {
      try {
        return await licensesLoader.load(parent.id);
      } catch (err) {
        logger.error('GraphQL Driver.licenses error', { error: (err as Error).message });
        throw err;
      }
    },
  },
  Mutation: {
    addDriverLicense: async (
      _: unknown,
      args: { driverId: number; licenseTypeId: number; expiryDate: string }
    ) => {
      try {
        const { rows } = await pool.query(
          `INSERT INTO driver_licenses (driver_id, license_type_id, expiry_date)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [args.driverId, args.licenseTypeId, args.expiryDate]
        );
        const license = rows[0];
        const { rows: ltRows } = await pool.query(
          'SELECT * FROM driver_license_types WHERE id = $1',
          [license.license_type_id]
        );
        return mapLicense({ ...license, lt_id: ltRows[0].id, lt_code: ltRows[0].code, lt_name: ltRows[0].name, lt_description: ltRows[0].description });
      } catch (err) {
        logger.error('GraphQL addDriverLicense error', { error: (err as Error).message });
        throw err;
      }
    },
  },
};

function toISODate(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  // Postgres may return a full date string like 'Fri Jan 07 2028 00:00:00 GMT...'
  const d = new Date(value);
  return isNaN(d.getTime()) ? String(value) : d.toISOString().split('T')[0];
}

function mapDriver(row: Record<string, unknown>) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    contractType: row.contract_type,
    status: row.status,
  };
}

function mapLicense(row: Record<string, unknown>) {
  return {
    id: row.id,
    driverId: row.driver_id,
    licenseType: {
      id: row.lt_id,
      code: row.lt_code,
      name: row.lt_name,
      description: row.lt_description,
    },
    documentNumber: row.document_number,
    issueDate: row.issue_date ? toISODate(row.issue_date as Date | string) : null,
    expiryDate: toISODate(row.expiry_date as Date | string),
    status: row.status,
  };
}

export const schema = makeExecutableSchema({ typeDefs, resolvers });
