import { useState } from 'react'
import {
  Banner,
  Button,
  Card,
  CheckboxGroup,
  Dialog,
  Grid,
  GridItem,
  Heading,
  Paragraph,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { designIcons } from '../lib/aiIcons.ts'
import { addCustomIcon } from '../lib/customIconStore.ts'
import { formatUsage } from '../lib/aiImages.ts'

// ── IconPreviewCard ─────────────────────────────────────────────────────────

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
      setSaveError(err.message)
    }
  }

  return (
    <Card>
      <Stack gap="sm">
        {/* SVG preview — paths rendered directly so no store dependency */}
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

// ── VirtualIconDesigner ─────────────────────────────────────────────────────

export function VirtualIconDesigner({ open, onClose, projects = [] }) {
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [addedNames, setAddedNames] = useState([])

  async function generate() {
    if (!prompt.trim() || generating) return
    setGenerating(true)
    setError('')
    try {
      const result = await designIcons({ description: prompt.trim(), count: 3 })
      setResults(result)
    } catch (err) {
      const msg = err?.message ?? ''
      setError(
        msg === 'NO_API_KEY'
          ? 'Add your Anthropic API key in Settings → AI to use this feature.'
          : `Generation failed: ${msg || 'unknown error'}.`,
      )
    } finally {
      setGenerating(false)
    }
  }

  function handleClose() {
    setPrompt('')
    setResults(null)
    setError('')
    setAddedNames([])
    onClose()
  }

  function handleAdded(name) {
    setAddedNames((prev) => [...prev, name])
  }

  const hasResults = results && results.icons.length > 0

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Virtual Icon Designer"
      footer={
        <Stack direction="row" gap="sm" justify="end">
          <Button variant="secondary" onClick={handleClose}>
            {addedNames.length ? `Done (${addedNames.length} added)` : 'Cancel'}
          </Button>
          {hasResults && (
            <Button
              icon="refresh"
              loading={generating}
              disabled={!prompt.trim() || generating}
              onClick={generate}
            >
              Regenerate
            </Button>
          )}
        </Stack>
      }
    >
      <Stack gap="lg">
        <Stack gap="sm">
          <TextareaField
            label="Describe your icon"
            hint='Be specific — e.g. "A padlock with a sparkle", "Upload arrow pointing into a cloud"'
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={2}
          />
          {!hasResults && (
            <Button
              icon={generating ? undefined : 'auto_awesome'}
              loading={generating}
              disabled={!prompt.trim() || generating}
              onClick={generate}
            >
              {generating ? 'Designing…' : 'Design icons'}
            </Button>
          )}
        </Stack>

        {error && (
          <Banner status="error" variant="inline">{error}</Banner>
        )}

        {!hasResults && !generating && (
          <Banner status="info" variant="inline">
            Describe a concept and I'll generate three SVG icon designs to the Material Symbols
            24×24 filled-path spec. Results may need refinement — re-prompt or regenerate to iterate.
          </Banner>
        )}

        {hasResults && (
          <Stack gap="sm">
            <Stack direction="row" gap="xs" align="center" justify="between">
              <Heading as="h2" size="sm">Results</Heading>
              <Paragraph size="xs" color="muted">{formatUsage(results.usage)}</Paragraph>
            </Stack>

            <Grid columns={{ xs: 1, sm: 3 }} gap="md">
              {results.icons.map((icon, i) => (
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
      </Stack>
    </Dialog>
  )
}
