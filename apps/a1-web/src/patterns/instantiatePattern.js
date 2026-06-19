/**
 * Instantiate a pattern as page-editor nodes: expand any `PatternRef` into its
 * target pattern's nodes, give every node a fresh id so it can't collide with
 * existing page nodes, and **preserve the `lock` metadata** so the page editor
 * can keep locked elements, props, and text non-editable. A pattern with one
 * root inserts that root directly; a multi-root pattern is wrapped in a column
 * Stack so it inserts as one unit.
 */
import { loadPattern } from './patternStore.js'
import { getPattern } from './patterns.js'

let counter = 0
function freshId() {
  return `node-${Date.now()}-${(counter++).toString(36)}-${Math.random().toString(36).slice(2, 5)}`
}

// Expand PatternRef nodes (keeping lock), assign fresh ids, drop the now-resolved
// patternId. `seen` guards against a pattern referencing itself.
function expand(node, seen) {
  if (node.type === 'PatternRef') {
    const ref = node.patternId ? getPattern(node.patternId) : null
    if (!ref || seen.has(node.patternId)) return []
    const next = new Set(seen).add(node.patternId)
    return ref.pattern.nodes.flatMap((child) => expand(child, next))
  }
  const { patternId: _patternId, children, ...rest } = node
  return [{
    ...rest,
    id: freshId(),
    patternNodeId: node.id, // trace back to the pattern's source node for reconciliation
    children: children ? children.flatMap((child) => expand(child, seen)) : undefined,
  }]
}

export function instantiatePattern(patternId) {
  const def = loadPattern(patternId)
  if (!def) return null
  const resolved = def.pattern.nodes.flatMap((node) => expand(node, new Set()))
  if (resolved.length === 0) return null
  // Tag the root so the layers tree / configurator show the pattern identity.
  const patternInstance = { id: def.pattern.id, name: def.pattern.name }
  if (resolved.length === 1) return { ...resolved[0], patternInstance }
  return {
    id: freshId(),
    type: 'Stack',
    props: { direction: 'column', gap: 'md' },
    patternInstance,
    children: resolved,
  }
}
