import React, { useEffect, useId, useRef, useState } from 'react'
import { Button, ButtonContainer, Card, ChoiceGroup, Dialog, Heading, IconButton, Paragraph, SelectField, Stack, TextField } from '@gtivr4/a1-design-system-react'
import { actionText, actionTypes, conditionText, fields, moveAction, presentationFor, triggers } from './rule-model.js'

const options = values => values.map(value => <option key={value} value={value}>{value}</option>)
export function RuleBuilder({ rule, onChange, mode = 'auto' }) {
  const [editing, setEditing] = useState(null), [draft, setDraft] = useState(null), [notice, setNotice] = useState('')
  const id = useId(), counter = useRef(0), addCondition = useRef(null), addAction = useRef(null)
  const frame = useRef(0), view = presentationFor(rule, mode), previousView = useRef(view)
  useEffect(() => { if (view !== previousView.current) { setNotice(`${view === 'blocks' ? 'Structured blocks' : 'Sentence editor'} shown. All clauses are preserved.`); previousView.current = view } }, [view])
  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  const focusAdd = kind => { cancelAnimationFrame(frame.current); frame.current = requestAnimationFrame(() => (kind === 'condition' ? addCondition : addAction).current?.focus()) }
  const edit = (kind, item) => { setEditing({ kind, id: item?.id }); setDraft(kind === 'trigger' ? { value: rule.trigger } : { ...item }) }
  const add = kind => {
    const item = kind === 'condition' ? { id: `${id}-${++counter.current}`, field: 'type', operator: 'is', value: 'Bug' } : { id: `${id}-${++counter.current}`, type: 'assign', value: 'Avery' }
    const key = kind === 'condition' ? 'conditions' : 'actions'
    onChange({ ...rule, [key]: [...rule[key], item] }); setNotice(`${kind === 'condition' ? 'Condition' : 'Action'} added.`)
  }
  const remove = (kind, itemId) => {
    const key = kind === 'condition' ? 'conditions' : 'actions'
    onChange({ ...rule, [key]: rule[key].filter(item => item.id !== itemId) }); setNotice(`${kind === 'condition' ? 'Condition' : 'Action'} removed.`); focusAdd(kind)
  }
  const save = event => {
    event.preventDefault()
    if (editing.kind === 'trigger') onChange({ ...rule, trigger: draft.value })
    else { const key = editing.kind === 'condition' ? 'conditions' : 'actions'; onChange({ ...rule, [key]: rule[key].map(item => item.id === editing.id ? draft : item) }) }
    setEditing(null); setNotice('Rule updated. Run the test again to check the result.')
  }
  const trigger = <Button variant="tertiary" size="sm" aria-label="Edit trigger" aria-haspopup="dialog" onClick={() => edit('trigger')}>{triggers.find(item => item.value === rule.trigger)?.label}</Button>
  const clause = (kind, item, index) => <Stack key={item.id} direction="row" wrap align="center" gap={8}>
    <Button variant="tertiary" size="sm" aria-label={`Edit ${kind} ${index + 1}`} aria-haspopup="dialog" onClick={() => edit(kind, item)}>{kind === 'condition' ? conditionText(item) : actionText(item)}</Button>
    {view === 'blocks' && <>
      {kind === 'action' && <>
        <IconButton variant="tertiary" size="sm" icon="arrow_upward" label={`Move action ${index + 1} earlier`} disabled={index === 0} onClick={() => { onChange({ ...rule, actions: moveAction(rule.actions, item.id, -1) }); setNotice('Action moved earlier.') }} />
        <IconButton variant="tertiary" size="sm" icon="arrow_downward" label={`Move action ${index + 1} later`} disabled={index === rule.actions.length - 1} onClick={() => { onChange({ ...rule, actions: moveAction(rule.actions, item.id, 1) }); setNotice('Action moved later.') }} />
      </>}
      <IconButton variant="tertiary" size="sm" icon="close" label={`Remove ${kind} ${index + 1}`} disabled={kind === 'action' && rule.actions.length === 1} onClick={() => remove(kind, item.id)} />
    </>}
  </Stack>
  return <Stack gap={16} className="a1-automation-builder" data-view={view}>
    <TextField label="Rule name" value={rule.name} maxLength={80} onChange={event => onChange({ ...rule, name: event.target.value })} />
    {view === 'sentence' ? <Card><Stack direction="row" wrap align="center" gap={8}>
      <Paragraph weight="medium">When</Paragraph>{trigger}<Paragraph weight="medium">if</Paragraph>
      {rule.conditions.length ? rule.conditions.map((item, index) => <React.Fragment key={item.id}>{index > 0 && <Paragraph>{rule.match === 'all' ? 'and' : 'or'}</Paragraph>}{clause('condition', item, index)}</React.Fragment>) : <Paragraph>no conditions are required</Paragraph>}
      <Paragraph weight="medium">then</Paragraph>
      {rule.actions.map((item, index) => <React.Fragment key={item.id}>{index > 0 && <Paragraph>then</Paragraph>}{clause('action', item, index)}</React.Fragment>)}
    </Stack></Card> : <Stack gap={16}>
      <Card icon="bolt"><Stack gap={12}><Heading as="h2" size="sm">1. When</Heading>{trigger}</Stack></Card>
      <Card icon="filter_alt"><Stack gap={12}><Heading as="h2" size="sm">2. If</Heading>
        <ChoiceGroup label="Conditions match" columns={2} size="compact" value={rule.match} onChange={match => onChange({ ...rule, match })} options={[{ value: 'all', label: 'All (AND)' }, { value: 'any', label: 'Any (OR)' }]} />
        {rule.conditions.length ? rule.conditions.map((item, index) => clause('condition', item, index)) : <Paragraph>No conditions: every matching trigger continues.</Paragraph>}
      </Stack></Card>
      <Card icon="play_arrow"><Stack gap={12}><Heading as="h2" size="sm">3. Then</Heading><Paragraph size="sm" color="muted">Actions run in this order.</Paragraph>{rule.actions.map((item, index) => clause('action', item, index))}</Stack></Card>
    </Stack>}
    <ButtonContainer align="start"><Button ref={addCondition} variant="secondary" icon="add" onClick={() => add('condition')} disabled={rule.conditions.length >= 6}>Add condition</Button><Button ref={addAction} variant="secondary" icon="add" onClick={() => add('action')} disabled={rule.actions.length >= 6}>Add action</Button></ButtonContainer>
    <Paragraph size="sm" color="muted">{view === 'sentence' ? 'Select a phrase to edit it. Add another condition or action to explore structured blocks.' : 'Select a clause to edit it. Combine up to six conditions and six ordered actions.'}</Paragraph>
    <Paragraph role="status" aria-live="polite" size="sm">{notice || `${view === 'sentence' ? 'Sentence editor' : 'Structured blocks'} ready.`}</Paragraph>
    <Dialog aria-label={editing ? `Edit ${editing.kind}` : 'Edit rule'} open={Boolean(editing)} onClose={() => setEditing(null)} title={editing ? `Edit ${editing.kind}` : 'Edit rule'}>
      {editing && <Stack as="form" gap={16} onSubmit={save}>
        {editing.kind === 'trigger' ? <SelectField label="When" value={draft.value} onChange={event => setDraft({ value: event.target.value })}>{triggers.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</SelectField> : editing.kind === 'condition' ? <>
          <SelectField label="Field" value={draft.field} onChange={event => setDraft({ ...draft, field: event.target.value, value: fields[event.target.value][0] })}>{options(Object.keys(fields))}</SelectField>
          <SelectField label="Operator" value={draft.operator} onChange={event => setDraft({ ...draft, operator: event.target.value })}><option value="is">is</option><option value="not">is not</option></SelectField>
          <SelectField label="Value" value={draft.value} onChange={event => setDraft({ ...draft, value: event.target.value })}>{options(fields[draft.field])}</SelectField>
        </> : <>
          <SelectField label="Action" value={draft.type} onChange={event => { const type = actionTypes.find(item => item.value === event.target.value); setDraft({ ...draft, type: type.value, value: type.values?.[0] ?? 'Ready for review.' }) }}>{actionTypes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</SelectField>
          {draft.type === 'comment' ? <TextField label="Comment" required maxLength={160} value={draft.value} onChange={event => setDraft({ ...draft, value: event.target.value })} /> : <SelectField label="Destination or value" value={draft.value} onChange={event => setDraft({ ...draft, value: event.target.value })}>{options(actionTypes.find(item => item.value === draft.type).values)}</SelectField>}
        </>}
        <ButtonContainer align="start"><Button type="submit" disabled={!draft.value.trim()}>Save changes</Button><Button variant="tertiary" onClick={() => setEditing(null)}>Cancel</Button></ButtonContainer>
      </Stack>}
    </Dialog>
  </Stack>
}
