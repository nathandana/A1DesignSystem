#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  defaultSpecPath,
  estimateSpeechSegments,
  formatSrtTime,
  parseArgs,
  readWalkthroughSpec,
  repoRoot,
  writeJson,
  writeText,
} from './walkthrough-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const input = args._[0] || defaultSpecPath()
const outDir = resolve(repoRoot, args['out-dir'] || 'walkthroughs/narration')
const wordsPerMinute = Number(args.wpm || 145)
const minStepMs = Number(args['min-step-ms'] || 4200)
const singleTrack = Boolean(args['single-track'])
const stepGapMs = Number(args['step-gap-ms'] ?? (singleTrack ? 0 : 900))
const source = readSource(input)
const sourceSteps = source.steps || []
const baseSteps = sourceSteps.map((step, index) => {
  const text = step.narration || step.text || step.title
  const originalStartMs = Number(step.startedAtMs ?? 0)
  const originalEndMs = Number(step.endedAtMs ?? originalStartMs)
  const specifiedDurationMs = Number(step.durationMs || 0)
  const cueMs = Number.isFinite(Number(step.cueMs)) ? Number(step.cueMs) : null
  const nextCueMs = Number.isFinite(Number(sourceSteps[index + 1]?.cueMs)) ? Number(sourceSteps[index + 1].cueMs) : null
  const estimatedSpeechMs = estimateSpeechSegments(text, 0, wordsPerMinute).at(-1)?.endMs || minStepMs
  const durationMs = args['capture-timings']
    ? Math.max(1200, originalEndMs - originalStartMs)
    : cueMs !== null && nextCueMs !== null
      ? Math.max(600, nextCueMs - cueMs)
    : specifiedDurationMs > 0
      ? specifiedDurationMs
    : Math.max(minStepMs, estimatedSpeechMs + 1400)
  return {
    id: step.id,
    title: step.title,
    text,
    originalStartMs,
    originalEndMs,
    cueMs,
    durationMs,
  }
})

const audio = args.voiceover ? generateVoiceover(source, baseSteps, outDir, wordsPerMinute, { singleTrack }) : null
let cursorMs = 0
const steps = baseSteps.map((step, index) => {
  const audioStep = audio?.steps?.[index]
  const durationMs = audioStep
    ? Math.max(minStepMs, audioStep.durationMs + 1100)
    : step.durationMs
  const startMs = args['capture-timings']
    ? step.originalStartMs
    : step.cueMs !== null
      ? step.cueMs
      : cursorMs
  const endMs = startMs + durationMs
  cursorMs = endMs + stepGapMs
  return {
    id: step.id,
    title: step.title,
    text: step.text,
    startMs,
    endMs,
    durationMs,
    audio: audioStep ? { ...audioStep, startMs, endMs } : null,
    wordTimings: estimateSpeechSegments(step.text, startMs, wordsPerMinute),
  }
})

const narration = {
  id: source.id,
  title: source.title,
  generatedAt: new Date().toISOString(),
  mode: audio ? 'local-voiceover' : 'manifest',
  note: audio
    ? 'Voiceover generated locally with macOS say. Replace with provider TTS when richer voices or exact word timestamps are needed.'
    : 'This file is a deterministic narration plan. Run with --voiceover on macOS to create local audio.',
  wordsPerMinute,
  audio,
  steps,
}

writeJson(resolve(outDir, `${source.id}.narration.json`), narration)
writeText(resolve(outDir, `${source.id}.captions.srt`), toSrt(steps))
writeText(resolve(outDir, `${source.id}.script.md`), toMarkdown(source, steps))
console.log(`done → ${outDir.replace(`${repoRoot}/`, '')}`)

function readSource(inputPath) {
  const absolute = resolve(process.cwd(), inputPath)
  if (inputPath.endsWith('.json') && existsSync(absolute)) {
    return JSON.parse(readFileSync(absolute, 'utf8'))
  }
  return readWalkthroughSpec(inputPath)
}

function toSrt(steps) {
  return `${steps.map((step, index) => [
    String(index + 1),
    `${formatSrtTime(step.startMs)} --> ${formatSrtTime(step.endMs)}`,
    step.text,
  ].join('\n')).join('\n\n')}\n`
}

function toMarkdown(source, steps) {
  const lines = [`# ${source.title}`, '']
  steps.forEach((step, index) => {
    lines.push(`## ${index + 1}. ${step.title}`)
    lines.push('')
    lines.push(step.text)
    lines.push('')
  })
  return lines.join('\n')
}

function generateVoiceover(source, steps, outputDir, rate, options = {}) {
  if (!hasCommand('say') || !hasCommand('afconvert') || !hasCommand('afinfo')) {
    console.warn('voiceover skipped: macOS say, afconvert, and afinfo are required')
    return null
  }
  const script = steps.map((step) => step.text).join('\n\n')
  writeText(resolve(outputDir, `${source.id}.voiceover.txt`), script)
  if (options.singleTrack) {
    const aiffPath = resolve(outputDir, `${source.id}.aiff`)
    const m4aPath = resolve(outputDir, `${source.id}.m4a`)
    execFileSync('say', ['-r', String(rate), '-o', aiffPath, script], { stdio: 'ignore' })
    execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', aiffPath, m4aPath], { stdio: 'ignore' })
    return {
      provider: 'macos-say',
      voice: 'system-default',
      rate,
      track: {
        path: `${source.id}.m4a`,
        format: 'm4a',
        durationMs: audioDurationMs(m4aPath),
      },
      steps: [],
    }
  }
  const audioSteps = steps.map((step, index) => {
    const fileId = `${String(index + 1).padStart(2, '0')}-${step.id}`
    const aiffPath = resolve(outputDir, `${fileId}.aiff`)
    const m4aPath = resolve(outputDir, `${fileId}.m4a`)
    execFileSync('say', ['-r', String(rate), '-o', aiffPath, step.text], { stdio: 'ignore' })
    execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', aiffPath, m4aPath], { stdio: 'ignore' })
    return {
      path: `${fileId}.m4a`,
      format: 'm4a',
      durationMs: audioDurationMs(m4aPath),
    }
  })
  return {
    provider: 'macos-say',
    voice: 'system-default',
    rate,
    steps: audioSteps,
  }
}

function audioDurationMs(filePath) {
  const output = execFileSync('afinfo', [filePath], { encoding: 'utf8' })
  const match = output.match(/estimated duration:\s*([0-9.]+)\s*sec/i)
  return match ? Math.round(Number(match[1]) * 1000) : 4200
}

function hasCommand(command) {
  try {
    execFileSync('which', [command], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}
