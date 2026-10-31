import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "browser.spec.mjs",
  workers: 1,
  timeout: 180000,
  outputDir: "./test-results",
  reporter: "list",
  use: {
    actionTimeout: 12000,
    baseURL: "http://127.0.0.1:5192",
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node tests/browser-server.mjs",
    url: "http://127.0.0.1:5192",
    reuseExistingServer: false,
    timeout: 20000,
  },
});
