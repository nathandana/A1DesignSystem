// Demonstration scaffolding for the button completion experiment: simulated
// work timing and sample copy for both versions. The reusable CompletionButton
// and SendButton only receive the resulting status and labels.

export const PUBLISH_LABELS = {
  idle: 'Publish changes',
  working: 'Publishing…',
  success: 'Published',
  failed: 'Not published',
  retry: 'Try again',
}

export const PUBLISH_ICONS = { idle: 'publish' }

// Visible status text below the button. It is also the polite live region.
export const PUBLISH_STATUS_TEXT = {
  idle: '3 pages are ready to publish.',
  working: 'Publishing 3 pages…',
  success: '3 pages published.',
  failed: 'Couldn’t publish your changes. Try again.',
  retry: 'Couldn’t publish your changes. Try again.',
}

// Idle shows centred with SEND_DESCRIPTION; the rest show in the bottom row.
export const SEND_LABELS = {
  idle: 'Send email',
  working: 'Sending to 1,240 subscribers…',
  success: 'Email sent to 1,240 subscribers.',
  failed: 'Couldn’t send the email.',
  retry: 'Couldn’t send the email. Try again.',
}

// Success and failure are marked in the stage itself, so their rows carry no icon.
export const SEND_ICONS = { idle: 'send', success: null, failed: null, retry: 'refresh' }

export const SEND_DESCRIPTION = 'Ready to send to 1,240 subscribers.'

export const SEND_STATUS_TEXT = {
  idle: 'Ready to send to 1,240 subscribers.',
  working: 'Sending to 1,240 subscribers…',
  success: 'Email sent to 1,240 subscribers.',
  failed: 'Couldn’t send the email. Try again.',
  retry: 'Couldn’t send the email. Try again.',
}

/** The status that follows when the current one's timer elapses, or null. */
export function nextStatus(status, outcome) {
  if (status === 'working') return outcome === 'error' ? 'failed' : 'success'
  if (status === 'failed') return 'retry'
  return null
}

export { parseDuration } from './paper-plane.js'
