import React, { useState } from 'react'
import { Button, Card, Heading, Inset, Paragraph, Section, Stack, TextareaField, TextField } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { ThinkingTerminal } from './ThinkingTerminal.jsx'
import { defaultLines } from './default-lines.js'
import { characters, normalizeLines } from './thinking-model.js'

export function ThinkingTerminalExperiment({ experiment, onOpenSettings }) {
  const [draftLines, setDraftLines] = useState(defaultLines.join('\n'))
  const [lines, setLines] = useState(defaultLines)
  const [prompt, setPrompt] = useState('Help me plan a thoroughly improbable quest.')
  const [message, setMessage] = useState(prompt)
  const [thinking, setThinking] = useState(true)
  const [paused, setPaused] = useState(false)
  const [session, setSession] = useState(0)
  const candidates = normalizeLines(draftLines.split('\n'))
  const error = !candidates.length ? 'Add at least one thinking line.'
    : candidates.length > 20 ? 'Use up to 20 different lines.'
    : candidates.some(line => characters(line).length > 160) ? 'Keep each line to 160 characters or fewer.' : undefined
  const restart = () => { setSession(value => value + 1); setThinking(true); setPaused(false) }
  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <Stack direction="row" wrap gap={8}>
          <Button variant="tertiary" size="sm" disabled={!thinking} onClick={() => setPaused(value => !value)}>
            {paused ? 'Resume animation' : 'Stop animation'}
          </Button>
          <Button variant="tertiary" size="sm" disabled={!thinking} onClick={() => setThinking(false)}>Finish thinking</Button>
        </Stack>
        <TextareaField label="Thinking lines" rows="lg" value={draftLines} maxLength={4000}
          onChange={event => setDraftLines(event.target.value)} error={error}
          hint="One status per line. Longer lines stay visible longer. Up to 20 lines, 160 characters each." />
        <Stack gap={8}>
          <Button disabled={Boolean(error)} onClick={() => { setLines(candidates); restart() }}>Apply lines</Button>
          <Button variant="tertiary" onClick={() => { setDraftLines(defaultLines.join('\n')); setLines(defaultLines); restart() }}>Reset lines</Button>
        </Stack>
        <Paragraph size="sm" color="muted">Lines are chosen randomly without repeating the previous line. This is a simulated chat; no messages are sent.</Paragraph>
      </Stack>
    </Inset>
  )
  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="sm">
        <Stack gap={24} className="a1-thinking-terminal-demo">
          <Stack gap={4}>
            <Heading as="h2" size="md">Quest assistant</Heading>
            <Paragraph size="sm" color="muted">Simulated chat</Paragraph>
          </Stack>
          <Card>
            <Stack gap={8}>
              <Paragraph size="sm" weight="medium">You</Paragraph>
              <Paragraph>{message}</Paragraph>
            </Stack>
          </Card>
          <Stack gap={12}>
            <Paragraph size="sm" weight="medium">Assistant</Paragraph>
            {thinking && <ThinkingTerminal key={session} lines={lines} paused={paused} />}
            <Paragraph role="status" aria-live="polite" aria-atomic="true">
              {!thinking ? 'Your quest is ready: pack a map, choose a companion and leave room for a very unlikely detour.' : ''}
            </Paragraph>
          </Stack>
          <Stack as="form" gap={12} aria-label="Chat message" onSubmit={event => { event.preventDefault(); if (prompt.trim()) { setMessage(prompt.trim()); restart() } }}>
            <TextField label="Message" value={prompt} maxLength={500} onChange={event => setPrompt(event.target.value)} />
            <Stack direction="row" justify="end"><Button type="submit" icon="arrow_upward" disabled={!prompt.trim()}>Send message</Button></Stack>
          </Stack>
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
