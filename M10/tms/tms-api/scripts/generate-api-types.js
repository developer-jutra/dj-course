const path = require('path');
const { spawnSync } = require('child_process');
const { generateApi } = require('swagger-typescript-api');

const CONTRACT_ENTRY = path.resolve(__dirname, '../contract/entry.yaml');
const OPENAPI_PATH = path.resolve(__dirname, '../contract/openapi.yaml');
const OUTPUT_PATH = path.resolve(__dirname, '../contract/contract-types-swagger-typescript-api');

const generate = async () => {
  try {
    console.log('Bundling contract...');
    const bundle = spawnSync(
      'npx',
      ['@redocly/cli', 'bundle', CONTRACT_ENTRY, '-o', OPENAPI_PATH],
      { stdio: 'inherit', cwd: path.resolve(__dirname, '..') }
    );
    if (bundle.status !== 0) {
      throw new Error('Contract bundle failed');
    }

    await generateApi({
      name: 'api.ts',
      output: OUTPUT_PATH,
      input: OPENAPI_PATH,
      generateClient: false,
      generateRouteTypes: true,
      generateResponses: true,
      modular: true,
      generateUnionEnums: true,
      prettier: {
        printWidth: 80,
        tabWidth: 2,
        trailingComma: 'all',
        parser: 'typescript',
      },
    });

    console.log('API types generated successfully ->', OUTPUT_PATH);
  } catch (error) {
    console.error(
      'Failed to generate API types:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};

generate();
