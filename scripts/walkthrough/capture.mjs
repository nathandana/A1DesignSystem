#!/usr/bin/env node
import { chromium } from '@playwright/test'
import { existsSync, mkdirSync, readdirSync, renameSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  artifactBasename,
  defaultSpecPath,
  estimateSpeechSegments,
  parseArgs,
  readWalkthroughSpec,
  relativeFromRoot,
  resolveArtifactDir,
  stepFileName,
  writeJson,
} from './walkthrough-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const specPath = defaultSpecPath(args._[0])
const spec = readWalkthroughSpec(specPath)
if (args['base-url']) spec.baseUrl = args['base-url'].replace(/\/$/, '')
if (args['out-dir']) spec.outputDir = args['out-dir']
if (args['no-video']) spec.recordVideo = false

const artifactDir = resolveArtifactDir(spec, args['out-dir'])
const screenshotsDir = resolve(artifactDir, 'screenshots')
const videosDir = resolve(artifactDir, 'video')
mkdirSync(screenshotsDir, { recursive: true })
if (spec.recordVideo) mkdirSync(videosDir, { recursive: true })

const browser = await chromium.launch({ headless: !args.headed })
const context = await browser.newContext({
  viewport: spec.viewport,
  deviceScaleFactor: spec.deviceScaleFactor,
  reducedMotion: spec.reducedMotion,
  recordVideo: spec.recordVideo ? { dir: videosDir, size: spec.viewport } : undefined,
})
const page = await context.newPage()

const startEpoch = Date.now()
const steps = []
let failed = false

try {
  for (let index = 0; index < spec.steps.length; index += 1) {
    const step = spec.steps[index]
    const startedAtMs = Date.now() - startEpoch
    console.log(`→ ${index + 1}. ${step.title}`)
    try {
      let cursor = null
      let typedText = null
      for (const action of step.actions) {
        const actionMeta = await runAction(page, spec, action)
        if (actionMeta?.cursor) cursor = actionMeta.cursor
        if (actionMeta?.typedText) typedText = actionMeta.typedText
      }
      await page.waitForTimeout(Number(step.settleMs ?? spec.settleMs ?? 350))
      const screenshotName = step.capture ? stepFileName(index, step, 'png') : null
      if (screenshotName) {
        await page.screenshot({ path: resolve(screenshotsDir, screenshotName), fullPage: false })
      }
      steps.push({
        id: step.id,
        title: step.title,
        narration: step.narration,
        durationMs: step.durationMs,
        cueMs: step.cueMs,
        status: 'passed',
        startedAtMs,
        endedAtMs: Date.now() - startEpoch,
        screenshot: screenshotName ? `screenshots/${screenshotName}` : null,
        cursor,
        typedText,
        callouts: step.callouts,
        wordTimings: estimateSpeechSegments(step.narration, startedAtMs),
      })
    } catch (error) {
      failed = true
      const screenshotName = stepFileName(index, step, 'error.png')
      await page.screenshot({ path: resolve(screenshotsDir, screenshotName), fullPage: false }).catch(() => {})
      steps.push({
        id: step.id,
        title: step.title,
        narration: step.narration,
        durationMs: step.durationMs,
        cueMs: step.cueMs,
        status: 'failed',
        error: error.message,
        startedAtMs,
        endedAtMs: Date.now() - startEpoch,
        screenshot: `screenshots/${screenshotName}`,
        callouts: step.callouts,
        wordTimings: estimateSpeechSegments(step.narration, startedAtMs),
      })
      break
    }
  }
} finally {
  await context.close()
  await browser.close()
}

const videoFile = spec.recordVideo ? moveLatestVideo(videosDir, `${spec.id}.webm`) : null
const endedAtMs = Date.now() - startEpoch
const manifest = {
  id: spec.id,
  title: spec.title,
  source: spec.source,
  baseUrl: spec.baseUrl,
  generatedAt: new Date().toISOString(),
  status: failed ? 'failed' : 'passed',
  durationMs: endedAtMs,
  viewport: spec.viewport,
  artifactDir: relativeFromRoot(artifactDir),
  video: videoFile ? `video/${artifactBasename(videoFile)}` : null,
  steps,
}

writeJson(resolve(artifactDir, 'walkthrough.json'), manifest)
writeJson(resolve(artifactDir, 'timings.json'), {
  id: manifest.id,
  durationMs: manifest.durationMs,
  steps: steps.map(({ id, title, status, startedAtMs, endedAtMs, screenshot, cursor, typedText }) => ({
    id,
    title,
    status,
    startedAtMs,
    endedAtMs,
    durationMs: endedAtMs - startedAtMs,
    screenshot,
    cursor,
    typedText,
  })),
})
writeJson(resolve(artifactDir, 'remotion-input.json'), {
  composition: {
    id: spec.id,
    title: spec.title,
    width: spec.viewport.width,
    height: spec.viewport.height,
    durationMs: manifest.durationMs,
  },
  assets: {
    video: manifest.video,
    screenshots: steps.filter((step) => step.screenshot).map((step) => step.screenshot),
  },
  timeline: steps.map((step) => ({
    id: step.id,
    title: step.title,
    startMs: step.startedAtMs,
    endMs: step.endedAtMs,
    narration: step.narration,
    screenshot: step.screenshot,
    cursor: step.cursor,
    typedText: step.typedText,
    callouts: step.callouts,
  })),
})

