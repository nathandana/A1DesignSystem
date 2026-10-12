// Drafting order for the Blueprint page loader: one block every `step` ms; a
// block is "drafting" while its outline draws on, then "drafted".
export function draftStates(elapsed, step, draw, count) {
  const started = Math.min(count, Math.floor(Math.max(0, elapsed) / step) + 1)
  return Array.from({ length: count }, (_, index) => {
    if (index >= started) return 'pending'
    return elapsed - index * step < draw ? 'drafting' : 'drafted'
  })
}
