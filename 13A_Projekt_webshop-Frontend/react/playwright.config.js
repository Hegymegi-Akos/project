const { defineConfig } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: 'e2e',
  timeout: 120000,
  expect: { timeout: 5000 },
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://localhost:5173',
    headless: !!process.env.CI,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true
  },
  webServer: {
    command: 'npm run dev',
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_API_URL: process.env.VITE_API_URL || 'http://localhost/project/backend/api'
    }
  }
});