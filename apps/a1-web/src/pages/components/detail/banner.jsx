import {
  Banner,
  Button,
  Code,
  FieldRow,
  Link,
  Paragraph,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, statusOptions } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

const VARIANT_OPTIONS = ['inline', 'system', 'calendar']
const STATUS_OPTIONS = ['neutral', 'info', 'success', 'warn', 'error']
const ACTION_OPTIONS = ['none', 'link', 'button']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function escapeJsxText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${escapeJsxString(value)}"`
}

function actionElement(config) {
  if (config.action === 'link') return <Link href="#">{config.actionLabel || 'Learn more'}</Link>
  if (config.action === 'button') return <Button variant="tertiary" size="sm">{config.actionLabel || 'Take action'}</Button>
  return undefined
}

function actionSnippet(config) {
  if (config.action === 'link') {
    return `action={<Link href="#">${escapeJsxText(config.actionLabel || 'Learn more')}</Link>}`
  }
  if (config.action === 'button') {
    return `action={<Button variant="tertiary" size="sm">${escapeJsxText(config.actionLabel || 'Take action')}</Button>}`
  }
  return null
}

function dateSnippet(config) {
  if (config.variant !== 'calendar') return null
  const month = escapeJsxString(config.dateMonth || '')
  const day = escapeJsxString(config.dateDay || '')
  if (!month && !day) return null
  return `date={{ month: "${month}", day: "${day}" }}`
}

function buildBannerSnippet(config, utilityClass = '') {
  const isCalendar = config.variant === 'calendar'
  const props = [
    propString('className', utilityClass, ''),
    propString('variant', config.variant, 'inline'),
    propString('status', config.status, 'neutral'),
    isCalendar ? propString('eyebrow', config.eyebrow, '') : null,
    propString('title', config.title, ''),
    dateSnippet(config),
    !isCalendar && config.iconMode === 'custom' ? propString('icon', config.icon, '') : null,
    actionSnippet(config),
    config.dismissible ? 'onDismiss={() => setVisible(false)}' : null,
  ].filter(Boolean).join('\n  ')

  return `<Banner${props ? `\n  ${props}\n` : ''}>
  ${escapeJsxText(config.children || 'Banner message.')}
</Banner>`
}

export function getDefaultConfig() {
  return {
    variant: 'inline',
    status: 'info',
    title: 'New feature available',
    children: 'Dashboard exports are now supported in CSV and PDF formats.',
    iconMode: 'default',
    icon: 'info',
    eyebrow: 'Neighborhood event',
    dateMonth: 'Jun',
    dateDay: '28',
    action: 'link',
    actionLabel: 'Learn more',
    dismissible: true,
    dismissed: false,
  }
}

export function Preview({ config, setConfig, utilityClass = '' }) {
  if (config.dismissed && config.dismissible) {
    return (
      <Stack gap="sm">
        <Paragraph size="sm" color="muted">Banner dismissed.</Paragraph>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setConfig?.((current) => ({ ...current, dismissed: false }))}
        >
          Show banner
        </Button>
      </Stack>
    )
  }

  const isCalendar = config.variant === 'calendar'

  return (
    <Banner
      className={utilityClass || undefined}
      variant={config.variant}
      status={config.status}
      eyebrow={isCalendar ? (config.eyebrow || undefined) : undefined}
      title={config.title || undefined}
      date={isCalendar ? { month: config.dateMonth, day: config.dateDay } : undefined}
      icon={!isCalendar && config.iconMode === 'custom' ? config.icon : undefined}
      action={actionElement(config)}
      onDismiss={config.dismissible
        ? () => setConfig?.((current) => ({ ...current, dismissed: true }))
        : undefined}
    >
      {config.children || undefined}
    </Banner>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  const isCalendar = config.variant === 'calendar'

  return (
    <Stack gap="lg">
      <Choice prop="variant"
        label="Variant"
        size="compact"
        hideIndicator
        columns={3}
        value={config.variant}
        onChange={(variant) => set({ variant })}
        options={VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      {isCalendar && (
        <TextField
          label="Eyebrow"
          size="compact"
          value={config.eyebrow}
          onChange={(event) => set({ eyebrow: event.target.value })}
        />
      )}
      <TextField
        label="Title"
        size="compact"
        value={config.title}
        onChange={(event) => set({ title: event.target.value })}
      />
      {isCalendar && (
        <FieldRow>
          <TextField
            label="Date month"
            size="compact"
            value={config.dateMonth}
            onChange={(event) => set({ dateMonth: event.target.value })}
          />
          <TextField
            label="Date day"
            size="compact"
            value={config.dateDay}
            onChange={(event) => set({ dateDay: event.target.value })}
          />
        </FieldRow>
      )}
      <TextareaField
        label="Body"
        size="compact"
        rows="sm"
        value={config.children}
        onChange={(event) => set({ children: event.target.value })}
      />
      <Choice prop="status"
        label="Status"
        iconOnly
        value={config.status}
        onChange={(status) => set({ status })}
        options={statusOptions(STATUS_OPTIONS)}
      />
      {!isCalendar && (
        <Choice prop="iconMode"
          label="Icon"
          size="compact"
          hideIndicator
          columns={2}
          value={config.iconMode}
          onChange={(iconMode) => set({ iconMode })}
          options={[
            { label: 'Default', value: 'default' },
            { label: 'Custom', value: 'custom' },
          ]}
        />
      )}
      {!isCalendar && config.iconMode === 'custom' && (
        <IconSelect
          label="Icon name"
          value={config.icon}
          onChange={(icon) => set({ icon })}
        />
      )}
      <Choice prop="action"
        label="Action"
        size="compact"
        hideIndicator
        columns={3}
        value={config.action}
        onChange={(action) => set({
          action,
          actionLabel: action === 'button' ? 'Take action' : action === 'link' ? 'Learn more' : config.actionLabel,
        })}
        options={ACTION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      {config.action !== 'none' && (
        <TextField
          label="Action label"
          size="compact"
          value={config.actionLabel}
          onChange={(event) => set({ actionLabel: event.target.value })}
        />
      )}
      <Toggle prop="dismissible"
        label="Dismissible"
        value={config.dismissible}
        onChange={(dismissible) => set({ dismissible, dismissed: dismissible ? config.dismissed : false })}
      />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildBannerSnippet(config, utilityClass)}</Code>
}
