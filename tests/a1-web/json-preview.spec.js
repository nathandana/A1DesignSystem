import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { previewFixture } from '../json-validation/preview-fixture.mjs'
import { createMcpHandler } from '../../packages/mcp-server/netlify/functions/mcp.mjs'
import { createPreviewHandler } from '../../packages/mcp-server/netlify/functions/previews.mjs'
import { getJsonModel } from '../../system/json-model/model.js'

function definition(title, link) {
  const page = getJsonModel('page').starter
  page.page.name = title
  page.page.layout.regions[0].nodes = [{ id: 'section', type: 'Section', props: { padding: 'lg', contentWidth: 'lg' }, children: [
    { id: 'title', type: 'PageTitle', props: { title } },
    ...(link ? [{ id: 'link', type: 'Button', props: { href: '/?page=details' }, content: { fallback: 'View details' } }] : []),
  ] }]
  return page
}

async function setup(page, kind = 'project') {
  const document = kind === 'page' ? definition('Generated page') : { name: 'Generated project', pages: [
    { id: 'home', title: 'Home', definition: definition('Generated home', true) },
    { id: 'details', title: 'Details', definition: definition('Generated details') },
  ] }
  const { service } = previewFixture()
  const mcp = createMcpHandler({ createPreview: input => service.create(input) })
  const response = await mcp(new Request('https://mcp.a1design.app/mcp', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'create_preview', arguments: { kind, document } } }) }))
  const created = (await response.json()).result.structuredContent
  expect(created.valid).toBe(true)
  const http = createPreviewHandler(service)
  await page.route('https://mcp.a1design.app/previews/**', async route => {
    const response = await http(new Request(route.request().url()))
    await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: await response.text() })
  })
  return `/preview/${created.previewId}`
}

