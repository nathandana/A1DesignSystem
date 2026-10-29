import { expect, test } from '@playwright/test'

async function readJson(page) {
  await page.getByRole('radio', { name: 'JSON', exact: true }).click()
  const field = page.getByRole('textbox', { name: 'Edit code', exact: true })
  await expect(field).toHaveValue(/"Button"/)
  return JSON.parse(await field.inputValue())
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('a1-web-locale', 'en')
    localStorage.setItem('a1-web-theme', 'a1Light')
  })
})

test('Split Button renders alone, uses toolbar sizes, and matches standard Button padding', async ({ page }) => {
  await page.goto('/components/button')
  await expect(page.getByRole('button', { name: 'Split (menu)', exact: true })).toHaveCount(0)
  const standard = {}
  const framePadding = await page.getByRole('button', { name: 'Save changes', exact: true }).evaluate(el => getComputedStyle(el.closest('.a1-section')).padding)
  expect(parseFloat(framePadding)).toBeGreaterThan(0)
  for (const size of ['Small', 'Default', 'Large']) {
    await page.getByRole('toolbar', { name: 'Size', exact: true }).getByRole('radio', { name: size, exact: true }).click()
    standard[size] = await page.getByRole('button', { name: 'Save changes', exact: true }).evaluate(el => {
      const css = getComputedStyle(el)
      return { height: el.getBoundingClientRect().height, padding: css.padding, font: css.fontSize }
    })
  }
  await page.goto('/components/split-button')
  const split = page.locator('.a1-split-button')
  await expect(split).toBeVisible()
  expect(await split.evaluate(el => getComputedStyle(el.closest('.a1-section')).padding)).toBe(framePadding)
  // Same preview wrapper as Button, with no generic icon, heading or description.
  await expect(split.locator('..').locator('h1,h2,h3,p')).toHaveCount(0)
  await expect(split.locator('..').locator(':scope > *')).toHaveCount(1)
  for (const size of ['Small', 'Default', 'Large']) {
    await page.getByRole('toolbar', { name: 'Size', exact: true }).getByRole('radio', { name: size, exact: true }).click()
    const result = await split.locator('.a1-split-button__main').evaluate(el => {
      const css = getComputedStyle(el)
      return { height: el.getBoundingClientRect().height, padding: css.padding, font: css.fontSize }
    })
    expect(result).toEqual(standard[size])
    expect(await split.locator('.a1-split-button__toggle').evaluate(el => el.getBoundingClientRect().height)).toBe(result.height)
  }
  expect(standard.Large.height).toBeGreaterThan(standard.Default.height)
  expect(standard.Default.height).toBeGreaterThan(standard.Small.height)
  await page.getByRole('toolbar', { name: 'Variant', exact: true }).getByRole('radio', { name: 'Secondary', exact: true }).click()
  await expect(split.locator('.a1-split-button__main')).toHaveClass(/a1-button--secondary/)
})

test('secondary actions appear by default and edits survive preview, JSON and code export', async ({ page }) => {
  await page.goto('/components/split-button')
  const split = page.locator('.a1-split-button')
  await split.getByRole('button', { name: 'More actions', exact: true }).click()
  const menu = page.getByRole('dialog', { name: 'More actions', exact: true })
  for (const label of ['Save as draft', 'Save as template', 'Duplicate']) await expect(menu.getByRole('button', { name: label, exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await page.getByRole('textbox', { name: 'Menu action 1', exact: true }).fill('Save a copy')
  await page.getByRole('button', { name: 'Remove menu action 2', exact: true }).click()
  await page.getByRole('button', { name: 'Add menu action', exact: true }).click()
  await page.getByRole('textbox', { name: 'Menu action 3', exact: true }).fill('Export document')
  const node = await readJson(page)
  expect(node.props.split).toBe(true)
  expect(node.props.menuActions.map(action => action.label)).toEqual(['Save a copy', 'Duplicate', 'Export document'])
  await page.getByRole('radio', { name: 'Code', exact: true }).click()
  const code = page.locator('code').filter({ hasText: '<SplitButton' }).first()
  await expect(code).toContainText('Export document')
  await page.goto(`/components/split-button?json=${encodeURIComponent(JSON.stringify(node))}`)
  await split.getByRole('button', { name: 'More actions', exact: true }).click()
  await expect(menu.getByRole('button', { name: 'Save a copy', exact: true })).toBeVisible()
  await expect(menu.getByRole('button', { name: 'Export document', exact: true })).toBeVisible()
  await expect(menu.getByRole('button', { name: 'Save as template', exact: true })).toHaveCount(0)
})

test('component search matches reordered partial words', async ({ page }) => {
  await page.goto('/components/button')
  const sidebar = page.locator('.a1-web-components-tree')
  for (const query of ['button spl', 'spl button', 'split but']) {
    await sidebar.getByRole('searchbox').fill(query)
    await expect(sidebar.locator('[data-tree-id="component-split-button"]')).toBeVisible()
  }
  await sidebar.locator('[data-tree-id="component-split-button"]').click()
  await expect(page).toHaveURL(/\/components\/split-button$/)
  await expect(page.locator('.a1-split-button')).toBeVisible()
})
