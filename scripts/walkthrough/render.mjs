#!/usr/bin/env node
import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import {
  parseArgs,
  relativeFromRoot,
  repoRoot,
  writeJson,
} from './walkthrough-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const artifactDir = resolveArtifactDir(args._[0])
const inputPath = resolve(artifactDir, 'remotion-input.json')
if (!existsSync(inputPath)) {
  console.error(`Missing remotion-input.json in ${relativeFromRoot(artifactDir)}`)
  process.exit(1)
}

const input = JSON.parse(readFileSync(inputPath, 'utf8'))
const narration = readNarration(artifactDir, input.composition?.id)
const renderInput = narration ? mergeNarration(input, narration) : input
renderInput.showCaptions = Boolean(args.captions)
const entryPoint = resolve(repoRoot, 'scripts/walkthrough/remotion/index.jsx')
const outputLocation = resolve(artifactDir, args.output || `${renderInput.composition?.id || 'walkthrough'}.mp4`)
mkdirSync(dirname(outputLocation), { recursive: true })

console.log(`bundling Remotion composition for ${relativeFromRoot(artifactDir)}`)
const serveUrl = await bundle({
  entryPoint,
  publicDir: artifactDir,
  onProgress: (progress) => {
    if (progress === 1) console.log('bundle ready')
  },
})

const composition = await selectComposition({
  serveUrl,
  id: 'Walkthrough',
  inputProps: { input: renderInput },
  logLevel: 'warn',
})

console.log(`rendering ${relativeFromRoot(outputLocation)}`)
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation,
  inputProps: { input: renderInput },
  overwrite: true,
  logLevel: 'warn',
  onProgress: ({ progress }) => {
    const percent = Math.round(progress * 100)
    if (percent % 20 === 0) process.stdout.write(` ${percent}%`)
  },
})
process.stdout.write('\n')

const renderManifest = {
  generatedAt: new Date().toISOString(),
  artifactDir: relativeFromRoot(artifactDir),
  input: relativeFromRoot(inputPath),
  narration: narration ? relativeFromRoot(resolve(artifactDir, 'narration', `${renderInput.composition.id}.narration.json`)) : null,
  output: relativeFromRoot(outputLocation),
  composition: {
    id: composition.id,
    width: composition.width,
    height: composition.height,
    fps: composition.fps,
    durationInFrames: composition.durationInFrames,
  },
}
writeJson(resolve(artifactDir, 'render.json'), renderManifest)
console.log(`done → ${relativeFromRoot(outputLocation)}`)

function readNarration(dir, id) {
  const narrationDir = resolve(dir, 'narration')
  if (!existsSync(narrationDir)) return null
  const preferred = id ? resolve(narrationDir, `${id}.narration.json`) : null
  if (preferred && existsSync(preferred)) return JSON.parse(readFileSync(preferred, 'utf8'))
  const file = readdirSync(narrationDir).find((entry) => entry.endsWith('.narration.json'))
  return file ? JSON.parse(readFileSync(resolve(narrationDir, file), 'utf8')) : null
}

function mergeNarration(input, narration) {
  const originalById = new Map((input.timeline || []).map((step) => [step.id, step]))
  const timeline = narration.steps.map((step) => {
    const original = originalById.get(step.id) || {}
    return {
      ...original,
      id: step.id,
      title: step.title,
      startMs: step.startMs,
      endMs: step.endMs,
      narration: step.text,
      audio: step.audio?.path ? `narration/${step.audio.path}` : null,
      cursor: step.cursor ?? original.cursor ?? null,
      typedText: step.typedText ?? original.typedText ?? null,
      wordTimings: step.wordTimings,
    }
  })
  const durationMs = Math.max(
    ...timeline.map((step) => step.endMs),
    narration.audio?.track?.durationMs || 0,
    input.composition?.durationMs || 1000,
  )
  return {
    ...input,
    renderMode: 'screenshots',
    composition: {
      ...input.composition,
      durationMs,
    },
    assets: {
      ...input.assets,
    },
    narration: {
      mode: narration.mode,
      provider: narration.audio?.provider || null,
      wordsPerMinute: narration.wordsPerMinute,
      audio: narration.audio?.track
        ? {
            ...narration.audio.track,
            path: `narration/${narration.audio.track.path}`,
          }
        : null,
    },
    timeline,
  }
}

function resolveArtifactDir(input) {
  if (input) return resolve(process.cwd(), input)
  const root = resolve(repoRoot, 'walkthroughs/artifacts')
  const latest = findLatestArtifact(root)
  if (!latest) {
    console.error('No artifact folder found. Pass one explicitly, for example:')
    console.error('npm run walkthrough:render -- walkthroughs/artifacts/demo-global-search/<timestamp>')
    process.exit(1)
  }
  return latest
}

function findLatestArtifact(root) {
  if (!existsSync(root)) return null
  const candidates = []
  visit(root, candidates)
  return candidates.sort((a, b) => b.mtimeMs - a.mtimeMs)[0]?.dir ?? null
}

function visit(dir, candidates) {
  const entries = readdirSync(dir, { withFileTypes: true })
  if (entries.some((entry) => entry.isFile() && entry.name === 'remotion-input.json')) {
    candidates.push({ dir, mtimeMs: statSync(resolve(dir, 'remotion-input.json')).mtimeMs })
    return
  }
  entries.filter((entry) => entry.isDirectory()).forEach((entry) => visit(resolve(dir, entry.name), candidates))
}
