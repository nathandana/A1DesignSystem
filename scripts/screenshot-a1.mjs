import { chromium } from "@playwright/test";
import { join } from "path";

const OUT = "/Users/nathandana/Sites/A1DesignSystem/examples/portfolio/img/a1";
const PORTFOLIO = "http://127.0.0.1:5173/examples/portfolio";
const STORYBOOK = "http://127.0.0.1:6006";

const shots = [
  // Portfolio: home hero — shows the full design system in a real product
  {
    name: "portfolio-home",
    url: `${PORTFOLIO}/`,
    waitFor: ".a1-page-layout",
    viewport: { width: 1440, height: 900 },
    clip: null,
  },
  // Portfolio: A1 case study hero (the page we're adding images to)
  {
    name: "a1-case-study-hero",
    url: `${PORTFOLIO}/case-studies/a1`,
    waitFor: ".a1-page-layout",
    viewport: { width: 1440, height: 900 },
    clip: { x: 0, y: 0, width: 1440, height: 700 },
  },
  // Portfolio: About page — shows section/layout components, grid
  {
    name: "portfolio-about",
    url: `${PORTFOLIO}/about`,
    waitFor: ".a1-page-layout",
    viewport: { width: 1440, height: 900 },
    clip: null,
  },
  // Storybook: Button — all variants showing component documentation
  {
    name: "storybook-buttons",
    url: `${STORYBOOK}/iframe.html?id=components-inputs-button--all-variants&viewMode=story`,
    waitFor: ".a1-button",
    viewport: { width: 1200, height: 800 },
    clip: null,
    padding: 32,
  },
  // Storybook: Blockquote — all variants
  {
    name: "storybook-blockquote",
    url: `${STORYBOOK}/iframe.html?id=components-messaging-blockquote--all-variants&viewMode=story`,
    waitFor: ".a1-blockquote",
    viewport: { width: 900, height: 1600 },
    clip: null,
    padding: 32,
  },
  // Storybook: Section — shows layout + surface system
  {
    name: "storybook-section",
    url: `${STORYBOOK}/iframe.html?id=components-layout-section--surfaces&viewMode=story`,
    waitFor: ".a1-section",
    viewport: { width: 1200, height: 900 },
    clip: null,
    padding: 0,
  },
  // Storybook: Heading — type scale
  {
    name: "storybook-typography",
    url: `${STORYBOOK}/iframe.html?id=components-typography-heading--scale&viewMode=story`,
    waitFor: ".a1-heading",
    viewport: { width: 1000, height: 900 },
    clip: null,
    padding: 32,
  },
  // Portfolio: mobile view of home — responsive design
  {
    name: "portfolio-mobile",
    url: `${PORTFOLIO}/`,
    waitFor: ".a1-page-layout",
    viewport: { width: 390, height: 844 },
    clip: null,
  },
];

async function run() {
  const browser = await chromium.launch({ headless: true });

  for (const shot of shots) {
    const page = await browser.newPage();
    await page.setViewportSize(shot.viewport);
    console.log(`→ ${shot.name}: ${shot.url}`);

    try {
      await page.goto(shot.url, { waitUntil: "networkidle", timeout: 15000 });
      if (shot.waitFor) {
        await page.waitForSelector(shot.waitFor, { timeout: 8000 }).catch(() => {});
      }
      // Small settle pause for fonts/transitions
      await page.waitForTimeout(800);

      const outPath = join(OUT, `${shot.name}.png`);
      const opts = { path: outPath, ...(shot.clip ? { clip: shot.clip } : {}) };
      await page.screenshot(opts);
      console.log(`  ✓ saved ${shot.name}.png`);
    } catch (err) {
      console.error(`  ✗ ${shot.name}: ${err.message}`);
    }

    await page.close();
  }

  await browser.close();
  console.log("\nDone.");
}

run();
