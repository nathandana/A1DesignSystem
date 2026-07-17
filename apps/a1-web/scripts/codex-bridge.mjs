#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../../..')
const pageReviewSchemaPath = resolve(__dirname, 'codex-page-review.schema.json')
const iconSuggestionsSchemaPath = resolve(__dirname, 'codex-icon-suggestions.schema.json')
const host = process.env.A1_CODEX_BRIDGE_HOST || '127.0.0.1'
const port = Number(process.env.A1_CODEX_BRIDGE_PORT || 4318)
const codexBin = process.env.A1_CODEX_BIN || 'codex'
const timeoutMs = Number(process.env.A1_CODEX_TIMEOUT_MS || 120000)
const maxBodyBytes = Number(process.env.A1_CODEX_MAX_BODY_BYTES || 1_000_000)
const figmaHandoffMaxBytes = Math.min(maxBodyBytes, 500_000)
const imageHandoffMaxBytes = 4_000_000
const imageHandoffRequestMaxBytes = 6_000_000
const figmaHandoffTtlMs = 5 * 60_000
const playgroundHandoffMaxBytes = figmaHandoffMaxBytes
const playgroundHandoffTtlMs = figmaHandoffTtlMs
const playgroundListenerTtlMs = 10_000
const pageSyncTtlMs = 5 * 60_000
const workspaceTtlMs = 2 * 60_000
// This snapshot stays in local memory and is never exposed as a whole. Keep
// enough headroom for a real workspace, while retaining a separate cap for an
// individual page returned on an explicit Figma selection.
const workspaceMaxBytes = 16_000_000
const workspacePageMaxBytes = 2_000_000
const allowedOrigins = new Set(
  (process.env.A1_CODEX_ALLOWED_ORIGINS || 'http://127.0.0.1:5177,http://localhost:5177')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
)

function isLocalAddress(address = '') {
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1'
}

function originAllowed(origin) {
  return !origin || allowedOrigins.has(origin)
}

function figmaHandoffOriginAllowed(origin) {
  return originAllowed(origin)
    || origin === 'null'
    || /^https:\/\/([a-z0-9-]+\.)?figma\.com$/i.test(origin || '')
}

function sendJson(res, status, body, origin) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': originAllowed(origin) ? (origin || 'http://127.0.0.1:5177') : 'null',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Vary': 'Origin',
  })
  res.end(JSON.stringify(body))
}

function readBody(req, limit = maxBodyBytes) {
  return new Promise((resolveBody, reject) => {
    let size = 0
    let raw = ''
    req.setEncoding('utf8')
    req.on('data', (chunk) => {
      size += Buffer.byteLength(chunk)
      if (size > limit) {
        reject(new Error('BODY_TOO_LARGE'))
        req.destroy()
        return
      }
      raw += chunk
    })
    req.on('end', () => {
      try {
        resolveBody(raw ? JSON.parse(raw) : {})
      } catch {
        reject(new Error('INVALID_JSON'))
      }
    })
    req.on('error', reject)
  })
}

function handoffAssets(assets) {
  if (assets === undefined) return []
  if (!Array.isArray(assets) || assets.length > 8) throw new Error('INVALID_HANDOFF_ASSETS')
  let totalBytes = 0
  return assets.map((asset) => {
    if (!asset || typeof asset !== 'object'
      || typeof asset.id !== 'string' || !/^[A-Za-z0-9_-]{1,120}$/.test(asset.id)
      || typeof asset.name !== 'string' || asset.name.length > 180
      || !['image/png', 'image/jpeg', 'image/gif'].includes(asset.type)
      || typeof asset.dataBase64 !== 'string'
      || !/^[A-Za-z0-9+/]*={0,2}$/.test(asset.dataBase64)) {
      throw new Error('INVALID_HANDOFF_ASSETS')
    }
    const byteLength = Buffer.byteLength(asset.dataBase64, 'base64')
    totalBytes += byteLength
    if (byteLength === 0 || totalBytes > imageHandoffMaxBytes) throw new Error('HANDOFF_ASSET_TOO_LARGE')
    return { id: asset.id, name: asset.name, type: asset.type, dataBase64: asset.dataBase64 }
  })
}