test('agent-created project renders, navigates, restores history and stays isolated', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const path = await setup(page)
  await page.goto(path)
  await expect(page.frameLocator('iframe').getByRole('heading', { name: 'Generated home' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Edit as project' })).toBeEnabled()
  await expect(page.frameLocator('iframe').locator('html')).toHaveAttribute('data-a1-preview-state', 'ready')
  expect(await page.frames()[1].evaluate(() => { try { localStorage.getItem('a1-auth'); return false } catch { return true } })).toBe(true)
  await page.frameLocator('iframe').getByRole('link', { name: 'View details' }).click()
  await expect(page.frameLocator('iframe').getByRole('heading', { name: 'Generated details' })).toBeVisible()
  await expect(page).toHaveURL(/#page=details$/)
  await page.goBack()
  await expect(page.frameLocator('iframe').getByRole('heading', { name: 'Generated home' })).toBeVisible()
  await page.goto(`${path}#page=unknown`)
  await expect(page.frameLocator('iframe').getByRole('status')).toContainText('not in the preview')
  await page.frameLocator('iframe').getByRole('link', { name: 'Home', exact: true }).click()
  await expect(page.frameLocator('iframe').getByRole('heading', { name: 'Generated home' })).toBeVisible()
  for (const theme of ['base', 'a1Light', 'a1Accessible', 'a1Heritage']) {
    for (const width of [375, 560, 768, 1280, 1536]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`${path}?theme=${theme}`)
      await expect(page.frameLocator('iframe').getByRole('heading', { name: 'Generated home' })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
  }
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter(v => ['critical', 'serious'].includes(v.impact))).toEqual([])
  expect(errors).toEqual([])
})

test('standalone page and unavailable/expired previews have explicit states', async ({ page }) => {
  const path = await setup(page, 'page')
  await page.goto(path)
  await expect(page.frameLocator('iframe').getByRole('heading', { name: 'Generated page' })).toBeVisible()
  await page.route('https://mcp.a1design.app/previews/**', route => route.fulfill({ status: 410, headers: { 'access-control-allow-origin': '*' }, json: { error: 'PREVIEW_EXPIRED' } }))
  await page.reload()
  await expect(page.frameLocator('iframe').getByRole('status')).toContainText('expired')
  await page.goto('/preview/missing')
  await expect(page.frameLocator('iframe').getByRole('status')).toContainText('Preview not found')
  await page.route('https://mcp.a1design.app/previews/**', route => route.fulfill({ status: 503, headers: { 'access-control-allow-origin': '*' }, json: { error: 'PREVIEW_UNAVAILABLE' } }))
  await page.goto(path)
  await expect(page.frameLocator('iframe').getByRole('status')).toContainText('unavailable')
  await page.route('https://mcp.a1design.app/previews/**', route => route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, json: { kind: 'page', document: {} } }))
  await page.reload()
  await expect(page.frameLocator('iframe').getByRole('status')).toContainText('no longer meets the A1 contract')
})

test('preview import reports structural errors with copyable paths and recovery', async ({ page }) => {
  const expiry = Date.now() + 60_000
  const id = `${expiry}-${'b'.repeat(48)}`
  const snapshot = { kind: 'page', contractVersion: '1.1.0', document: definition('LEGACY HEADING'), expiresAt: new Date(expiry).toISOString() }
  await page.route('https://mcp.a1design.app/previews/**', route => route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, json: snapshot }))
  await page.goto(`/preview/${id}`)
  await expect(page.frameLocator('iframe').getByRole('heading', { name: 'LEGACY HEADING', exact: true })).toBeVisible()
  const invalidSnapshot = structuredClone(snapshot)
  invalidSnapshot.document.page.layout.regions[0].nodes[0].children[0].props.size = 'unsupported'
  await page.route('https://mcp.a1design.app/previews/**', route => route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, json: invalidSnapshot }))
  await page.getByRole('button', { name: 'Edit as project', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Preview import failed' })
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('no longer meets the A1 contract')
  const report = JSON.parse(await dialog.locator('pre').innerText())
  expect(report.previewId).toBe(id)
  expect(report.stage).toBe('fetch')
  expect(report.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({
    code: 'UNKNOWN_PROP',
    path: '/page/layout/regions/0/nodes/0/children/0/props/size',
  })]))
  await expect(dialog.getByRole('button', { name: 'Copy code', exact: true })).toBeVisible()
  await expect(dialog.getByRole('link', { name: 'Return to preview' })).toHaveAttribute('href', `/preview/${id}`)
  for (const theme of ['', 'a1-theme-light', 'a1-theme-accessible', 'a1-theme-heritage']) {
    await page.evaluate(theme => { document.documentElement.className = theme }, theme)
    for (const width of [375, 560, 768, 1280, 1536]) {
      await page.setViewportSize({ width, height: 900 })
      const box = await dialog.boundingBox()
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width)
      expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
    }
  }
  const scan = await new AxeBuilder({ page }).include('dialog[open]').analyze()
  expect(scan.violations).toEqual([])
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  expect((await importedProjects(page)).some(project => project.name === 'LEGACY HEADING')).toBe(false)
})

async function signIn(page, { failHydration = false } = {}) {
  const user = { id: 'a1000000-0000-4000-8000-000000000001', aud: 'authenticated', role: 'authenticated', email: 'preview@example.test', app_metadata: { role: 'user' }, user_metadata: {} }
  const expiresAt = Math.floor(Date.now() / 1000) + 3600
  const token = `${Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url')}.${Buffer.from(JSON.stringify({ sub: user.id, exp: expiresAt, role: 'authenticated' })).toString('base64url')}.test`
  await page.addInitScript(session => {
    localStorage.setItem('sb-preview-auth-auth-token', JSON.stringify(session))
  }, { access_token: token, refresh_token: 'test-refresh', expires_at: expiresAt, expires_in: 3600, token_type: 'bearer', user })
  let shared = null
  await page.route('https://preview-auth.example/**', async route => {
    const request = route.request()
    const path = new URL(request.url()).pathname
    if (path.endsWith('/shared_state')) {
      if (failHydration && request.method() === 'GET') return route.fulfill({ status: 503, json: { message: 'Offline' } })
      if (request.method() === 'POST') shared = request.postDataJSON().data
      return route.fulfill({ json: request.method() === 'GET' && shared ? { data: shared } : null })
    }
    if (path.endsWith('/user')) return route.fulfill({ json: user })
    return route.fulfill({ json: request.headers().accept?.includes('object') || path.endsWith('/workspace_labels') ? null : [] })
  })
}

