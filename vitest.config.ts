import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Bundled agent skills own their test runners and are not blog application tests.
    include: ['tests/**/*.test.ts'],
  },
});
