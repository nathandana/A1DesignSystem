import { useMemo, useState } from 'react'
import {
  Accordion,
  Button,
  Card,
  ContextMenu,
  DefinitionList,
  Dialog,
  Grid,
  Heading,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  SplitButton,
  Stack,
  Toolbar,
  ToolbarButton,
} from '@gtivr4/a1-design-system-react'
import { PageTitleArea } from '../pages/PageTitleArea.jsx'
import { ProjectDialog } from './ProjectDialog.jsx'
import { ProjectImportDialog } from './ProjectImportDialog.jsx'
import { AiProjectDialog } from './AiProjectDialog.jsx'
import { themeOptions } from '../lib/appThemes.ts'
import { AI_ENABLED } from '../lib/aiImages.ts'
import { exportProjectJson, loadPages } from './projectStore.ts'

// Trigger a browser download of a project as a JSON bundle (round-trips with the
// Upload JSON dialog).
function downloadProjectJson(project) {
  const json = exportProjectJson(project.id)
  if (!json) return
  const slug = (project.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'project'
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${slug}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function formatDate(ts) {
  if (!ts) return ''
  try {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

export function ProjectsList({
  projects = [],
  archivedProjects = [],
  onOpenProject,
  onCreateProject,
  onRenameProject,
  onDuplicateProject,
  onDeleteProject,
  onRestoreProject,
  onDeleteProjectPermanent,
  onImportProject,
  onOpenImageLibrary,
  onNavigateHome,
  onOpenHelp,
}) {
  const [dialog, setDialog] = useState(null)   // { mode: 'create' | 'rename', project }
  const [importing, setImporting] = useState(false) // upload-from-JSON dialog
  const [aiOpen, setAiOpen] = useState(false) // create-with-AI chat dialog
  const [ctxMenu, setCtxMenu] = useState(null)  // { id, x, y }
  const [confirmDelete, setConfirmDelete] = useState(null) // project (archive)
  const [confirmPermanent, setConfirmPermanent] = useState(null) // archived project (permanent delete)

  // Page counts are cheap localStorage reads; recompute when the project set changes.
  const counts = useMemo(() => {
    const map = {}
    for (const p of projects) map[p.id] = loadPages(p.id).length
    return map
  }, [projects])

  function handleSubmit(values) {
    if (dialog?.mode === 'create') onCreateProject(values)
    else if (dialog?.mode === 'rename') onRenameProject(dialog.project.id, values)
    setDialog(null)
  }

  const ctxProject = ctxMenu ? projects.find((p) => p.id === ctxMenu.id) : null
  const themeLabel = (value) => themeOptions.find((option) => option.value === value)?.label ?? 'Default'

  return (
    <>
      <PageTitleArea
        headingId="projects-heading"
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigateHome?.() } },
          { label: 'Projects' },
        ]}
        title="Projects"
        description="Each project is an isolated set of pages with its own auto-generated navigation."
        actions={(
          <Stack direction="row" gap="sm" align="center">
            {/* Secondary actions collapse into a "More" menu on narrow screens so
                the primary "New project" CTA stays visible at every width. Labels
                show from md up; below that the tools are icon-only, and any that
                don't fit move into the overflow menu. */}
            <Toolbar aria-label="Project actions" overflow overflowLabel="More actions">
              <ToolbarButton
                icon="help"
                label="Help"
                showLabel={{ xs: false, md: true }}
                onClick={() => onOpenHelp?.()}
              />
              {onOpenImageLibrary && (
                <ToolbarButton
                  icon="photo_library"
                  label="Image library"
                  showLabel={{ xs: false, md: true }}
                  onClick={() => onOpenImageLibrary()}
                />
              )}
              {onImportProject && (
                <ToolbarButton
                  icon="upload"
                  label="Upload JSON"
                  showLabel={{ xs: false, md: true }}
                  onClick={() => setImporting(true)}
                />
              )}
            </Toolbar>
            {AI_ENABLED ? (
              <SplitButton
                icon="add"
                onClick={() => setDialog({ mode: 'create' })}
                menuLabel="More ways to create a project"
                toggleLabel="More ways to create a project"
                actions={[
                  { id: 'ai', label: 'Create with AI', icon: 'auto_awesome', onClick: () => setAiOpen(true) },
                ]}
              >
                New project
              </SplitButton>
            ) : (
              <Button icon="add" onClick={() => setDialog({ mode: 'create' })}>New project</Button>
            )}
          </Stack>
        )}
      />

      <Section padding="sm" aria-labelledby="projects-heading" contentWidth="xl">
        <Stack direction="column" gap="sm">

        {projects.length === 0 ? (
          <MessageEmptyState
            icon="folder_open"
            title="No projects yet"
            description="Create your first project to start building a multi-page prototype."
            action={<Button icon="add" onClick={() => setDialog({ mode: 'create' })}>New project</Button>}
          />
        ) : (
          <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="md">
            {projects.map((project) => (
              <Card
                key={project.id}
                variant="navigation"
                href={`/editor?project=${project.id}`}
                icon={project.icon}
                iconDisplay="default"
                onClick={(e) => {
                  if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    e.preventDefault()
                    onOpenProject(project.id)
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setCtxMenu({ id: project.id, x: e.clientX, y: e.clientY })
                }}
              >
                <Stack direction="column" gap="sm">
                  <Heading as="h2" size="sm">{project.name}</Heading>
                  {project.description && (
                    <Paragraph size="sm" color="muted">{project.description}</Paragraph>
                  )}
                  <DefinitionList
                    size="sm"
                    items={[
                      { label: 'Pages', value: String(counts[project.id] ?? 0) },
                      { label: 'Theme', value: themeLabel(project.theme) },
                      ...(project.updatedAt
                        ? [{ label: 'Updated', value: formatDate(project.updatedAt) }]
                        : []),
                    ]}
                  />
                </Stack>
              </Card>
            ))}
          </Grid>
        )}

        {archivedProjects.length > 0 && (
          <Accordion label={`Archived (${archivedProjects.length})`} divider>
            <Stack direction="column" gap="sm">
              {archivedProjects.map((project) => (
                <Card key={project.id}>
                  <Stack direction="row" gap="sm" align="center" justify="between" wrap>
                    <Stack direction="row" gap="sm" align="center">
                      <MessageBadge status="neutral" subtle size="sm" icon="archive">Archived</MessageBadge>
                      <Heading as="h3" size="sm">{project.name}</Heading>
                    </Stack>
                    <Stack direction="row" gap="xs" wrap>
                      <Button variant="secondary" size="sm" icon="unarchive" onClick={() => onRestoreProject?.(project.id)}>
                        Restore
                      </Button>
                      <Button variant="tertiary" size="sm" icon="delete" onClick={() => setConfirmPermanent(project)}>
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Accordion>
        )}
      </Stack>

      <ContextMenu
        open={!!ctxMenu}
        x={ctxMenu?.x ?? 0}
        y={ctxMenu?.y ?? 0}
        onClose={() => setCtxMenu(null)}
        aria-label="Project options"
        items={ctxProject ? [
          { id: 'open', label: 'Open', icon: 'arrow_forward', onClick: () => onOpenProject(ctxProject.id) },
          { id: 'rename', label: 'Rename…', icon: 'edit', onClick: () => setDialog({ mode: 'rename', project: ctxProject }) },
          { id: 'duplicate', label: 'Duplicate', icon: 'content_copy', onClick: () => onDuplicateProject(ctxProject.id) },
          { id: 'download', label: 'Download as JSON', icon: 'download', onClick: () => downloadProjectJson(ctxProject) },
          { type: 'divider', id: 'div' },
          { id: 'archive', label: 'Archive…', icon: 'archive', onClick: () => setConfirmDelete(ctxProject) },
        ] : []}
      />

      <ProjectDialog
        key={dialog ? `${dialog.mode}-${dialog.project?.id ?? 'new'}` : 'closed'}
        open={!!dialog}
        mode={dialog?.mode ?? 'create'}
        initial={dialog?.project}
        onCancel={() => setDialog(null)}
        onSubmit={handleSubmit}
      />

      {onImportProject && (
        <ProjectImportDialog
          key={importing ? 'import-open' : 'import-closed'}
          open={importing}
          onCancel={() => setImporting(false)}
          onImport={(data) => { setImporting(false); onImportProject(data) }}
        />
      )}

      {onImportProject && (
        <AiProjectDialog
          open={aiOpen}
          onClose={() => setAiOpen(false)}
          onCreated={(data) => { setAiOpen(false); onImportProject(data) }}
        />
      )}

      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        status="warn"
        title="Archive project?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button
              variant="primary"
              icon="archive"
              onClick={() => { onDeleteProject(confirmDelete.id); setConfirmDelete(null) }}
            >
              Archive project
            </Button>
          </>
        }
      >
        <Paragraph>
          “{confirmDelete?.name}” and its {counts[confirmDelete?.id] ?? 0} page(s) will be hidden from your
          projects. You can restore it anytime from Archived.
        </Paragraph>
        </Dialog>

        <Dialog
          open={!!confirmPermanent}
          onClose={() => setConfirmPermanent(null)}
          status="error"
          title="Delete permanently?"
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirmPermanent(null)}>Cancel</Button>
              <Button
                variant="destructive"
                icon="delete"
                onClick={() => { onDeleteProjectPermanent?.(confirmPermanent.id); setConfirmPermanent(null) }}
              >
                Delete permanently
              </Button>
            </>
          }
        >
          <Paragraph>
            “{confirmPermanent?.name}” and all its pages will be permanently deleted. This can’t be undone.
          </Paragraph>
        </Dialog>
      </Section>
    </>
  )
}
