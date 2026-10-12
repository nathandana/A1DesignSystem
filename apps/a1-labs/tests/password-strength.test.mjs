import test from 'node:test'
import assert from 'node:assert/strict'
import { analysePassword, commonWord, describeTime, effectiveLength, levelFor, toneFor } from '../src/password-strength/password-model.js'

const grade = password => analysePassword(password).grade

test('common passwords score lowest, even with look-alike swaps', () => {
  assert.equal(grade('password'), 0)
  assert.equal(grade('P@ssw0rd'), 0)
  assert.equal(commonWord('Summer2024!'), 'summer')
  assert.ok(grade('Summer2024!') <= 1)
})

test('repeats and runs add little length', () => {
  assert.deepEqual(effectiveLength('aaaa'), { length: 2.5, repeats: true, sequence: false })
  assert.equal(effectiveLength('abcdef').sequence, true)
  assert.equal(effectiveLength('qwerty').sequence, true)
  assert.ok(grade('abc12345') <= 1)
})

test('long passphrases are the strongest', () => {
  assert.equal(grade('correct horse battery staple'), 4)
  assert.ok(grade('Kp7#vR2q') >= 2)
  assert.equal(analysePassword('').empty, true)
  assert.equal(analysePassword('').bits, 0)
})

test('rules report each requirement, independent of strength', () => {
  const result = analysePassword('lowercaseonly', { minLength: 12, require: ['upper', 'number'] })
  assert.deepEqual(result.checks.map(check => [check.id, check.met]), [['length', true], ['upper', false], ['number', false]])
  assert.equal(result.meetsRules, false)
  assert.equal(analysePassword('Lowercase only 7', { require: ['upper', 'number'] }).meetsRules, true)
})

test('suggestions are short and relevant', () => {
  const { suggestions } = analysePassword('password1')
  assert.deepEqual(suggestions.map(tip => tip.id), ['common', 'length', 'words'])
  assert.match(suggestions[0].text, /common/)
  assert.deepEqual(analysePassword('correct horse battery staple').suggestions, [])
})

test('grades fold into 3, 4 or 5 levels with matching tones', () => {
  assert.deepEqual([0, 1, 2, 3, 4].map(g => levelFor(g, 3)), [0, 0, 1, 2, 2])
  assert.deepEqual([0, 1, 2, 3].map(l => toneFor(l, 4)), ['error', 'warn', 'info', 'success'])
  assert.deepEqual([0, 1, 2, 3, 4].map(l => toneFor(l, 5)), ['error', 'error', 'warn', 'success', 'success'])
  assert.deepEqual([0, 1, 2].map(l => toneFor(l, 3)), ['error', 'warn', 'success'])
})

test('guessing times read naturally', () => {
  assert.equal(describeTime(0.2), 'instantly')
  assert.equal(describeTime(1), 'about 1 second')
  assert.equal(describeTime(3 * 3600), 'about 3 hours')
  assert.equal(describeTime(1e12), 'centuries')
})
