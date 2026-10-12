import React, { useRef, useState } from 'react'
import { Button, Heading, Inset, Paragraph, RadioGroup, Section, Stack } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { REQUIRED, VARIANTS, emptyValues, requiredExample, validate } from './form-model.js'
import { RequiredFieldsForm, focusField } from './RequiredFieldsForm.jsx'

// Labs page: the required-fields form with a chooser for the five marking
// variations, plus demo helpers. Submission state carries across variations so
// the same missing fields can be compared.

export function RequiredFieldsExperiment({ experiment, onOpenSettings }) {
  const [variantId, setVariantId] = useState('rail')
  const [values, setValues] = useState(emptyValues)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState('idle')
  const messageRef = useRef(null)
  const [formKey, setFormKey] = useState(0)
  const variant = VARIANTS.find(item => item.id === variantId)
  const errors = submitted ? validate(values) : {}

  const change = (id, value) => {
    setValues(current => ({ ...current, [id]: value }))
    if (result === 'sent') setResult('idle')
  }
  const submit = () => {
    const found = validate(values)
    setSubmitted(true)
    if (Object.keys(found).length === 0) {
      setResult('sent')
      requestAnimationFrame(() => messageRef.current?.focus())
      return
    }
    setResult('invalid')
    // Each variation chooses where focus goes: the first missing field, or
    // the checklist by the submit button.
    requestAnimationFrame(() => {
      if (variant.focus === 'checklist') messageRef.current?.focus()
      else focusField(Object.keys(found)[0])
    })
  }
  const reset = values => { setValues(values); setSubmitted(false); setResult('idle'); setFormKey(key => key + 1) }

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <RadioGroup
          label="Marking style"
          hint="From subtle to extreme."
          name="marking-style"
          value={variantId}
          onChange={setVariantId}
          options={VARIANTS.map((item, index) => ({ value: item.id, label: `${index + 1}. ${item.name}`, hint: item.summary }))}
        />
        <Stack gap={4}>
          <Paragraph size="sm">On submit</Paragraph>
          <Paragraph size="sm" color="muted">{variant.onSubmit}</Paragraph>
        </Stack>
        <Stack gap={8}>
          <Button variant="secondary" icon="edit_note" onClick={() => reset(requiredExample())} fullWidth>Fill required fields</Button>
          <Button variant="secondary" icon="restart_alt" onClick={() => reset(emptyValues())} fullWidth>Reset form</Button>
        </Stack>
        <Paragraph size="sm" color="muted">{REQUIRED.length} of the form’s fields are required. Submit it empty to see how missing fields are marked.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="md">
        <Stack gap={8}>
          <Heading as="h2" size="md" id="rf-title">Request a tasting</Heading>
          <RequiredFieldsForm key={formKey} ref={messageRef} variant={variant} values={values} errors={errors} result={result}
            onChange={change} onSubmit={submit} />
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
