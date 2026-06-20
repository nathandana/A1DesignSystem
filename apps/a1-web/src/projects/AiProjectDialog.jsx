import { useEffect, useRef, useState } from 'react'
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
import { hasApiKey, setApiKey } from '../lib/aiImages.ts'
import { continueProjectChat, describeError } from '../lib/aiProjectBuilder.ts'

/**
 * "Create with AI" — a short chat that gathers what the user wants, asks a few
 * clarifying questions, then returns a complete A1 project bundle which is
 * imported and opened (via `onCreated`). Uses the shared in-browser API key.
 */
export function AiProjectDialog({ open, onClose, onCreated }) {
  const [keyReady, setKeyReady] = useState(() => hasApiKey())
  const [keyInput, setKeyInput] = useState('')
  const [messages, setMessages] = useState([]) // { role, text, error? }
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [projectJson, setProjectJson] = useState('')
  const transcriptRef = useRef(null)

  useEffect(() => { if (open) { setMessages([]); setInput(''); setDone(false); setProjectJson('') } }, [open])
  useEffect(() => { const el = transcriptRef.current; if (el) el.scrollTop = el.scrollHeight }, [messages, loading])

  function saveKey() {
    setApiKey(keyInput)
    if (keyInput.trim()) setKeyReady(true)
  }

  async function send() {
    const text = input.trim()
    if (!text || loading || done) return
    const history = messages.filter((m) => !m.error).map((m) => ({ role: m.role, text: m.text }))
    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setLoading(true)
    try {
      const res = await continueProjectChat({ history, userMessage: text })
      setMessages((prev) => [...prev, { role: 'assistant', text: res.message }])
      if (res.status === 'complete' && res.project) {
        setDone(true)
        setProjectJson(JSON.stringify(res.project, null, 2))
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: describeError(err), error: true }])
      if (err instanceof Error && err.message === 'NO_API_KEY') setKeyReady(false)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create a project with AI"
      footer={<Button variant="secondary" onClick={onClose}>{done ? 'Close' : 'Cancel'}</Button>}
    >
      {!keyReady ? (
        <Stack gap="sm">
          <Paragraph size="sm" color="muted">
            Paste an Anthropic API key to use AI project creation. It’s stored only in this browser
            (shared with the other AI tools). <Link href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">Get a key</Link>.
          </Paragraph>
          <TextField label="Anthropic API key" type="password" size="compact" autoComplete="off" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} />
          <ButtonContainer>
            <Button size="sm" disabled={!keyInput.trim()} onClick={saveKey}>Save key</Button>
          </ButtonContainer>
        </Stack>
      ) : (
        <Stack gap="sm">
          <Paragraph size="xs" color="muted">
            Describe the project you want to build. Claude will ask a few questions, then create the
            pages for you.
          </Paragraph>

          <div className="a1-web-chat__transcript" ref={transcriptRef} role="log" aria-live="polite" aria-label="AI project conversation">
            {messages.length === 0 && !loading && (
              <Paragraph size="xs" color="muted" className="a1-web-chat__empty">
                e.g. “A landing site for a neighbourhood coffee shop with a menu and a contact page.”
              </Paragraph>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`a1-web-chat__msg a1-web-chat__msg--${m.role}${m.error ? ' a1-web-chat__msg--error' : ''}`}>
                <Paragraph size="sm">{m.text}</Paragraph>
              </div>
            ))}
            {loading && (
              <div className="a1-web-chat__msg a1-web-chat__msg--assistant">
                <Stack direction="row" gap="sm" align="center">
                  <CircularProgress size="sm" indeterminate aria-label="Thinking" />
                  <Paragraph size="sm" color="muted">Thinking…</Paragraph>
                </Stack>
              </div>
            )}
          </div>

          {done && projectJson ? (
            <Stack gap="xs">
              <Banner status="success" variant="inline">
                Project generated. Create it directly, or copy the JSON and paste it into <strong>Upload JSON</strong> to validate it.
              </Banner>
              <Code variant="block" wrapping copyCode>{projectJson}</Code>
              <ButtonContainer>
                <Button size="sm" icon="add" onClick={() => onCreated?.(projectJson)}>Create project</Button>
              </ButtonContainer>
            </Stack>
          ) : (
            <>
              <TextareaField
                label="Your message"
                size="compact"
                rows="sm"
                value={input}
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <ButtonContainer>
                <Button size="sm" icon="auto_awesome" loading={loading} disabled={!input.trim()} onClick={send}>Send</Button>
              </ButtonContainer>
            </>
          )}
        </Stack>
      )}
    </Dialog>
  )
}
