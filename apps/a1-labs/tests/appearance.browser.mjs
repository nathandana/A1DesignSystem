import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

test('appearance controls are inline from md, persist choices and retain mobile settings', async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    const errors = []; page.on('pageerror', e => errors.push(e.message))
    for (const route of ['/', '/about', '/experiments/button-motion']) {
      await page.goto(origin + route)
      for (const width of [390, 640, 641, 768, 769, 1024, 1440, 1600]) {
        await page.setViewportSize({ width, height: 900 })
        const appearance = page.getByRole('group', { name: 'Appearance', exact: true })
        const settings = page.getByRole('button', { name: 'Settings', exact: true })
        if (width < 641) {
          await expect(settings).toBeVisible(); await expect(appearance).toHaveCount(0)
        } else {
          await expect(appearance).toBeVisible(); await expect(settings).toHaveCount(0)
          for (const control of await appearance.locator('button, select').all()) {
            const rect = await control.boundingBox()
            assert.ok(rect.x >= 0 && rect.x + rect.width <= width, `${route} controls fit at ${width}`)
          }
        }
      }
    }
    const theme = page.getByRole('combobox', { name: 'Theme', exact: true })
    const options = await theme.locator('option').evaluateAll(els => els.map(e => e.value))
    await theme.selectOption(options[1])
    await page.getByRole('radio', { name: 'Light', exact: true }).press('Space')
    await expect(page.locator('html')).toHaveClass(/a1-theme-light/)
    await page.reload(); await expect(theme).toHaveValue(options[1])
    await expect(page.getByRole('radio', { name: 'Light', exact: true })).toBeChecked()
    await page.getByRole('radio', { name: 'System', exact: true }).click()
    await page.emulateMedia({ colorScheme: 'dark' }); await expect(page.locator('html')).toHaveClass(/a1-theme-dark/)
    await page.emulateMedia({ colorScheme: 'light' }); await expect(page.locator('html')).not.toHaveClass(/a1-theme-dark/)
    const axe = await new AxeBuilder({ page }).include('[aria-label="Appearance"]').disableRules(['color-contrast']).analyze()
    assert.deepEqual(axe.violations, [])
    await page.setViewportSize({ width: 640, height: 900 })
    await page.getByRole('button', { name: 'Settings', exact: true }).click()
    await expect(theme).toBeVisible()
    await expect(theme).toHaveValue(options[1])
    await expect(page.getByRole('switch', { name: 'Use / to search', exact: true })).toHaveCount(0)
    await page.setViewportSize({ width: 641, height: 900 })
    await expect(page.getByRole('group', { name: 'Appearance', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Use / to search', exact: true })).toHaveCount(0)
    await expect(theme).toHaveCount(1)
    await page.screenshot({ path: '/tmp/labs-appearance-md.png' })
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
