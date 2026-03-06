"use strict";
// use only for local development (outside of Docker; see .env.local file)
// require('dotenv').config();
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
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const env_1 = require("./env");
const logger_1 = __importDefault(require("./logger"));
const router_1 = __importDefault(require("./router"));
(0, env_1.assertEnvVars)('PORT', 'NODE_ENV', 'SERVICE_NAME', 'DATABASE_URL');
const port = process.env.PORT;
const app = (0, express_1.default)();
// Body parser MUST be first to parse request body
app.use(express_1.default.json());
// Mount routers
app.use(router_1.default);
// Start the server
app.listen(port, () => {
    const formattedTime = new Date().toISOString();
    logger_1.default.info(`Server started on port ${port} at ${formattedTime}`, {
        port: Number(port),
        env: process.env.NODE_ENV,
        service: process.env.SERVICE_NAME,
        timestamp: formattedTime,
    });
});
// Graceful shutdown
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('Graceful shutdown initiated', { signal: 'SIGTERM' });
    try {
        yield database_1.pool.end();
        logger_1.default.info('Database connection pool closed successfully');
    }
    catch (err) {
        const error = err;
        logger_1.default.error('Failed to close database connection pool', {
            error: {
                message: error.message,
                stack: error.stack,
            },
        });
    }
    logger_1.default.info('HTTP server closed');
    process.exit(0);
}));
