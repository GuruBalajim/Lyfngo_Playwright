// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 120000, // 2 minutes global test timeout
  expect: { timeout: 15000 },

  use: {
    headless: false,
    screenshot: 'only-on-failure',
    video: 'on',           // record video for all tests
    trace: 'retain-on-failure',
    actionTimeout: 60000,
  navigationTimeout: 60000
  },
workers: 1,
  reporter: [
    ['html', { outputFolder: 'html-report', open: 'never' }],
  ],

  testDir: './src/tests',
});
