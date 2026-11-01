import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Button,
  Canvas,
  CanvasFrame,
  Dialog,
  Heading,
  NodeConnector,
  Paragraph,
  Stack,
  StickyNote,
  TextareaField,
  TextField,
  TopHeader,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { RenderPageDefinition } from '../editor/pageRenderer'
import { ProjectThemeScope } from '../lib/ProjectThemeScope.jsx'
import { useT } from '../labels/useT.js'
import { ResponsivePreviewContext } from '../pages/components/detail/responsivePreview.js'
import { VIEWPORT_PRESETS, useFrameDocument } from '../pages/components/detail/ResponsivePreviewFrame.jsx'
import { CustomColorDialog } from '../pages/components/detail/CustomColorDialog.jsx'
import { CUSTOM_BACKGROUND, canvasBackgroundItems, isCustomCanvasBackground } from '../pages/components/detail/canvasBackground.js'
import { buildProjectNav } from './projectNav'
import { combinePageIntoLayout, definitionContainsNodeType } from './projectLayout'
import { getDescendantIds, loadProjectLayout, resolvePageJson } from './projectStore'
import { extractPageLinks, flattenPages } from './pageGraph.js'

// Device presets a frame can take (the responsive preview sizes, minus "Fit").
const DEVICES = VIEWPORT_PRESETS.filter((preset) => preset.width)
const DEFAULT_DEVICE = 'lg'
// Default layout: frames left to right in page order, this far apart (canvas px).
const FRAME_SPACING = 160
// Auto arrange: vertical space between hierarchy rows (canvas px).
const LEVEL_SPACING = 480

/**
 * Sitemap layout for auto arrange: top-level pages form the first row and each
 * page's children the row below it. Parents are centred over their children,
 * rows are top-aligned, and each row starts below the tallest frame above it.
 * `widthOf` / `heightOf` give a page frame's size in canvas px.
 */
export function arrangeHierarchy(pages, widthOf, heightOf) {
  const childrenOf = (parentId) => pages.filter((p) => (p.parentId ?? null) === parentId).sort((a, b) => a.order - b.order)
  const subtreeWidth = new Map()
  const measure = (page) => {
    const kids = childrenOf(page.id)
    const kidsWidth = kids.reduce((sum, kid) => sum + measure(kid), 0) + Math.max(0, kids.length - 1) * FRAME_SPACING
    const width = Math.max(widthOf(page.id), kidsWidth)
    subtreeWidth.set(page.id, width)
    return width
  }
  const levels = []
  const place = (page, left, level) => {
    const width = subtreeWidth.get(page.id)
    const kids = childrenOf(page.id)
    if (!levels[level]) levels[level] = []
    levels[level].push({ id: page.id, x: Math.round(left + (width - widthOf(page.id)) / 2) })
    const kidsWidth = kids.reduce((sum, kid) => sum + subtreeWidth.get(kid.id), 0) + Math.max(0, kids.length - 1) * FRAME_SPACING
    let childLeft = left + (width - kidsWidth) / 2
    for (const kid of kids) {
      place(kid, childLeft, level + 1)
      childLeft += subtreeWidth.get(kid.id) + FRAME_SPACING
    }
  }
  let left = 0
  for (const root of childrenOf(null)) {
    measure(root)
    place(root, left, 0)
    left += subtreeWidth.get(root.id) + FRAME_SPACING
  }
  const positions = {}
  let y = 0
  for (const row of levels) {
    for (const { id, x } of row) positions[id] = { x, y }
    y += Math.max(...row.map(({ id }) => heightOf(id))) + LEVEL_SPACING
  }
  return positions
}
// Wait this long after the last drag movement before saving positions.
const SAVE_DELAY_MS = 400
// Per-viewer preference: the canvas opens full screen unless turned off.
const FULLSCREEN_KEY = 'a1-web-canvas-fullscreen'
// Per-viewer preference: the colour mode pages render in (auto follows the app).
const COLOR_MODE_KEY = 'a1-web-canvas-color-mode'
const COLOR_MODES = ['light', 'dark', 'auto']

