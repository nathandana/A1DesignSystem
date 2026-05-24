import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Fixed viewport so all baseline screenshots are consistent.
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  },
});
