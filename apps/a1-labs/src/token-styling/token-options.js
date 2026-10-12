const choice = (id, label, token) => ({ id, label, token })
export const tokenFamilies = [
  { id: 'surface', label: 'Surface', property: 'background', options: ['page', 'card', 'panel', 'raised'].map(id => choice(id, id[0].toUpperCase() + id.slice(1), `--semantic-color-surface-${id}`)) },
  { id: 'type', label: 'Type scale', property: 'font-size', options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(id => choice(id, id, `--semantic-font-size-heading-${id}`)) },
  { id: 'spacing', label: 'Spacing', property: 'padding', options: [8, 12, 16, 24, 32, 48].map(value => choice(String(value), String(value), `--base-spacing-${value}`)) },
  { id: 'radius', label: 'Corner radius', property: 'border-radius', options: ['sm', 'md', 'lg', 'xl'].map(id => choice(id, id, `--base-radius-${id}`)) },
  { id: 'shadow', label: 'Elevation', property: 'box-shadow', options: ['xs', 'sm', 'md', 'lg', 'xl'].map(id => choice(id, id, `--semantic-shadow-${id}`)) },
]

export function tokenParts(token) {
  const names = token.replace(/^--/, '').split('-')
  return [{ text: '--', role: 'punctuation' }, ...names.flatMap((text, index) => [
    ...(index ? [{ text: '-', role: 'punctuation' }] : []),
    { text, role: index === 0 ? 'level' : index === names.length - 1 ? 'final' : index === 1 ? 'type' : 'group' },
  ])]
}
