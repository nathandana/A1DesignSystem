import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Banner,
  Button,
  Card,
  CheckboxGroup,
  Dialog,
  Grid,
  Heading,
  Icon,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  Stack,
  TextField,
  Toolbar,
  ToolbarMenu,
} from '@gtivr4/a1-design-system-react'
import { PageTitleArea } from '../pages/PageTitleArea.jsx'
import {
  addCustomIcon,
  deleteCustomIcon,
  listCustomIcons,
  subscribeCustomIconStore,
  updateCustomIcon,
} from '../lib/customIconStore.ts'
import { validateCustomIconSvg } from '../lib/customIconFont.ts'
import { VirtualIconDesignerDialog } from './VirtualIconDesignerDialog.jsx'

function scopeLabel(icon, projects) {
  if (!icon.projectIds.length) return 'All projects'
  const names = icon.projectIds
    .map((id) => projects.find((project) => project.id === id)?.name)
    .filter(Boolean)
  return names.length ? names.join(', ') : 'Unknown project'
}

function filenameToName(filename) {
  return filename
    .replace(/\.svg$/i, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function CustomIconsView({ projects = [], onNavigate }) {
  const [icons, setIcons] = useState([])
  const [filter, setFilter] = useState('all')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [name, setName] = useState('')
  const [projectIds, setProjectIds] = useState([])
  const [svgText, setSvgText] = useState('')
  const [fileName, setFileName] = useState('')
  const [validation, setValidation] = useState(null)
  const [error, setError] = useState('')
  const [designerOpen, setDesignerOpen] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    let active = true
    const reload = () => listCustomIcons().then((next) => { if (active) setIcons(next) })
    reload()
    const unsubscribe = subscribeCustomIconStore(reload)
    return () => { active = false; unsubscribe() }
  }, [])

  useEffect(() => {
    if (!svgText || !name) {
      setValidation(null)
      return
    }
    try {
      setValidation(validateCustomIconSvg(svgText, name))
      setError('')
    } catch (nextError) {
      setValidation(null)
      setError(nextError.message)
    }
  }, [name, svgText])

  const visibleIcons = useMemo(() => icons.filter((icon) => {
    if (filter === 'all') return true
    if (filter === 'global') return icon.projectIds.length === 0
    return icon.projectIds.includes(filter)
  }), [filter, icons])

  const filterItems = [
    { value: 'all', label: 'All icons', icon: 'apps' },
    { value: 'global', label: 'All projects', icon: 'public' },
    ...projects.map((project) => ({
      value: project.id,
      label: project.name,
      icon: project.icon || 'folder',
    })),
  ]

  function openUpload() {
    setName('')
    setProjectIds([])
    setSvgText('')
    setFileName('')
    setValidation(null)
    setError('')
    setUploadOpen(true)
  }

  async function readFile(file) {
    if (!file) return
    if (file.type !== 'image/svg+xml' && !file.name.toLowerCase().endsWith('.svg')) {
      setError('Choose an SVG file.')
      return
    }
    setFileName(file.name)
    setName(filenameToName(file.name))
    setSvgText(await file.text())
  }

  async function saveIcon() {
    if (!validation) return
    try {
      await addCustomIcon({
        name: validation.name,
        svg: validation.svg,
        paths: validation.paths,
        projectIds,
      })
      setUploadOpen(false)
    } catch (nextError) {
      setError(nextError.message)
    }
  }

  async function saveScope() {
    if (!editing) return
    try {
      await updateCustomIcon(editing.id, { projectIds: editing.projectIds })
      setEditing(null)
    } catch (nextError) {
      setError(nextError.message)
    }
  }

  async function confirmDelete() {
    if (!deleting) return
    await deleteCustomIcon(deleting.id)
    setDeleting(null)
  }

  return (
    <>
      <PageTitleArea
        breadcrumbItems={[
          { label: 'Home', onClick: () => onNavigate?.('home') },
          { label: 'Custom icons', current: true },
        ]}
        title="Custom icons"
        description="Validate SVG artwork, build a browser font, and scope icons to projects."
        actions={(
          <>
              {import.meta.env.DEV && (
                <Button
                  icon="draw"
                  variant="secondary"
                  onClick={() => setDesignerOpen(true)}
                >
                  Design with AI
                </Button>
              )}
              <Button icon="add" onClick={openUpload}>Add custom icon</Button>
          </>
        )}
      />

      <Section padding="sm" contentWidth="xl">
        <Stack gap="lg">
          {error && !uploadOpen && (
            <Banner status="error" variant="inline" onDismiss={() => setError('')}>{error}</Banner>
          )}

          <Toolbar aria-label="Filter custom icons">
            <ToolbarMenu
              icon="filter_list"
              label="Filter by project"
              showLabel
              value={filter}
              items={filterItems}
              onChange={setFilter}
              aria-label="Filter by project"
            />
          </Toolbar>

          {visibleIcons.length ? (
            <Grid columns={{ xs: 1, sm: 2, lg: 3, xl: 4 }} gap="md">
              {visibleIcons.map((icon) => (
                <Card key={icon.id}>
                  <Stack gap="md">
                    <Stack direction="row" gap="md" align="center">
                      <Icon name={`custom:${icon.name}`} size="xl" />
                      <Stack gap="xs">
                        <Heading as="h2" size="sm">{icon.name}</Heading>
                        <Paragraph size="xs" color="muted">custom:{icon.name}</Paragraph>
                      </Stack>
                    </Stack>
                    <MessageBadge status="neutral" icon={icon.projectIds.length ? 'folder' : 'public'}>
                      {scopeLabel(icon, projects)}
                    </MessageBadge>
                    <Stack direction="row" gap="sm" wrap>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon="edit"
                        onClick={() => setEditing({ ...icon, projectIds: [...icon.projectIds] })}
                      >
                        Edit scope
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        icon="delete"
                        onClick={() => setDeleting(icon)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Grid>
          ) : (
            <MessageEmptyState
              icon="font_download"
              title="No custom icons in this scope"
              description="Change the project filter or add an SVG icon."
              action={<Button icon="add" onClick={openUpload}>Add custom icon</Button>}
            />
          )}
        </Stack>
      </Section>

      <Dialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Add custom icon"
        footer={
          <>
            <Button variant="secondary" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button icon="font_download" disabled={!validation} onClick={saveIcon}>Add to font</Button>
          </>
        }
      >
        <Stack gap="md">
          <input
            ref={fileRef}
            className="a1-web-visually-hidden"
            type="file"
            accept=".svg,image/svg+xml"
            aria-label="Choose custom icon SVG"
            onChange={(event) => readFile(event.target.files?.[0])}
          />
          <Button variant="secondary" icon="upload_file" onClick={() => fileRef.current?.click()}>
            {fileName || 'Choose SVG'}
          </Button>
          <TextField
            label="Icon name"
            hint="Use snake_case. Components reference this icon as custom:name."
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          {projects.length ? (
            <CheckboxGroup
              label="Restrict to projects"
              hint="Leave all unchecked to make this icon available to every project."
              size="compact"
              value={projectIds}
              onChange={setProjectIds}
              options={projects.map((project) => ({ value: project.id, label: project.name }))}
            />
          ) : null}
          {error && <Banner status="error" variant="inline">{error}</Banner>}
          {validation && (
            <Banner status="success" variant="inline">
              SVG meets the 24×24 filled-path specification and is ready to build.
            </Banner>
          )}
        </Stack>
      </Dialog>

      <Dialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit icon scope"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button icon="check" onClick={saveScope}>Save</Button>
          </>
        }
      >
        {editing && (
          <Stack gap="md">
            <Stack direction="row" gap="md" align="center">
              <Icon name={`custom:${editing.name}`} size="xl" />
              <Paragraph>custom:{editing.name}</Paragraph>
            </Stack>
            <CheckboxGroup
              label="Restrict to projects"
              hint="Leave all unchecked to make this icon available to every project."
              size="compact"
              value={editing.projectIds}
              onChange={(next) => setEditing((current) => ({ ...current, projectIds: next }))}
              options={projects.map((project) => ({ value: project.id, label: project.name }))}
            />
          </Stack>
        )}
      </Dialog>

      <VirtualIconDesignerDialog
        open={designerOpen}
        onClose={() => setDesignerOpen(false)}
        projects={projects}
      />

      <Dialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete custom icon?"
        status="warn"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="destructive" icon="delete" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <Paragraph>
          custom:{deleting?.name} will be removed. Existing component references will no longer render it.
        </Paragraph>
      </Dialog>
    </>
  )
}
