import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

test('home gallery uses the Labs header, scrolls only the document and preserves its sort', async () => {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    page.setDefaultTimeout(10000)
    await page.goto(origin)
    const main = page.getByRole('main')
    await expect(page.getByRole('heading', { level: 1, name: 'All experiments' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Search Labs' })).toBeVisible()
    const sort = page.getByRole('combobox', { name: 'Sort experiments' })
    await expect(page.getByRole('combobox', { name: 'Category', exact: true })).toHaveCount(0)
    await expect(page.getByRole('combobox', { name: 'Type', exact: true })).toHaveCount(0)
    await sort.selectOption('oldest')
    await expect(main.locator('[data-experiment]').first()).toHaveAttribute('data-experiment', 'ai-image-generation')
    const ids = () => main.locator('[data-experiment]').evaluateAll(nodes => nodes.map(node => node.dataset.experiment))
    const oldest = await ids()
    await sort.selectOption('newest')
    assert.deepEqual(await ids(), [...oldest].reverse())
    await sort.selectOption('az')
    const titles = () => main.getByRole('heading', { level: 2 }).allTextContents()
    const az = await titles()
    assert.deepEqual(az, [...az].sort((a,b) => new Intl.Collator('en', { sensitivity: 'base', numeric: true }).compare(a,b)))
    await sort.selectOption('za'); assert.deepEqual(await titles(), [...az].reverse())
    await page.reload(); await expect(sort).toHaveValue('za')

    const grid = main.getByRole('group', { name: 'Experiments', exact: true })
    for (const [width, columns] of [[390, 1], [480, 1], [481, 2], [640, 2], [641, 2], [1024, 2], [1025, 3], [1440, 3], [1441, 4]]) {
      await page.setViewportSize({ width, height: 900 })
      await expect.poll(() => grid.evaluate(e => getComputedStyle(e).gridTemplateColumns.split(' ').length)).toBe(columns)
      assert.ok(await main.evaluate(e => e.scrollWidth <= e.clientWidth + 1), `no horizontal overflow at ${width}`)
    }
    // One scroll region: the document. No element inside the page scrolls vertically.
    const innerScrollers = () => page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => {
      const style = getComputedStyle(e)
      return /(auto|scroll)/.test(style.overflowY) && e.scrollHeight > e.clientHeight + 1 && e.getClientRects().length
    }).map(e => e.className))
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      assert.deepEqual(await innerScrollers(), [], `no nested scroll regions at ${width}`)
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
      assert.ok(await page.evaluate(() => window.scrollY > 0), `document scrolls at ${width}`)
      await expect(page.getByRole('button', { name: 'Search Labs' })).toBeInViewport()
      await page.evaluate(() => window.scrollTo(0, 0))
    }
    // The gallery has no filter of its own; sitewide search covers it.
    await expect(page.getByRole('searchbox')).toHaveCount(0)
    await page.goto(`${origin}/?q=flip&sort=az`)
    await expect(sort).toHaveValue('az')
    await expect(main.locator('[data-experiment]')).toHaveCount(await page.evaluate(() => document.querySelectorAll('[data-experiment]').length))
    assert.ok(!new URL(page.url()).searchParams.has('q'))
    const count = await main.getByText(/^\d+ experiments$/).textContent()
    const sortBox = await sort.boundingBox(), countBox = await main.getByText(/^\d+ experiments$/).boundingBox()
    assert.ok(Math.abs((sortBox.y + sortBox.height / 2) - (countBox.y + countBox.height / 2)) < 12, `sort sits inline with ${count}`)
    await page.screenshot({ path: process.env.SHOT_DIR ? `${process.env.SHOT_DIR}/labs-gallery-desktop.png` : '/tmp/labs-gallery-desktop.png' })
    await page.setViewportSize({ width: 390, height: 900 })
    await page.screenshot({ path: process.env.SHOT_DIR ? `${process.env.SHOT_DIR}/labs-gallery-mobile.png` : '/tmp/labs-gallery-mobile.png' })
  } finally { await browser.close() }
})
