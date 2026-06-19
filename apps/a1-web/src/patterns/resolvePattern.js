/**
 * Turn a pattern's node tree into a plain page-definition node tree the renderer
 * can render: strip pattern-only metadata (`lock`, `patternId`) and expand any
 * `PatternRef` nodes into the referenced pattern's nodes (patterns containing
 * patterns). Recursion guards against a pattern referencing itself.
 */
export function resolvePatternNodes(nodes, getPattern, seen = new Set()) {
  const out = []
  for (const node of nodes) {
    if (node.type === 'PatternRef') {
      const ref = node.patternId ? getPattern(node.patternId) : undefined
      if (ref && !seen.has(node.patternId)) {
        const nextSeen = new Set(seen).add(node.patternId)
        out.push(...resolvePatternNodes(ref.pattern.nodes, getPattern, nextSeen))
      }
      continue
    }
    const { lock: _lock, patternId: _patternId, children, ...rest } = node
    out.push({
      ...rest,
      children: children ? resolvePatternNodes(children, getPattern, seen) : undefined,
    })
  }
  return out
}

/**
 * Walk a pattern tree and summarise its governance: how many components and
 * properties are locked, and how many editable text fields remain.
 */
export function summarizeLocks(nodes) {
  let lockedComponents = 0
  let lockedProps = 0
  let editableFields = 0

  const walk = (list) => {
    for (const node of list) {
      if (node.type === 'PatternRef') continue
      if (node.lock?.node) lockedComponents += 1
      lockedProps += node.lock?.props?.length ?? 0
      if (node.content && !node.lock?.content) editableFields += 1
      if (node.children) walk(node.children)
    }
  }
  walk(nodes)

  return { lockedComponents, lockedProps, editableFields }
}
