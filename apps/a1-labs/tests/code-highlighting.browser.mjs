import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { SAMPLES } from '../src/code-highlighting/samples.js'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

// Line numbers level with their lines; wrapped rows hang at the line's indent.
const layout = () => {
  const numbers = [...document.querySelectorAll('.a1-code-block__line-numbers li')]
  const lines = [...document.querySelectorAll('.a1-code-hl__line')]
  const numberOffset = Math.max(...lines.map((line, i) => Math.abs(numbers[i].getBoundingClientRect().top - line.getBoundingClientRect().top)))
  let hangError = 0, wrappedLines = 0
  for (const line of lines) {
    const lead = line.textContent.match(/^[\t ]*/)[0].length
    const range = document.createRange(); range.selectNodeContents(line)
    const rows = [...range.getClientRects()].filter(rect => rect.width > 0)
    const tops = [...new Set(rows.map(rect => Math.round(rect.top)))]
    if (tops.length < 2) continue
    wrappedLines++
    if (!lead) continue
    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT); let seen = 0, firstX
    while (walker.nextNode()) { const node = walker.currentNode; if (seen + node.length > lead) { const r = document.createRange(); r.setStart(node, lead - seen); r.setEnd(node, lead - seen + 1); firstX = r.getBoundingClientRect().left; break } seen += node.length }
    for (const top of tops.slice(1)) hangError = Math.max(hangError, Math.abs(Math.min(...rows.filter(rect => Math.round(rect.top) === top).map(rect => rect.left)) - firstX))
  }
  return { lines: lines.length, numbers: numbers.length, numberOffset, hangError, wrappedLines }
}

