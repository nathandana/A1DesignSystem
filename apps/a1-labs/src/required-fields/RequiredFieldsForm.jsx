import React, { forwardRef, useEffect, useState } from 'react'
import {
  Banner, Button, CheckboxGroup, FieldRow, Fieldset, Heading, Icon, Link, Paragraph, RadioGroup, SelectField,
  Stack, TextareaField, TextField,
} from '@gtivr4/a1-design-system-react'
import { REQUIRED, SECTIONS, filled, requiredProgress } from './form-model.js'
import './required-fields.css'

// The required-fields form, rendered in one of five marking variations. None
// uses A1's own required markers (asterisk or Required badge): each variation
// draws its own required/optional treatment and its own way of marking missing
// fields on submission. A1 supplies only the controls. State (values, errors,
// submission) belongs to the host.

// Fields that sit side by side when they share a section.
const ROWS = [['firstName', 'lastName'], ['city', 'state', 'zip']]
const controlId = id => `rf-${id}`
const missingId = id => `rf-${id}-missing`

// Each required field's number on the rail.
const STATION = Object.fromEntries(REQUIRED.map((field, index) => [field.id, index + 1]))

function focusField(id) {
  const target = document.getElementById(controlId(id))
  const control = target?.matches('fieldset') ? target.querySelector('input') : target
  control?.focus()
}

// Completion ring after a required label: hollow until answered, filled with a
// check once answered, red with an exclamation mark when missing on submission.
function Ring({ state }) {
  return (
    <span className="a1-required-fields__ring" data-state={state} aria-hidden="true">
      {state === 'done' && <Icon name="check" size="xs" />}
      {state === 'missing' && <Icon name="priority_high" size="xs" />}
    </span>
  )
}

function fieldLabel(field, variant, ringState) {
  const isGroup = field.kind === 'radio' || field.kind === 'checkbox'
  return (
    <>
      {field.label}
      {/* Groups can't carry aria-required, so their legend says it. */}
      {field.required && isGroup && <span className="a1-required-fields__sr"> (required)</span>}
      {!field.required && (variant.id === 'opt-in' || variant.id === 'rail') && (
        <span className="a1-required-fields__optional"> optional</span>
      )}
      {field.required && variant.id === 'rings' && <> <Ring state={ringState} /></>}
    </>
  )
}

function FormField({ field, variant, value, error, onChange }) {
  const id = controlId(field.id)
  const isGroup = field.kind === 'radio' || field.kind === 'checkbox'
  const ringState = error && !filled(value) ? 'missing' : filled(value) ? 'done' : 'empty'
  const describedBy = [field.hint ? `${id}-hint` : null, error ? missingId(field.id) : null].filter(Boolean).join(' ') || undefined
  // No A1 `required` or `error` props: the experiment draws its own markers and
  // messages, and wires their semantics up itself.
  const common = { id, label: fieldLabel(field, variant, ringState), hint: field.hint, 'aria-describedby': describedBy }
  const input = isGroup ? {} : { 'aria-required': field.required ? 'true' : undefined, 'aria-invalid': error ? 'true' : undefined }
  const options = (field.options ?? []).map(([optionValue, label]) => ({ value: optionValue, label }))
  let control
  if (field.kind === 'select') {
    control = (
      <SelectField {...common} {...input} name={field.id} value={value} autoComplete={field.autoComplete}
        onChange={event => onChange(field.id, event.target.value)}>
        {field.options.map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}
      </SelectField>
    )
  } else if (field.kind === 'textarea') {
    control = <TextareaField {...common} {...input} name={field.id} value={value} rows={3} onChange={event => onChange(field.id, event.target.value)} />
  } else if (field.kind === 'radio') {
    control = <RadioGroup {...common} name={field.id} value={value || null} options={options} onChange={next => onChange(field.id, next)} />
  } else if (field.kind === 'checkbox') {
    control = <CheckboxGroup {...common} name={field.id} value={value} options={options} onChange={next => onChange(field.id, next)} />
  } else {
    control = (
      <TextField {...common} {...input} name={field.id} type={field.type ?? 'text'} value={value} autoComplete={field.autoComplete}
        onChange={event => onChange(field.id, event.target.value)} />
    )
  }
  return (
    <div className="a1-required-fields__item" data-required={field.required ? 'true' : 'false'}
      data-kind={isGroup ? 'group' : 'control'} data-invalid={error ? 'true' : undefined}
      data-done={field.required && filled(value) && !error ? 'true' : undefined}>
      {/* Rail stop: its number, or a success check once answered. */}
      {variant.id === 'rail' && field.required && (
        <span className="a1-required-fields__stop" aria-hidden="true">
          {filled(value) && !error ? <Icon name="check" size="sm" /> : STATION[field.id]}
        </span>
      )}
      {control}
      {error && (
        <p className="a1-required-fields__error" id={missingId(field.id)}>
          <Icon name="error" size="xs" />
          <span className="a1-required-fields__error-text">{error}</span>
        </p>
      )}
    </div>
  )
}

// Lay fields out, putting the ROWS pairs/triples side by side when all present.
function FieldList({ fields, render, rows, missing }) {
  const out = []
  const ids = fields.map(field => field.id)
  for (let index = 0; index < fields.length; index += 1) {
    const row = rows && ROWS.find(group => group[0] === fields[index].id && group.every(id => ids.includes(id)))
    if (row) {
      out.push(<FieldRow key={row.join('-')}>{row.map(id => render(fields.find(field => field.id === id)))}</FieldRow>)
      index += row.length - 1
    } else {
      out.push(render(fields[index]))
    }
  }
  return <Stack gap={16} className="a1-required-fields__list" data-missing={missing ? 'true' : undefined}>{out}</Stack>
}

