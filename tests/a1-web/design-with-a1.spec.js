import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import fs from 'node:fs'

const labels = JSON.parse(fs.readFileSync('system/labels/design-with-a1.json', 'utf8')).label.designWithA1

test.beforeEach(async ({ context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await context.addInitScript(() => {
    localStorage.setItem('a1-web-theme', 'a1Light')
    localStorage.setItem('a1-web-color-mode', 'light')
    if (!localStorage.getItem('a1-web-locale')) localStorage.setItem('a1-web-locale', 'en')
  })
})

test('design guide opens from navigation, copies prompts and downloads the canonical document', async ({ page }) => {
  await page.goto('/get-started')
  await page.getByRole('button', { name: 'Explore', exact: true }).click()
  await page.locator('[href="/design-with-a1"]').click()
  await expect(page).toHaveURL(/\/design-with-a1$/)
  await expect(page.getByRole('heading', { name: 'Design with A1', level: 1 })).toBeVisible()
  const article = page.getByRole('article', { name: 'Design with A1' })
  const codex = article.getByRole('button', { name: 'Codex', exact: true })
  await codex.focus()
  await page.keyboard.press('Enter')
  await expect(codex).toHaveAttribute('aria-expanded', 'true')
  await expect(article.getByText('codex mcp add a1 --url https://mcp.a1design.app/mcp')).toBeVisible()
  await article.getByRole('button', { name: 'Copy code', exact: true }).nth(1).click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('Read design.md. Build this interface')
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Download design.md', exact: true }).first().click()
  const download = await downloadEvent
  expect(download.suggestedFilename()).toBe('design.md')
  expect(fs.readFileSync(await download.path(), 'utf8')).toBe(fs.readFileSync('design.md', 'utf8'))
  for (const [href, source] of [['/react-setup.md', 'packages/react/guidelines/setup.md'], ['/a1-agent-brief.md', 'packages/react/ai/a1-agent-brief.md']]) {
    const response = await page.request.get(href)
    expect(response.ok()).toBe(true)
    expect(await response.text()).toBe(fs.readFileSync(source, 'utf8'))
  }
  await article.getByRole('link', { name: 'Open Projects', exact: true }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await page.goBack()
  await page.getByRole('navigation', { name: /breadcrumb/i }).getByRole('link', { name: 'Home' }).click()
  await expect(page).toHaveURL(/\/$/)
})

test('guide fits every breakpoint and passes focused accessibility checks across required themes', async ({ page }) => {
  await page.goto('/design-with-a1')
  const article = page.getByRole('article', { name: 'Design with A1' })
  for (const name of ['Codex', 'Claude Code', 'Cursor', 'Gemini CLI', 'Other agents and chat tools']) {
    await article.getByRole('button', { name, exact: true }).click()
  }
  for (const theme of ['base', 'a1Light', 'a1Accessible', 'a1Heritage']) {
    await page.evaluate(theme => {
      document.documentElement.classList.remove('a1-theme-accessible', 'a1-theme-heritage')
      if (theme === 'a1Accessible') document.documentElement.classList.add('a1-theme-accessible')
      if (theme === 'a1Heritage') document.documentElement.classList.add('a1-theme-heritage')
    }, theme)
    for (const width of [375, 560, 768, 1280, 1536]) {
      await page.setViewportSize({ width, height: 900 })
      await expect(page.getByRole('heading', { name: 'Design with A1', level: 1 })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      const result = await new AxeBuilder({ page }).include('article[aria-label="Design with A1"]').analyze()
      expect(result.violations, `${theme} at ${width}px`).toEqual([])
    }
  }
  await page.setViewportSize({ width: 375, height: 900 })
  await page.getByRole('heading', { name: 'Design with A1', level: 1 }).scrollIntoViewIfNeeded()
  await page.screenshot({ path: 'test-results/design-with-a1-mobile.png', fullPage: true })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.getByRole('heading', { name: 'Design with A1', level: 1 }).scrollIntoViewIfNeeded()
  await page.screenshot({ path: 'test-results/design-with-a1-desktop.png', fullPage: true })
})

test('guide resolves every supported locale without missing labels', async ({ page }) => {
  await page.goto('/design-with-a1')
  await page.setViewportSize({ width: 375, height: 900 })
  for (const locale of ['es', 'fr', 'de', 'pt', 'ja', 'zh', 'ar']) {
    for (const label of Object.values(labels)) {
      expect(label.$description).toBeTruthy()
      expect(label.locale[locale]).toBeTruthy()
    }
    await page.evaluate(locale => localStorage.setItem('a1-web-locale', locale), locale)
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(labels.title.locale[locale])
    await expect(page.getByRole('article')).not.toContainText('designWithA1.')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
})
