import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const STORY_CONFIGURABLE = "http://localhost:6006/iframe.html?id=components-controls-accordion--configurable&viewMode=story";
const STORY_SIZES        = "http://localhost:6006/iframe.html?id=components-controls-accordion--sizes&viewMode=story";
const STORY_DISABLED     = "http://localhost:6006/iframe.html?id=components-controls-accordion--disabled&viewMode=story";

test.describe("Accordion — accessibility", () => {
  test("has no axe violations when closed", async ({ page }) => {
    await page.goto(STORY_CONFIGURABLE);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("trigger is a button with aria-expanded=false when closed", async ({ page }) => {
    await page.goto(STORY_CONFIGURABLE);
    await page.waitForLoadState("networkidle");

    const trigger = page.getByRole("button", { name: "Accordion item" });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("trigger aria-expanded becomes true after activation", async ({ page }) => {
    await page.goto(STORY_CONFIGURABLE);
    await page.waitForLoadState("networkidle");

    const trigger = page.getByRole("button", { name: "Accordion item" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("has no axe violations when open", async ({ page }) => {
    await page.goto(STORY_CONFIGURABLE);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Accordion item" }).click();

    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("panel is a region labelled by its trigger", async ({ page }) => {
    await page.goto(STORY_CONFIGURABLE);
    await page.waitForLoadState("networkidle");

    const trigger = page.getByRole("button", { name: "Accordion item" });
    const triggerId = await trigger.getAttribute("id");
    expect(triggerId).toBeTruthy();

    const panel = page.getByRole("region");
    await expect(panel).toHaveAttribute("aria-labelledby", triggerId);
  });

  test("trigger aria-controls points to its panel", async ({ page }) => {
    await page.goto(STORY_CONFIGURABLE);
    await page.waitForLoadState("networkidle");

    const trigger = page.getByRole("button", { name: "Accordion item" });
    const controlsId = await trigger.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();

    const panel = page.locator(`#${controlsId}`);
    await expect(panel).toHaveAttribute("role", "region");
  });

  test("Space and Enter toggle accordion via keyboard", async ({ page }) => {
    await page.goto(STORY_CONFIGURABLE);
    await page.waitForLoadState("networkidle");

    const trigger = page.getByRole("button", { name: "Accordion item" });
    await trigger.focus();

    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Space");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("disabled accordion trigger is not activatable", async ({ page }) => {
    await page.goto(STORY_DISABLED);
    await page.waitForLoadState("networkidle");

    // The disabled story renders an Accordion with disabled=true
    const disabledTrigger = page.locator(".a1-accordion--disabled .a1-accordion__trigger");
    await expect(disabledTrigger).toBeDisabled();
  });

  test("panel content is inert when closed", async ({ page }) => {
    await page.goto(STORY_CONFIGURABLE);
    await page.waitForLoadState("networkidle");

    const panel = page.getByRole("region");
    const inertAttr = await panel.getAttribute("inert");
    // Panel should have inert attribute when closed (set by the component)
    expect(inertAttr).not.toBeNull();
  });

  test("has no axe violations in sizes story", async ({ page }) => {
    await page.goto(STORY_SIZES);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
