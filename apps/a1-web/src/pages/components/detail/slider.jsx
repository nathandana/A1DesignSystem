import { useState } from 'react'
import {
  Button,
  Code,
  IconButton,
  Paragraph,
  Slider,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Choice, DensityChoice, Lockable } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'

const MODE_OPTIONS = ['continuous', 'detents']
const VARIANT_OPTIONS = ['default', 'subtle']

// Tab label for a detent: its label, else its value; clamped once there are many.
function detentTabLabel(detent, index, total) {
  const text = (detent.label ?? '').trim() || String(detent.value ?? index + 1)
  if (total <= 4) return text
  return text.length > 4 ? `${text.slice(0, 4)}…` : text
}

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function escapeSingle(value) {
  return String(value ?? '').replaceAll('\\', '\\\\').replaceAll("'", "\\'")
}

export function getDefaultConfig() {
  return {
    label: 'Padding',
    size: 'default',
    variant: 'default',
    mode: 'detents',
    detents: [
      { value: 0, label: 'None' },
      { value: 1, label: 'XS' },
      { value: 2, label: 'SM' },
      { value: 3, label: 'MD' },
      { value: 4, label: 'LG' },
    ],
    min: 0,
    max: 100,
    step: 1,
    valuePosition: 'above',
    showValue: true,
    disabled: false,
  }
}

export function Preview({ config }) {
  const isDetents = config.mode === 'detents'
  const detents = isDetents ? config.detents : undefined
  const mid = detents?.length ? detents[Math.floor((detents.length - 1) / 2)].value : 40
  return (
    // Extra vertical room so the value bubble isn't clipped by the preview frame.
    <div style={{ paddingBlock: 'var(--base-spacing-24)' }}>
      <Slider
        // Remount when structural options change so the uncontrolled preview reflects them.
        key={`${config.mode}-${config.valuePosition}-${config.showValue}-${config.disabled}-${JSON.stringify(detents)}`}
        label={config.label || 'Slider'}
        size={config.size}
        variant={config.variant}
        detents={detents}
        min={config.min}
        max={config.max}
        step={config.step}
        defaultValue={isDetents ? mid : 40}
        valuePosition={config.valuePosition}
        showValue={config.showValue}
        disabled={config.disabled}
      />
    </div>
  )
}

function DetentItemEditor({ detent, canRemove, onChange, onRemove }) {
  return (
    <Stack gap="sm">
      <Stack direction="row" justify="end">
        <IconButton
          icon="delete"
          variant="destructive"
          size="sm"
          aria-label="Remove detent"
          disabled={!canRemove}
          onClick={onRemove}
        />
      </Stack>
      <Stack direction="row" gap="xs" align="end">
        <TextField
          label="Value"
          type="number"
          size="compact"
          value={detent.value}
          onChange={(e) => onChange({ value: Number(e.target.value) || 0 })}
        />
        <div className="a1-web-field-grow">
          <TextField
            label="Label"
            size="compact"
            value={detent.label ?? ''}
            onChange={(e) => onChange({ label: e.target.value })}
          />
        </div>
      </Stack>
      <Choice
        label="Display as"
        value={detent.icon ? 'icon' : 'label'}
        onChange={(mode) => onChange({ icon: mode === 'icon' ? (detent.icon || 'star') : undefined })}
        options={[
          { value: 'label', label: 'Label' },
          { value: 'icon', label: 'Icon' },
        ]}
      />
      {detent.icon && (
        <IconSelect label="Icon" size="compact" value={detent.icon} onChange={(icon) => onChange({ icon })} />
      )}
    </Stack>
  )
}

