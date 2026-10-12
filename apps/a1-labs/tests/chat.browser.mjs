import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

test('chat queues local replies, keeps history and supports message styles and motion preferences', async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
    const page = await context.newPage(); const errors = []; page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${origin}/experiments/chat`)
    const chat = page.locator('.a1-chat-study'), log = page.getByRole('log', { name: 'Conversation' })
    const messages = log.locator('.a1-chat-study__message'), field = page.getByRole('textbox', { name: 'Message', exact: true })
    await expect(messages).toHaveCount(3)
    await page.getByRole('slider', { name: 'Reply pace' }).press('Home')
    await field.fill('Try dark mode'); await field.press('Enter')
    await field.fill('More animation'); await field.press('Enter')
    await expect(messages).toHaveCount(7, { timeout: 5000 })
    await expect(field).toBeFocused()
    await expect(log).toContainText('active A1 theme')
    await page.getByRole('radio', { name: 'Avery (person)', exact: true }).press('Space')
    await field.fill('Hello Avery'); await field.press('Enter')
    await expect(messages).toHaveCount(9)
    await expect(messages.last()).toContainText('Avery')
    await page.getByRole('switch', { name: 'Automatic replies' }).press('Space')
    await page.getByRole('slider', { name: 'Animation duration (ms)' }).press('End')
    for (const style of ['Bubbles', 'Soft blocks', 'Outlined', 'Editorial', 'Compact']) {
      await page.getByRole('radio', { name: style, exact: true }).press('Space')
      for (const motion of ['Instant', 'Fade', 'Rise', 'Slide in', 'Pop', 'Unfold']) {
        await page.getByRole('radio', { name: motion, exact: true }).press('Space')
        await field.fill(`${style}: ${motion}`); await field.press('Enter')
        const animations = await messages.last().evaluate(el => el.getAnimations().map(a => a.effect.getTiming().duration))
        assert.equal(animations.length, motion === 'Instant' ? 0 : 1, `${style}/${motion}`)
        if (animations.length) assert.equal(animations[0], 500)
      }
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect.poll(() => messages.last().evaluate(el => el.getAnimations().length)).toBe(0)
    await field.fill('Still message'); await field.press('Enter')
    assert.equal(await messages.last().evaluate(el => el.getAnimations().length), 0)
    await field.fill('First line'); await field.press('Shift+Enter'); await field.press('x')
    await expect(field).toHaveValue('First line\nx')
    await field.fill('   '); await expect(chat.getByRole('button', { name: 'Send message' })).toBeDisabled()
    const results = await new AxeBuilder({ page }).include('.a1-chat-study').disableRules(['color-contrast']).analyze()
    assert.deepEqual(results.violations, [])
    await page.getByRole('switch', { name: 'Automatic replies' }).press('Space')
    const beforeReading = await messages.count()
    await field.fill('Keep my reading position'); await field.press('Enter')
    await log.evaluate(el => { el.scrollTop = 0; el.dispatchEvent(new Event('scroll')) })
    await expect(messages).toHaveCount(beforeReading + 2)
    assert.equal(await log.evaluate(el => el.scrollTop), 0)
    await chat.getByRole('button', { name: 'Latest messages' }).click()
    assert.ok(await log.evaluate(el => el.scrollTop > 0))
    await page.getByRole('slider', { name: 'Reply pace' }).press('End')
    await field.fill('Cancel this reply'); await field.press('Enter')
    await page.getByRole('button', { name: 'Reset conversation' }).click()
    await expect(messages).toHaveCount(3)
    await page.waitForTimeout(3100)
    await expect(messages).toHaveCount(3)
    await page.getByRole('radio', { name: 'Bubbles', exact: true }).press('Space')
    await page.screenshot({ path: '/tmp/labs-chat-desktop.png' })
    for (const width of [390, 640, 800, 1200, 1500]) {
      await page.setViewportSize({ width, height: 1000 })
      assert.ok(await chat.evaluate(el => el.getBoundingClientRect().right <= innerWidth + 1), `fits ${width}`)
    }
    await page.getByRole('radio', { name: 'Light', exact: true }).press('Space')
    await page.setViewportSize({ width: 390, height: 1000 })
    await page.screenshot({ path: '/tmp/labs-chat-mobile.png' })
    await page.goto(`${origin}/about`)
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
