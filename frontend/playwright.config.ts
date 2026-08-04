import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    headless: true,
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: process.env.E2E_HOST_ALIAS ? [`--host-resolver-rules=MAP ${process.env.E2E_HOST_ALIAS} 127.0.0.1`] : [],
    },
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev',
      cwd: '../backend',
      url: 'http://127.0.0.1:3333/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1',
      cwd: '.',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
