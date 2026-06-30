import { useState } from 'react'
import {
  Banner,
  Button,
  Card,
  Dialog,
  Grid,
  GridItem,
  Heading,
  Paragraph,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { addCustomIcon } from '../lib/customIconStore.ts'
import { designIcons } from '../lib/aiIcons.ts'
import { formatUsage } from '../lib/aiImages.ts'

// ── IconPreviewCard ───────────────────────────────────────────────────────────

function IconPreviewCard({ icon, onAdded }) {
  const [name, setName] = useState(icon.name)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  async function handleAdd() {
    if (!icon.valid || !name.trim() || saved) return
    setSaveError('')
    try {
      await addCustomIcon({ name: name.trim(), svg: icon.svg, paths: icon.paths, projectIds: [] })
      setSaved(true)
      onAdded(name.trim())
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not add icon.')
    }
  }

  return (
    <Card>
      <Stack gap="sm">
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
            {icon.paths.map((d, i) => <path key={i} d={d} fill="currentColor" />)}
          </svg>
        </div>

        {!icon.valid && <Banner status="warn" variant="inline">{icon.error}</Banner>}
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
              onChange={(e) => setName(e.target.value)}
            />
            {saveError && <Banner status="error" variant="inline">{saveError}</Banner>}
            <Button size="sm" icon="font_download" variant="secondary" disabled={!icon.valid || !name.trim()} onClick={handleAdd}>
              Add to font
            </Button>
          </>
        )}
      </Stack>
    </Card>
  )
}

// ── VirtualIconDesignerDialog ─────────────────────────────────────────────────

export function VirtualIconDesignerDialog({ open, onClose, projects = [] }) {
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
      setResult(await designIcons({ description: description.trim(), count: 3 }))
    } catch (err) {
      const msg = err?.message ?? ''
      setError(
        msg === 'NO_API_KEY'
          ? 'Add your Anthropic API key in Settings → AI to use this feature.'
          : `Generation failed: ${msg || 'unknown error'}`
      )
    } finally {
      setBusy(false)
    }
  }

  function handleClose() {
    setDescription('')
    setResult(null)
    setAddedNames([])
    setError('')
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Virtual Icon Designer"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            {addedNames.length ? `Done (${addedNames.length} added)` : 'Cancel'}
          </Button>
          {result && (
            <Button icon="refresh" loading={busy} disabled={!description.trim() || busy} onClick={handleGenerate}>
              Regenerate
            </Button>
          )}
        </>
      }
    >
      <Stack gap="lg">
        <Stack gap="sm">
          <TextareaField
            label="Describe your icon"
            hint='Be specific — e.g. "A padlock with a sparkle", "Upload arrow into a cloud"'
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {!result && (
            <Button
              icon={busy ? undefined : 'auto_awesome'}
              loading={busy}
              disabled={!description.trim() || busy}
              onClick={handleGenerate}
            >
              {busy ? 'Designing…' : 'Design icons'}
            </Button>
          )}
        </Stack>

        {error && <Banner status="error" variant="inline">{error}</Banner>}


        {result && (
          <Stack gap="md">
            <Paragraph size="xs" color="muted">{formatUsage(result.usage)}</Paragraph>
            <Grid columns={{ xs: 1, sm: 3 }} gap="md">
              {result.icons.map((icon, i) => (
                <GridItem key={i}>
                  <IconPreviewCard icon={icon} onAdded={(n) => setAddedNames((p) => [...p, n])} />
                </GridItem>
              ))}
            </Grid>
            {addedNames.length > 0 && (
              <Banner status="success" variant="inline">Added to font: {addedNames.join(', ')}</Banner>
            )}
          </Stack>
        )}
      </Stack>
    </Dialog>
  )
}
