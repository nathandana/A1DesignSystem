import {
  Code,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, DensityChoice, FieldState } from './configKit.jsx'

// Shared configurator factory for the field family (TextField, NumberField,
// DateField, TimeField, PhoneField, ZipField, CreditCardField). Each field
// component shares the same base props; type-specific extras are injected.

const LABEL_POSITION_OPTIONS = ['above', 'before']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

export function createFieldModule({
  Component,
  componentName,
  defaults = {},
  ExtraControls,
  getExtraProps,
  getExtraSnippetProps,
  fillContainer = false,
}) {
  function getDefaultConfig() {
    return {
      label: 'Label',
      value: '',
      hint: '',
      error: '',
      size: 'default',
      labelPosition: 'above',
      autoComplete: '',
      required: false,
      disabled: false,
      readOnly: false,
      ...defaults,
    }
  }

  function Preview({ config, utilityClass = '' }) {
    const extra = getExtraProps ? getExtraProps(config) : {}
    const field = (
      <Component
        // Remount when the value or type-specific props change so the
        // uncontrolled field reflects the config while staying editable.
        key={JSON.stringify([config.value, extra])}
        label={config.label || undefined}
        hint={config.hint || undefined}
        error={config.error || undefined}
        size={config.size}
        labelPosition={config.labelPosition}
        required={config.required}
        disabled={config.disabled}
        readOnly={config.readOnly}
        autoComplete={config.autoComplete || undefined}
        defaultValue={config.value || undefined}
        className={utilityClass || undefined}
        {...extra}
      />
    )
    if (fillContainer) {
      return <div className="a1-web-field-fill">{field}</div>
    }
    return field
  }

  function Controls({ config, setConfig }) {
    const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
    return (
      <Stack gap="lg">
        <TextField
          label="Label"
          size="compact"
          value={config.label}
          onChange={(event) => set({ label: event.target.value })}
        />
        {ExtraControls && <ExtraControls config={config} setConfig={setConfig} />}
        <TextField
          label="Value"
          size="compact"
          value={config.value}
          onChange={(event) => set({ value: event.target.value })}
        />
        <TextField
          label="Hint"
          size="compact"
          value={config.hint}
          onChange={(event) => set({ hint: event.target.value })}
        />
        <TextField
          label="Error"
          size="compact"
          value={config.error}
          onChange={(event) => set({ error: event.target.value })}
        />
        <TextField
          label="Autocomplete"
          hint="Autofill hint, e.g. email, tel, postal-code, cc-number, off."
          size="compact"
          value={config.autoComplete}
          onChange={(event) => set({ autoComplete: event.target.value })}
        />
        <DensityChoice value={config.size} onChange={(size) => set({ size })} />
        <Choice prop="labelPosition"
          label="Label position"
          size="compact"
          hideIndicator
          columns={2}
          value={config.labelPosition}
          onChange={(labelPosition) => set({ labelPosition })}
          options={LABEL_POSITION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
        />
        <FieldState
          items={[
            { key: 'required', label: 'Required', icon: 'asterisk', value: config.required },
            { key: 'disabled', label: 'Disabled', icon: 'block', value: config.disabled },
            { key: 'readOnly', label: 'Read only', icon: 'edit_off', value: config.readOnly },
          ]}
          onChange={set}
        />
      </Stack>
    )
  }

  function Snippet({ config, utilityClass = '' }) {
    const extraSnippet = getExtraSnippetProps ? getExtraSnippetProps(config) : []
    const props = [
      ...extraSnippet,
      utilityClass ? `className="${escapeJsxString(utilityClass)}"` : null,
      config.label ? `label="${escapeJsxString(config.label)}"` : null,
      config.value ? `defaultValue="${escapeJsxString(config.value)}"` : null,
      config.hint ? `hint="${escapeJsxString(config.hint)}"` : null,
      config.error ? `error="${escapeJsxString(config.error)}"` : null,
      config.size !== 'default' ? `size="${config.size}"` : null,
      config.labelPosition !== 'above' ? `labelPosition="${config.labelPosition}"` : null,
      config.autoComplete ? `autoComplete="${escapeJsxString(config.autoComplete)}"` : null,
      config.required ? 'required' : null,
      config.disabled ? 'disabled' : null,
      config.readOnly ? 'readOnly' : null,
    ].filter(Boolean).join('\n  ')

    return <Code variant="block" wrapping copyCode>{`<${componentName}\n  ${props}\n/>`}</Code>
  }

  return { getDefaultConfig, Preview, Controls, Snippet }
}

export { escapeJsxString }
