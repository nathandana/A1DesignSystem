import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'
const paint = locator => locator.evaluate(node => {
  const style = getComputedStyle(node)
  return { background: style.backgroundColor, color: style.color }
})

test('toolbar hover treatments preserve selection, focus and disabled behavior across themes', async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${origin}/experiments/toolbar-group`)
    const demo = page.locator('.a1-toolbar-hover-demo')
    const bold = demo.getByRole('button', { name: 'Bold', exact: true })
    const italic = demo.getByRole('button', { name: 'Italic', exact: true })
    const left = demo.getByRole('radio', { name: 'Left', exact: true })
    const center = demo.getByRole('radio', { name: 'Center', exact: true })
    const theme = page.getByRole('combobox', { name: 'Theme', exact: true })
    const themes = await theme.locator('option').evaluateAll(nodes => nodes.map(node => node.value))
    for (const themeValue of themes) {
      await theme.selectOption(themeValue)
      for (const mode of ['Light', 'Dark']) {
        await page.getByRole('radio', { name: mode, exact: true }).press('Space')
        for (const treatment of ['Current state', 'No hover state', 'Distinct hover state', 'Hover when off', 'Distinct hover when off', 'Pause after click']) {
          await page.getByRole('radio', { name: treatment, exact: true }).press('Space')
          await page.mouse.move(0, 0)
          const selectedPaint = await paint(bold)
          const offPaint = await paint(italic)
          for (const item of [bold, italic, left, center]) {
            await page.mouse.move(0, 0)
            const before = await paint(item)
            await item.hover()
            const after = await paint(item)
            if (treatment === 'No hover state' || (item === left && treatment !== 'Pause after click') || (['Hover when off', 'Distinct hover when off'].includes(treatment) && item === bold)) assert.deepEqual(after, before)
            else assert.notDeepEqual(after, before)
            if (treatment === 'Pause after click') {
              assert.deepEqual(after, item === bold || item === left ? offPaint : selectedPaint)
              await page.mouse.down()
              assert.deepEqual(await paint(item), after)
              // Release outside the control so this paint check does not toggle it.
              await page.mouse.move(0, 0)
              await page.mouse.up()
            }
          }
          await expect(bold).toHaveAttribute('aria-pressed', 'true')
          await expect(left).toBeChecked()
        }
      }
    }
    // Wireframe's existing selected shadow token is `none`, which invalidates
    // A1's combined selected focus shadow. Check visible focus in Default;
    // the study contract records that shared-component promotion issue.
    await theme.selectOption('a1Light')
    await page.getByRole('radio', { name: 'Pause after click', exact: true }).press('Space')
    await page.mouse.move(0, 0)
    const selectedPaint = await paint(bold)
    const offPaint = await paint(italic)
    await italic.click()
    await expect(italic).toHaveAttribute('aria-pressed', 'true')
    assert.deepEqual(await paint(italic), selectedPaint)
    await page.mouse.move(0, 0)
    await italic.hover()
    assert.deepEqual(await paint(italic), offPaint)
    await italic.click()
    await expect(italic).toHaveAttribute('aria-pressed', 'false')
    assert.deepEqual(await paint(italic), offPaint)
    await page.mouse.move(0, 0)
    await italic.hover()
    assert.deepEqual(await paint(italic), selectedPaint)
    await italic.click()
    await italic.press('Space')
    await expect(italic).toHaveAttribute('aria-pressed', 'false')
    await center.click()
    await expect(center).toBeChecked()
    assert.deepEqual(await paint(center), selectedPaint)
    await page.mouse.move(0, 0)
    await center.hover()
    assert.deepEqual(await paint(center), offPaint)
    await center.click()
    assert.deepEqual(await paint(center), offPaint)
    await left.focus()
    await left.press('ArrowRight')
    await expect(center).toBeFocused()
    await expect(center).toBeChecked()
    await page.getByRole('radio', { name: 'No hover state', exact: true }).press('Space')
    await center.focus()
    await center.press('ArrowLeft')
    await left.press('ArrowRight')
    const focus = await center.evaluate(node => ({ visible: node.matches(':focus-visible'), shadow: getComputedStyle(node).boxShadow, outline: getComputedStyle(node).outlineStyle }))
    assert.ok(focus.visible && (focus.shadow !== 'none' || focus.outline !== 'none'), JSON.stringify(focus))
    await page.getByRole('switch', { name: 'Show toolbar labels', exact: true }).press('Space')
    await expect(bold).toHaveAccessibleName('Bold')
    await expect(center).toBeChecked()
    await page.getByRole('switch', { name: 'Disabled', exact: true }).press('Space')
    await expect(bold).toBeDisabled()
    for (const treatment of ['No hover state', 'Distinct hover state', 'Hover when off', 'Distinct hover when off', 'Pause after click']) {
      await page.getByRole('radio', { name: treatment, exact: true }).press('Space')
      for (const item of [bold, italic, center]) {
        await page.mouse.move(0, 0)
        const before = await paint(item)
        await item.hover()
        assert.deepEqual(await paint(item), before)
      }
    }
    await page.getByRole('switch', { name: 'Disabled', exact: true }).press('Space')
    const axe = await new AxeBuilder({ page }).include('.a1-toolbar-hover-demo').analyze()
    assert.deepEqual(axe.violations, [])
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const width of [390, 700, 900, 1200, 1600]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect(bold).toBeVisible()
      await expect(center).toBeChecked()
      for (const control of await demo.locator('button').all()) {
        const bounds = await control.boundingBox()
        assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width)
      }
    }
    await page.screenshot({ path: '/tmp/labs-toolbar-group.png' })
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
