#!/usr/bin/env node
import { resolve } from 'node:path'
import { parseArgs, repoRoot, slug, starterYamlFromPrompt, writeText } from './walkthrough-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const prompt = args.prompt || args._.join(' ')
if (!prompt.trim()) {
  console.error('Usage: npm run walkthrough:prompt -- "Describe the flow to demo"')
  process.exit(1)
}

const id = slug(prompt)
const outPath = resolve(repoRoot, args.out || `walkthroughs/${id}.walkthrough.yaml`)
writeText(outPath, starterYamlFromPrompt(prompt))
console.log(`done → ${outPath.replace(`${repoRoot}/`, '')}`)
