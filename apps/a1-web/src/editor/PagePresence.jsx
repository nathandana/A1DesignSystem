import { MessageBadge } from '@gtivr4/a1-design-system-react'
import { usePagePresence } from './usePagePresence.js'

// Compact "who else is here" indicator for the editor header. Renders nothing when
// no one else is on the page. Full list is in the badge title for hover.
export function PagePresence({ pageId, enabled = true }) {
  const others = usePagePresence(pageId, enabled)
  if (!others.length) return null

  const names = others.map((o) => o.email.split('@')[0])
  const label = others.length === 1 ? `${names[0]} is here` : `${others.length} others here`
  const title = `Also editing: ${others.map((o) => o.email).join(', ')}`

  return (
    <span title={title}>
      <MessageBadge status="info" subtle icon="group">{label}</MessageBadge>
    </span>
  )
}
