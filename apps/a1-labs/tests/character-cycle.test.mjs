import test from 'node:test'
import assert from 'node:assert/strict'
import { characterCycle, billboardCharacters } from '../src/flip-billboard/character-cycle.js'
test('nearby characters finish sooner and every intermediate option appears', () => {
  assert.deepEqual(characterCycle('a', 'c'), ['b', 'c'])
  assert.equal(characterCycle('a', 'z').length, 25)
  assert.deepEqual(characterCycle('a', 'a'), [])
  assert.equal(characterCycle('Z', 'a').at(-1), 'a')
  assert.ok(characterCycle('&', 'b').includes(' '))
  assert.equal(new Set(billboardCharacters).size, billboardCharacters.length)
})
test('case, punctuation and custom graphemes preserve the requested destination', () => {
  for (const [from, to] of [['A', 'C'], ['z', '!'], ['🪄', 'é'], [' ', '🧑‍🚀']]) {
    const path = characterCycle(from, to)
    assert.equal(path.at(-1), to)
    assert.ok(path.length > 0)
    assert.ok(path.length <= billboardCharacters.length + 2)
  }
})
