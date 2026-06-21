import { MessageBadge } from '@gtivr4/a1-design-system-react'
import {
  COMPLEXITY_FULL, COMPLEXITY_LABELS, PRIORITY_LABELS, PRIORITY_TONE, SCOPE_LABELS,
  STATUS_LABELS, STATUS_TONE, TYPE_ICON, TYPE_LABELS, TYPE_TONE,
} from '../services/backlog/types'

/**
 * Small presentational badges for a ticket's status / type / priority / complexity
 * / scope. Tones and labels come from the single vocabulary in services/backlog/types
 * so they stay consistent everywhere a ticket is shown.
 */

export function StatusBadge({ status, size = 'md' }) {
  if (!status) return null
  return <MessageBadge status={STATUS_TONE[status]} subtle size={size}>{STATUS_LABELS[status]}</MessageBadge>
}

export function TypeBadge({ type, size = 'md' }) {
  if (!type) return null
  return (
    <MessageBadge status={TYPE_TONE[type]} size={size} icon={TYPE_ICON[type]}>
      {TYPE_LABELS[type]}
    </MessageBadge>
  )
}

export function PriorityBadge({ priority, size = 'md' }) {
  if (!priority) return null
  return <MessageBadge subtle status={PRIORITY_TONE[priority]} size={size}>{PRIORITY_LABELS[priority]}</MessageBadge>
}

export function ComplexityBadge({ complexity, size = 'md', full = false }) {
  if (!complexity) return null
  const text = full ? COMPLEXITY_FULL[complexity] : COMPLEXITY_LABELS[complexity]
  return <MessageBadge status="neutral" subtle size={size} icon="straighten">{text}</MessageBadge>
}

export function ScopeBadge({ scopeKind, scopeLabel, size = 'md' }) {
  if (!scopeKind || scopeKind === 'general') return null
  const text = scopeLabel ? `${SCOPE_LABELS[scopeKind]}: ${scopeLabel}` : SCOPE_LABELS[scopeKind]
  return <MessageBadge status="neutral" subtle size={size} icon="sell">{text}</MessageBadge>
}
