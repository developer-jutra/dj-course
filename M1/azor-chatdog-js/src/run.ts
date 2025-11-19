#!/usr/bin/env node

/**
 * Azor ChatDog - Entry point
 */

import { initChat, mainLoop } from './chat.js';

/**
 * Main entry point
 */
async function main(): Promise<void> {
  try {
    initChat();
    await mainLoop();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the application
main();