test('capitalization never blocks importing a rendered preview or changes authored names', async ({ page }) => {
  const expiry = Date.now() + 60_000
  const id = `${expiry}-${'c'.repeat(48)}`
  const title = 'Oscar Hammerstein II, AIDS and T.S. Eliot'
  const snapshot = { kind: 'page', contractVersion: '1.1.0', document: definition(title), expiresAt: new Date(expiry).toISOString() }
  await page.route('https://mcp.a1design.app/previews/**', route => route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, json: snapshot }))
  await page.goto(`/preview/${id}`)
  await expect(page.frameLocator('iframe').getByRole('heading', { name: title, exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Edit as project', exact: true }).click()
  await expect(page.getByText('You’re editing a copy saved in this browser.', { exact: true })).toBeVisible()
  expect((await importedProjects(page)).filter(project => project.name === title)).toHaveLength(1)
  await expect(page.locator('[data-editor-node="title"]')).toContainText(title)
})

async function storedJson(page, key) {
  const { gunzipSync, strFromU8 } = await import('fflate')
  const raw = await page.evaluate(key => localStorage.getItem(key), key)
  return raw ? JSON.parse(raw.charCodeAt(0) === 31 ? strFromU8(gunzipSync(Uint8Array.from(raw, c => c.charCodeAt(0)))) : raw) : []
}

const importedProjects = page => storedJson(page, 'a1-projects')

for (const kind of ['page', 'project']) test(`signed-in users import a ${kind} once through the existing workspace`, async ({ page }) => {
  await signIn(page)
  const path = await setup(page, kind)
  await page.goto(path)
  const button = page.getByRole('button', { name: 'Edit as project' })
  await expect(button).toBeEnabled()
  await page.getByRole('button', { name: 'Collapse preview banner' }).click()
  await expect(button).toBeHidden()
  await page.getByRole('button', { name: 'Made with A1:Design', exact: true }).click()
  await expect(button).toBeEnabled()
  for (const width of [320, 375, 390, 560, 768, 1280, 1536]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(button).toBeVisible()
    for (const control of [button, page.getByRole('button', { name: 'Collapse preview banner' }), page.getByRole('link', { name: 'Made with A1:Design', exact: true })]) {
      const bounds = await control.boundingBox()
      expect(bounds.x).toBeGreaterThanOrEqual(0)
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width)
      expect(bounds.height).toBeLessThan(100)
    }
    expect((await page.locator('#a1-preview-banner').boundingBox()).height).toBeLessThan(180)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('Preview imported as a project.', { exact: true })).toBeVisible({ timeout: 15000 })
  const name = kind === 'page' ? 'Generated page' : 'Generated project'
  expect((await importedProjects(page)).filter(project => project.name === name)).toHaveLength(1)
  await page.reload()
  expect((await importedProjects(page)).filter(project => project.name === name)).toHaveLength(1)
})

for (const kind of ['page', 'project']) test(`guests edit a ${kind} locally without changing its shared preview`, async ({ page }) => {
  const cloudWrites = []
  page.on('request', request => {
    if (request.url().startsWith('https://preview-auth.example/rest/') && ['POST', 'PATCH', 'DELETE'].includes(request.method())) cloudWrites.push(request.url())
  })
  const path = await setup(page, kind)
  await page.goto(path)
  const edit = page.getByRole('button', { name: 'Edit as project' })
  await expect(edit).toBeEnabled()
  await edit.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('You’re editing a copy saved in this browser.', { exact: true })).toBeVisible()
  await expect(page).toHaveURL(/\/editor\?project=.+&doc=/)
  await page.getByRole('radio', { name: 'Code snippet', exact: true }).click()
  const editor = page.locator('main textarea')
  const document = JSON.parse(await editor.inputValue())
  document.page.layout.regions[0].nodes[0].children[0].props.title = 'Guest-edited page'
  await editor.fill(JSON.stringify(document))
  await page.getByRole('radio', { name: 'Edit', exact: true }).click()
  await expect(page.locator('[data-editor-node="title"]')).toContainText('Guest-edited page')
  const name = kind === 'page' ? 'Generated page' : 'Generated project'
  expect((await importedProjects(page)).filter(project => project.name === name)).toHaveLength(1)
  const pageId = new URL(page.url()).searchParams.get('doc')
  await expect.poll(async () => JSON.stringify(await storedJson(page, `a1-editor-history-${pageId}`))).toContain('Guest-edited page')
  await page.reload()
  await expect(page.locator('[data-editor-node="title"]')).toContainText('Guest-edited page')
  expect((await importedProjects(page)).filter(project => project.name === name)).toHaveLength(1)
  expect(cloudWrites).toEqual([])
  await page.goto(path)
  await expect(page.frameLocator('iframe').getByRole('heading', { name: kind === 'page' ? 'Generated page' : 'Generated home', exact: true })).toBeVisible()
})

