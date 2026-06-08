import { chromium } from "@playwright/test";
import { join } from "path";

const OUT = "/Users/nathandana/Sites/A1DesignSystem/examples/portfolio/img/a1";
const SB = "http://127.0.0.1:6006/iframe.html";

const shots = [
  {
    name: "storybook-buttons",
    url: `${SB}?id=components-controls-button--variants&viewMode=story`,
    waitFor: ".a1-button",
    viewport: { width: 1200, height: 700 },
  },
  {
    name: "storybook-section-surfaces",
    url: `${SB}?id=components-containers-section--surface-variants&viewMode=story`,
    waitFor: ".a1-section",
    viewport: { width: 1200, height: 900 },
  },
  {
    name: "storybook-section-stacked",
    url: `${SB}?id=components-containers-section--stacked-bands&viewMode=story`,
    waitFor: ".a1-section",
    viewport: { width: 1200, height: 1000 },
  },
  {
    name: "storybook-heading-display",
    url: `${SB}?id=components-typography-heading--display-scale&viewMode=story`,
    waitFor: ".a1-heading",
    viewport: { width: 1000, height: 800 },
  },
  {
    name: "storybook-grid",
    url: `${SB}?id=components-containers-grid--bento-grid&viewMode=story`,
    waitFor: ".a1-grid",
    viewport: { width: 1200, height: 900 },
  },
  {
    name: "storybook-stack",
    url: `${SB}?id=components-structure-stack--content-stack&viewMode=story`,
    waitFor: ".a1-stack",
    viewport: { width: 1000, height: 800 },
  },
];

async function run() {
  const browser = await chromium.launch({ headless: true });

  for (const shot of shots) {
    const page = await browser.newPage();
    await page.setViewportSize(shot.viewport);
    console.log(`→ ${shot.name}`);
    try {
      await page.goto(shot.url, { waitUntil: "networkidle", timeout: 12000 });
      if (shot.waitFor) await page.waitForSelector(shot.waitFor, { timeout: 6000 }).catch(() => {});
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(OUT, `${shot.name}.png`) });
      console.log(`  ✓ saved`);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log("\nDone.");
}

run();
