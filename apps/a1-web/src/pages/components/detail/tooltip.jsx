import {
  Button,
  Code,
  IconButton,
  Link,
  Slider,
  Stack,
  TextareaField,
  Tooltip,
} from '@gtivr4/a1-design-system-react'
import { Choice, FieldState, WithHelp } from './configKit.jsx'

const PLACEMENT_OPTIONS = [
  { value: 'top', label: 'Top', icon: 'north' },
  { value: 'right', label: 'Right', icon: 'east' },
  { value: 'bottom', label: 'Bottom', icon: 'south' },
  { value: 'left', label: 'Left', icon: 'west' },
]

const TRIGGER_OPTIONS = [
  { value: 'button', label: 'Button', icon: 'smart_button' },
  { value: 'icon-button', label: 'Icon button', icon: 'touch_app' },
  { value: 'link', label: 'Link', icon: 'link' },
]

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}

function escapeJsxText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function buildSnippet(config, utilityClass = '') {
  const props = [
    `content="${escapeJsxString(config.content || 'Helpful context for this action.')}"`,
    config.placement !== 'top' ? `placement="${config.placement}"` : null,
    config.delay !== 400 ? `delay={${Number(config.delay) || 0}}` : null,
    config.disabled ? 'disabled' : null,
    utilityClass ? `className="${escapeJsxString(utilityClass)}"` : null,
  ].filter(Boolean).join('\n  ')

  const trigger = config.trigger === 'icon-button'
    ? '<IconButton icon="info" aria-label="More information" />'
    : config.trigger === 'link'
      ? '<Link href="#">Hover or focus me</Link>'
      : '<Button>Hover or focus me</Button>'

  return `<Tooltip
  ${props}
>
  ${trigger}
</Tooltip>`
}

function buildPureSnippet(config, utilityClass = '') {
  const trigger = config.trigger === 'icon-button'
    ? `<button type="button" class="a1-icon-button a1-icon-button--tertiary" aria-label="More information" aria-describedby="tooltip-preview">
    <span class="a1-icon" aria-hidden="true">info</span>
  </button>`
    : config.trigger === 'link'
      ? `<a class="a1-link" href="#" aria-describedby="tooltip-preview">
    <span class="a1-link__text">Hover or focus me</span>
  </a>`
      : `<button type="button" class="a1-button a1-button--secondary" aria-describedby="tooltip-preview">
    Hover or focus me
  </button>`

  return `<span class="a1-tooltip__trigger">
  ${trigger}
  <span id="tooltip-preview" class="a1-tooltip a1-tooltip--top a1-tooltip--open${utilityClass ? ` ${escapeJsxString(utilityClass)}` : ''}" role="tooltip">
    ${escapeJsxText(config.content || 'Helpful context for this action.')}
  </span>
</span>`
}

function renderTrigger(trigger) {
  if (trigger === 'icon-button') {
    return <IconButton icon="info" aria-label="More information" />
  }
  if (trigger === 'link') {
    return <Link href="#" onClick={(event) => event.preventDefault()}>Hover or focus me</Link>
  }
  return <Button>Hover or focus me</Button>
}

export const viewAsModes = [
  { value: 'react', label: 'React' },
  { value: 'pure', label: 'Pure' },
]

export function getDefaultConfig() {
  return {
    content: 'Helpful context for this action.',
    trigger: 'button',
    placement: 'top',
    delay: 400,
    disabled: false,
  }
}

export function Preview({ config, viewAs = 'react', utilityClass = '' }) {
  if (viewAs === 'pure') {
    return (
      <Stack gap="md" align="center">
        {renderTrigger(config.trigger)}
        <span
          id="a1-web-tooltip-pure-preview"
          className={['a1-tooltip', 'a1-tooltip--top', 'a1-tooltip--open', utilityClass].filter(Boolean).join(' ')}
          role="tooltip"
          style={{ position: 'static' }}
        >
          {config.content || 'Helpful context for this action.'}
        </span>
      </Stack>
    )
  }

  return (
    <Tooltip
      className={utilityClass || undefined}
      content={config.content || 'Helpful context for this action.'}
      placement={config.placement}
      delay={Number(config.delay) || 0}
      disabled={config.disabled}
    >
      {renderTrigger(config.trigger)}
    </Tooltip>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <WithHelp helper="Keep tooltip content brief and non-interactive.">
        <TextareaField
          label="Content"
          size="compact"
          rows="sm"
          value={config.content}
          onChange={(event) => set({ content: event.target.value })}
        />
      </WithHelp>
      <Choice
        prop="trigger"
        label="Trigger"
        value={config.trigger}
        onChange={(trigger) => set({ trigger })}
        options={TRIGGER_OPTIONS}
        helper="Tooltip can wrap any focusable trigger. Use visible labels unless the trigger has a clear accessible name."
      />
      <Choice
        prop="placement"
        label="Placement"
        iconOnly
        columns={4}
        value={config.placement}
        onChange={(placement) => set({ placement })}
        options={PLACEMENT_OPTIONS}
        helper="Placement is a preference; the tooltip clamps to stay inside the viewport."
      />
      <Slider
        label="Delay"
        size="compact"
        min={0}
        max={1500}
        step={100}
        value={Number(config.delay) || 0}
        onChange={(delay) => set({ delay })}
        formatValue={(value) => `${value} ms`}
      />
      <FieldState
        label="State"
        items={[
          { key: 'disabled', label: 'Disabled', icon: 'block', value: config.disabled },
        ]}
        onChange={set}
        helper="Disabled keeps the trigger visible but prevents the tooltip from opening."
      />
    </Stack>
  )
}

export function Snippet({ config, viewAs = 'react', utilityClass = '' }) {
  if (viewAs === 'pure') {
    return <Code variant="block" wrapping copyCode>{buildPureSnippet(config, utilityClass)}</Code>
  }
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
