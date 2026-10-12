import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

test('eight step treatments retain keyboard navigation, independent completion and responsive state', async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
    const page = await context.newPage(), errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto(`${origin}/experiments/steps`)
    const demo = page.locator('.a1-steps-study-demo')
    const list = page.getByRole('tablist', { name: 'Setup steps' })
    for (const label of ['A1 default', 'Dots', 'Bars', 'Pills', 'Tiles', 'Chevrons', 'Vertical', 'Compact']) {
      await page.getByRole('radio', { name: label, exact: true }).press('Space')
      await expect(list.getByRole('tab')).toHaveCount(5)
      await expect(list).toHaveAttribute('aria-orientation', label === 'Vertical' ? 'vertical' : 'horizontal')
      const selected = list.locator('[aria-selected="true"]')
      await selected.focus(); await page.keyboard.press('Home')
      await expect(list.getByRole('tab').first()).toBeFocused()
      await page.keyboard.press('End')
      await expect(list.getByRole('tab').last()).toBeFocused()
      await expect(demo.getByText('Step 5 of 5 · 1 complete', { exact: true })).toBeVisible()
      await page.keyboard.press('ArrowLeft')
      await expect(demo.getByText('Step 4 of 5 · 1 complete', { exact: true })).toBeVisible()
    }
    await page.getByRole('button', { name: 'Reset steps', exact: true }).click()
    await page.getByRole('switch', { name: 'Show current step error', exact: true }).press('Space')
    await expect(demo.getByRole('button', { name: 'Complete and continue' })).toBeDisabled()
    await expect(demo.getByRole('tabpanel')).toContainText('Needs attention')
    await page.getByRole('switch', { name: 'Show current step error', exact: true }).press('Space')
    for (let i = 0; i < 4; i++) await demo.getByRole('button', { name: 'Complete and continue' }).click()
    await demo.getByRole('button', { name: 'Complete step', exact: true }).click()
    await expect(demo.getByRole('status')).toContainText('All steps complete')
    await page.getByRole('radio', { name: 'Tiles', exact: true }).press('Space')
    await expect(demo.getByRole('status')).toContainText('All steps complete')
    await page.getByRole('radiogroup', { name: 'Number of steps', exact: true }).getByRole('radio', { name: '7', exact: true }).click()
    await expect(list.getByRole('tab')).toHaveCount(7)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(list.getByRole('tab').first()).toHaveCSS('transition-duration', '0s')
    const axe = await new AxeBuilder({ page }).include('.a1-steps-study-demo').disableRules(['color-contrast']).analyze()
    assert.deepEqual(axe.violations, [])
    await page.screenshot({ path: '/tmp/labs-steps-desktop.png' })
    for (const width of [390, 640, 768]) {
      await page.setViewportSize({ width, height: 900 })
      assert.ok(await demo.evaluate(e => e.getBoundingClientRect().right <= innerWidth), 'demo fits the viewport')
      await list.getByRole('tab').first().focus(); await page.keyboard.press('End')
      await expect(list.getByRole('tab').last()).toBeFocused()
    }
    await page.screenshot({ path: '/tmp/labs-steps-mobile.png' })
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
