import test from 'node:test'
import { chromium, expect } from '@playwright/test'
const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

test('header button, slash and Cmd/Ctrl+K open sitewide search; typing is never intercepted', async () => {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    await page.goto(origin)
    const overlay = page.getByRole('dialog', { name: 'Search Labs' })
    const query = overlay.getByRole('searchbox', { name: 'Search Labs' })

    // Header button opens the overlay; Escape returns focus to it.
    const button = page.getByRole('button', { name: 'Search Labs' })
    await button.click()
    await expect(query).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(overlay).toBeHidden(); await expect(button).toBeFocused()

    // "/" searches all of Labs, not the page filter.
    await page.locator('h1').click(); await page.keyboard.press('/')
    await expect(query).toBeFocused(); await expect(query).toHaveValue('')
    await query.fill('flip clock')
    await expect(overlay.getByRole('button', { name: /Flip clock/i }).first()).toBeVisible()
    await query.fill('about')
    await expect(overlay.getByRole('button', { name: /About Labs/ })).toBeVisible()
    await query.fill('qxqzv')
    await expect(overlay.getByText('No matching results')).toBeVisible()
    // As in a1-web: Escape clears a typed query first, then closes.
    await page.keyboard.press('Escape'); await expect(query).toHaveValue('')
    await page.keyboard.press('Escape'); await expect(overlay).toBeHidden()


    // Cmd/Ctrl+K also opens it; choosing a result navigates.
    await page.locator('h1').click(); await page.keyboard.press('ControlOrMeta+k')
    await expect(query).toBeFocused()
    await query.fill('focus state'); await query.press('Enter')
    await expect(page).toHaveURL(/\/experiments\/focus-animations$/)

    // Experiment pages: same overlay; form fields keep "/".
    const name = page.getByRole('textbox', { name: 'Name', exact: true })
    await name.fill('A'); await name.press('End'); await page.keyboard.type('/')
    await expect(name).toHaveValue('A/'); await expect(overlay).toBeHidden()
    const trigger = page.getByRole('button', { name: 'Try focus', exact: true })
    await trigger.focus(); await page.keyboard.press('/')
    await expect(query).toBeFocused()
    await page.keyboard.press('Escape'); await expect(trigger).toBeFocused()

    // Mobile: the header button is still there.
    await page.setViewportSize({ width: 390, height: 900 })
    await page.getByRole('button', { name: 'Search Labs' }).click()
    await expect(query).toBeFocused()
    await page.keyboard.press('Escape')

    // Keys from a preview iframe portal reach the shortcut.
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(`${origin}/experiments/billboard-actions`)
    const action = page.frameLocator('iframe').getByRole('link', { name: /Find your next experiment/ })
    await action.focus(); await action.press('/')
    await expect(query).toBeFocused()
  } finally { await browser.close() }
})
