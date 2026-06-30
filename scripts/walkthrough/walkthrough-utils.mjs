import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, stringify } from 'yaml'

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

export function readWalkthroughSpec(specPath) {
  const absolutePath = resolve(process.cwd(), specPath)
  const raw = readFileSync(absolutePath, 'utf8')
  const spec = parse(raw)
  validateWalkthroughSpec(spec, specPath)
  return normalizeWalkthroughSpec(spec, absolutePath)
}

export function validateWalkthroughSpec(spec, specPath = 'walkthrough.yaml') {
  if (!spec || typeof spec !== 'object') {
    throw new Error(`${specPath} must contain an object`)
  }
  if (!spec.id || typeof spec.id !== 'string') {
    throw new Error(`${specPath} must include a string id`)
  }
  if (!spec.title || typeof spec.title !== 'string') {
    throw new Error(`${specPath} must include a string title`)
  }
  if (!Array.isArray(spec.steps) || spec.steps.length === 0) {
    throw new Error(`${specPath} must include at least one step`)
  }
  spec.steps.forEach((step, index) => {
    if (!step || typeof step !== 'object') throw new Error(`Step ${index + 1} must be an object`)
    if (!step.id || typeof step.id !== 'string') throw new Error(`Step ${index + 1} must include a string id`)
    if (!step.title || typeof step.title !== 'string') throw new Error(`Step ${step.id} must include a string title`)
    const actions = Array.isArray(step.actions) ? step.actions : [step.action ?? actionFromStep(step)].filter(Boolean)
    if (actions.length === 0) throw new Error(`Step ${step.id} must include an action or actions`)
  })
}

export function normalizeWalkthroughSpec(spec, absolutePath = '') {
  return {
    ...spec,
    source: absolutePath ? relativeFromRoot(absolutePath) : undefined,
    id: slug(spec.id),
    title: spec.title,
    baseUrl: (spec.baseUrl || process.env.A1_WALKTHROUGH_BASE_URL || process.env.A1_BASE_URL || 'http://127.0.0.1:5177').replace(/\/$/, ''),
    outputDir: spec.outputDir || `walkthroughs/artifacts/${slug(spec.id)}`,
    viewport: {
      width: Number(spec.viewport?.width || 1280),
      height: Number(spec.viewport?.height || 720),
    },
    deviceScaleFactor: Number(spec.deviceScaleFactor || 1),
    reducedMotion: spec.reducedMotion ?? 'reduce',
    recordVideo: spec.recordVideo !== false,
    steps: spec.steps.map((step, index) => ({
      ...step,
      id: slug(step.id || `step-${index + 1}`),
      title: step.title,
      narration: step.narration || step.title,
      actions: Array.isArray(step.actions)
        ? step.actions
        : [step.action ?? actionFromStep(step)].filter(Boolean),
      capture: step.capture !== false,
      callouts: Array.isArray(step.callouts) ? step.callouts : [],
    })),
  }
}

export function actionFromStep(step) {
  const actionKeys = ['goto', 'click', 'fill', 'press', 'hover', 'waitForText', 'waitForSelector', 'wait']
  const action = {}
  actionKeys.forEach((key) => {
    if (step[key] !== undefined) action[key] = step[key]
  })
  return Object.keys(action).length ? action : null
}

export function resolveArtifactDir(spec, overrideDir) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const baseDir = overrideDir || spec.outputDir
  return resolve(repoRoot, baseDir, timestamp)
}

export function writeJson(filePath, data) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)
}

export function writeText(filePath, text) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, text)
}

export function relativeFromRoot(filePath) {
  return resolve(filePath).replace(`${repoRoot}/`, '')
}

export function slug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'walkthrough'
}

export function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (!arg.startsWith('--')) {
      args._.push(arg)
      continue
    }
    const key = arg.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith('--')) {
      args[key] = true
    } else {
      args[key] = next
      i += 1
    }
  }
  return args
}

export function estimateSpeechSegments(text, startMs = 0, wordsPerMinute = 145) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean)
  const wordMs = Math.round(60000 / wordsPerMinute)
  return words.map((word, index) => ({
    word,
    startMs: startMs + index * wordMs,
    endMs: startMs + (index + 1) * wordMs,
  }))
}

export function formatSrtTime(ms) {
  const total = Math.max(0, Math.round(ms))
  const hours = Math.floor(total / 3600000)
  const minutes = Math.floor((total % 3600000) / 60000)
  const seconds = Math.floor((total % 60000) / 1000)
  const millis = total % 1000
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${String(millis).padStart(3, '0')}`
}

export function stepFileName(index, step, extension) {
  return `${String(index + 1).padStart(2, '0')}-${slug(step.id || step.title)}.${extension}`
}

export function starterYamlFromPrompt(prompt) {
  const safeTitle = prompt.trim() || 'Feature walkthrough'
  return stringify({
    id: slug(safeTitle),
    title: safeTitle,
    baseUrl: 'http://127.0.0.1:5177',
    viewport: { width: 1280, height: 720 },
    recordVideo: true,
    steps: [
      {
        id: 'open-home',
        title: 'Open A1',
        narration: 'Start on the A1 home page.',
        goto: '/',
      },
      {
        id: 'show-feature',
        title: 'Show the feature',
        narration: prompt.trim() || 'Describe the feature being shown.',
        waitForText: 'A1',
      },
    ],
  })
}

function pad(value) {
  return String(value).padStart(2, '0')
}

export function defaultSpecPath(input) {
  return input || 'walkthroughs/a1-global-search.walkthrough.yaml'
}

export function artifactBasename(filePath) {
  return basename(filePath)
}
