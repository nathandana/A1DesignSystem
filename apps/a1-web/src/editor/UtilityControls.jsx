import {
  Accordion,
  Stack,
  Toolbar,
  ToolbarGroup,
} from '@gtivr4/a1-design-system-react'
import { WithHelp } from '../pages/components/detail/configKit.jsx'
import { cleanUtilities, getAcceptedUtilitiesForComponent } from './utilityRegistry.ts'

function utilityOptionLabel(value) {
  if (value === '2xl') return '2x large'
  if (value === '0') return '0'
  if (value === 'full') return 'Full'
  if (value === 'none') return 'None'
  return /^\d+$/.test(value) ? value : value.charAt(0).toUpperCase() + value.slice(1)
}

export function UtilityControls({ type, utilities, onChange }) {
  const accepted = getAcceptedUtilitiesForComponent(type)
  if (!accepted.length || !onChange) return null

  const clean = cleanUtilities(type, utilities) ?? {}
  const appliedSummary = accepted
    .map((utility) => {
      const value = clean[utility.key]
      return value ? `${utility.label} ${utilityOptionLabel(value)}` : null
    })
    .filter(Boolean)
    .join(' · ')
  const setUtility = (key, value) => {
    const next = cleanUtilities(type, {
      ...clean,
      [key]: value || undefined,
    })
    onChange(next ?? null)
  }
  const optionForValue = (value, overflowPriority) => ({
    value,
    label: utilityOptionLabel(value),
    ...(overflowPriority != null ? { overflowPriority } : {}),
  })
  const utilityOptions = (utility) => {
    const commonValues = utility.commonValues.filter((item) => utility.values.includes(item))
    const commonPriority = new Map(commonValues.map((value, index) => [value, index + 1]))
    return [
      { value: '', label: 'None', icon: 'block', showLabel: false, overflowPriority: 0 },
      ...utility.values.map((value) => optionForValue(value, commonPriority.get(value))),
    ]
  }

  return (
    <Accordion
      label="Utilities"
      size="sm"
      divider
      subtext={appliedSummary || undefined}
    >
      <Stack gap="sm">
        {accepted.map((utility) => {
          const value = clean[utility.key] ?? ''
          return (
            <WithHelp key={utility.key} helper={utility.helper}>
              <Toolbar
                label={utility.label}
                aria-label={`${utility.label} utility`}
                fullWidth
              >
                <ToolbarGroup
                  aria-label={utility.label}
                  value={value}
                  onChange={(value) => setUtility(utility.key, value)}
                  showLabels
                  overflow
                  options={utilityOptions(utility)}
                />
              </Toolbar>
            </WithHelp>
          )
        })}
      </Stack>
    </Accordion>
  )
}
