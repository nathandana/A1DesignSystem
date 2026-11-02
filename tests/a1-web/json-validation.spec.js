import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const definition = (variant = 'primary') => ({
  schemaVersion: '1.1.0',
  page: { id: 'validation-page', name: 'Validation page', layout: { type: 'PageLayout', regions: [
    { id: 'main', nodes: [{ id: 'validated-button', type: 'Button', props: { variant }, content: { fallback: 'Validated action' } }] },
  ] } },
})

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('a1-web-theme', 'a1Light')
    localStorage.setItem('a1-web-color-mode', 'light')
    localStorage.setItem('a1-web-locale', 'en')
  })
})

test('import validation blocks invalid props, preserves drafts and enables repaired JSON across themes and widths', async ({ page }) => {
  await page.goto('/projects')
  await page.getByRole('button', { name: 'Upload JSON', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Upload project from JSON' })
  const editor = dialog.locator('textarea')
  const importButton = dialog.getByRole('button', { name: 'Import project', exact: true })
  await expect(importButton).toBeEnabled()
  const invalid = JSON.stringify(definition('prominent'), null, 2)
  await editor.fill(invalid)
  await expect(importButton).toBeDisabled()
  await expect(dialog.getByText(/\/props\/variant: Use a value allowed by the contract/)).toBeVisible()
  await expect(editor).toHaveValue(invalid)
  for (const theme of ['', 'a1-theme-light', 'a1-theme-accessible', 'a1-theme-heritage']) {
    await page.evaluate(theme => {
      document.documentElement.classList.remove('a1-theme-light', 'a1-theme-accessible', 'a1-theme-heritage')
      if (theme) document.documentElement.classList.add(theme)
    }, theme)
    for (const width of [375, 560, 768, 1280, 1536]) {
      await page.setViewportSize({ width, height: 900 })
      await expect(importButton).toBeDisabled()
      const box = await dialog.boundingBox()
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1)
    }
  }
  await editor.fill('{')
  await expect(dialog.getByText(/Provide valid JSON/)).toBeVisible()
  await expect(editor).toHaveValue('{')
  await editor.fill(JSON.stringify(definition()))
  await expect(importButton).toBeEnabled()
  const scan = await new AxeBuilder({ page }).include('dialog[open]').analyze()
  expect(scan.violations.filter(v => ['critical', 'serious'].includes(v.impact))).toEqual([])
})

test('page editor validates stored JSON and displays a repaired page', async ({ page }) => {
  await page.goto('/')
  async function seed(document) {
    await page.evaluate(document => {
      localStorage.setItem('a1-projects', JSON.stringify([{ id: 'validation-project', name: 'Validation project', createdAt: 1, updatedAt: 1 }]))
      localStorage.setItem('a1-project-validation-project-pages', JSON.stringify([{ id: 'validation-page', title: 'Validation page', parentId: null, order: 0 }]))
      localStorage.setItem('a1-editor-versions-validation-page', JSON.stringify({ versions: [{ id: 'v1', label: 'Base', json: JSON.stringify(document) }], activeVersionId: 'v1' }))
      localStorage.removeItem('a1-editor-history-validation-page')
    }, document)
  }
  await seed(definition('prominent'))
  await page.goto('/editor?project=validation-project&doc=validation-page')
  await expect(page.getByText(/\/props\/variant: Use a value allowed by the contract/).first()).toBeVisible()
  await expect(page.locator('[data-editor-node="validated-button"]')).toHaveCount(0)
  await page.getByRole('radio', { name: 'Code snippet', exact: true }).click()
  await page.locator('main textarea').fill(JSON.stringify(definition(), null, 2))
  await page.getByRole('radio', { name: 'Edit', exact: true }).click()
  await expect(page.locator('[data-editor-node="validated-button"]')).toBeVisible()
})

test('imported project links use project context in the page editor', async ({ page }) => {
  const home = definition()
  home.page.layout.regions[0].nodes[0].props.href = '/?page=about'
  await page.goto('/projects')
  await page.getByRole('button', { name: 'Upload JSON', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Upload project from JSON' })
  await dialog.locator('textarea').fill(JSON.stringify({
    name: 'Reference context regression',
    pages: [{ id: 'home', title: 'Home', definition: home }, { id: 'about', title: 'About' }],
  }))
  await dialog.getByRole('button', { name: 'Import project', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await page.getByRole('button', { name: 'Home · LG', exact: true }).dblclick()
  await expect(page.locator('[data-editor-node="validated-button"]')).toBeVisible()
  await expect(page.getByText(/Validate the project bundle to check this page reference/)).toHaveCount(0)
  await page.getByRole('radio', { name: 'Code snippet', exact: true }).click()
  home.page.layout.regions[0].nodes[0].props.href = '/?page=missing'
  await page.locator('main textarea').fill(JSON.stringify(home))
  await page.getByRole('radio', { name: 'Edit', exact: true }).click()
  await expect(page.getByText(/\/props\/href: Reference an existing page or node/).first()).toBeVisible()
})
