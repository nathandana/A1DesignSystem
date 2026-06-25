#!/usr/bin/env node
import { chromium } from "@playwright/test";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const contractFile = join(root, "tests/color/color-contract.json");
const update = process.argv.includes("--update");
const baseUrl = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";

const stories = [
  "a-1-light",
  "a-1-dark",
  "accessible-light",
  "accessible-dark",
  "aperture-light",
  "aperture-dark",
  "cat-lympics-light",
  "cat-lympics-dark",
  "crochet-light",
  "crochet-dark",
  "fresh-light",
  "fresh-dark",
  "heritage-light",
  "heritage-dark",
  "marshmallow-light",
  "marshmallow-dark",
];

const variables = [
  "--semantic-color-surface-page",
  "--semantic-color-surface-card",
  "--semantic-color-surface-field",
  "--semantic-color-surface-panel",
  "--semantic-color-surface-raised",
  "--semantic-color-surface-inverse",
  "--semantic-color-text-default",
  "--semantic-color-text-muted",
  "--semantic-color-text-inverse",
  "--semantic-color-text-accent",
  "--semantic-color-border-subtle",
  "--semantic-color-border-default",
  "--semantic-color-border-strong",
  "--semantic-color-action-background",
  "--semantic-color-action-background-hover",
  "--semantic-color-action-background-pressed",
  "--semantic-color-action-foreground",
  "--semantic-color-action-surface",
  "--semantic-color-status-info-background",
  "--semantic-color-status-info-surface",
  "--semantic-color-status-error-background",
  "--semantic-color-status-error-surface",
  "--semantic-color-status-warn-background",
  "--semantic-color-status-warn-surface",
  "--semantic-color-status-success-background",
  "--semantic-color-status-success-surface",
  "--component-button-primary-background",
  "--component-button-primary-foreground",
  "--component-button-secondary-background",
  "--component-button-secondary-foreground",
  "--component-field-focus-ring-color",
  "--a1-field-hover-background",
  "--a1-field-active-background",
  "--a1-field-read-only-background",
];

async function readScope(page, selector) {
  return page.locator(selector).evaluate((element, names) => {
    const style = getComputedStyle(element);
    return {
      colorScope: element.getAttribute("data-a1-color-scope"),
      variables: Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()])),
      computed: {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        color: style.color,
        outlineColor: style.outlineColor,
      },
    };
  }, variables);
}

async function readInverseDialog(page) {
  return page.locator('[data-color-contract="inverse"]').evaluate((inverse, names) => {
    const dialog = document.createElement("dialog");
    dialog.setAttribute("data-a1-color-scope", "inverse");
    inverse.append(dialog);
    dialog.showModal();
    const style = getComputedStyle(dialog);
    const result = {
      colorScope: dialog.getAttribute("data-a1-color-scope"),
      variables: Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()])),
      computed: {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        color: style.color,
        outlineColor: style.outlineColor,
      },
    };
    dialog.close();
    dialog.remove();
    return result;
  }, variables);
}

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    colorScheme: "light",
  });
  const result = {};

  try {
    for (const story of stories) {
      const url = `${baseUrl}/iframe.html?id=foundations-color-regression--${story}&viewMode=story`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.locator('[data-color-contract="root"]').waitFor();

      result[story] = {
        htmlClass: await page.locator("html").getAttribute("class") ?? "",
        root: await readScope(page, '[data-color-contract="root"]'),
        inverse: await readScope(page, '[data-color-contract="inverse"]'),
        nestedInverse: await readScope(page, '[data-color-contract="nested-inverse"]'),
        inverseDialog: await readInverseDialog(page),
        primaryButton: await readScope(page, '[data-color-contract="primary-button"]'),
        field: await readScope(page, ".a1-field"),
      };
    }
  } finally {
    await browser.close();
  }

  return {
    viewport: { width: 1280, height: 720, deviceScaleFactor: 1 },
    stories: result,
  };
}

const current = await capture();
const serialized = `${JSON.stringify(current, null, 2)}\n`;

if (update || !existsSync(contractFile)) {
  mkdirSync(dirname(contractFile), { recursive: true });
  writeFileSync(contractFile, serialized);
  console.log(`Updated ${contractFile.slice(root.length + 1)}`);
} else {
  const expected = readFileSync(contractFile, "utf8");
  if (serialized !== expected) {
    const currentFile = contractFile.replace(/\.json$/, ".current.json");
    writeFileSync(currentFile, serialized);
    console.error(`Color contract changed. Compare ${currentFile.slice(root.length + 1)} with ${contractFile.slice(root.length + 1)}.`);
    process.exit(1);
  }
  console.log(`Color contract matches ${contractFile.slice(root.length + 1)}`);
}
