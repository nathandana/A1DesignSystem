import { useRef, useState } from 'react'
import {
  IconButton,
  MessageBadge,
  Stack,
  TextField,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { ImageSuggestDialog } from './ImageSuggestDialog.jsx'
import { ImageLibraryDialog } from './ImageLibraryDialog.jsx'
import { ImageGenerateDialog } from './ImageGenerateDialog.jsx'
import { AI_ENABLED } from '../../../lib/aiImages.ts'
import { addImage, isImageRef, toImageRef } from '../../../lib/imageLibrary.ts'
import { getProjectImageStyle } from '../../../projects/projectStore.ts'

/**
 * Reusable "add an image" control — the Figure image-source pattern, shared so any
 * configurator (Figure, Card hero, …) adds images the same way: pick from the image
 * **library**, **upload**, **find/generate with AI** (gated by `AI_ENABLED`), or paste
 * a **URL**. Emits `value` as an `a1img://<id>` ref (library/upload) or a plain URL.
 * Pass `onAltChange` to also seed alt text from the chosen image's name/AI alt.
 */
export function ImageSourceField({ value, onChange, alt, onAltChange, projectId, label = 'Image source' }) {
  const [aiOpen, setAiOpen] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [generateOpen, setGenerateOpen] = useState(false)
  const [urlMode, setUrlMode] = useState(false)
  const uploadRef = useRef(null)
  const fromLibrary = isImageRef(value)
  const showUrlField = !fromLibrary && (urlMode || (!!value && !isImageRef(value)))

  const setSrc = (src) => onChange?.(src)
  const seedAlt = (name) => { if (onAltChange && !alt && name) onAltChange(name) }

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const meta = await addImage(file)
    setSrc(toImageRef(meta.id))
    seedAlt(meta.name)
    setUrlMode(false)
  }

  return (
    <Stack gap="sm">
      <Toolbar label={label} aria-label={label}>
        <ToolbarButton icon="photo_library" label="Add from library" onClick={() => { setUrlMode(false); setLibraryOpen(true) }} />
        <ToolbarButton icon="upload" label="Upload" onClick={() => { setUrlMode(false); uploadRef.current?.click() }} />
        {AI_ENABLED && (
          <>
            <ToolbarButton icon="image_search" label="Find with AI" onClick={() => { setUrlMode(false); setAiOpen(true) }} />
            <ToolbarButton icon="auto_awesome" label="Generate with AI" onClick={() => { setUrlMode(false); setGenerateOpen(true) }} />
          </>
        )}
        <ToolbarDivider />
        <ToolbarToggle
          icon="link"
          label="Add from URL"
          pressed={showUrlField}
          onChange={(p) => {
            if (p) { if (fromLibrary) setSrc(''); setUrlMode(true) }
            else { setUrlMode(false); if (!isImageRef(value)) setSrc('') }
          }}
        />
      </Toolbar>

      {fromLibrary && (
        <Stack direction="row" gap="xs" align="center">
          <MessageBadge size="sm" status="info" icon="photo_library">From library</MessageBadge>
          <IconButton icon="swap_horiz" label="Choose a different library image" size="sm" variant="tertiary" onClick={() => setLibraryOpen(true)} />
          <IconButton icon="close" label="Clear image" size="sm" variant="tertiary" onClick={() => setSrc('')} />
        </Stack>
      )}

      {showUrlField && (
        <TextField
          label="Image URL"
          size="compact"
          type="url"
          autoComplete="off"
          value={value ?? ''}
          onChange={(event) => setSrc(event.target.value)}
        />
      )}

      <input ref={uploadRef} type="file" accept="image/*" hidden onChange={handleUpload} />

      <ImageSuggestDialog
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        initialPrompt={alt || ''}
        onApply={({ src, alt: a }) => { setSrc(src); if (onAltChange && a) onAltChange(a) }}
      />
      <ImageGenerateDialog
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        initialDescription={alt || ''}
        styleContext={getProjectImageStyle(projectId)}
      />
      <ImageLibraryDialog
        open={libraryOpen}
        projectId={projectId}
        onClose={() => setLibraryOpen(false)}
        onApply={({ ref, name }) => { setSrc(ref); seedAlt(name) }}
      />
    </Stack>
  )
}
