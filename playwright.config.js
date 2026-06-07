import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Fixed viewport so all baseline screenshots are consistent.
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  },
  projects: [
    {
      name: "a11y",
      testDir: "./tests/a11y",
      use: {
        baseURL: "http://localhost:6006",
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
