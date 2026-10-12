export function readFlapTokens(host, namespace = 'flip-clock', base = {}) {
  const styles = host.ownerDocument.defaultView.getComputedStyle(host)
  const tokens = { ...base }
  const prefix = `--component-${namespace}-`
  for (const name of styles) {
    if (!name.startsWith(prefix)) continue
    const key = name.slice(prefix.length).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    const value = styles.getPropertyValue(name).trim()
    // CSS minifiers omit leading zeros; Number accepts both 0.13 and .13.
    tokens[key] = value !== '' && Number.isFinite(Number(value)) ? Number(value) : value
  }
  return tokens
}

export function durationMs(value) {
  return parseFloat(value) * (value.endsWith('ms') ? 1 : 1000)
}
