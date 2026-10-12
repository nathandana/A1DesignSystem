import { experimentTree } from './experiments.js'

// Reuse the sidebar's registry, ordering and search vocabulary. Hidden studies
// are excluded by experimentTree; new experiments appear without menu edits.
export function experimentMenu(search = '', path = '/') {
  const groups = experimentTree(search)
  const matches = groups.flatMap(group => group.children)
    .sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base', numeric: true }))
  const link = item => ({ id: item.id, label: item.label, icon: item.icon, href: item.href, active: item.href === path })
  return {
    matches,
    items: [
      { id: 'all-experiments', label: 'All experiments', icon: 'science', href: '/', active: path === '/' },
      ...(matches.length ? [{ divider: true }] : []),
      ...(search.trim() ? matches.map(link) : groups.map(group => ({
        id: group.id, label: group.label, icon: group.icon,
        active: group.children.some(item => item.href === path),
        items: group.children.map(link),
      }))),
    ],
  }
}
