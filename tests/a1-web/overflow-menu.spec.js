import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { themeOptions, themeClassName } from '../../apps/a1-web/src/lib/appThemes.ts'
import { createPatternNode, getPatternManifest } from '../../packages/react/src/patterns/patternPolicies.js'

const manifest = getPatternManifest('OverflowMenu')
const example = createPatternNode('OverflowMenu', { id: 'record-menu', props: manifest.examples[0].props })
const trigger = page => page.locator('.a1-overflow-menu')
const menu = page => page.getByRole('dialog', { name: 'More actions', exact: true })
const verification = page => page.getByRole('dialog', { name: 'Delete item?', exact: true })
async function configure(page, node = example) {
  await page.goto(`/pattern-library/overflow-menu?json=${encodeURIComponent(JSON.stringify(node))}`)
  await expect(trigger(page)).toBeVisible()
}
async function json(page) {
  await page.getByRole('radio', { name: 'JSON', exact: true }).click()
  return JSON.parse(await page.getByRole('textbox', { name: 'Edit code', exact: true }).inputValue())
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('a1-web-theme', 'a1Light')
    localStorage.setItem('a1-web-color-mode', 'light')
    localStorage.setItem('a1-web-locale', 'en')
  })
})

test('the default example configures Edit, Duplicate and verified Delete without a load button', async ({ page }) => {
  await page.goto('/pattern-library/overflow-menu')
  await expect(trigger(page)).toBeEnabled()
  await expect(page.getByRole('button', { name: /Load.*example/ })).toHaveCount(0)
  expect((await json(page)).props.actions).toEqual(example.props.actions)
  await expect(trigger(page)).toContainText('more_vert')
  await configure(page, createPatternNode('OverflowMenu'))
  await expect(trigger(page)).toBeDisabled()
  expect((await json(page)).props.actions).toBeUndefined()
})

