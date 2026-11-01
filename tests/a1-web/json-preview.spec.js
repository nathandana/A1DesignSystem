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
  await expect(page.getByRole('button', { name: 'Import as project' })).toHaveCount(0)
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

async function importedProjects(page) {
  const { gunzipSync, strFromU8 } = await import('fflate')
  const raw = await page.evaluate(() => localStorage.getItem('a1-projects'))
  return raw ? JSON.parse(raw.charCodeAt(0) === 31 ? strFromU8(gunzipSync(Uint8Array.from(raw, c => c.charCodeAt(0)))) : raw) : []
}

for (const kind of ['page', 'project']) test(`signed-in users import a ${kind} once through the existing workspace`, async ({ page }) => {
  await signIn(page)
  const path = await setup(page, kind)
  await page.goto(path)
  const button = page.getByRole('button', { name: 'Import as project' })
  await expect(button).toBeEnabled()
  for (const width of [375, 560, 768, 1280, 1536]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(button).toBeVisible()
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

test('expired snapshots and failed workspace hydration do not create projects', async ({ page }) => {
  await signIn(page)
  const path = await setup(page)
  await page.goto(path)
  await expect(page.getByRole('button', { name: 'Import as project' })).toBeEnabled()
  await page.route('https://mcp.a1design.app/previews/**', route => route.fulfill({ status: 410, headers: { 'access-control-allow-origin': '*' }, json: { error: 'PREVIEW_EXPIRED' } }))
  await page.getByRole('button', { name: 'Import as project' }).click()
  await expect(page.getByText('This preview has expired. Generate a new preview from the JSON.', { exact: true })).toBeVisible({ timeout: 15000 })
  expect((await importedProjects(page)).filter(project => project.name === 'Generated project')).toHaveLength(0)
})

test('a failed cloud pull blocks preview import', async ({ page }) => {
  await signIn(page, { failHydration: true })
  const path = await setup(page)
  await page.goto(path)
  await expect(page.getByRole('button', { name: 'Import as project' })).toBeEnabled()
  await page.getByRole('button', { name: 'Import as project' }).click()
  await expect(page.getByText('The preview could not be imported. Return to the preview and try again.', { exact: true })).toBeVisible({ timeout: 15000 })
  expect((await importedProjects(page)).filter(project => project.name === 'Generated project')).toHaveLength(0)
})
