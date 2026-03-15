/**
 * Serves the bundled OpenAPI contract via Swagger UI on port 3030.
 * Runs bundle first to ensure contract/openapi.yaml is up to date.
 */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');

const ROOT = path.resolve(__dirname, '..');
const CONTRACT_ENTRY = path.join(ROOT, 'contract', 'entry.yaml');
const OPENAPI_PATH = path.join(ROOT, 'contract', 'openapi.yaml');
const PORT = 3030;

// 1. Bundle contract
console.log('Bundling contract...');
const bundle = spawnSync(
  'npx',
  ['@redocly/cli', 'bundle', CONTRACT_ENTRY, '-o', OPENAPI_PATH],
  { stdio: 'inherit', cwd: ROOT }
);
if (bundle.status !== 0) {
  console.error('Contract bundle failed');
  process.exit(1);
}

// 2. Load spec and serve
const openApiSpec = yaml.load(fs.readFileSync(OPENAPI_PATH, 'utf8'));

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Redirect root to docs
app.get('/', (_, res) => res.redirect('/api-docs'));

app.listen(PORT, () => {
  console.log(`\nSwagger UI: http://localhost:${PORT}/api-docs\n`);
});
