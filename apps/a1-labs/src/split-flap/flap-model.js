// One physical flap: its old top falls toward the viewer, then its new bottom
// settles below the hinge. Two faces avoid mirrored type on the reverse side.
export function flapPose(progress) {
  const p = Math.max(0, Math.min(1, progress))
  return {
    outgoing: Math.PI / 2 * Math.min(1, p * 2) ** 2,
    incoming: -Math.PI / 2 * (1 - Math.max(0, p * 2 - 1)) ** 2,
    firstHalf: p < 0.5,
    complete: p === 1,
  }
}