// Sticky notes: canvas-space width (StickyNote's md size) and a rough height used
// to centre a new note on the point it's added at.
const NOTE_WIDTH = 256
const NOTE_CENTER_OFFSET_Y = 80
// Zoom used to bring a new note into view, so it's readable while typing.
const NOTE_FOCUS_ZOOM = 1
const NOTE_COLORS = ['yellow', 'orange', 'green', 'blue', 'pink', 'purple', 'grey']
// Canvas ids for notes are prefixed so they never collide with page ids.
const NOTE_PREFIX = 'note:'
// Per-viewer convenience: the last author typed on a note pre-fills the next.
const NOTE_AUTHOR_KEY = 'a1-web-canvas-note-author'

function readNoteAuthor() {
  try { return localStorage.getItem(NOTE_AUTHOR_KEY) ?? '' } catch { return '' }
}

function readColorModePreference() {
  try {
    const stored = localStorage.getItem(COLOR_MODE_KEY)
    return COLOR_MODES.includes(stored) ? stored : 'auto'
  } catch { return 'auto' }
}

function readFullscreenPreference() {
  try { return localStorage.getItem(FULLSCREEN_KEY) !== 'false' } catch { return true }
}

function parseDefinition(json) {
  if (!json) return null
  try { return JSON.parse(json) } catch { return null }
}

/**
 * A page rendered in a src-less iframe at a device width, so the page's own
 * breakpoints apply. The iframe grows to the page's full height (viewport-height
 * sections are pinned to the device height) and is inert: the canvas handles
 * pointer and keyboard interaction, and the frame title names it.
 */
function PagePreviewFrame({ width, viewportHeight, colorMode, onHeight, children }) {
  const [iframeEl, setIframeEl] = useState(null)
  const body = useFrameDocument(iframeEl, { viewportHeight, colorMode })
  const [contentHeight, setContentHeight] = useState(viewportHeight)

  useEffect(() => { onHeight?.(contentHeight) }, [contentHeight, onHeight])

  useEffect(() => {
    if (!body) return undefined
    const win = body.ownerDocument.defaultView
    const measure = () => setContentHeight(Math.max(viewportHeight, Math.ceil(body.getBoundingClientRect().height)))
    measure()
    const ro = new win.ResizeObserver(measure)
    ro.observe(body)
    return () => ro.disconnect()
  }, [body, viewportHeight])

  return (
    <>
      <iframe
        ref={setIframeEl}
        title=""
        aria-hidden="true"
        tabIndex={-1}
        inert
        className="a1-web-page-preview-frame"
        style={{ inlineSize: `${width}px`, blockSize: `${contentHeight}px` }}
      />
      {body && createPortal(
        <ResponsivePreviewContext.Provider value={true}>{children}</ResponsivePreviewContext.Provider>,
        body,
      )}
    </>
  )
}

/** One page composed into the project's shared layout, as the prototype shows it. */
function PageContent({ project, page, pages, layoutDef, colorMode, resolvedColorScheme }) {
  const definition = useMemo(() => parseDefinition(resolvePageJson(page.id)), [page.id])
  const navItems = useMemo(() => buildProjectNav(pages, {
    activePageId: page.id,
    onNavigate: () => {},
    hrefFor: (pageId) => `/?page=${pageId}`,
  }), [pages, page.id])
  const composed = useMemo(() => (
    definition && layoutDef
      ? combinePageIntoLayout(layoutDef, definition, { navItems, logoFallback: project.name ?? '' })
      : definition
  ), [definition, layoutDef, navItems, project.name])
  const fallbackHeader = !layoutDef || !definitionContainsNodeType(layoutDef, 'TopHeader')

  return (
    <ProjectThemeScope theme={project.theme} colorMode={colorMode} resolvedColorScheme={resolvedColorScheme}>
      {fallbackHeader && (
        <TopHeader
          className="a1-web-generated-header"
          logo={project.name ? <span className="a1-web-logo">{project.name}</span> : undefined}
          navItems={navItems}
        />
      )}
      {composed && <RenderPageDefinition definition={composed} />}
    </ProjectThemeScope>
  )
}

