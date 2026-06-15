import { SelectField } from '@gtivr4/a1-design-system-react'
import iconRegistry from '../../../../../../system/icons/material-symbols.json'

const ICON_OPTIONS = iconRegistry.icons.map((icon) => icon.name)

export function IconSelect({
  label = 'Icon',
  size = 'compact',
  value,
  onChange,
}) {
  return (
    <SelectField
      label={label}
      size={size}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    >
      {ICON_OPTIONS.map((icon) => (
        <option key={icon} value={icon}>{icon}</option>
      ))}
    </SelectField>
  )
}