test('actions run immediately or only after confirmation; cancel and Escape never run Delete', async ({ page }) => {
  await configure(page)
  await trigger(page).focus()
  await page.keyboard.press('ArrowDown')
  await expect(menu(page)).toBeVisible()
  await menu(page).getByRole('button', { name: 'Edit', exact: true }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Edit selected.' })).toBeVisible()
  await expect(trigger(page)).toBeFocused()
  await trigger(page).click()
  await menu(page).getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(verification(page)).toBeVisible()
  await expect(menu(page)).not.toBeVisible()
  await expect(verification(page).getByRole('button', { name: 'Cancel', exact: true })).toBeFocused()
  await expect(page.getByRole('status').filter({ hasText: 'Delete selected.' })).toHaveCount(0)
  await verification(page).getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(trigger(page)).toBeFocused()
  await trigger(page).click()
  await menu(page).getByRole('button', { name: 'Delete', exact: true }).click()
  await page.keyboard.press('Escape')
  await expect(verification(page)).not.toBeVisible()
  await expect(trigger(page)).toBeFocused()
  await expect(page.getByRole('status').filter({ hasText: 'Delete selected.' })).toHaveCount(0)
  await trigger(page).click()
  await menu(page).getByRole('button', { name: 'Delete', exact: true }).click()
  const scan = await new AxeBuilder({ page }).include('.a1-dialog[open]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  expect(scan.violations).toEqual([])
  await verification(page).getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Delete selected.' })).toBeVisible()
  await expect(trigger(page)).toBeFocused()
})

test('any action can enable verification and authored metadata survives form and JSON edits', async ({ page }) => {
  const source = structuredClone(example)
  source.props.actions[0].metadata = { command: 'editRecord', recordId: 'record-4' }
  source.a11y = { describedBy: 'record-caption' }
  source.props.actions[2].verification.children[0].children = [{ id: 'delete-help', type: 'Paragraph', content: { fallback: 'Additional context', textKey: 'delete.help' } }]
  await configure(page, source)
  await page.getByRole('button', { name: 'Edit', exact: true }).click() // Action configurator accordion.
  await page.getByRole('switch', { name: 'Verify before action', exact: true }).first().focus()
  await page.keyboard.press('Space')
  await expect(page.getByRole('switch', { name: 'Verify before action', exact: true }).first()).toBeChecked()
  await page.getByRole('textbox', { name: 'Verification title', exact: true }).first().fill('Edit this record?')
  await page.getByRole('textbox', { name: 'Verification message', exact: true }).first().fill('Editing will open the record form.')
  const exported = await json(page)
  expect(exported.id).toBe(source.id)
  expect(exported.a11y).toEqual(source.a11y)
  expect(exported.props.actions[0].metadata).toEqual(source.props.actions[0].metadata)
  expect(exported.props.actions[0].verification.props.title).toBe('Edit this record?')
  expect(exported.props.actions.slice(1)).toEqual(source.props.actions.slice(1))
  expect(exported.props.actions[0].verification.type).toBe('VerificationDialog')
  await page.getByRole('radio', { name: 'Code', exact: true }).click()
  await expect(page.locator('code').filter({ hasText: '<OverflowMenu' }).first()).toContainText('<VerificationDialog')
  await expect(page.locator('code').filter({ hasText: '<OverflowMenu' }).first()).toContainText('Additional context')
  await trigger(page).click()
  await menu(page).getByRole('button', { name: 'Edit', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Edit this record?', exact: true })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Edit', exact: true }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Edit selected.' })).toBeVisible()
})

test('verified navigation waits for confirmation and disabled actions cannot activate', async ({ page }) => {
  const node = structuredClone(example)
  node.props.actions[0].disabled = true
  node.props.actions[2].href = '#deleted'
  await page.goto(`/playground?json=${encodeURIComponent(JSON.stringify({ nodes: [node] }))}`)
  await trigger(page).click()
  await expect(menu(page).getByRole('button', { name: 'Edit', exact: true })).toBeDisabled()
  await menu(page).getByRole('button', { name: 'Delete', exact: true }).click()
  expect(new URL(page.url()).hash).toBe('')
  await verification(page).getByRole('button', { name: 'Cancel', exact: true }).click()
  expect(new URL(page.url()).hash).toBe('')
  await trigger(page).click()
  await menu(page).getByRole('button', { name: 'Delete', exact: true }).click()
  await verification(page).getByRole('button', { name: 'Delete', exact: true }).click()
  expect(new URL(page.url()).hash).toBe('#deleted')
})

test('menus and verification dialogs fit supported themes and breakpoints', async ({ page }) => {
  await page.goto(`/playground?json=${encodeURIComponent(JSON.stringify({ nodes: [example] }))}`)
  for (const theme of themeOptions.flatMap(option => ['light', 'dark'].map(mode => ({ className: themeClassName(option.value), mode })))) {
    await page.evaluate(theme => {
      document.documentElement.classList.remove(...Array.from(document.documentElement.classList).filter(value => value.startsWith('a1-theme-')))
      document.documentElement.classList.add(`a1-theme-${theme.mode}`)
      if (theme.className) document.documentElement.classList.add(theme.className)
    }, theme)
    for (const width of [375, 560, 768, 1280, 1536]) {
      await page.setViewportSize({ width, height: 900 })
      await trigger(page).click()
      const bounds = await menu(page).boundingBox()
      expect(bounds.x).toBeGreaterThanOrEqual(0)
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1)
      await menu(page).getByRole('button', { name: 'Delete', exact: true }).click()
      const dialog = await verification(page).boundingBox()
      expect(dialog.x).toBeGreaterThanOrEqual(0)
      expect(dialog.x + dialog.width).toBeLessThanOrEqual(width + 1)
      await page.keyboard.press('Escape')
      await expect(trigger(page)).toBeFocused()
    }
  }
  await page.evaluate(() => { document.documentElement.className = 'a1-theme-light' })
  await trigger(page).click()
  const scan = await new AxeBuilder({ page }).include('.a1-menu[open]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  expect(scan.violations).toEqual([])
  await page.screenshot({ path: 'test-results/a1-web/overflow-menu.png' })
})

test('the project editor configures per-action verification and renders it in preview', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(node => {
    const definition = { schemaVersion: '1.1.0', page: { id: 'overflow-page', name: 'Overflow page', layout: { type: 'PageLayout', regions: [{ id: 'main', nodes: [node] }] } } }
    localStorage.setItem('a1-projects', JSON.stringify([{ id: 'overflow-project', name: 'Overflow project', createdAt: 1, updatedAt: 1 }]))
    localStorage.setItem('a1-project-overflow-project-pages', JSON.stringify([{ id: 'overflow-page', title: 'Overflow page', parentId: null, order: 0 }]))
    localStorage.setItem('a1-editor-versions-overflow-page', JSON.stringify({ versions: [{ id: 'v1', label: 'Base', json: JSON.stringify(definition) }], activeVersionId: 'v1' }))
  }, example)
  await page.goto('/editor?project=overflow-project&doc=overflow-page')
  await page.locator('[data-editor-node="record-menu"]').click()
  await page.getByRole('textbox', { name: 'Trigger label', exact: true }).fill('Record actions')
  await page.getByRole('button', { name: 'Duplicate', exact: true }).click()
  const actionControls = page.getByRole('region', { name: 'Duplicate', exact: true })
  const verify = actionControls.getByRole('switch', { name: 'Verify before action', exact: true })
  await verify.focus()
  await page.keyboard.press('Space')
  await expect(verify).toBeChecked()
  await actionControls.getByRole('textbox', { name: 'Verification message', exact: true }).fill('Create a copy of this record.')
  await page.getByRole('radio', { name: 'Preview', exact: true }).click()
  await trigger(page).click()
  await page.getByRole('dialog', { name: 'Record actions', exact: true }).getByRole('button', { name: 'Duplicate', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Duplicate?', exact: true })
  await expect(dialog).toContainText('Create a copy of this record.')
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(trigger(page)).toBeFocused()
})

test('Verification Dialog is independently configurable with empty content and fixed outcomes', async ({ page }) => {
  await page.goto('/pattern-library/verification-dialog')
  const exported = await json(page)
  expect(exported.type).toBe('VerificationDialog')
  expect(exported.children[0].props.area).toBe('content')
  expect(exported.children[0].children).toBeUndefined()
  await page.getByRole('button', { name: 'Open verification', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Delete item?', exact: true })
  await expect(dialog.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused()
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Action confirmed.' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Open verification', exact: true }).click()
  await dialog.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Action confirmed.' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open verification', exact: true })).toBeFocused()
  await page.getByRole('tab', { name: 'Properties', exact: true }).click()
  await expect(page.getByText('onConfirm', { exact: true }).first()).toBeVisible()
})
