import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['apps/**/*.test.ts', 'packages/**/*.test.ts'],
    environment: 'node',
    coverage: {
      reporter: ['text', 'json-summary'],
      include: ['packages/**/*.ts'],
      exclude: ['**/*.test.ts', '**/src/generated/**'],
    },
  },
});
