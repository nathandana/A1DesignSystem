import { useRef, useState } from 'react'
import {
  Button,
  ButtonContainer,
  Code,
  Dialog,
  Figure,
  IconButton,
  MessageBadge,
  Stack,
  TextField,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { ConfigSlider } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'
import { ImageSuggestDialog } from './ImageSuggestDialog.jsx'
import { ImageLibraryDialog } from './ImageLibraryDialog.jsx'
import { ImageGenerateDialog } from './ImageGenerateDialog.jsx'
import { FigureCropTool } from './FigureCropTool.jsx'
import { Lockable } from './configKit.jsx'
import { addImage, isImageRef, resolveSrc, toImageRef } from '../../../lib/imageLibrary.ts'
import { useImageLibraryVersion } from '../../../editor/ImageLibraryContext.jsx'
import { getProjectImageStyle } from '../../../projects/projectStore.ts'

const round3 = (n) => Math.round(n * 1000) / 1000

function optionLabel(value) {
  if (!value) return 'None'
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('-', ' ')
}

// Single-select Figure props rendered as compact Toolbar groups. '' = prop
// omitted (component default).
const RADIUS_ITEMS = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
]
const SIZE_ITEMS = [
  { value: '', label: 'Auto' },
  { value: '3xs', label: '3XS' },
  { value: '2xs', label: '2XS' },
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' },
]
const ALIGN_ITEMS = [
  { value: 'none', label: 'None' },
  { value: 'start', label: 'Start', icon: 'align_horizontal_left' },
  { value: 'center', label: 'Center', icon: 'align_horizontal_center' },
  { value: 'end', label: 'End', icon: 'align_horizontal_right' },
]
const CAPTION_POSITION_ITEMS = [
  { value: 'start', label: 'Start', icon: 'format_align_left' },
  { value: 'center', label: 'Center', icon: 'format_align_center' },
]
// Preset aspect ratios. Freeform cropping is a separate "Custom" button.
const ASPECT_ITEMS = [
  { value: '', label: 'Natural' },
  { value: '16:9', label: '16:9' },
  { value: '4:3', label: '4:3' },
  { value: '3:2', label: '3:2' },
  { value: '1:1', label: '1:1' },
  { value: '2:3', label: '2:3' },
  { value: '3:4', label: '3:4' },
  { value: '9:16', label: '9:16' },
  { value: '21:9', label: '21:9' },
]
// 3×3 positional grid (9 focal points) for the preset crop. Directional icons map
// to each focal point.
const CROP_OPTIONS = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right']
const CROP_ICONS = {
  center: 'center_focus_strong',
  top: 'north',
  'top-right': 'north_east',
  right: 'east',
  'bottom-right': 'south_east',
  bottom: 'south',
  'bottom-left': 'south_west',
  left: 'west',
  'top-left': 'north_west',
}
const CROP_ITEMS = CROP_OPTIONS.map((opt) => ({ value: opt, label: optionLabel(opt), icon: CROP_ICONS[opt] }))

// Default demo image (Unsplash). Users can swap it for any URL via the Image URL
// control. A landscape with clear sky/foreground reads well under aspect-ratio + crop.
const DEMO_SRC = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1280&q=80&auto=format&fit=crop'

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${escapeJsxString(value)}"`
}

function propBoolean(name, value, defaultValue) {
  if (value === defaultValue) return null
  return value ? name : `${name}={false}`
}

function buildFigureSnippet(config) {
  const isCustom = config.customCrop
  const props = [
    `src="${escapeJsxString(config.src || DEMO_SRC)}"`,
    `alt="${escapeJsxString(config.alt || '')}"`,
    config.caption ? `caption="${escapeJsxString(config.caption)}"` : null,
    propString('radius', config.radius, 'none'),
    propString('size', config.size, ''),
    // Align only has an effect once the figure has a constrained width (size set).
    config.size ? propString('align', config.align, 'none') : null,
    // Preset crop: a standard aspect ratio + named focal point.
    isCustom ? null : propString('aspectRatio', config.aspectRatio, ''),
    isCustom || !config.aspectRatio ? null : propString('crop', config.crop, 'center'),
    // Custom crop: a freeform rectangle stored as metadata (fractions of the image).
    isCustom && config.cropRect
      ? `cropRect={{ x: ${round3(config.cropRect.x)}, y: ${round3(config.cropRect.y)}, width: ${round3(config.cropRect.width)}, height: ${round3(config.cropRect.height)} }}`
      : null,
    // Caption position is irrelevant for a screen-reader-only caption.
    config.captionSrOnly ? null : propString('captionPosition', config.captionPosition, 'start'),
    propBoolean('captionSrOnly', config.captionSrOnly, false),
  ].filter(Boolean).join('\n  ')

  return `<Figure\n  ${props}\n/>`
}

