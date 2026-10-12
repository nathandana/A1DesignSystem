export const phaseLabels = {
  loading: 'Preparing preview', generating: 'Generating image',
  completing: 'Generation complete', revealing: 'Revealing image', complete: 'Image ready',
  error: 'The preview image could not load. Try replaying the animation.',
}

// Keep exact progress on the progressbar, but limit unsolicited speech to
// milestones. Pausing announces the precise frozen value; resume restores the
// current milestone. Completion and reveal share a message to avoid queuing
// two announcements only 300ms apart.
export function progressAnnouncement({ phase, percent }, paused) {
  if (paused && ['generating', 'completing', 'revealing'].includes(phase)) {
    return `Animation paused at ${percent}%.`
  }
  if (phase === 'generating') {
    const milestone = Math.floor(percent / 25) * 25
    return milestone ? `Generating image. ${milestone}% complete.` : 'Generating image.'
  }
  if (phase === 'completing' || phase === 'revealing') return 'Generation 100% complete. Revealing image.'
  if (phase === 'complete') return 'Image ready. Preview complete.'
  return phaseLabels[phase]
}
