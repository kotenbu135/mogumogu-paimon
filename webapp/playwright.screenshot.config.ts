import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testMatch: '**/screenshot.spec.ts',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'off',
  },
  projects: [
    {
      name: 'screenshot',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1600, height: 1600 },
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
