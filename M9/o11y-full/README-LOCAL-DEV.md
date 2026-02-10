# Local Development Setup

This setup allows you to run the `products-api` application locally on your host machine while keeping all infrastructure services (Postgres, OpenTelemetry Collector, Prometheus, Grafana, Loki, Tempo) running in Docker containers.

## Benefits

- **Faster iteration**: No need to rebuild Docker images for code changes
- **Better debugging**: Direct access to Node.js debugger and logs
- **Hot reload**: Use nodemon or similar tools for automatic restarts

## Quick Start

### 1. Start Infrastructure Services

Start all infrastructure services (everything except products-api):

```bash
docker compose -f docker-compose-infra.yml up -d
```

Check that all services are running:

```bash
docker compose -f docker-compose-infra.yml ps
```

### 2. Install Dependencies (if not done already)

```bash
cd products-api
npm install
```

### 3. Run the Application

The `.env` file is already configured with localhost endpoints:

```bash
cd products-api
node index.js
```

Or use nodemon for auto-reload:

```bash
npm install -g nodemon  # if not already installed
nodemon index.js
```

## Environment Variables

The `products-api/.env` file contains all required environment variables configured for localhost access:

- `DATABASE_URL`: PostgreSQL at localhost:5432
- `LOKI_HOST`: Loki at localhost:3100
- `OTEL_EXPORTER_OTLP_ENDPOINT`: OpenTelemetry Collector at localhost:4317
- `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`: Traces endpoint at localhost:4318
- `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT`: Metrics endpoint at localhost:4318

## Accessing Services

Once everything is running, you can access:

- **Products API**: http://localhost:3000
  - Health: http://localhost:3000/health
  - Products: http://localhost:3000/products
  
- **Grafana**: http://localhost:4000 (admin/secret)
- **Prometheus**: http://localhost:9090
- **OpenTelemetry Collector**: localhost:4317 (gRPC), localhost:4318 (HTTP)
- **Loki**: http://localhost:3100
- **Tempo**: http://localhost:3200
- **PostgreSQL**: localhost:5432 (admin/secret)

## Stopping Services

Stop the infrastructure:

```bash
docker compose -f docker-compose-infra.yml down
```

Stop the products-api: Press `Ctrl+C` in the terminal where it's running

## Troubleshooting

### Port conflicts

If you get port conflicts, check what's using the ports:

```bash
lsof -i :3000  # products-api
lsof -i :5432  # postgres
lsof -i :4317  # otel-collector gRPC
```

### Clean restart

If you need to completely reset:

```bash
# Stop everything
docker compose -f docker-compose-infra.yml down -v

# Clean Node modules
cd products-api
rm -rf node_modules package-lock.json
npm install

# Restart infrastructure
cd ..
docker compose -f docker-compose-infra.yml up -d
```

### Check logs

Infrastructure logs:
```bash
docker compose -f docker-compose-infra.yml logs -f [service-name]
```

Application logs: Check the terminal where node is running

## Development Workflow

1. Make code changes in `products-api/`
2. If using nodemon, changes will auto-reload
3. If running with `node`, restart manually with `Ctrl+C` and `node index.js`
4. Test your changes at http://localhost:3000
5. View traces in Grafana/Tempo, metrics in Prometheus, logs in Loki

## Switching Back to Full Docker Setup

To run everything in Docker (including products-api):

```bash
# Stop infrastructure-only
docker compose -f docker-compose-infra.yml down

# Start full setup
docker compose up -d
```
