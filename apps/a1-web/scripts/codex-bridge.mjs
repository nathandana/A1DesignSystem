#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../../..')
const pageReviewSchemaPath = resolve(__dirname, 'codex-page-review.schema.json')
const iconSuggestionsSchemaPath = resolve(__dirname, 'codex-icon-suggestions.schema.json')
const host = process.env.A1_CODEX_BRIDGE_HOST || '127.0.0.1'
const port = Number(process.env.A1_CODEX_BRIDGE_PORT || 4317)
const codexBin = process.env.A1_CODEX_BIN || 'codex'
const timeoutMs = Number(process.env.A1_CODEX_TIMEOUT_MS || 120000)
const maxBodyBytes = Number(process.env.A1_CODEX_MAX_BODY_BYTES || 1_000_000)
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

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    let size = 0
    let raw = ''
    req.setEncoding('utf8')
    req.on('data', (chunk) => {
      size += Buffer.byteLength(chunk)
      if (size > maxBodyBytes) {
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
  if (!isLocalAddress(req.socket.remoteAddress)) {
    sendJson(res, 403, { error: 'Local connections only' }, origin)
    return
  }
  if (!originAllowed(origin)) {
    sendJson(res, 403, { error: 'Origin is not allowed' }, origin)
    return
  }

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {}, origin)
    return
  }

  if (req.method === 'GET' && req.url === '/health') {
    sendJson(res, 200, {
      ok: true,
      cwd: repoRoot,
      command: `${codexBin} exec --json --sandbox read-only --cd ${repoRoot}`,
    }, origin)
    return
  }

  if (req.method === 'POST' && req.url === '/codex/review-page') {
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

  if (req.method === 'POST' && req.url === '/codex/suggest-icons') {
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
