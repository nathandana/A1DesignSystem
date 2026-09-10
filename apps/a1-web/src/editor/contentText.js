/** Resolve the text a label-bound content node displays in A1. */
export function resolveLabelContentText(content, resolveText) {
  if (!content || typeof content !== 'object') return undefined
  const fallback = typeof content.fallback === 'string' ? content.fallback : undefined
  if (typeof content.textKey !== 'string' || !content.textKey.trim()) return fallback
  if (typeof resolveText !== 'function') return fallback ?? content.textKey

  try {
    const resolved = resolveText(content.textKey, fallback)
    return typeof resolved === 'string' ? resolved : (fallback ?? content.textKey)
  } catch {
    return fallback ?? content.textKey
  }
}

/** Remove A1's inline Markdown delimiters for compact, plain-text UI labels. */
export function inlineMarkdownToPlainText(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(/\*\*(\S(?:.*?\S)?)\*\*/g, '$1')
    .replace(/\*(\S(?:.*?\S)?)\*/g, '$1')
    .replace(/~~(\S(?:.*?\S)?)~~/g, '$1')
    .replace(/==(\S(?:.*?\S)?)==/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
}

/** Return the visible text used to name a text node in the Layers tree. */
export function contentLayerLabel(content, resolveText) {
  return inlineMarkdownToPlainText(resolveLabelContentText(content, resolveText))
}

/**
 * Clone a page definition for external handoff and materialize every bound
 * content fallback to the same localized string the A1 canvas displays.
 * `textKey` remains intact so the outbound model keeps its binding metadata.
 */
export function materializeResolvedLabelContent(value, resolveText) {
  if (Array.isArray(value)) {
    return value.map((entry) => materializeResolvedLabelContent(entry, resolveText))
  }
  if (!value || typeof value !== 'object') return value

  const clone = Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      materializeResolvedLabelContent(entry, resolveText),
    ]),
  )

  if (typeof value.textKey === 'string' && value.textKey.trim()) {
    clone.fallback = resolveLabelContentText(value, resolveText)
  }
  return clone
}
