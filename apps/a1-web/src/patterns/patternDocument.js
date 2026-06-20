/**
 * Wrap a pattern as a page definition so the main editor can open and edit it
 * like a page. The editor saves edits back to the pattern store (unwrapping the
 * single region's nodes); see the pattern-save effect in EditorPage.
 */
import { loadPattern } from './patternStore.js'

export function patternToDefinition(patternId) {
  const def = loadPattern(patternId)
  if (!def) return null
  return {
    schemaVersion: def.schemaVersion ?? '1.0',
    page: {
      id: def.pattern.id,
      name: def.pattern.name,
      description: def.pattern.description,
      layout: {
        type: 'PageLayout',
        regions: [{ id: 'pattern', nodes: def.pattern.nodes }],
      },
    },
  }
}
