import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

test('six button treatments distinguish hover and press while retaining native activation and still fallbacks', async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } })
    const page = await context.newPage(), errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto(`${origin}/experiments/button-motion`)
    const primary = page.getByRole('button', { name: 'Try primary', exact: true })
    const surface = page.locator('.a1-button-motion__surface').first()
    const finish = () => page.locator('.a1-button-motion-demo').evaluate(e => e.getAnimations({ subtree: true }).forEach(animation => animation.finish()))
    let activations = 0
    for (const treatment of ['Subtle', 'Lift', 'Glow', 'Tilt', 'Spring', 'Ripple']) {
      await page.getByRole('radio', { name: treatment, exact: true }).press('Space')
      await primary.hover(); await finish()
      const hover = await surface.evaluate(e => getComputedStyle(e).transform)
      assert.notEqual(hover, 'none', `${treatment} has hover motion`)
      await page.mouse.down(); await finish()
      const pressed = await surface.evaluate(e => getComputedStyle(e).transform)
      assert.notEqual(pressed, hover, `${treatment} has distinct pressed feedback`)
      if (treatment === 'Ripple') {
        const matrix = await surface.evaluate(e => { const m = new DOMMatrix(getComputedStyle(e).transform); return [m.a, m.b, m.c, m.d] })
        assert.deepEqual(matrix, [1, 0, 0, 1], 'Ripple does not distort the button')
      }
      await page.mouse.up(); activations++
      if (treatment === 'Ripple') await expect(page.locator('.a1-button-motion__ripple').first()).toBeAttached()
      await expect(page.getByRole('status').filter({ hasText: 'Button activated' })).toHaveText(`Button activated ${activations} ${activations === 1 ? 'time' : 'times'}.`)
      await primary.focus(); await page.keyboard.down('Space'); await finish()
      await expect(page.locator('.a1-button-motion').first()).toHaveAttribute('data-pressed', 'true')
      await page.keyboard.up('Space'); activations++
      await expect(page.locator('.a1-button-motion').first()).toHaveAttribute('data-pressed', 'false')
      assert.notEqual(await primary.evaluate(e => getComputedStyle(e).outlineStyle), 'none')
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await expect(surface).toHaveCSS('transform', 'none'); await expect(surface).toHaveCSS('filter', 'none')
      await expect(surface).toHaveCSS('transition-duration', '0s')
      await page.emulateMedia({ reducedMotion: 'no-preference' })
    }
    await primary.press('Enter'); activations++
    await expect(page.getByRole('status').filter({ hasText: 'Button activated' })).toHaveText(`Button activated ${activations} times.`)
    await page.getByRole('switch', { name: 'Disabled', exact: true }).press('Space')
    await expect(primary).toBeDisabled()
    await primary.hover({ force: true }); await finish(); await expect(surface).toHaveCSS('transform', 'none')
    await page.getByRole('switch', { name: 'Disabled', exact: true }).press('Space')
    await page.emulateMedia({ forcedColors: 'active' }); await primary.focus()
    await expect(surface).toHaveCSS('transform', 'none')
    await page.emulateMedia({ forcedColors: 'none' })
    await primary.hover(); await finish()
    await page.screenshot({ path: '/tmp/button-motion-ripple.png' })
    await page.setViewportSize({ width: 390, height: 844 })
    assert.ok(await page.locator('.a1-button-motion-demo').evaluate(e => e.getBoundingClientRect().right <= innerWidth))
    await page.getByRole('button', { name: 'Try secondary', exact: true }).click(); activations++
    await expect(page.getByRole('status').filter({ hasText: 'Button activated' })).toHaveText(`Button activated ${activations} times.`)
    await page.screenshot({ path: '/tmp/button-motion-phone.png' })
    const result = await new AxeBuilder({ page }).include('.a1-button-motion-demo').disableRules(['color-contrast']).analyze()
    assert.deepEqual(result.violations, []); assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
