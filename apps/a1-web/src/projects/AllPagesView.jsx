import { useMemo, useState } from 'react'
import {
  ActionTile,
  ActionTiles,
  Button,
  Canvas,
  Code,
  Dialog,
  MessageBadge,
  MessageEmptyState,
  Node,
  NodeConnector,
  Paragraph,
  Section,
  Stack,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
} from '@gtivr4/a1-design-system-react'
import { PageTitleArea } from '../pages/PageTitleArea.jsx'
import { ProjectDialog } from './ProjectDialog.jsx'
import { componentRegistry } from '../editor/componentRegistry'
import { getPublishedProjectPath, exportProjectJson, validateProjectImport } from './projectStore'
import { extractPageLinks, flattenPages } from './pageGraph.js'
import { ProjectCanvasView } from './ProjectCanvasView.jsx'
import { useT } from '../labels/useT.js'

const LEVEL_X    = { 1: 120, 2: 380, 3: 640 }
const LEVEL_COLOR = { 1: 'accent', 2: 'success', 3: 'warn' }
const Y_START = 60
const Y_STEP  = 90

function ProjectNodeGraph({ pages, onOpenPage }) {
  const { initialNodes, edges } = useMemo(() => {
    const flat = flattenPages(pages)
    const pageLinks = extractPageLinks(pages)

    const ns = flat.map(({ page, level }, i) => ({
      id: page.id,
      x: LEVEL_X[Math.min(level, 3)] ?? LEVEL_X[3],
      y: Y_START + i * Y_STEP,
      label: page.title || 'Untitled',
      sublabel: page.description || undefined,
      title: page.title,
      shape: 'rectangle',
      size: 'md',
      color: LEVEL_COLOR[Math.min(level, 3)] ?? 'neutral',
    }))

    const es = []

    // Hierarchy edges — dashed, no arrows (just structure)
    for (const { page } of flat) {
      if (page.parentId && pages.some((p) => p.id === page.parentId)) {
        es.push({ id: `hier-${page.parentId}-${page.id}`, from: page.parentId, to: page.id, variant: 'dashed', direction: 'none' })
      }
    }

    // Link edges — solid arrows (navigation the author built)
    for (const [fromId, targets] of pageLinks) {
      for (const toId of targets) {
        const id = `link-${fromId}-${toId}`
        if (!es.some((e) => e.id === id)) {
          es.push({ id, from: fromId, to: toId, direction: 'to', variant: 'solid' })
        }
      }
    }

    return { initialNodes: ns, edges: es }
  }, [pages])

  const [positions, setPositions] = useState(() =>
    Object.fromEntries(initialNodes.map((n) => [n.id, { x: n.x, y: n.y }]))
  )

  const nodes = initialNodes.map((n) => ({ ...n, ...(positions[n.id] ?? {}) }))

  return (
    <div style={{ height: Math.max(480, initialNodes.length * Y_STEP + 120) }}>
      <Canvas
        showGrid
        showControls
        traceConnections
        draggableNodes
        onNodeMove={(id, x, y) => setPositions((prev) => ({ ...prev, [id]: { x, y } }))}
        defaultPan={{ x: 40, y: 20 }}
        aria-label="Project page graph"
        nodeMenuItems={(nodeId) => [
          { id: 'open', label: 'Open page', icon: 'open_in_new', onClick: () => onOpenPage?.(nodeId) },
        ]}
      >
        {nodes.map((n) => (
          <Node key={n.id} id={n.id} x={n.x} y={n.y}
            label={n.label} sublabel={n.sublabel} title={n.title}
            shape={n.shape} size={n.size} color={n.color}
          />
        ))}
        {edges.map((e) => (
          <NodeConnector key={e.id} id={e.id} from={e.from} to={e.to}
            direction={e.direction} variant={e.variant}
          />
        ))}
      </Canvas>
    </div>
  )
}

/**
 * The project's home view (shown when no page is open): every page in the
 * project as a card you can open in the page editor, plus project-level actions
 * (edit / delete / launch prototype). Satisfies "a method to see all pages and
 * open them".
 */
