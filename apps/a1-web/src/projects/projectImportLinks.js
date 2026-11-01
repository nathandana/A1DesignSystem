/** Remap portable page links when an import allocates fresh workspace IDs.
 * Only declared hrefs/navigation targets change; authored text/source is intact. */
export function remapImportedDefinition(json, pageId, ids) {
  if (!json) return json
  const definition = JSON.parse(json)
  function href(value) {
    if (typeof value !== 'string' || !/^\/?\?/.test(value)) return value
    const hashIndex = value.indexOf('#')
    const hash = hashIndex < 0 ? '' : value.slice(hashIndex)
    const query = new URLSearchParams(value.slice(value.indexOf('?') + 1, hashIndex < 0 ? undefined : hashIndex))
    const mapped = ids.get(query.get('page'))
    if (!mapped) return value
    query.set('page', mapped)
    return `${value.startsWith('/') ? '/' : ''}?${query}${hash}`
  }
  function walk(value) {
    if (!value || typeof value !== 'object') return
    if (typeof value.href === 'string') value.href = href(value.href)
    if (value.type === 'navigate') value.target = href(value.target)
    for (const child of Object.values(value)) walk(child)
  }
  walk(definition)
  definition.page.id = pageId
  return JSON.stringify(definition, null, 2)
}
