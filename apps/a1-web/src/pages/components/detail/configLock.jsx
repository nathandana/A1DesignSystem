import { createContext, useContext } from 'react'
import { IconButton } from '@gtivr4/a1-design-system-react'

/**
 * Config-panel lock state.
 * - In the **page editor** (enforcing): `lockedProps` / `fullyLocked` mark which
 *   controls are governed, and locked controls render disabled with a red outline.
 * - In the **pattern editor** (`authoring`): each property control gets an inline
 *   lock toggle (`onToggleLock`), and the control stays editable.
 * Defaults to "nothing locked, not authoring", so the standalone component pages
 * are unaffected.
 */
export const ConfigLockContext = createContext({
  lockedProps: new Set(),
  fullyLocked: false,
  authoring: false,
  onSetLockedProps: null, // (nextArray: string[]) => void
})

export function useConfigLocked(prop) {
  const ctx = useContext(ConfigLockContext)
  return ctx.fullyLocked || (prop != null && ctx.lockedProps.has(prop))
}

// Toggle a set of prop keys on/off and push the new locked-props array.
export function applyLockToggle(ctx, keys, value) {
  const next = new Set(ctx.lockedProps)
  for (const key of keys) {
    if (value === undefined) {
      if (next.has(key)) next.delete(key)
      else next.add(key)
    } else if (value) {
      next.add(key)
    } else {
      next.delete(key)
    }
  }
  ctx.onSetLockedProps([...next])
}

/**
 * Wrap a config control so it participates in pattern locking. Pass a `prop`
 * (config key) to bind it, or `locked` to override the check (a multi-key
 * control). Authoring shows an inline lock toggle; enforcing shows the disabled
 * lock overlay.
 */
export function Lockable({ prop, locked, children }) {
  const ctx = useContext(ConfigLockContext)
  const isLocked = locked ?? (ctx.fullyLocked || (prop != null && ctx.lockedProps.has(prop)))

  // Pattern authoring: an inline lock toggle next to each property; the control
  // stays editable (the author edits freely).
  if (ctx.authoring && ctx.onSetLockedProps && prop != null) {
    return (
      <div className={`a1-web-tool-authoring${isLocked ? ' is-locked' : ''}`}>
        <div className="a1-web-tool-authoring__control">{children}</div>
        <IconButton
          icon={isLocked ? 'lock' : 'lock_open'}
          size="sm"
          variant={isLocked ? 'primary' : 'tertiary'}
          aria-label={isLocked ? 'Unlock this property' : 'Lock this property'}
          onClick={() => applyLockToggle(ctx, [prop])}
        />
      </div>
    )
  }

  // Enforcing (page editor): a locked control is disabled + red-outlined.
  if (!isLocked) return children
  return <div className="a1-web-tool-lock">{children}</div>
}
