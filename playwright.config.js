import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  timeout: 60000,
  workers: 2,
  reporter: 'list',
  projects: [
    {
      name: 'learning',
      testIgnore: [
        '**/auth.spec.js',
        '**/google-auth.spec.js',
        '**/firestore.spec.js',
        '**/teacher.spec.js',
      ],
    },
    {
      name: 'firebase-auth',
      testMatch: [
        '**/auth.spec.js',
        '**/google-auth.spec.js',
        '**/firestore.spec.js',
        '**/teacher.spec.js',
      ],
      use: { baseURL: 'http://127.0.0.1:5175' },
    },
  ],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    viewport: { width: 1440, height: 1050 },
    channel: process.platform === 'win32' ? 'msedge' : undefined,
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev -- --port 5173 --strictPort',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'node scripts/auth-stack.mjs',
      env: { AUTH_APP_PORT: '5175' },
      url: 'http://127.0.0.1:5175',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
