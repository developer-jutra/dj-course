/**
 * Write-Ahead Log (WAL) for transaction audit trail
 */

import fs from 'fs';
import { getWALFile } from './config.js';
import type { WALEntry, Result } from '../types/index.js';

/**
 * Append an entry to the Write-Ahead Log
 */
export function appendToWAL(
  sessionId: string,
  prompt: string,
  responseText: string,
  totalTokens: number,
  modelName: string
): Result<boolean, string> {
  const walFile = getWALFile();

  const entry: WALEntry = {
    timestamp: new Date().toISOString(),
    session_id: sessionId,
    model: modelName,
    prompt,
    response: responseText,
    tokens_used: totalTokens,
  };

  try {
    // Read existing WAL if it exists
    let walData: WALEntry[] = [];
    if (fs.existsSync(walFile)) {
      try {
        const content = fs.readFileSync(walFile, 'utf-8');
        walData = JSON.parse(content);
      } catch {
        // If WAL is corrupted, start fresh
        walData = [];
      }
    }

    // Append new entry
    walData.push(entry);

    // Write back to file
    fs.writeFileSync(walFile, JSON.stringify(walData, null, 2), 'utf-8');

    return { success: true, value: true };
  } catch (error) {
    return {
      success: false,
      error: `Error writing to WAL: ${(error as Error).message}`,
    };
  }
}

/**
 * Read all WAL entries
 */
export function readWAL(): Result<WALEntry[], string> {
  const walFile = getWALFile();

  if (!fs.existsSync(walFile)) {
    return { success: true, value: [] };
  }

  try {
    const content = fs.readFileSync(walFile, 'utf-8');
    const data = JSON.parse(content);
    return { success: true, value: data };
  } catch (error) {
    return {
      success: false,
      error: `Error reading WAL: ${(error as Error).message}`,
    };
  }
}
