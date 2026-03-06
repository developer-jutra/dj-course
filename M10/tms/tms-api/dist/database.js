"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.createDriver = exports.getDriverById = exports.getTransportationOrders = exports.getVehicleById = exports.getVehicles = exports.pool = void 0;
// database.ts
const pg_1 = require("pg");
const logger_1 = __importDefault(require("./logger"));
// Parse DATABASE_URL to extract connection parameters
const parseConnectionString = (url) => {
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
const dbConfig = parseConnectionString(process.env.DATABASE_URL);
const pool = new pg_1.Pool(dbConfig);
exports.pool = pool;
// Function to get all vehicles (TMS schema)
const getVehicles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pool.query('SELECT * FROM vehicles');
        return rows;
    }
    catch (error) {
        const err = error;
        logger_1.default.error('Error fetching vehicles', { error: err.message });
        throw error;
    }
});
exports.getVehicles = getVehicles;
// Function to get vehicle by ID
const getVehicleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pool.query('SELECT * FROM vehicles WHERE id = $1', [
            id,
        ]);
        return rows[0];
    }
    catch (error) {
        const err = error;
        logger_1.default.error('Error fetching vehicle by id', { error: err.message });
        throw error;
    }
});
exports.getVehicleById = getVehicleById;
// Function to get transportation orders
const getTransportationOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pool.query('SELECT * FROM transportation_orders ORDER BY order_date DESC LIMIT 100');
        return rows;
    }
    catch (error) {
        const err = error;
        logger_1.default.error('Error fetching transportation orders', { error: err.message });
        throw error;
    }
});
exports.getTransportationOrders = getTransportationOrders;
// Function to get driver by ID
const getDriverById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pool.query('SELECT * FROM drivers WHERE id = $1', [id]);
        return rows[0];
    }
    catch (error) {
        const err = error;
        logger_1.default.error('Error fetching driver by id', { error: err.message });
        throw error;
    }
});
exports.getDriverById = getDriverById;
// Function to create a driver
const createDriver = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { rows } = yield pool.query(`INSERT INTO drivers (id, first_name, last_name, email, phone, contract_type, status)
       SELECT COALESCE(MAX(id), 0) + 1, $1, $2, $3, $4, $5, $6 FROM drivers
       RETURNING *`, [
            (_a = data.first_name) !== null && _a !== void 0 ? _a : null,
            (_b = data.last_name) !== null && _b !== void 0 ? _b : null,
            (_c = data.email) !== null && _c !== void 0 ? _c : null,
            (_d = data.phone) !== null && _d !== void 0 ? _d : null,
            (_e = data.contract_type) !== null && _e !== void 0 ? _e : null,
            (_f = data.status) !== null && _f !== void 0 ? _f : null,
        ]);
        return rows[0];
    }
    catch (error) {
        const err = error;
        logger_1.default.error('Error creating driver', { error: err.message });
        throw error;
    }
});
exports.createDriver = createDriver;
// Function to create a vehicle
const createVehicle = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { rows } = yield pool.query(`INSERT INTO vehicles (id, make, model, year, fuel_tank_capacity)
       SELECT COALESCE(MAX(id), 0) + 1, $1, $2, $3, $4 FROM vehicles
       RETURNING *`, [
            (_a = data.make) !== null && _a !== void 0 ? _a : null,
            (_b = data.model) !== null && _b !== void 0 ? _b : null,
            (_c = data.year) !== null && _c !== void 0 ? _c : null,
            (_d = data.fuel_tank_capacity) !== null && _d !== void 0 ? _d : null,
        ]);
        return rows[0];
    }
    catch (error) {
        const err = error;
        logger_1.default.error('Error creating vehicle', { error: err.message });
        throw error;
    }
});
exports.createVehicle = createVehicle;
// Function to update a vehicle
const updateVehicle = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { rows } = yield pool.query(`UPDATE vehicles SET
         make = COALESCE($2, make),
         model = COALESCE($3, model),
         year = COALESCE($4, year),
         fuel_tank_capacity = COALESCE($5, fuel_tank_capacity)
       WHERE id = $1
       RETURNING *`, [
            id,
            (_a = data.make) !== null && _a !== void 0 ? _a : null,
            (_b = data.model) !== null && _b !== void 0 ? _b : null,
            (_c = data.year) !== null && _c !== void 0 ? _c : null,
            (_d = data.fuel_tank_capacity) !== null && _d !== void 0 ? _d : null,
        ]);
        return rows[0];
    }
    catch (error) {
        const err = error;
        logger_1.default.error('Error updating vehicle', { error: err.message });
        throw error;
    }
});
exports.updateVehicle = updateVehicle;
// Function to delete a vehicle
const deleteVehicle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield pool.query('DELETE FROM vehicles WHERE id = $1', [
            id,
        ]);
        return ((_a = result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
    }
    catch (error) {
        const err = error;
        logger_1.default.error('Error deleting vehicle', { error: err.message });
        throw error;
    }
});
exports.deleteVehicle = deleteVehicle;
