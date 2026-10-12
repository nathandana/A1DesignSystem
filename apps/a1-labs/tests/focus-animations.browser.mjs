import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'
const treatments = { settle: 'Ring settle', halo: 'Halo pulse', underline: 'Underline sweep', double: 'Double ring', zoom: 'Subtle zoom', lift: 'Gentle lift', corners: 'Corner draw', inset: 'Inset frame' }

test('eight focus treatments retain outlines, isolate effects and become still', async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
    const page = await context.newPage(), errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto(`${origin}/experiments/focus-animations`)
    const choices = page.getByRole('group', { name: 'Focus treatment', exact: true })
    const form = page.getByRole('form', { name: 'Focus animation demo' })
    const name = form.getByRole('textbox', { name: 'Name', exact: true })
    const radio = form.getByRole('radio', { name: 'Feedback', exact: true })
    const controls = [name, form.getByRole('textbox', { name: 'Email' }), form.getByRole('textbox', { name: 'Message' }), radio, form.getByRole('button', { name: 'Submit' }), form.getByRole('button', { name: 'Cancel' })]
    await expect(choices.getByRole('radio')).toHaveCount(8)
    for (const [id, label] of Object.entries(treatments)) {
      await choices.getByRole('radio', { name: label, exact: true }).press('Space')
      for (const control of controls) {
        await control.focus()
        const target = control === radio ? radio.locator('..') : control
        await expect(target).toHaveCSS('animation-name', `a1-focus-animation-${id}`)
        const state = await target.evaluate(element => {
          element.getAnimations().forEach(animation => animation.finish())
          const s = getComputedStyle(element)
          return { outline: s.outlineStyle, width: parseFloat(s.outlineWidth), color: s.outlineColor, scale: s.scale, translate: s.translate, shadow: s.boxShadow, background: s.backgroundImage }
        })
        assert.ok(state.width >= 2 && state.outline !== 'none', `${id} persistent outline`)
        if (id === 'zoom') assert.equal(state.scale, '1.015')
        if (id === 'lift') assert.equal(state.translate, '0px -2px')
        if (id === 'corners') assert.match(state.background, /linear-gradient/)
        if (id === 'inset') assert.match(state.shadow, /inset/)
      }
      await name.focus()
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await expect(name).toHaveCSS('animation-name', 'none')
      await expect(name).toHaveCSS('scale', 'none')
      await expect(name).toHaveCSS('translate', 'none')
      await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'active' })
      await expect(name).toHaveCSS('animation-name', 'none')
      await expect(name).not.toHaveCSS('outline-style', 'none')
      await page.emulateMedia({ forcedColors: 'none' })
    }
    await radio.focus(); await page.keyboard.press('ArrowDown')
    await expect(form.getByRole('radio', { name: 'An idea', exact: true })).toBeChecked()
    await name.focus(); await page.keyboard.press('Tab')
    await expect(form.getByRole('textbox', { name: 'Email' })).toBeFocused()
    await page.keyboard.press('Shift+Tab'); await expect(name).toBeFocused()
    const search = page.getByRole('searchbox', { name: 'Filter experiments' })
    await search.focus(); await expect(search).toHaveCSS('animation-name', 'none')
    for (const key of ['Home', 'ArrowRight', 'End']) {
      await page.getByRole('slider', { name: 'Animation duration' }).press(key)
      await page.getByRole('button', { name: 'Try focus', exact: true }).click()
      await expect(name).toBeFocused()
    }
    await name.fill('Retained draft')
    await page.setViewportSize({ width: 390, height: 900 })
    await page.getByRole('button', { name: 'Resize sheet' }).press('Enter')
    await choices.getByRole('radio', { name: 'Subtle zoom' }).press('Space')
    await expect(page.locator('.a1-focus-animation')).toHaveAttribute('data-style', 'zoom')
    await expect(name).toHaveValue('Retained draft')
    await page.setViewportSize({ width: 1440, height: 1100 })
    const results = await new AxeBuilder({ page }).include('.a1-focus-animation').disableRules(['color-contrast']).analyze()
    assert.deepEqual(results.violations, [])
    assert.deepEqual(errors, [])
    await name.focus()
    await page.screenshot({ path: '/tmp/focus-zoom.png' })
  } finally { await browser.close() }
})
