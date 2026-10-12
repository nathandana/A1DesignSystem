// A physical wheel: move forward through every intervening option, wrapping once.
// Preserve authored case. Unsupported graphemes get their own slots at the end.
export const billboardCharacters = Array.from(" abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?'-:/&")
export function characterCycle(from, to) {
  if (from === to) return []
  const wheel = [...new Set([...billboardCharacters, from, to])]
  const start = wheel.indexOf(from), distance = (wheel.indexOf(to) - start + wheel.length) % wheel.length
  return Array.from({ length: distance }, (_, i) => wheel[(start + i + 1) % wheel.length])
}
