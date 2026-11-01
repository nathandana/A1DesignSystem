import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PDFDocument } from "pdf-lib";

test("working hub: import, review, dependency editing, reports, drafts, search, access and responsive accessibility", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByLabel("Your name").fill("Browser test owner");
  await page.getByLabel("Email").fill("browser@example.test");
  await page.getByLabel("Password").fill("test-only-password-12345");
  await page
    .getByRole("button", { name: "Create private workspace access" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Work, with a clear thread." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Activity", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Recent activity" }),
  ).toHaveCount(0);
  await page.goto("/#activity");
  await expect(page).toHaveURL(/#overview$/);
  await page
    .getByRole("button", { name: "Import documentation", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByLabel("Source content")
    .fill(
      '[{"id":"browser-rule","title":"Checkbox browser test","original":"Provide a clear label.","tags":["Components:Checkbox","Topics:Accessibility","Platforms/contexts:Mobile"]}]',
    );
  await page
    .getByRole("button", { name: "Preview import", exact: true })
    .click();
  await expect(
    page.getByText("1 rows validated.", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Import 1 rows", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.goto("/#guidelines");
  await page.getByRole("button", { name: "Components", exact: true }).click();
  await page.getByRole("button", { name: "Checkbox", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Topics", exact: true }).click();
  await page
    .getByRole("button", { name: "Accessibility", exact: true })
    .click();
  await page.keyboard.press("Escape");
  const guidelineLink = page.getByRole("link", {
    name: "Checkbox browser test",
    exact: true,
  });
  await guidelineLink.click();
  const guidelineDialog = page.getByRole("dialog", {
    name: "Checkbox browser test",
  });
  await expect(guidelineDialog).toBeVisible();
  await expect(
    page.locator('.a1-side-nav-item[href="#guidelines"]'),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    guidelineDialog.getByText("Provide a clear label."),
  ).toBeVisible();
  await expect(guidelineDialog.locator(".a1-dialog__footer button")).toHaveText(
    ["Approve", "Reject", "Discuss", "Cancel"],
  );
  await guidelineDialog
    .getByLabel("Owner", { exact: true })
    .fill("Discard this owner");
  await guidelineDialog
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await expect(guidelineDialog).not.toBeVisible();
  await expect(guidelineLink).toBeFocused();
  await guidelineLink.click();
  await expect(
    guidelineDialog.getByLabel("Owner", { exact: true }),
  ).toHaveValue("");
  await guidelineDialog
    .getByLabel("Owner", { exact: true })
    .fill("Metadata search fixture");
  await guidelineDialog
    .getByLabel("Topics", { exact: true })
    .fill("Accessibility, Content");
  await guidelineDialog
    .getByRole("button", { name: "Approve", exact: true })
    .click();
  await expect(guidelineDialog).not.toBeVisible();
  await expect(
    page
      .locator(".a1-snackbar")
      .getByText("Guideline approved.", { exact: true }),
  ).toBeVisible();
  await guidelineLink.click();
  await expect(
    guidelineDialog.getByLabel("Owner", { exact: true }),
  ).toHaveValue("Metadata search fixture");
  await expect(
    guidelineDialog.getByLabel("Topics", { exact: true }),
  ).toHaveValue("Accessibility, Content");
  await guidelineDialog
    .getByRole("button", { name: "Discuss", exact: true })
    .click();
  await expect(guidelineDialog).not.toBeVisible();
  await guidelineLink.click();
  await guidelineDialog
    .getByRole("button", { name: "Reject", exact: true })
    .click();
  await expect(guidelineDialog).not.toBeVisible();
  const feedback = page.locator(".a1-snackbar");
  await expect(feedback).toContainText("Guideline rejected.");
  await expect(feedback).toHaveAttribute("role", "status");
  await feedback.getByRole("button", { name: "Dismiss", exact: true }).click();
  await expect(feedback).not.toBeVisible();
  const workspace = await (await page.request.get("/api/workspace")).json();
  const guideline = workspace.records.find(
    (r) => r.title === "Checkbox browser test",
  );
  expect(guideline.status).toBe("Rejected");
  expect(guideline.decisions.map((d) => d.status)).toEqual([
    "Approved",
    "Needs further discussion",
    "Rejected",
  ]);
  const guidelineUrl = `/?collection=sce#record/${guideline.id}`;
  await page.goto("/#search");
  await page
    .getByLabel("Search all content in this collection")
    .fill("Metadata search fixture");
  await page.getByRole("link", { name: "Checkbox browser test" }).click();
  await expect(
    page.getByRole("dialog", { name: "Checkbox browser test" }),
  ).toBeVisible();
  await expect(
    page.locator('.a1-side-nav-item[href="#guidelines"]'),
  ).toHaveAttribute("aria-current", "page");
  await page
    .getByRole("dialog")
    .getByRole("navigation", { name: "Breadcrumb" })
    .getByRole("link", { name: "Guidelines", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page).toHaveURL(/#guidelines$/);
  await expect(
    page.locator('.a1-side-nav-item[href="#guidelines"]'),
  ).toHaveAttribute("aria-current", "page");
  await page
    .getByRole("navigation", { name: "Breadcrumb" })
    .getByRole("link", { name: "Overview", exact: true })
    .click();
  await expect(page).toHaveURL(/#overview$/);
  await expect(
    page.locator('.a1-side-nav-item[href="#overview"]'),
  ).toHaveAttribute("aria-current", "page");
  await page.goto("/#audit");
  await page.getByRole("button", { name: "Add report", exact: true }).click();
  await page.getByLabel("Title").fill("Browser test audit");
  await page
    .getByLabel("Summary")
    .fill("Test report summary; no SCE findings.");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Executive summary" }),
  ).toBeVisible();
  await page.getByText("Source PDF and versions", { exact: true }).click();
  const pdf = await PDFDocument.create();
  pdf.addPage().drawText("Test PDF source.");
  await page
    .getByLabel("Upload a PDF revision", { exact: false })
    .setInputFiles({
      name: "test-audit.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from(await pdf.save()),
    });
  await expect(page.getByRole("link", { name: "Download PDF" })).toBeVisible();
  await page.getByRole("button", { name: "Preview PDF" }).click();
  await expect(page.getByTitle("Protected report PDF preview")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Releases", exact: true }),
  ).toHaveCount(0);
  await page.goto("/#weekly");
  await page
    .getByRole("button", { name: "Draft this week", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Generate draft", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: /Week of/ })).toBeVisible();
  await page.getByLabel("Collection").selectOption("demo");
  await expect(
    page.getByRole("heading", { name: "Work, with a clear thread." }),
  ).toBeVisible();
  await page.goto("/?collection=demo#map");
  await page.getByLabel("Inspect a node").selectOption("demo-tokens");
  await page.getByLabel("Horizontal position").fill("200");
  await page.getByRole("button", { name: "Save layout", exact: true }).click();
  await expect(page.getByText("Layout saved.", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByLabel("Inspect a node").selectOption("demo-tokens");
  await expect(page.getByLabel("Horizontal position")).toHaveValue("200");
  await page
    .getByRole("button", { name: "Highlight related dependencies" })
    .click();
  await page.getByLabel("Presentation").selectOption("Accessible list");
  await expect(
    page.getByRole("button", { name: "Core tokens", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add node", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Add node", exact: true }),
  ).toBeFocused();
  await page.goto("/?collection=demo#ask");
  await expect(
    page.getByText("Fictional demonstration · not generated live"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Source: example checkbox guideline/ }),
  ).toBeVisible();
  await page.goto("/?collection=demo#settings");
  await page.getByRole("link", { name: "Preview visitor access" }).click();
  await expect(
    page.getByRole("heading", {
      name: "No records cleared for public sharing",
    }),
  ).toBeVisible();
  for (const route of [
    guidelineUrl,
    "/?collection=sce#audit",
    "/?collection=sce#weekly",
    "/?collection=sce#search",
    "/?collection=sce#settings",
    "/?collection=demo#map",
  ]) {
    await page.goto(route);
    await expect(page.locator("#page-title")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          failure: n.failureSummary,
        })),
      })),
    ).toEqual([]);
  }
  // Responsive overflow and automated accessibility checks in the primary workflows.
  for (const width of [375, 640, 900, 1200, 1600]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/?collection=demo#overview");
    await expect(
      page.getByRole("heading", { name: "Work, with a clear thread." }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 375) {
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await page.getByRole("link", { name: "Guidelines", exact: true }).click();
      await expect(
        page.getByRole("heading", { name: "Guidelines", exact: true }),
      ).toBeVisible();
      await page.goto("/?collection=demo#overview");
    }
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          failure: n.failureSummary,
        })),
      })),
    ).toEqual([]);
    if (width === 375 || width === 1600)
      await page.screenshot({
        path: testInfo.outputPath(`overview-${width}.png`),
        fullPage: true,
      });
  }
  for (const theme of ["accessible", "heritage", "dark"]) {
    await page.goto("/?collection=demo#settings");
    await page.getByLabel("Appearance").selectOption(theme);
    await page.goto("/?collection=demo#guidelines");
    await page.evaluate(async () => {
      await Promise.all(
        document
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      );
    });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          failure: n.failureSummary,
        })),
      })),
    ).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("Markdown renders semantic content without executing imported markup", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const session = await (await page.request.get("/api/session")).json();
  const login = await page.request.post(
    session.setupRequired ? "/api/setup" : "/api/login",
    {
      headers: { Origin: "http://127.0.0.1:5192" },
      data: {
        email: "browser@example.test",
        name: "Browser test owner",
        password: "test-only-password-12345",
      },
    },
  );
  expect(login.ok()).toBeTruthy();
  const original = [
    "# Markdown source",
    "",
    "A **bold statement**, *emphasis*, ~~old wording~~ and `inline code`.",
    "",
    "[Jump to details](#details)",
    "",
    "- Parent item",
    "  - Nested item",
    "",
    "3. Third step",
    "4. Fourth step",
    "",
    "- [x] Completed",
    "- [ ] Pending",
    "",
    "> Quoted guidance",
    "",
    "## Details",
    "",
    "| Token | Value |",
    "| --- | --- |",
    "| `spacing` | **Small** |",
    "",
    "```html",
    '<button type="button">Example</button>',
    "```",
    "",
    "[Documentation](https://example.com/docs)",
    "",
    '<img src=x onerror="window.markdownExecuted=true">',
    "",
    "[Unsafe link](javascript:alert%281%29)",
    "",
    "![Remote image](https://example.test/tracking.png)",
  ].join("\n");
  const response = await page.request.post("/api/records", {
    headers: { Origin: "http://127.0.0.1:5192" },
    data: {
      kind: "source",
      dataset: "sce",
      title: "Markdown verification",
      original,
    },
  });
  expect(response.ok()).toBeTruthy();
  const record = await response.json();
  await page.goto(`/#record/${record.id}`);
  const content = page.locator(".a1-sce-markdown").filter({
    has: page.getByRole("heading", { name: "Markdown source", exact: true }),
  });
  await expect(
    content.getByRole("heading", { name: "Markdown source", level: 3 }),
  ).toBeVisible();
  await expect(content.locator("strong").first()).toHaveText("bold statement");
  await expect(content.locator("em")).toHaveText("emphasis");
  await expect(content.locator("ul ul li")).toHaveCount(1);
  await expect(content.locator("ol")).toHaveAttribute("start", "3");
  await expect(
    content.getByRole("checkbox", { name: "Completed task" }),
  ).toBeChecked();
  await expect(
    content.getByRole("columnheader", { name: "Token" }),
  ).toBeVisible();
  await expect(content.getByRole("cell", { name: "Small" })).toBeVisible();
  await expect(content.locator("pre")).toContainText(
    '<button type="button">Example</button>',
  );
  await expect(
    content.getByRole("link", { name: "Documentation" }),
  ).toHaveAttribute("href", "https://example.com/docs");
  await expect(
    content.locator("img,script,a[href^='javascript:']"),
  ).toHaveCount(0);
  expect(await page.evaluate(() => window.markdownExecuted)).toBeUndefined();
  await content.getByRole("link", { name: "Jump to details" }).click();
  await expect(
    content.getByRole("heading", { name: "Details", exact: true }),
  ).toBeFocused();
  await expect(page).toHaveURL(new RegExp(`#record/${record.id}$`));
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 375, height: 900 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
  const saved = await (await page.request.get("/api/workspace")).json();
  expect(saved.records.find((r) => r.id === record.id).original).toBe(original);
});

test("audit reads as one document with Page Nav on desktop and mobile", async ({
  page,
}) => {
  await page.request.post("/api/login", {
    headers: { Origin: "http://127.0.0.1:5192" },
    data: {
      email: "browser@example.test",
      password: "test-only-password-12345",
    },
  });
  for (const width of [1440, 900, 375]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/?collection=demo#audit");
    const nav = page.getByRole("navigation", { name: "In this audit" });
    await expect(nav).toBeVisible();
    await expect(
      page.getByRole("article", { name: "Website audit document" }),
    ).toBeVisible();
    await expect(
      page.getByRole("table", { name: "Audit evidence table" }),
    ).toHaveCount(1);
    await nav
      .getByRole("button", { name: "Detailed findings", exact: true })
      .click();
    await expect(
      nav.getByRole("button", { name: "Detailed findings", exact: true }),
    ).toHaveAttribute("aria-current", "location");
    await expect
      .poll(async () =>
        page
          .getByRole("heading", { name: "Detailed findings", exact: true })
          .evaluate((el) => el.getBoundingClientRect().top),
      )
      .toBeLessThan(400);
    await expect(page).toHaveURL(/#audit$/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    const issues = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      issues.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
});
