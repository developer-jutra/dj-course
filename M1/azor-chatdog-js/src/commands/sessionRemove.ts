/**
 * Session remove command
 */

import { printSuccess, printError } from '../cli/console.js';
import type { SessionManager } from '../session/sessionManager.js';

/**
 * Remove current session and create a new one
 */
export function removeCurrentSession(manager: SessionManager): void {
  const result = manager.removeCurrentSessionAndCreateNew();

  if (result.success) {
    printSuccess(`Session ${result.removedId} removed. Created new session.`);
  } else {
    printError(`Error removing session: ${result.error}`);
    printSuccess('Created new session anyway.');
  }
}
