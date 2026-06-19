import { useEffect, useRef, useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  CircularProgress,
  Link,
  Paragraph,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { hasApiKey, setApiKey } from '../lib/aiImages.ts'
import { describeError, editPage } from '../lib/aiPage.ts'

/**
 * AI page editor chat. Describe a change in plain language; Claude is sent the
 * live page JSON plus the A1 agent brief and returns an updated page definition,
 * which is applied to the canvas as one undoable step (`onApplyDefinition`).
 *
 * `definition` is the current parsed PageDefinition (or null when the editor JSON
 * is invalid — the chat is disabled until that's fixed). The transcript keeps the
 * short (instruction → reply) turns for conversational context; the live page is
 * always sent fresh, so manual edits between turns are respected.
 */
export function EditorChatPanel({ definition, onApplyDefinition, requestFocus = false, onFocusHandled }) {
  const [keyReady, setKeyReady] = useState(() => hasApiKey())
  const [keyInput, setKeyInput] = useState('')
  const [messages, setMessages] = useState([]) // { role: 'user'|'assistant', text, error? }
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const transcriptRef = useRef(null)
  const inputRef = useRef(null)

  // Keep the latest message in view.
  useEffect(() => {
    const el = transcriptRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  // One-shot focus of the prompt when "Make with AI" opened the page. The panel
  // only mounts when the AI tab is active, so the textarea is in the DOM here; a
  // rAF lets the tab transition settle before focusing.
  useEffect(() => {
    if (!requestFocus) return
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus()
      onFocusHandled?.()
    })
    return () => cancelAnimationFrame(id)
  }, [requestFocus]) // eslint-disable-line react-hooks/exhaustive-deps

  function saveKey() {
    setApiKey(keyInput)
    if (keyInput.trim()) setKeyReady(true)
  }

  async function send() {
    const instruction = input.trim()
    if (!instruction || loading) return
    if (!definition) return

    // Prior turns (successful only) become the conversational context.
    const priorTurns = messages
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role, text: m.text }))

    setMessages((prev) => [...prev, { role: 'user', text: instruction }])
    setInput('')
    setLoading(true)

    try {
      const { message, page } = await editPage({
        instruction,
        currentPage: definition,
        history: priorTurns,
      })
      onApplyDefinition?.(page, `AI: ${instruction.length > 40 ? `${instruction.slice(0, 40)}…` : instruction}`)
      setMessages((prev) => [...prev, { role: 'assistant', text: message }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: describeError(err), error: true }])
      if (err instanceof Error && err.message === 'NO_API_KEY') setKeyReady(false)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(event) {
    // Enter sends; Shift+Enter inserts a newline.
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  if (!keyReady) {
    return (
      <Stack gap="sm">
        <Paragraph size="sm" color="muted">
          Paste an Anthropic API key to enable the AI page editor. It’s stored only in this browser
          (shared with the AI image and icon tools).{' '}
          <Link href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">Get a key</Link>.
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
    )
  }

  return (
    <Stack gap="sm">
      <Paragraph size="xs" color="muted">
        Describe a change to the whole page. Claude knows the A1 components and JSON format, and
        applies its result to the canvas as a single undoable step.
      </Paragraph>

      {!definition && (
        <Banner status="warn" variant="inline">
          Fix the page JSON before using the AI editor — the current definition can’t be parsed.
        </Banner>
      )}

      <div
        className="a1-web-chat__transcript"
        ref={transcriptRef}
        role="log"
        aria-live="polite"
        aria-label="AI page editor conversation"
      >
        {messages.length === 0 && !loading && (
          <Paragraph size="xs" color="muted" className="a1-web-chat__empty">
            e.g. “Add a hero section with a heading and a primary call-to-action”, “Turn the three
            cards into a grid”, or “Make the page use the contact form pattern”.
          </Paragraph>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`a1-web-chat__msg a1-web-chat__msg--${m.role}${m.error ? ' a1-web-chat__msg--error' : ''}`}
          >
            <Paragraph size="sm">{m.text}</Paragraph>
          </div>
        ))}
        {loading && (
          <div className="a1-web-chat__msg a1-web-chat__msg--assistant">
            <Stack direction="row" gap="sm" align="center">
              <CircularProgress size="sm" indeterminate aria-label="Editing the page" />
              <Paragraph size="sm" color="muted">Editing the page…</Paragraph>
            </Stack>
          </div>
        )}
      </div>

      <TextareaField
        ref={inputRef}
        label="Your instruction"
        size="compact"
        rows="sm"
        value={input}
        disabled={loading || !definition}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <ButtonContainer>
        <Button
          size="sm"
          icon="auto_awesome"
          loading={loading}
          disabled={!input.trim() || !definition}
          onClick={send}
        >
          Send
        </Button>
      </ButtonContainer>
    </Stack>
  )
}
