import { useEffect, useRef, useState } from 'react'
import { Button, Figure, Grid, MessageBadge, MessageEmptyState, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import {
  addImage,
  getObjectUrl,
  imageAvailableToProject,
  listImages,
} from '../lib/imageLibrary.ts'
import { useImageLibraryVersion } from './ImageLibraryContext.jsx'

/**
 * Editor aside "Images" panel — thumbnails of the project's library images,
 * draggable onto the canvas as a Figure (encoded as `figure-image:<id>`, which
 * `EditorPage.handleCatalogDrop` turns into a Figure with that library `src`).
 * Upload here, or manage the full library from the editor's Image library page.
 */
export function EditorImagesPanel({ projectId }) {
  const version = useImageLibraryVersion()
  const [images, setImages] = useState([])
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    listImages().then((all) => setImages(all.filter((img) => imageAvailableToProject(img, projectId))))
  }, [version, projectId])

  async function handleFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (!files.length) return
    setBusy(true)
    try { for (const file of files) await addImage(file) } finally { setBusy(false) }
  }

  const uploadInput = (
    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      multiple
      hidden
      onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
    />
  )

  if (images.length === 0) {
    return (
      <>
        {uploadInput}
        <MessageEmptyState
          scale="card"
          icon="add_photo_alternate"
          title="No images yet"
          description="Upload images here, or add them in the Image library (Editor menu). Drag any image onto the page to add it as a Figure."
          action={
            <Button size="sm" icon="upload" loading={busy} onClick={() => fileRef.current?.click()}>
              Upload images
            </Button>
          }
        />
      </>
    )
  }

  return (
    <Stack gap="sm">
      {uploadInput}
      <Stack direction="row" justify="between" align="center" gap="xs">
        <Paragraph size="xs" color="muted">Drag an image onto the page.</Paragraph>
        <Button size="sm" variant="secondary" icon="upload" loading={busy} onClick={() => fileRef.current?.click()}>
          Upload
        </Button>
      </Stack>
      <Grid columns={3} gap="xs">
        {images.map((img) => (
          <div
            key={img.id}
            className="a1-web-img-panel-item"
            draggable
            title={`Drag to add “${img.name}”`}
            onDragStart={(e) => {
              e.dataTransfer.setData('a1-catalog-type', `figure-image:${img.id}`)
              e.dataTransfer.effectAllowed = 'copy'
              e.currentTarget.setAttribute('data-dragging', 'true')
            }}
            onDragEnd={(e) => e.currentTarget.removeAttribute('data-dragging')}
          >
            <Figure
              src={getObjectUrl(img.id) || ''}
              alt={img.name}
              aspectRatio={img.crop?.cropRect ? undefined : '1:1'}
              cropRect={img.crop?.cropRect || undefined}
              radius="sm"
            />
            {img.crop?.cropRect && (
              <span className="a1-web-img-panel-badge">
                <MessageBadge size="sm" status="info" icon="crop">Crop</MessageBadge>
              </span>
            )}
          </div>
        ))}
      </Grid>
    </Stack>
  )
}