test('attribution banner collapses and reopens without reloading the preview', async ({ page }) => {
  await page.goto(await setup(page))
  const frame = page.frameLocator('iframe')
  await frame.getByRole('link', { name: 'View details' }).click()
  await expect(frame.getByRole('heading', { name: 'Generated details' })).toBeVisible()
  await page.frames()[1].evaluate(() => { window.previewBannerProbe = true })
  const banner = page.locator('#a1-preview-banner')
  const close = page.getByRole('button', { name: 'Collapse preview banner' })
  const reopen = page.getByRole('button', { name: 'Made with A1:Design', exact: true })
  await expect(banner.getByRole('link', { name: 'Made with A1:Design' })).toHaveAttribute('href', '/')
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Edit as project' })).toBeEnabled()
  for (const theme of ['', 'a1-theme-light', 'a1-theme-accessible', 'a1-theme-heritage']) {
    await page.evaluate(theme => { document.documentElement.className = theme }, theme)
    for (const width of [375, 560, 768, 1280, 1536]) {
      await page.setViewportSize({ width, height: 900 })
      const box = await banner.boundingBox()
      expect(Math.abs(box.y + box.height - 900)).toBeLessThanOrEqual(1)
      const frameBox = await page.locator('iframe').boundingBox()
      expect(frameBox.y + frameBox.height).toBeLessThanOrEqual(box.y + 1)
      await close.focus()
      await page.keyboard.press('Enter')
      await expect(banner).toBeHidden()
      await expect(reopen).toBeFocused()
      await expect(reopen).toHaveAttribute('aria-expanded', 'false')
      const floatingBox = await reopen.boundingBox()
      expect(floatingBox.x).toBeGreaterThanOrEqual(0)
      expect(floatingBox.x + floatingBox.width).toBeLessThanOrEqual(width)
      expect(floatingBox.y + floatingBox.height).toBeLessThan(900)
      expect(await page.frames()[1].evaluate(() => window.previewBannerProbe)).toBe(true)
      if (width === 375) {
        const scan = await new AxeBuilder({ page }).include('.a1-json-preview-attribution').analyze()
        expect(scan.violations).toEqual([])
      }
      await page.keyboard.press('Space')
      await expect(close).toBeFocused()
      await expect(banner).toBeVisible()
      await expect(frame.getByRole('heading', { name: 'Generated details' })).toBeVisible()
      if (width === 375) {
        const scan = await new AxeBuilder({ page }).include('#a1-preview-banner').analyze()
        expect(scan.violations).toEqual([])
      }
    }
  }
})

for (const signedIn of [false, true]) test(`expired snapshots do not create projects for ${signedIn ? 'signed-in users' : 'guests'}`, async ({ page }) => {
  if (signedIn) await signIn(page)
  const path = await setup(page)
  await page.goto(path)
  await expect(page.getByRole('button', { name: 'Edit as project' })).toBeEnabled()
  await page.route('https://mcp.a1design.app/previews/**', route => route.fulfill({ status: 410, headers: { 'access-control-allow-origin': '*' }, json: { error: 'PREVIEW_EXPIRED' } }))
  await page.getByRole('button', { name: 'Edit as project' }).click()
  await expect(page.getByText('This preview has expired. Generate a new preview from the JSON.', { exact: true })).toBeVisible({ timeout: 15000 })
  expect((await importedProjects(page)).filter(project => project.name === 'Generated project')).toHaveLength(0)
})

test('a failed cloud pull blocks preview import', async ({ page }) => {
  await signIn(page, { failHydration: true })
  const path = await setup(page)
  await page.goto(path)
  await expect(page.getByRole('button', { name: 'Edit as project' })).toBeEnabled()
  await page.getByRole('button', { name: 'Edit as project' }).click()
  const dialog = page.getByRole('dialog', { name: 'Preview import failed' })
  await expect(dialog).toBeVisible({ timeout: 15000 })
  await expect(dialog).toContainText('Your workspace could not be loaded')
  expect(JSON.parse(await dialog.locator('pre').innerText())).toMatchObject({
    stage: 'workspace', code: 'importWorkspaceFailed', previewId: path.split('/').pop(),
  })
  expect((await importedProjects(page)).filter(project => project.name === 'Generated project')).toHaveLength(0)
})

