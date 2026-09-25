import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const WCAG = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']
const block = (props = {}, id = 'custom') => ({ id, type: 'CustomBlock', props })
const route = (nodes) => `/playground?json=${encodeURIComponent(JSON.stringify({ nodes }))}`
const contentFrame = (page, title) => page.frameLocator(`iframe[title="${title}"]`)

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    if (window.top !== window) return
    localStorage.setItem('a1-web-theme', 'a1Light')
    localStorage.setItem('a1-web-color-mode', 'light')
    if (!localStorage.getItem('a1-web-locale')) localStorage.setItem('a1-web-locale', 'en')
  })
})

test('custom CSS and JavaScript stay inside their document and preserve literal source', async ({ page }) => {
  await page.goto(route([
    { id: 'host', type: 'Paragraph', props: { id: 'host-probe' }, content: { fallback: 'Host content' } },
    block({
      title: 'Isolation probe', height: 'sm',
      markup: '<button type="button">Run</button><output aria-live="polite"></output><p id="literal"></p><p id="template">{{ untouched.value }}</p>',
      css: 'body { color: rgb(1, 2, 3); } #host-probe { display: none !important; }',
      js: `document.querySelector('#literal').textContent = '</script><script>parent.pwned = true</script>';
        const denied = [];
        try { parent.document.body.innerHTML = 'escaped'; } catch { denied.push('parent'); }
        try { localStorage.setItem('escaped', 'yes'); } catch { denied.push('storage'); }
        document.body.dataset.denied = denied.join(',');
        fetch('https://example.com/blocked').catch(() => document.body.dataset.fetch = 'blocked');
        document.querySelector('button').addEventListener('click', () => document.querySelector('output').textContent = 'Local action complete');`,
    }),
    block({ title: 'Sibling', markup: '<p>Sibling content</p>' }, 'sibling'),
  ]))
  const frame = contentFrame(page, 'Isolation probe')
  await expect(frame.locator('body')).toHaveAttribute('data-denied', 'parent,storage')
  await expect(frame.locator('body')).toHaveAttribute('data-fetch', 'blocked')
  await expect(frame.locator('#literal')).toHaveText('</script><script>parent.pwned = true</script>')
  await expect(frame.locator('#template')).toHaveText('{{ untouched.value }}')
  await expect(page.locator('#host-probe')).toBeVisible()
  await expect(page.locator('#host-probe')).not.toHaveCSS('color', 'rgb(1, 2, 3)')
  await expect(contentFrame(page, 'Sibling').getByText('Sibling content')).not.toHaveCSS('color', 'rgb(1, 2, 3)')
  expect(await page.evaluate(() => window.pwned)).toBeUndefined()
  await expect(page.locator('iframe[title="Isolation probe"]')).toHaveAttribute('sandbox', 'allow-scripts')
  await frame.getByRole('button', { name: 'Run' }).focus()
  await page.keyboard.press('Enter')
  await expect(frame.locator('output')).toHaveText('Local action complete')
  await page.keyboard.press('Tab')
  expect(await page.evaluate(() => document.activeElement?.getAttribute('title'))).not.toBe('Isolation probe')
})

