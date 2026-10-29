import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'
const background = row => row.evaluate(async element => {
  getComputedStyle(element).backgroundColor
  await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})))
  return getComputedStyle(element).backgroundColor
})

test('checkbox hover study preserves native selection and pauses after input or label clicks', async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
    const page = await context.newPage()
    const errors = []; page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${origin}/experiments/toolbar-group`)
    await expect(page.getByRole('heading', { name: 'Hover state and selected', exact: true })).toHaveCount(1)
    const group = page.getByRole('group', { name: 'Notification preferences', exact: true })
    await expect(group.getByRole('checkbox')).toHaveCount(5)
    const email = group.getByRole('checkbox', { name: 'Email notifications', exact: true })
    const push = group.getByRole('checkbox', { name: 'Push notifications', exact: true })
    const onRow = email.locator('..'), offRow = push.locator('..')
    await expect(email).toBeChecked()
    await expect(group.getByRole('checkbox', { name: 'Activity summaries', exact: true })).toBeChecked()
    await expect(push).not.toBeChecked()
    const treatments = ['Current state', 'No hover state', 'Distinct hover state', 'Hover when off', 'Distinct hover when off', 'Pause after click']
    for (const mode of ['Light', 'Dark']) {
      await page.getByRole('radio', { name: mode, exact: true }).press('Space')
      for (const treatment of treatments) {
        await page.getByRole('radio', { name: treatment, exact: true }).press('Space')
        await page.mouse.move(0, 0)
        const selected = await background(onRow), unselected = await background(offRow)
        await onRow.hover()
        const checkedHover = await background(onRow)
        if (['No hover state', 'Hover when off', 'Distinct hover when off'].includes(treatment)) assert.equal(checkedHover, selected)
        else if (treatment === 'Pause after click') assert.equal(checkedHover, unselected)
        else assert.notEqual(checkedHover, selected)
        assert.notEqual(await email.evaluate(node => getComputedStyle(node).backgroundImage), 'none')
        await offRow.hover()
        const uncheckedHover = await background(offRow)
        if (treatment === 'No hover state') assert.equal(uncheckedHover, unselected)
        else if (treatment === 'Pause after click') assert.equal(uncheckedHover, selected)
        else assert.notEqual(uncheckedHover, unselected)
        await expect(email).toBeChecked(); await expect(push).not.toBeChecked()
      }
    }
    await page.mouse.move(0, 0)
    const selected = await background(onRow), unselected = await background(offRow)
    // Native label forwards activation to its input; the row remains hovered.
    await offRow.locator('.a1-checkbox-item__label').click()
    await expect(push).toBeChecked()
    assert.equal(await background(offRow), selected)
    await push.hover() // moving within the row must not clear the pause
    assert.equal(await background(offRow), selected)
    await page.mouse.move(0, 0); await offRow.hover()
    assert.equal(await background(offRow), unselected)
    await push.click()
    await expect(push).not.toBeChecked()
    assert.equal(await background(offRow), unselected)
    await page.mouse.move(0, 0); await offRow.hover()
    assert.equal(await background(offRow), selected)
    await page.mouse.move(0, 0)
    await push.press('Space')
    await expect(push).toBeChecked()
    await expect(offRow).not.toHaveAttribute('data-a1-hover-paused', '')
    assert.ok(await push.evaluate(node => node.matches(':focus-visible') && getComputedStyle(node).outlineStyle !== 'none'))
    await page.getByRole('switch', { name: 'Disabled', exact: true }).press('Space')
    for (const control of await group.getByRole('checkbox').all()) await expect(control).toBeDisabled()
    for (const treatment of treatments) {
      await page.getByRole('radio', { name: treatment, exact: true }).press('Space')
      await page.mouse.move(0, 0)
      const resting = await background(onRow)
      await onRow.hover(); assert.equal(await background(onRow), resting)
    }
    await page.getByRole('switch', { name: 'Disabled', exact: true }).press('Space')
    await page.mouse.move(0, 0)
    const axe = await new AxeBuilder({ page }).include('.a1-checkbox-hover').analyze()
    assert.deepEqual(axe.violations, [])
    for (const width of [390, 700, 900, 1200, 1600]) {
      await page.setViewportSize({ width, height: 1100 })
      for (const row of await group.locator('.a1-checkbox-item').all()) {
        const bounds = await row.boundingBox()
        assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width)
      }
      await expect(push).toBeChecked()
    }
    await page.screenshot({ path: '/tmp/labs-hover-checkbox.png' })
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
