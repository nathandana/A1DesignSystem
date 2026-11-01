import assert from 'node:assert/strict'
import test from 'node:test'
import { chromium } from 'playwright'

const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

async function selectText(locator, start, end) {
  await locator.evaluate((element, offsets) => {
    const range = document.createRange()
    range.setStart(element.firstChild, offsets.start)
    range.setEnd(element.firstChild, offsets.end)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }, { start, end })
}

test('selection treatments style native selectable content on default and inverse surfaces', async t => {
  const browser = await chromium.launch({ headless: true })
  t.after(() => browser.close())
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })
  await page.goto(`${origin}/experiments/text-selection`)

  const study = page.locator('.a1-selection-study')
  await study.waitFor()
  assert.equal(await study.locator('section').count(), 2)
  assert.equal(await study.locator('[data-a1-color-scope="inverse"]').count(), 1)
  assert.ok(await study.getByRole('heading').count() >= 4)
  assert.ok(await study.getByRole('listitem').count() >= 6)
  assert.ok(await study.getByRole('link').count() >= 3)

  const textarea = study.getByRole('textbox', { name: 'Reviewer notes' })
  assert.equal(await textarea.count(), 1)
  await textarea.evaluate(element => element.setSelectionRange(4, 15))
  assert.deepEqual(await textarea.evaluate(element => [element.selectionStart, element.selectionEnd]), [4, 15])

  const releaseLead = study.getByText(/The new review workspace keeps/)
  await selectText(releaseLead, 4, 22)
  assert.equal(await page.evaluate(() => window.getSelection()?.toString()), 'new review workspa')
  assert.equal(await study.getAttribute('class'), 'a1-stack a1-selection-study a1-selection-study--default')

  const configuration = page.locator('.a1-labs-configuration')
  await configuration.getByRole('radio', { name: /Information/ }).check({ force: true })
  assert.match(await study.getAttribute('class'), /a1-selection-study--info/)
  await selectText(releaseLead, 4, 22)
  assert.equal(await page.evaluate(() => window.getSelection()?.toString()), 'new review workspa')

  const selectionRules = await page.evaluate(() => [...document.styleSheets]
    .flatMap(sheet => {
      try { return [...sheet.cssRules] } catch { return [] }
    })
    .filter(rule => rule.selectorText?.includes('.a1-selection-study') && rule.selectorText.includes('::selection'))
    .map(rule => rule.selectorText))
  assert.equal(selectionRules.length, 8)
  assert.ok(selectionRules.includes('.a1-selection-study--info ::selection'))
  assert.ok(selectionRules.includes('.a1-selection-study--highlight-subtle ::selection'))
  assert.ok(selectionRules.includes('.a1-selection-study--highlight-obvious ::selection'))
})
