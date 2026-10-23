import { defineConfig, devices } from '@playwright/test';

// Cross-browser + phone checks. Run against a production build:
//   npm run build && npm run test:browsers
// Each project is a real engine: Chromium (Chrome/Edge/Android), WebKit (Safari, and every iPhone browser), Firefox.
const desktop = { viewport: { width: 1440, height: 900 } };

export default defineConfig({
  testDir: 'tests',
  timeout: 120_000,
  fullyParallel: true,
  workers: 4,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3100',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: 'npx next start -p 3100', url: 'http://localhost:3100', reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'], ...desktop, launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] } } },
    { name: 'desktop-safari', use: { ...devices['Desktop Safari'], ...desktop } },
    { name: 'desktop-firefox', use: { ...devices['Desktop Firefox'], ...desktop, launchOptions: { firefoxUserPrefs: { 'media.autoplay.default': 0 } } } },
    { name: 'iphone-15', use: { ...devices['iPhone 15'] } },
    { name: 'iphone-se', use: { ...devices['iPhone SE'] } },
    { name: 'android-pixel', use: { ...devices['Pixel 7'], launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] } } },
  ],
});
