import { Button, IconButton, ToolbarButton } from '@gtivr4/a1-design-system-react'
import { useOpenCreateTicket } from './BacklogContext'

/**
 * The single reusable "create ticket" launcher, dropped wherever we want a
 * report-a-bug / request-a-feature affordance. Pre-scopes the ticket to where it
 * was opened by passing `scope` ({ kind, ref, label }). Render variants:
 *   as="button"  → A1 Button   (default)
 *   as="icon"    → IconButton   (icon-only, needs aria-label — defaults provided)
 *   as="toolbar" → ToolbarButton (for editor toolbars)
 */
export function CreateTicketButton({
  scope,
  as = 'button',
  label = 'Report or request',
  icon = 'flag',
  variant = 'secondary',
  size = 'sm',
  showLabel,
  ...rest
}) {
  const openCreate = useOpenCreateTicket()
  const open = () => openCreate(scope)

  if (as === 'icon') {
    return <IconButton icon={icon} aria-label={label} variant={variant} size={size} onClick={open} {...rest} />
  }
  if (as === 'toolbar') {
    return <ToolbarButton icon={icon} label={label} showLabel={showLabel} onClick={open} {...rest} />
  }
  return (
    <Button icon={icon} variant={variant} size={size} onClick={open} {...rest}>
      {label}
    </Button>
  )
}
