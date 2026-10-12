export const initialVerification = { phase: 'locked', progress: 0 }

// Confirmation is possible only on a deliberate release or a separate review
// action. Time passing alone must never submit a critical action.
export function verificationTransition(state, event) {
  const { phase } = state
  if (event.type === 'reset') return initialVerification
  if (event.type === 'disarm' && phase !== 'complete') return initialVerification
  if (event.type === 'arm' && phase === 'locked') return { phase: 'armed', progress: 0 }
  if (event.type === 'start' && phase === 'armed') return { phase: 'holding', progress: 0 }
  if (event.type === 'tick' && phase === 'holding') {
    const progress = Math.max(0, Math.min(1, event.progress))
    return { phase: progress === 1 ? 'ready' : 'holding', progress }
  }
  if (event.type === 'cancel' && ['holding', 'ready'].includes(phase)) return { phase: 'armed', progress: 0 }
  if (event.type === 'review' && phase === 'armed') return { phase: 'review', progress: 0 }
  if ((event.type === 'release' && phase === 'ready') || (event.type === 'confirm' && phase === 'review')) return { phase: 'complete', progress: 1 }
  if (event.type === 'release' && phase === 'holding') return { phase: 'armed', progress: 0 }
  return state
}
