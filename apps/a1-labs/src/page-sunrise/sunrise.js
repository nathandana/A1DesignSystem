// Daylight for the Sunrise page loader: 0 is night, 1 is full day. While the
// page loads the sun climbs most of the way in the expected time and keeps
// slowing if loading takes longer; it only reaches full day when loading ends.
export function daylight(elapsed, expected, limit = 0.8) {
  return limit * (1 - Math.exp((-2 * Math.max(0, elapsed)) / expected))
}
