import {
  Accordion,
  Code,
  Stack,
  Stat,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider, statusOptions } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

const BADGE_STATUS_OPTIONS = ['neutral', 'info', 'success', 'warn', 'error']
const BADGE_SIZE_OPTIONS = ['sm', 'md', 'lg']
const BADGE_ICON_MODE_OPTIONS = ['default', 'custom', 'none']
const FORMAT_OPTIONS = [
  { value: 'none', label: 'None', icon: 'text_fields' },
  { value: 'number', label: 'Number', icon: 'pin' },
  { value: 'percent', label: 'Percent', icon: 'percent' },
]
const SIZE_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl']
const ALIGN_OPTIONS = [
  { value: 'start', label: 'Start', icon: 'format_align_left' },
  { value: 'center', label: 'Center', icon: 'format_align_center' },
  { value: 'end', label: 'End', icon: 'format_align_right' },
]

function propString(name, value, defaultValue) {
  if (value == null || value === '' || value === defaultValue) return null
  return `${name}="${String(value).replaceAll('"', '&quot;')}"`
}

function numericPropString(name, value) {
  if (value == null || value === '') return null
  return `${name}={${Number(value)}}`
}

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('-', ' ')
}

function advancedSummary(config) {
  const items = []
  if ((config.format || 'number') !== 'none' && config.precision !== '') items.push(`Precision ${config.precision}`)
  if (config.prefix) items.push(`Prefix ${config.prefix}`)
  if (config.suffix) items.push(`Suffix ${config.suffix}`)
  if (config.showIcon) items.push(`Icon ${config.icon || 'analytics'}`)
  return items.length ? items.join(' · ') : 'No advanced settings'
}

function badgeSummary(config) {
  if (!config.showBadge) return 'Hidden'
  const items = [config.badge || 'Badge']
  const status = config.badgeStatus || 'neutral'
  const size = config.badgeSize || 'sm'
  const iconMode = config.badgeIconMode || 'default'
  if (status !== 'neutral') items.push(optionLabel(status))
  if (config.badgeSubtle === false) items.push('Solid')
  if (size !== 'sm') items.push(optionLabel(size))
  if (iconMode === 'custom') items.push(`Icon ${config.badgeIcon || 'info'}`)
  if (iconMode === 'none') items.push('No icon')
  return items.join(' · ')
}

function buildSnippet(config, utilityClass = '') {
  const format = config.format || 'number'
  const numeric = format !== 'none'
  const badgeStatus = config.badgeStatus || 'neutral'
  const badgeSize = config.badgeSize || 'sm'
  const badgeIconMode = config.badgeIconMode || 'default'
  const props = [
    utilityClass ? `className="${utilityClass.replaceAll('"', '&quot;')}"` : null,
    propString('title', config.title),
    numeric
      ? `value={${Number(config.value || 0)}}`
      : propString('value', config.value),
    propString('prefix', config.prefix),
    propString('suffix', config.suffix),
    propString('description', config.description),
    config.showIcon ? propString('icon', config.icon || 'analytics') : null,
    config.showBadge ? propString('badge', config.badge || 'Healthy') : null,
    format !== 'number' ? `format="${format}"` : null,
    config.showBadge && badgeStatus !== 'neutral' ? `badgeStatus="${badgeStatus}"` : null,
    config.showBadge && !config.badgeSubtle ? 'badgeSubtle={false}' : null,
    config.showBadge && badgeSize !== 'sm' ? `badgeSize="${badgeSize}"` : null,
    config.showBadge && badgeIconMode === 'custom' ? propString('badgeIcon', config.badgeIcon || 'info') : null,
    config.showBadge && badgeIconMode === 'none' ? 'badgeIcon={null}' : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.align !== 'start' ? `align="${config.align}"` : null,
    numeric ? numericPropString('precision', config.precision) : null,
  ].filter(Boolean).join(' ')

  return `<Stat${props ? ` ${props}` : ''} />`
}

export function getDefaultConfig() {
  return {
    title: 'Active projects',
    value: '1284',
    prefix: '',
    suffix: '',
    description: 'Across all workspaces',
    showIcon: false,
    icon: 'analytics',
    showBadge: false,
    badge: '12% up',
    badgeStatus: 'success',
    badgeSubtle: true,
    badgeSize: 'sm',
    badgeIconMode: 'default',
    badgeIcon: 'trending_up',
    format: 'number',
    size: 'md',
    align: 'start',
    precision: '',
  }
}

