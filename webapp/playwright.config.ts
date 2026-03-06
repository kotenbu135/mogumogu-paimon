import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000/mogumogu-paimon',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: '900px',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 900, height: 800 },
      },
    },
    {
      name: '1280px',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: '1920px',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/mogumogu-paimon',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
