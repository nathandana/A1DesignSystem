import { Switch } from '@gtivr4/a1-design-system-react'
import { Lockable } from './configLock.jsx'

// Shared boolean control for the configurators. Renders a compact Switch so all
// on/off properties read consistently across every component config panel.
export function Toggle({ label, hint, value, onChange, prop }) {
  return (
    <Lockable prop={prop}>
      <Switch
        label={label}
        hint={hint}
        size="compact"
        checked={!!value}
        onChange={(checked) => onChange(checked)}
      />
    </Lockable>
  )
}
