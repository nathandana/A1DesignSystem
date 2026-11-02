// Browser timer delays are signed 32-bit integers; a 30-day lifetime needs
// more than one timer. Recheck the absolute deadline after each bounded wait.
const MAX_TIMEOUT_MS = 2 ** 31 - 1

export function schedulePreviewExpiry(expiresAt, onExpire) {
  const deadline = Date.parse(expiresAt)
  let timer
  function check() {
    const remaining = deadline - Date.now()
    if (!Number.isFinite(remaining) || remaining <= 0) {
      onExpire()
      return
    }
    timer = setTimeout(check, Math.min(remaining, MAX_TIMEOUT_MS))
  }
  check()
  return () => clearTimeout(timer)
}
