import path from 'node:path';

/**
 * Ensures that required environment variables are present.
 */
export function assertEnvVars(...vars: string[]) {
  const missing = vars.filter(name => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Gets the package.json file contents.
 */
export const getPkg = (): typeof import('../package.json') => {
  const rootDir = process.cwd();
  const packageJsonPath = path.join(rootDir, 'package.json');
  return require(packageJsonPath);
}
