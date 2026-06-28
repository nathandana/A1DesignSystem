import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Autocomplete,
  Banner,
  Breadcrumb,
  Button,
  ButtonContainer,
  CheckboxGroup,
  ContextMenu,
  DataTable,
  Dialog,
  Figure,
  Grid,
  Heading,
  Icon,
  IconButton,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  SplitButton,
  Stack,
  Tab,
  TabList,
  Tabs,
  TextField,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
} from '@gtivr4/a1-design-system-react'
import {
  addImage,
  deleteImage,
  deleteImages,
  formatBytes,
  getObjectUrl,
  listImages,
  setImageCrop,
  updateImage,
} from '../lib/imageLibrary.ts'
import { useImageLibraryVersion } from '../editor/ImageLibraryContext.jsx'
import { FigureCropTool } from '../pages/components/detail/FigureCropTool.jsx'
import {
  addCategory,
  categoryNames,
  deleteCategory,
  ensureCategories,
  listCategories,
  renameCategory,
  subscribeCategories,
} from '../lib/categoryStore.ts'

const CATEGORY_COLUMNS = [
  { key: 'name', label: 'Category', sortable: true },
  { key: 'count', label: 'Images', type: 'number', align: 'end', sortable: true },
  { key: 'actions', label: '', type: 'actions' },
]

const STAGED_COLUMNS = [
  { key: 'thumb', label: '', type: 'image', width: '3.5rem' },
  { key: 'name', label: 'File' },
  { key: 'size', label: 'Size', align: 'end' },
  { key: 'actions', label: '', type: 'actions' },
]

const IMAGE_COLUMNS = [
  { key: 'thumb', label: '', type: 'image', width: '3.5rem' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'dims', label: 'Dimensions' },
  { key: 'size', label: 'Size', align: 'end', sortable: true, sortAccessor: (row) => row.sizeRaw },
  { key: 'categories', label: 'Categories' },
  { key: 'actions', label: '', type: 'actions' },
]

