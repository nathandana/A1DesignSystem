import React, { useState } from 'react'
import { Button, ButtonContainer, Card, ChoiceGroup, Code, Heading, Inset, Link, List, ListItem, Paragraph, Section, SelectField, Stack, Switch } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { RuleBuilder } from './RuleBuilder.jsx'
import { describeRule, exampleRule, fields, initialRule, testRule, triggers, validateRule } from './rule-model.js'
export function AutomationBuilderExperiment({ experiment, onOpenSettings }) {
  const [rule, setRule] = useState(initialRule), [mode, setMode] = useState('auto'), [showData, setShowData] = useState(false), [result, setResult] = useState(null), [session, setSession] = useState(0)
  const [sample, setSample] = useState({ event: 'created', priority: 'High', type: 'Bug', status: 'Open' })
  const change = next => { setRule(next); setResult(null) }
  const load = next => { change(next); setSession(value => value + 1) }
  const errors = validateRule(rule)
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={
    <Inset space={16}><Stack gap={24}>
      <ChoiceGroup label="Editor presentation" columns={1} size="compact" value={mode} onChange={setMode} options={[{ value: 'auto', label: 'Automatic' }, { value: 'sentence', label: 'Sentence' }, { value: 'blocks', label: 'Structured blocks' }]} />
      <Paragraph size="sm" color="muted">Automatic uses blocks when the rule has more than one condition or action.</Paragraph>
      <Button variant="secondary" onClick={() => load(initialRule)}>Load simple rule</Button><Button variant="secondary" onClick={() => load(exampleRule)}>Load complex rule</Button>
      <Switch label="Show structured rule" checked={showData} onChange={setShowData} />
      <Heading as="h2" size="sm">Test event</Heading>
      <SelectField label="Sample trigger" value={sample.event} onChange={event => { setSample({ ...sample, event: event.target.value }); setResult(null) }}>{triggers.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</SelectField>
      {Object.entries(fields).map(([field, values]) => <SelectField key={field} label={`Sample ${field}`} value={sample[field]} onChange={event => { setSample({ ...sample, [field]: event.target.value }); setResult(null) }}>{values.map(value => <option key={value}>{value}</option>)}</SelectField>)}
      <Paragraph size="sm" color="muted">Tests are local simulations. No automation is saved, enabled or connected to a service.</Paragraph>
      <Link href="https://www.atlassian.com/software/jira/features/automation">Study: Jira Automation</Link>
    </Stack></Inset>
  }><Section padding="none" contentWidth="md"><Stack gap={24}>
    <RuleBuilder key={session} rule={rule} onChange={change} mode={mode} />
    <Card><Stack gap={12}><Heading as="h2" size="sm">Rule summary</Heading><Paragraph>{describeRule(rule)}</Paragraph></Stack></Card>
    {errors.length > 0 && <Paragraph role="alert">{errors.join(' ')}</Paragraph>}
    <ButtonContainer align="start"><Button icon="play_arrow" onClick={() => setResult(testRule(rule, sample))} disabled={errors.length > 0}>Test rule</Button></ButtonContainer>
    <Paragraph role="status" aria-live="polite">{result ? result.status === 'matched' ? `Test matched. ${result.actions.length} actions would run. Nothing was sent or changed.` : 'Test skipped. No actions would run.' : 'Ready to test against the sample event.'}</Paragraph>
    {result && <Card><Stack gap={16}><Heading as="h2" size="sm">Test trace</Heading><List>{[...result.steps, ...result.actions].map((step, index) => <ListItem key={index}>{step.label} — {step.result}</ListItem>)}</List></Stack></Card>}
    {showData && <Stack gap={12}><Heading as="h2" size="sm">Structured rule</Heading><Code variant="block" wrapping copyCode>{JSON.stringify(rule, null, 2)}</Code></Stack>}
  </Stack></Section></ExperimentLayout>
}
