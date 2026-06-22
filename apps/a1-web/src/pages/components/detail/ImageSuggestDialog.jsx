import { useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  CircularProgress,
  Dialog,
  Grid,
  Icon,
  Link,
  Paragraph,
  Stack,
  TextField,
  TextareaField,
} from '@gtivr4/a1-design-system-react'
import {
  describeError,
  formatUsage,
  hasApiKey,
  setApiKey,
  suggestImages,
  thumbUrl,
} from '../../../lib/aiImages.ts'

/**
 * AI image finder for the Figure configurator. Describe an image, Claude returns
 * three Unsplash thumbnails; pick one (or ask for three more / re-prompt), add an
 * optional caption, and apply it to the Figure.
 */
export function ImageSuggestDialog({ open, onClose, onApply, initialPrompt = '' }) {
  const [keyReady, setKeyReady] = useState(() => hasApiKey())
  const [keyInput, setKeyInput] = useState('')
  const [prompt, setPrompt] = useState(initialPrompt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [seen, setSeen] = useState([])         // every URL shown so far (for "3 more")
  const [selected, setSelected] = useState(-1)
  const [broken, setBroken] = useState(() => new Set())
  const [caption, setCaption] = useState('')
  const [lastUsage, setLastUsage] = useState(null)

  function reset() {
    setResults([]); setSeen([]); setSelected(-1); setBroken(new Set()); setCaption(''); setError(''); setLastUsage(null)
  }

  function handleClose() {
    onClose?.()
  }

  function saveKey() {
    setApiKey(keyInput)
    if (keyInput.trim()) setKeyReady(true)
  }

  async function generate({ more = false } = {}) {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    setSelected(-1)
    try {
      const { images, usage } = await suggestImages({
        description: prompt.trim(),
        count: 3,
        avoid: more ? seen : [],
      })
      if (!images.length) {
        setError("Claude didn’t return any images. Try a different description.")
      }
      setResults(images)
      setLastUsage(usage)
      setBroken(new Set())
      setSeen((prev) => Array.from(new Set([...prev, ...images.map((i) => i.url)])))
    } catch (err) {
      setError(describeError(err))
      if (err instanceof Error && err.message === 'NO_API_KEY') setKeyReady(false)
    } finally {
      setLoading(false)
    }
  }

  function selectImage(index) {
    if (broken.has(index)) return
    setSelected(index)
    setCaption(results[index]?.caption ?? '')
  }

  function apply() {
    const image = results[selected]
    if (!image) return
    onApply?.({ src: image.url, alt: image.alt, caption: caption.trim() })
    handleClose()
  }

  const selectedImage = selected >= 0 ? results[selected] : null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Find an image with AI"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button
            disabled={!selectedImage}
            icon="check"
            onClick={apply}
          >
            Apply image
          </Button>
        </>
      }
    >
      <Stack gap="lg">
        {!keyReady ? (
          <Stack gap="sm">
            <Paragraph size="sm" color="muted">
              Paste an Anthropic API key to enable AI image search. It’s stored only in this
              browser. <Link href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">Get a key</Link>.
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
              <TextareaField
                label="Describe the image you want"
                size="compact"
                hint="e.g. “a sunlit ceramic coffee cup on a wooden table, warm tones”"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <ButtonContainer>
                <Button
                  size="sm"
                  icon="auto_awesome"
                  loading={loading}
                  disabled={!prompt.trim()}
                  onClick={() => generate()}
                >
                  {results.length ? 'Search again' : 'Find images'}
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
                <CircularProgress size="sm" indeterminate aria-label="Finding images" />
                <Paragraph size="sm" color="muted">Asking Claude for images…</Paragraph>
              </Stack>
            )}

            {!loading && lastUsage && (
              <Paragraph size="xs" color="muted">{formatUsage(lastUsage)}</Paragraph>
            )}

            {!loading && results.length > 0 && (
              <Stack gap="sm">
                <Paragraph size="sm" color="muted">Select an image:</Paragraph>
                <Grid columns={3} gap="sm">
                  {results.map((image, index) => (
                    <button
                      key={`${image.url}-${index}`}
                      type="button"
                      className="a1-web-image-suggest__thumb"
                      data-selected={selected === index || undefined}
                      data-broken={broken.has(index) || undefined}
                      aria-pressed={selected === index}
                      aria-label={image.alt || `Image ${index + 1}`}
                      onClick={() => selectImage(index)}
                    >
                      {broken.has(index) ? (
                        <span className="a1-web-image-suggest__fallback">
                          <Icon name="broken_image" color="muted" />
                        </span>
                      ) : (
                        <img
                          className="a1-web-image-suggest__img"
                          src={thumbUrl(image.url)}
                          alt={image.alt}
                          loading="lazy"
                          onError={() => setBroken((prev) => new Set(prev).add(index))}
                        />
                      )}
                    </button>
                  ))}
                </Grid>
              </Stack>
            )}

            {selectedImage && (
              <Stack gap="sm">
                <TextField
                  label="Caption (optional)"
                  size="compact"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <Paragraph size="xs" color="muted">Alt text: {selectedImage.alt || '—'}</Paragraph>
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  )
}
