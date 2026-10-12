import { clockDigitCycle } from './clock-model.js'
import { createSplitFlapScene } from '../split-flap/scene.js'

export function createClockScene(host, { count, housing = true, ...options }) {
  return createSplitFlapScene(host, { ...options, columns: count, separators: true, housing, feet: housing, characterPath: clockDigitCycle, sequenceTiming: 'total' })
}
