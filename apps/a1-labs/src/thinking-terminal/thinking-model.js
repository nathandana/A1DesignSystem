import tokens from '../../../../system/tokens/component/thinking-terminal.json' with { type: 'json' }

const timing = tokens.component.thinkingTerminal
export const characterDuration = parseFloat(timing.characterDuration.$value)
export const minimumHold = parseFloat(timing.minimumHold.$value)
const readingCharacterDuration = parseFloat(timing.readingCharacterDuration.$value)
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
export const characters = text => [...segmenter.segment(text)].map(part => part.segment)
export const normalizeLines = lines => [...new Set(lines.map(line => line.trim()).filter(Boolean))]
export const holdDuration = text => Math.max(minimumHold, characters(text).length * readingCharacterDuration)
export const lineDuration = text => characters(text).length * characterDuration + holdDuration(text)

// Uniform selection without an immediate repeat; inject randomness for verification.
export function nextLineIndex(count, current, random = Math.random) {
  if (count <= 1) return 0
  const pick = Math.min(count - 2, Math.floor(Math.max(0, random()) * (count - 1)))
  return pick >= current ? pick + 1 : pick
}
