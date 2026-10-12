const segments = text => Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), item => item.segment)

export function billboardMessage(text, columns = 12, rows = 2) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map(line => segments(line.trim()))
  const error = !text.trim() ? 'Enter a headline.' : lines.length > rows || lines.some(line => line.length > columns)
    ? `Use up to ${rows} lines, with ${columns} characters per line.` : ''
  if (error) return { error }
  const cards = Array.from({ length: rows }, (_, row) => {
    const line = lines[row] ?? []
    const left = Math.floor((columns - line.length) / 2)
    return [...Array(left).fill(' '), ...line, ...Array(columns - line.length - left).fill(' ')]
  }).flat()
  return { cards, heading: lines.map(line => line.join('')).filter(Boolean).join(' '), error: '' }
}
