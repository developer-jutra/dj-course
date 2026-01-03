const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../src/environments/env.json');

function assertEnvVars(envVars) {
  const allVars = Object.keys(process.env);
  const missingEnvVars = envVars.filter((envVar) => !allVars.includes(envVar));
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing env variables: ${missingEnvVars.join(', ')}`);
  }
}

assertEnvVars(['NODE_ENV', 'API_URL']);

const envDict = {
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.API_URL,
  AUTH_URL: process.env.AUTH_URL,
};

fs.writeFileSync(envPath, JSON.stringify(envDict, null, 2));
console.log(`Dumped env variables to ${envPath}`);
