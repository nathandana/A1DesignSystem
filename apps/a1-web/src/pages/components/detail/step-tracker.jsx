import {
  Code,
  Stack,
  StepTracker,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Left', icon: 'format_align_left' },
  { value: 'center', label: 'Center', icon: 'format_align_center' },
  { value: 'right', label: 'Right', icon: 'format_align_right' },
  { value: 'full', label: 'Full', icon: 'format_align_justify' },
]

function numberValue(value, fallback) {
  const next = Number(value)
  return Number.isFinite(next) ? next : fallback
}

function buildStepTrackerSnippet(config) {
  const props = [
    `steps={${numberValue(config.steps, 5)}}`,
    numberValue(config.currentStep, 1) !== 1 ? `currentStep={${numberValue(config.currentStep, 1)}}` : null,
    config.align !== 'left' ? `align="${config.align}"` : null,
  ].filter(Boolean).join('\n  ')

  return `<StepTracker\n  ${props}\n/>`
}

export function getDefaultConfig() {
  return {
    steps: 5,
    currentStep: 2,
    align: 'left',
  }
}

export function Preview({ config }) {
  return (
    <div className="a1-web-field-fill">
      <StepTracker
        steps={numberValue(config.steps, 5)}
        currentStep={numberValue(config.currentStep, 1)}
        align={config.align}
      />
    </div>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField
        label="Steps"
        size="compact"
        type="number"
        value={String(config.steps)}
        onChange={(event) => set({ steps: event.target.value })}
      />
      <TextField
        label="Current step"
        size="compact"
        type="number"
        value={String(config.currentStep)}
        onChange={(event) => set({ currentStep: event.target.value })}
      />
      <Choice prop="align"
        label="Align"
        iconOnly
        value={config.align}
        onChange={(align) => set({ align })}
        options={ALIGN_OPTIONS}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildStepTrackerSnippet(config)}</Code>
}