function formatDate(ms) {
  if (!ms) return '—'
  return new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * The editor's image library: upload images (kept locally in IndexedDB) and
 * manage them. Figures reference these images via the Figure configurator's
 * "Choose from library" picker. Reached from the editor home and the Editor menu.
 */
export function ImageLibraryView({ projects = [], onBackToProjects, onNavigateHome }) {
  const version = useImageLibraryVersion()
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [editing, setEditing] = useState(null) // { id, name, categories[], projectIds[] }
  const [catVersion, setCatVersion] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(null) // image meta
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(null) // string[] of ids
  const [menu, setMenu] = useState(null) // { img, x, y } — right-click / kebab menu
  const [cropping, setCropping] = useState(null) // { img, draftRect, draftRatio }
  // View toolbar: thumbnail density + whether thumbnails are squared or natural.
  const [density, setDensity] = useState(() => localStorage.getItem('a1-img-density') || 'comfortable')
  const [aspect, setAspect] = useState(() => localStorage.getItem('a1-img-aspect') || 'square')
  const [galleryView, setGalleryView] = useState('images') // 'images' | 'categories'
  const [imageView, setImageView] = useState(() => localStorage.getItem('a1-img-view') || 'grid') // 'grid' | 'table'
  const [newCat, setNewCat] = useState('')
  const [renamingCat, setRenamingCat] = useState(null) // { id, name }
  const [confirmDeleteCat, setConfirmDeleteCat] = useState(null) // category
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkDragging, setBulkDragging] = useState(false)
  const [staged, setStaged] = useState([]) // { key, file }[] queued in the bulk dialog
  const fileRef = useRef(null)
  const bulkFileRef = useRef(null)

  function stageFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (!files.length) return
    setStaged((prev) => [
      ...prev,
      ...files.map((file) => ({
        key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        url: URL.createObjectURL(file), // local preview; revoked on remove/close
      })),
    ])
  }
  function removeStaged(key) {
    setStaged((prev) => {
      const item = prev.find((s) => s.key === key)
      if (item) URL.revokeObjectURL(item.url)
      return prev.filter((s) => s.key !== key)
    })
  }
  function clearStaged() {
    setStaged((prev) => { prev.forEach((s) => URL.revokeObjectURL(s.url)); return [] })
  }
  function closeBulk() { setBulkOpen(false); clearStaged() }
  async function addStaged() {
    if (!staged.length) return
    setBusy(true)
    setError('')
    try {
      for (const s of staged) await addImage(s.file)
      clearStaged()
      setBulkOpen(false)
    } catch (e) {
      console.error('[image library] upload failed', e)
      setError(`Couldn’t store one or more images${e?.message ? `: ${e.message}` : '. They may be too large for this browser.'}`)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => { localStorage.setItem('a1-img-density', density) }, [density])
  useEffect(() => { localStorage.setItem('a1-img-aspect', aspect) }, [aspect])
  useEffect(() => { localStorage.setItem('a1-img-view', imageView) }, [imageView])

  // Rows for the image table view.
  const imageRows = useMemo(() => images.map((img) => ({
    id: img.id,
    thumb: { src: getObjectUrl(img.id) || '', alt: img.name },
    name: img.name,
    dims: img.width ? `${img.width}×${img.height}` : '—',
    size: formatBytes(img.size),
    sizeRaw: img.size,
    categories: (img.categories ?? []).join(', ') || '—',
    actions: [
      { icon: 'edit', label: 'Edit', onClick: () => openEdit(img) },
      { icon: 'delete', label: 'Delete', onClick: () => setConfirmDelete(img) },
    ],
  })), [images, version]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep category suggestions fresh, and seed the store from any categories
  // already used across images (so legacy tags appear as options).
  useEffect(() => subscribeCategories(() => setCatVersion((v) => v + 1)), [])
  useEffect(() => {
    const used = Array.from(new Set(images.flatMap((img) => img.categories ?? [])))
    if (used.length) ensureCategories(used)
  }, [images])
  // Options for the category Autocomplete (store ∪ in-use), recomputed on change.
  const categoryOptions = useMemo(() => {
    const used = images.flatMap((img) => img.categories ?? [])
    return Array.from(new Set([...categoryNames(), ...used])).sort((a, b) => a.localeCompare(b))
  }, [images, catVersion])

  // Rows for the category DataTable: each category + how many images use it + actions.
  const categoryRows = useMemo(() => {
    const counts = {}
    for (const img of images) for (const c of (img.categories ?? [])) counts[c] = (counts[c] || 0) + 1
    return listCategories().map((cat) => ({
      id: cat.id,
      name: cat.name,
      count: counts[cat.name] || 0,
      actions: [
        { icon: 'edit', label: 'Rename', onClick: () => setRenamingCat({ id: cat.id, name: cat.name }) },
        { icon: 'delete', label: 'Delete', onClick: () => setConfirmDeleteCat(cat) },
      ],
    }))
  }, [images, catVersion])

  function addCat() {
    // Comma-separated → add several at once (addCategory dedupes case-insensitively).
    const names = newCat.split(',').map((n) => n.trim()).filter(Boolean)
    if (!names.length) return
    names.forEach((n) => addCategory(n))
    setNewCat('')
  }
  // Rename/delete cascade the change across every image that uses the category.
  async function doRenameCat() {
    if (!renamingCat) return
    const next = renamingCat.name.trim()
    const old = renameCategory(renamingCat.id, next)
    if (old && old !== next) {
      for (const img of images) {
        if ((img.categories ?? []).includes(old)) {
          await updateImage(img.id, { categories: img.categories.map((c) => (c === old ? next : c)) })
        }
      }
    }
    setRenamingCat(null)
  }
  async function doDeleteCat() {
    if (!confirmDeleteCat) return
    const name = deleteCategory(confirmDeleteCat.id)
    if (name) {
      for (const img of images) {
        if ((img.categories ?? []).includes(name)) {
          await updateImage(img.id, { categories: img.categories.filter((c) => c !== name) })
        }
      }
    }
    setConfirmDeleteCat(null)
  }

  // Reload the list whenever the library changes (version bumps on add/delete).
  useEffect(() => { listImages().then(setImages) }, [version])

  function openMenuFor(img, x, y) { setMenu({ img, x, y }) }
  function openCrop(img) {
    setMenu(null)
    setCropping({ img, draftRect: img.crop?.cropRect ?? null, draftRatio: img.crop?.cropRatio ?? '' })
  }
  async function applyCrop() {
    if (!cropping) return
    await setImageCrop(cropping.img.id, { cropRect: cropping.draftRect, cropRatio: cropping.draftRatio })
    setCropping(null)
  }
  async function clearCrop() {
    if (!cropping) return
    await setImageCrop(cropping.img.id, null)
    setCropping(null)
  }

  // Grid columns + thumbnail aspect ratio derived from the toolbar settings.
  const columns = density === 'compact'
    ? { xs: 3, sm: 4, lg: 6 }
    : { xs: 2, sm: 3, lg: 4 }
  const thumbAspect = aspect === 'square' ? '1:1' : undefined

  async function handleFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (!files.length) {
      setError('Those files aren’t images. Upload PNG, JPEG, WebP, GIF, or SVG.')
      return
    }
    setBusy(true)
    setError('')
    try {
      for (const file of files) await addImage(file)
    } catch (e) {
      console.error('[image library] upload failed', e)
      setError(`Couldn’t store one or more images${e?.message ? `: ${e.message}` : '. They may be too large for this browser.'}`)
    } finally {
      setBusy(false)
    }
  }

  function onDrop(event) {
    event.preventDefault()
    setDragging(false)
    if (event.dataTransfer?.files?.length) handleFiles(event.dataTransfer.files)
  }

  function openEdit(img) {
    setMenu(null)
    setEditing({ id: img.id, name: img.name, categories: [...(img.categories ?? [])], projectIds: [...(img.projectIds ?? [])] })
  }
  async function saveEdit() {
    if (!editing) return
    await updateImage(editing.id, { name: editing.name, categories: editing.categories, projectIds: editing.projectIds })
    setEditing(null)
  }

  // The image currently being edited, refreshed from the live list (so the Edit
  // crop button reflects the latest crop, size, and dates).
  const editingImage = editing ? images.find((i) => i.id === editing.id) : null

  async function doDelete() {
    if (!confirmDelete) return
    await deleteImage(confirmDelete.id)
    setConfirmDelete(null)
  }

  return (
    <>
      <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigateHome?.() } },
              { label: 'Projects', href: '/editor', onClick: (e) => { e?.preventDefault?.(); onBackToProjects?.() } },
              { label: 'Image library' },
            ]}
          />
          <Heading as="h1" id="image-library-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Image library
          </Heading>
          <Paragraph size="sm" color="muted">
            Upload images to use in Figures. They’re stored locally in this browser and shared
            across every project.
          </Paragraph>
          <SplitButton
            icon="upload"
            loading={busy}
            onClick={() => fileRef.current?.click()}
            menuLabel="More upload options"
            toggleLabel="More upload options"
            actions={[
              { id: 'bulk', label: 'Bulk upload…', icon: 'drive_folder_upload', onClick: () => setBulkOpen(true) },
            ]}
          >
            Upload images
          </SplitButton>
        </Stack>
      </Section>

      <Section padding="sm" aria-labelledby="image-library-heading" contentWidth="xl">
        <Stack direction="column" gap="md">

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
        />

        {error && <Banner status="error" variant="inline" onDismiss={() => setError('')}>{error}</Banner>}
{/* Change to tabs */}
        <Tabs value={galleryView} onChange={setGalleryView} variant="line" aria-label="Gallery view">
          <TabList>
            <Tab value="images" icon="photo_library">Images</Tab>
            <Tab value="categories" icon="sell">Categories</Tab>
          </TabList>
        </Tabs>

        {galleryView === 'images' && (<>
        {images.length > 0 && (
          <Toolbar label="View" aria-label="Image view options">
            <ToolbarGroup
              aria-label="Layout"
              value={imageView}
              onChange={setImageView}
              showLabels
              options={[
                { value: 'grid', label: 'Grid', icon: 'grid_view' },
                { value: 'table', label: 'Table', icon: 'table_rows' },
              ]}
            />
            {imageView === 'grid' && (
              <>
                <ToolbarDivider />
                <ToolbarGroup
                  aria-label="Thumbnail density"
                  value={density}
                  onChange={setDensity}
                  showLabels
                  options={[
                    { value: 'comfortable', label: 'Comfortable', icon: 'grid_view' },
                    { value: 'compact', label: 'Compact', icon: 'grid_on' },
                  ]}
                />
                <ToolbarDivider />
                <ToolbarGroup
                  aria-label="Thumbnail aspect ratio"
                  value={aspect}
                  onChange={setAspect}
                  showLabels
                  options={[
                    { value: 'square', label: 'Square', icon: 'crop_square' },
                    { value: 'natural', label: 'Natural', icon: 'aspect_ratio' },
                  ]}
                />
              </>
            )}
          </Toolbar>
        )}

        {/* Drop zone doubles as the empty state when there are no images. */}
        <div
          className={`a1-web-img-drop${dragging ? ' a1-web-img-drop--active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {images.length === 0 ? (
            <MessageEmptyState
              icon="add_photo_alternate"
              title="No images yet"
              description="Drag images here, or upload them, to build your library."
              action={<Button icon="upload" loading={busy} onClick={() => fileRef.current?.click()}>Upload images</Button>}
            />
          ) : imageView === 'table' ? (
            <DataTable
              columns={IMAGE_COLUMNS}
              rows={imageRows}
              size="compact"
              selectable
              getRowId={(row) => row.id}
              onDeleteSelected={(rows, ids) => setConfirmBulkDelete(ids)}
            />
          ) : (
            <Grid columns={columns} gap="md">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="a1-web-img-card"
                  onContextMenu={(e) => { e.preventDefault(); openMenuFor(img, e.clientX, e.clientY) }}
                >
                  <div
                    className="a1-web-img-card__thumb"
                    title="Double-click to edit"
                    onDoubleClick={() => openEdit(img)}
                  >
                    <Figure
                      src={getObjectUrl(img.id) || ''}
                      alt={img.name}
                      aspectRatio={img.crop?.cropRect ? undefined : thumbAspect}
                      cropRect={img.crop?.cropRect || undefined}
                      radius="md"
                    />
                    {img.crop?.cropRect && (
                      <span className="a1-web-img-card__badge">
                        <MessageBadge size="sm" status="info" icon="crop">Crop</MessageBadge>
                      </span>
                    )}
                  </div>
                  <Stack direction="row" align="center" justify="between" gap="xs">
                    <Stack direction="column" gap="none">
                      <Paragraph size="sm" className="a1-web-img-card__name">{img.name}</Paragraph>
                      <Paragraph size="xs" color="muted">
                        {img.width ? `${img.width}×${img.height} · ` : ''}{formatBytes(img.size)}
                      </Paragraph>
                    </Stack>
                    <IconButton
                      icon="more_vert"
                      label={`Actions for ${img.name}`}
                      variant="tertiary"
                      onClick={(e) => {
                        const r = e.currentTarget.getBoundingClientRect()
                        openMenuFor(img, r.right, r.bottom)
                      }}
                    />
                  </Stack>
                  {(img.categories?.length > 0 || img.projectIds?.length > 0) && (
                    <Stack direction="row" gap="xs" wrap align="center">
                      {img.projectIds?.length > 0 && (
                        <MessageBadge size="sm" status="neutral" icon="lock">
                          {img.projectIds.length === 1 ? '1 project' : `${img.projectIds.length} projects`}
                        </MessageBadge>
                      )}
                      {(img.categories ?? []).map((cat) => (
                        <MessageBadge key={cat} size="sm" subtle status="info">{cat}</MessageBadge>
                      ))}
                    </Stack>
                  )}
                </div>
              ))}
            </Grid>
          )}
        </div>
        </>)}

        {galleryView === 'categories' && (
          <Stack gap="sm">
            <Stack direction="row" gap="xs" align="end">
              <Stack grow>
                <TextField
                  label="Add a category"
                  size="default"
                  hint="Separate multiple with commas"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCat() } }}
                />
              </Stack>
              <Button size="sm" variant='secondary' icon="add" disabled={!newCat.trim()} onClick={addCat}>Add</Button>
            </Stack>
            {categoryRows.length === 0 ? (
              <MessageEmptyState
                icon="sell"
                scale="card"
                title="No categories yet"
                description="Add a category above, or tag an image to create one."
              />
            ) : (
              <DataTable columns={CATEGORY_COLUMNS} rows={categoryRows} size="compact" getRowId={(row) => row.id} />
            )}
          </Stack>
        )}
      </Stack>

      <ContextMenu
        open={!!menu}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        onClose={() => setMenu(null)}
        aria-label="Image actions"
        items={menu ? [
          { id: 'edit', label: 'Edit', icon: 'edit', onClick: () => openEdit(menu.img) },
          { id: 'crop', label: menu.img.crop?.cropRect ? 'Edit custom crop' : 'Custom crop', icon: 'crop', onClick: () => openCrop(menu.img) },
          { type: 'divider', id: 'd1' },
          { id: 'delete', label: 'Delete', icon: 'delete', variant: 'destructive', onClick: () => { setConfirmDelete(menu.img); setMenu(null) } },
        ] : []}
      />

      <Dialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit image"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button icon="check" onClick={saveEdit}>Save</Button>
          </>
        }
      >
        {editing && (
          <Stack gap="lg">
            <Figure
              src={getObjectUrl(editing.id) || ''}
              alt={editingImage?.name || editing.name}
              aspectRatio={editingImage?.crop?.cropRect ? undefined : '1:1'}
              cropRect={editingImage?.crop?.cropRect || undefined}
              radius="md"
              size="xs"
              align="center"
            />
            <TextField
              label="Name"
              size="compact"
              value={editing.name}
              onChange={(e) => setEditing((s) => ({ ...s, name: e.target.value }))}
            />

            {/* Categories — pick existing or add new (Autocomplete) */}
            <Autocomplete
              multiple
              allowCreate
              label="Categories"
              size="compact"
              hint="Choose existing categories or type to add a new one"
              options={categoryOptions}
              value={editing.categories}
              onChange={(categories) => setEditing((s) => ({ ...s, categories }))}
              onCreate={(name) => addCategory(name)}
            />

            {/* Project restriction */}
            {projects.length > 0 ? (
              <CheckboxGroup
                label="Restrict to projects"
                hint="Leave all unchecked to make this image available to every project."
                size="compact"
                value={editing.projectIds}
                onChange={(projectIds) => setEditing((s) => ({ ...s, projectIds }))}
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
              />
            ) : (
              <Paragraph size="sm" color="muted">No projects yet — this image is available everywhere.</Paragraph>
            )}

            {/* Read-only metadata + crop access */}
            <Stack gap="xs">
              <Paragraph size="xs" color="muted">
                {editingImage?.width ? `${editingImage.width}×${editingImage.height} · ` : ''}
                {formatBytes(editingImage?.size ?? 0)}
              </Paragraph>
              <Paragraph size="xs" color="muted">
                Added {formatDate(editingImage?.createdAt)} · Modified {formatDate(editingImage?.updatedAt)}
              </Paragraph>
              <ButtonContainer>
                <Button
                  size="sm"
                  variant="secondary"
                  icon="crop"
                  onClick={() => { const img = editingImage; setEditing(null); if (img) openCrop(img) }}
                >
                  {editingImage?.crop?.cropRect ? 'Edit crop' : 'Add crop'}
                </Button>
              </ButtonContainer>
            </Stack>
          </Stack>
        )}
      </Dialog>

      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete image?"
        status="warn"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" icon="delete" onClick={doDelete}>Delete</Button>
          </>
        }
      >
        <Paragraph>
          “{confirmDelete?.name}” will be removed from the library. Figures already using it will
          show a missing image.
        </Paragraph>
      </Dialog>

      <Dialog
        open={!!confirmBulkDelete}
        onClose={() => setConfirmBulkDelete(null)}
        title="Delete selected images?"
        status="warn"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmBulkDelete(null)}>Cancel</Button>
            <Button
              variant="destructive"
              icon="delete"
              onClick={async () => { await deleteImages(confirmBulkDelete); setConfirmBulkDelete(null) }}
            >
              Delete {confirmBulkDelete?.length}
            </Button>
          </>
        }
      >
        <Paragraph>
          {confirmBulkDelete?.length === 1 ? 'This image' : `These ${confirmBulkDelete?.length} images`} will be
          removed from the library. Figures already using them will show a missing image.
        </Paragraph>
      </Dialog>

      <Dialog
        open={!!cropping}
        onClose={() => setCropping(null)}
        title="Custom crop"
        footer={
          <ButtonContainer align="end">
            {cropping?.img?.crop?.cropRect && (
              <Button variant="secondary" onClick={clearCrop}>Clear crop</Button>
            )}
            <Button variant="secondary" onClick={() => setCropping(null)}>Cancel</Button>
            <Button onClick={applyCrop}>Apply</Button>
          </ButtonContainer>
        }
      >
        <Stack gap="sm">
          <Paragraph size="sm" color="muted">
            Set a default crop for this image. Figures that use it start from this crop and can
            still override it.
          </Paragraph>
          {cropping && (
            <FigureCropTool
              src={getObjectUrl(cropping.img.id) || ''}
              ratio={cropping.draftRatio}
              onRatioChange={(draftRatio) => setCropping((c) => ({ ...c, draftRatio }))}
              rect={cropping.draftRect}
              onRectChange={(draftRect) => setCropping((c) => ({ ...c, draftRect }))}
            />
          )}
        </Stack>
      </Dialog>

      <Dialog
        open={bulkOpen}
        onClose={closeBulk}
        title={staged.length
          ? `Bulk upload — ${staged.length} image${staged.length === 1 ? '' : 's'} to add`
          : 'Bulk upload images'}
        footer={
          <>
            <Button variant="secondary" onClick={closeBulk}>Cancel</Button>
            <Button icon="upload" loading={busy} disabled={staged.length === 0} onClick={addStaged}>
              Add {staged.length || ''} image{staged.length === 1 ? '' : 's'}
            </Button>
          </>
        }
      >
        <Stack gap="sm">
          <div
            className={`a1-web-bulk-drop${bulkDragging ? ' a1-web-bulk-drop--active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => bulkFileRef.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bulkFileRef.current?.click() } }}
            onDragOver={(e) => { e.preventDefault(); setBulkDragging(true) }}
            onDragLeave={() => setBulkDragging(false)}
            onDrop={(e) => { e.preventDefault(); setBulkDragging(false); if (e.dataTransfer?.files?.length) stageFiles(e.dataTransfer.files) }}
          >
            <Stack gap="xs" align="center">
              <Icon name="cloud_upload" size="xl" color="muted" aria-hidden="true" />
              <Paragraph>Drag images here, or click to browse</Paragraph>
              <Paragraph size="xs" color="muted">They’re added to the library when you click Add.</Paragraph>
            </Stack>
          </div>
          <input
            ref={bulkFileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => { stageFiles(e.target.files); e.target.value = '' }}
          />
          {staged.length > 0 && (
            <DataTable
              columns={STAGED_COLUMNS}
              size="compact"
              getRowId={(row) => row.id}
              rows={staged.map((s) => ({
                id: s.key,
                thumb: { src: s.url, alt: s.file.name },
                name: s.file.name,
                size: formatBytes(s.file.size),
                actions: [{ icon: 'close', label: 'Remove', onClick: () => removeStaged(s.key) }],
              }))}
            />
          )}
        </Stack>
      </Dialog>

      <Dialog
        open={!!renamingCat}
        onClose={() => setRenamingCat(null)}
        title="Rename category"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenamingCat(null)}>Cancel</Button>
            <Button icon="check" onClick={doRenameCat}>Save</Button>
          </>
        }
      >
        <TextField
          label="Category name"
          size="compact"
          hint="Renaming updates this category on every image that uses it."
          value={renamingCat?.name ?? ''}
          onChange={(e) => setRenamingCat((c) => ({ ...c, name: e.target.value }))}
        />
      </Dialog>

      <Dialog
        open={!!confirmDeleteCat}
        onClose={() => setConfirmDeleteCat(null)}
        title="Delete category?"
        status="warn"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDeleteCat(null)}>Cancel</Button>
            <Button variant="destructive" icon="delete" onClick={doDeleteCat}>Delete</Button>
          </>
        }
      >
        <Paragraph>
          “{confirmDeleteCat?.name}” will be removed from the category list and from every image
          tagged with it.
        </Paragraph>
      </Dialog>
      </Section>
    </>
  )
}
