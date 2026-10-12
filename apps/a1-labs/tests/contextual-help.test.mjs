import test from 'node:test'
import assert from 'node:assert/strict'
import { PATTERNS, TRIGGERS, placePopover, resolveTrigger, supports, unavailableReason } from '../src/contextual-help/help-model.js'

test('each pattern lists only known triggers', () => {
  const ids = new Set(TRIGGERS.map(item => item.id))
  for (const pattern of PATTERNS) assert.ok(pattern.triggers.every(id => ids.has(id)), pattern.id)
})

test('triggers fall back to one the pattern supports', () => {
  assert.equal(resolveTrigger('tooltip', 'link'), 'icon')
  assert.equal(resolveTrigger('inline', 'focus'), 'focus')
  assert.equal(resolveTrigger('dialog', 'focus'), 'icon')
  assert.equal(resolveTrigger('hint', 'icon'), null)
})

test('unsupported combinations explain why', () => {
  assert.equal(unavailableReason('popover', 'icon'), '')
  assert.match(unavailableReason('hint', 'icon'), /always visible/)
  assert.match(unavailableReason('tooltip', 'link'), /hover and focus/)
  assert.match(unavailableReason('dialog', 'focus'), /move focus/)
  assert.equal(supports('dialog', 'link'), true)
  for (const pattern of PATTERNS.filter(item => item.id !== 'hint')) assert.equal(supports(pattern.id, 'outside'), true, pattern.id)
})

test('popovers open below, flip above near the bottom and stay on screen', () => {
  const viewport = { width: 400, height: 600 }
  const size = { width: 200, height: 120 }
  // Start-aligned on the left half of the screen; end-aligned on the right half.
  assert.deepEqual(placePopover({ top: 100, bottom: 140, left: 150, width: 40 }, size, viewport, 8), { top: 148, left: 150, side: 'below' })
  assert.deepEqual(placePopover({ top: 520, bottom: 560, left: 360, width: 32 }, size, viewport, 8), { top: 392, left: 192, side: 'above' })
  assert.equal(placePopover({ top: 10, bottom: 40, left: 0, width: 20 }, size, viewport, 8).left, 8)
})
