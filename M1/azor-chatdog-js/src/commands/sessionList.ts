/**
 * Session list command (matches Python version)
 */

import { listSessions } from '../files/sessionFiles.js';
import { printHelp } from '../cli/console.js';

/**
 * Display list of all sessions
 */
export function displaySessionList(): void {
  const sessions = listSessions();

  if (sessions.length === 0) {
    printHelp('\nBrak zapisanych sesji.');
    return;
  }

  printHelp('\n--- Dostępne zapisane sesje (ID) ---');
  for (const session of sessions) {
    printHelp(
      `- ID: ${session.session_id} (Wiadomości: ${session.message_count}, Ost. aktywność: ${session.last_modified.toLocaleString()})`
    );
  }
  printHelp('------------------------------------');
}
