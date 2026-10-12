import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Run with the Labs dev server: node --test apps/a1-labs/tests/flip-clock.browser.mjs
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'
test('physical clock ticks, rolls over, pauses, reduces motion and fits the shell', async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] })
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'America/New_York' })
    const page = await context.newPage(), errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.clock.install({ time: new Date('2026-10-11T10:08:07-04:00') })
    await page.goto(`${origin}/experiments/flip-clock`)
    const timer = page.getByRole('timer'), canvas = page.locator('.a1-flip-clock canvas')
    await expect(canvas).toBeVisible()
    await expect(timer).toHaveText(/^10:08:\d{2}$/)
    await page.clock.pauseAt(new Date('2026-10-11T10:09:00-04:00'))
    await page.getByRole('button', { name: 'Preview midnight rollover' }).click()
    await expect(timer).toHaveText('23:59:57')
    await page.clock.runFor(3000)
    await expect(timer).toHaveText('00:00:00')
    await page.clock.runFor(120)
    await expect(canvas).toHaveAttribute('data-flipping', 'true')
    const reset = await canvas.getAttribute('data-characters')
    assert.match(reset, /^[0-9]{6}$/)
    assert.ok(Number(reset[5]) > 0 && Number(reset[5]) < 9, '9 resets through intermediate cards')
    assert.ok(Number(reset[4]) > 0 && Number(reset[4]) < 5, '5 resets through intermediate cards')
    await page.screenshot({ path: '/tmp/flip-clock-turn.png' })
    await page.getByRole('button', { name: 'Pause clock', exact: true }).click()
    await page.clock.runFor(2000)
    await expect(timer).toHaveText('00:00:00')
    await expect(canvas).toHaveAttribute('data-flipping', 'false')
    await expect(canvas).toHaveAttribute('data-characters', '000000')
    const stationWidth = (await canvas.boundingBox()).width
    await page.getByRole('radio', { name: 'Compact cards', exact: true }).press('Space')
    await page.clock.runFor(100)
    await expect(page.locator('.a1-flip-clock')).toHaveAttribute('data-variant', 'compact')
    assert.ok((await canvas.boundingBox()).width < stationWidth, 'compact cards use a smaller stage')
    await expect(timer).toHaveText('00:00:00')
    await page.screenshot({ path: '/tmp/flip-clock-compact.png' })
    await page.getByRole('radio', { name: '12 hour', exact: true }).click()
    await expect(timer).toHaveText('12:00:00 a.m.')
    await page.getByRole('switch', { name: 'White cards' }).press('Space')
    await page.clock.runFor(100)
    await page.screenshot({ path: '/tmp/flip-clock-white.png' })
    await page.getByRole('switch', { name: 'Show seconds' }).press('Space')
    await expect(timer).toHaveText('12:00 a.m.')
    await page.getByRole('switch', { name: 'Show seconds' }).press('Space')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.getByRole('button', { name: 'Resume clock', exact: true }).click()
    await page.clock.runFor(1120)
    await expect(timer).toHaveText('12:00:01 a.m.')
    await expect(canvas).toHaveAttribute('data-flipping', 'false')
    await page.getByRole('button', { name: 'Return to local time' }).click()
    await page.clock.resume()
    await expect(page.getByText('Local time', { exact: true })).toBeVisible()
    for (const variant of ['Compact cards', 'Station clock']) {
      await page.getByRole('radio', { name: variant, exact: true }).press('Space')
      for (const width of [390, 600, 820, 1200, 1600]) {
        await page.setViewportSize({ width, height: 900 })
        await page.clock.runFor(100)
        const bounds = await canvas.boundingBox()
        assert.ok(bounds.width > 0 && bounds.x >= 0 && bounds.x + bounds.width <= width, `${width}px canvas fits`)
        await expect.poll(() => page.locator('.a1-flip-clock__stage').evaluate(stage => {
          const rect = stage.getBoundingClientRect()
          return Math.abs(rect.height - rect.width / (stage.closest('[data-variant]').dataset.variant === 'compact' ? 3 : 16 / 9))
        })).toBeLessThan(1)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
      }
    }
    const results = await new AxeBuilder({ page }).include('.a1-flip-clock').analyze()
    assert.deepEqual(results.violations, [])
    await canvas.evaluate(c => c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext())
    await expect(page.getByText('The 3D preview is unavailable.', { exact: false })).toBeVisible()
    await expect(timer).toBeVisible()
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
