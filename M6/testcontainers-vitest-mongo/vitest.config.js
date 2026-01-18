import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Run tests sequentially to avoid MongoDB container conflicts
    sequence: {
      concurrent: false
    },
    // Increase timeout for container startup
    testTimeout: 60000
  }
});