for (const failure of ['http', 'network', 'json', 'structure']) test(`preview import preserves ${failure} failure details`, async ({ page }) => {
  const path = await setup(page)
  await page.goto(path)
  await expect(page.getByRole('button', { name: 'Edit as project' })).toBeEnabled()
  await page.route('https://mcp.a1design.app/previews/**', route => {
    if (failure === 'network') return route.abort('failed')
    return route.fulfill({
      status: failure === 'http' ? 503 : 200,
      headers: { 'access-control-allow-origin': '*' },
      body: failure === 'json' ? '<html>Service unavailable</html>' : '{}',
    })
  })
  await page.getByRole('button', { name: 'Edit as project' }).click()
  const dialog = page.getByRole('dialog', { name: 'Preview import failed' })
  await expect(dialog).toBeVisible()
  const report = JSON.parse(await dialog.locator('pre').innerText())
  expect(report.stage).toBe('fetch')
  expect(report.previewId).toBe(path.split('/').pop())
  expect(Number.isFinite(Date.parse(report.timestamp))).toBe(true)
  if (failure === 'http') expect(report.status).toBe(503)
  if (failure === 'network') expect(report.code).toContain('Failed to fetch')
  if (failure === 'json') expect(report.code).toBe('invalidResponse')
  if (failure === 'structure') expect(report.diagnostics.length).toBeGreaterThan(0)
  expect((await importedProjects(page)).filter(project => project.name === 'Generated project')).toHaveLength(0)
})

for (const wasSignedIn of [false, true]) test(`sign-in changes invalidate ${wasSignedIn ? 'signed-in' : 'guest'} preview intents`, async ({ page }) => {
  const path = await setup(page)
  await page.goto(path)
  const nonce = 'a1000000-0000-4000-8000-000000000002'
  await page.evaluate(({ nonce, previewId, userId }) => {
    sessionStorage.setItem(`a1-preview-import-${nonce}`, JSON.stringify({ previewId, userId, createdAt: Date.now() }))
  }, { nonce, previewId: path.split('/').pop(), userId: wasSignedIn ? 'a1000000-0000-4000-8000-000000000001' : null })
  if (!wasSignedIn) await signIn(page)
  await page.goto(`/projects?importPreview=${nonce}`)
  await expect(page.getByText('Your sign-in status changed. Return to the preview and choose Edit as project again.', { exact: true })).toBeVisible()
  expect((await importedProjects(page)).filter(project => project.name === 'Generated project')).toHaveLength(0)
  expect(await page.evaluate(nonce => sessionStorage.getItem(`a1-preview-import-${nonce}`), nonce)).toBeNull()
})


test('preview loading uses a centered page spinner until content arrives', async ({ page }) => {
  const path = await setup(page, 'page')
  let release
  const pending = new Promise(resolve => { release = resolve })
  await page.route('https://mcp.a1design.app/previews/**', async route => {
    await pending
    await route.fallback()
  })
  try {
    await page.goto(path)
    const frame = page.frameLocator('iframe')
    const spinner = frame.getByRole('progressbar', { name: 'Loading preview…' })
    await expect(spinner).toBeVisible()
    await expect(spinner).not.toHaveAttribute('aria-valuenow')
    await expect(frame.locator('.a1-banner')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Edit as project' })).toBeDisabled()
    for (const width of [375, 560, 768, 1280, 1536]) {
      await page.setViewportSize({ width, height: 900 })
      const bounds = await spinner.boundingBox()
      const viewport = await page.locator('iframe').boundingBox()
      expect(Math.abs(bounds.x + bounds.width / 2 - viewport.x - viewport.width / 2)).toBeLessThan(2)
      expect(Math.abs(bounds.y + bounds.height / 2 - viewport.y - viewport.height / 2)).toBeLessThan(2)
    }
  } finally { release() }
  await expect(page.frameLocator('iframe').getByRole('heading', { name: 'Generated page', exact: true })).toBeVisible()
  await expect(page.frameLocator('iframe').getByRole('progressbar')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Edit as project' })).toBeEnabled()
})
