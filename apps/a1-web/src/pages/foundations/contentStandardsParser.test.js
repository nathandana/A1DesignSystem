import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { parseContentStandards } from './contentStandardsParser.js'

const source = await readFile(
  new URL('../../../../../packages/react/guidelines/content-standards.md', import.meta.url),
  'utf8',
)

test('parses the canonical content standards into page sections', () => {
  const document = parseContentStandards(source)
  const sourceHierarchy = document.sections.find((section) => section.title === 'Source hierarchy')
  const addresses = document.sections.find((section) => section.title === 'Addresses')

  assert.equal(document.title, 'A1 content standards')
  assert.equal(document.intro[0]?.type, 'paragraph')
  assert.equal(document.sections.length, 13)
  assert.equal(sourceHierarchy?.blocks.find((block) => block.type === 'list')?.items.length, 4)
  assert.match(addresses?.blocks.find((block) => block.type === 'code')?.text ?? '', /Boston, MA 02110/)
})
