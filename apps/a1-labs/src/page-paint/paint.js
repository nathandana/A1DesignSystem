// Roller motion for the Fresh paint page loader. The roller sweeps down, up,
// down… one pass per `coat` ms. Each of the first passes reveals the page at a
// higher fidelity (layer 0: layout blocks, 1: text lines and the button,
// 2: the real page, still soft and grey); later passes just polish until
// loading finishes. Positions are fractions of the page height.
const ease = t => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

export const FIDELITY_LAYERS = 3

export function rollerState(elapsed, coat) {
  const time = Math.max(0, elapsed)
  const pass = Math.floor(time / coat)
  const f = ease((time % coat) / coat)
  return {
    pass,
    y: pass % 2 === 0 ? f : 1 - f,
    direction: pass % 2 === 0 ? 'down' : 'up',
  }
}

/**
 * How much of fidelity layer `layer` the roller has revealed: hidden until
 * its pass, then the strip behind the roller (above it going down, below it
 * going up), then all of it.
 * @returns {{ state: 'hidden'|'partial'|'full', top: number, bottom: number }}
 *   top/bottom: fractions of the page height that remain unrevealed above and below.
 */
export function layerReveal(pass, y, layer) {
  if (pass < layer) return { state: 'hidden', top: 0, bottom: 1 }
  if (pass > layer) return { state: 'full', top: 0, bottom: 0 }
  return layer % 2 === 0
    ? { state: 'partial', top: 0, bottom: 1 - y }
    : { state: 'partial', top: y, bottom: 0 }
}
