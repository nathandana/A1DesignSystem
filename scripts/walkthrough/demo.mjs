#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { defaultSpecPath, parseArgs, repoRoot } from './walkthrough-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const specPath = defaultSpecPath(args._[0])
const outDir = args['out-dir'] || 'walkthroughs/artifacts/demo-global-search'
const captureArgs = ['scripts/walkthrough/capture.mjs', specPath, '--out-dir', outDir]
if (args['base-url']) captureArgs.push('--base-url', args['base-url'])
if (args.headed) captureArgs.push('--headed')

runNode(captureArgs)
const artifactDir = latestArtifact(resolve(repoRoot, outDir))
if (!artifactDir) throw new Error(`No artifact folder found in ${outDir}`)
runNode(['scripts/walkthrough/narration.mjs', resolve(artifactDir, 'walkthrough.json'), '--out-dir', resolve(artifactDir, 'narration'), '--voiceover', '--single-track'])
const renderArgs = ['scripts/walkthrough/render.mjs', artifactDir]
if (args.captions) renderArgs.push('--captions')
runNode(renderArgs)

function runNode(argsForNode) {
  execFileSync(process.execPath, argsForNode, { cwd: repoRoot, stdio: 'inherit' })
}

function latestArtifact(root) {
  if (!existsSync(root)) return null
  const candidates = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = resolve(root, entry.name)
      return { dir, mtimeMs: statSync(dir).mtimeMs }
    })
    .filter(({ dir }) => existsSync(resolve(dir, 'walkthrough.json')))
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
  return candidates[0]?.dir ?? null
}
