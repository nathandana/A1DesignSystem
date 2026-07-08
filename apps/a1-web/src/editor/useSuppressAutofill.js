import { useEffect } from 'react'

/**
 * Suppress browser + password-manager autofill for every field inside a container.
 *
 * The editor's Configure/Data panels are internal tooling — not a real user form —
 * so autofill (email, address, name, …) is never wanted and actively clobbers field
 * values (e.g. offering your email into a Stat "Description"). Native `<input>` /
 * `<textarea>` inside the panel get `autocomplete="off"` plus the common
 * password-manager ignore hints. A MutationObserver reapplies to fields that mount
 * later (switching tabs, expanding an option editor), so it covers everything
 * without touching each configurator.
 */
const AUTOFILL_OFF = {
  autocomplete: 'off',
  'data-1p-ignore': 'true', // 1Password
  'data-lpignore': 'true', // LastPass
  'data-bwignore': 'true', // Bitwarden
  'data-form-type': 'other', // Dashlane
}

function suppress(el) {
  if (!(el instanceof HTMLElement)) return
  const fields = []
  if (el.matches?.('input, textarea')) fields.push(el)
  const nested = el.querySelectorAll?.('input, textarea')
  if (nested) fields.push(...nested)
  for (const field of fields) {
    // Never override an explicit intent (e.g. a field the author set autocomplete on).
    if (field.dataset.a1AutofillSuppressed) continue
    field.dataset.a1AutofillSuppressed = 'true'
    for (const [attr, value] of Object.entries(AUTOFILL_OFF)) {
      if (!field.hasAttribute(attr)) field.setAttribute(attr, value)
    }
  }
}

export function useSuppressAutofill(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root) return undefined
    suppress(root)
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) suppress(node)
      }
    })
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [ref])
}
