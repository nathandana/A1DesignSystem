import test from 'node:test'
import assert from 'node:assert/strict'
import { FIELDS, REQUIRED, VARIANTS, emptyValues, requiredExample, requiredProgress, validate } from '../src/required-fields/form-model.js'

test('a complex form mixing required and optional fields of every kind', () => {
  assert.equal(REQUIRED.length, 10)
  assert.equal(FIELDS.length - REQUIRED.length, 6)
  const kinds = new Set(FIELDS.map(field => field.kind ?? 'text'))
  assert.deepEqual([...kinds].sort(), ['checkbox', 'radio', 'select', 'text', 'textarea'])
  assert.ok(REQUIRED.every(field => field.missing), 'every required field has a message')
})

test('five new variations, subtle to extreme, each with a submission treatment', () => {
  assert.deepEqual(VARIANTS.map(variant => variant.id), ['tick', 'ink', 'rings', 'opt-in', 'rail'])
  assert.ok(VARIANTS.every(variant => variant.note && variant.onSubmit && ['field', 'checklist'].includes(variant.focus)))
})

test('every optional field can be added on request', () => {
  assert.ok(FIELDS.filter(field => !field.required).every(field => field.addLabel))
})

test('an empty form reports every required field, in form order', () => {
  const errors = validate(emptyValues())
  assert.deepEqual(Object.keys(errors), REQUIRED.map(field => field.id))
})

test('required answers alone are valid; optional fields never block', () => {
  assert.deepEqual(validate(requiredExample()), {})
  assert.deepEqual(requiredProgress(requiredExample()), { done: 10, total: 10 })
  assert.deepEqual(requiredProgress(emptyValues()), { done: 0, total: 10 })
})

test('format checks on email and ZIP code', () => {
  const values = { ...requiredExample(), email: 'ada@', zip: '972' }
  assert.deepEqual(Object.keys(validate(values)), ['email', 'zip'])
  assert.equal(validate({ ...requiredExample(), firstName: '   ' }).firstName, 'Enter your first name.')
})
