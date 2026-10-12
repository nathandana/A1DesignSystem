// Which checkboxes changed state, and to what: 'on', 'off' or 'mixed'.

const stateOf = (value, { checked, mixed }) => (checked.includes(value) ? 'on' : mixed.includes(value) ? 'mixed' : 'off')

export function changedStates(before, after, values) {
  const result = {}
  for (const value of values) {
    const next = stateOf(value, after)
    if (stateOf(value, before) !== next) result[value] = next
  }
  return result
}

/** A "select all" parent: all chosen → on, some → mixed, none → off. */
export function parentState(selected, all) {
  if (selected.length === 0) return 'off'
  return all.every(value => selected.includes(value)) ? 'on' : 'mixed'
}