test('theme tokens, bounds, absolute positioning and accessibility across themes and breakpoints', async ({ page }) => {
  await page.goto(route([block({
    title: 'Responsive annotation',
    markup: '<main><p class="a1-annotation">Positioned annotation</p><button type="button">Local action</button></main>',
    css: '.a1-annotation { position: absolute; inset-inline-end: var(--semantic-spacing-gap-md); inset-block-end: var(--semantic-spacing-gap-md); color: var(--semantic-color-text-accent); font-size: var(--semantic-font-size-body-lg); } button { font: inherit; }',
  })]))
  const root = page.locator('.a1-custom-block')
  const frame = contentFrame(page, 'Responsive annotation')
  for (const theme of ['', 'a1-theme-light', 'a1-theme-accessible', 'a1-theme-heritage']) {
    await page.evaluate((value) => {
      document.documentElement.classList.remove('a1-theme-light', 'a1-theme-accessible', 'a1-theme-heritage')
      if (value) document.documentElement.classList.add(value)
    }, theme)
    for (const width of [375, 560, 768, 1280, 1536]) {
      await page.setViewportSize({ width, height: 900 })
      const token = await root.evaluate((el) => getComputedStyle(el).getPropertyValue('--semantic-color-text-accent').trim())
      await expect.poll(() => frame.locator('html').evaluate((el) => getComputedStyle(el).getPropertyValue('--semantic-color-text-accent').trim())).toBe(token)
      await expect(frame.locator('.a1-annotation')).toHaveCSS('position', 'absolute')
      const box = await root.boundingBox()
      expect(box.width).toBeGreaterThan(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1)
      await expect(root).toHaveCSS('height', '384px')
    }
  }
  const rootScan = await new AxeBuilder({ page }).include('.a1-custom-block').withTags(WCAG).analyze()
  expect(rootScan.violations).toEqual([])
  // Inject explicitly: the opaque-origin frame cannot be reached by host-page axe.
  const iframe = await page.locator('iframe[title="Responsive annotation"]').elementHandle()
  const inner = await iframe.contentFrame()
  await inner.evaluate(axeSource)
  const scan = await inner.evaluate(async (tags) => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }), WCAG)
  expect(scan.violations).toEqual([])
  await page.screenshot({ path: 'test-results/a1-web/custom-block-responsive.png', fullPage: true })
})

test('configurator starts empty, edits all source fields and round-trips JSON', async ({ page }) => {
  await page.goto('/components/custom-block')
  const preview = page.locator('.a1-custom-block__frame')
  await expect(preview).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Markup (HTML)', exact: true })).toHaveValue('')
  await page.getByRole('textbox', { name: 'Accessible title', exact: true }).fill('Configured block')
  await page.getByRole('textbox', { name: 'Markup (HTML)', exact: true }).fill('<p class="a1-probe">Configured content</p>')
  await page.getByRole('textbox', { name: 'CSS', exact: true }).fill('.a1-probe { color: var(--semantic-color-text-accent); }')
  await page.getByRole('textbox', { name: 'JavaScript', exact: true }).fill('document.querySelector("p").textContent += " with JavaScript";')
  await expect(contentFrame(page, 'Configured block').getByText('Configured content with JavaScript')).toBeVisible()
  await page.getByRole('radio', { name: 'Large', exact: true }).click()
  await expect(page.locator('.a1-custom-block')).toHaveCSS('height', '576px')
  await page.getByRole('radio', { name: 'JSON', exact: true }).click()
  const jsonField = page.locator('textarea').filter({ hasText: '"CustomBlock"' })
  // The code editor exposes its current value through the native textarea.
  const source = await page.locator('textarea').evaluateAll((els) => els.map((el) => el.value).find((value) => value.includes('"type": "CustomBlock"')))
  const parsed = JSON.parse(source)
  expect(parsed.type).toBe('CustomBlock')
  expect(parsed.props.height).toBe('lg')
  expect(parsed.props.markup).toContain('Configured content')
  expect(parsed.props.css).toContain('--semantic-color-text-accent')
  expect(parsed.props.js).toContain('with JavaScript')
  parsed.props.markup = '<p>Imported content</p>'
  await jsonField.fill(JSON.stringify(parsed, null, 2))
  await expect(contentFrame(page, 'Configured block').getByText('Imported content with JavaScript')).toBeVisible()
  await page.getByRole('switch', { name: 'Helper text', exact: true }).press('Space')
  await expect(page.getByText('Name this content for screen reader users.', { exact: true })).toBeVisible()
  const scan = await new AxeBuilder({ page }).include('.a1-web-config-aside').withTags(WCAG).analyze()
  expect(scan.violations).toEqual([])
  await page.screenshot({ path: 'test-results/a1-web/custom-block-configurator.png', fullPage: true })
})

