import { useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  ChoiceGroup,
  CircularProgress,
  Dialog,
  Link,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { describeError, formatUsage, hasApiKey, setApiKey } from '../../../lib/aiImages.ts'
import { suggestIcons } from '../../../lib/aiIcons.ts'

/**
 * AI icon finder. Describe an icon, Claude returns three Material Symbols options
 * (validated against the standard set) shown as a ChoiceGroup of icon + name.
 * Selecting one surfaces its icon-usage guidance (or a caution if it isn't
 * documented); Apply writes the icon name back.
 */
export function AiIconDialog({ open, onClose, onApply, initialPrompt = '' }) {
  const [keyReady, setKeyReady] = useState(() => hasApiKey())
  const [keyInput, setKeyInput] = useState('')
  const [prompt, setPrompt] = useState(initialPrompt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [seen, setSeen] = useState([])      // names shown so far (for "3 more")
  const [selected, setSelected] = useState('')
  const [lastUsage, setLastUsage] = useState(null)

  function saveKey() {
    setApiKey(keyInput)
    if (keyInput.trim()) setKeyReady(true)
  }

  async function generate({ more = false } = {}) {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    setSelected('')
    try {
      const { icons, usage } = await suggestIcons({ description: prompt.trim(), count: 3, avoid: more ? seen : [] })
      if (!icons.length) setError("Claude didn't return valid Material Symbols. Try a different description.")
      setResults(icons)
      setLastUsage(usage)
      setSeen((prev) => Array.from(new Set([...prev, ...icons.map((i) => i.name)])))
    } catch (err) {
      setError(describeError(err))
      if (err instanceof Error && err.message === 'NO_API_KEY') setKeyReady(false)
    } finally {
      setLoading(false)
    }
  }

  function apply() {
    if (!selected) return
    onApply?.(selected)
    onClose?.()
  }

  const selectedResult = results.find((r) => r.name === selected)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Find an icon with AI"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!selected} icon="check" onClick={apply}>Apply icon</Button>
        </>
      }
    >
      <Stack gap="lg">
        {!keyReady ? (
          <Stack gap="sm">
            <Paragraph size="sm" color="muted">
              Paste an Anthropic API key to enable AI icon search. It's stored only in this browser
              (shared with AI image search). <Link href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">Get a key</Link>.
            </Paragraph>
            <TextField
              label="Anthropic API key"
              type="password"
              size="compact"
              autoComplete="off"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
            <ButtonContainer>
              <Button size="sm" disabled={!keyInput.trim()} onClick={saveKey}>Save key</Button>
            </ButtonContainer>
          </Stack>
        ) : (
          <>
            <Stack gap="sm">
              <TextField
                label="Describe the icon you want"
                size="compact"
                hint="e.g. 'shopping cart', 'settings', 'a warning', 'download'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <ButtonContainer>
                <Button size="sm" icon="auto_awesome" loading={loading} disabled={!prompt.trim()} onClick={() => generate()}>
                  {results.length ? 'Search again' : 'Find icons'}
                </Button>
                {results.length > 0 && (
                  <Button size="sm" variant="secondary" icon="refresh" loading={loading} onClick={() => generate({ more: true })}>
                    Show 3 more
                  </Button>
                )}
              </ButtonContainer>
            </Stack>

            {error && <Banner status="error" variant="inline">{error}</Banner>}

            {loading && (
              <Stack direction="row" gap="sm" align="center">
                <CircularProgress size="sm" indeterminate aria-label="Finding icons" />
                <Paragraph size="sm" color="muted">Asking Claude for icons…</Paragraph>
              </Stack>
            )}

            {!loading && lastUsage && (
              <Paragraph size="xs" color="muted">{formatUsage(lastUsage)}</Paragraph>
            )}

            {!loading && results.length > 0 && (
              <ChoiceGroup
                label="Select an icon"
                size="compact"
                columns={3}
                value={selected}
                onChange={setSelected}
                options={results.map((r) => ({ value: r.name, label: r.name, icon: r.name, subtext: r.reason }))}
              />
            )}

            {selectedResult && (
              selectedResult.guidance ? (
                <Banner status="info" variant="inline" title={`Guideline · ${selectedResult.name}`}>
                  {selectedResult.guidance}
                </Banner>
              ) : (
                <Banner status="warn" variant="inline" title={`No guideline for '${selectedResult.name}'`}>
                  This icon isn't in the icon usage guidelines — double-check it reads clearly in this context.
                </Banner>
              )
            )}
          </>
        )}
      </Stack>
    </Dialog>
  )
}