// Opt-in extras: buttons that add each optional field to its section.
function Extras({ fields, onAdd }) {
  if (fields.length === 0) return null
  return (
    <Stack direction="row" gap={8} wrap align="center">
      <Paragraph as="span" size="sm" color="muted">Optional:</Paragraph>
      {fields.map(field => (
        <Button key={field.id} variant="tertiary" size="sm" icon="add" onClick={() => onAdd(field.id)}>
          {field.addLabel}
        </Button>
      ))}
    </Stack>
  )
}

// Rail: a sticky bar that steps through the missing fields in turn.
function Dock({ missing, errors }) {
  // Submission already focuses the first missing field, so start at the second.
  const [next, setNext] = useState(missing.length > 1 ? 1 : 0)
  useEffect(() => { if (next >= missing.length) setNext(0) }, [missing.length, next])
  if (missing.length === 0) return null
  const target = missing[Math.min(next, missing.length - 1)]
  return (
    <div className="a1-required-fields__dock">
      <Stack direction="row" gap={12} align="center" justify="between" wrap>
        <Paragraph role="status" size="sm">
          <strong>{`${missing.length} required ${missing.length === 1 ? 'stop' : 'stops'} to go.`}</strong>
          {` Next: ${errors[target]}`}
        </Paragraph>
        <Button variant="secondary" size="sm" icon="arrow_downward" iconPosition="end"
          onClick={() => { focusField(target); setNext((next + 1) % missing.length) }}>
          Go to next
        </Button>
      </Stack>
    </div>
  )
}

/**
 * @param {object} props
 * @param {object} props.variant  One of VARIANTS.
 * @param {object} props.values
 * @param {Record<string, string>} props.errors  Errors to show (empty until the first submission).
 * @param {'idle'|'invalid'|'sent'} props.result
 * @param {(id: string, value: any) => void} props.onChange
 * @param {() => void} props.onSubmit
 * The ref goes to the "Before you send" checklist (opt-in) or the success
 * message, so the host can move focus there.
 */
export const RequiredFieldsForm = forwardRef(function RequiredFieldsForm({ variant, values, errors, result, onChange, onSubmit }, messageRef) {
  const [added, setAdded] = useState([])
  const missing = Object.keys(errors)
  const progress = requiredProgress(values)
  const optIn = variant.id === 'opt-in'
  const add = id => {
    setAdded(current => [...current, id])
    requestAnimationFrame(() => focusField(id))
  }
  const render = field => (
    <FormField key={field.id} field={field} variant={variant} value={values[field.id]} error={errors[field.id]} onChange={onChange} />
  )

  return (
    <form className="a1-required-fields" data-variant={variant.id} noValidate
      onSubmit={event => { event.preventDefault(); onSubmit() }} aria-labelledby="rf-title">
      <Stack gap={24}>
        <Paragraph color="muted">{variant.note}</Paragraph>
        {variant.id === 'rail' && (
          <Paragraph size="sm">{`${progress.done} of ${progress.total} stops answered`}</Paragraph>
        )}

        {SECTIONS.map(section => {
          const shown = section.fields.filter(field => field.required || !optIn || added.includes(field.id))
          const extras = optIn ? section.fields.filter(field => !field.required && !added.includes(field.id)) : []
          const needed = section.fields.filter(field => field.required && !filled(values[field.id]))
          const requiredCount = section.fields.filter(field => field.required).length
          const counter = variant.id === 'rings' && requiredCount > 0 && (
            result === 'invalid' && needed.length > 0
              ? <span className="a1-required-fields__counter" data-state="missing">{`${needed.length} still needed`}</span>
              : <span className="a1-required-fields__counter">{`${requiredCount - needed.length} of ${requiredCount} answered`}</span>
          )
          return (
            <Fieldset key={section.id} legend={counter ? <>{section.legend} {counter}</> : section.legend}>
              <Stack gap={12}>
                <FieldList fields={shown} render={render} rows={variant.rows !== false}
                  missing={shown.some(field => errors[field.id])} />
                <Extras fields={extras} onAdd={add} />
              </Stack>
            </Fieldset>
          )
        })}

        <div ref={messageRef} tabIndex={-1} className="a1-required-fields__message">
          {optIn && result === 'invalid' && missing.length > 0 && (
            <section className="a1-required-fields__checklist" aria-labelledby="rf-checklist-title">
              <Stack gap={8}>
                <Heading as="h3" size="xs" id="rf-checklist-title">
                  {`Before you send: ${missing.length} ${missing.length === 1 ? 'thing' : 'things'} to fill in`}
                </Heading>
                <ul className="a1-required-fields__checklist-list">
                  {missing.map(id => (
                    <li key={id}>
                      <Icon name="radio_button_unchecked" size="xs" />
                      <Link href={`#${controlId(id)}`} onClick={event => { event.preventDefault(); focusField(id) }}>
                        {errors[id]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Stack>
            </section>
          )}
          {result === 'sent' && (
            <Banner status="success" title="Request ready">This is a demo, so nothing was sent.</Banner>
          )}
        </div>

        {variant.id === 'rail' && result === 'invalid' && <Dock missing={missing} errors={errors} />}

        <Button type="submit" icon="send" fullWidth>Send request</Button>
      </Stack>
    </form>
  )
})

export { focusField, controlId }
