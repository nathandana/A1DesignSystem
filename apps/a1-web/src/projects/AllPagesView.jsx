import { useState } from 'react'
import {
  Breadcrumb,
  Button,
  Card,
  Dialog,
  Grid,
  Heading,
  Icon,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { ProjectDialog } from './ProjectDialog.jsx'

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

  return (
    <Section padding="lg" aria-labelledby="all-pages-heading" contentWidth='xl'>
      <Stack direction="column" gap="lg">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigateHome?.() } },
            { label: 'Projects', href: '/?page=editor', onClick: (e) => { e?.preventDefault?.(); onBackToProjects?.() } },
            { label: project?.name ?? 'Project' },
          ]}
        />
        <Stack direction="row" align="end" justify="between" wrap gap="md">
          <Stack direction="column" gap="sm">
            <Heading as="h1" id="all-pages-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
              {project?.name ?? 'Project'}
            </Heading>
            {project?.description && (
              <Paragraph size="lg" color="muted">{project.description}</Paragraph>
            )}
          </Stack>
          <Stack direction="row" gap="sm" align="center" wrap>
            <Button variant="secondary" size='sm' icon="edit" onClick={() => setEditOpen(true)}>Edit</Button>
            {onEditLayout && (
              <Button variant="secondary" size='sm' icon="space_dashboard" onClick={onEditLayout}>Shared layout</Button>
            )}
            <Button variant="secondary" icon="delete"  size='sm' onClick={() => setConfirmDelete(true)}>Delete</Button>
            {flat.length > 0 && (
              <Button variant="secondary" icon="open_in_new" size='sm' onClick={onLaunchPrototype}>
                Launch
              </Button>
            )}
            <Button icon="add" onClick={() => onAddPage?.({})} size='sm'>Add page</Button>
          </Stack>
        </Stack>

        {flat.length === 0 ? (
          <MessageEmptyState
            icon="note_add"
            title="No pages yet"
            description="Add your first page to start building this project."
            action={<Button icon="add" onClick={() => onAddPage?.({})}>Add page</Button>}
          />
        ) : (
          <Grid columns={{ xs: 1, sm: 2, lg: 1 }} gap="md">
            {flat.map(({ page, level }) => (
              <Card
                key={page.id}
                variant="navigation"
                href={`/?page=editor&project=${project?.id}&doc=${page.id}`}
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
  )
}