export function getDefaultConfig() {
  return {
    src: DEMO_SRC,
    alt: 'A flat-lay of fresh seasonal vegetables',
    caption: 'Figure caption',
    radius: 'none',
    size: '',
    align: 'none',
    captionPosition: 'start',
    captionSrOnly: true,
    aspectRatio: '',
    crop: 'center',
    customCrop: false,
    cropRatio: '',
    cropRect: null,
  }
}

export function Preview({ config }) {
  const isCustom = config.customCrop
  useImageLibraryVersion() // re-render when a library image hydrates
  return (
    <Figure
      src={resolveSrc(config.src || DEMO_SRC)}
      alt={config.alt || ''}
      caption={config.captionSrOnly ? undefined : (config.caption || undefined)}
      radius={config.radius || undefined}
      size={config.size || undefined}
      align={config.size && config.align && config.align !== 'none' ? config.align : undefined}
      aspectRatio={!isCustom && config.aspectRatio ? config.aspectRatio : undefined}
      crop={!isCustom && config.aspectRatio && config.crop !== 'center' ? config.crop : undefined}
      cropRect={isCustom && config.cropRect ? config.cropRect : undefined}
      captionPosition={config.captionPosition}
      captionSrOnly={config.captionSrOnly}
    />
  )
}

export function Controls({ config, setConfig, projectId }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  const [aiOpen, setAiOpen] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [generateOpen, setGenerateOpen] = useState(false)
  const [urlMode, setUrlMode] = useState(false)
  const uploadRef = useRef(null)
  const fromLibrary = isImageRef(config.src)
  const showUrlField = !fromLibrary && (urlMode || (!!config.src && !isImageRef(config.src)))

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const meta = await addImage(file)
    set({ src: toImageRef(meta.id), alt: config.alt || meta.name })
    setUrlMode(false)
  }

  // Custom crop is edited in a dialog with its own draft state so Cancel can
  // discard changes; Apply commits the rectangle and activates custom crop.
  const [cropOpen, setCropOpen] = useState(false)
  const [draftRect, setDraftRect] = useState(null)
  const [draftRatio, setDraftRatio] = useState('')

  const openCrop = () => {
    setDraftRect(config.cropRect)
    setDraftRatio(config.cropRatio || '')
    setCropOpen(true)
  }
  const applyCrop = () => {
    set({ customCrop: true, cropRect: draftRect, cropRatio: draftRatio })
    setCropOpen(false)
  }
  const clearCrop = () => set({ customCrop: false, cropRect: null })

  return (
    <Stack gap="lg">
      {/* Image source toolbar — pick how to set the Figure's image. */}
      <Stack gap="sm">
        <Toolbar label="Image source" aria-label="Image source">
          <ToolbarButton icon="photo_library" label="Add from library" onClick={() => { setUrlMode(false); setLibraryOpen(true) }} />
          <ToolbarButton icon="upload" label="Upload" onClick={() => { setUrlMode(false); uploadRef.current?.click() }} />
          <ToolbarButton icon="image_search" label="Find with AI" onClick={() => { setUrlMode(false); setAiOpen(true) }} />
          <ToolbarButton icon="auto_awesome" label="Generate with AI" onClick={() => { setUrlMode(false); setGenerateOpen(true) }} />
          <ToolbarDivider />
          <ToolbarToggle
            icon="link"
            label="Add from URL"
            pressed={showUrlField}
            onChange={(p) => {
              if (p) { if (fromLibrary) set({ src: '' }); setUrlMode(true) }
              else { setUrlMode(false); if (!isImageRef(config.src)) set({ src: '' }) }
            }}
          />
        </Toolbar>

        {fromLibrary && (
          <Stack direction="row" gap="xs" align="center">
            <MessageBadge size="sm" status="info" icon="photo_library">From library</MessageBadge>
            <IconButton icon="swap_horiz" label="Choose a different library image" size="sm" variant="tertiary" onClick={() => setLibraryOpen(true)} />
            <IconButton icon="close" label="Clear image" size="sm" variant="tertiary" onClick={() => set({ src: '' })} />
          </Stack>
        )}

        {showUrlField && (
          <TextField
            label="Image URL"
            size="compact"
            type="url"
            autoComplete="off"
            value={config.src ?? ''}
            onChange={(event) => set({ src: event.target.value })}
          />
        )}

        <input ref={uploadRef} type="file" accept="image/*" hidden onChange={handleUpload} />
      </Stack>
      <ImageSuggestDialog
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        initialPrompt={config.alt || ''}
        onApply={({ src, alt, caption }) => set({ src, alt: alt || config.alt, ...(caption ? { caption } : {}) })}
      />
      <ImageGenerateDialog
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        initialDescription={config.alt || ''}
        styleContext={getProjectImageStyle(projectId)}
      />
      <ImageLibraryDialog
        open={libraryOpen}
        projectId={projectId}
        onClose={() => setLibraryOpen(false)}
        onApply={({ ref, name, crop }) => set({
          src: ref,
          alt: config.alt || name,
          // Default to the image's stored crop; the crop controls can override it.
          ...(crop?.cropRect
            ? { customCrop: true, cropRect: crop.cropRect, cropRatio: crop.cropRatio || '' }
            : {}),
        })}
      />
      <TextField
        label="Alt text"
        size="compact"
        value={config.alt}
        onChange={(event) => set({ alt: event.target.value })}
      />
      <TextField
        label="Caption"
        size="compact"
        value={config.caption}
        onChange={(event) => set({ caption: event.target.value })}
      />
      <Toggle prop="captionSrOnly"
        label="Caption screen-reader only"
        value={config.captionSrOnly}
        onChange={(captionSrOnly) => set({ captionSrOnly })}
      />
      {config.captionSrOnly ? null : (
        <Lockable prop="captionPosition"><Toolbar label="Caption position">
          <ToolbarGroup
            aria-label="Caption position"
            value={config.captionPosition}
            onChange={(captionPosition) => set({ captionPosition })}
            options={CAPTION_POSITION_ITEMS}
          />
        </Toolbar></Lockable>
      )}
      <ConfigSlider prop="radius"
        label="Radius"
        values={RADIUS_ITEMS.map((item) => item.value)}
        value={config.radius}
        onChange={(radius) => set({ radius })}
      />
      <ConfigSlider prop="size"
        label="Size"
        values={SIZE_ITEMS.map((item) => item.value)}
        value={config.size}
        onChange={(size) => set({ size })}
      />
      {config.size ? (
        <Lockable prop="align"><Toolbar label="Align">
          <ToolbarGroup
            aria-label="Align"
            value={config.align}
            onChange={(align) => set({ align })}
            options={ALIGN_ITEMS}
          />
        </Toolbar></Lockable>
      ) : null}
      <Lockable prop="aspectRatio"><Toolbar label="Aspect ratio">
        <ToolbarGroup
          aria-label="Aspect ratio"
          showLabels
          value={config.aspectRatio}
          onChange={(aspectRatio) => set({ aspectRatio, customCrop: false })}
          options={ASPECT_ITEMS}
        />
      </Toolbar></Lockable>
      {config.aspectRatio && !config.customCrop ? (
        <Lockable prop="crop"><Toolbar label="Crop">
          <ToolbarGroup
            aria-label="Crop focal point"
            columns={3}
            value={config.crop}
            onChange={(crop) => set({ crop })}
            options={CROP_ITEMS}
          />
        </Toolbar></Lockable>
      ) : null}
      <Stack direction="row" gap="xs">
        <Button
          size="sm"
          variant={config.customCrop ? 'primary' : 'secondary'}
          icon="crop"
          onClick={openCrop}
        >
          {config.customCrop ? 'Edit custom crop' : 'Custom crop'}
        </Button>
        {config.customCrop ? (
          <Button size="sm" variant="secondary" onClick={clearCrop}>Clear</Button>
        ) : null}
      </Stack>

      <Dialog
        open={cropOpen}
        onClose={() => setCropOpen(false)}
        title="Crop image"
        footer={
          <ButtonContainer align="end">
            <Button variant="secondary" onClick={() => setCropOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={applyCrop}>Apply</Button>
          </ButtonContainer>
        }
      >
        <FigureCropTool
          src={resolveSrc(config.src || DEMO_SRC)}
          ratio={draftRatio}
          onRatioChange={setDraftRatio}
          rect={draftRect}
          onRectChange={setDraftRect}
        />
      </Dialog>
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildFigureSnippet(config)}</Code>
}