let figmaHandoff = null
let playgroundHandoff = null
let playgroundListenerExpiresAt = 0
let workspaceSnapshot = null
let figmaPageSync = []
let a1PageSync = []
let a1PageCreateSync = []

function activeWorkspaceSnapshot() {
  if (workspaceSnapshot && workspaceSnapshot.expiresAt <= Date.now()) workspaceSnapshot = null
  return workspaceSnapshot
}

function activePageSync(queue) {
  const now = Date.now()
  for (let index = queue.length - 1; index >= 0; index -= 1) {
    if (queue[index].expiresAt <= now) queue.splice(index, 1)
  }
  return queue
}

function validPageIdentity(value) {
  return value && typeof value === 'object'
    && typeof value.projectId === 'string' && value.projectId.length <= 160
    && typeof value.pageId === 'string' && value.pageId.length <= 160
    && typeof value.linkId === 'string' && value.linkId.length <= 160
}

function validPageSyncPayload(body) {
  if (!validPageIdentity(body?.link) || typeof body?.json !== 'string' || !body.json.trim()) {
    throw new Error('INVALID_PAGE_SYNC')
  }
  if (Buffer.byteLength(body.json) > figmaHandoffMaxBytes) throw new Error('PAGE_SYNC_TOO_LARGE')
  JSON.parse(body.json)
  return {
    id: randomUUID(),
    link: body.link,
    json: body.json,
    assets: handoffAssets(body.assets),
    baseHash: typeof body.baseHash === 'string' ? body.baseHash.slice(0, 160) : '',
    revision: Number.isFinite(body.revision) ? Number(body.revision) : 0,
    createdAt: Date.now(),
    expiresAt: Date.now() + pageSyncTtlMs,
  }
}

function validPageCreatePayload(body) {
  if (typeof body?.projectId !== 'string' || body.projectId.length === 0 || body.projectId.length > 160
    || typeof body?.title !== 'string' || body.title.length > 240
    || typeof body?.json !== 'string' || !body.json.trim()) {
    throw new Error('INVALID_PAGE_CREATE')
  }
  if (Buffer.byteLength(body.json) > workspacePageMaxBytes) throw new Error('PAGE_CREATE_TOO_LARGE')
  JSON.parse(body.json)
  const figma = body?.figma && typeof body.figma === 'object' ? body.figma : {}
  if (typeof figma.linkId !== 'string' || figma.linkId.length === 0 || figma.linkId.length > 160) throw new Error('INVALID_PAGE_CREATE')
  return {
    id: randomUUID(),
    projectId: body.projectId,
    title: body.title.trim() || 'Untitled',
    json: body.json,
    assets: handoffAssets(body.assets),
    figma: {
      linkId: figma.linkId,
      figmaFileKey: typeof figma.figmaFileKey === 'string' ? figma.figmaFileKey.slice(0, 240) : '',
      figmaPageId: typeof figma.figmaPageId === 'string' ? figma.figmaPageId.slice(0, 240) : '',
      figmaRootNodeId: typeof figma.figmaRootNodeId === 'string' ? figma.figmaRootNodeId.slice(0, 240) : '',
    },
    createdAt: Date.now(),
    expiresAt: Date.now() + pageSyncTtlMs,
  }
}

function activeFigmaHandoff() {
  if (figmaHandoff && figmaHandoff.expiresAt <= Date.now()) figmaHandoff = null
  return figmaHandoff
}

function activePlaygroundHandoff() {
  if (playgroundHandoff && playgroundHandoff.expiresAt <= Date.now()) playgroundHandoff = null
  return playgroundHandoff
}

function playgroundIsOpen() {
  return playgroundListenerExpiresAt > Date.now()
}

