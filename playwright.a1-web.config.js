import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const baselineDirectory = fileURLToPath(new URL('./visual-baselines/a1-web', import.meta.url))

export default defineConfig({
  testDir: './tests/a1-web',
  timeout: 30 * 60 * 1000,
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.02,
      threshold: 0.1,
    },
  },
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  outputDir: 'test-results/a1-web',
  snapshotPathTemplate: `${baselineDirectory}/{arg}{ext}`,
  use: {
    baseURL: 'http://127.0.0.1:4177',
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    reducedMotion: 'reduce',
    actionTimeout: 15_000,
  },
  webServer: {
    command: 'npm run preview:a1-web',
    url: 'http://127.0.0.1:4177',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
