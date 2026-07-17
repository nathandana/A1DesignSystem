#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../../..')
const schemaPath = resolve(__dirname, 'codex-jobs-task.schema.json')
const host = process.env.A1_CODEX_BRIDGE_HOST || '127.0.0.1'
const port = Number(process.env.A1_CODEX_BRIDGE_PORT || 4317)
const codexBin = process.env.A1_CODEX_BIN || 'codex'
const timeoutMs = Number(process.env.A1_CODEX_TIMEOUT_MS || 120000)
const maxBodyBytes = Number(process.env.A1_CODEX_MAX_BODY_BYTES || 2_000_000)
const allowedOrigins = new Set(
  (process.env.A1_CODEX_ALLOWED_ORIGINS || 'http://127.0.0.1:5186,http://localhost:5186')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
)

const JOB_TASKS = {
  '/codex/jobs/parse-job': 'Parse the job post into structured position, company, requirements, responsibilities, keywords, and next actions.',
  '/codex/jobs/import-job-url': 'Fetch and parse a public job URL into structured position, company, requirements, responsibilities, keywords, and next actions.',
  '/codex/jobs/summarize-position': 'Summarize the position and company from the provided job post. Note uncertainty when the post does not include a fact.',
  '/codex/jobs/draft-application': 'Draft a truthful customized resume, cover letter, portfolio note, and A1 link note for this role.',
  '/codex/jobs/draft-outreach': 'Draft a concise human outreach message to the provided contact or likely hiring contact.',
  '/codex/jobs/triage-message': 'Summarize the job-related communication and suggest a status plus next action.',
  '/codex/jobs/interview-prep': 'Create an interview prep document for the position using the job post and candidate profile.',
  '/codex/jobs/map-application-form': 'Map detected application form fields to known candidate/application data. Leave unknowns blank and mark them for review.',
}

function isLocalAddress(address = '') {
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1'
}

function originAllowed(origin) {
  return !origin || allowedOrigins.has(origin)
}

function sendJson(res, status, body, origin) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': originAllowed(origin) ? (origin || 'http://127.0.0.1:5186') : 'null',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    Vary: 'Origin',
  })
  res.end(JSON.stringify(body))
}

async function existingBridgeHealth() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 1000)
  try {
    const res = await fetch(`http://${host}:${port}/health`, { signal: controller.signal })
    const data = await res.json().catch(() => null)
    if (!res.ok || data?.ok !== true || !Array.isArray(data.routes)) return null
    return data
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

async function handleListenError(error) {
  if (error?.code !== 'EADDRINUSE') {
    console.error(error)
    process.exitCode = 1
    return
  }

  const existing = await existingBridgeHealth()
  if (existing) {
    console.log(`A1 Jobs Codex bridge is already running on http://${host}:${port}`)
    console.log('Leave that terminal/process open and use the app normally.')
    process.exitCode = 0
    return
  }

  console.error(`Port ${host}:${port} is already in use by another process.`)
  console.error('Stop that process, or start this bridge on another port, for example:')
  console.error(`  A1_CODEX_BRIDGE_PORT=4319 npm run codex:bridge:jobs`)
  console.error('If you change the port, update the Jobs app bridge URL to match.')
  process.exitCode = 1
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    let size = 0
    let raw = ''
    let tooLarge = false
    req.setEncoding('utf8')
    req.on('data', (chunk) => {
      size += Buffer.byteLength(chunk)
      if (size > maxBodyBytes) {
        tooLarge = true
        raw = ''
        return
      }
      if (!tooLarge) raw += chunk
    })
    req.on('end', () => {
      if (tooLarge) {
        reject(new Error(`BODY_TOO_LARGE:${size}:${maxBodyBytes}`))
        return
      }
      try {
        resolveBody(raw ? JSON.parse(raw) : {})
      } catch {
        reject(new Error('INVALID_JSON'))
      }
    })
    req.on('error', reject)
  })
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

function codexRunFailure(events, code) {
  const failed = events.find((event) => event?.type === 'turn.failed')
  const errorEvent = events.find((event) => event?.type === 'error' && typeof event.message === 'string')
  if (failed) return String(failed.error?.message || errorEvent?.message || 'CODEX_TURN_FAILED')
  if (code !== 0) return errorEvent ? String(errorEvent.message) : 'CODEX_EXIT'
  return ''
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

function safeJson(value) {
  return JSON.stringify(value ?? null, null, 2)
}

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function decodeHtmlEntities(value) {
  const named = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  }
  return String(value || '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    const key = entity.toLowerCase()
    if (key.startsWith('#x')) {
      const codePoint = Number.parseInt(key.slice(2), 16)
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match
    }
    if (key.startsWith('#')) {
      const codePoint = Number.parseInt(key.slice(1), 10)
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match
    }
    return named[key] ?? match
  })
}

