import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'

// Start the Labs dev server, then run:
// node --test apps/a1-labs/tests/image-generation.browser.mjs
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

test('zero radius keeps both renderers, playback and the final image working', async () => {
  const browser = await chromium.launch()
  try {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      for (const style of ['Discs', 'Glowing Blob']) {
        const page = await browser.newPage({ reducedMotion, viewport: { width: 1440, height: 1000 } })
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        await page.clock.install()
        await page.goto(`${origin}/experiments/ai-image-generation`)
        await page.getByRole('radio', { name: style, exact: true }).click()
        const radius = page.getByRole('slider', { name: 'Border radius', exact: true })
        await radius.press('Home')
        await radius.press('ArrowRight')
        await expect(radius).toHaveAttribute('aria-valuetext', '0 pixels')
        await page.getByRole('slider', { name: 'Duration', exact: true }).press('Home')
        const canvas = page.locator('.a1-image-generation__canvas')
        const progress = page.getByRole('progressbar', { name: 'Animation progress' })
        await expect(progress).toHaveAttribute('aria-valuenow', /\d+/)
        await page.clock.runFor(800)
        await page.getByRole('button', { name: 'Pause', exact: true }).click()
        const percent = await progress.getAttribute('aria-valuenow')
        assert.ok(Number(percent) > 0 && Number(percent) < 100)

        // Every width must redraw without erasing the paused artwork or progress.
        const width = page.getByRole('slider', { name: 'Border width', exact: true })
        await width.press('Home')
        for (let detent = 0; detent <= 4; detent++) {
          if (detent) await width.press('ArrowRight')
          const frame = await canvas.evaluate(async canvas => {
            const { readVisuals } = await import('/src/image-generation/renderer.js')
            const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
            const colors = new Set()
            for (let i = 0; i < pixels.length; i += 4 * 101) {
              if (pixels[i + 3]) colors.add(`${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`)
            }
            return { radius: readVisuals(canvas).radius, colors: colors.size }
          })
          assert.equal(frame.radius, 0)
          assert.ok(frame.colors > 4, 'the canvas still contains developing artwork')
          await expect(progress).toHaveAttribute('aria-valuenow', percent)
        }
        await page.getByRole('button', { name: 'Resume', exact: true }).click()
        await page.clock.runFor(4000)
        await expect(canvas).toHaveAttribute('aria-busy', 'false')
        await expect(canvas).toHaveAttribute('aria-label', /^Completed preview:/)
        await expect(progress).toHaveAttribute('aria-valuenow', '100')
        assert.equal(await canvas.evaluate(c => c.getContext('2d').getImageData(0, 0, 1, 1).data[3]), 255,
          'the completed image fills the square corner after the border disappears')
        await radius.press('Home')
        await expect(radius).toHaveAttribute('aria-valuetext', 'Theme default')
        await expect(canvas).not.toHaveCSS('border-radius', '0px')
        assert.deepEqual(errors, [])
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }
})
