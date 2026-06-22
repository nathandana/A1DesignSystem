import { useEffect, useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  CircularProgress,
  Code,
  Dialog,
  Link,
  Paragraph,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { describeError, formatUsage, hasApiKey, setApiKey } from '../../../lib/aiImages.ts'
import { generateImagePrompt } from '../../../lib/aiImagePrompt.ts'

/**
 * "Generate with AI" (prompt-only). Describe the image; Claude writes a detailed,
 * project-aware image-generation prompt to copy into the generator of your choice.
 * Anthropic's API has no image model, so this produces a prompt, not pixels.
 */
export function ImageGenerateDialog({ open, onClose, initialDescription = '', styleContext }) {
  const [keyReady, setKeyReady] = useState(() => hasApiKey())
  const [keyInput, setKeyInput] = useState('')
  const [description, setDescription] = useState(initialDescription)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [prompt, setPrompt] = useState('')
  const [lastUsage, setLastUsage] = useState(null)

  useEffect(() => { if (open) { setDescription(initialDescription); setPrompt(''); setError(''); setLastUsage(null) } }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function saveKey() {
    setApiKey(keyInput)
    if (keyInput.trim()) setKeyReady(true)
  }

  async function generate() {
    if (!description.trim()) return
    setLoading(true)
    setError('')
    try {
      const { prompt: generated, usage } = await generateImagePrompt({ description: description.trim(), styleContext })
      setPrompt(generated || "Claude didn’t return a prompt. Try rephrasing.")
      setLastUsage(usage)
    } catch (err) {
      setError(describeError(err))
      if (err instanceof Error && err.message === 'NO_API_KEY') setKeyReady(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Generate an image prompt with AI"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <Stack gap="lg">
        <Banner status="info" variant="inline" title="Prompt, not pixels">
          Claude writes a detailed image-generation prompt from your description — copy it into Midjourney,
          DALL·E, or any image generator. (Anthropic’s API doesn’t generate images directly.)
        </Banner>

        {!keyReady ? (
          <Stack gap="sm">
            <Paragraph size="sm" color="muted">
              Paste an Anthropic API key to use AI prompt generation. It’s stored only in this browser
              (shared with the other AI tools). <Link href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">Get a key</Link>.
            </Paragraph>
            <TextField label="Anthropic API key" type="password" size="compact" autoComplete="off" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} />
            <ButtonContainer>
              <Button size="sm" disabled={!keyInput.trim()} onClick={saveKey}>Save key</Button>
            </ButtonContainer>
          </Stack>
        ) : (
          <>
            <TextareaField
              label="Describe the image you want"
              size="compact"
              rows="sm"
              hint="e.g. “a friendly robot helping a child plant a tree, warm morning light”"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <ButtonContainer>
              <Button size="sm" icon="auto_awesome" loading={loading} disabled={!description.trim()} onClick={generate}>
                {prompt ? 'Regenerate prompt' : 'Write prompt'}
              </Button>
            </ButtonContainer>

            {error && <Banner status="error" variant="inline">{error}</Banner>}

            {loading && (
              <Stack direction="row" gap="sm" align="center">
                <CircularProgress size="sm" indeterminate aria-label="Writing prompt" />
                <Paragraph size="sm" color="muted">Writing a prompt…</Paragraph>
              </Stack>
            )}

            {!loading && prompt && (
              <Stack gap="xs">
                <Paragraph size="sm" color="muted">Copy this into your image generator:</Paragraph>
                <Code variant="block" wrapping copyCode>{prompt}</Code>
                {lastUsage && <Paragraph size="xs" color="muted">{formatUsage(lastUsage)}</Paragraph>}
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  )
}
