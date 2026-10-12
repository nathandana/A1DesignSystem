export function indexTokens(documents) {
  const index = {}
  const visit = (node, path, source) => {
    if (!node || typeof node !== 'object') return
    if ('$value' in node) { index[path.join('.')] = { value: node.$value, type: node.$type, source }; return }
    for (const [key, value] of Object.entries(node)) if (!key.startsWith('$')) visit(value, [...path, key], source)
  }
  for (const [source, document] of Object.entries(documents)) visit(document, [], source)
  return index
}
export const cssToken = path => `--${path.replaceAll('.', '-').replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`
export function traceToken(index, path, parents = []) {
  const token = index[path], id = [...parents, path].join('>')
  if (parents.includes(path)) return { id, path, error: 'Circular reference', children: [] }
  if (!token) return { id, path, error: 'Missing reference', children: [] }
  const refs = [...new Set([...JSON.stringify(token.value).matchAll(/\{([^{}]+)\}/g)].map(match => match[1]))]
  return { ...token, id, path, children: refs.map(ref => traceToken(index, ref, [...parents, path])) }
}
export const flattenTrace = node => [node, ...node.children.flatMap(flattenTrace)]
export const tracePaths = node => node.children.length ? node.children.flatMap(child => tracePaths(child).map(path => [node, ...path])) : [[node]]
