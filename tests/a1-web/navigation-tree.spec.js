import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const items = [
  { id: 'all', label: 'All pages', icon: 'apps', pinned: true },
  { id: 'account', label: 'Account', icon: 'folder', category: true, children: [
    { id: 'profile', label: 'Profile', icon: 'person', keywords: ['avatar'] },
    { id: 'billing', label: 'Billing', category: true, children: [
      { id: 'invoices', label: 'Invoices', children: [{ id: 'detail', label: 'Invoice details' }] },
    ] },
  ] },
]
const node = { id: 'nav', type: 'NavigationTree', patternVersion: '1.0.0', props: { items, defaultSelectedId: 'detail' } }
const url = `/pattern-library/navigation-tree?json=${encodeURIComponent(JSON.stringify(node))}`
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('a1-web-theme', 'a1Light')
    localStorage.setItem('a1-web-color-mode', 'light')
    localStorage.setItem('a1-web-locale', 'en')
  })
})

test('nested selection, search, sorting, manual collapse, optional controls and JSON round trip', async ({ page }) => {
  await page.goto(url)
  const preview = page.locator('.a1-web-side-nav-preview .a1-navigation-tree')
  await expect(preview.getByText('Invoice details', { exact: true })).toBeVisible()
  // Collapse is allowed even when the active item is inside the category.
  await preview.getByRole('button', { name: 'Collapse', exact: true }).first().click()
  await expect(preview.locator('[role=treeitem]').filter({ has: page.locator('[data-tree-id=account]') }).first()).toHaveAttribute('aria-expanded', 'false')
  await preview.getByRole('searchbox').fill('avatar')
  await expect(preview.getByText('Profile', { exact: true })).toBeVisible()
  await expect(preview.getByText('Billing', { exact: true })).toHaveCount(0)
  await preview.getByRole('searchbox').fill('')
  await preview.getByRole('button', { name: 'A-Z', exact: true }).click()
  await expect(preview.getByText('Account', { exact: true })).toHaveCount(0)
  await expect(preview.getByText('Invoice details', { exact: true })).toBeVisible()
  await preview.getByRole('button', { name: 'A-Z', exact: true }).focus()
  await page.keyboard.press('Space')
  await expect(preview.getByText('Account', { exact: true })).toBeVisible()
  await page.getByRole('switch', { name: 'Search', exact: true }).focus()
  await page.keyboard.press('Space')
  await expect(preview.getByRole('searchbox')).toHaveCount(0)
  await page.getByRole('switch', { name: 'Sorting button', exact: true }).focus()
  await page.keyboard.press('Space')
  await expect(preview.getByRole('button', { name: 'A-Z', exact: true })).toHaveCount(0)
  await page.getByRole('radio', { name: 'JSON', exact: true }).click()
  const json = await page.locator('textarea').evaluateAll(nodes => nodes.map(n => n.value).find(v => v.includes('"type": "NavigationTree"')))
  const saved = JSON.parse(json)
  expect(saved.id).toBe('nav')
  expect(saved.props.items).toEqual(items)
  expect(saved.props.searchable).toBe(false)
  expect(saved.props.sortable).toBe(false)
})

test('catalog replacement keeps search, persisted A–Z and navigation for both catalogs', async ({ page }) => {
  for (const [path, search, key] of [['/components/button', 'button', 'a1-components-sidebar-view'], ['/pattern-library/page-title', 'page title', 'a1-patterns-sidebar-view']]) {
    await page.goto(path)
    const sidebar = page.locator('.a1-web-components-tree')
    await expect(sidebar).toHaveClass(/a1-navigation-tree/)
    await sidebar.getByRole('searchbox').fill(search)
    await sidebar.getByRole('button', { name: 'A-Z', exact: true }).click()
    expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe('az')
    await page.reload()
    await expect(sidebar.getByRole('button', { name: 'A-Z', exact: true })).toHaveAttribute('aria-pressed', 'true')
    const scan = await new AxeBuilder({ page }).include('.a1-web-components-tree').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(scan.violations).toEqual([])
  }
})

test('responsive pattern uses phone/tablet overlays, desktop collapse, and no preview padding', async ({ page }) => {
  await page.goto(url)
  await expect(page.getByRole('button', { name: 'Padding', exact: true })).toHaveCount(0)
  const preview = page.locator('.a1-web-side-nav-preview .a1-navigation-tree')
  await preview.getByRole('button', { name: 'Collapse navigation', exact: true }).click()
  await expect(preview).toHaveClass(/a1-side-nav--collapsed/)
  await expect(preview.locator('.a1-side-nav__footer').getByRole('button', { name: 'Expand navigation' })).toBeVisible()
  await expect(page.getByRole('radiogroup', { name: 'Placement', exact: true })).toHaveCount(0)
  await expect(preview.locator('.a1-tree-menu--collapsed')).toBeVisible()
  await preview.getByRole('button', { name: 'Expand navigation', exact: true }).click()
  for (const [preset, width] of [['XS', 390], ['SM', 740], ['MD', 820], ['LG', 1280], ['XL', 1600]]) {
    await page.getByRole('radio', { name: preset, exact: true }).click()
    const frame = page.frameLocator('iframe[title]').first()
    const nav = frame.locator('.a1-navigation-tree')
    await expect(nav).toBeVisible()
    const dimensions = await nav.evaluate(el => ({ width: el.getBoundingClientRect().width, viewport: el.ownerDocument.defaultView.innerWidth, position: el.ownerDocument.defaultView.getComputedStyle(el).position }))
    expect(dimensions.viewport).toBe(width)
    expect(dimensions.width).toBeLessThanOrEqual(width)
    expect(dimensions.position).toBe(width < 1025 ? 'fixed' : 'sticky')
    if (width < 1025) {
      await nav.getByRole('button', { name: 'Close navigation', exact: true }).click()
      await frame.getByRole('button', { name: 'Open navigation', exact: true }).click()
      await expect(nav).toHaveClass(/a1-side-nav--open/)
      await nav.getByRole('searchbox').focus()
      await page.keyboard.press('Escape')
      await expect(frame.getByRole('button', { name: 'Open navigation', exact: true })).toBeVisible()
      await frame.getByRole('button', { name: 'Open navigation', exact: true }).click()
    }
  }
  await page.screenshot({ path: 'test-results/a1-web/navigation-tree.png', fullPage: true })
  await page.goto('/components/button')
  await expect(page.getByRole('button', { name: 'Padding', exact: true })).toHaveCount(0)
})

