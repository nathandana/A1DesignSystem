import { useEffect, useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  ChoiceGroup,
  CircularProgress,
  Dialog,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { suggestIcons } from '../../../lib/aiIcons.ts'
import { checkLocalCodexBridge } from '../../../lib/localCodex.ts'
import { useT } from '../../../labels/useT.js'

/**
 * AI icon finder. Describe an icon, the local Codex bridge suggests built-in
 * Material Symbols and active-project custom options shown as a ChoiceGroup of icon + name.
 * Selecting one surfaces its icon-usage guidance (or a caution if it isn't
 * documented); Apply writes the icon name back.
 */
export function AiIconDialog({ open, onClose, onApply, initialPrompt = '', customIcons = [] }) {
  const t = useT()
  const [prompt, setPrompt] = useState(initialPrompt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [seen, setSeen] = useState([])      // names shown so far (for "3 more")
  const [selected, setSelected] = useState('')
  const [lastUsage, setLastUsage] = useState(null)
  const [bridgeReady, setBridgeReady] = useState(null)
  const [checkingBridge, setCheckingBridge] = useState(false)

  async function checkBridge() {
    setCheckingBridge(true)
    try {
      setBridgeReady(await checkLocalCodexBridge())
    } finally {
      setCheckingBridge(false)
    }
  }

  useEffect(() => {
    if (open) checkBridge()
  }, [open])

  function usageText(usage) {
    if (!usage) return ''
    if (usage.source === 'codex') {
      const base = t('app.editor.iconAiUsageCodex', 'Suggested locally through Codex in {seconds}s.')
        .replace('{seconds}', (usage.elapsedMs / 1000).toFixed(1))
      if (!usage.codexUsageReported) {
        return `${base} ${t('app.editor.codexTokenUsageUnavailable', 'Token usage was not reported for this turn.')}`
      }
      return `${base} ${t('app.editor.codexTokenUsage', '{total} tokens ({input} in / {output} out).')
        .replace('{total}', String(usage.totalTokens ?? usage.inputTokens + usage.outputTokens))
        .replace('{input}', String(usage.inputTokens))
        .replace('{output}', String(usage.outputTokens))}`
    }
    return ''
  }

  function describeError() {
    return t('app.editor.iconAiErrorGeneric', 'Could not find icons. Start the Codex bridge locally and try again.')
  }

  async function generate({ more = false } = {}) {
    if (!prompt.trim() || bridgeReady === false || loading) return
    setLoading(true)
    setError('')
    setSelected('')
    try {
      const { icons, usage } = await suggestIcons({ description: prompt.trim(), count: 3, avoid: more ? seen : [], customIcons })
      if (!icons.length) setError(t('app.editor.iconAiNoResults', 'No matching built-in or custom icons were found. Try a different description.'))
      setResults(icons)
      setLastUsage(usage)
      setSeen((prev) => Array.from(new Set([...prev, ...icons.map((i) => i.name)])))
    } catch {
      setError(describeError())
    } finally {
      setLoading(false)
    }
  }

  function apply() {
    if (!selected) return
    onApply?.(selected)
    onClose?.()
  }

  function handlePromptKeyDown(event) {
    if (event.key !== 'Enter') return
    event.preventDefault()
    generate()
  }

  const selectedResult = results.find((r) => r.name === selected)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('app.editor.iconAiTitle', 'Find an icon with AI')}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t('app.editor.iconAiCancel', 'Cancel')}</Button>
          <Button disabled={!selected} icon="check" onClick={apply}>{t('app.editor.iconAiApply', 'Apply icon')}</Button>
        </>
      }
    >
      <Stack gap="lg">
        <Stack gap="sm">
          <Paragraph size="sm" color="muted">
            {t('app.editor.iconAiDescription', 'Describe the intent and A1 will ask your local Codex bridge for matching built-in and project custom icons. Returned names are validated before they appear here.')}
          </Paragraph>
          {bridgeReady === true && (
            <Banner status="success" variant="inline">
              {t('app.editor.iconAiBridgeReady', 'Codex bridge is running.')}
            </Banner>
          )}
          {bridgeReady === false && (
            <Banner status="warn" variant="inline">
              {t('app.editor.iconAiBridgeMissing', 'Codex bridge is not running. Start it with npm run codex:bridge:a1-web.')}
            </Banner>
          )}
        </Stack>

        <>
            <Stack gap="sm">
              <TextField
                label={t('app.editor.iconAiPromptLabel', 'Describe the icon you want')}
                size="compact"
                hint={t('app.editor.iconAiPromptHint', 'e.g. shopping cart, settings, a warning, download')}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handlePromptKeyDown}
              />
              <ButtonContainer>
                <Button size="sm" icon="auto_awesome" loading={loading} disabled={!prompt.trim() || bridgeReady === false} onClick={() => generate()}>
                  {results.length ? t('app.editor.iconAiSearchAgain', 'Search again') : t('app.editor.iconAiFind', 'Find icons')}
                </Button>
                {bridgeReady === false && (
                  <Button size="sm" variant="secondary" icon="sync" loading={checkingBridge} onClick={checkBridge}>
                    {t('app.editor.codexCheckBridge', 'Check bridge')}
                  </Button>
                )}
                {results.length > 0 && (
                  <Button size="sm" variant="secondary" icon="refresh" loading={loading} disabled={bridgeReady === false} onClick={() => generate({ more: true })}>
                    {t('app.editor.iconAiMore', 'Show 3 more')}
                  </Button>
                )}
              </ButtonContainer>
            </Stack>

            {error && <Banner status="error" variant="inline">{error}</Banner>}

            {loading && (
              <Stack direction="row" gap="sm" align="center">
                <CircularProgress size="sm" indeterminate aria-label={t('app.editor.iconAiFinding', 'Finding icons')} />
                <Paragraph size="sm" color="muted">{t('app.editor.iconAiFinding', 'Finding icons')}</Paragraph>
              </Stack>
            )}

            {!loading && lastUsage && (
              <Paragraph size="xs" color="muted">{usageText(lastUsage)}</Paragraph>
            )}

            {!loading && results.length > 0 && (
              <ChoiceGroup
                label={t('app.editor.iconAiSelectLabel', 'Select an icon')}
                size="compact"
                columns={3}
                value={selected}
                onChange={setSelected}
                options={results.map((r) => ({ value: r.name, label: r.name, icon: r.name, subtext: r.reason }))}
              />
            )}

            {selectedResult && (
              selectedResult.guidance ? (
                <Banner status="info" variant="inline" title={`${t('app.editor.iconAiGuidelineTitle', 'Guideline')} · ${selectedResult.name}`}>
                  {selectedResult.guidance}
                </Banner>
              ) : (
                <Banner status="warn" variant="inline" title={t('app.editor.iconAiNoGuidelineTitle', 'No guideline for this icon')}>
                  {t('app.editor.iconAiNoGuidelineBody', 'This icon is not in the icon usage guidelines. Double-check that it reads clearly in this context.')}
                </Banner>
              )
            )}
          </>
      </Stack>
    </Dialog>
  )
}
