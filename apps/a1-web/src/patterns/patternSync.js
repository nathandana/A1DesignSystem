/**
 * Pattern-instance reconciliation and compatibility checking.
 *
 * A pattern instance on a page is a copy of the pattern's nodes; each instance
 * node keeps a `patternNodeId` pointing back to its source node in the pattern.
 * When the pattern changes, instances can be **reconciled**: locked props and
 * locked text are pulled forward from the pattern (instances can't override
 * those), and the lock metadata itself is refreshed. The **checker** reports
 * incompatibilities — places where an instance had edited a value that is now
 * locked by the pattern, so reconciling it would change the instance.
 */
import { loadPattern } from './patternStore.js'

function indexPatternNodes(nodes, map = new Map()) {
  for (const node of nodes) {
    if (node.type !== 'PatternRef') map.set(node.id, node)
    if (node.children) indexPatternNodes(node.children, map)
  }
  return map
}

function sameValue(a, b) {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null)
}

// Reconcile one node against its pattern source: force locked props/content to
// the pattern's values, refresh lock metadata, and record any value that changed
// (an "incompatible" instance edit that the lock overrides).
function reconcileNode(node, index, conflicts) {
  const src = node.patternNodeId ? index.get(node.patternNodeId) : null
  let next = node

  if (src) {
    const lock = src.lock
    let props = node.props

    if (lock?.props?.length) {
      props = { ...(node.props ?? {}) }
      for (const key of lock.props) {
        const srcVal = src.props?.[key]
        if (!sameValue(props[key], srcVal)) {
          conflicts.push({ type: node.type, prop: key, was: props[key], now: srcVal })
        }
        if (srcVal === undefined) delete props[key]
        else props[key] = srcVal
      }
    }

    let content = node.content
    if (lock?.content && src.content) {
      if (node.content?.fallback !== src.content.fallback) {
        conflicts.push({ type: node.type, prop: 'text', was: node.content?.fallback, now: src.content.fallback })
      }
      content = { ...(node.content ?? {}), fallback: src.content.fallback }
    }

    next = { ...node, props, content }
    if (lock) next.lock = lock
    else delete next.lock
  }

  if (next.children) {
    next = { ...next, children: next.children.map((child) => reconcileNode(child, index, conflicts)) }
  }
  return next
}

/** Reconcile one instance subtree (its root carries `patternInstance`). */
export function reconcileInstance(root, patternDef) {
  const index = indexPatternNodes(patternDef.pattern.nodes)
  const conflicts = []
  const node = reconcileNode(root, index, conflicts)
  return { node, conflicts }
}

/**
 * Reconcile every pattern instance in a page definition against its current
 * pattern. Returns the updated definition plus a summary: how many instances
 * were found and the list of incompatibilities resolved.
 */
export function reconcilePageInstances(def, getPattern = loadPattern) {
  let instanceCount = 0
  const conflicts = []

  const mapNodes = (nodes) =>
    nodes.map((node) => {
      if (node.patternInstance) {
        const patternDef = getPattern(node.patternInstance.id)
        if (patternDef) {
          instanceCount += 1
          const result = reconcileInstance(node, patternDef)
          conflicts.push(...result.conflicts.map((c) => ({ ...c, instance: node.patternInstance.name })))
          return result.node
        }
      }
      return node.children ? { ...node, children: mapNodes(node.children) } : node
    })

  const regions = def.page.layout.regions.map((region) => ({ ...region, nodes: mapNodes(region.nodes) }))
  const newDef = { ...def, page: { ...def.page, layout: { ...def.page.layout, regions } } }
  return { def: newDef, instanceCount, conflicts }
}
