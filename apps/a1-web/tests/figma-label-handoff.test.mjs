import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  contentLayerLabel,
  materializeResolvedLabelContent,
} from '../src/editor/contentText.js'

test('Figma handoff materializes label-bound content without changing the source model', () => {
  const source = {
    page: {
      layout: {
        regions: [{
          nodes: [{
            id: 'stat-label',
            type: 'Paragraph',
            content: {
              fallback: '**Components**',
              textKey: 'app.home.statComponents',
            },
          }],
        }],
      },
    },
  }

  const handoff = materializeResolvedLabelContent(
    source,
    (key, fallback) => key === 'app.home.statComponents' ? 'Components' : fallback,
  )

  assert.equal(handoff.page.layout.regions[0].nodes[0].content.fallback, 'Components')
  assert.equal(handoff.page.layout.regions[0].nodes[0].content.textKey, 'app.home.statComponents')
  assert.equal(source.page.layout.regions[0].nodes[0].content.fallback, '**Components**')
})

test('Layers labels use resolved content and hide inline Markdown delimiters', () => {
  const content = {
    fallback: '**Components**',
    textKey: 'app.home.statComponents',
  }

  assert.equal(contentLayerLabel(content, () => 'Components'), 'Components')
  assert.equal(contentLayerLabel({ fallback: '**Unbound label**' }), 'Unbound label')
})

test('bundled A1 home stat bindings use plain fallbacks', async () => {
  const model = JSON.parse(await readFile(
    new URL('../src/editor/examples/a1DesignPublicPages.json', import.meta.url),
    'utf8',
  ))
  const labels = []
  const visit = (value) => {
    if (Array.isArray(value)) return value.forEach(visit)
    if (!value || typeof value !== 'object') return
    if (value.id?.startsWith('home-stat-') && value.id.endsWith('-label')) labels.push(value.content)
    Object.values(value).forEach(visit)
  }
  visit(model)

  assert.deepEqual(labels.map((content) => content.fallback), ['Components', 'Packages', 'Themes', 'Tokens'])
  assert.ok(labels.every((content) => content.textKey?.startsWith('app.home.stat')))
})