test('navigation is contained across themes and breakpoints and passes focused axe', async ({ page }) => {
  const standalone = { ...node, props: { ...node.props, open: true } }
  await page.goto(`/playground?json=${encodeURIComponent(JSON.stringify({ nodes: [standalone] }))}`)
  const nav = page.locator('.a1-navigation-tree')
  await expect(nav).toBeVisible()
  for (const theme of ['', 'a1-theme-accessible', 'a1-theme-heritage']) {
    for (const mode of ['light', 'dark']) {
      await page.evaluate(({ theme, mode }) => {
        document.documentElement.className = `${theme} a1-theme-${mode}`
      }, { theme, mode })
      await expect.poll(() => nav.getByText('All pages', { exact: true }).evaluate(el => getComputedStyle(el).color === getComputedStyle(el.closest('nav')).color)).toBe(true)
      for (const width of [375, 560, 768, 1280, 1536]) {
        await page.setViewportSize({ width, height: 900 })
        await expect(nav).toBeVisible()
        const box = await nav.boundingBox()
        expect(box.x).toBeGreaterThanOrEqual(-1)
        expect(box.x + box.width).toBeLessThanOrEqual(width + 1)
        if (width === 375) expect(Math.round(box.width)).toBe(width)
      }
      const scan = await new AxeBuilder({ page }).include('.a1-navigation-tree').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
      expect(scan.violations).toEqual([])
    }
  }
})

test('fit preview contains its mobile scrim and can close and reopen without blocking the app', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 })
  await page.goto(url)
  const preview = page.locator('.a1-web-side-nav-preview')
  const nav = preview.locator('.a1-navigation-tree')
  await expect(nav).toBeVisible()
  const frame = await preview.boundingBox()
  const scrim = await preview.locator('.a1-side-nav__scrim').boundingBox()
  expect(Math.abs(scrim.x - frame.x)).toBeLessThan(2)
  expect(scrim.height).toBeLessThanOrEqual(frame.height + 1)
  await nav.getByRole('button', { name: 'Close navigation', exact: true }).click()
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await expect(nav).toHaveClass(/a1-side-nav--open/)
  expect(await preview.evaluate(el => getComputedStyle(el).padding)).toBe('0px')
})

test('project editor configures navigation data and renders the pattern', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(node => {
    const definition = { schemaVersion: '1.1.0', page: { id: 'navigation-page', name: 'Navigation page', layout: { type: 'PageLayout', regions: [{ id: 'main', nodes: [node] }] } } }
    localStorage.setItem('a1-projects', JSON.stringify([{ id: 'navigation-project', name: 'Navigation project', createdAt: 1, updatedAt: 1 }]))
    localStorage.setItem('a1-project-navigation-project-pages', JSON.stringify([{ id: 'navigation-page', title: 'Navigation page', parentId: null, order: 0 }]))
    localStorage.setItem('a1-editor-versions-navigation-page', JSON.stringify({ versions: [{ id: 'v1', label: 'Base', json: JSON.stringify(definition) }], activeVersionId: 'v1' }))
  }, node)
  await page.goto('/editor?project=navigation-project&doc=navigation-page')
  await page.locator('[data-editor-node="nav"]').click({ position: { x: 10, y: 10 } })
  await page.getByRole('textbox', { name: 'Navigation label', exact: true }).fill('Project navigation')
  await page.getByRole('button', { name: 'Add category', exact: true }).last().click()
  await page.getByRole('radio', { name: 'Preview', exact: true }).click()
  await expect(page.getByRole('tree', { name: 'Project navigation', exact: true })).toBeVisible()
  await expect(page.getByRole('tree', { name: 'Project navigation', exact: true }).getByText('New category', { exact: true })).toBeVisible()
})

test('Components sidebar keeps example routes and active ancestor expansion through NavigationTree', async ({ page }) => {
  await page.goto('/components/action-tiles/settings-group')
  const sidebar = page.locator('.a1-web-components-tree')
  await expect(sidebar).toHaveClass(/a1-navigation-tree/)
  const example = sidebar.locator('[data-tree-id="component-action-tile::example::action-tiles-settings"]')
  await expect(example).toBeVisible()
  await expect(example.locator('xpath=ancestor::*[@role="treeitem"][1]')).toHaveAttribute('aria-selected', 'true')
  await sidebar.getByRole('button', { name: 'A-Z', exact: true }).click()
  await expect(example).toHaveCount(0)
  await sidebar.getByRole('button', { name: 'A-Z', exact: true }).click()
  await expect(example).toBeVisible()
  await sidebar.locator('[data-tree-id="component-action-tile"]').click()
  await expect(page).toHaveURL(/\/components\/action-tiles$/)
  await example.click()
  await expect(page).toHaveURL(/\/components\/action-tiles\/settings-group$/)
  await expect(example.locator('xpath=ancestor::*[@role="treeitem"][1]')).toHaveAttribute('aria-selected', 'true')
})
