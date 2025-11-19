/**
 * Session file persistence utilities
 */

import fs from 'fs';
import path from 'path';
import { getLogDir, getSessionFilePath } from './config.js';
import type {
  SessionHistoryFile,
  TimestampedMessage,
  Message,
  SessionMetadata,
  Result,
} from '../types/index.js';

/**
 * Convert universal Message format to TimestampedMessage for storage
 */
function messageToTimestamped(msg: Message): TimestampedMessage {
  return {
    role: msg.role,
    timestamp: new Date().toISOString(),
    text: msg.parts[0]?.text || '',
  };
}

/**
 * Convert TimestampedMessage to universal Message format
 */
function timestampedToMessage(msg: TimestampedMessage): Message {
  return {
    role: msg.role,
    parts: [{ text: msg.text }],
  };
}

/**
 * Load session history from file
 */
export function loadSessionHistory(
  sessionId: string
): Result<Message[], string> {
  const filePath = getSessionFilePath(sessionId);

  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      error: `Session file not found: ${sessionId}`,
    };
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data: SessionHistoryFile = JSON.parse(fileContent);

    // Convert timestamped messages to universal format
    const history = data.history.map(timestampedToMessage);

    return { success: true, value: history };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: `Invalid JSON in session file: ${sessionId}`,
      };
    }
    return {
      success: false,
      error: `Error loading session: ${(error as Error).message}`,
    };
  }
}

/**
 * Save session history to file
 * Only saves if history has at least 2 messages (one complete exchange)
 */
export function saveSessionHistory(
  sessionId: string,
  history: Message[],
  systemPrompt: string,
  modelName: string
): Result<boolean, string> {
  // Don't save if history is too short
  if (history.length < 2) {
    return { success: true, value: false };
  }

  const filePath = getSessionFilePath(sessionId);

  // Convert messages to timestamped format
  const timestampedHistory = history.map(messageToTimestamped);

  const data: SessionHistoryFile = {
    session_id: sessionId,
    model: modelName,
    system_role: systemPrompt,
    history: timestampedHistory,
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true, value: true };
  } catch (error) {
    return {
      success: false,
      error: `Error saving session: ${(error as Error).message}`,
    };
  }
}

/**
 * List all available sessions
 */
export function listSessions(): SessionMetadata[] {
  const logDir = getLogDir();
  const sessions: SessionMetadata[] = [];

  try {
    const files = fs.readdirSync(logDir);

    for (const file of files) {
      if (file.endsWith('-log.json')) {
        const filePath = path.join(logDir, file);
        const stats = fs.statSync(filePath);

        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const data: SessionHistoryFile = JSON.parse(content);

          sessions.push({
            session_id: data.session_id,
            model: data.model,
            message_count: data.history.length,
            last_modified: stats.mtime,
            first_message: data.history[0]?.text,
          });
        } catch {
          // Skip invalid files
          continue;
        }
      }
    }

    // Sort by last modified, newest first
    sessions.sort((a, b) => b.last_modified.getTime() - a.last_modified.getTime());

    return sessions;
  } catch (error) {
    console.error('Error listing sessions:', error);
    return [];
  }
}

/**
 * Remove a session file
 */
export function removeSessionFile(sessionId: string): Result<boolean, string> {
  const filePath = getSessionFilePath(sessionId);

  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      error: `Session file not found: ${sessionId}`,
    };
  }

  try {
    fs.unlinkSync(filePath);
    return { success: true, value: true };
  } catch (error) {
    return {
      success: false,
      error: `Error removing session: ${(error as Error).message}`,
    };
  }
}

/**
 * Check if a session file exists
 */
export function sessionExists(sessionId: string): boolean {
  const filePath = getSessionFilePath(sessionId);
  return fs.existsSync(filePath);
}
