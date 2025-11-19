/**
 * Application configuration and constants
 */

import path from 'path';
import os from 'os';
import fs from 'fs';

/**
 * Maximum context window size in tokens
 */
export const MAX_CONTEXT_TOKENS = 32768;

/**
 * Get the base directory for Azor data files
 */
export function getLogDir(): string {
  const homeDir = os.homedir();
  const logDir = path.join(homeDir, '.azor');

  // Create directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  return logDir;
}

/**
 * Get the output directory for exports
 */
export function getOutputDir(): string {
  const outputDir = path.join(getLogDir(), 'output');

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return outputDir;
}

/**
 * Get the path to the Write-Ahead Log file
 */
export function getWALFile(): string {
  return path.join(getLogDir(), 'azor-wal.json');
}

/**
 * Get the path to a session log file
 */
export function getSessionFilePath(sessionId: string): string {
  return path.join(getLogDir(), `${sessionId}-log.json`);
}
