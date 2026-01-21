import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list'], ...(process.env.CI ? [['github'] as const] : [])],
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'npm start',
      cwd: './apps/backend',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npx serve ./apps/frontend/public -l 8080',
      port: 8080,
      reuseExistingServer: !process.env.CI,
    },
  ],
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testDir: './tests/api',
    },
  ],
});