test('code highlighting: languages, copy, wrapping, spacing, highlight, diff and live editing', async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1100, height: 1300 }, permissions: ['clipboard-read', 'clipboard-write'] })
    const page = await context.newPage()
    page.setDefaultTimeout(10000)
    const errors = []; page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${origin}/experiments/code-highlighting`)
    const stage = page.locator('.a1-code-highlighting-lab')
    const block = stage.locator('.a1-code-block').first()
    const toggle = name => page.getByRole('switch', { name: new RegExp(`^${name}`) })

    for (const [label, language] of [['JSX', 'jsx'], ['CSS', 'css'], ['HTML', 'html'], ['JSON', 'json']]) {
      await page.getByRole('radio', { name: label, exact: true }).click()
      await expect(block.locator('code')).toHaveText(SAMPLES[language])
      // Copy gives the exact source, not just its line breaks.
      await block.getByRole('button', { name: /copy/i }).click()
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(SAMPLES[language])
    }
    await page.getByRole('radio', { name: 'JSX', exact: true }).click()
    await expect(block.locator('.a1-code-hl__token--keyword').first()).toHaveText('import')
    await expect(block.locator('.a1-code-hl__token--tag', { hasText: 'Stack' }).first()).toBeVisible()

    // Wrapping: numbers stay level and continuation rows hang, at both spacings.
    await toggle('Wrap long lines').check({ force: true })
    for (const spacing of ['Default', 'Separated']) {
      await page.getByRole('radio', { name: spacing, exact: true }).click()
      for (const label of ['JSX', 'CSS', 'HTML', 'JSON']) {
        await page.getByRole('radio', { name: label, exact: true }).click()
        const result = await page.evaluate(layout)
        assert.equal(result.lines, result.numbers, `${spacing} ${label}: one number per line`)
        assert.ok(result.wrappedLines > 0, `${spacing} ${label}: sample has wrapped lines`)
        assert.ok(result.numberOffset < 0.5, `${spacing} ${label}: numbers aligned (${result.numberOffset})`)
        assert.ok(result.hangError < 0.5, `${spacing} ${label}: hanging indent (${result.hangError})`)
      }
    }
    // Separated: more space between lines than between wrapped rows.
    const pitches = await page.evaluate(() => {
      const lines = [...document.querySelectorAll('.a1-code-hl__line')], tops = lines.map(line => line.getBoundingClientRect().top)
      const wrapped = lines.find(line => line.getBoundingClientRect().height > 40), range = document.createRange(); range.selectNodeContents(wrapped)
      const rows = [...new Set([...range.getClientRects()].filter(rect => rect.width).map(rect => rect.top))].sort((a, b) => a - b)
      return { line: tops[2] - tops[1], row: rows[1] - rows[0] }
    })
    assert.ok(pitches.line > pitches.row, JSON.stringify(pitches))
    await page.getByRole('radio', { name: 'Default', exact: true }).click()
    await toggle('Wrap long lines').uncheck({ force: true })
    await page.getByRole('radio', { name: 'JSX', exact: true }).click()

    // Highlighted lines and diff.
    await page.getByRole('textbox', { name: 'Highlight lines' }).fill('2, 4-5')
    await expect(block.locator('.a1-code-hl__line--highlight')).toHaveCount(3)
    await page.getByRole('textbox', { name: 'Highlight lines' }).fill('')
    await toggle('Diff').check({ force: true })
    await expect(block.locator('.a1-code-hl__line--added')).toHaveCount(2)
    await expect(block.locator('.a1-code-hl__line--removed')).toHaveCount(2)
    await toggle('Diff').uncheck({ force: true })

    // Palettes switch classes; Monochrome uses weight, not colour.
    await page.getByRole('radio', { name: 'Monochrome', exact: true }).click()
    await expect(block).toHaveClass(/a1-code-hl--mono/)
    assert.equal(await block.locator('.a1-code-hl__token--keyword').first().evaluate(el => getComputedStyle(el).fontWeight), '600')
    assert.equal(await block.evaluate(el => [...el.querySelectorAll('code, code *')].filter(node => getComputedStyle(node).fontStyle === 'italic').length), 0, 'no italics in Monochrome')
    await page.getByRole('radio', { name: 'Full color', exact: true }).click()

    await page.mouse.move(0, 0) // no hover transitions mid-scan
    for (const mode of ['Dark', 'Light']) {
      await page.getByRole('radiogroup', { name: 'Color scheme' }).getByRole('radio', { name: mode, exact: true }).click()
      // Let the mode change's colour transitions (0.2s) settle so axe reads final colours.
      await page.waitForTimeout(600)
      const results = await new AxeBuilder({ page }).include('.a1-code-highlighting-lab').analyze()
      assert.deepEqual(results.violations.map(v => v.id), [], `${mode}: ${JSON.stringify(results.violations.flatMap(v => v.nodes.map(n => [n.html.slice(0, 80), n.any[0]?.data?.contrastRatio, n.any[0]?.data?.fgColor, n.any[0]?.data?.bgColor])))}`)
    }

    // Live editing: text under the caret matches the coloured layer exactly.
    await toggle('Live editing').check({ force: true })
    await expect(toggle('Wrap long lines')).toBeDisabled()
    const input = page.getByRole('textbox', { name: 'Edit the JSX' })
    await input.fill('const message = `A long line to check the caret stays on the coloured text: ${count} items` // tail')
    await expect(stage.locator('.a1-code-hl-editor__layer .a1-code-hl__token--comment')).toHaveText('// tail')
    const drift = await page.evaluate(() => {
      const textarea = document.querySelector('.a1-code-hl-editor__input'), layer = document.querySelector('.a1-code-hl-editor__layer')
      textarea.scrollLeft = 0; layer.scrollLeft = 0
      const style = getComputedStyle(textarea), mirror = document.createElement('span')
      for (const key of ['fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'fontVariantLigatures']) mirror.style[key] = style[key]
      Object.assign(mirror.style, { whiteSpace: 'pre', position: 'absolute', visibility: 'hidden' }); mirror.textContent = textarea.value; document.body.append(mirror)
      const walker = document.createTreeWalker(layer, NodeFilter.SHOW_TEXT); let last
      while (walker.nextNode()) if (walker.currentNode.textContent.trim()) last = walker.currentNode
      const r = document.createRange(); r.setStart(last, last.length - 1); r.setEnd(last, last.length)
      const layerRight = r.getBoundingClientRect().right - layer.getBoundingClientRect().left - parseFloat(getComputedStyle(layer).paddingLeft)
      const width = mirror.getBoundingClientRect().width; mirror.remove()
      return Math.abs(layerRight - width)
    })
    assert.ok(drift < 1, `caret alignment drift ${drift}px`)
    // Selection lets the coloured text show through.
    const selection = await page.evaluate(() => getComputedStyle(document.querySelector('.a1-code-hl-editor__input'), '::selection').backgroundColor)
    assert.match(selection, /color-mix|rgba|\/ 0\.|oklab/, `translucent selection (${selection})`)

    await page.setViewportSize({ width: 390, height: 844 })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no page overflow at 390px')
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
