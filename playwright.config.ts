import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

/**
 * One config, three layers:
 *  - api            -> pure HTTP tests, no browser
 *  - desktop-chrome -> UI tests at 1440px
 *  - mobile-chrome  -> same UI specs on a Pixel 7 viewport (touch, mobile UA)
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: env.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: env.workableApiUrl },
    },
    {
      name: 'desktop-chrome',
      testIgnore: /api\//,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-chrome',
      testIgnore: /api\//,
      grep: /@mobile/,
      use: { ...devices['Pixel 7'] },
    },
  ],
});
