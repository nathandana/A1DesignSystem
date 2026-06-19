/**
 * Immutable tree operations on a pattern's flat node list (patterns have no
 * regions — just `pattern.nodes`). Each helper returns a new array; nodes carry
 * the page-definition shape plus pattern-only `lock` / `patternId` fields.
 */

function freshId() {
  return `pn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

export function updateNodeProps(nodes, id, props) {
  return nodes.map((node) =>
    node.id === id
      ? { ...node, props }
      : node.children
        ? { ...node, children: updateNodeProps(node.children, id, props) }
        : node,
  )
}

export function updateNodeContent(nodes, id, fallback) {
  return nodes.map((node) =>
    node.id === id
      ? { ...node, content: { ...(node.content ?? {}), fallback } }
      : node.children
        ? { ...node, children: updateNodeContent(node.children, id, fallback) }
        : node,
  )
}

/** Set (or clear) the `lock` metadata on a node. An empty lock is removed. */
export function setNodeLock(nodes, id, lock) {
  const empty = !lock || (!lock.node && !lock.content && !(lock.props && lock.props.length))
  return nodes.map((node) => {
    if (node.id === id) {
      const next = { ...node }
      if (empty) delete next.lock
      else next.lock = lock
      return next
    }
    return node.children ? { ...node, children: setNodeLock(node.children, id, lock) } : node
  })
}

export function removeNode(nodes, id) {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => (node.children ? { ...node, children: removeNode(node.children, id) } : node))
}

export function moveNode(nodes, id, direction) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      const target = direction === 'up' ? i - 1 : i + 1
      if (target < 0 || target >= nodes.length) return nodes
      const result = [...nodes]
      ;[result[i], result[target]] = [result[target], result[i]]
      return result
    }
    if (nodes[i].children?.length) {
      const next = moveNode(nodes[i].children, id, direction)
      if (next !== nodes[i].children) {
        return [...nodes.slice(0, i), { ...nodes[i], children: next }, ...nodes.slice(i + 1)]
      }
    }
  }
  return nodes
}

function cloneWithFreshIds(node) {
  return { ...node, id: freshId(), children: node.children?.map(cloneWithFreshIds) }
}

export function duplicateNode(nodes, id) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return [...nodes.slice(0, i + 1), cloneWithFreshIds(nodes[i]), ...nodes.slice(i + 1)]
    }
    if (nodes[i].children?.length) {
      const next = duplicateNode(nodes[i].children, id)
      if (next !== nodes[i].children) {
        return [...nodes.slice(0, i), { ...nodes[i], children: next }, ...nodes.slice(i + 1)]
      }
    }
  }
  return nodes
}

/** Remove the node with `id` and return `[node, remainingTree]`. */
export function extractNode(nodes, id) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) return [nodes[i], [...nodes.slice(0, i), ...nodes.slice(i + 1)]]
    if (nodes[i].children?.length) {
      const [found, rest] = extractNode(nodes[i].children, id)
      if (found) return [found, [...nodes.slice(0, i), { ...nodes[i], children: rest }, ...nodes.slice(i + 1)]]
    }
  }
  return [null, nodes]
}

export function insertNode(nodes, node, targetId, position) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetId) {
      if (position === 'before') return [...nodes.slice(0, i), node, ...nodes.slice(i)]
      if (position === 'after') return [...nodes.slice(0, i + 1), node, ...nodes.slice(i + 1)]
      const children = [...(nodes[i].children ?? []), node]
      return [...nodes.slice(0, i), { ...nodes[i], children }, ...nodes.slice(i + 1)]
    }
    if (nodes[i].children?.length) {
      const next = insertNode(nodes[i].children, node, targetId, position)
      if (next !== nodes[i].children) {
        return [...nodes.slice(0, i), { ...nodes[i], children: next }, ...nodes.slice(i + 1)]
      }
    }
  }
  return nodes
}

/** Replace a node with its own children, promoting them into the parent list. */
export function ungroupNode(nodes, id) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      if (!nodes[i].children?.length) return nodes
      return [...nodes.slice(0, i), ...nodes[i].children, ...nodes.slice(i + 1)]
    }
    if (nodes[i].children?.length) {
      const next = ungroupNode(nodes[i].children, id)
      if (next !== nodes[i].children) {
        return [...nodes.slice(0, i), { ...nodes[i], children: next }, ...nodes.slice(i + 1)]
      }
    }
  }
  return nodes
}

/** Wrap a node in a column Stack. */
export function wrapInStack(nodes, id) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      const wrapper = {
        id: freshId(),
        type: 'Stack',
        props: { direction: 'column', gap: 'md' },
        children: [nodes[i]],
      }
      return [...nodes.slice(0, i), wrapper, ...nodes.slice(i + 1)]
    }
    if (nodes[i].children?.length) {
      const next = wrapInStack(nodes[i].children, id)
      if (next !== nodes[i].children) {
        return [...nodes.slice(0, i), { ...nodes[i], children: next }, ...nodes.slice(i + 1)]
      }
    }
  }
  return nodes
}

export function siblingInfo(nodes, id) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return { isFirst: i === 0, isLast: i === nodes.length - 1, hasChildren: !!nodes[i].children?.length }
    }
    if (nodes[i].children?.length) {
      const found = siblingInfo(nodes[i].children, id)
      if (found) return found
    }
  }
  return null
}

/** Collect the ids of every node whose whole component is locked (`lock.node`). */
export function collectLockedNodeIds(nodes, set = new Set()) {
  for (const node of nodes) {
    if (node.lock?.node) set.add(node.id)
    if (node.children) collectLockedNodeIds(node.children, set)
  }
  return set
}
