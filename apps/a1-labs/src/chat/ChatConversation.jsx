import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Avatar, Button, ButtonContainer, Paragraph, Stack, TextareaField } from '@gtivr4/a1-design-system-react'
import './chat.css'

function ChatMessage({ message }) {
  const [animate, setAnimate] = useState(Boolean(message.motion && message.motion !== 'instant'))
  useEffect(() => {
    const queries = ['(prefers-reduced-motion: reduce)', '(forced-colors: active)'].map(value => matchMedia(value))
    const stop = () => { if (queries.some(query => query.matches)) setAnimate(false) }
    stop(); queries.forEach(query => query.addEventListener('change', stop))
    return () => queries.forEach(query => query.removeEventListener('change', stop))
  }, [])
  return <Stack gap={8} className="a1-chat-study__message" data-sender={message.sender}
    data-motion={animate ? message.motion : undefined} data-duration={message.duration}
    onAnimationEnd={() => setAnimate(false)}>
    <Stack direction="row" align="center" gap={8}>
      <Avatar name={message.name} alt="" size="xs" />
      <Paragraph size="sm" weight="medium">{message.name}</Paragraph>
    </Stack>
    <div className="a1-chat-study__body"><Paragraph>{message.text}</Paragraph></div>
  </Stack>
}

/** Presentation/composer only. The host owns delivery, messages and reply timing. */
export function ChatConversation({ messages, onSend, treatment = 'bubbles', typing = '', resetKey = 0 }) {
  const [draft, setDraft] = useState('Can we try a different animation?')
  const transcript = useRef(null), atBottom = useRef(true), forceBottom = useRef(false)
  const jump = () => { const node = transcript.current; if (node) node.scrollTop = node.scrollHeight; atBottom.current = true }
  useLayoutEffect(() => { if (atBottom.current || forceBottom.current) jump(); forceBottom.current = false }, [messages])
  useEffect(() => { setDraft('Can we try a different animation?'); jump() }, [resetKey])
  const send = () => {
    const text = draft.trim()
    if (!text) return
    forceBottom.current = true; onSend(text); setDraft('')
  }
  return <Stack gap={16} className="a1-chat-study" data-style={treatment}>
    <div ref={transcript} className="a1-chat-study__log" role="log" aria-label="Conversation"
      aria-live="polite" aria-relevant="additions" aria-atomic="false" tabIndex={0}
      onScroll={event => { const node = event.currentTarget; atBottom.current = node.scrollHeight - node.scrollTop - node.clientHeight <= 1 }}>
      <Stack gap={16}>{messages.map(message => <ChatMessage key={message.id} message={message} />)}</Stack>
    </div>
    <Stack direction="row" align="center" justify="between" gap={8}>
      <Paragraph size="sm" color="muted" role="status" aria-live="polite" aria-atomic="true">{typing ? `${typing} is typing…` : 'Ready for your next message.'}</Paragraph>
      <Button variant="tertiary" size="sm" onClick={jump}>Latest messages</Button>
    </Stack>
    <Stack as="form" gap={12} aria-label="Send a chat message" onSubmit={event => { event.preventDefault(); send() }}>
      <TextareaField label="Message" rows="sm" value={draft} maxLength={1000}
        hint="Enter to send. Shift + Enter for a new line."
        onChange={event => setDraft(event.target.value)} onKeyDown={event => {
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); if (!event.repeat) send() }
        }} />
      <ButtonContainer align="start"><Button type="submit" icon="send" disabled={!draft.trim()}>Send message</Button></ButtonContainer>
    </Stack>
  </Stack>
}
