import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // auth.ts refuses to load without these, and db.ts reads DATABASE_URL at import.
    // Tests never open a database connection, so the URL only needs to be well-formed.
    env: {
      JWT_SECRET: 'test-secret-that-is-at-least-32-characters-long',
      AUTH_EMAIL: 'recruiter@example.com',
      AUTH_PASSWORD: 'correct-horse-battery-staple',
      DATABASE_URL: 'postgresql://test:test@127.0.0.1:5432/test',
    },
  },
});
