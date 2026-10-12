import test from 'node:test'
import assert from 'node:assert/strict'
import { initialVerification, verificationTransition as next } from '../src/verify-button/verification.js'
const advance = (...events) => events.reduce((state, event) => next(state, typeof event === 'string' ? {type:event} : event), initialVerification)
test('holding must be armed, and elapsed time alone never confirms', () => {
  assert.equal(advance('start', {type:'tick',progress:1}, 'release').phase, 'locked')
  assert.equal(advance('arm','start',{type:'tick',progress:1}).phase, 'ready')
  assert.equal(advance('arm','start',{type:'tick',progress:1},'release').phase, 'complete')
})
test('early release, cancellation and interruption never confirm', () => {
  assert.equal(advance('arm','start',{type:'tick',progress:.99},'release').phase,'armed')
  for (const event of ['cancel','disarm']) {
    assert.notEqual(advance('arm','start',{type:'tick',progress:1},event,'release').phase,'complete')
  }
})
test('click-only confirmation requires arming and a separate review', () => {
  assert.equal(advance('confirm').phase,'locked')
  assert.equal(advance('arm','confirm').phase,'armed')
  assert.equal(advance('arm','review','confirm').phase,'complete')
  assert.equal(advance('arm','review','disarm','confirm').phase,'locked')
})
test('a completed verification cannot be repeated without resetting', () => {
  const complete = advance('arm','review','confirm')
  for (const type of ['arm','start','review','confirm','release','cancel','disarm']) assert.equal(next(complete,{type}),complete)
  assert.equal(next(complete,{type:'reset'}),initialVerification)
})
