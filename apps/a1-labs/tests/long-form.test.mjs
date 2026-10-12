import test from 'node:test'
import assert from 'node:assert/strict'
import { SECTIONS, exampleAnswers, formProgress, missingAnswers, visibleSections } from '../src/long-form/form-model.js'

test('the same 20 sections and 60 distinct questions are covered by every treatment', () => {
  assert.equal(SECTIONS.length, 20)
  assert.equal(new Set(SECTIONS.flatMap(section => section.fields.map(field => field.id))).size, 60)
  assert.ok(SECTIONS.every(section => section.fields.length === 3))
  for (const method of ['pages', 'sidenav', 'visual']) {
    const indices = new Set(SECTIONS.flatMap((_, index) => visibleSections(method, index, SECTIONS.length)))
    assert.deepEqual([...indices], Array.from({length:20}, (_, index) => index))
  }
  assert.deepEqual(visibleSections('pages', 19, 20, 1), [19])
  assert.deepEqual(visibleSections('pages', 4, 20, 1), [4])
  assert.deepEqual(visibleSections('pages', 19, 20), [16,17,18,19])
  assert.deepEqual(visibleSections('pages', 4, 6), [4,5])
})
test('completion counts actual answers, rejects whitespace and locates hidden unanswered fields', () => {
  const values = exampleAnswers(SECTIONS, 4)
  assert.equal(formProgress(SECTIONS, values).answered, 12)
  assert.equal(formProgress(SECTIONS, values).complete, 4)
  assert.equal(missingAnswers(SECTIONS, values)[0].section, 4)
  const full = exampleAnswers()
  assert.equal(missingAnswers(SECTIONS, full).length, 0)
  full['s20-q3'] = '   '
  assert.equal(formProgress(SECTIONS, full).answered, 59)
  assert.equal(formProgress(SECTIONS, full).complete, 19)
  assert.deepEqual(missingAnswers(SECTIONS, full).map(field => [field.id, field.section]), [['s20-q3',19]])
})
