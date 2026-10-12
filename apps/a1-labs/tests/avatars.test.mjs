import test from 'node:test'
import assert from 'node:assert/strict'
import { AVATAR_TINTS, avatarLabel, hashName, initialsFor, patternFor, tintFor } from '../src/avatars/avatar-model.js'

test('initials use the first and last words, one or two letters', () => {
  assert.equal(initialsFor('Nathan Dana'), 'ND')
  assert.equal(initialsFor('Mary Anne Smith'), 'MS')
  assert.equal(initialsFor('Cher'), 'C')
  assert.equal(initialsFor('Nathan Dana', 1), 'N')
  assert.equal(initialsFor('  '), '')
  assert.equal(initialsFor(undefined), '')
  assert.equal(initialsFor('Émile Zola'), 'ÉZ')
  assert.equal(initialsFor('𝒜da Lovelace'), '𝒜L', 'surrogate pairs stay whole')
})

test('tint and pattern are deterministic, case- and space-insensitive', () => {
  assert.equal(hashName('Sam Rivera'), hashName('  sam rivera '))
  assert.equal(tintFor('Sam Rivera'), tintFor('Sam Rivera'))
  assert.ok(AVATAR_TINTS.includes(tintFor('Anyone')))
  assert.deepEqual(patternFor('Sam Rivera'), patternFor('Sam Rivera'))
  const tones = new Set(['Alex Morgan', 'Sam Rivera', 'Jordan Chen', 'Taylor Brooks', 'Casey Patel', 'Riley James', 'Avery Kim', 'Cameron Reed'].map(tintFor))
  assert.ok(tones.size >= 3, 'names spread across the palette')
})

test('patterns are mirrored and never have an empty row', () => {
  for (const name of ['Nathan Dana', 'A', '', 'Taylor Brooks']) {
    const rows = patternFor(name)
    assert.equal(rows.length, 5)
    for (const row of rows) {
      assert.equal(row.length, 5)
      assert.deepEqual(row, [...row].reverse(), `${name} is symmetric`)
      assert.ok(row.some(Boolean), `${name} row is not empty`)
    }
  }
  assert.notDeepEqual(patternFor('Alex Morgan'), patternFor('Sam Rivera'))
})

test('accessible name includes status only when shown', () => {
  assert.equal(avatarLabel('Nathan Dana'), 'Nathan Dana')
  assert.equal(avatarLabel('Nathan Dana', 'away'), 'Nathan Dana, Away')
  assert.equal(avatarLabel(' ', 'online'), 'Online')
})
