import { useEffect, useRef, useState } from 'react'
import {
  Banner,
  Button,
  Dialog,
  Figure,
  Grid,
  MessageEmptyState,
  Paragraph,
} from '@gtivr4/a1-design-system-react'
import {
  addImage,
  getObjectUrl,
  imageAvailableToProject,
  listImages,
  toImageRef,
} from '../../../lib/imageLibrary.ts'
import { useImageLibraryVersion } from '../../../editor/ImageLibraryContext.jsx'

/**
 * Figure image picker: choose an image from the local library (or upload a new
 * one inline) and apply it to the Figure as an `a1img://<id>` reference. Mirrors
 * the AI image finder dialog; the full library is managed from the editor's
 * Image library page.
 */
export function ImageLibraryDialog({ open, projectId, onClose, onApply }) {
  const version = useImageLibraryVersion()
  const [images, setImages] = useState([])
  const [selected, setSelected] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  // Only show images available to this project (unrestricted, or restricted to it).
  useEffect(() => {
    if (open) listImages().then((all) => setImages(all.filter((img) => imageAvailableToProject(img, projectId))))
  }, [open, version, projectId])
  useEffect(() => { if (!open) { setSelected(null); setError('') } }, [open])

  async function handleFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (!files.length) return
    setBusy(true)
    setError('')
    try {
      let last = null
      for (const file of files) last = await addImage(file)
      if (last) setSelected(last.id) // select the just-uploaded image
    } catch {
      setError('Couldn’t store the image. It may be too large for this browser.')
    } finally {
      setBusy(false)
    }
  }

  function apply() {
    if (!selected) return
    const img = images.find((i) => i.id === selected)
    onApply?.({ ref: toImageRef(selected), name: img?.name ?? '', crop: img?.crop ?? null })
    onClose?.()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Choose an image"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!selected} icon="check" onClick={apply}>Use image</Button>
        </>
      }
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
      />

      {error && <Banner status="error" variant="inline" onDismiss={() => setError('')}>{error}</Banner>}

      {images.length === 0 ? (
        <MessageEmptyState
          icon="add_photo_alternate"
          title="Your library is empty"
          description="Upload an image to use it in this Figure."
          action={<Button icon="upload" loading={busy} onClick={() => fileRef.current?.click()}>Upload images</Button>}
        />
      ) : (
        <>
          <Button size="sm" variant="secondary" icon="upload" loading={busy} onClick={() => fileRef.current?.click()}>
            Upload new
          </Button>
          <div role="radiogroup" aria-label="Library images">
            <Grid columns={{ xs: 2, sm: 3 }} gap="sm">
              {images.map((img) => (
                <label
                  key={img.id}
                  className={`a1-web-img-pick${selected === img.id ? ' a1-web-img-pick--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="a1-web-lib-image"
                    className="a1-web-img-pick__radio"
                    checked={selected === img.id}
                    onChange={() => setSelected(img.id)}
                  />
                  <Figure
                    src={getObjectUrl(img.id) || ''}
                    alt={img.name}
                    aspectRatio={img.crop?.cropRect ? undefined : '1:1'}
                    cropRect={img.crop?.cropRect || undefined}
                    radius="sm"
                  />
                  <Paragraph size="xs" className="a1-web-img-pick__name">{img.name}</Paragraph>
                </label>
              ))}
            </Grid>
          </div>
        </>
      )}
    </Dialog>
  )
}
