import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/a1-web',
  testMatch: 'json-preview.spec.js',
  outputDir: 'test-results/json-preview',
  workers: 1,
  timeout: 60_000,
  use: { baseURL: 'http://127.0.0.1:4181', viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' },
  webServer: { command: 'npx vite preview apps/a1-web --outDir preview-test-dist --host 127.0.0.1 --port 4181 --strictPort', url: 'http://127.0.0.1:4181', reuseExistingServer: false },
})
