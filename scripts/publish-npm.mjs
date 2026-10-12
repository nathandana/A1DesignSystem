// Release only the two public packages already supported by publish.yml.
import { execFileSync } from 'node:child_process'
import { appendFileSync, readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const registry = 'https://registry.npmjs.org'
const root = fileURLToPath(new URL('../', import.meta.url))
const packages = ['packages/react', 'packages/react-native']

function compareVersions(a, b) {
  for (const version of [a, b]) {
    if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`Expected a stable version, got ${version}`)
  }
  const left = a.split('.').map(Number)
  const right = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if (left[i] !== right[i]) return left[i] - right[i]
  }
  return 0
}

export function publicationAction(manifest, metadata) {
  if (manifest.private) throw new Error(`Refusing to publish private package ${manifest.name}`)
  compareVersions(manifest.version, manifest.version)
  const latest = metadata['dist-tags']?.latest
  if (latest && compareVersions(latest, manifest.version) > 0) {
    // A rerun of an older release must never move latest backwards.
    return 'superseded'
  }
  if (!metadata.versions?.[manifest.version]) return 'publish'
  if (latest !== manifest.version) {
    throw new Error(`${manifest.name}@${manifest.version} exists, but latest is ${latest ?? 'missing'}. Repair the latest tag before retrying.`)
  }
  return 'verified'
}

export async function readRegistry(name, request = fetch) {
  const response = await request(`${registry}/${encodeURIComponent(name)}?release-check=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' },
    signal: AbortSignal.timeout(30_000),
  })
  if (response.status === 404) return {}
  if (!response.ok) throw new Error(`npm registry lookup failed for ${name}: HTTP ${response.status}`)
  return response.json()
}

export async function verifyPublication(manifest, integrity, {
  lookup = readRegistry, sleep = delay, attempts = 30,
} = {}) {
  // npm accepts uploads asynchronously; public metadata can lag by minutes.
  for (let attempt = 0; attempt < attempts; attempt++) {
    const metadata = await lookup(manifest.name)
    const published = metadata.versions?.[manifest.version]
    if (published && metadata['dist-tags']?.latest === manifest.version) {
      if (published.dist?.integrity !== integrity) {
        throw new Error(`Published integrity does not match ${manifest.name}@${manifest.version}`)
      }
      return
    }
    if (attempt < attempts - 1) await sleep(10_000)
  }
  throw new Error(`npm has not confirmed ${manifest.name}@${manifest.version} as latest. Check the registry, then rerun this workflow.`)
}

async function main() {
  for (const directory of packages) {
    const cwd = `${root}${directory}`
    const manifest = JSON.parse(readFileSync(`${cwd}/package.json`, 'utf8'))
    const action = publicationAction(manifest, await readRegistry(manifest.name))
    if (action === 'publish') {
      const [tarball] = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd, encoding: 'utf8' }))
      execFileSync('npm', ['publish', '--access=public', '--tag=latest', `--registry=${registry}`], { cwd, stdio: 'inherit' })
      await verifyPublication(manifest, tarball.integrity)
    }
    const result = action === 'superseded' ? 'superseded by a newer release; latest unchanged' : 'verified on npm as latest'
    const message = `${manifest.name}@${manifest.version}: ${result}`
    console.log(message)
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `- ${message}\n`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1 })
}
