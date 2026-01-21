import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:8080';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list'], ...(process.env.CI ? [['github'] as const] : [])],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.DOCKER_RUN
    ? undefined
    : [
        {
          command: 'npm start',
          cwd: './apps/backend',
          port: 3000,
          reuseExistingServer: true,
        },
        {
          command: 'npx serve ./apps/frontend/public -l 8080',
          port: 8080,
          reuseExistingServer: true,
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