/** A sticky note's details: title, author, Markdown content and colour. */
function NoteDialog({ draft, onClose, onSave }) {
  const t = useT()
  const [values, setValues] = useState(draft)
  useEffect(() => { setValues(draft) }, [draft])
  const set = (patch) => setValues((current) => ({ ...current, ...patch }))

  return (
    <Dialog
      open={!!draft}
      onClose={onClose}
      title={t('app.projects.canvasNoteEditTitle', 'Edit sticky note')}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>{t('app.projects.canvasNoteCancel', 'Cancel')}</Button>
          <Button variant="primary" icon="check" onClick={() => onSave(values)}>{t('app.projects.canvasNoteSave', 'Save note')}</Button>
        </>
      )}
    >
      {values && (
        <Stack direction="column" gap="md">
          <TextField
            label={t('app.projects.canvasNoteTitle', 'Title')}
            value={values.title ?? ''}
            onChange={(e) => set({ title: e.target.value })}
            autoComplete="off"
          />
          <TextareaField
            label={t('app.projects.canvasNoteContent', 'Note')}
            hint={t('app.projects.canvasNoteContentHint', 'Supports Markdown: **bold**, *italic*, [links](https://…) and “- ” lists.')}
            rows={5}
            value={values.content ?? ''}
            onChange={(e) => set({ content: e.target.value })}
          />
          <TextField
            label={t('app.projects.canvasNoteAuthor', 'Author')}
            value={values.author ?? ''}
            onChange={(e) => set({ author: e.target.value })}
            autoComplete="name"
          />
          <Toolbar label={t('app.projects.canvasNoteColor', 'Color')}>
            <ToolbarGroup
              aria-label={t('app.projects.canvasNoteColor', 'Color')}
              showLabels
              labelMode="selected"
              value={values.color ?? 'yellow'}
              onChange={(color) => set({ color })}
              options={NOTE_COLORS.map((color) => ({
                value: color,
                label: t(`stickyNote.colors.${color}`, color.charAt(0).toUpperCase() + color.slice(1)),
                swatch: `var(--component-sticky-note-color-${color})`,
              }))}
            />
          </Toolbar>
        </Stack>
      )}
    </Dialog>
  )
}

/**
 * Project canvas (A1-2700): every page rendered as a frame on an infinite canvas.
 * Pan, zoom and fit come from the A1 Canvas; frames drag to arrange (saved per
 * project), each frame takes a device size, links between pages show as
 * connections, and the canvas background can be a surface or a custom colour.
 */
