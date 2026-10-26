import { useMemo, useRef, useState } from 'react'
import {
  Accordion,
  Autocomplete,
  Button,
  Card,
  Chip,
  ChipGroup,
  ContextMenu,
  DefinitionList,
  Dialog,
  Grid,
  Heading,
  IconButton,
  Menu,
  MenuItem,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  SplitButton,
  Stack,
  Toolbar,
  ToolbarButton,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { useT } from '../labels/useT.js'
import { PageTitleArea } from '../pages/PageTitleArea.jsx'
import { ProjectDialog } from './ProjectDialog.jsx'
import { ProjectImportDialog } from './ProjectImportDialog.jsx'
import { AiProjectDialog } from './AiProjectDialog.jsx'
import { themeOptions } from '../lib/appThemes.ts'
import { AI_ENABLED } from '../lib/aiImages.ts'
import { exportProjectJson, loadPages, projectTags, sortProjects } from './projectStore.ts'

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
  onOrganizeProject,
  onMoveProject,
  onMoveProjectToEdge,
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
  const [moreMenuId, setMoreMenuId] = useState(null) // project whose More options menu is open (A1-2712)
  const moreAnchorRef = useRef(null)
  const [tagsProjectId, setTagsProjectId] = useState(null) // project in the Add tags dialog
  const [tagFilter, setTagFilter] = useState('')
  const [showHidden, setShowHidden] = useState(false)
  const t = useT()

  // Organization (A1-2712): hidden projects drop out unless shown, an optional tag
  // filters the rest, and favorites lead in manual order.
  const hiddenCount = projects.filter((p) => p.hidden).length
  const visibleProjects = projects.filter((p) => showHidden || !p.hidden)
  const tags = projectTags(visibleProjects)
  const activeTag = tags.includes(tagFilter) ? tagFilter : ''
  const shownProjects = sortProjects(visibleProjects.filter((p) => !activeTag || p.tags?.includes(activeTag)))
  const favorites = shownProjects.filter((p) => p.favorite)
  const others = shownProjects.filter((p) => !p.favorite)
  const allTags = projectTags(projects)
  const organizedProjects = sortProjects(projects)
  // Moves stay within a project's group (favorites or the rest).
  const groupOf = (project) => organizedProjects.filter((p) => !!p.favorite === !!project.favorite)
  const canMove = (project, direction) => {
    const group = groupOf(project)
    const index = group.findIndex((p) => p.id === project.id) + direction
    return index >= 0 && index < group.length
  }

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

  // One card grid. `grouped` (Favorites / Other projects headings above) demotes
  // the card titles to h3 so the heading order stays semantic.
  const renderGrid = (list, grouped) => (
    <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="md">
      {list.map((project) => (
              <Card
                key={project.id}
                icon={project.icon}
                iconDisplay="default"
                onContextMenu={(e) => {
                  e.preventDefault()
                  setCtxMenu({ id: project.id, x: e.clientX, y: e.clientY })
                }}
              >
                <Stack direction="column" gap="sm">
                  <Stack direction="row" gap="xs" align="start" justify="between">
                    <Heading id={`project-title-${project.id}`} as={grouped ? 'h3' : 'h2'} size="sm">{project.name}</Heading>
                    {/* Card actions (A1-2712): the card itself isn't a link, so it can
                        hold controls. aria-describedby ties each to its project. */}
                    <Stack direction="row" gap="xs">
                      <IconButton
                        as="a"
                        href={`/editor?project=${project.id}`}
                        icon="edit"
                        label={t('app.projects.edit', 'Edit')}
                        aria-describedby={`project-title-${project.id}`}
                        onClick={(e) => {
                          if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            e.preventDefault()
                            onOpenProject(project.id)
                          }
                        }}
                      />
                      {onOrganizeProject && (
                        <IconButton
                          icon="more_vert"
                          label={t('app.projects.moreOptions', 'More options')}
                          aria-describedby={`project-title-${project.id}`}
                          aria-haspopup="dialog"
                          aria-expanded={moreMenuId === project.id}
                          onClick={(e) => {
                            moreAnchorRef.current = e.currentTarget
                            setMoreMenuId(project.id)
                          }}
                        />
                      )}
                    </Stack>
                  </Stack>
                  {project.description && (
                    <Paragraph size="sm" color="muted">{project.description}</Paragraph>
                  )}
                  {(project.hidden || project.tags?.length > 0) && (
                    <Stack direction="row" gap="xs" wrap>
                      {project.hidden && (
                        <MessageBadge status="neutral" subtle size="sm" icon="visibility_off">{t('app.projects.hidden', 'Hidden')}</MessageBadge>
                      )}
                      {project.tags?.map((tag) => (
                        <MessageBadge key={tag} status="info" subtle size="sm" icon="sell">{tag}</MessageBadge>
                      ))}
                    </Stack>
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
  )

  const ctxProject = ctxMenu ? projects.find((p) => p.id === ctxMenu.id) : null
  const moreProject = moreMenuId ? projects.find((p) => p.id === moreMenuId) : null
  const tagsProject = tagsProjectId ? projects.find((p) => p.id === tagsProjectId) : null
  const closeMoreMenu = () => {
    setMoreMenuId(null)
    moreAnchorRef.current?.focus()
  }
  // Close the menu, then act (a move re-renders the grid under the menu).
  const runMore = (action) => {
    setMoreMenuId(null)
    action()
  }
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
          <>
            {(tags.length > 0 || hiddenCount > 0) && (
              <Stack direction="row" gap="sm" align="end" justify={tags.length > 0 ? 'between' : 'end'} wrap>
                {tags.length > 0 && (
                  <ChipGroup
                    label={t('app.projects.filterByTag', 'Filter by tag')}
                    selectionMode="single"
                    size="sm"
                    value={activeTag}
                    onChange={(value) => setTagFilter(value)}
                  >
                    <Chip value="" title={t('app.projects.allTags', 'All')} selected={!activeTag} />
                    {tags.map((tag) => <Chip key={tag} value={tag} title={tag} icon="sell" />)}
                  </ChipGroup>
                )}
                {hiddenCount > 0 && (
                  <Toolbar aria-label={t('app.projects.showHidden', 'Show hidden')}>
                    <ToolbarToggle
                      icon="visibility"
                      label={`${t('app.projects.showHidden', 'Show hidden')} (${hiddenCount})`}
                      showLabel
                      pressed={showHidden}
                      onChange={setShowHidden}
                    />
                  </Toolbar>
                )}
              </Stack>
            )}
            {visibleProjects.length === 0 ? (
              <MessageEmptyState
                icon="visibility_off"
                title={t('app.projects.allHiddenTitle', 'All projects are hidden')}
                description={t('app.projects.allHiddenDescription', 'Turn on Show hidden to see them.')}
                action={<Button variant="secondary" icon="visibility" onClick={() => setShowHidden(true)}>{t('app.projects.showHidden', 'Show hidden')}</Button>}
              />
            ) : favorites.length > 0 ? (
              <>
                <Heading as="h2" size="md">{t('app.projects.favoritesHeading', 'Favorites')}</Heading>
                {renderGrid(favorites, true)}
                {others.length > 0 && (
                  <>
                    <Heading as="h2" size="md">{t('app.projects.otherProjectsHeading', 'Other projects')}</Heading>
                    {renderGrid(others, true)}
                  </>
                )}
              </>
            ) : renderGrid(others, false)}
          </>
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
          ...(onOrganizeProject ? [
            ctxProject.hidden
              ? { id: 'show', label: t('app.projects.show', 'Show'), icon: 'visibility', onClick: () => onOrganizeProject(ctxProject.id, { hidden: false }) }
              : { id: 'hide', label: t('app.projects.hide', 'Hide'), icon: 'visibility_off', onClick: () => onOrganizeProject(ctxProject.id, { hidden: true }) },
          ] : []),
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

      {moreProject && (
        <Menu
          open
          onClose={closeMoreMenu}
          anchorRef={moreAnchorRef}
          aria-label={t('app.projects.moreOptions', 'More options')}
        >
          <MenuItem
            icon="star"
            onClick={() => runMore(() => onOrganizeProject(moreProject.id, { favorite: !moreProject.favorite }))}
          >
            {moreProject.favorite
              ? t('app.projects.removeFromFavorites', 'Remove from favorites')
              : t('app.projects.favorite', 'Favorite')}
          </MenuItem>
          <MenuItem icon="vertical_align_top" disabled={!canMove(moreProject, -1)} onClick={() => runMore(() => onMoveProjectToEdge?.(moreProject.id, 'top'))}>
            {t('app.projects.moveToTop', 'Move to top')}
          </MenuItem>
          <MenuItem icon="arrow_upward" disabled={!canMove(moreProject, -1)} onClick={() => runMore(() => onMoveProject?.(moreProject.id, -1))}>
            {t('app.projects.moveUp', 'Move up 1')}
          </MenuItem>
          <MenuItem icon="arrow_downward" disabled={!canMove(moreProject, 1)} onClick={() => runMore(() => onMoveProject?.(moreProject.id, 1))}>
            {t('app.projects.moveDown', 'Move down 1')}
          </MenuItem>
          <MenuItem icon="vertical_align_bottom" disabled={!canMove(moreProject, 1)} onClick={() => runMore(() => onMoveProjectToEdge?.(moreProject.id, 'bottom'))}>
            {t('app.projects.moveToBottom', 'Move to bottom')}
          </MenuItem>
          <MenuItem icon="sell" onClick={() => runMore(() => setTagsProjectId(moreProject.id))}>
            {t('app.projects.addTags', 'Add tags…')}
          </MenuItem>
        </Menu>
      )}

      <Dialog
        open={!!tagsProject}
        onClose={() => setTagsProjectId(null)}
        title={t('app.projects.addTagsTitle', 'Add tags')}
        footer={<Button onClick={() => setTagsProjectId(null)}>{t('app.projects.tagsDone', 'Done')}</Button>}
      >
        {tagsProject && (
          <Stack direction="column" gap="sm">
            <Heading as="h3" size="xs">{tagsProject.name}</Heading>
            <Autocomplete
              label={t('app.projects.tags', 'Tags')}
              multiple
              allowCreate
              options={allTags}
              value={tagsProject.tags ?? []}
              onChange={(value) => onOrganizeProject(tagsProject.id, { tags: value })}
            />
          </Stack>
        )}
      </Dialog>

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
