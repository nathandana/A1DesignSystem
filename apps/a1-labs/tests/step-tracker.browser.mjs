import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

test('six tracker treatments stay display-only, preserve position and fit narrow screens', async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
    const page = await context.newPage(), errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto(`${origin}/experiments/step-tracker`)
    const demo = page.locator('.a1-tracker-study-demo'), tracker = demo.getByRole('img')
    for (const [label, id] of [['A1 default', 'default'], ['Rings', 'rings'], ['Segments', 'segments'], ['Ticks', 'ticks'], ['Numbers', 'numbers'], ['Spotlight', 'spotlight']]) {
      await page.getByRole('radio', { name: label, exact: true }).press('Space')
      await expect(tracker).toHaveAttribute('data-treatment', id)
      await expect(tracker).toHaveAccessibleName('Step 2 of 5')
      await expect(tracker.locator('button, a, input, [tabindex]')).toHaveCount(0)
      await demo.getByRole('button', { name: 'Next', exact: true }).press('Enter')
      await expect(demo.getByRole('status')).toHaveText('Step 3 of 5')
      await expect(tracker).toHaveAccessibleName('Step 3 of 5')
      await demo.getByRole('button', { name: 'Back', exact: true }).click()
      for (const align of ['Left', 'Center', 'Right', 'Full']) {
        await page.getByRole('radio', { name: align, exact: true }).press('Space')
        assert.ok(await tracker.evaluate(e => e.scrollWidth <= e.clientWidth + 1))
      }
      await page.getByRole('radio', { name: 'Center', exact: true }).press('Space')
      await tracker.screenshot({ path: `/tmp/tracker-${id}.png` })
    }
    await page.getByRole('radiogroup', { name: 'Number of steps' }).getByRole('radio', { name: '7', exact: true }).click()
    await page.getByRole('slider', { name: 'Current step' }).press('End')
    await expect(tracker).toHaveAccessibleName('Step 7 of 7')
    await page.getByRole('radiogroup', { name: 'Number of steps' }).getByRole('radio', { name: '3', exact: true }).click()
    await expect(tracker).toHaveAccessibleName('Step 3 of 3')
    await demo.getByRole('button', { name: 'Start again' }).click()
    await expect(demo.getByRole('button', { name: 'Back', exact: true })).toBeDisabled()
    await expect(tracker).toHaveAccessibleName('Step 1 of 3')
    await page.getByRole('radiogroup', { name: 'Number of steps' }).getByRole('radio', { name: '7', exact: true }).click()
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(tracker.locator('.a1-step-tracker__step').first()).toHaveCSS('transition-duration', '0s')
    await page.emulateMedia({ forcedColors: 'active' })
    await expect(tracker.locator('.a1-step-tracker__step--current')).toHaveCSS('outline-style', 'solid')
    await page.emulateMedia({ forcedColors: 'none' })
    await page.getByRole('radio', { name: 'Light', exact: true }).click()
    const axe = await new AxeBuilder({ page }).include('.a1-tracker-study-demo').disableRules(['color-contrast']).analyze()
    assert.deepEqual(axe.violations, [])
    for (const width of [390, 641, 768]) {
      await page.setViewportSize({ width, height: 900 })
      await expect(demo).toBeVisible()
      assert.ok(await tracker.evaluate(e => e.scrollWidth <= e.clientWidth + 1))
      assert.ok(await demo.evaluate(e => e.getBoundingClientRect().right <= innerWidth))
      await demo.getByRole('button', { name: 'Next', exact: true }).click()
    }
    await page.screenshot({ path: '/tmp/tracker-responsive.png' })
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
