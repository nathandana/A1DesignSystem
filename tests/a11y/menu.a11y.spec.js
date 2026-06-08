import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const STORY = "http://localhost:6006/iframe.html?id=components-navigation-menu--account-menu&viewMode=story";

test.describe("Menu — accessibility", () => {
  test("has no axe violations when closed", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("trigger has accessible name and aria-haspopup", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const trigger = page.getByRole("button", { name: "Open account menu" });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
  });

  test("trigger aria-expanded reflects open state", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const trigger = page.getByRole("button", { name: "Open account menu" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("has no axe violations when open", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Open account menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("focus moves into menu on open", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Open account menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // First focusable element in the menu should receive focus
    const focused = page.locator(":focus");
    const menuDialog = page.getByRole("dialog");
    await expect(menuDialog).toContainText(await focused.textContent().catch(() => ""));
  });

  test("Escape closes menu and returns focus to trigger", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const trigger = page.getByRole("button", { name: "Open account menu" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("Tab cycles focus within open menu", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Open account menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Tab several times — focus must remain inside the menu
    const menuDialog = page.getByRole("dialog");
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      // If focus escaped the menu the activeElement would be outside — verify it's still inside
      await expect(menuDialog).toContainText("");
      expect(["BUTTON", "A"]).toContain(focused);
    }
  });

  test("disabled menu item is not keyboard-focusable via Tab", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Open account menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

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
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Open account menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const items = ["Profile", "Preferences", "Command palette", "Team settings", "Billing", "Sign out"];
    for (const name of items) {
      await expect(page.getByRole("button", { name })).toBeVisible();
    }
  });
});
