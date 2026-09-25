import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { expect, test } from '@playwright/test'

const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const exampleId = 'custom-block-example'
const route = `/editor?project=proj-showcase&doc=${exampleId}`

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    if (window.top !== window) return
    localStorage.setItem('a1-web-theme', 'a1Light')
    localStorage.setItem('a1-web-color-mode', 'light')
    localStorage.setItem('a1-web-locale', 'en')
  })
})

test('fresh showcase seating map works with keyboard, themes and narrow frames', async ({ page }) => {
  await page.goto(route)
  await expect(page.locator('[data-editor-node="custom-seat-map"] iframe')).toHaveAttribute('inert', '')
  await page.getByRole('radio', { name: 'Preview', exact: true }).click()
  const frame = page.frameLocator('iframe[title="Interactive seating map"]')
  await expect(frame.locator('.a1-seat')).toHaveCount(24)
  await expect(frame.getByRole('button', { name: 'Seat A2, unavailable', exact: true })).toBeDisabled()
  await frame.getByRole('button', { name: 'Seat A1', exact: true }).press('Space')
  await expect(frame.getByRole('button', { name: 'Seat A1', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await frame.getByRole('button', { name: 'Seat C3', exact: true }).click()
  await expect(frame.getByRole('status')).toContainText('2')
  await expect(frame.getByRole('status')).toContainText('A1 · C3')
  await frame.getByRole('button', { name: 'Clear selection' }).click()
  await expect(frame.getByRole('status')).toContainText('No seats selected.')
  await expect(frame.getByRole('button', { name: 'Seat A1', exact: true })).toBeFocused()

  // Standalone preview isolates page responsiveness from editor side panels.
  await page.goto(`/editor-preview?standalone&screen=${exampleId}&project=proj-showcase`)
  const iframe = page.locator('iframe[title="Interactive seating map"]')
  const root = page.locator('.a1-custom-block')
  for (const theme of ['', 'a1-theme-light', 'a1-theme-accessible', 'a1-theme-heritage']) {
    await page.evaluate((value) => {
      document.documentElement.classList.remove('a1-theme-light', 'a1-theme-accessible', 'a1-theme-heritage')
      if (value) document.documentElement.classList.add(value)
    }, theme)
    for (const width of [375, 560, 768, 1280, 1536]) {
      await page.setViewportSize({ width, height: 900 })
      const token = await root.evaluate((el) => getComputedStyle(el).getPropertyValue('--component-button-primary-background').trim())
      await expect.poll(() => frame.locator('html').evaluate((el) => getComputedStyle(el).getPropertyValue('--component-button-primary-background').trim())).toBe(token)
      await expect(frame.locator('.a1-seat')).toHaveCount(24)
      expect(await frame.locator('body').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
      const button = await frame.getByRole('button', { name: 'Seat A1', exact: true }).boundingBox()
      expect(button.width).toBeGreaterThanOrEqual(24)
      expect(button.height).toBeGreaterThanOrEqual(24)
    }
    const inner = await (await iframe.elementHandle()).contentFrame()
    await inner.evaluate(axeSource)
    const scan = await inner.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } }))
    expect(scan.violations).toEqual([])
  }
  await page.screenshot({ path: 'test-results/a1-web/custom-block-showcase-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 375, height: 900 })
  await frame.getByRole('button', { name: 'Seat C3', exact: true }).click()
  await expect(frame.getByRole('status')).toContainText('C3')
  await frame.getByRole('button', { name: 'Clear selection' }).click()
  await page.screenshot({ path: 'test-results/a1-web/custom-block-showcase-mobile.png', fullPage: true })
})

test('custom banner keeps custom source to the banner and A1 components elsewhere', async ({ page }) => {
  await page.goto('/editor?project=proj-showcase&doc=custom-block-banner-example')
  await expect(page.locator('[data-editor-node="catalyst-banner"] iframe')).toHaveAttribute('inert', '')
  await expect(page.locator('.a1-custom-block')).toHaveCount(1)
  await expect(page.locator('[data-editor-node="catalyst-speed"]')).toBeVisible()
  await expect(page.locator('[data-editor-node="catalyst-interface"]')).toBeVisible()
  await expect(page.locator('[data-editor-node="catalyst-connected"]')).toBeVisible()
  await expect(page.locator('[data-editor-node="catalyst-primary-action"]')).toBeVisible()
  await expect(page.locator('[data-editor-node="catalyst-secondary-action"]')).toBeVisible()

  await page.getByRole('radio', { name: 'Preview', exact: true }).click()
  const frame = page.frameLocator('iframe[title="Catalyst product banner"]')
  await expect(frame.getByRole('heading', { name: 'Meet Catalyst.' })).toBeVisible()
  await expect(frame.locator('.a1-catalyst-phone')).toBeVisible()
  expect(await frame.locator('body').evaluate((el) => el.scrollWidth <= el.clientWidth && el.scrollHeight <= el.clientHeight)).toBe(true)
  await expect(page.locator('button.a1-button').filter({ hasText: 'Explore Catalyst' })).toBeVisible()
  await expect(page.locator('button.a1-button').filter({ hasText: 'Watch the overview' })).toBeVisible()

  await page.goto('/editor-preview?standalone&screen=custom-block-banner-example&project=proj-showcase')
  const root = page.locator('.a1-custom-block')
  const iframe = page.locator('iframe[title="Catalyst product banner"]')
  const standaloneFrame = page.frameLocator('iframe[title="Catalyst product banner"]')
  for (const width of [375, 560, 768, 1280, 1536]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(root).toHaveCSS('height', '576px')
    expect(await standaloneFrame.locator('body').evaluate((el) => el.scrollWidth <= el.clientWidth && el.scrollHeight <= el.clientHeight)).toBe(true)
  }
  const inner = await (await iframe.elementHandle()).contentFrame()
  await inner.evaluate(axeSource)
  const scan = await inner.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } }))
  expect(scan.violations).toEqual([])
  await page.screenshot({ path: 'test-results/a1-web/custom-block-banner.png', fullPage: true })
  await page.setViewportSize({ width: 375, height: 900 })
  await page.screenshot({ path: 'test-results/a1-web/custom-block-banner-mobile.png', fullPage: true })
})
