import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'
test('automation editor preserves clauses, edits values and tests matching/skipped rules', async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } }), page = await context.newPage()
    page.setDefaultTimeout(10000)
    const errors = []; page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${origin}/experiments/automation-builder`)
    const builder = page.locator('.a1-automation-builder')
    await expect(builder).toHaveAttribute('data-view', 'sentence')
    await page.getByRole('button', { name: 'Edit condition 1', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Edit condition' })
    await dialog.getByRole('combobox', { name: 'Value', exact: true }).selectOption('Low')
    await dialog.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByRole('button', { name: 'Edit condition 1', exact: true })).toBeFocused()
    await page.getByRole('button', { name: 'Test rule', exact: true }).click()
    await expect(page.getByText('Test skipped. No actions would run.')).toBeVisible()
    await page.getByRole('button', { name: 'Add condition', exact: true }).click()
    await expect(builder).toHaveAttribute('data-view', 'blocks')
    await page.getByRole('radio', { name: 'Any (OR)', exact: true }).press('Space')
    await page.getByRole('button', { name: 'Add action', exact: true }).click()
    await page.getByRole('button', { name: 'Move action 2 earlier' }).click()
    await page.getByRole('button', { name: 'Test rule', exact: true }).click()
    await expect(page.getByText('Test matched. 2 actions would run. Nothing was sent or changed.')).toBeVisible()
    await page.getByRole('button', { name: 'Edit action 1', exact: true }).click()
    await page.getByRole('dialog').getByRole('combobox', { name: 'Action', exact: true }).selectOption('comment')
    await page.getByRole('textbox', { name: 'Comment', exact: true }).fill('   ')
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    await page.getByRole('dialog').press('Escape')
    await page.getByRole('radio', { name: 'Sentence', exact: true }).press('Space')
    await expect(builder).toContainText('priority is Low')
    await page.getByRole('radio', { name: 'Structured blocks', exact: true }).press('Space')
    const axe = await new AxeBuilder({ page }).include('.a1-automation-builder').disableRules(['color-contrast']).analyze()
    assert.deepEqual(axe.violations, [])
    await page.screenshot({ path: '/tmp/labs-automation-desktop.png' })
    await page.setViewportSize({ width: 390, height: 900 })
    assert.ok(await builder.evaluate(el => el.getBoundingClientRect().right <= innerWidth))
    await page.screenshot({ path: '/tmp/labs-automation-mobile.png' })
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
test('token styling renders only the selected treatment and hierarchy traces actual source aliases', async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } }), page = await context.newPage()
    page.setDefaultTimeout(10000)
    const errors = []; page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${origin}/experiments/token-styling`)
    const preview = page.locator('[data-token-preview]')
    await expect(preview).toHaveText('--semantic-color-surface-card')
    assert.equal(await preview.locator('.a1-token-label__name > span').count(), 8)
    const colors = await preview.locator('.a1-token-label__name > span').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).color))
    assert.ok(new Set(colors).size >= 4)
    for (const label of ['A1 code', 'Soft pill', 'Outlined', 'Namespace emphasis', 'Swatch led', 'Name and value', 'Syntax highlighting']) {
      await page.getByRole('radio', { name: label, exact: true }).press('Space')
      await expect(page.locator('[data-token-preview]')).toHaveCount(1)
      await expect(preview).toContainText('--semantic-color-surface-card')
    }
    await page.screenshot({ path: '/tmp/labs-token-styling.png' })
    const axe = await new AxeBuilder({ page }).include('.a1-token-study').analyze()
    assert.deepEqual(axe.violations, [])
    await page.getByRole('radio', { name: 'Light', exact: true }).press('Space')
    await page.setViewportSize({ width: 390, height: 900 })
    assert.ok(await preview.evaluate(el => el.getBoundingClientRect().right <= innerWidth))
    await page.goto(`${origin}/experiments/token-hierarchy`)
    await page.setViewportSize({ width: 1440, height: 1100 })
    await page.getByRole('combobox', { name: 'Token to trace' }).selectOption('component.card.padding')
    const hierarchy = page.locator('.a1-token-hierarchy')
    await expect(hierarchy).toContainText('--base-space-card-padding')
    await expect(hierarchy).toContainText('--base-spacing-16')
    for (const label of ['Nested tree', 'Breadcrumb trails', 'Step by step', 'Linked cards']) {
      await page.getByRole('radio', { name: label, exact: true }).press('Space')
      if (label === 'Step by step') {
        await page.getByRole('button', { name: 'Follow reference' }).click()
        await page.getByRole('button', { name: 'Follow reference' }).click()
        await expect(page.getByRole('button', { name: 'Follow reference' })).toBeDisabled()
        await expect(hierarchy).toContainText('16px')
      }
    }
    await page.screenshot({ path: '/tmp/labs-token-hierarchy.png' })
    await page.setViewportSize({ width: 390, height: 900 })
    assert.ok(await hierarchy.evaluate(el => el.getBoundingClientRect().right <= innerWidth))
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
