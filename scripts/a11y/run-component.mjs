/**
 * Run axe checks for every Storybook story whose ID contains a component slug.
 *
 * Usage: node scripts/a11y/run-component.mjs <component-name>
 * Expects Storybook at STORYBOOK_URL or http://127.0.0.1:6006.
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const component = process.argv[2];
const baseUrl = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";

if (!component) {
  console.error("Usage: node scripts/a11y/run-component.mjs <component-name>");
  process.exit(1);
}

const slug = component.toLowerCase().replace(/\s+/g, "-");
const indexResponse = await fetch(`${baseUrl}/index.json`);
if (!indexResponse.ok) {
  console.error(`Unable to read Storybook index at ${baseUrl}. Is Storybook running?`);
  process.exit(1);
}

const index = await indexResponse.json();
const stories = Object.values(index.entries ?? {})
  .filter((entry) => entry.type === "story" && entry.id.includes(slug))
  .sort((a, b) => a.id.localeCompare(b.id));

if (stories.length === 0) {
  console.error(`No Storybook stories matched component: ${component}`);
  process.exit(1);
}

console.log(`\nRunning axe for ${stories.length} ${component} stor${stories.length === 1 ? "y" : "ies"}.\n`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
let violationCount = 0;

try {
  for (const story of stories) {
    const url = `${baseUrl}/iframe.html?id=${story.id}&viewMode=story`;
    await page.goto(url, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    if (results.violations.length === 0) {
      console.log(`✓ ${story.id}`);
      continue;
    }

    violationCount += results.violations.length;
    console.log(`⚠ ${story.id}`);
    for (const violation of results.violations) {
      console.log(`  [${violation.impact}] ${violation.id}: ${violation.description}`);
    }
  }
} finally {
  await browser.close();
}

if (violationCount > 0) {
  console.error(`\n${violationCount} accessibility violation${violationCount === 1 ? "" : "s"} detected for ${component}.`);
  console.error("Continuing without failing the process (warnings only).\n");
} else {
  console.log(`\nNo automated accessibility violations detected for ${component}.\n`);
}
