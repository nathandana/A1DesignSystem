// Canvas background choices (A1-2700): the three surface tokens as swatches,
// plus Custom (opens CustomColorDialog). A current custom colour shows as its
// own selected swatch. Shared by the Canvas configurator and the project canvas.

export const CANVAS_BACKGROUND_TOKENS = ['panel', 'page', 'raised']
export const CUSTOM_BACKGROUND = '__custom__'

export function isCustomCanvasBackground(value) {
  return !!value && !CANVAS_BACKGROUND_TOKENS.includes(value)
}

export function canvasBackgroundItems(value, labels = {}) {
  const items = CANVAS_BACKGROUND_TOKENS.map((token) => ({
    value: token,
    label: labels[token] ?? token.charAt(0).toUpperCase() + token.slice(1),
    swatch: `var(--semantic-color-surface-${token})`,
  }))
  const custom = labels.custom ?? 'Custom'
  return isCustomCanvasBackground(value)
    ? [...items, { value, label: `${custom} (${value})`, swatch: value }]
    : [...items, { value: CUSTOM_BACKGROUND, label: custom, icon: 'palette' }]
}
