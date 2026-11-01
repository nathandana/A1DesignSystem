import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('generated configurator presentation preserves values and reloads overrides', async ({ page }) => {
  await page.goto('/components/button?tab=configurator-editor')
  await expect(page.getByRole('heading', { name: 'Configurator editor', exact: true })).toBeVisible()
  await expect(page.getByText('This property needs a custom editor because its contract type is not supported by the generated renderer.').first()).toBeAttached()

  const fullWidthEditor = page.getByRole('button', { name: /^fullWidth/ }).first()
  await fullWidthEditor.click()
  const presentation = page.getByRole('region', { name: 'fullWidth' }).getByLabel('Control presentation')
  await expect(presentation).toHaveValue('switch')

  await page.getByRole('switch', { name: /^fullWidth/ }).check({ force: true })
  await presentation.selectOption('toggle')
  await expect(page.locator('.a1-toolbar [aria-pressed="true"][aria-label="fullWidth"]')).toBeVisible()
  await expect(page.getByText('"control": "toggle"', { exact: false })).toBeVisible()

  await page.getByRole('button', { name: 'Save presentation', exact: true }).click()
  await expect(page.getByText('Configurator presentation saved in this browser.', { exact: true })).toBeVisible()
  await page.reload()
  await page.getByRole('button', { name: /^fullWidth/ }).first().click()
  await expect(page.getByRole('region', { name: 'fullWidth' }).getByLabel('Control presentation')).toHaveValue('toggle')

  const accessibility = await new AxeBuilder({ page }).include('main').analyze()
  expect(accessibility.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact))).toEqual([])
})