function htmlToText(html) {
  return cleanText(decodeHtmlEntities(String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<(br|p|li|div|section|article|header|footer|h[1-6])\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')))
}

function titleFromHtml(html) {
  const title = String(html || '').match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
  return cleanText(decodeHtmlEntities(title))
}

function jsonLdScripts(html) {
  const scripts = []
  const pattern = /<script\b[^>]*type=["'][^"']*ld\+json[^"']*["'][^>]*>([\s\S]*?)<\/script>/gi
  let match = pattern.exec(html)
  while (match) {
    const text = decodeHtmlEntities(match[1].trim())
    try {
      scripts.push(JSON.parse(text))
    } catch {
      // Some job boards emit malformed JSON-LD. Keep the readable HTML fallback.
    }
    match = pattern.exec(html)
  }
  return scripts
}

function flattenJsonLd(value, out = []) {
  if (Array.isArray(value)) {
    for (const item of value) flattenJsonLd(item, out)
    return out
  }
  if (!value || typeof value !== 'object') return out
  out.push(value)
  if (value['@graph']) flattenJsonLd(value['@graph'], out)
  return out
}

function jobPostingFromJsonLd(html) {
  const nodes = jsonLdScripts(html).flatMap((script) => flattenJsonLd(script))
  return nodes.find((node) => {
    const type = node['@type']
    return type === 'JobPosting' || (Array.isArray(type) && type.includes('JobPosting'))
  }) ?? null
}

function locationFromJobPosting(posting) {
  const locations = Array.isArray(posting?.jobLocation) ? posting.jobLocation : [posting?.jobLocation].filter(Boolean)
  return locations.map((location) => {
    const address = location?.address ?? location
    if (typeof address === 'string') return address
    return cleanText([
      address?.addressLocality,
      address?.addressRegion,
      address?.addressCountry,
    ].filter(Boolean).join(', '))
  }).filter(Boolean).join('; ')
}

function salaryFromJobPosting(posting) {
  const salary = posting?.baseSalary
  const value = salary?.value ?? salary
  if (!value || typeof value !== 'object') return ''
  const min = value.minValue
  const max = value.maxValue
  const unit = value.unitText || salary.currency || ''
  if (min && max) return cleanText(`${min}-${max} ${unit}`)
  if (value.value) return cleanText(`${value.value} ${unit}`)
  return ''
}

function textFromJobPosting(posting) {
  if (!posting) return ''
  return cleanText([
    posting.title,
    posting.hiringOrganization?.name,
    locationFromJobPosting(posting),
    salaryFromJobPosting(posting),
    htmlToText(posting.description || ''),
    ...(Array.isArray(posting.responsibilities) ? posting.responsibilities : [posting.responsibilities]).filter(Boolean),
    ...(Array.isArray(posting.qualifications) ? posting.qualifications : [posting.qualifications]).filter(Boolean),
    ...(Array.isArray(posting.skills) ? posting.skills : [posting.skills]).filter(Boolean),
  ].filter(Boolean).join('\n\n'))
}

function normalizeJobUrl(value) {
  const url = new URL(String(value || '').trim())
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('JOB_URL_PROTOCOL_UNSUPPORTED')
  return url
}

async function fetchJobUrl(rawUrl) {
  const url = normalizeJobUrl(rawUrl)
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 20000)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5',
        'User-Agent': 'Mozilla/5.0 (compatible; A1JobsBot/0.1; +https://a1design.app)',
      },
    })
    const contentType = res.headers.get('content-type') || ''
    const raw = await res.text()
    if (!res.ok) throw new Error(`JOB_URL_HTTP_${res.status}`)
    const clipped = raw.slice(0, 750000)
    const posting = contentType.includes('html') ? jobPostingFromJsonLd(clipped) : null
    const text = (textFromJobPosting(posting) || htmlToText(clipped)).slice(0, 45000)
    if (!text || text.length < 120) throw new Error('JOB_URL_NO_READABLE_TEXT')
    return {
      url: url.href,
      finalUrl: res.url,
      status: res.status,
      contentType,
      title: posting?.title || titleFromHtml(clipped),
      company: posting?.hiringOrganization?.name || '',
      location: locationFromJobPosting(posting),
      salaryRange: salaryFromJobPosting(posting),
      text,
    }
  } finally {
    clearTimeout(timer)
  }
}

