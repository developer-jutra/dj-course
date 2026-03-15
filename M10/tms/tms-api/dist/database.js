"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.parseConnectionString = void 0;
// database.ts
const pg_1 = require("pg");
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
exports.parseConnectionString = parseConnectionString;
const dbConfig = (0, exports.parseConnectionString)(process.env.DATABASE_URL);
exports.pool = new pg_1.Pool(dbConfig);
