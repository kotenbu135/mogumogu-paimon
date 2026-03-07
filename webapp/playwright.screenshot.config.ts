import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testMatch: '**/e2e/screenshot.spec.ts',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'off',
  },
  projects: [
    {
      name: '1600px',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1600, height: 900 },
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/mogumogu-paimon',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
})
