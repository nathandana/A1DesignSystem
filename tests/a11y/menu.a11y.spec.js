import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const STORY = "http://localhost:6006/iframe.html?id=components-navigation-menu--account-menu&viewMode=story";

async function closeMenu(page) {
  if (!(await page.locator("dialog[open]").isVisible().catch(() => false))) return;
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
}

async function resetMenu(page) {
  await page.goto(STORY);
  await page.waitForLoadState("networkidle");
  await closeMenu(page);
}

async function openMenu(page) {
  if (await page.locator("dialog[open]").isVisible().catch(() => false)) return;
  await page.getByRole("button", { name: "Open account menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

async function expectFocusInsideMenu(page) {
  const focusedInsideMenu = await page.evaluate(() => {
    const menu = document.querySelector("dialog[open]");
    return menu?.contains(document.activeElement) ?? false;
  });
  expect(focusedInsideMenu).toBe(true);
}

test.describe("Menu — accessibility", () => {
  test("has no axe violations when closed", async ({ page }) => {
    await resetMenu(page);

    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("trigger has accessible name and aria-haspopup", async ({ page }) => {
    await resetMenu(page);

    const trigger = page.getByRole("button", { name: "Open account menu" });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
  });

  test("trigger aria-expanded reflects open state", async ({ page }) => {
    await resetMenu(page);

    const trigger = page.getByRole("button", { name: "Open account menu" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("has no axe violations when open", async ({ page }) => {
    await resetMenu(page);

    await openMenu(page);

    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("focus moves into menu on open", async ({ page }) => {
    await resetMenu(page);

    await openMenu(page);

    await expectFocusInsideMenu(page);
  });

  test("Escape closes menu and returns focus to trigger", async ({ page }) => {
    await resetMenu(page);

    const trigger = page.getByRole("button", { name: "Open account menu" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("Tab cycles focus within open menu", async ({ page }) => {
    await resetMenu(page);

    await openMenu(page);

    // Tab several times — focus must remain inside the menu
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      await expectFocusInsideMenu(page);
      expect(["BUTTON", "A"]).toContain(focused);
    }
  });

  test("disabled menu item is not keyboard-focusable via Tab", async ({ page }) => {
    await resetMenu(page);

    await openMenu(page);

    // Collect all focusable button text inside the menu
    const focusableLabels = await page.evaluate(() => {
      const menu = document.querySelector('[role="dialog"]');
      if (!menu) return [];
      return [...menu.querySelectorAll("button:not([disabled]), a:not([aria-disabled='true'])")].map(
        (el) => el.textContent?.trim()
      );
    });

    expect(focusableLabels).not.toContain("Help center");
  });

  test("menu items have accessible names", async ({ page }) => {
    await resetMenu(page);

    await openMenu(page);

    const items = ["Profile", "Preferences", "Command palette", "Team settings", "Billing", "Sign out"];
    for (const name of items) {
      await expect(page.getByRole("button", { name })).toBeVisible();
    }
  });
});
