import {
  Calendar,
  ChoiceGroup,
  Code,
  Stack,
  Switch,
} from '@gtivr4/a1-design-system-react'

function propBoolean(name, value, defaultValue) {
  if (value === defaultValue) return null
  return `${name}={${value ? 'true' : 'false'}}`
}

function propNumber(name, value, defaultValue) {
  if (value === defaultValue) return null
  return `${name}={${Number(value)}}`
}

function buildCalendarSnippet(config) {
  const props = [
    config.variant === 'paginated' ? 'variant="paginated"' : null,
    'initialMonth={{ year: 2026, month: 6 }}',
    config.variant === 'scroll' ? propNumber('monthsToShow', config.monthsToShow, 2) : null,
    propBoolean('highlightToday', config.highlightToday, true),
    propBoolean('dimPast', config.dimPast, true),
    config.variant === 'paginated' ? propBoolean('todayButton', config.todayButton, false) : null,
  ].filter(Boolean).join('\n  ')

  return `<Calendar\n  ${props}\n/>`
}

export function getDefaultConfig() {
  return {
    variant: 'paginated',
    monthsToShow: 2,
    highlightToday: true,
    dimPast: true,
    todayButton: true,
  }
}

export function Preview({ config }) {
  return (
    <Calendar
      variant={config.variant}
      initialMonth={{ year: 2026, month: 6 }}
      monthsToShow={Number(config.monthsToShow) || 2}
      highlightToday={config.highlightToday}
      dimPast={config.dimPast}
      todayButton={config.todayButton}
    />
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <ChoiceGroup
        label="Variant"
        size="compact"
        hideIndicator
        columns={2}
        value={config.variant}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
        options={[
          { label: 'Scroll', value: 'scroll' },
          { label: 'Paginated', value: 'paginated' },
        ]}
      />
      {config.variant === 'scroll' && (
        <ChoiceGroup
          label="Months"
          size="compact"
          hideIndicator
          columns={3}
          value={String(config.monthsToShow)}
          onChange={(monthsToShow) => setConfig((current) => ({ ...current, monthsToShow: Number(monthsToShow) }))}
          options={[
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
          ]}
        />
      )}
      <Switch
        label="Highlight today"
        size="compact"
        checked={config.highlightToday}
        onChange={(highlightToday) => setConfig((current) => ({ ...current, highlightToday }))}
      />
      <Switch
        label="Dim past"
        size="compact"
        checked={config.dimPast}
        onChange={(dimPast) => setConfig((current) => ({ ...current, dimPast }))}
      />
      {config.variant === 'paginated' && (
        <Switch
          label="Today button"
          size="compact"
          checked={config.todayButton}
          onChange={(todayButton) => setConfig((current) => ({ ...current, todayButton }))}
        />
      )}
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildCalendarSnippet(config)}</Code>
}
