import React, { useEffect, useId, useMemo, useState } from 'react'
import { Banner, Button, ButtonContainer, CheckboxGroup, ChoiceGroup, Heading, Inset, Paragraph, Section, Slider, Stack, Switch, TextField, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { analysePassword } from './password-model.js'
import { STRENGTH_STYLES, StrengthMeter, StrengthUnderline } from './StrengthMeter.jsx'

// Labs page: a new-password field with seven strength meter styles and the
// rules behind them. Everything is local: nothing typed is stored or sent.

const LEVELS = [3, 4, 5].map(value => ({ value: String(value), label: `${value} levels` }))
const LENGTHS = [8, 12, 16]
const CHARACTER_RULES = [
  { value: 'lower', label: 'Lowercase letter', error: 'Add a lowercase letter.' },
  { value: 'upper', label: 'Uppercase letter', error: 'Add an uppercase letter.' },
  { value: 'number', label: 'Number', error: 'Add a number.' },
  { value: 'symbol', label: 'Symbol', error: 'Add a symbol, such as ! or #.' },
]
const TIMING = [
  { value: 'typing', label: 'As you type', icon: 'keyboard' },
  { value: 'pause', label: 'After a pause', icon: 'pause_circle' },
]
const EXAMPLES = [
  { label: 'Common', value: 'P@ssw0rd1' },
  { label: 'Short and mixed', value: 'Kp7#vR2q' },
  { label: 'Passphrase', value: 'copper kettle orbit meadow' },
]
// Browsers without CSS text masking show the characters, so Show password is hidden.
const canMask = typeof CSS !== 'undefined' && CSS.supports('-webkit-text-security', 'disc')
const pauseDelay = () => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--component-password-strength-pause-delay')) || 0

export function PasswordStrengthExperiment({ experiment, onOpenSettings }) {
  const [variant, setVariant] = useState('segments')
  const [levels, setLevels] = useState('4')
  const [minLength, setMinLength] = useState(12)
  const [require, setRequire] = useState([])
  const [timing, setTiming] = useState('typing')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [password, setPassword] = useState('')
  const [measured, setMeasured] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [accepted, setAccepted] = useState(false)
  const fieldId = useId()
  const meterId = useId()

  // "After a pause" waits for typing to stop before measuring.
  useEffect(() => {
    if (timing === 'typing') { setMeasured(password); return undefined }
    const timer = setTimeout(() => setMeasured(password), pauseDelay())
    return () => clearTimeout(timer)
  }, [password, timing])

  const rules = useMemo(() => ({ minLength, require }), [minLength, require])
  const result = useMemo(() => analysePassword(measured, rules), [measured, rules])
  const hint = `Use at least ${minLength} characters. A few unrelated words work well.`

  const change = value => { setPassword(value); setError(''); setAccepted(false) }
  const submit = event => {
    event.preventDefault()
    const now = analysePassword(password, rules)
    const unmet = now.checks.find(check => !check.met)
    if (now.empty) setError('Enter a password.')
    else if (unmet) setError(unmet.id === 'length' ? `Use at least ${minLength} characters.` : CHARACTER_RULES.find(rule => rule.value === unmet.id).error)
    else if (now.grade < 2) setError('Choose a stronger password: avoid common words and patterns.')
    else { setError(''); setAccepted(true); return }
    setAccepted(false)
    document.getElementById(fieldId)?.focus()
  }

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Meter style" name="password-meter" columns={1} size="compact" inlineIcon value={variant} onChange={setVariant}
          options={STRENGTH_STYLES.map(item => ({ value: item.id, label: item.label, icon: item.icon, subtext: item.summary }))} />
        <Toolbar label="Strength levels" fullWidth>
          <ToolbarGroup aria-label="Strength levels" value={levels} onChange={setLevels} showLabels options={LEVELS} />
        </Toolbar>
        <Slider label="Minimum length" variant="subtle" value={minLength} detents={LENGTHS.map(value => ({ value, label: String(value) }))}
          formatValue={value => `${value} characters`} onChange={setMinLength} />
        <CheckboxGroup label="Also require" size="compact" hint="Length matters most; character rules add friction without much strength."
          options={CHARACTER_RULES.map(({ value, label }) => ({ value, label }))} value={require} onChange={setRequire} />
        <Toolbar label="Update the meter" fullWidth>
          <ToolbarGroup aria-label="Update the meter" value={timing} onChange={setTiming} showLabels options={TIMING} />
        </Toolbar>
        <Switch label="Show suggestions" checked={showSuggestions} onChange={setShowSuggestions} />
        <Stack gap={8}>
          <Paragraph size="sm" color="muted">Try an example</Paragraph>
          {EXAMPLES.map(example => (
            <Button key={example.label} variant="secondary" size="sm" onClick={() => change(example.value)}>{example.label}</Button>
          ))}
          <Button variant="tertiary" size="sm" icon="backspace" onClick={() => change('')}>Clear password</Button>
        </Stack>
        <Paragraph size="sm" color="muted">Strength is estimated in your browser from patterns, common passwords and length. Nothing is saved or sent. Use a made-up password: this is not a real password field, so password managers ignore it and screen readers may read the characters aloud.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="sm">
        <Stack gap={24}>
          <Stack as="form" gap={16} noValidate onSubmit={submit} aria-labelledby={`${fieldId}-title`}>
            <Heading as="h2" size="md" id={`${fieldId}-title`}>Create a password</Heading>
            {/* Deliberately not type="password": a demo field must not make password
                managers offer, generate or save a password. Characters are masked
                with CSS instead, and the field opts out of the common managers. */}
            <TextField id={fieldId} label="New password" type="text" name="strength-sample" autoComplete="off"
              className={canMask && !visible ? 'a1-password-strength-field--masked' : undefined}
              autoCorrect="off" data-1p-ignore="true" data-lpignore="true" data-bwignore="true" data-form-type="other"
              hint={hint} error={error || undefined} value={password} onChange={event => change(event.target.value)}
              spellCheck={false} autoCapitalize="none"
              aria-describedby={`${error ? `${fieldId}-error` : `${fieldId}-hint`} ${meterId}`}
              inputOverlay={variant === 'underline' ? <StrengthUnderline result={result} levels={Number(levels)} /> : undefined} />
            <StrengthMeter result={result} levels={Number(levels)} variant={variant} id={meterId} showSuggestions={showSuggestions} />
            {canMask && <Switch label="Show password" size="compact" checked={visible} onChange={setVisible} />}
            <ButtonContainer align="start">
              <Button type="submit">Save password</Button>
            </ButtonContainer>
            {accepted && <Banner status="success" title="Password accepted">This demo doesn’t save or send it.</Banner>}
          </Stack>
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
