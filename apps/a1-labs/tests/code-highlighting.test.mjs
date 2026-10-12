import test from 'node:test'
import assert from 'node:assert/strict'
import { LANGUAGES, diffKind, parseLineRanges, toLines, tokenize } from '../src/code-highlighting/highlight.js'
import { DIFFS, INLINE, SAMPLES } from '../src/code-highlighting/samples.js'

const typesOf = (source, language) => {
  const map = {}
  for (const token of tokenize(source, language)) if (token.type !== 'plain') (map[token.type] ??= []).push(token.text.trim())
  return map
}

test('tokens always reproduce the source exactly', () => {
  const extra = ['', '\n', 'a < b && c > d', '`unterminated ${x}', '/* open comment', '"open string', '<div', '{ "a": ', '@media (', '.x { color: }}}', '<<>>']
  for (const { value } of LANGUAGES) {
    for (const source of [SAMPLES[value], DIFFS[value], INLINE[value], ...extra]) {
      assert.equal(tokenize(source, value).map(t => t.text).join(''), source, `${value}: ${JSON.stringify(source.slice(0, 30))}`)
    }
  }
})

test('JSX roles', () => {
  const t = typesOf(SAMPLES.jsx, 'jsx')
  for (const word of ['import', 'from', 'export', 'function', 'const', 'async', 'await', 'return']) assert.ok(t.keyword.includes(word), word)
  assert.ok(t.string.includes("'@gtivr4/a1-design-system-react'"))
  assert.ok(t.comment.some(text => text.startsWith('// Save a draft, then confirm with a snackbar.')))
  for (const name of ['SaveBar', 'useState', 'setSaving', 'onSave']) assert.ok(t.function.includes(name), name)
  for (const tag of ['Stack', 'Button']) assert.ok(t.tag.includes(tag), tag)
  for (const attribute of ['direction', 'gap', 'variant', 'loading', 'onClick']) assert.ok(t.attribute.includes(attribute), attribute)
  assert.ok(t.property.includes('id') && t.property.includes('retries'))
  assert.ok(t.constant.includes('false') && t.constant.includes('true'))
  assert.ok(t.number.includes('12') && t.number.includes('3'))
  // A comparison is not a tag.
  assert.ok(!typesOf('if (a < b) go()', 'jsx').tag)
  assert.deepEqual(typesOf('return <div />', 'jsx').tag, ['div'])
})

test('CSS roles', () => {
  const t = typesOf(SAMPLES.css, 'css')
  assert.ok(t.selector.includes('.a1-card') && t.selector.includes('.a1-card:hover') && t.selector.includes('.a1-card__media'), 'adjacent selector parts merge')
  for (const property of ['padding', 'border-radius', 'aspect-ratio', 'min-width']) assert.ok(t.property.includes(property), property)
  assert.ok(t.function.includes('var'))
  assert.ok(t.property.includes('--base-spacing-16'), 'custom property reference')
  assert.ok(t.number.includes('8px') && t.number.includes('150ms') && t.number.includes('640px'))
  assert.ok(t.constant.includes('#ffffff'))
  assert.ok(t.keyword.includes('@media') && t.keyword.includes('!important'))
  assert.ok(!t.selector.includes('solid'), 'values are not selectors')
})

test('HTML and JSON roles', () => {
  const h = typesOf(SAMPLES.html, 'html')
  assert.ok(h.keyword.includes('<!doctype html>'))
  for (const tag of ['html', 'meta', 'button', 'strong']) assert.ok(h.tag.includes(tag), tag)
  for (const attribute of ['lang', 'charset', 'type', 'disabled']) assert.ok(h.attribute.includes(attribute), attribute)
  assert.ok(h.string.includes('"en"') && h.constant.includes('&mdash;'))
  assert.ok(h.comment.some(text => text.startsWith('<!--')))
  const j = typesOf(SAMPLES.json, 'json')
  assert.ok(j.property.includes('"name"') && !j.property.includes('"0.32.0"'))
  assert.ok(j.string.includes('"0.32.0"') && j.string.includes('"*.css"'))
  assert.ok(j.number.includes('13') && j.constant.includes('false') && j.constant.includes('null'))
})

test('lines, ranges and diffs', () => {
  const lines = toLines(tokenize('/* a\nb */\nx', 'css'))
  assert.equal(lines.length, 3)
  assert.deepEqual(lines[1], [{ type: 'comment', text: 'b */' }])
  assert.equal(toLines(tokenize('', 'jsx')).length, 1)
  assert.deepEqual([...parseLineRanges('2, 4-6 9-8 x 0')], [2, 4, 5, 6, 8, 9])
  assert.equal(parseLineRanges('1-100000').size, 999)
  assert.equal(diffKind('+ added'), 'added')
  assert.equal(diffKind('- removed'), 'removed')
  assert.equal(diffKind('-1 is a number'), null)
  assert.equal(diffKind('  same'), null)
})