export function AllPagesView({
  project,
  pages = [],
  onOpenPage,
  onAddPage,
  onLaunchPrototype,
  onPublishProject,
  onUnpublishProject,
  onEditLayout,
  onRenameProject,
  onSaveProjectJson,
  onDeleteProject,
  onNavigateHome,
  onBackToProjects,
  onSaveCanvas,
  onDuplicatePage,
  onDeletePage,
  colorMode,
  resolvedColorScheme,
}) {
  const t = useT()
  const flat = flattenPages(pages)
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [jsonOpen, setJsonOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [viewMode, setViewMode] = useState('canvas')
  const [projectJson, setProjectJson] = useState('')
  const [jsonValidationResult, setJsonValidationResult] = useState(null)
  const knownTypes = useMemo(() => new Set(Object.keys(componentRegistry)), [])
  const jsonValidation = useMemo(() => {
    if (!projectJson.trim()) return { errors: ['Project JSON cannot be empty.'], warnings: [] }
    try { return validateProjectImport(JSON.parse(projectJson), knownTypes) }
    catch (error) { return { errors: [`Invalid JSON: ${error.message}`], warnings: [] } }
  }, [projectJson, knownTypes])
  const publishedPath = project?.published ? getPublishedProjectPath(project) : ''
  const publishedUrl = publishedPath && typeof window !== 'undefined'
    ? `${window.location.origin}${publishedPath}`
    : ''

  function openPublishDialog() {
    if (project?.id && !project.published) onPublishProject?.(project.id)
    setPublishOpen(true)
  }

  function openJsonDialog() {
    setProjectJson(exportProjectJson(project?.id) ?? '{}')
    setJsonValidationResult(null)
    setJsonOpen(true)
  }

  function editProjectJson(value) {
    setProjectJson(value)
    setJsonValidationResult(null)
  }

  function validateProjectJson() {
    if (jsonValidation.errors.length > 0) {
      setJsonValidationResult({ status: 'error', message: jsonValidation.errors[0] })
    } else if (jsonValidation.warnings.length > 0) {
      setJsonValidationResult({ status: 'warn', message: `Valid JSON. ${jsonValidation.warnings[0]}` })
    } else {
      setJsonValidationResult({ status: 'success', message: 'Valid JSON — ready to save.' })
    }
  }

  function saveProjectJson() {
    try {
      onSaveProjectJson?.(project.id, JSON.parse(projectJson))
      setJsonOpen(false)
    } catch { /* validation already presents parse errors */ }
  }

  return (
    <>
      <PageTitleArea
        headingId="all-pages-heading"
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigateHome?.() } },
          { label: 'Projects', href: '/editor', onClick: (e) => { e?.preventDefault?.(); onBackToProjects?.() } },
          { label: project?.name ?? 'Project' },
        ]}
        title={project?.name ?? 'Project'}
        description={project?.description}
        actions={(
          <>
            {/* Project actions and the page view share one toolbar; on narrow
                screens it drops to icons and overflows into a More menu.
                Add page stays the primary action. */}
            <Toolbar aria-label="Project actions" overflow overflowLabel="More project actions">
              {flat.length > 0 && (
                <>
                  <ToolbarGroup
                    aria-label="Page view"
                    showLabels={{ xs: false, md: true }}
                    value={viewMode}
                    onChange={setViewMode}
                    options={[
                      { value: 'canvas', label: t('app.projects.canvasView', 'Canvas'), icon: 'dashboard' },
                      { value: 'list',  label: 'List',  icon: 'list' },
                      { value: 'nodes', label: 'Nodes', icon: 'account_tree' },
                    ]}
                  />
                  <ToolbarDivider />
                </>
              )}
              <ToolbarButton icon="edit" label="Edit" showLabel={{ xs: false, md: true }} onClick={() => setEditOpen(true)} />
              {onEditLayout && (
                <ToolbarButton icon="space_dashboard" label="Shared layout" showLabel={{ xs: false, md: true }} onClick={onEditLayout} />
              )}
              <ToolbarButton icon="data_object" label="JSON" showLabel={{ xs: false, md: true }} onClick={openJsonDialog} />
              {flat.length > 0 && (
                <>
                  <ToolbarButton
                    icon={project?.published ? 'public' : 'publish'}
                    label={project?.published
                      ? t('label.app.projects.publishedProjectAction', 'Published')
                      : t('label.app.projects.publishProjectAction', 'Publish')}
                    showLabel={{ xs: false, md: true }}
                    onClick={openPublishDialog}
                  />
                  <ToolbarButton icon="open_in_new" label="Launch" showLabel={{ xs: false, md: true }} onClick={onLaunchPrototype} />
                </>
              )}
              <ToolbarButton icon="archive" label="Archive" showLabel={{ xs: false, md: true }} onClick={() => setConfirmDelete(true)} />
            </Toolbar>
            <Button icon="add" onClick={() => onAddPage?.({})} size="sm">Add page</Button>
          </>
        )}
      />

      {/* Canvas fills everything below the project header (A1-2700). */}
      {viewMode === 'canvas' && flat.length > 0 && (
        <ProjectCanvasView
          project={project}
          pages={pages}
          onOpenPage={onOpenPage}
          onSaveCanvas={(patch) => onSaveCanvas?.(project.id, patch)}
          onDuplicatePage={onDuplicatePage}
          onDeletePage={onDeletePage}
          colorMode={colorMode}
          resolvedColorScheme={resolvedColorScheme}
        />
      )}

      {!(viewMode === 'canvas' && flat.length > 0) && (

      <Section padding="sm" aria-labelledby="all-pages-heading" contentWidth="md">
        <Stack direction="column" gap="lg">

        {flat.length === 0 ? (
          <MessageEmptyState
            icon="note_add"
            title="No pages yet"
            description="Add your first page to start building this project."
            action={<Button icon="add" onClick={() => onAddPage?.({})}>Add page</Button>}
          />
        ) : (
          <Stack direction="column" gap="md">
            {viewMode === 'list' ? (
              <ActionTiles layout="stack" iconLayout="side" aria-label="Project pages">
                {flat.map(({ page, level }) => (
                  <ActionTile
                    key={page.id}
                    as="a"
                    href={`/editor?project=${project?.id}&doc=${page.id}`}
                    icon={page.icon || 'description'}
                    title={(
                      <Stack direction="row" gap="xs" align="center">
                        <span>{page.title || 'Untitled'}</span>
                        <MessageBadge size="sm" subtle icon={null}>L{level}</MessageBadge>
                      </Stack>
                    )}
                    subtitle={page.description}
                    onClick={(e) => {
                      if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                        e.preventDefault()
                        onOpenPage?.(page.id)
                      }
                    }}
                  />
                ))}
              </ActionTiles>
            ) : (
              <ProjectNodeGraph pages={pages} onOpenPage={onOpenPage} />
            )}
          </Stack>
        )}
      </Stack>
      </Section>
      )}

      <ProjectDialog
        key={editOpen ? `edit-${project?.id}` : 'closed'}
        open={editOpen}
        mode="rename"
        initial={project}
        onCancel={() => setEditOpen(false)}
        onSubmit={(values) => { onRenameProject?.(project.id, values); setEditOpen(false) }}
      />

      <Dialog
        open={jsonOpen}
        onClose={() => setJsonOpen(false)}
        title={`${project?.name ?? 'Project'} — definition`}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setJsonOpen(false)}>Cancel</Button>
            <Button variant="secondary" icon="fact_check" onClick={validateProjectJson}>Validate JSON</Button>
            <Button icon="save" disabled={jsonValidation.errors.length > 0} onClick={saveProjectJson}>Save JSON</Button>
          </>
        )}
      >
        <Stack direction="column" gap="sm">
          <Paragraph size="sm" color="muted">
            Edit the whole project bundle, including page metadata and definitions. Invalid JSON or
            structural errors cannot be saved.
          </Paragraph>
          <Code variant="block" copyCode editable wrapping rows={18} onChangeValue={editProjectJson} aria-label="Project definition JSON">{projectJson}</Code>
          {jsonValidation.errors.length > 0 && (
            <Paragraph size="sm" color="danger" role="alert">{jsonValidation.errors[0]}</Paragraph>
          )}
          {jsonValidation.errors.length === 0 && jsonValidation.warnings.length > 0 && (
            <Paragraph size="sm" color="muted" role="status">Warning: {jsonValidation.warnings[0]}</Paragraph>
          )}
          {jsonValidationResult?.status === 'error' && (
            <Paragraph size="sm" color="danger" role="alert">{jsonValidationResult.message}</Paragraph>
          )}
          {jsonValidationResult && jsonValidationResult.status !== 'error' && (
            <Paragraph size="sm" color="muted" role="status">{jsonValidationResult.message}</Paragraph>
          )}
        </Stack>
      </Dialog>

      <Dialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        title={project?.published
          ? t('label.app.projects.publishedDialogTitle', 'Project published')
          : t('label.app.projects.publishDialogTitle', 'Publish project')}
        footer={(
          <>
            {project?.published ? (
              <>
                <Button
                  variant="secondary"
                  icon="visibility_off"
                  onClick={() => project?.id && onUnpublishProject?.(project.id)}
                >
                  {t('label.app.projects.unpublishProject', 'Unpublish')}
                </Button>
                <Button as="a" href={publishedPath} target="_blank" rel="noreferrer" icon="open_in_new">
                  {t('label.app.projects.openPublishedProject', 'Open published page')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setPublishOpen(false)}>
                  {t('label.app.projects.publishCancel', 'Cancel')}
                </Button>
                <Button icon="publish" onClick={() => project?.id && onPublishProject?.(project.id)}>
                  {t('label.app.projects.publishProjectConfirm', 'Publish project')}
                </Button>
              </>
            )}
          </>
        )}
      >
        <Stack direction="column" gap="sm">
          <Paragraph size="sm" color="muted">
            {project?.published
              ? t('label.app.projects.publishedDialogDescription', 'This project is available as a standalone prototype at this URL.')
              : t('label.app.projects.publishDialogDescription', 'Publish this project to create a stable A1 preview URL for this workspace. This does not deploy the project to a public host.')}
          </Paragraph>
          {project?.published && (
            <>
              <MessageBadge status="success" subtle size="sm" icon="public">
                {t('label.app.projects.publishedStatus', 'Published')}
              </MessageBadge>
              <Code variant="block" copyCode wrapping aria-label={t('label.app.projects.publishedUrlLabel', 'Published URL')}>
                {publishedUrl}
              </Code>
            </>
          )}
        </Stack>
      </Dialog>

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        status="warn"
        title="Archive project?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button
              variant="primary"
              icon="archive"
              onClick={() => { setConfirmDelete(false); onDeleteProject?.(project.id) }}
            >
              Archive project
            </Button>
          </>
        }
      >
        <Paragraph>
          “{project?.name}” and its {pages.length} page{pages.length === 1 ? '' : 's'} will be hidden from your
          projects. You can restore it anytime from Archived.
        </Paragraph>
      </Dialog>
    </>
  )
}
