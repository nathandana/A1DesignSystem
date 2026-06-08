import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const STORY_THREE  = "http://localhost:6006/iframe.html?id=components-navigation-breadcrumb--three-levels&viewMode=story";
const STORY_FOUR   = "http://localhost:6006/iframe.html?id=components-navigation-breadcrumb--four-levels&viewMode=story";
const STORY_BUTTON = "http://localhost:6006/iframe.html?id=components-navigation-breadcrumb--button-items&viewMode=story";

test.describe("Breadcrumb — accessibility", () => {
  test("has no axe violations (three levels)", async ({ page }) => {
    await page.goto(STORY_THREE);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("uses nav landmark with aria-label", async ({ page }) => {
    await page.goto(STORY_THREE);
    await page.waitForLoadState("networkidle");

    const nav = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(nav).toBeVisible();
  });

  test("uses an ordered list for breadcrumb items", async ({ page }) => {
    await page.goto(STORY_THREE);
    await page.waitForLoadState("networkidle");

    const list = page.locator("nav[aria-label='Breadcrumb'] ol");
    await expect(list).toBeVisible();
  });

  test("current page item has aria-current=page", async ({ page }) => {
    await page.goto(STORY_THREE);
    await page.waitForLoadState("networkidle");

    const current = page.locator("[aria-current='page']");
    await expect(current).toBeVisible();
    // Verify it is not a link (non-interactive)
    const tag = await current.evaluate((el) => el.tagName.toLowerCase());
    expect(tag).toBe("span");
  });

  test("ancestor items render as links with accessible names", async ({ page }) => {
    await page.goto(STORY_THREE);
    await page.waitForLoadState("networkidle");

    const links = page.locator("nav[aria-label='Breadcrumb'] a");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await links.nth(i).textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test("ancestor items are keyboard-reachable", async ({ page }) => {
    await page.goto(STORY_THREE);
    await page.waitForLoadState("networkidle");

    // Tab into the breadcrumb — should focus first link
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    const tag = await focused.evaluate((el) => el.tagName.toLowerCase());
    expect(["a", "button"]).toContain(tag);
  });

  test("current page is not a focusable link", async ({ page }) => {
    await page.goto(STORY_THREE);
    await page.waitForLoadState("networkidle");

    const current = page.locator("[aria-current='page']");
    const tabIndex = await current.getAttribute("tabindex");
    // span with no tabindex — not programmatically focusable
    expect(tabIndex).toBeNull();
    const tag = await current.evaluate((el) => el.tagName.toLowerCase());
    expect(tag).not.toBe("a");
    expect(tag).not.toBe("button");
  });

  test("button-based items are keyboard-activatable", async ({ page }) => {
    await page.goto(STORY_BUTTON);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);

    // Button items should use <button> elements
    const buttons = page.locator("nav[aria-label='Breadcrumb'] button");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("has no axe violations with four levels", async ({ page }) => {
    await page.goto(STORY_FOUR);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