function buildJobsPrompt(route, body) {
  const task = JOB_TASKS[route] || 'Assist with the job application workflow.'
  return [
    'You are the A1 Jobs assistant running behind the local A1 Codex bridge.',
    '',
    'Hard rules:',
    '- Use only the user-provided candidate profile, job post, communications, contacts, and form scan.',
    '- Do not fabricate experience, credentials, education, employment history, contacts, salary, or company facts.',
    '- If a fact is missing, leave it blank, mark it for review, or put it in warnings/questions.',
    '- Draft application material in the candidate voice but keep it truthful.',
    '- Do not scrape sites, automate external submissions, send messages, or claim an application was submitted.',
    '- For form mapping, return values only for fields that can be confidently mapped. Required unknown fields must set needsReview true.',
    '- Return final JSON matching the provided schema.',
    '',
    `<task>${task}</task>`,
    '',
    '<payload>',
    safeJson(body),
    '</payload>',
  ].join('\n')
}

async function runCodexJobs(route, body) {
  const scratchDir = await mkdtemp(resolve(tmpdir(), 'a1-jobs-codex-'))
  const outputPath = resolve(scratchDir, 'last-message.json')
  const startedAt = Date.now()

  return new Promise((resolveRun, reject) => {
    const args = [
      'exec',
      '--json',
      '--sandbox',
      'read-only',
      '--cd',
      repoRoot,
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
        const events = parseJsonLines(stdout)
        const failure = codexRunFailure(events, code)
        if (failure) {
          const error = new Error(failure)
          error.code = code
          error.stderr = stderr
          reject(error)
          return
        }
        const lastMessage = (await readFile(outputPath, 'utf8')).trim()
        resolveRun({
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

    child.stdin.end(buildJobsPrompt(route, body))
  })
}

function sendCodexError(res, route, error, origin) {
  const status = error?.message?.startsWith('BODY_TOO_LARGE') || error?.message === 'INVALID_JSON' ? 400 : 502
  console.error(`[a1-jobs-codex-bridge] ${route} failed: ${error?.message || 'CODEX_BRIDGE_ERROR'}`)
  sendJson(res, status, {
    ok: false,
    error: error?.message || 'CODEX_BRIDGE_ERROR',
    code: error?.code,
    detail: error?.stderr || '',
  }, origin)
}

const server = createServer(async (req, res) => {
  const origin = req.headers.origin
  if (!isLocalAddress(req.socket.remoteAddress)) {
    sendJson(res, 403, { ok: false, error: 'Local connections only' }, origin)
    return
  }
  if (!originAllowed(origin)) {
    sendJson(res, 403, { ok: false, error: 'Origin is not allowed' }, origin)
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
      routes: Object.keys(JOB_TASKS),
    }, origin)
    return
  }
  if (req.method === 'POST' && JOB_TASKS[req.url]) {
    try {
      const body = await readBody(req)
      if (req.url === '/codex/jobs/import-job-url') {
        const fetched = await fetchJobUrl(body.url || body.job?.applicationUrl || body.job?.sourceUrl)
        const run = await runCodexJobs(req.url, {
          ...body,
          fetched,
          job: {
            ...(body.job ?? {}),
            title: body.job?.title || fetched.title,
            company: body.job?.company || fetched.company,
            sourceUrl: body.job?.sourceUrl || fetched.finalUrl,
            applicationUrl: body.job?.applicationUrl || fetched.finalUrl,
            jobDescription: fetched.text,
            location: body.job?.location || fetched.location,
            salaryRange: body.job?.salaryRange || fetched.salaryRange,
          },
        })
        sendJson(res, 200, { ok: true, fetched, ...run }, origin)
        return
      }
      const run = await runCodexJobs(req.url, body)
      sendJson(res, 200, { ok: true, ...run }, origin)
    } catch (error) {
      sendCodexError(res, req.url, error, origin)
    }
    return
  }
  sendJson(res, 404, { ok: false, error: 'Not found' }, origin)
})

server.on('error', (error) => {
  handleListenError(error).finally(() => {
    process.exit(process.exitCode || 0)
  })
})

server.listen(port, host, () => {
  console.log(`A1 Jobs Codex bridge running on http://${host}:${port}`)
  console.log(`Allowed origins: ${Array.from(allowedOrigins).join(', ')}`)
  console.log('Mode: codex exec --sandbox read-only')
})
