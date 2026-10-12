import test from 'node:test'
import assert from 'node:assert/strict'
import { chatStyles, chatMotions, initialMessages, replyFor, speakerName } from '../src/chat/chat-model.js'

test('chat options and seeded messages have stable distinct IDs', () => {
  assert.equal(new Set(chatStyles.map(item => item.value)).size, 5)
  assert.equal(new Set(chatMotions.map(item => item.value)).size, 6)
  assert.equal(new Set(initialMessages.map(item => item.id)).size, initialMessages.length)
  assert.ok(initialMessages.every(item => item.name && item.text && !item.motion))
})
test('local replies distinguish the person and assistant and respond to topics', () => {
  assert.equal(speakerName('person'), 'Avery')
  assert.match(replyFor('Try dark mode', 'bot'), /theme/)
  assert.match(replyFor('More animation?', 'bot'), /Rise/)
  assert.notEqual(replyFor('Hello', 'bot'), replyFor('Hello', 'person'))
  assert.notEqual(replyFor('Hello', 'person', 0), replyFor('Hello', 'person', 1))
  assert.ok(!replyFor('<script>unsafe</script>', 'bot').includes('<script>'))
})
