import { Switch } from '@gtivr4/a1-design-system-react'
import { Lockable } from './configLock.jsx'
import { WithHelp } from './configKit.jsx'

// Shared boolean control for the configurators. Renders a compact Switch so all
// on/off properties read consistently across every component config panel.
// `helper` is property guidance gated by the shared Helper-text switch
// (ConfigHelpContext) — prefer it when explaining a prop. `hint` is an always-on
// inline Switch note.
export function Toggle({ label, hint, helper, value, onChange, prop }) {
  return (
    <WithHelp helper={helper}>
      <Lockable prop={prop}>
        <Switch
          label={label}
          hint={hint}
          size="compact"
          checked={!!value}
          onChange={(checked) => onChange(checked)}
        />
      </Lockable>
    </WithHelp>
  )
}