export function ProjectCanvasView({ project, pages, onOpenPage, onSaveCanvas, onDuplicatePage, onDeletePage, colorMode, resolvedColorScheme }) {
  const t = useT()
  const saved = project?.canvas ?? {}
  const flat = useMemo(() => flattenPages(pages), [pages])
  const links = useMemo(() => extractPageLinks(pages), [pages])
  const layoutDef = useMemo(() => parseDefinition(loadProjectLayout(project.id)), [project.id])
  const [selectedId, setSelectedId] = useState(null)
  // Frame to bring into view (a fresh duplicate or note), and the zoom to use.
  const [focus, setFocus] = useState(null)
  const setFocusId = (id, zoom) => setFocus(id ? { id, zoom } : null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null) // page awaiting delete confirmation
  const [positions, setPositions] = useState({}) // unsaved drag positions
  const [customColorOpen, setCustomColorOpen] = useState(false)
  const [notePositions, setNotePositions] = useState({}) // unsaved note drag positions
  const [noteDraft, setNoteDraft] = useState(null) // note open in the details dialog
  const [editingNote, setEditingNote] = useState(null) // { id, title, content } being edited in place
  const rootRef = useRef(null)
  const [height, setHeight] = useState(null)
  const [fullscreen, setFullscreen] = useState(readFullscreenPreference)
  const [canvasColorMode, setCanvasColorMode] = useState(readColorModePreference)
  // Light / dark force that mode in every frame; auto follows the app.
  const forcedColorMode = canvasColorMode === 'auto' ? undefined : canvasColorMode
  const frameColorMode = forcedColorMode ?? colorMode
  const frameColorScheme = forcedColorMode ?? resolvedColorScheme

  function changeColorMode(next) {
    setCanvasColorMode(next)
    try { localStorage.setItem(COLOR_MODE_KEY, next) } catch { /* preference only */ }
  }
  const restoreFocusRef = useRef(false)

  // In page: fill everything from the canvas's top edge to the bottom of the window.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el || fullscreen) return undefined
    const measure = () => setHeight(Math.max(0, Math.floor(window.innerHeight - el.getBoundingClientRect().top)))
    measure()
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    if (el.parentElement) ro.observe(el.parentElement)
    return () => { window.removeEventListener('resize', measure); ro.disconnect() }
  }, [fullscreen])

  // Full screen: the canvas covers the viewport (portaled to <body>) and the rest
  // of the app is inert, so keyboard and assistive tech stay on the canvas.
  // Escape exits unless a menu or dialog is handling it.
  useEffect(() => {
    if (!fullscreen) return undefined
    const appRoot = document.getElementById('root')
    if (appRoot) appRoot.inert = true
    const onKey = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return
      if (document.querySelector('.a1-context-menu, dialog[open]')) return
      // Escape while typing (e.g. in a sticky note) ends editing, not full screen.
      if (e.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return
      changeFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      if (appRoot) appRoot.inert = false
      window.removeEventListener('keydown', onKey)
    }
  }, [fullscreen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Switching modes remounts the canvas; return focus to the full-screen toggle
  // (the only pressed-state control action).
  useEffect(() => {
    if (!restoreFocusRef.current) return
    restoreFocusRef.current = false
    const root = rootRef.current
    const target = root?.querySelector('.a1-canvas__ctrl[aria-pressed]') ?? root?.querySelector('.a1-canvas__controls-toggle')
    target?.focus()
  }, [fullscreen])

  function changeFullscreen(next) {
    restoreFocusRef.current = true
    setFullscreen(next)
    try { localStorage.setItem(FULLSCREEN_KEY, String(next)) } catch { /* preference only */ }
  }
  const saveTimer = useRef(null)
  const pendingFrames = useRef({})
  const frameHeights = useRef({}) // page id → rendered page height (canvas px)

  useEffect(() => () => clearTimeout(saveTimer.current), [])

  const deviceOf = (pageId) => DEVICES.find((d) => d.value === (saved.frames?.[pageId]?.device ?? DEFAULT_DEVICE)) ?? DEVICES[0]

  // Saved position, else the default left-to-right row.
  const frames = useMemo(() => {
    let nextX = 0
    return flat.map(({ page }) => {
      const device = deviceOf(page.id)
      const stored = positions[page.id] ?? saved.frames?.[page.id]
      const frame = { page, device, x: stored?.x ?? nextX, y: stored?.y ?? 0 }
      nextX = Math.max(nextX, frame.x) + device.width + FRAME_SPACING
      return frame
    })
  }, [flat, positions, saved.frames]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sticky notes (A1-2718): saved list with any unsaved drag positions and the
  // in-place edit applied.
  const notes = useMemo(
    () => (saved.notes ?? []).map((note) => ({
      ...note,
      ...notePositions[note.id],
      ...(editingNote?.id === note.id ? { title: editingNote.title, content: editingNote.content } : {}),
    })),
    [saved.notes, notePositions, editingNote],
  )
  const showNotes = saved.showNotes ?? true
  const noteTimer = useRef(null)
  useEffect(() => () => clearTimeout(noteTimer.current), [])
  const noteIdOf = (canvasId) => (canvasId?.startsWith(NOTE_PREFIX) ? canvasId.slice(NOTE_PREFIX.length) : null)

  function moveNote(noteId, x, y) {
    const position = { x: Math.round(x), y: Math.round(y) }
    const next = { ...notePositions, [noteId]: position }
    setNotePositions(next)
    clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(() => {
      onSaveCanvas?.({ notes: (saved.notes ?? []).map((note) => ({ ...note, ...next[note.id] })) })
    }, SAVE_DELAY_MS)
  }

  // A new note goes straight onto the canvas at `point`, the canvas zooms to it
  // and it opens for editing in place.
  function addNote(point) {
    const note = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      x: Math.round(point.x - NOTE_WIDTH / 2),
      y: Math.round(point.y - NOTE_CENTER_OFFSET_Y),
      title: '',
      author: readNoteAuthor(),
      content: '',
      color: 'yellow',
    }
    onSaveCanvas?.({ notes: [...notes, note], ...(showNotes ? {} : { showNotes: true }) })
    setFocusId(`${NOTE_PREFIX}${note.id}`, NOTE_FOCUS_ZOOM)
    setEditingNote({ id: note.id, title: '', content: '' })
  }

  function startEditingNote(noteId) {
    const note = notes.find((n) => n.id === noteId)
    if (note) setEditingNote({ id: note.id, title: note.title ?? '', content: note.content ?? '' })
  }

  // Leaving the note saves the in-place edit.
  function finishEditingNote() {
    if (!editingNote) return
    onSaveCanvas?.({ notes: notes.map((n) => (n.id === editingNote.id ? { ...n, title: editingNote.title, content: editingNote.content } : n)) })
    setEditingNote(null)
  }

  // Details dialog: title, author, content and colour.
  function saveNote(values) {
    onSaveCanvas?.({ notes: notes.map((n) => (n.id === values.id ? values : n)) })
    try { localStorage.setItem(NOTE_AUTHOR_KEY, values.author ?? '') } catch { /* preference only */ }
    setNoteDraft(null)
  }

  function deleteNote(noteId) {
    onSaveCanvas?.({ notes: notes.filter((n) => n.id !== noteId) })
  }

  function setNoteColor(noteId, color) {
    onSaveCanvas?.({ notes: notes.map((n) => (n.id === noteId ? { ...n, color } : n)) })
  }

  function openNoteDetails(noteId) {
    const note = notes.find((n) => n.id === noteId)
    if (note) setNoteDraft(note)
  }

  function moveFrame(pageId, x, y) {
    const noteId = noteIdOf(pageId)
    if (noteId) return moveNote(noteId, x, y)
    const position = { x: Math.round(x), y: Math.round(y) }
    setPositions((prev) => ({ ...prev, [pageId]: position }))
    pendingFrames.current[pageId] = { ...saved.frames?.[pageId], ...position }
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      onSaveCanvas?.({ frames: pendingFrames.current })
      pendingFrames.current = {}
    }, SAVE_DELAY_MS)
  }

  // Change one frame's breakpoint, or every frame's when no page id is given.
  // Frames still in the default row reflow to the new widths.
  function setDevice(pageId, device) {
    const targets = pageId ? frames.filter((f) => f.page.id === pageId) : frames
    onSaveCanvas?.({
      frames: Object.fromEntries(targets.map((f) => [f.page.id, { ...saved.frames?.[f.page.id], device }])),
    })
  }

  // Launch one page in the standalone prototype, in a new window.
  function openPageInWindow(pageId) {
    const url = `/editor-preview?standalone&screen=${encodeURIComponent(pageId)}&project=${encodeURIComponent(project.id)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Auto arrange: lay frames out as a sitemap of the page hierarchy, keeping each
  // frame's breakpoint, and save it like a drag.
  function autoArrange() {
    const deviceById = Object.fromEntries(frames.map((f) => [f.page.id, f.device]))
    const arranged = arrangeHierarchy(
      pages,
      (id) => deviceById[id]?.width ?? DEVICES[0].width,
      (id) => (viewportHeight ? deviceById[id]?.height : frameHeights.current[id] ?? deviceById[id]?.height) ?? 0,
    )
    setPositions(arranged)
    onSaveCanvas?.({
      frames: Object.fromEntries(Object.entries(arranged).map(([id, pos]) => [id, { ...pos, device: deviceById[id]?.value }])),
    })
  }

  // Duplicate a page and place the copy at the end of the row at the same
  // breakpoint. Existing frames are pinned where they are so nothing shifts.
  function duplicateFrame(pageId) {
    const source = frames.find((f) => f.page.id === pageId)
    const copy = source && onDuplicatePage?.(pageId)
    if (!copy) return
    const right = Math.max(...frames.map((f) => f.x + f.device.width))
    onSaveCanvas?.({
      frames: {
        ...Object.fromEntries(frames.map((f) => [f.page.id, { x: f.x, y: f.y, device: f.device.value }])),
        [copy.id]: { x: right + FRAME_SPACING, y: source.y, device: source.device.value },
      },
    })
    setFocusId(copy.id)
  }

  const deletePage = confirmDeleteId ? pages.find((p) => p.id === confirmDeleteId) : null
  const deleteSubpageCount = confirmDeleteId ? getDescendantIds(pages, confirmDeleteId).length : 0
  const showConnections = saved.showConnections ?? true
  const showGrid = saved.showGrid ?? true
  // Viewport height: each frame is its breakpoint's standard viewport height and
  // the page scrolls inside it; off, frames show the full page.
  const viewportHeight = saved.viewportHeight ?? false
  const background = saved.background ?? 'panel'
  const selected = frames.find((f) => f.page.id === selectedId)
  // The breakpoint shown in the controls: the selected frame's, else the one all
  // frames share (none when they differ).
  const sharedDevice = frames.every((f) => f.device.value === frames[0]?.device.value) ? frames[0]?.device.value : ''
  const breakpointLabel = t('app.projects.canvasBreakpoint', 'Breakpoint')
  const breakpointOptions = DEVICES.map((d) => ({ value: d.value, label: d.label, icon: d.icon }))
  const backgroundItems = canvasBackgroundItems(background, {
    panel: t('app.projects.canvasBackgroundPanel', 'Panel'),
    page: t('app.projects.canvasBackgroundPage', 'Page'),
    raised: t('app.projects.canvasBackgroundRaised', 'Raised'),
    custom: t('app.projects.canvasBackgroundCustom', 'Custom'),
  })

  // Everything beyond zoom lives in the Canvas's expandable controls (bottom
  // end): breakpoint (selected frame, else all frames), background, connections
  // and, with a frame selected, Edit page.
  const controls = (
    <Toolbar overflow aria-label={t('app.projects.canvasToolbar', 'Canvas')}>
      <ToolbarGroup
        aria-label={selected ? `${breakpointLabel}: ${selected.page.title || 'Untitled'}` : t('app.projects.canvasBreakpointAll', 'Breakpoint for all pages')}
        value={selected ? selected.device.value : sharedDevice}
        onChange={(device) => setDevice(selected?.page.id, device)}
        options={breakpointOptions}
      />
      <ToolbarDivider />
      <ToolbarGroup
        aria-label={t('app.projects.canvasColorMode', 'Color mode')}
        value={canvasColorMode}
        onChange={changeColorMode}
        options={[
          { value: 'light', label: t('app.projects.canvasColorModeLight', 'Light'), icon: 'light_mode' },
          { value: 'dark', label: t('app.projects.canvasColorModeDark', 'Dark'), icon: 'dark_mode' },
          { value: 'auto', label: t('app.projects.canvasColorModeAuto', 'Auto'), icon: 'brightness_auto' },
        ]}
      />
      <ToolbarDivider />
      <ToolbarGroup
        aria-label={t('app.projects.canvasBackground', 'Canvas background')}
        value={background}
        onChange={(value) => {
          if (value === CUSTOM_BACKGROUND) setCustomColorOpen(true)
          else onSaveCanvas?.({ background: value })
        }}
        options={backgroundItems}
      />
      <ToolbarDivider />
      <ToolbarToggle
        icon="grid_4x4"
        label={t('app.projects.canvasGrid', 'Grid')}
        pressed={showGrid}
        onChange={(pressed) => onSaveCanvas?.({ showGrid: pressed })}
      />
      <ToolbarToggle
        icon="height"
        label={t('app.projects.canvasViewportHeight', 'Viewport height')}
        pressed={viewportHeight}
        onChange={(pressed) => onSaveCanvas?.({ viewportHeight: pressed })}
      />
      <ToolbarToggle
        icon="conversion_path"
        label={t('app.projects.canvasConnections', 'Connections')}
        pressed={showConnections}
        onChange={(pressed) => onSaveCanvas?.({ showConnections: pressed })}
      />
      <ToolbarToggle
        icon="sticky_note_2"
        label={t('app.projects.canvasNotes', 'Notes')}
        pressed={showNotes}
        onChange={(pressed) => onSaveCanvas?.({ showNotes: pressed })}
      />
      {selected && (
        <ToolbarButton
          icon="edit"
          label={t('app.projects.canvasEditPage', 'Edit page')}
          onClick={() => onOpenPage?.(selected.page.id)}
        />
      )}
    </Toolbar>
  )

  const view = (
    <div
      ref={rootRef}
      className={`a1-web-project-canvas${fullscreen ? ' a1-web-project-canvas--fullscreen' : ''}`}
      style={!fullscreen && height != null ? { blockSize: `${height}px` } : undefined}
    >
        <Canvas
          aria-label={t('app.projects.canvasLabel', 'Project canvas')}
          background={background}
          showGrid={showGrid}
          gridType="dots"
          edgeStyle="curved"
          draggableNodes
          highlightConnections
          defaultZoom={0.2}
          defaultPan={{ x: 40, y: 40 }}
          controlsExpandable
          controlsContent={controls}
          controlsActions={[
            { id: 'add-note', icon: 'note_add', label: t('app.projects.canvasAddNote', 'Add sticky note'), onClick: ({ center }) => addNote(center) },
            { id: 'auto-arrange', icon: 'account_tree', label: t('app.projects.canvasAutoArrange', 'Auto arrange'), onClick: autoArrange },
            {
              id: 'full-screen',
              icon: fullscreen ? 'fullscreen_exit' : 'fullscreen',
              label: t('app.projects.canvasFullScreen', 'Full screen'),
              pressed: fullscreen,
              onClick: () => changeFullscreen(!fullscreen),
            },
          ]}
          onNodeMove={moveFrame}
          onSelectionChange={setSelectedId}
          onNodeDoubleClick={(id) => {
            const noteId = noteIdOf(id)
            if (noteId) startEditingNote(noteId)
            else onOpenPage?.(id)
          }}
          focusNodeId={focus?.id}
          focusZoom={focus?.zoom}
          canvasMenuItems={(point) => [
            { id: 'add-note', label: t('app.projects.canvasAddNoteHere', 'Add sticky note here'), icon: 'note_add', onClick: () => addNote(point) },
          ]}
          nodeMenuItems={(pageId) => {
            const noteId = noteIdOf(pageId)
            if (noteId) {
              const note = notes.find((n) => n.id === noteId)
              return [
                { id: 'edit-note', label: t('app.projects.canvasEditNote', 'Edit note'), icon: 'edit', onClick: () => startEditingNote(noteId) },
                { id: 'note-details', label: t('app.projects.canvasNoteDetails', 'Note details…'), icon: 'edit_note', onClick: () => openNoteDetails(noteId) },
                { type: 'group', id: 'note-color', label: t('app.projects.canvasNoteColor', 'Color') },
                ...NOTE_COLORS.map((color) => ({
                  id: `note-color-${color}`,
                  label: t(`stickyNote.colors.${color}`, color.charAt(0).toUpperCase() + color.slice(1)),
                  active: (note?.color ?? 'yellow') === color,
                  onClick: () => setNoteColor(noteId, color),
                })),
                { type: 'divider', id: 'divider-note' },
                { id: 'delete-note', label: t('app.projects.canvasDeleteNote', 'Delete note'), icon: 'delete', variant: 'destructive', onClick: () => deleteNote(noteId) },
              ]
            }
            const current = frames.find((f) => f.page.id === pageId)?.device.value
            return [
              { id: 'edit', label: t('app.projects.canvasEditPage', 'Edit page'), icon: 'edit', onClick: () => onOpenPage?.(pageId) },
              { id: 'open-window', label: t('app.projects.canvasOpenInWindow', 'Open in new window'), icon: 'open_in_new', onClick: () => openPageInWindow(pageId) },
              { type: 'group', id: 'breakpoint', label: breakpointLabel },
              ...DEVICES.map((d) => ({
                id: `breakpoint-${d.value}`,
                label: d.label,
                icon: d.icon,
                active: d.value === current,
                onClick: () => setDevice(pageId, d.value),
              })),
              ...(onDuplicatePage || onDeletePage ? [{ type: 'divider', id: 'divider-page' }] : []),
              ...(onDuplicatePage ? [
                { id: 'duplicate', label: t('app.projects.canvasDuplicatePage', 'Duplicate page'), icon: 'content_copy', onClick: () => duplicateFrame(pageId) },
              ] : []),
              ...(onDeletePage ? [
                { id: 'delete', label: t('app.projects.canvasDeletePage', 'Delete page…'), icon: 'delete', variant: 'destructive', onClick: () => setConfirmDeleteId(pageId) },
              ] : []),
            ]
          }}
        >
          {frames.map(({ page, device, x, y }) => (
            <CanvasFrame
              key={page.id}
              id={page.id}
              x={x}
              y={y}
              width={device.width}
              height={viewportHeight ? device.height : undefined}
              scrollable={viewportHeight}
              label={`${page.title || 'Untitled'} · ${device.label}`}
            >
              <PagePreviewFrame width={device.width} viewportHeight={device.height} colorMode={forcedColorMode} onHeight={(h) => { frameHeights.current[page.id] = h }}>
                <PageContent
                  project={project}
                  page={page}
                  pages={pages}
                  layoutDef={layoutDef}
                  colorMode={frameColorMode}
                  resolvedColorScheme={frameColorScheme}
                />
              </PagePreviewFrame>
            </CanvasFrame>
          ))}
          {showNotes && notes.map((note) => (
            <CanvasFrame
              key={`${NOTE_PREFIX}${note.id}`}
              id={`${NOTE_PREFIX}${note.id}`}
              variant="plain"
              x={note.x}
              y={note.y}
              width={NOTE_WIDTH}
              label={note.title || t('stickyNote.note', 'Sticky note')}
            >
              <StickyNote
                title={note.title || undefined}
                author={note.author || undefined}
                color={note.color}
                width="auto"
                titleAs="p"
                editing={editingNote?.id === note.id}
                onTitleChange={(title) => setEditingNote((current) => ({ ...current, title }))}
                onContentChange={(content) => setEditingNote((current) => ({ ...current, content }))}
                onEditingChange={(next) => { if (!next) finishEditingNote() }}
              >
                {note.content ?? ''}
              </StickyNote>
            </CanvasFrame>
          ))}
          {showConnections && [...links].flatMap(([from, targets]) => [...targets].map((to) => (
            <NodeConnector key={`${from}-${to}`} id={`${from}-${to}`} from={from} to={to} direction="to" />
          )))}
        </Canvas>
      <Dialog
        open={!!deletePage}
        onClose={() => setConfirmDeleteId(null)}
        status="warn"
        title={t('app.projects.canvasDeleteTitle', 'Delete page?')}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setConfirmDeleteId(null)}>{t('app.projects.canvasDeleteCancel', 'Cancel')}</Button>
            <Button
              variant="destructive"
              icon="delete"
              onClick={() => { onDeletePage?.(confirmDeleteId); setConfirmDeleteId(null) }}
            >
              {t('app.projects.canvasDeleteConfirm', 'Delete')}
            </Button>
          </>
        )}
      >
        {deletePage && (
          <Stack direction="column" gap="xs">
            <Heading as="h3" size="xs">{deletePage.title || 'Untitled'}</Heading>
            <Paragraph>
              {deleteSubpageCount > 0
                ? t('app.projects.canvasDeleteBodySubpages', 'This page and its subpages will be permanently deleted.')
                : t('app.projects.canvasDeleteBody', 'This page will be permanently deleted.')}
            </Paragraph>
          </Stack>
        )}
      </Dialog>
      <NoteDialog draft={noteDraft} onClose={() => setNoteDraft(null)} onSave={saveNote} />
      <CustomColorDialog
        open={customColorOpen}
        value={isCustomCanvasBackground(background) ? background : ''}
        onClose={() => setCustomColorOpen(false)}
        onApply={(value) => onSaveCanvas?.({ background: value })}
      />
    </div>
  )

  return fullscreen ? createPortal(view, document.body) : view
}