console.log(`done → ${relativeFromRoot(artifactDir)}`)
if (failed) process.exitCode = 1

async function runAction(page, spec, action) {
  if (!action || typeof action !== 'object') throw new Error('Action must be an object')
  let actionMeta = null
  if (action.goto !== undefined) {
    const url = absoluteUrl(spec.baseUrl, action.goto)
    await page.goto(url, { waitUntil: action.waitUntil || 'networkidle', timeout: Number(action.timeout || 15000) })
  }
  if (action.click !== undefined) actionMeta = { cursor: await clickTarget(page, action.click, action.timeout) }
  if (action.fill !== undefined) actionMeta = { ...actionMeta, typedText: await fillTarget(page, action.fill, action.timeout) }
  if (action.press !== undefined) await pressTarget(page, action.press, action.timeout)
  if (action.hover !== undefined) actionMeta = { cursor: await hoverTarget(page, action.hover, action.timeout) }
  if (action.waitForText !== undefined) {
    await page.waitForFunction(
      ({ text, exact }) => {
        const bodyText = document.body?.innerText || ''
        return exact ? bodyText.split('\n').some((line) => line.trim() === text) : bodyText.includes(text)
      },
      { text: String(action.waitForText), exact: Boolean(action.exact) },
      { timeout: Number(action.timeout || 8000) },
    )
  }
  if (action.waitForSelector !== undefined) {
    await page.locator(action.waitForSelector).first().waitFor({ timeout: Number(action.timeout || 8000) })
  }
  if (action.wait !== undefined) {
    await page.waitForTimeout(Number(action.wait))
  }
  return actionMeta
}

async function clickTarget(page, target, timeout) {
  const locator = locatorForTarget(page, target)
  const cursor = await cursorForLocator(locator)
  await locator.click({ timeout: Number(timeout || target?.timeout || 8000) })
  return cursor
}

async function fillTarget(page, target, timeout) {
  if (typeof target === 'string') throw new Error('fill requires { selector|label|placeholder, value }')
  const locator = locatorForTarget(page, target)
  const value = String(target.value ?? '')
  await locator.fill(value, { timeout: Number(timeout || target.timeout || 8000) })
  return value
}

async function pressTarget(page, target, timeout) {
  if (typeof target === 'string') {
    await page.keyboard.press(target)
    return
  }
  const locator = target.selector || target.label || target.placeholder || target.role ? locatorForTarget(page, target) : null
  if (locator) {
    await locator.press(target.key, { timeout: Number(timeout || target.timeout || 8000) })
  } else {
    await page.keyboard.press(target.key)
  }
}

async function hoverTarget(page, target, timeout) {
  const locator = locatorForTarget(page, target)
  await locator.hover({ timeout: Number(timeout || target?.timeout || 8000) })
  return cursorForLocator(locator)
}

async function cursorForLocator(locator) {
  await locator.waitFor({ timeout: 8000 })
  const box = await locator.boundingBox()
  if (!box) return null
  return {
    x: Math.round(box.x + box.width / 2),
    y: Math.round(box.y + box.height / 2),
  }
}

function locatorForTarget(page, target) {
  if (typeof target === 'string') return page.locator(target).first()
  if (target.selector) return page.locator(target.selector).first()
  if (target.role) return page.getByRole(target.role, { name: target.name, exact: Boolean(target.exact) }).first()
  if (target.label) return page.getByLabel(target.label, { exact: Boolean(target.exact) }).first()
  if (target.placeholder) return page.getByPlaceholder(target.placeholder, { exact: Boolean(target.exact) }).first()
  if (target.text) return page.getByText(target.text, { exact: Boolean(target.exact) }).first()
  throw new Error(`Unsupported target: ${JSON.stringify(target)}`)
}

function absoluteUrl(baseUrl, value) {
  const next = String(value)
  if (/^https?:\/\//.test(next)) return next
  return `${baseUrl}${next.startsWith('/') ? next : `/${next}`}`
}

function moveLatestVideo(directory, fileName) {
  if (!existsSync(directory)) return null
  const candidates = readdirSync(directory)
    .filter((file) => file.endsWith('.webm'))
    .map((file) => {
      const filePath = resolve(directory, file)
      return { filePath, mtimeMs: statSync(filePath).mtimeMs }
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
  const latest = candidates[0]?.filePath
  if (!latest) return null
  const next = resolve(directory, fileName)
  renameSync(latest, next)
  return next
}
