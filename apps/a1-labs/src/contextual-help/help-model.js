// Which triggers suit which help pattern, and why the others don't.

export const PATTERNS = [
  { id: 'hint', label: 'Hint', icon: 'short_text', triggers: [], summary: 'Help is always visible under the field. No trigger, nothing to find.' },
  { id: 'tooltip', label: 'Tooltip', icon: 'chat_bubble', triggers: ['icon', 'outside', 'focus'], summary: 'A short label appears on hover or focus and disappears when you move on.' },
  { id: 'popover', label: 'Popover', icon: 'picture_in_picture', triggers: ['icon', 'outside', 'link'], summary: 'A small card opens beside the trigger and stays until dismissed. It can hold a list or a link.' },
  { id: 'inline', label: 'Inline expansion', icon: 'unfold_more', triggers: ['icon', 'outside', 'link', 'focus'], summary: 'Help expands in the page below the field, pushing content down instead of covering it.' },
  { id: 'dialog', label: 'Dialog', icon: 'web_asset', triggers: ['icon', 'outside', 'link'], summary: 'A modal dialog for longer help. It blocks the page until closed.' },
]

export const TRIGGERS = [
  { id: 'icon', label: 'Help button in the field', icon: 'help', summary: 'A question mark button inside the field, at its end.' },
  { id: 'outside', label: 'Help button beside the field', icon: 'help_center', summary: 'A question mark button next to the field, outside it.' },
  { id: 'link', label: 'Text button', icon: 'smart_button', summary: 'A “Find your routing number” button under the field.' },
  { id: 'focus', label: 'Field focus', icon: 'center_focus_strong', summary: 'Help appears while the field is focused.' },
]

const REASONS = {
  hint: 'Hints are always visible, so they need no trigger.',
  tooltip: 'Tooltips open on hover and focus only. A text button that reveals hover text has nothing to show when tapped.',
  focus: 'Opening this on focus would cover the field or move focus while someone is about to type.',
}

/** True when the pattern can use the trigger. */
export const supports = (patternId, triggerId) => PATTERNS.find(item => item.id === patternId).triggers.includes(triggerId)

/** The trigger to use: the requested one if supported, otherwise the pattern's first. Null for hints. */
export function resolveTrigger(patternId, triggerId) {
  const { triggers } = PATTERNS.find(item => item.id === patternId)
  return triggers.includes(triggerId) ? triggerId : triggers[0] ?? null
}

/** Why a trigger can't be used with a pattern, or '' when it can. */
export function unavailableReason(patternId, triggerId) {
  if (supports(patternId, triggerId)) return ''
  if (patternId === 'hint') return REASONS.hint
  if (patternId === 'tooltip') return REASONS.tooltip
  return REASONS.focus
}

/**
 * Where a floating help card should sit: below the anchor if it fits,
 * otherwise above. It lines up with the anchor's start edge, or its end edge
 * when the anchor sits in the right half of the screen, and always stays
 * inside the viewport.
 */
export function placePopover(anchor, size, viewport, gap) {
  const below = anchor.bottom + gap
  const top = below + size.height <= viewport.height - gap || anchor.top - gap - size.height < gap
    ? below
    : anchor.top - gap - size.height
  const endAligned = anchor.left + anchor.width / 2 > viewport.width / 2
  const aligned = endAligned ? anchor.left + anchor.width - size.width : anchor.left
  const left = Math.min(Math.max(gap, aligned), viewport.width - size.width - gap)
  return { top: Math.round(top), left: Math.round(Math.max(gap, left)), side: top === below ? 'below' : 'above' }
}
