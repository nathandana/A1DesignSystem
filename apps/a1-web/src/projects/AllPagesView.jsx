import { useMemo, useState } from 'react'
import {
  Breadcrumb,
  Button,
  Canvas,
  Card,
  Code,
  Dialog,
  Grid,
  Heading,
  MessageBadge,
  MessageEmptyState,
  Node,
  NodeConnector,
  Paragraph,
  Section,
  SegmentedControl,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { ProjectDialog } from './ProjectDialog.jsx'
import { exportProjectJson, resolvePageJson } from './projectStore'

/** Flatten the page tree into document order, tagging each with its level. */
function flattenPages(pages) {
  const childrenOf = (parentId) => pages.filter((p) => p.parentId === parentId).sort((a, b) => a.order - b.order)
  const out = []
  const walk = (parentId, level) => {
    for (const page of childrenOf(parentId)) { out.push({ page, level }); walk(page.id, level + 1) }
  }
  walk(null, 1)
  return out
}

/** Scan each page's stored definition for /?page= hrefs pointing to other pages in this project. */
function extractPageLinks(pages) {
  const pageIds = new Set(pages.map((p) => p.id))
  const links = new Map() // fromId → Set<toId>
  for (const page of pages) {
    const json = resolvePageJson(page.id)
    if (!json) continue
    const targets = new Set()
    for (const m of json.matchAll(/[?&]page=([^&"\\]+)/g)) {
      const targetId = decodeURIComponent(m[1])
      if (targetId !== page.id && pageIds.has(targetId)) targets.add(targetId)
    }
    if (targets.size) links.set(page.id, targets)
  }
  return links
}

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
  onEditLayout,
  onRenameProject,
  onDeleteProject,
  onNavigateHome,
  onBackToProjects,
}) {
  const flat = flattenPages(pages)
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [jsonOpen, setJsonOpen] = useState(false)
  const [viewMode, setViewMode] = useState('list')
  const projectJson = jsonOpen ? (exportProjectJson(project?.id) ?? '{}') : ''

  return (
    <>
      <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigateHome?.() } },
              { label: 'Projects', href: '/editor', onClick: (e) => { e?.preventDefault?.(); onBackToProjects?.() } },
              { label: project?.name ?? 'Project' },
            ]}
          />
          <Heading as="h1" id="all-pages-heading" size={{ xs: 'lg', md: 'xxl' }}>
            {project?.name ?? 'Project'}
          </Heading>
          {project?.description && (
            <Paragraph size="sm" color="muted">{project.description}</Paragraph>
          )}
          <Stack direction="row" gap="xs" align="center" wrap>
            <Button variant="secondary" size='sm' icon="edit" onClick={() => setEditOpen(true)}>Edit</Button>
            {onEditLayout && (
              <Button variant="secondary" size='sm' icon="space_dashboard" onClick={onEditLayout}>Shared layout</Button>
            )}
            <Button variant="secondary" icon="delete"  size='sm' onClick={() => setConfirmDelete(true)}>Delete</Button>
            <Button variant="secondary" icon="data_object" size='sm' onClick={() => setJsonOpen(true)}>JSON</Button>
            {flat.length > 0 && (
              <Button variant="secondary" icon="open_in_new" size='sm' onClick={onLaunchPrototype}>
                Launch
              </Button>
            )}
            <Button icon="add" onClick={() => onAddPage?.({})} size='sm'>Add page</Button>
          </Stack>
        </Stack>
      </Section>

      <Section padding="sm" aria-labelledby="all-pages-heading" contentWidth="xl">
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
            <Stack direction="row" justify="end">
              <SegmentedControl
                value={viewMode}
                onChange={setViewMode}
                options={[
                  { value: 'list',  label: 'List',  icon: 'list' },
                  { value: 'nodes', label: 'Nodes', icon: 'account_tree' },
                ]}
                aria-label="Page view"
              />
            </Stack>

            {viewMode === 'list' ? (
              <Grid columns={{ xs: 1, sm: 2, lg: 1 }} gap="md">
                {flat.map(({ page, level }) => (
                  <Card
                    key={page.id}
                    variant="navigation"
                    href={`/editor?project=${project?.id}&doc=${page.id}`}
                    icon={page.icon || 'description'}
                    iconDisplay="default"
                    onClick={(e) => {
                      if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                        e.preventDefault()
                        onOpenPage?.(page.id)
                      }
                    }}
                  >
                    <Stack direction="column" gap="xs">
                      <Stack direction="row" gap="xs" align="center">
                        <Heading as="h2" size="sm">{page.title || 'Untitled'}</Heading>
                        <MessageBadge size="sm" subtle icon={null}>L{level}</MessageBadge>
                      </Stack>
                      {page.description && (
                        <Paragraph size="sm" color="muted">{page.description}</Paragraph>
                      )}
                    </Stack>
                  </Card>
                ))}
              </Grid>
            ) : (
              <ProjectNodeGraph pages={pages} onOpenPage={onOpenPage} />
            )}
          </Stack>
        )}
      </Stack>

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
      >
        <Stack direction="column" gap="sm">
          <Paragraph size="sm" color="muted">
            The whole project as a JSON bundle — every page and its definition. This is the same
            shape the project importer accepts, so it round-trips.
          </Paragraph>
          <Code variant="block" copyCode wrapping collapsible collapsedLines={20}>{projectJson}</Code>
        </Stack>
      </Dialog>

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        status="warn"
        title="Delete project?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button
              variant="destructive"
              icon="delete"
              onClick={() => { setConfirmDelete(false); onDeleteProject?.(project.id) }}
            >
              Delete project
            </Button>
          </>
        }
      >
        <Paragraph>
          “{project?.name}” and its {pages.length} page{pages.length === 1 ? '' : 's'} will be permanently
          deleted. This can’t be undone.
        </Paragraph>
      </Dialog>
      </Section>
    </>
  )
}
