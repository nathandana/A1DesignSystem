import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { themeOptions, themeClassName } from '../../apps/a1-web/src/lib/appThemes.ts'

const slot = (area, children) => ({
  id: `overview-${area}`, type: 'Slot',
  props: area === 'actions'
    ? { area, zone: true, label: 'Actions', allow: ['Button', 'Link', 'IconButton'], max: 2 }
    : { area, label: 'Content', columns: 1, gap: 'sm' },
  ...(children ? { children } : {}),
})
const overview = {
  id: 'overview', type: 'OverviewCard',
  props: { title: 'Account overview', titleAs: 'h2', details: [{ label: 'Plan', value: 'Enterprise' }] },
  children: [
    slot('content', [{ id: 'summary', type: 'Paragraph', props: { id: 'account-help' }, content: { fallback: 'Your account summary.' } }]),
    slot('actions', [
      { id: 'billing', type: 'Link', props: { href: '#billing' }, content: { fallback: 'Billing history', textKey: 'example.billing' }, actions: { onClick: { type: 'navigate', target: '/billing' } } },
      { id: 'options', type: 'IconButton', props: { icon: 'more_horiz', label: 'Account options', size: 'lg', variant: 'destructive' }, a11y: { describedBy: 'account-help' } },
    ]),
  ],
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('a1-web-theme', 'a1Light')
    localStorage.setItem('a1-web-color-mode', 'light')
    localStorage.setItem('a1-web-locale', 'en')
  })
})

async function readJson(page, type) {
  return JSON.parse(await page.locator('textarea').evaluateAll((nodes, name) =>
    nodes.map((node) => node.value).find((value) => value.includes(`"type": "${name}"`)), type))
}

test('formal pattern starters export area definitions without sample children', async ({ page }) => {
  for (const [slug, type, areas] of [
    ['page-title', 'PageTitle', ['meta', 'actions', 'content']],
    ['overview-card', 'OverviewCard', ['content', 'actions']],
  ]) {
    await page.goto(`/pattern-library/${slug}`)
    await page.getByRole('radio', { name: 'JSON', exact: true }).click()
    const node = await readJson(page, type)
    expect(node.children.map((child) => child.props.area)).toEqual(areas)
    expect(node.children.every((child) => !Object.hasOwn(child, 'children'))).toBe(true)
    expect(node.props.actions).toBeUndefined()
  }
})

test('Overview Card JSON retains authored content and action metadata after a title edit', async ({ page }) => {
  await page.goto(`/pattern-library/overview-card?json=${encodeURIComponent(JSON.stringify(overview))}`)
  await expect(page.locator('.a1-overview-card').getByText('Your account summary.')).toBeVisible()
  await expect(page.getByText(/Child nodes were not applied/)).toHaveCount(0)
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Updated account')
  await page.getByRole('radio', { name: 'JSON', exact: true }).click()
  const node = await readJson(page, 'OverviewCard')
  expect(node.id).toBe('overview')
  expect(node.props.title).toBe('Updated account')
  expect(node.children[0]).toEqual(overview.children[0])
  expect(node.children[1].children[0]).toEqual(overview.children[1].children[0])
  expect(node.children[1].children[1].id).toBe('options')
  expect(node.children[1].children[1].a11y).toEqual({ describedBy: 'account-help' })
  expect(node.children[1].children[1].props).toMatchObject({ label: 'Account options', size: 'sm', variant: 'tertiary' })
  await page.getByRole('radio', { name: 'Code', exact: true }).click()
  await expect(page.locator('code').filter({ hasText: '<OverviewCard' }).first()).toContainText('Your account summary.')
})

test('Overview Card follows parent widths, reading order and action rules across themes and breakpoints', async ({ page }) => {
  const nodes = [{ id: 'parent', type: 'Grid', props: { columns: { xs: 1, md: 2, xl: 3 }, gap: 'md' }, children: [overview] }]
  await page.goto(`/playground?json=${encodeURIComponent(JSON.stringify({ nodes }))}`)
  const card = page.locator('.a1-overview-card')
  await expect(card).toBeVisible()
  const icon = card.getByRole('button', { name: 'Account options' })
  await expect(icon).toHaveClass(/a1-icon-button--small/)
  await expect(icon).toHaveClass(/a1-icon-button--tertiary/)
  expect(await card.evaluate((el) => {
    const content = el.querySelector('.a1-paragraph')
    const details = el.querySelector('dl')
    const actions = el.querySelector('.a1-button-container')
    return !!(details.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING)
      && !!(content.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING)
  })).toBe(true)
  for (const theme of themeOptions.flatMap(option => ['light', 'dark'].map(mode => ({ className: themeClassName(option.value), mode })))) {
    await page.evaluate((value) => {
      document.documentElement.classList.remove(...Array.from(document.documentElement.classList).filter(value => value.startsWith('a1-theme-') && !['a1-theme-light', 'a1-theme-dark'].includes(value)))
      document.documentElement.classList.toggle('a1-theme-dark', value.mode === 'dark')
      document.documentElement.classList.toggle('a1-theme-light', value.mode === 'light')
      if (value.className) document.documentElement.classList.add(value.className)
    }, theme)
    for (const width of [375, 560, 768, 1280, 1536]) {
      await page.setViewportSize({ width, height: 900 })
      const box = await card.boundingBox()
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1)
      const dimensions = await icon.boundingBox()
      expect(Math.abs(dimensions.width - dimensions.height)).toBeLessThan(1)
      const gridWidth = await card.evaluate((el) => {
        const style = getComputedStyle(el.parentElement)
        return parseFloat(style.gridTemplateColumns.split(' ')[0])
      })
      expect(Math.abs(box.width - gridWidth)).toBeLessThan(1)
    }
  }
  await card.getByRole('link', { name: 'Billing history' }).focus()
  await page.keyboard.press('Tab')
  await expect(icon).toBeFocused()
  await page.evaluate(() => { document.documentElement.className = 'a1-theme-light' })
  const scan = await new AxeBuilder({ page }).include('.a1-overview-card').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  expect(scan.violations).toEqual([])
  await page.screenshot({ path: 'test-results/a1-web/overview-card.png', fullPage: true })
})


