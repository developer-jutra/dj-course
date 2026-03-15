"use strict";
// use only for local development (outside of Docker; see .env.local file)
// require('dotenv').config();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const express_2 = require("graphql-http/lib/use/express");
const database_1 = require("./database");
const env_1 = require("./env");
const logger_1 = __importDefault(require("./logger"));
const router_1 = __importDefault(require("./router"));
const router_2 = require("./trpc/router");
const server_js_1 = require("./grpc/server.js");
const schema_1 = require("./graphql/schema");
(0, env_1.assertEnvVars)('PORT', 'NODE_ENV', 'SERVICE_NAME', 'DATABASE_URL');
const port = process.env.PORT;
const app = (0, express_1.default)();
// Body parser MUST be first to parse request body
app.use(express_1.default.json());
// Swagger UI – dokumentacja OpenAPI pod /api-docs
const openApiPath = path_1.default.join(process.cwd(), 'contract', 'openapi.yaml');
const openApiSpec = js_yaml_1.default.load(fs_1.default.readFileSync(openApiPath, 'utf8'));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openApiSpec));
// Mount routers
app.use(router_1.default);
// Mount tRPC
app.use('/trpc', trpcExpress.createExpressMiddleware({
    router: router_2.appRouter,
    createContext: () => ({}),
}));
// Mount GraphQL endpoint
app.all('/graphql', (0, express_2.createHandler)({ schema: schema_1.schema }));
// Start gRPC server
(0, server_js_1.startGrpcServer)();
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
