import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const STORY = "http://localhost:6006/iframe.html?id=components-controls-tabs--line&viewMode=story";

test.describe("Tabs — accessibility", () => {
  test("has no axe violations", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("tabs use role=tab inside a role=tablist", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const tablist = page.getByRole("tablist");
    await expect(tablist).toBeVisible();

    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(4);
  });

  test("selected tab has aria-selected=true", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const overviewTab = page.getByRole("tab", { name: "Overview" });
    await expect(overviewTab).toHaveAttribute("aria-selected", "true");
  });

  test("non-selected tabs have aria-selected=false", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const activityTab = page.getByRole("tab", { name: "Activity" });
    await expect(activityTab).toHaveAttribute("aria-selected", "false");
  });

  test("tab controls its panel via aria-controls", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const overviewTab = page.getByRole("tab", { name: "Overview" });
    const controlsId = await overviewTab.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();

    const panel = page.locator(`#${controlsId}`);
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("role", "tabpanel");
  });

  test("ArrowRight moves focus to next tab and activates it", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const overviewTab = page.getByRole("tab", { name: "Overview" });
    await overviewTab.focus();
    await page.keyboard.press("ArrowRight");

    const activityTab = page.getByRole("tab", { name: "Activity" });
    await expect(activityTab).toBeFocused();
    await expect(activityTab).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Activity");
  });

  test("ArrowLeft moves focus to previous tab", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const activityTab = page.getByRole("tab", { name: "Activity" });
    await activityTab.focus();
    await page.keyboard.press("ArrowLeft");

    await expect(page.getByRole("tab", { name: "Overview" })).toBeFocused();
  });

  test("ArrowRight wraps from last tab to first", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const membersTab = page.getByRole("tab", { name: "Members" });
    await membersTab.focus();
    await page.keyboard.press("ArrowRight");

    await expect(page.getByRole("tab", { name: "Overview" })).toBeFocused();
  });

  test("Home key moves focus to first tab", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const settingsTab = page.getByRole("tab", { name: "Settings" });
    await settingsTab.focus();
    await page.keyboard.press("Home");

    await expect(page.getByRole("tab", { name: "Overview" })).toBeFocused();
  });

  test("End key moves focus to last tab", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const overviewTab = page.getByRole("tab", { name: "Overview" });
    await overviewTab.focus();
    await page.keyboard.press("End");

    await expect(page.getByRole("tab", { name: "Members" })).toBeFocused();
  });

  test("active tab panel is labelled by its tab", async ({ page }) => {
    await page.goto(STORY);
    await page.waitForLoadState("networkidle");

    const overviewTab = page.getByRole("tab", { name: "Overview" });
    const tabId = await overviewTab.getAttribute("id");
    const panel = page.getByRole("tabpanel");
    await expect(panel).toHaveAttribute("aria-labelledby", tabId);
  });
});
