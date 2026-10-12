import test from 'node:test'
import assert from 'node:assert/strict'
import { createBurst, createConfetti, createRocket, rocketLanded, seededRandom, stepParticles, stillVisible } from '../src/celebrations/particles.js'

const colors = ['red', 'blue']

test('the random source is repeatable', () => {
  const a = seededRandom(7); const b = seededRandom(7)
  assert.deepEqual([a(), a(), a()], [b(), b(), b()])
})

test('confetti starts at the origin, heads mostly upward and then falls', () => {
  const pieces = createConfetti({ count: 200, origin: { x: 100, y: 300 }, colors, random: seededRandom(1) })
  assert.equal(pieces.length, 200)
  assert.ok(pieces.every(p => p.x === 100 && p.y === 300))
  assert.ok(pieces.filter(p => p.vy < 0).length > 150)
  const piece = { ...pieces[0], vx: 0, vy: -500 }
  stepParticles([piece], 0.1)
  assert.ok(piece.y < 300)
  for (let i = 0; i < 30; i++) stepParticles([piece], 0.1)
  assert.ok(piece.vy > 0, 'gravity wins')
})

test('a burst spreads sparks evenly in every direction', () => {
  const sparks = createBurst({ count: 8, origin: { x: 0, y: 0 }, colors, random: seededRandom(3) })
  const quadrants = new Set(sparks.map(p => `${Math.sign(Math.round(p.vx))},${Math.sign(Math.round(p.vy))}`))
  assert.ok(quadrants.size >= 4)
  assert.equal(new Set(sparks.map(p => p.color)).size, 1)
})

test('rockets rise to their target, then land', () => {
  const rocket = createRocket({ from: { x: 0, y: 500 }, target: { x: 50, y: 100 }, delay: 0.2, duration: 0.5 })
  stepParticles([rocket], 0.1)
  assert.equal(rocket.y, 500, 'waits for its delay')
  stepParticles([rocket], 0.6)
  assert.equal(rocketLanded(rocket), true)
  assert.deepEqual([rocket.x, rocket.y], [50, 100])
})

test('particles stop drawing once off screen or faded', () => {
  assert.equal(stillVisible({ kind: 'confetti', y: 900 }, 800, 1), false)
  assert.equal(stillVisible({ kind: 'spark', age: 2 }, 800, 1.5), false)
  assert.equal(stillVisible({ kind: 'spark', age: 1 }, 800, 1.5), true)
})

test('the Fenex animation is self-contained, named and respects reduced motion', async () => {
  const { readFile } = await import('node:fs/promises')
  const svg = await readFile(new URL('../src/fenex/fenex-celebrate.svg', import.meta.url), 'utf8')
  assert.match(svg, /<title id="fenex-title">[^<]+<\/title>/)
  assert.match(svg, /@media \(prefers-reduced-motion: no-preference\)/)
  // Inlined into pages, so every class, keyframe and id is namespaced.
  const classes = [...svg.matchAll(/class="([^"]+)"/g)].flatMap(match => match[1].split(' '))
  assert.ok(classes.every(name => name.startsWith('fenex-')), classes.join(' '))
  assert.ok([...svg.matchAll(/@keyframes ([\w-]+)/g)].every(match => match[1].startsWith('fenex-')))
  assert.ok([...svg.matchAll(/id="([^"]+)"/g)].every(match => match[1].startsWith('fenex-')))
  assert.doesNotMatch(svg, /<script/i)
})
