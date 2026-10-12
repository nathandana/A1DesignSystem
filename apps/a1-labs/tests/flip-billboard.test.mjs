import test from 'node:test'
import assert from 'node:assert/strict'
import { billboardMessage } from '../src/flip-billboard/message-model.js'
import { durationMs } from '../src/split-flap/tokens.js'

test('headlines fill a stable two-row board without splitting user characters', () => {
  const message = billboardMessage('Make room\nfor better.')
  assert.equal(message.heading, 'Make room for better.')
  assert.equal(message.cards.length, 24)
  assert.equal(message.cards.slice(0, 12).join(''), ' Make room  ')
  assert.equal(message.cards.slice(12).join(''), 'for better. ')
  const unicode = billboardMessage('Café 👩🏽‍💻')
  assert.ok(unicode.cards.includes('é'))
  assert.ok(unicode.cards.includes('👩🏽‍💻'))
  assert.equal(billboardMessage('One\r\nTwo').heading, 'One Two')
})

test('invalid copy is reported rather than silently truncated', () => {
  for (const input of ['', '  ', 'This line is much too long', 'One\nTwo\nThree']) {
    assert.ok(billboardMessage(input).error)
    assert.equal(billboardMessage(input).cards, undefined)
  }
  assert.equal(billboardMessage('Twelve chars\nAnother line').error, '')
})

test('motion durations support dev and minified CSS tokens', () => {
  assert.equal(durationMs('500ms'), 500)
  assert.equal(durationMs('.5s'), 500)
  assert.equal(durationMs('30ms'), 30)
  assert.equal(durationMs('.03s'), 30)
})
