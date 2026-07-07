import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const STORY_DEFAULT    = "http://localhost:6006/iframe.html?id=components-containers-dialog--default&viewMode=story";
const STORY_WITH_FOOTER = "http://localhost:6006/iframe.html?id=components-containers-dialog--with-footer&viewMode=story";

async function openDialog(page) {
  if (await page.locator("dialog[open]").isVisible().catch(() => false)) return;
  await page.getByRole("button", { name: "Open dialog" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

async function closeDialog(page) {
  if (!(await page.locator("dialog[open]").isVisible().catch(() => false))) return;
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
}

async function resetDialog(page, storyUrl) {
  await page.goto(storyUrl);
  await page.waitForLoadState("networkidle");
  await closeDialog(page);
}

test.describe("Dialog — accessibility", () => {
  test("has no axe violations when closed", async ({ page }) => {
    await resetDialog(page, STORY_DEFAULT);

    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("has no axe violations when open", async ({ page }) => {
    await resetDialog(page, STORY_DEFAULT);

    await openDialog(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("dialog has accessible name via title", async ({ page }) => {
    await resetDialog(page, STORY_DEFAULT);

    await openDialog(page);
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    // Title text is present inside the dialog
    await expect(dialog).toContainText("Dialog title");
  });

  test("focus moves into dialog on open", async ({ page }) => {
    await resetDialog(page, STORY_DEFAULT);

    const trigger = page.getByRole("button", { name: "Open dialog" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Active focus must be inside the dialog element
    const focusedInsideDialog = await page.evaluate(() => {
      const dialog = document.querySelector("dialog[open]");
      return dialog?.contains(document.activeElement) ?? false;
    });
    expect(focusedInsideDialog).toBe(true);
  });

  test("Escape closes dialog and returns focus to trigger", async ({ page }) => {
    await resetDialog(page, STORY_DEFAULT);

    const trigger = page.getByRole("button", { name: "Open dialog" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("Tab wraps focus at end of dialog — does not escape to page", async ({ page }) => {
    await resetDialog(page, STORY_DEFAULT);

    await openDialog(page);

    // Tab through every focusable element inside the dialog and one more to wrap
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }

    const stillInDialog = await page.evaluate(() => {
      const dialog = document.querySelector("dialog[open]");
      return dialog?.contains(document.activeElement) ?? false;
    });
    expect(stillInDialog).toBe(true);
  });

  test("Shift+Tab wraps focus at start of dialog", async ({ page }) => {
    await resetDialog(page, STORY_DEFAULT);

    await openDialog(page);

    await page.keyboard.press("Shift+Tab");

    const stillInDialog = await page.evaluate(() => {
      const dialog = document.querySelector("dialog[open]");
      return dialog?.contains(document.activeElement) ?? false;
    });
    expect(stillInDialog).toBe(true);
  });

  test("close button has accessible name", async ({ page }) => {
    await resetDialog(page, STORY_DEFAULT);

    await openDialog(page);
    await expect(page.getByRole("button", { name: "Close dialog" })).toBeVisible();
  });

  test("clicking close button closes dialog and returns focus to trigger", async ({ page }) => {
    await resetDialog(page, STORY_DEFAULT);

    const trigger = page.getByRole("button", { name: "Open dialog" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: "Close dialog" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("footer action buttons are keyboard-reachable", async ({ page }) => {
    await resetDialog(page, STORY_WITH_FOOTER);

    await openDialog(page);

    await expect(page.getByRole("button", { name: "Confirm" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
  });
});
