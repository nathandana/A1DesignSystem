/**
 * Governed pattern propagation.
 *
 * When a pattern is saved, every placed instance (across every project page) is
 * reconciled against the pattern:
 *   - **Structure** follows the pattern — nodes added/removed/reordered in the
 *     pattern are added/removed/reordered in each instance.
 *   - **Locked** props and locked text are forced to the pattern's values.
 *   - **Unlocked** props/text keep each instance's own value (per-instance edits are
 *     preserved and are never overwritten by a pattern change — lock a field if you
 *     want it to always follow the pattern).
 *
 * Implementation: freshly instantiate the pattern (giving the new structure with the
 * pattern's values + preserved `lock` metadata), then overlay the old instance's
 * unlocked prop/text values onto matching nodes. Nodes are matched by
 * `patternNodeId` (stable across pattern edits), so surviving nodes keep their
 * unlocked edits, new pattern nodes come in with pattern values, and removed nodes
 * drop out. The instance node's own `id` is preserved so selection/structure stay
 * stable. Instances are found by `node.patternInstance.id`; pages that don't mention
 * the id are skipped, and `commitPageJson` no-ops when content is unchanged.
 */
import { instantiatePattern } from './instantiatePattern.js'
import { loadProjects, loadPages, resolvePageJson, commitPageJson } from '../projects/projectStore'

/** Merge one fresh (pattern) node's props with the old instance node's props:
 *  locked keys take the pattern value; unlocked keys keep the instance value. */
function mergeProps(patternProps = {}, instanceProps = {}, lockedProps) {
  const out = {}
  const keys = new Set([...Object.keys(patternProps), ...Object.keys(instanceProps)])
  for (const key of keys) {
    if (lockedProps.has(key)) {
      if (patternProps[key] !== undefined) out[key] = patternProps[key] // locked → pattern
    } else {
      out[key] = instanceProps[key] !== undefined ? instanceProps[key] : patternProps[key] // unlocked → instance wins
    }
  }
  return out
}

/** Index an instance subtree's nodes by their `patternNodeId`. */
function collectByPatternNodeId(node, map) {
  if (!node) return map
  if (node.patternNodeId) map.set(node.patternNodeId, node)
  node.children?.forEach((child) => collectByPatternNodeId(child, map))
  return map
}

/**
 * Reconcile one placed instance against its pattern (governed merge). Returns a
 * fresh-structured instance that keeps unlocked per-instance values.
 */
function reconcileInstance(oldRoot, patternId) {
  const fresh = instantiatePattern(patternId)
  // Pattern empty/deleted — leave the existing instance untouched.
  if (!fresh) return oldRoot
  const oldByPnid = collectByPatternNodeId(oldRoot, new Map())

  const overlay = (node) => {
    let next = node
    const old = node.patternNodeId ? oldByPnid.get(node.patternNodeId) : null
    if (old) {
      const lockedProps = new Set(node.lock?.props ?? [])
      const props = mergeProps(node.props, old.props, lockedProps)
      // Locked text follows the pattern; unlocked text keeps the instance's own.
      const content = node.lock?.content ? node.content : (old.content ?? node.content)
      next = {
        ...node,
        id: old.id, // reuse the old node's id so selection/structure stay stable
        ...(Object.keys(props).length ? { props } : {}),
        ...(content !== undefined ? { content } : {}),
      }
    }
    if (next.children) next = { ...next, children: next.children.map(overlay) }
    return next
  }

  const result = overlay(fresh)
  result.id = oldRoot.id // preserve the instance root id
  return result
}

/** Reconcile every instance of `patternId` in one node subtree (governed merge). */
function rebuildNode(node, patternId, stats) {
  if (node?.patternInstance?.id === patternId) {
    stats.count += 1
    return reconcileInstance(node, patternId)
  }
  if (node?.children) {
    return { ...node, children: node.children.map((child) => rebuildNode(child, patternId, stats)) }
  }
  return node
}

/** Rebuild all instances of `patternId` in a parsed page definition. */
export function rebuildPatternInstances(def, patternId) {
  const stats = { count: 0 }
  if (!def?.page?.layout?.regions) return { def, count: 0 }
  const regions = def.page.layout.regions.map((region) => ({
    ...region,
    nodes: region.nodes.map((node) => rebuildNode(node, patternId, stats)),
  }))
  const nextDef = { ...def, page: { ...def.page, layout: { ...def.page.layout, regions } } }
  return { def: nextDef, count: stats.count }
}

/**
 * Propagate a saved pattern to every instance across all project pages. Returns a
 * `{ pages, instances }` summary. Safe to call on every (debounced) pattern save —
 * pages without the pattern are skipped and unchanged pages don't re-commit.
 */
export function propagatePatternToInstances(patternId, label = 'Synced pattern instance') {
  if (!patternId) return { pages: 0, instances: 0 }
  let pages = 0
  let instances = 0
  for (const project of loadProjects()) {
    for (const page of loadPages(project.id)) {
      const json = resolvePageJson(page.id)
      // Cheap skip: a page can only hold an instance if its JSON mentions the id.
      if (!json || !json.includes(patternId)) continue
      let def
      try { def = JSON.parse(json) } catch { continue }
      const { def: nextDef, count } = rebuildPatternInstances(def, patternId)
      if (count > 0) {
        commitPageJson(page.id, JSON.stringify(nextDef, null, 2), label)
        pages += 1
        instances += count
      }
    }
  }
  return { pages, instances }
}
