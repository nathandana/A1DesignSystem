import assert from 'node:assert/strict'
import test from 'node:test'
import { publicationAction, readRegistry, verifyPublication } from './publish-npm.mjs'

const manifest = { name: '@a1/test', version: '0.33.0' }
const released = { 'dist-tags': { latest: '0.33.0' }, versions: { '0.33.0': { dist: { integrity: 'expected' } } } }

test('publishes missing versions and safely skips already released versions', () => {
  assert.equal(publicationAction(manifest, {}), 'publish')
  assert.equal(publicationAction(manifest, released), 'verified')
})

test('older releases never roll back latest, including numeric version boundaries', () => {
  assert.equal(publicationAction(manifest, { 'dist-tags': { latest: '0.100.0' } }), 'superseded')
  assert.equal(publicationAction(manifest, { 'dist-tags': { latest: '0.9.0' } }), 'publish')
})

test('rejects private packages, prereleases and an existing version with a wrong latest tag', () => {
  assert.throws(() => publicationAction({ ...manifest, private: true }, {}), /private/)
  assert.throws(() => publicationAction({ ...manifest, version: '1.0.0-beta.1' }, {}), /stable/)
  assert.throws(() => publicationAction(manifest, { ...released, 'dist-tags': { latest: '0.29.0' } }), /Repair/)
})

test('registry outages are errors, not unpublished packages', async () => {
  assert.deepEqual(await readRegistry(manifest.name, async () => ({ status: 404 })), {})
  await assert.rejects(readRegistry(manifest.name, async () => ({ status: 503, ok: false })), /HTTP 503/)
})

test('waits for registry propagation and checks the uploaded integrity', async () => {
  let lookups = 0
  await verifyPublication(manifest, 'expected', {
    lookup: async () => ++lookups === 1 ? {} : released,
    sleep: async () => {}, attempts: 2,
  })
  assert.equal(lookups, 2)
  await assert.rejects(verifyPublication(manifest, 'wrong', { lookup: async () => released }), /integrity/)
})

test('fails when the published version or latest tag never appears', async () => {
  for (const metadata of [{}, { ...released, 'dist-tags': { latest: '0.29.0' } }]) {
    await assert.rejects(verifyPublication(manifest, 'expected', {
      lookup: async () => metadata, sleep: async () => {}, attempts: 2,
    }), /not confirmed/)
  }
})
