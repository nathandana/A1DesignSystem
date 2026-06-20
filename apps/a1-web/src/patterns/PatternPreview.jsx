/**
 * PatternPreview — renders a pattern's component tree read-only using the same
 * page renderer the editor uses. Pattern metadata (`lock`, `patternId`) is
 * resolved away first; `PatternRef` nodes are expanded into their target
 * pattern's nodes. No editor callbacks are passed, so the render is static.
 */
import { RenderPageDefinition } from '../editor/pageRenderer.tsx'
import { getPattern } from './patterns.js'
import { resolvePatternNodes } from './resolvePattern.js'

export function PatternPreview({ pattern }) {
  const nodes = resolvePatternNodes(pattern.pattern.nodes, getPattern)
  const definition = {
    schemaVersion: pattern.schemaVersion,
    page: {
      id: pattern.pattern.id,
      name: pattern.pattern.name,
      layout: {
        type: 'PageLayout',
        regions: [{ id: 'pattern', nodes }],
      },
    },
  }
  return <RenderPageDefinition definition={definition} />
}
