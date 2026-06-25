import { useMemo, useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  Card,
  CheckboxGroup,
  Dialog,
  Grid,
  GridItem,
  Heading,
  Icon,
  MessageBadge,
  Paragraph,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { addCustomIcon } from '../lib/customIconStore.ts'
import { loadProjects } from '../projects/projectStore'
import {
  designIconsLocal,
  virtualIconDesigner,
} from '../services/virtualIcon'

// ── IconPreviewCard ───────────────────────────────────────────────────────────

function IconPreviewCard({ icon, projects, onAdded }) {
  const [name, setName] = useState(icon.name)
  const [projectIds, setProjectIds] = useState([])
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  async function handleAdd() {
    if (!icon.valid || !name.trim() || saved) return
    setSaveError('')
    try {
      await addCustomIcon({
        name: name.trim(),
        svg: icon.svg,
        paths: icon.paths,
        projectIds,
      })
      setSaved(true)
      onAdded(name.trim())
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not add icon.')
    }
  }

  return (
    <Card>
      <Stack gap="sm">
        {/* Inline SVG preview — no store dependency, renders immediately */}
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--base-spacing-16)',
            background: 'var(--semantic-color-surface-raised)',
            borderRadius: 'var(--base-radius-md)',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="64"
            height="64"
            fill="currentColor"
          >
            {icon.paths.map((d, i) => (
              <path key={i} d={d} fill="currentColor" />
            ))}
          </svg>
        </div>

        {!icon.valid && (
          <Banner status="warn" variant="inline">{icon.error}</Banner>
        )}

        <Paragraph size="xs" color="muted">{icon.reason}</Paragraph>

        {saved ? (
          <Banner status="success" variant="inline">Added as custom:{name}</Banner>
        ) : (
          <>
            <TextField
              label="Icon name"
              hint="Components reference this as custom:name"
              size="compact"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            {projects.length > 0 && (
              <CheckboxGroup
                label="Restrict to projects"
                hint="Leave all unchecked for all projects."
                size="compact"
                value={projectIds}
                onChange={setProjectIds}
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
              />
            )}
            {saveError && (
              <Banner status="error" variant="inline">{saveError}</Banner>
            )}
            <Button
              size="sm"
              icon="font_download"
              variant="secondary"
              disabled={!icon.valid || !name.trim()}
              onClick={handleAdd}
            >
              Add to font
            </Button>
          </>
        )}
      </Stack>
    </Card>
  )
}

// ── VirtualIconPanel ──────────────────────────────────────────────────────────

function runDetail(result) {
  if (!result) return ''
  if (result.fromFallback && result.model === 'none') {
    return 'No local model found — showing templates'
  }
  const seconds = `${(result.elapsedMs / 1000).toFixed(1)}s`
  if (result.fromFallback) return `${result.model} · ${seconds} · could not parse output`
  return `${result.model} · ${seconds} · local`
}

/**
 * Dev-only local icon designer. Prompts an optional Ollama model to generate
 * Material Symbols-style SVG icons from a text description. When no local
 * model is available, shows geometric template icons instead.
 */
export function VirtualIconPanel() {
  const projects = useMemo(() => loadProjects(), [])
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [addedNames, setAddedNames] = useState([])
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!description.trim() || busy) return
    setBusy(true)
    setError('')
    setResult(null)
    setAddedNames([])
    try {
      const next = await designIconsLocal({ description: description.trim(), count: 3 })
      setResult(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Icon generation failed.')
    } finally {
      setBusy(false)
    }
  }

  function handleAdded(name) {
    setAddedNames((prev) => [...prev, name])
  }

  function handleClose() {
    setResult(null)
    setAddedNames([])
  }

  return (
    <>
      <Stack gap="md">
        <Stack direction="row" gap="xs" align="center" wrap>
          <Icon name={virtualIconDesigner.icon} color="accent" />
          <Heading as="h3" size="xs">{virtualIconDesigner.name}</Heading>
          <MessageBadge status="warn" subtle size="sm">Dev only</MessageBadge>
        </Stack>
        <Paragraph size="sm" color="muted">{virtualIconDesigner.blurb}</Paragraph>

        <Card>
          <Stack gap="sm">
            <Stack direction="row" gap="sm" align="center" wrap>
              <Icon name="auto_awesome" color="accent" size="sm" />
              <Heading as="h4" size="xs">Design icons</Heading>
            </Stack>
            <Paragraph size="sm" color="muted">
              Describe an icon concept — the local model will generate three 24×24 SVG
              variations to the Material Symbols spec. Accept any you like directly
              into your custom icon font.
            </Paragraph>
            <TextareaField
              label="Icon concept"
              hint='Be specific — e.g. "A padlock with a sparkle" or "Upload arrow into a cloud"'
              size="compact"
              rows={2}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <ButtonContainer align="start">
              <Button
                size="sm"
                icon="auto_awesome"
                loading={busy}
                disabled={!description.trim() || busy}
                onClick={handleGenerate}
              >
                {busy ? 'Designing…' : 'Design icons'}
              </Button>
            </ButtonContainer>
          </Stack>
        </Card>

        {error && (
          <Banner status="error" variant="inline" onDismiss={() => setError('')}>{error}</Banner>
        )}

        {addedNames.length > 0 && !result && (
          <Banner status="success" variant="inline">
            Added to font: {addedNames.join(', ')}
          </Banner>
        )}
      </Stack>

      <Dialog
        open={!!result}
        onClose={handleClose}
        title={virtualIconDesigner.name}
        footer={
          result ? (
            <Stack gap="xs">
              <Paragraph size="xs" color="muted">{runDetail(result)}</Paragraph>
              <ButtonContainer>
                <Button variant="secondary" onClick={handleClose}>
                  {addedNames.length ? `Done (${addedNames.length} added)` : 'Close'}
                </Button>
                <Button
                  icon="refresh"
                  loading={busy}
                  disabled={!description.trim() || busy}
                  onClick={handleGenerate}
                >
                  Regenerate
                </Button>
              </ButtonContainer>
            </Stack>
          ) : undefined
        }
      >
        {result && (
          <Stack gap="md">
            {result.fromFallback && result.model === 'none' ? (
              <Banner status="info" variant="inline">
                No local Ollama model found. Showing geometric templates — install Ollama and pull a
                model to generate custom icons. See{' '}
                <a href="https://ollama.com" target="_blank" rel="noreferrer">ollama.com</a>.
              </Banner>
            ) : result.fromFallback ? (
              <Banner status="warn" variant="inline">
                The model returned output that couldn't be parsed as valid SVG paths.
                Showing templates instead — try regenerating or use a different model.
              </Banner>
            ) : null}

            <Grid columns={{ xs: 1, sm: 3 }} gap="md">
              {result.icons.map((icon, i) => (
                <GridItem key={i}>
                  <IconPreviewCard
                    icon={icon}
                    projects={projects}
                    onAdded={handleAdded}
                  />
                </GridItem>
              ))}
            </Grid>

            {addedNames.length > 0 && (
              <Banner status="success" variant="inline">
                Added to font: {addedNames.join(', ')}
              </Banner>
            )}
          </Stack>
        )}
      </Dialog>
    </>
  )
}
