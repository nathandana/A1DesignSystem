import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

test('shared sizes work in all five studies and preserve grid edits and bulk deletions', async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1600, height: 1100 } })
    const page = await context.newPage()
    page.setDefaultTimeout(10000)
    const errors = []; page.on('pageerror', error => errors.push(error.message))
    const preset = label => page.getByRole('radiogroup', { name: 'Data preset', exact: true }).getByRole('radio', { name: label, exact: true })
    for (const route of ['data-tables', 'pagination-types', 'data-grid', 'bulk-actions', 'mobile-tables']) {
      await page.goto(`${origin}/experiments/${route}`)
      const slider = page.getByRole('slider', { name: 'Data set size', exact: true })
      for (const [label, count] of [['Small', '10'], ['Medium', '100'], ['Large', '1,000']]) {
        await preset(label).click()
        await expect(slider).toHaveAttribute('aria-valuetext', `${count} rows`)
        await expect(preset(label)).toHaveAttribute('aria-checked', 'true')
      }
      if (route === 'data-grid') {
        const grid = page.getByRole('grid', { name: 'Inventory' })
        await expect(grid).toHaveAttribute('aria-rowcount', '1002')
        const product = grid.getByRole('gridcell').nth(1)
        await product.dblclick()
        await grid.getByRole('textbox').fill('Edited inventory product')
        await grid.getByRole('textbox').press('Enter')
        await preset('Small').click(); await preset('Large').click()
        await expect(grid).toContainText('Edited inventory product')
        await page.getByRole('button', { name: 'Reset data', exact: true }).click()
        await expect(grid).not.toContainText('Edited inventory product')
      } else if (route === 'bulk-actions') {
        const root = page.locator('.a1-bulk-lab')
        await root.locator('.a1-data-table__desktop-row').first().getByRole('checkbox').check()
        await root.getByRole('button', { name: 'Delete selected' }).click()
        await expect(root.getByRole('status')).toContainText('999 products remain')
        await preset('Small').click()
        await expect(root.getByRole('status')).toContainText('9 products')
        await preset('Large').click()
        await expect(root.getByRole('status')).toContainText('999 products')
        await page.reload()
        await expect(root.getByRole('status')).toContainText('99 products')
        await preset('Large').click()
        await page.getByRole('button', { name: 'Reset data', exact: true }).click()
        await expect(root.getByRole('status')).toContainText('1000 products')
      } else if (route === 'mobile-tables') {
        const preview = page.frameLocator('iframe').getByRole('main', { name: 'Inventory preview' })
        await expect(preview).toContainText('of 1000 results')
      } else {
        await expect(page.locator(route === 'data-tables' ? '.a1-data-tables-lab' : '.a1-pagination-types-lab')).toContainText('of 1000 results')
      }
    }
    await page.goto(`${origin}/experiments/pagination-types`)
    const controls = page.getByRole('slider', { name: 'Data set size', exact: true })
    await controls.press('End'); await controls.press('ArrowLeft')
    await expect(controls).toHaveAttribute('aria-valuetext', '500 rows')
    await expect(preset('Large')).toHaveAttribute('aria-checked', 'false')
    const axe = await new AxeBuilder({ page }).include('.a1-slider').disableRules(['color-contrast']).analyze()
    assert.deepEqual(axe.violations.map(item => item.id), [])
    await page.setViewportSize({ width: 390, height: 844 })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