function sendFigmaHandoffJson(res, status, body, origin) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': figmaHandoffOriginAllowed(origin) ? (origin || 'http://127.0.0.1:5177') : 'null',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Vary': 'Origin',
  })
  res.end(JSON.stringify(body))
}

function buildReviewPrompt(definition, instruction = '') {
  return [
    'Review this A1 Design System page definition.',
    '',
    'Use the repository guidance in AGENTS.md and packages/react/ai/.',
    'Do not edit files or run write commands. Report issues only.',
    'Focus on A1 component usage, schema validity, tokens/values, accessibility, responsive behavior, and content/label problems.',
    'Return the final answer as JSON matching the provided output schema.',
    instruction.trim() ? `Additional review focus: ${instruction.trim()}` : '',
    '',
    '<page-definition-json>',
    JSON.stringify(definition, null, 2),
    '</page-definition-json>',
  ].filter(Boolean).join('\n')
}

function buildIconPrompt(description, avoid = [], count = 3, customIcons = []) {
  const avoidNote = avoid.length ? `\nDo not suggest these already-shown icons: ${avoid.join(', ')}.` : ''
  const customNote = customIcons.length
    ? [
      'Project custom icons are also valid. If one fits better than a Material Symbol, return it with the custom: prefix.',
      `Available custom icons: ${customIcons.map((icon) => `custom:${icon.name}`).join(', ')}.`,
    ].join('\n')
    : ''
  return [
    'Suggest A1 icon names for an A1 Design System icon field.',
    '',
    'Use your knowledge of common Material Symbols names.',
    customNote,
    'The browser will validate returned names against the local built-in and custom icon registries after this response.',
    'Do not inspect files. Do not run commands. Do not edit files.',
    'Return the final answer as JSON matching the provided output schema.',
    '',
    `Request: ${description}`,
    `Return at least ${count} and up to ${count + 4} candidates so the browser can filter duplicates.`,
    avoidNote,
  ].filter(Boolean).join('\n')
}

function parseJsonLines(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line)
      } catch {
        return { type: 'unparsed', raw: line }
      }
    })
}

function numberFromKeys(object, keys) {
  for (const key of keys) {
    const value = object?.[key]
    if (typeof value === 'number' && Number.isFinite(value)) return value
  }
  return undefined
}

function collectUsageObjects(value, out = []) {
  if (!value || typeof value !== 'object') return out
  if (value.usage && typeof value.usage === 'object') out.push(value.usage)
  out.push(value)
  for (const child of Object.values(value)) {
    if (child && typeof child === 'object') collectUsageObjects(child, out)
  }
  return out
}

function summarizeUsage(events) {
  let inputTokens = 0
  let outputTokens = 0
  let totalTokens = 0
  let found = false

  for (const usage of collectUsageObjects(events)) {
    const input = numberFromKeys(usage, ['input_tokens', 'prompt_tokens', 'inputTokens', 'promptTokens'])
    const output = numberFromKeys(usage, ['output_tokens', 'completion_tokens', 'outputTokens', 'completionTokens'])
    const total = numberFromKeys(usage, ['total_tokens', 'totalTokens'])
    if (input !== undefined || output !== undefined || total !== undefined) found = true
    inputTokens = Math.max(inputTokens, input ?? 0)
    outputTokens = Math.max(outputTokens, output ?? 0)
    totalTokens = Math.max(totalTokens, total ?? 0, (input ?? 0) + (output ?? 0))
  }

  return {
    inputTokens: found ? inputTokens : null,
    outputTokens: found ? outputTokens : null,
    totalTokens: found ? totalTokens : null,
    reported: found,
  }
}

async function runCodexReview({ definition, instruction }) {
  return runCodex({
    prompt: buildReviewPrompt(definition, instruction),
    schemaPath: pageReviewSchemaPath,
  })
}

