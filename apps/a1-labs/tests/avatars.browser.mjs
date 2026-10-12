import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

test('avatars: content, size, radius, status, fallback, break the frame and group', async () => {
  const browser = await chromium.launch()
  try {
    const page = await (await browser.newContext({ viewport: { width: 1440, height: 1100 } })).newPage()
    page.setDefaultTimeout(10000)
    const errors = []; page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${origin}/experiments/avatars`)
    const stage = page.locator('.a1-avatars-lab')
    const profile = stage.getByRole('img', { name: 'Nathan Dana, Online' }).first()
    await expect(profile).toHaveClass(/a1-avatar-lab--xl/)
    await expect(profile.locator('img')).toHaveAttribute('alt', '')
    // Teammates have no photo: Image content falls back to initials.
    await expect(stage.getByRole('img', { name: 'Sam Rivera, Away' }).first()).toContainText('SR')

    // Size and radius come from the sliders; each size is in the strip.
    const slider = name => page.getByRole('slider', { name, exact: true })
    await slider('Size').press('Home')
    await expect(profile).toHaveClass(/a1-avatar-lab--xs/)
    await expect(stage.getByRole('listitem').filter({ has: page.locator('.a1-avatar-lab') })).toHaveCount(5 + 4)
    await slider('Radius').press('Home')
    await expect(profile).toHaveClass(/a1-avatar-lab--radius-none/)
    assert.equal(await profile.locator('.a1-avatar-lab__frame').evaluate(el => getComputedStyle(el).borderTopLeftRadius), '0px')
    await slider('Radius').press('End'); await slider('Size').press('End')

    // Content types.
    await page.getByRole('radio', { name: 'Initials' }).click()
    await expect(profile).toContainText('ND')
    await page.getByRole('radio', { name: '1 letter', exact: true }).click()
    await expect(profile).toHaveText('N')
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Ada Lovelace')
    await expect(stage.getByRole('img', { name: 'Ada Lovelace, Online' }).first()).toHaveText('A')
    await page.getByRole('radio', { name: 'Pattern' }).click()
    await expect(stage.getByRole('img', { name: 'Ada Lovelace, Online' }).first().locator('.a1-avatar-lab__cell')).toHaveCount(25)
    await page.getByRole('radio', { name: 'Icon' }).click()
    await expect(stage.getByRole('img', { name: 'Ada Lovelace, Online' }).first().locator('.a1-icon')).toHaveCount(1)
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Nathan Dana')

    // Status: removing it drops it from the name and the visible text.
    await page.getByRole('combobox', { name: 'Status' }).selectOption('')
    await expect(stage.getByRole('img', { name: 'Nathan Dana', exact: true }).first()).toBeVisible()
    await expect(stage.locator('.a1-avatar-lab__status')).toHaveCount(0)
    await page.getByRole('combobox', { name: 'Status' }).selectOption('busy')

    // Break the frame needs Image content; the cut-out rises above the frame.
    const popOut = page.getByRole('switch', { name: 'Break the frame' })
    await expect(popOut).toBeDisabled()
    await page.getByRole('radio', { name: 'Image' }).click()
    await popOut.check({ force: true })
    const busy = stage.getByRole('img', { name: 'Nathan Dana, Busy' }).first()
    await expect(busy).toHaveClass(/a1-avatar-lab--pop-out/)
    const rise = await busy.evaluate(el => el.querySelector('img').getBoundingClientRect().top - el.getBoundingClientRect().top)
    assert.ok(rise < 0, 'portrait rises above the frame')

    // Group: four avatars, then "+4"; pop-out and status are not used there.
    const group = stage.getByRole('group', { name: 'Project team, 8 people' })
    await expect(group.getByRole('img')).toHaveCount(5)
    await expect(group.getByRole('img', { name: '4 more' })).toHaveText('+4')
    await expect(group.locator('.a1-avatar-lab--pop-out, .a1-avatar-lab__status')).toHaveCount(0)

    // A broken image falls back to initials.
    await page.route('**/avatars/portrait-cutout.png', route => route.abort())
    await page.reload()
    await page.getByRole('switch', { name: 'Break the frame' }).check({ force: true })
    await expect(stage.getByRole('img', { name: 'Nathan Dana, Online' }).first()).toContainText('ND')
    await page.unroute('**/avatars/portrait-cutout.png')

    for (const border of ['Ring', 'Gradient']) {
      await page.getByRole('radio', { name: border, exact: true }).click()
      const results = await new AxeBuilder({ page }).include('.a1-avatars-lab').analyze()
      assert.deepEqual(results.violations.map(v => v.id), [], border)
    }
    await page.setViewportSize({ width: 390, height: 844 })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow at 390px')
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
