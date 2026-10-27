import { resolvePageJson } from './projectStore'

// Page-tree helpers shared by the project overview's Nodes and Canvas views.

/** Flatten the page tree into document order, tagging each with its level. */
export function flattenPages(pages) {
  const childrenOf = (parentId) => pages.filter((p) => p.parentId === parentId).sort((a, b) => a.order - b.order)
  const out = []
  const walk = (parentId, level) => {
    for (const page of childrenOf(parentId)) { out.push({ page, level }); walk(page.id, level + 1) }
  }
  walk(null, 1)
  return out
}

/** Scan each page's stored definition for /?page= hrefs pointing to other pages in this project. */
export function extractPageLinks(pages) {
  const pageIds = new Set(pages.map((p) => p.id))
  const links = new Map() // fromId → Set<toId>
  for (const page of pages) {
    const json = resolvePageJson(page.id)
    if (!json) continue
    const targets = new Set()
    for (const m of json.matchAll(/[?&]page=([^&"\\]+)/g)) {
      const targetId = decodeURIComponent(m[1])
      if (targetId !== page.id && pageIds.has(targetId)) targets.add(targetId)
    }
    if (targets.size) links.set(page.id, targets)
  }
  return links
}
