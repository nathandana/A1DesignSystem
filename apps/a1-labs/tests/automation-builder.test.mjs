import test from 'node:test'
import assert from 'node:assert/strict'
import { initialRule, exampleRule, describeRule, moveAction, presentationFor, testRule, validateRule } from '../src/automation-builder/rule-model.js'
const sample = { event: 'created', priority: 'High', type: 'Bug', status: 'Open' }
test('presentation changes without modifying rule data', () => {
  assert.equal(presentationFor(initialRule), 'sentence')
  assert.equal(presentationFor(exampleRule), 'blocks')
  assert.equal(presentationFor(exampleRule, 'sentence'), 'sentence')
  assert.match(describeRule(exampleRule), /priority is High and type is Bug/)
  assert.deepEqual(validateRule(initialRule), [])
  assert.ok(validateRule({ ...initialRule, actions: [] }).length)
})
test('triggers, AND/OR and negation determine whether ordered actions would run', () => {
  assert.equal(testRule(exampleRule, sample).status, 'matched')
  assert.equal(testRule(exampleRule, { ...sample, priority: 'Low' }).status, 'skipped')
  assert.equal(testRule({ ...exampleRule, match: 'any' }, { ...sample, priority: 'Low' }).status, 'matched')
  const wrongTrigger = testRule(exampleRule, { ...sample, event: 'scheduled' })
  assert.ok(wrongTrigger.steps.slice(1).every(step => step.result === 'Not evaluated'))
  assert.ok(wrongTrigger.actions.every(action => action.result === 'Skipped'))
  assert.equal(testRule({ ...initialRule, conditions: [{ ...initialRule.conditions[0], operator: 'not' }] }, sample).status, 'skipped')
  assert.equal(testRule({ ...initialRule, conditions: [], match: 'any' }, sample).status, 'matched')
  assert.equal(testRule({ ...initialRule, name: ' ' }, sample).status, 'invalid')
  const moved = moveAction(exampleRule.actions, 'action-1', 1)
  assert.deepEqual(moved.map(item => item.id), ['action-2', 'action-1', 'action-3'])
  assert.equal(exampleRule.actions[0].id, 'action-1')
  assert.equal(moveAction(exampleRule.actions, 'action-1', -1), exampleRule.actions)
})
