import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { tokenFamilies, tokenParts } from '../src/token-styling/token-options.js'
import { indexTokens, traceToken, flattenTrace, tracePaths, cssToken } from '../src/token-hierarchy/hierarchy-model.js'
test('highlighted tokens preserve every character and identify their elements', () => {
  const name = '--semantic-color-surface-card', parts = tokenParts(name)
  assert.equal(parts.map(part => part.text).join(''), name)
  assert.deepEqual(parts.filter(part => part.role !== 'punctuation').map(part => part.role), ['level', 'type', 'group', 'final'])
  const css = readFileSync(new URL('../../../packages/react/src/tokens.css', import.meta.url), 'utf8')
  for (const family of tokenFamilies) for (const token of family.options) assert.ok(css.includes(`${token.token}:`), token.token)
})
test('hierarchy traces real references, branches, missing values and cycles', () => {
  const docs = { 'tokens.json': { component: { sample: { $value: '{semantic.one}' } }, semantic: { one: { $value: '{base.one} {base.two}' } }, base: { one: { $value: '8px' }, two: { $value: '4px' } } } }
  const index = indexTokens(docs), trace = traceToken(index, 'component.sample')
  assert.equal(flattenTrace(trace).length, 4)
  assert.deepEqual(tracePaths(trace).map(path => path.map(node => node.path)), [['component.sample', 'semantic.one', 'base.one'], ['component.sample', 'semantic.one', 'base.two']])
  assert.equal(traceToken(index, 'absent').error, 'Missing reference')
  index['base.one'] = { value: '{component.sample}' }
  assert.ok(flattenTrace(traceToken(index, 'component.sample')).some(node => node.error === 'Circular reference'))
  assert.equal(cssToken('component.card.borderColor'), '--component-card-border-color')
})