export function Preview({ config, utilityClass = '' }) {
  const format = config.format || 'number'
  const value = format === 'none' ? config.value : Number(config.value || 0)
  const badgeIconMode = config.badgeIconMode || 'default'

  return (
    <Stat
      className={utilityClass || undefined}
      title={config.title}
      value={value}
      prefix={config.prefix}
      suffix={config.suffix}
      description={config.description}
      icon={config.showIcon ? (config.icon || 'analytics') : undefined}
      badge={config.showBadge ? (config.badge || 'Healthy') : undefined}
      badgeStatus={config.badgeStatus || 'neutral'}
      badgeSubtle={config.badgeSubtle ?? true}
      badgeSize={config.badgeSize || 'sm'}
      badgeIcon={
        badgeIconMode === 'none'
          ? null
          : badgeIconMode === 'custom'
            ? (config.badgeIcon || 'info')
            : undefined
      }
      format={config.format || 'number'}
      size={config.size}
      align={config.align}
      precision={format !== 'none' && config.precision !== '' ? Number(config.precision) : undefined}
    />
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField
        label="Title"
        size="compact"
        value={config.title}
        onChange={(event) => set({ title: event.target.value })}
      />
      <TextField
        label="Value"
        size="compact"
        value={config.value}
        onChange={(event) => set({ value: event.target.value })}
      />
      <TextField
        label="Description"
        size="compact"
        value={config.description}
        onChange={(event) => set({ description: event.target.value })}
      />
      <Choice
        prop="format"
        label="Format"
        labelMode="selected"
        value={config.format || 'number'}
        onChange={(format) => set({ format })}
        options={FORMAT_OPTIONS}
      />
      <ConfigSlider prop="size" label="Size" values={SIZE_OPTIONS} value={config.size} onChange={(size) => set({ size })} />
      <Choice
        prop="align"
        label="Align"
        labelMode="selected"
        value={config.align}
        onChange={(align) => set({ align })}
        options={ALIGN_OPTIONS}
      />

      <Accordion label="Advanced" subtext={advancedSummary(config)} size="sm" divider>
        <Stack gap="lg">
          {config.format !== 'none' && (
            <TextField
              label="Precision"
              size="compact"
              type="number"
              min="0"
              max="4"
              value={config.precision}
              onChange={(event) => set({ precision: event.target.value })}
            />
          )}
          <TextField
            label="Prefix"
            size="compact"
            value={config.prefix}
            onChange={(event) => set({ prefix: event.target.value })}
          />
          <TextField
            label="Suffix"
            size="compact"
            value={config.suffix}
            onChange={(event) => set({ suffix: event.target.value })}
          />
          <Toggle
            prop="showIcon"
            label="Show title icon"
            value={config.showIcon}
            onChange={(showIcon) => set({ showIcon })}
          />
          {config.showIcon && (
            <IconSelect
              label="Title icon"
              value={config.icon}
              onChange={(icon) => set({ icon })}
            />
          )}
        </Stack>
      </Accordion>

      <Accordion label="Badge" subtext={badgeSummary(config)} size="sm" divider>
        <Stack gap="md">
          <Toggle
            prop="showBadge"
            label="Show badge"
            value={config.showBadge}
            onChange={(showBadge) => set({ showBadge })}
          />
          {config.showBadge && (
            <>
              <TextField
                label="Badge label"
                size="compact"
                value={config.badge}
                onChange={(event) => set({ badge: event.target.value })}
              />
          <Choice
            prop="badgeStatus"
            label="Badge status"
            iconOnly
            value={config.badgeStatus || 'neutral'}
            onChange={(badgeStatus) => set({ badgeStatus })}
            options={statusOptions(BADGE_STATUS_OPTIONS)}
          />
          <ConfigSlider prop="badgeSize" label="Badge size" values={BADGE_SIZE_OPTIONS} value={config.badgeSize || 'sm'} onChange={(badgeSize) => set({ badgeSize })} />
          <Choice
            prop="badgeIconMode"
            label="Badge icon"
            columns={3}
            value={config.badgeIconMode || 'default'}
            onChange={(badgeIconMode) => set({ badgeIconMode })}
            options={BADGE_ICON_MODE_OPTIONS.map((value) => ({ value, label: optionLabel(value) }))}
          />
          {config.badgeIconMode === 'custom' && (
            <IconSelect
              label="Badge icon name"
              value={config.badgeIcon}
              onChange={(badgeIcon) => set({ badgeIcon })}
            />
          )}
          <Toggle
            prop="badgeSubtle"
            label="Subtle badge"
            value={config.badgeSubtle}
            onChange={(badgeSubtle) => set({ badgeSubtle })}
          />
            </>
          )}
        </Stack>
      </Accordion>
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