async function runCodexIconSuggestions({ description, avoid, count, customIcons }) {
  return runCodex({
    prompt: buildIconPrompt(description, avoid, count, customIcons),
    schemaPath: iconSuggestionsSchemaPath,
    ignoreRules: true,
    ignoreUserConfig: true,
    skipGitRepoCheck: true,
    workRoot: null,
  })
}

async function runCodex({
  prompt,
  schemaPath,
  ignoreRules = false,
  ignoreUserConfig = false,
  skipGitRepoCheck = false,
  workRoot = repoRoot,
}) {
  const scratchDir = await mkdtemp(resolve(tmpdir(), 'a1-codex-review-'))
  const outputPath = resolve(scratchDir, 'last-message.json')
  const resolvedWorkRoot = workRoot ?? scratchDir
  const startedAt = Date.now()

  return new Promise((resolveRun, reject) => {
    const args = [
      'exec',
      '--json',
      '--sandbox',
      'read-only',
      ...(ignoreRules ? ['--ignore-rules'] : []),
      ...(ignoreUserConfig ? ['--ignore-user-config'] : []),
      ...(skipGitRepoCheck ? ['--skip-git-repo-check'] : []),
      '--cd',
      resolvedWorkRoot,
      '--output-schema',
      schemaPath,
      '--output-last-message',
      outputPath,
      '-',
    ]
    const child = spawn(codexBin, args, {
      cwd: repoRoot,
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    const timer = setTimeout(() => {
      child.kill('SIGTERM')
      reject(new Error('CODEX_TIMEOUT'))
    }, timeoutMs)

    child.stdout.on('data', (chunk) => { stdout += chunk.toString() })
    child.stderr.on('data', (chunk) => { stderr += chunk.toString() })
    child.on('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
    child.on('close', async (code) => {
      clearTimeout(timer)
      try {
        if (code !== 0) {
          const error = new Error('CODEX_EXIT')
          error.code = code
          error.stderr = stderr
          reject(error)
          return
        }

        const lastMessage = (await readFile(outputPath, 'utf8')).trim()
        const events = parseJsonLines(stdout)
        resolveRun({
          raw: stdout,
          events,
          result: JSON.parse(lastMessage),
          elapsedMs: Date.now() - startedAt,
          usage: summarizeUsage(events),
        })
      } catch (error) {
        reject(error)
      } finally {
        rm(scratchDir, { recursive: true, force: true }).catch(() => {})
      }
    })

    child.stdin.end(prompt)
  })
}

const server = createServer(async (req, res) => {
  const origin = req.headers.origin
  const requestUrl = new URL(req.url || '/', `http://${host}`)
  const pathname = requestUrl.pathname
  const isFigmaHandoffRequest = pathname === '/figma/handoff' || pathname === '/figma/handoff/ack'
  const isPlaygroundHandoffRequest = pathname === '/playground/handoff' || pathname === '/playground/handoff/ack'
  const isPageSyncRequest = pathname.startsWith('/page-sync/') || pathname.startsWith('/workspace/')
  const isLocalHandoffRequest = isFigmaHandoffRequest || isPlaygroundHandoffRequest || isPageSyncRequest
  if (!isLocalAddress(req.socket.remoteAddress)) {
    sendJson(res, 403, { error: 'Local connections only' }, origin)
    return
  }
  if (!originAllowed(origin) && !(isLocalHandoffRequest && figmaHandoffOriginAllowed(origin))) {
    sendJson(res, 403, { error: 'Origin is not allowed' }, origin)
    return
  }

  if (req.method === 'OPTIONS') {
    if (isLocalHandoffRequest) sendFigmaHandoffJson(res, 204, {}, origin)
    else sendJson(res, 204, {}, origin)
    return
  }

  // A1 registers the pages available in this local browser session. The bridge
  // intentionally keeps this snapshot in memory only; Figma sees names and
  // ids, while the full JSON travels only for a page the user explicitly sends.
  if (req.method === 'POST' && pathname === '/workspace/register') {
    try {
      const body = await readBody(req, workspaceMaxBytes)
      if (!Array.isArray(body?.projects) || body.projects.length > 100) throw new Error('INVALID_WORKSPACE')
      const projects = body.projects.map((project) => {
        if (!project || typeof project.id !== 'string' || typeof project.name !== 'string' || !Array.isArray(project.pages)) throw new Error('INVALID_WORKSPACE')
        return {
          id: project.id.slice(0, 160),
          name: project.name.slice(0, 240),
          pages: project.pages.slice(0, 500).map((page) => {
            if (!page || typeof page.id !== 'string' || typeof page.title !== 'string') throw new Error('INVALID_WORKSPACE')
            let json = ''
            if (typeof page.json === 'string' && Buffer.byteLength(page.json) <= workspacePageMaxBytes) {
              try {
                JSON.parse(page.json)
                json = page.json
              } catch {
                // Keep the project/page visible if one stale document cannot
                // be parsed. It simply cannot be pulled until it is repaired.
              }
            }
            return {
              id: page.id.slice(0, 160),
              title: page.title.slice(0, 240),
              json,
              link: page.link && validPageIdentity(page.link) ? page.link : null,
            }
          }),
        }
      })
      workspaceSnapshot = { projects, updatedAt: Date.now(), expiresAt: Date.now() + workspaceTtlMs }
      sendJson(res, 202, { ok: true, expiresAt: workspaceSnapshot.expiresAt }, origin)
    } catch (error) {
      sendJson(res, 400, { error: error?.message === 'INVALID_WORKSPACE' ? 'Workspace payload is invalid' : 'Could not register the A1 workspace' }, origin)
    }
    return
  }

  if (req.method === 'GET' && pathname === '/workspace/manifest') {
    const workspace = activeWorkspaceSnapshot()
    sendFigmaHandoffJson(res, 200, {
      ok: true,
      workspace: workspace ? {
        projects: workspace.projects.map((project) => ({
          ...project,
          pages: project.pages.map(({ json: _json, ...page }) => page),
        })),
        updatedAt: workspace.updatedAt,
      } : null,
    }, origin)
    return
  }

  // Deliberate page pull for the Figma Page Editor. The manifest never
  // includes document content; a selected project/page is required here.
  if (req.method === 'GET' && pathname === '/workspace/page') {
    const workspace = activeWorkspaceSnapshot()
    const projectId = requestUrl.searchParams.get('projectId')
    const pageId = requestUrl.searchParams.get('pageId')
    const project = workspace?.projects.find((entry) => entry.id === projectId)
    const page = project?.pages.find((entry) => entry.id === pageId)
    if (!page || !page.json) {
      sendFigmaHandoffJson(res, 404, { error: 'The selected A1 page is not available in the local workspace' }, origin)
      return
    }
    sendFigmaHandoffJson(res, 200, {
      ok: true,
      page: { id: page.id, title: page.title, json: page.json, link: page.link },
    }, origin)
    return
  }

  if (req.method === 'POST' && pathname === '/page-sync/to-figma') {
    try {
      const payload = validPageSyncPayload(await readBody(req, imageHandoffRequestMaxBytes))
      activePageSync(figmaPageSync)
      figmaPageSync = figmaPageSync.filter((entry) => entry.link.linkId !== payload.link.linkId)
      figmaPageSync.push(payload)
      sendJson(res, 202, { ok: true, id: payload.id, expiresAt: payload.expiresAt }, origin)
    } catch (error) {
      sendJson(res, 400, { error: error?.message === 'PAGE_SYNC_TOO_LARGE' ? 'Page sync is too large' : 'Page sync payload is invalid' }, origin)
    }
    return
  }

  if (req.method === 'GET' && pathname === '/page-sync/to-figma') {
    const queue = activePageSync(figmaPageSync)
    const linkId = requestUrl.searchParams.get('linkId')
    const entry = linkId ? queue.find((candidate) => candidate.link.linkId === linkId) : queue[0]
    sendFigmaHandoffJson(res, 200, { ok: true, handoff: entry ?? null }, origin)
    return
  }

  if (req.method === 'POST' && pathname === '/page-sync/to-figma/ack') {
    try {
      const body = await readBody(req)
      figmaPageSync = activePageSync(figmaPageSync).filter((entry) => entry.id !== body?.id)
      sendFigmaHandoffJson(res, 200, { ok: true }, origin)
    } catch {
      sendFigmaHandoffJson(res, 400, { error: 'Could not acknowledge page sync' }, origin)
    }
    return
  }

  if (req.method === 'POST' && pathname === '/page-sync/to-a1') {
    try {
      const payload = validPageSyncPayload(await readBody(req, imageHandoffRequestMaxBytes))
      activePageSync(a1PageSync)
      a1PageSync = a1PageSync.filter((entry) => entry.link.linkId !== payload.link.linkId)
      a1PageSync.push(payload)
      sendFigmaHandoffJson(res, 202, { ok: true, id: payload.id, expiresAt: payload.expiresAt }, origin)
    } catch (error) {
      sendFigmaHandoffJson(res, 400, { error: error?.message === 'PAGE_SYNC_TOO_LARGE' ? 'Page sync is too large' : 'Page sync payload is invalid' }, origin)
    }
    return
  }

  if (req.method === 'GET' && pathname === '/page-sync/to-a1') {
    const queue = activePageSync(a1PageSync)
    const linkId = requestUrl.searchParams.get('linkId')
    const entry = linkId ? queue.find((candidate) => candidate.link.linkId === linkId) : queue[0]
    sendJson(res, 200, { ok: true, handoff: entry ?? null }, origin)
    return
  }

  if (req.method === 'POST' && pathname === '/page-sync/to-a1/ack') {
    try {
      const body = await readBody(req)
      a1PageSync = activePageSync(a1PageSync).filter((entry) => entry.id !== body?.id)
      sendJson(res, 200, { ok: true }, origin)
    } catch {
      sendJson(res, 400, { error: 'Could not acknowledge page sync' }, origin)
    }
    return
  }

  // A Figma-authored root can request a brand-new A1 project page. A1-web
  // performs the localStorage write after polling this in-memory queue.
  if (req.method === 'POST' && pathname === '/page-sync/create-a1') {
    try {
      const payload = validPageCreatePayload(await readBody(req, imageHandoffRequestMaxBytes))
      activePageSync(a1PageCreateSync)
      a1PageCreateSync = a1PageCreateSync.filter((entry) => entry.figma.linkId !== payload.figma.linkId)
      a1PageCreateSync.push(payload)
      sendFigmaHandoffJson(res, 202, { ok: true, id: payload.id, expiresAt: payload.expiresAt }, origin)
    } catch (error) {
      sendFigmaHandoffJson(res, 400, { error: error?.message === 'PAGE_CREATE_TOO_LARGE' ? 'New page is too large' : 'New page payload is invalid' }, origin)
    }
    return
  }

  if (req.method === 'GET' && pathname === '/page-sync/create-a1') {
    const queue = activePageSync(a1PageCreateSync)
    sendJson(res, 200, { ok: true, handoff: queue[0] ?? null }, origin)
    return
  }

  if (req.method === 'POST' && pathname === '/page-sync/create-a1/ack') {
    try {
      const body = await readBody(req)
      a1PageCreateSync = activePageSync(a1PageCreateSync).filter((entry) => entry.id !== body?.id)
      sendJson(res, 200, { ok: true }, origin)
    } catch {
      sendJson(res, 400, { error: 'Could not acknowledge page creation' }, origin)
    }
    return
  }

  if (req.method === 'POST' && pathname === '/figma/handoff') {
    try {
      const body = await readBody(req, imageHandoffRequestMaxBytes)
      const json = typeof body?.json === 'string' ? body.json : ''
      if (!json.trim()) {
        sendFigmaHandoffJson(res, 400, { error: 'Missing JSON handoff' }, origin)
        return
      }
      if (Buffer.byteLength(json) > figmaHandoffMaxBytes) {
        sendFigmaHandoffJson(res, 400, { error: 'Figma handoff is too large' }, origin)
        return
      }
      JSON.parse(json)
      const assets = handoffAssets(body?.assets)
      const now = Date.now()
      figmaHandoff = {
        id: randomUUID(),
        json,
        assets,
        createdAt: now,
        expiresAt: now + figmaHandoffTtlMs,
      }
      sendFigmaHandoffJson(res, 202, {
        ok: true,
        id: figmaHandoff.id,
        expiresAt: figmaHandoff.expiresAt,
      }, origin)
    } catch (error) {
      const message = error?.message === 'BODY_TOO_LARGE' || error?.message === 'HANDOFF_ASSET_TOO_LARGE'
        ? 'Figma handoff is too large'
        : error?.message === 'INVALID_JSON'
          ? 'Request body must be valid JSON'
          : error?.message === 'INVALID_HANDOFF_ASSETS'
            ? 'Figma handoff includes an invalid local image asset'
          : 'The JSON handoff could not be queued'
      sendFigmaHandoffJson(res, 400, { error: message }, origin)
    }
    return
  }

  if (req.method === 'GET' && pathname === '/figma/handoff') {
    const handoff = activeFigmaHandoff()
    if (!handoff) {
      sendFigmaHandoffJson(res, 200, { ok: true, handoff: null }, origin)
      return
    }
    sendFigmaHandoffJson(res, 200, { ok: true, handoff }, origin)
    return
  }

  if (req.method === 'POST' && pathname === '/figma/handoff/ack') {
    try {
      const body = await readBody(req, imageHandoffRequestMaxBytes)
      const handoff = activeFigmaHandoff()
      if (handoff && body?.id === handoff.id) figmaHandoff = null
      sendFigmaHandoffJson(res, 200, { ok: true }, origin)
    } catch (error) {
      sendFigmaHandoffJson(res, 400, { error: error?.message === 'INVALID_JSON' ? 'Request body must be valid JSON' : 'Could not acknowledge handoff' }, origin)
    }
    return
  }

  if (req.method === 'POST' && pathname === '/playground/handoff') {
    try {
      const body = await readBody(req, imageHandoffRequestMaxBytes)
      const json = typeof body?.json === 'string' ? body.json : ''
      if (!json.trim()) {
        sendFigmaHandoffJson(res, 400, { error: 'Missing JSON handoff' }, origin)
        return
      }
      if (Buffer.byteLength(json) > playgroundHandoffMaxBytes) {
        sendFigmaHandoffJson(res, 400, { error: 'Playground handoff is too large' }, origin)
        return
      }
      JSON.parse(json)
      const assets = handoffAssets(body?.assets)
      const now = Date.now()
      playgroundHandoff = {
        id: randomUUID(),
        json,
        live: body?.live === true,
        assets,
        createdAt: now,
        expiresAt: now + playgroundHandoffTtlMs,
      }
      sendFigmaHandoffJson(res, 202, {
        ok: true,
        id: playgroundHandoff.id,
        expiresAt: playgroundHandoff.expiresAt,
        playgroundOpen: playgroundIsOpen(),
      }, origin)
    } catch (error) {
      const message = error?.message === 'BODY_TOO_LARGE' || error?.message === 'HANDOFF_ASSET_TOO_LARGE'
        ? 'Playground handoff is too large'
        : error?.message === 'INVALID_JSON'
          ? 'Request body must be valid JSON'
          : error?.message === 'INVALID_HANDOFF_ASSETS'
            ? 'Playground handoff includes an invalid local image asset'
          : 'The JSON handoff could not be queued'
      sendFigmaHandoffJson(res, 400, { error: message }, origin)
    }
    return
  }

  if (req.method === 'GET' && pathname === '/playground/handoff') {
    const handoff = activePlaygroundHandoff()
    if (requestUrl.searchParams.get('listen') === '1') {
      playgroundListenerExpiresAt = Date.now() + playgroundListenerTtlMs
      sendFigmaHandoffJson(res, 200, { ok: true, handoff }, origin)
      return
    }
    const id = requestUrl.searchParams.get('id')
    if (!handoff || !id || id !== handoff.id) {
      sendFigmaHandoffJson(res, 404, { error: 'Playground handoff was not found or has expired' }, origin)
      return
    }
    sendFigmaHandoffJson(res, 200, { ok: true, handoff }, origin)
    return
  }

  if (req.method === 'POST' && pathname === '/playground/handoff/ack') {
    try {
      const body = await readBody(req)
      const handoff = activePlaygroundHandoff()
      if (handoff && body?.id === handoff.id) playgroundHandoff = null
      sendFigmaHandoffJson(res, 200, { ok: true }, origin)
    } catch (error) {
      sendFigmaHandoffJson(res, 400, { error: error?.message === 'INVALID_JSON' ? 'Request body must be valid JSON' : 'Could not acknowledge handoff' }, origin)
    }
    return
  }

  if (req.method === 'GET' && pathname === '/health') {
    sendJson(res, 200, {
      ok: true,
      cwd: repoRoot,
      command: `${codexBin} exec --json --sandbox read-only --cd ${repoRoot}`,
    }, origin)
    return
  }

  if (req.method === 'POST' && pathname === '/codex/review-page') {
    try {
      const body = await readBody(req)
      if (!body?.definition || typeof body.definition !== 'object') {
        sendJson(res, 400, { error: 'Missing page definition' }, origin)
        return
      }

      const review = await runCodexReview({
        definition: body.definition,
        instruction: typeof body.instruction === 'string' ? body.instruction : '',
      })
      sendJson(res, 200, { ok: true, ...review }, origin)
    } catch (error) {
      const status = error?.message === 'BODY_TOO_LARGE' || error?.message === 'INVALID_JSON' ? 400 : 502
      sendJson(res, status, {
        ok: false,
        error: error?.message || 'CODEX_BRIDGE_ERROR',
        code: error?.code,
        detail: error?.stderr || '',
      }, origin)
    }
    return
  }

  if (req.method === 'POST' && pathname === '/codex/suggest-icons') {
    try {
      const body = await readBody(req)
      const description = String(body?.description ?? '').trim()
      if (!description) {
        sendJson(res, 400, { error: 'Missing icon description' }, origin)
        return
      }

      const review = await runCodexIconSuggestions({
        description,
        avoid: Array.isArray(body?.avoid) ? body.avoid.map(String) : [],
        count: Number.isFinite(body?.count) ? Number(body.count) : 3,
        customIcons: Array.isArray(body?.customIcons)
          ? body.customIcons
            .map((icon) => ({ name: String(icon?.name ?? '').trim() }))
            .filter((icon) => icon.name)
            .slice(0, 100)
          : [],
      })
      sendJson(res, 200, { ok: true, ...review }, origin)
    } catch (error) {
      const status = error?.message === 'BODY_TOO_LARGE' || error?.message === 'INVALID_JSON' ? 400 : 502
      sendJson(res, status, {
        ok: false,
        error: error?.message || 'CODEX_BRIDGE_ERROR',
        code: error?.code,
        detail: error?.stderr || '',
      }, origin)
    }
    return
  }

  sendJson(res, 404, { error: 'Not found' }, origin)
})

server.listen(port, host, () => {
  console.log(`A1 Codex bridge running on http://${host}:${port}`)
  console.log(`Allowed origins: ${Array.from(allowedOrigins).join(', ')}`)
  console.log('Mode: codex exec --sandbox read-only')
})
