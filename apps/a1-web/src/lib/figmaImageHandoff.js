export const FIGMA_BRIDGE_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif'])
export const FIGMA_BRIDGE_MAX_IMAGE_BYTES = 4_000_000
export const FIGMA_BRIDGE_MAX_IMAGE_COUNT = 8

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function figureImageRefs(value, refs = new Set(), seen = new WeakSet()) {
  if (Array.isArray(value)) {
    value.forEach((item) => figureImageRefs(item, refs, seen))
  } else if (isObject(value) && !seen.has(value)) {
    seen.add(value)
    const src = value.type === 'Figure' ? value.props?.src : ''
    if (typeof src === 'string' && src.startsWith('a1img://')) refs.add(src)
    Object.values(value).forEach((item) => figureImageRefs(item, refs, seen))
  }
  return refs
}

export async function buildFigmaFigureAssets(value, { getImage, encodeBlob }) {
  const parsed = typeof value === 'string' ? JSON.parse(value) : value
  const refs = [...figureImageRefs(parsed)]
  if (refs.length > FIGMA_BRIDGE_MAX_IMAGE_COUNT) {
    throw new Error(`Figma page handoffs support up to ${FIGMA_BRIDGE_MAX_IMAGE_COUNT} local Figure images.`)
  }

  const assets = []
  let totalBytes = 0
  for (const ref of refs) {
    const id = ref.slice('a1img://'.length)
    const record = await getImage(id)
    if (!record) throw new Error(`The local Figure image "${id}" is unavailable.`)
    if (!FIGMA_BRIDGE_IMAGE_TYPES.has(record.blob.type)) {
      throw new Error(`"${record.meta.name}" is ${record.blob.type || 'an unsupported format'}; use PNG, JPEG, or GIF for Figma.`)
    }
    totalBytes += record.blob.size
    if (totalBytes > FIGMA_BRIDGE_MAX_IMAGE_BYTES) {
      throw new Error('Local Figure images must total 4 MB or less for this local handoff.')
    }
    assets.push({
      id: record.meta.id,
      name: record.meta.name,
      type: record.blob.type,
      dataBase64: await encodeBlob(record.blob),
    })
  }
  return assets
}
