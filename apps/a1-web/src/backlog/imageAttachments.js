import { addImage, toImageRef } from '../lib/imageLibrary'

export function imageFilesFromList(files) {
  return Array.from(files || []).filter((file) => file?.type?.startsWith('image/'))
}

export function imageFilesFromClipboard(clipboardData) {
  const imageFiles = []
  const seen = new Set()

  function addFile(file) {
    if (!file?.type?.startsWith('image/')) return
    const key = `${file.name}:${file.type}:${file.size}:${file.lastModified}`
    if (seen.has(key)) return
    seen.add(key)
    imageFiles.push(file)
  }

  Array.from(clipboardData?.items || []).forEach((item) => {
    if (item.kind === 'file' && item.type?.startsWith('image/')) {
      addFile(item.getAsFile())
    }
  })
  Array.from(clipboardData?.files || []).forEach(addFile)

  return imageFiles
}

export async function attachImageFiles(files) {
  const imageFiles = imageFilesFromList(files)
  if (!imageFiles.length) return []
  const metas = await Promise.all(imageFiles.map((file) => addImage(file, { hiddenFromLibrary: true })))
  return metas.map((meta) => toImageRef(meta.id))
}

export function attachmentStatus(count, source) {
  if (!count) return ''
  const imageLabel = count === 1 ? 'image' : 'images'
  return source === 'paste'
    ? `Attached ${count} pasted ${imageLabel}.`
    : `Attached ${count} ${imageLabel}.`
}