test('empty action areas override legacy data actions in previews', async ({ page }) => {
  const node = {
    ...overview,
    props: { ...overview.props, actions: [{ label: 'Legacy sample action' }] },
    children: [slot('content'), slot('actions')],
  }
  await page.goto(`/playground?json=${encodeURIComponent(JSON.stringify({ nodes: [node] }))}`)
  await expect(page.locator('.a1-overview-card')).toBeVisible()
  await expect(page.locator('.a1-overview-card .a1-button-container')).toHaveCount(0)
  await expect(page.locator('.a1-overview-card .a1-web-slot')).toHaveCount(0)
})


test('Page title round-trips open content, badge bindings, split buttons and action groups', async ({ page }) => {
  const node = {
    id: 'project-title', type: 'PageTitle', props: { title: 'Projects', titleId: 'projects-heading', breadcrumb: [{ label: 'Workspace', href: '/workspace' }, { label: 'Projects' }] },
    a11y: { labelledBy: 'projects-heading' },
    children: [
      { id: 'project-meta', type: 'Slot', props: { area: 'meta', zone: true }, children: [{ id: 'live', type: 'MessageBadge', props: { status: 'success', icon: 'check' }, content: { fallback: 'Live', textKey: 'project.live' } }] },
      { id: 'project-actions', type: 'Slot', props: { area: 'actions', zone: true }, children: [
        { id: 'tools', type: 'ButtonContainer', children: [{ id: 'export', type: 'Button', props: { variant: 'secondary', href: '/export' }, content: { fallback: 'Export', textKey: 'project.export' }, actions: { onClick: { type: 'appAction', target: 'export' } } }] },
        { id: 'create', type: 'Button', props: { split: true, variant: 'primary', menuLabel: 'Create options', menuActions: [{ id: 'import', label: 'Import', icon: 'upload' }] }, content: { fallback: 'Create' } },
      ] },
      { id: 'project-content', type: 'Slot', props: { area: 'content', columns: 2, gap: 'lg' }, children: [{ id: 'intro', type: 'Paragraph', content: { fallback: 'Configured content', textKey: 'project.intro' } }] },
    ],
  }
  await page.goto(`/pattern-library/page-title?json=${encodeURIComponent(JSON.stringify(node))}`)
  await expect(page.locator('.a1-page-title').getByText('Configured content', { exact: true })).toBeVisible()
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Updated projects')
  await page.getByRole('radio', { name: 'JSON', exact: true }).click()
  const output = await readJson(page, 'PageTitle')
  expect(output.id).toBe(node.id)
  expect(output.a11y).toEqual(node.a11y)
  expect(output.props.titleId).toBe(node.props.titleId)
  expect(output.props.breadcrumb).toEqual(node.props.breadcrumb)
  expect(output.children[2]).toEqual(node.children[2])
  expect(output.children[1].children).toEqual(node.children[1].children)
  expect(output.children[0].children[0].content).toEqual(node.children[0].children[0].content)
  await page.getByRole('radio', { name: 'Code', exact: true }).click()
  const code = page.locator('code').filter({ hasText: '<PageTitle' }).first()
  await expect(code).toContainText('<SplitButton')
  await expect(code).toContainText('Configured content')
  await expect(code).toContainText('<Grid gap="lg" columns={2}')
  await expect(code).toContainText('aria-labelledby="projects-heading"')
})