function DetentEditor({ detents, setConfig }) {
  const [active, setActive] = useState(0)
  const update = (i, patch) =>
    setConfig((c) => ({ ...c, detents: c.detents.map((d, idx) => (idx === i ? { ...d, ...patch } : d)) }))
  const remove = (i) => {
    setConfig((c) => ({ ...c, detents: c.detents.filter((_, idx) => idx !== i) }))
    setActive((a) => Math.max(0, Math.min(a, detents.length - 2)))
  }
  const add = () => {
    setConfig((c) => {
      const next = c.detents.length ? Math.max(...c.detents.map((d) => Number(d.value) || 0)) + 1 : 0
      return { ...c, detents: [...c.detents, { value: next, label: '' }] }
    })
    setActive(detents.length)
  }

  const activeIndex = Math.min(active, detents.length - 1)

  return (
    <Stack gap="sm">
      <Paragraph size="sm" color="muted">Detents</Paragraph>
      <div className="a1-web-item-tabs">
        <Tabs value={String(activeIndex)} onChange={(v) => setActive(Number(v))} variant="line" size="compact">
          <TabList>
            {detents.map((d, i) => (
              <Tab key={i} value={String(i)}>{detentTabLabel(d, i, detents.length)}</Tab>
            ))}
          </TabList>
          {detents.map((d, i) => (
            <TabPanel key={i} value={String(i)}>
              <DetentItemEditor
                detent={d}
                canRemove={detents.length > 2}
                onChange={(patch) => update(i, patch)}
                onRemove={() => remove(i)}
              />
            </TabPanel>
          ))}
        </Tabs>
      </div>
      <Button variant="secondary" size="sm" icon="add" onClick={add}>Add detent</Button>
    </Stack>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  const setNum = (key) => (event) => set({ [key]: Number(event.target.value) || 0 })

  return (
    <Stack gap="lg">
      <TextField
        label="Label"
        size="compact"
        value={config.label}
        onChange={(event) => set({ label: event.target.value })}
      />
      <DensityChoice value={config.size} onChange={(size) => set({ size })} />
      <Choice prop="variant"
        label="Variant"
        size="compact"
        hideIndicator
        columns={2}
        value={config.variant}
        onChange={(variant) => set({ variant })}
        options={VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Choice prop="mode"
        label="Mode"
        size="compact"
        hideIndicator
        columns={2}
        value={config.mode}
        onChange={(mode) => set({ mode })}
        options={MODE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      {config.mode === 'continuous' ? (
        <Stack direction="row" gap="sm">
          <TextField label="Min" size="compact" type="number" value={config.min} onChange={setNum('min')} />
          <TextField label="Max" size="compact" type="number" value={config.max} onChange={setNum('max')} />
          <TextField label="Step" size="compact" type="number" value={config.step} onChange={setNum('step')} />
        </Stack>
      ) : (
        <DetentEditor detents={config.detents} setConfig={setConfig} />
      )}
      <Lockable prop="valuePosition"><Toolbar label="Value bubble">
        <ToolbarGroup
          aria-label="Value position"
          value={config.valuePosition}
          onChange={(valuePosition) => set({ valuePosition })}
          options={[
            { value: 'above', label: 'Above', icon: 'arrow_upward' },
            { value: 'below', label: 'Below', icon: 'arrow_downward' },
          ]}
        />
        <ToolbarDivider />
        <ToolbarToggle icon="visibility" label="Show value" pressed={config.showValue} onChange={(showValue) => set({ showValue })} />
        <ToolbarToggle icon="block" label="Disabled" pressed={config.disabled} onChange={(disabled) => set({ disabled })} />
      </Toolbar></Lockable>
    </Stack>
  )
}

function serializeDetents(detents) {
  const rows = detents
    .map((d) => {
      const parts = [`value: ${Number(d.value) || 0}`]
      if (d.label) parts.push(`label: '${escapeSingle(d.label)}'`)
      if (d.icon) parts.push(`icon: '${escapeSingle(d.icon)}'`)
      return `    { ${parts.join(', ')} }`
    })
    .join(',\n')
  return `[\n${rows},\n  ]`
}

function buildSliderSnippet(config) {
  const isDetents = config.mode === 'detents'
  const mid = isDetents && config.detents.length
    ? config.detents[Math.floor((config.detents.length - 1) / 2)].value
    : 40
  const props = [
    `label="${escapeJsxString(config.label || 'Slider')}"`,
    config.size && config.size !== 'default' ? `size="${config.size}"` : null,
    config.variant && config.variant !== 'default' ? `variant="${config.variant}"` : null,
    isDetents ? `detents={${serializeDetents(config.detents)}}` : null,
    `defaultValue={${isDetents ? mid : 40}}`,
    !isDetents && config.min !== 0 ? `min={${config.min}}` : null,
    !isDetents && config.max !== 100 ? `max={${config.max}}` : null,
    !isDetents && config.step !== 1 ? `step={${config.step}}` : null,
    config.valuePosition !== 'above' ? `valuePosition="${config.valuePosition}"` : null,
    config.showValue ? null : 'showValue={false}',
    config.disabled ? 'disabled' : null,
    'onChange={setValue}',
  ].filter(Boolean).join('\n  ')

  return `<Slider\n  ${props}\n/>`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSliderSnippet(config)}</Code>
}