test('the project editor selects, edits and persists custom blocks', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    const definition = {
      schemaVersion: '0.1.0',
      page: { id: 'custom-page', name: 'Custom page', layout: { type: 'PageLayout', regions: [{
        id: 'main', nodes: [{ id: 'editable-custom', type: 'CustomBlock', props: {
          title: 'Editor block', markup: '<button type="button">Local action</button>', css: '', js: '', height: 'sm',
        } }],
      }] } },
    }
    localStorage.setItem('a1-projects', JSON.stringify([{ id: 'custom-project', name: 'Custom project', createdAt: 1, updatedAt: 1 }]))
    localStorage.setItem('a1-project-custom-project-pages', JSON.stringify([{ id: 'custom-page', title: 'Custom page', parentId: null, order: 0 }]))
    localStorage.setItem('a1-editor-versions-custom-page', JSON.stringify({ versions: [{ id: 'v1', label: 'Base', json: JSON.stringify(definition) }], activeVersionId: 'v1' }))
    localStorage.setItem('a1-add-set', 'all')
  })
  await page.goto('/editor?project=custom-project&doc=custom-page')
  const root = page.locator('[data-editor-node="editable-custom"]')
  await expect(root).toBeVisible()
  await expect(root.locator('iframe')).toHaveAttribute('inert', '')
  await root.click({ position: { x: 30, y: 30 } })
  await expect(root).toHaveAttribute('data-editor-selected', 'true')
  const markup = page.getByRole('textbox', { name: 'Markup (HTML)', exact: true })
  await expect(markup).toHaveValue('<button type="button">Local action</button>')
  await markup.fill('<p>Edited custom content</p>')
  await page.getByRole('textbox', { name: 'CSS', exact: true }).fill('body { font-size: var(--semantic-font-size-body-lg); }')
  await page.getByRole('textbox', { name: 'JavaScript', exact: true }).fill('document.body.dataset.ready = "yes";')
  await expect(contentFrame(page, 'Editor block').locator('body')).toHaveAttribute('data-ready', 'yes')
  await expect(contentFrame(page, 'Editor block').getByText('Edited custom content')).toBeVisible()
  // The editor batches prop history and storage writes. Wait for that shared save path.
  await expect.poll(async () => page.evaluate(async () => {
    let raw = localStorage.getItem('a1-editor-history-custom-page')
    if (!raw) return false
    if (raw.charCodeAt(0) === 31) {
      const bytes = Uint8Array.from(raw, (ch) => ch.charCodeAt(0))
      raw = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text()
    }
    const history = JSON.parse(raw)
    return history.entries[history.index].json.includes('dataset.ready')
  })).toBe(true)
  await page.reload()
  await expect(contentFrame(page, 'Editor block').getByText('Edited custom content')).toBeVisible()
  await root.click({ position: { x: 30, y: 30 } })
  await expect(markup).toHaveValue('<p>Edited custom content</p>')
  await expect(page.getByRole('textbox', { name: 'JavaScript', exact: true })).toHaveValue('document.body.dataset.ready = "yes";')
  await page.getByRole('radio', { name: 'Component', exact: true }).click()
  await page.getByText('Custom block', { exact: true }).last().click()
  await expect(page.locator('.a1-custom-block')).toHaveCount(2)
  await expect(page.locator('iframe[title="Custom block"]')).toBeVisible()
})

test('custom block controls and default frame names resolve every supported locale', async ({ page }) => {
  const labels = JSON.parse(readFileSync(new URL('../../system/labels/custom-block.json', import.meta.url), 'utf8')).label.customBlock
  await page.goto('/')
  for (const locale of ['es', 'fr', 'de', 'pt', 'ja', 'zh', 'ar']) {
    await page.evaluate((value) => localStorage.setItem('a1-web-locale', value), locale)
    await page.goto('/components/custom-block')
    await expect(page.getByRole('textbox', { name: labels.title.locale[locale], exact: true })).toBeVisible()
    await expect(page.locator('.a1-custom-block__frame')).toHaveAttribute('title', labels.name.locale[locale])
    await expect(page.getByRole('textbox', { name: labels.markup.locale[locale], exact: true })).toHaveValue('')
  }
})
