export const triggers = [
  { value: 'created', label: 'a work item is created' },
  { value: 'status-changed', label: 'a status changes' },
  { value: 'scheduled', label: 'the daily schedule runs' },
]
export const fields = {
  priority: ['High', 'Medium', 'Low'], type: ['Bug', 'Task', 'Story'], status: ['Open', 'In progress', 'Done'],
}
export const actionTypes = [
  { value: 'notify', label: 'Notify a channel', values: ['#triage', '#design', '#delivery'] },
  { value: 'assign', label: 'Assign an owner', values: ['Avery', 'Morgan', 'Jordan'] },
  { value: 'status', label: 'Change status', values: fields.status },
  { value: 'comment', label: 'Add a comment' },
]
export const initialRule = {
  name: 'High-priority triage', trigger: 'created', match: 'all',
  conditions: [{ id: 'condition-1', field: 'priority', operator: 'is', value: 'High' }],
  actions: [{ id: 'action-1', type: 'notify', value: '#triage' }],
}
export const exampleRule = {
  name: 'Route urgent bugs', trigger: 'created', match: 'all',
  conditions: [...initialRule.conditions, { id: 'condition-2', field: 'type', operator: 'is', value: 'Bug' }],
  actions: [{ id: 'action-1', type: 'assign', value: 'Avery' }, { id: 'action-2', type: 'status', value: 'In progress' }, { id: 'action-3', type: 'notify', value: '#triage' }],
}
export const conditionText = condition => `${condition.field} ${condition.operator === 'not' ? 'is not' : 'is'} ${condition.value}`
export const actionText = action => ({ notify: `notify ${action.value}`, assign: `assign to ${action.value}`, status: `set status to ${action.value}`, comment: `add comment “${action.value}”` })[action.type]
export const presentationFor = (rule, mode = 'auto') => mode === 'auto' ? (rule.conditions.length > 1 || rule.actions.length > 1 ? 'blocks' : 'sentence') : mode
export function describeRule(rule) {
  const condition = rule.conditions.length ? `if ${rule.conditions.map(conditionText).join(rule.match === 'all' ? ' and ' : ' or ')}` : 'without conditions'
  return `When ${triggers.find(item => item.value === rule.trigger)?.label}, ${condition}, then ${rule.actions.map(actionText).join(', then ')}.`
}
export function validateRule(rule) {
  const errors = []
  if (!rule.name.trim()) errors.push('Give the rule a name.')
  if (!triggers.some(item => item.value === rule.trigger)) errors.push('Choose a valid trigger.')
  if (!['all', 'any'].includes(rule.match)) errors.push('Choose how conditions match.')
  if (!rule.actions.length) errors.push('Add at least one action.')
  for (const item of rule.conditions) if (!fields[item.field]?.includes(item.value) || !['is', 'not'].includes(item.operator)) errors.push('Review the condition values.')
  for (const item of rule.actions) {
    const type = actionTypes.find(type => type.value === item.type)
    if (!type || !item.value.trim() || (type.values && !type.values.includes(item.value))) errors.push('Complete every action.')
  }
  return [...new Set(errors)]
}
export function testRule(rule, sample) {
  const errors = validateRule(rule)
  if (errors.length) return { status: 'invalid', errors, steps: [], actions: [] }
  const triggered = sample.event === rule.trigger
  const checks = rule.conditions.map(item => ({ label: conditionText(item), actual: sample[item.field], passed: item.operator === 'not' ? sample[item.field] !== item.value : sample[item.field] === item.value }))
  const matches = !checks.length || (rule.match === 'all' ? checks.every(item => item.passed) : checks.some(item => item.passed))
  const runs = triggered && matches
  return {
    status: runs ? 'matched' : 'skipped', errors: [],
    steps: [{ label: `Trigger: ${triggers.find(item => item.value === rule.trigger).label}`, result: triggered ? 'Matched' : 'Did not match' },
      ...checks.map(check => ({ label: `If ${check.label} (sample: ${check.actual})`, result: !triggered ? 'Not evaluated' : check.passed ? 'Matched' : 'Did not match' }))],
    actions: rule.actions.map((action, index) => ({ label: `${index + 1}. ${actionText(action)}`, result: runs ? 'Would run' : 'Skipped' })),
  }
}
export function moveAction(actions, id, delta) {
  const from = actions.findIndex(item => item.id === id), to = from + delta
  if (from < 0 || to < 0 || to >= actions.length) return actions
  const next = [...actions]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next
}
