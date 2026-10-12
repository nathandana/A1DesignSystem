import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { parseReleaseNotes } from '../src/release-notes.js'

test('public release notes skip unreleased work and preserve wrapped entries and history', () => {
  const notes = parseReleaseNotes(`# Labs
## Unreleased
- Not ready yet.
## 0.3.0 — Oct. 11, 2026
- **New page** — First line
  continued here.

- Another change.
## 0.2.0 — Oct. 10, 2026
- Earlier change.
`)
  assert.deepEqual(notes, [
    { version: '0.3.0', date: 'Oct. 11, 2026', entries: ['**New page** — First line continued here.', 'Another change.'] },
    { version: '0.2.0', date: 'Oct. 10, 2026', entries: ['Earlier change.'] },
  ])
})

test('public release version stays synchronized with the package and lockfile', () => {
  const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')
  const notes = parseReleaseNotes(read('../CHANGELOG.md'))
  const { version } = JSON.parse(read('../package.json'))
  const lock = JSON.parse(read('../../../package-lock.json'))
  assert.equal(notes[0].version, version)
  assert.equal(lock.packages['apps/a1-labs'].version, version)
  assert.ok(notes.every(release => release.entries.length > 0))
  assert.equal(new Set(notes.map(release => release.version)).size, notes.length)
})