test('invalid JSON and future pattern versions remain available for correction', async ({ page }) => {
  const future = { ...overview, patternVersion: '99.0.0', futureData: { retain: true } }
  await page.goto(`/pattern-library/overview-card?json=${encodeURIComponent(JSON.stringify(future))}`)
  await page.getByRole('radio', { name: 'JSON', exact: true }).click()
  expect(await readJson(page, 'OverviewCard')).toEqual(future)
  await expect(page.getByText(/Unsupported OverviewCard version/).first()).toBeVisible()
  const invalid = structuredClone(overview)
  invalid.children[1].children.push({ id: 'extra', type: 'Button', content: { fallback: 'Extra' } })
  const json = page.locator('textarea').filter({ hasText: 'OverviewCard' })
  await json.fill(JSON.stringify(invalid, null, 2))
  await expect(page.getByText(/Actions accepts at most 2/).first()).toBeVisible()
  expect(await readJson(page, 'OverviewCard')).toEqual(invalid)
})

test('disabled navigation controls neither navigate nor enter the tab order', async ({ page }) => {
  const nodes = [
    { id: 'disabled-button', type: 'Button', props: { href: '#disabled-button', disabled: true }, content: { fallback: 'Disabled button' } },
    { id: 'disabled-icon', type: 'IconButton', props: { href: '#disabled-icon', disabled: true, icon: 'more_horiz', label: 'Disabled icon' } },
    { id: 'enabled', type: 'Link', props: { href: '#enabled' }, content: { fallback: 'Enabled link' } },
  ]
  await page.goto(`/playground?json=${encodeURIComponent(JSON.stringify({ nodes }))}`)
  for (const name of ['Disabled button', 'Disabled icon']) {
    const control = page.getByRole('link', { name, exact: true })
    await expect(control).toHaveAttribute('aria-disabled', 'true')
    await expect(control).not.toHaveAttribute('href')
    await expect(control).toHaveAttribute('tabindex', '-1')
    await control.evaluate(el => {
      el.click()
      el.dispatchEvent(new MouseEvent('auxclick', { button: 1, bubbles: true, cancelable: true }))
    })
    expect(new URL(page.url()).hash).toBe('')
  }
  const enabled = page.getByRole('link', { name: 'Enabled link', exact: true })
  await enabled.focus()
  await page.keyboard.press('Enter')
  expect(new URL(page.url()).hash).toBe('#enabled')
})

test('editor protects imported zone rules and rejects a third action from duplication', async ({ page }) => {
  await page.goto('/')
  const node = structuredClone(overview)
  node.children[1].props = { ...node.children[1].props, zone: false, allow: ['Heading'], max: 99 }
  node.children[1].lock = { node: false, props: [] }
  await page.evaluate((card) => {
    const definition = { schemaVersion: '0.1.0', page: { id: 'formal-page', name: 'Formal patterns', layout: { type: 'PageLayout', regions: [{ id: 'main', nodes: [card] }] } } }
    localStorage.setItem('a1-projects', JSON.stringify([{ id: 'formal-project', name: 'Formal patterns', createdAt: 1, updatedAt: 1 }]))
    localStorage.setItem('a1-project-formal-project-pages', JSON.stringify([{ id: 'formal-page', title: 'Formal patterns', parentId: null, order: 0 }]))
    localStorage.setItem('a1-editor-versions-formal-page', JSON.stringify({ versions: [{ id: 'v1', label: 'Base', json: JSON.stringify(definition) }], activeVersionId: 'v1' }))
  }, node)
  await page.goto('/editor?project=formal-project&doc=formal-page')
  await expect(page.locator('[data-editor-node="overview"]')).toBeVisible()
  await page.locator('[data-editor-node="billing"]').click()
  // Inline text editing intentionally ignores editor shortcuts. Move focus to the toolbar.
  await page.getByRole('button', { name: 'Keyboard shortcuts', exact: true }).focus()
  await page.keyboard.press('ControlOrMeta+d')
  await expect(page.getByText(/Actions accepts at most 2/).first()).toBeVisible()
  await expect(page.locator('.a1-overview-card .a1-link')).toHaveCount(1)
})

test('long content wraps inside independently sized parents without widening the card', async ({ page }) => {
  const long = structuredClone(overview)
  long.props.title = 'A long account overview title for a distributed team with several active projects'
  long.props.details[0].value = 'Enterprise plan for distributed teams across several regions'
  long.children[0].children[0].content.fallback = 'A detailed account summary. '.repeat(15)
  await page.goto(`/playground?json=${encodeURIComponent(JSON.stringify({ nodes: [{ id: 'parent', type: 'Grid', props: { columns: 1 }, children: [long] }] }))}`)
  const card = page.locator('.a1-overview-card')
  await expect(card).toBeVisible()
  for (const width of [280, 400, 640, 900]) {
    await card.evaluate((el, width) => { el.parentElement.style.width = `${width}px` }, width)
    expect(Math.abs((await card.boundingBox()).width - width)).toBeLessThan(1)
    expect(await card.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true)
    const link = await card.getByRole('link', { name: 'Billing history' }).boundingBox()
    const icon = await card.getByRole('button', { name: 'Account options' }).boundingBox()
    if (width <= 400) expect(Math.abs(link.x - icon.x)).toBeLessThan(1)
  }
})
