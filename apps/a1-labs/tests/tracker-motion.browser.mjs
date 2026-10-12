import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

test('tracker transitions animate position, cancel on preference/configuration changes and retain semantics', async () => {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    const errors = []; page.on('pageerror', e => errors.push(e.message))
    await page.goto(`${origin}/experiments/step-tracker`)
    const tracker = page.locator('.a1-tracker-study')
    const next = page.getByRole('button', { name: 'Next', exact: true }), back = page.getByRole('button', { name: 'Back', exact: true })
    await page.getByRole('slider', { name: 'Transition duration (ms)' }).press('End')
    const finish = () => tracker.evaluate(e => e.getAnimations({ subtree: true }).forEach(a => a.finish()))
    for (const treatment of ['A1 default', 'Rings', 'Segments', 'Ticks', 'Numbers', 'Spotlight']) {
      await page.getByRole('radio', { name: treatment, exact: true }).press('Space')
      for (const transition of ['Standard', 'Instant', 'Fade', 'Slide', 'Pop', 'Bounce', 'Ripple']) {
        await page.getByRole('radio', { name: transition, exact: true }).press('Space')
        await finish()
        await next.click()
        await expect(tracker).toHaveAccessibleName('Step 3 of 5')
        const animations = await tracker.evaluate(e => e.getAnimations({ subtree: true }).map(a => ({ duration: a.effect.getTiming().duration, frames: a.effect.getKeyframes() })))
        if (transition === 'Instant') assert.equal(animations.length, 0)
        else {
          assert.ok(animations.length > 0, `${treatment}/${transition} is animated`)
          assert.ok(animations.every(a => a.duration === 500))
        }
        await finish()
        await back.click(); await finish()
        await expect(tracker).toHaveAccessibleName('Step 2 of 5')
      }
    }
    await next.click()
    await expect(tracker.locator('.a1-tracker-study__ripple')).toHaveCount(1)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(tracker.locator('.a1-tracker-study__ripple')).toHaveCount(0)
    assert.equal(await tracker.evaluate(e => e.getAnimations({ subtree: true }).length), 0)
    await next.click()
    await expect(tracker).toHaveAccessibleName('Step 4 of 5')
    assert.equal(await tracker.evaluate(e => e.getAnimations({ subtree: true }).length), 0)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.getByRole('radio', { name: 'Slide', exact: true }).press('Space')
    await back.click(); await next.click()
    await finish(); await expect(tracker).toHaveAccessibleName('Step 4 of 5')
    await back.click()
    await page.emulateMedia({ forcedColors: 'active' })
    assert.equal(await tracker.evaluate(e => e.getAnimations({ subtree: true }).length), 0)
    await page.emulateMedia({ forcedColors: 'none' })
    await next.click()
    await page.getByRole('radio', { name: 'Instant', exact: true }).press('Space')
    assert.equal(await tracker.evaluate(e => e.getAnimations({ subtree: true }).length), 0)
    await page.setViewportSize({ width: 390, height: 900 })
    await expect(tracker).toHaveAccessibleName('Step 4 of 5')
    assert.ok(await tracker.evaluate(e => e.getBoundingClientRect().right <= innerWidth))
    await page.goto(`${origin}/about`)
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
