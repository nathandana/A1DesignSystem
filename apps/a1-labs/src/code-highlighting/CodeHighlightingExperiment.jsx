import React, { useMemo, useState } from 'react'
import { Code, Heading, Inset, Paragraph, Section, Stack, Switch, TextField, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { HighlightedCode, LiveHighlightEditor, PALETTES } from './HighlightedCode.jsx'
import { LANGUAGES, ROLES, parseLineRanges } from './highlight.js'
import { DIFFS, INLINE, SAMPLES } from './samples.js'

// Labs page: syntax highlighting as an extension of A1 Code. The block is the
// real Code component; the page only chooses the source and options.

const INLINE_PROSE = {
  jsx: ['Multiply the count with', 'before rendering the badge.'],
  css: ['Space the chips with', 'so they follow the spacing scale.'],
  html: ['Link to the guide with', 'rather than a button.'],
  json: ['The feature flag reads', 'from the remote config.'],
}

export function CodeHighlightingExperiment({ experiment, onOpenSettings }) {
  const [language, setLanguage] = useState('jsx')
  const [palette, setPalette] = useState('full')
  const [lineNumbers, setLineNumbers] = useState(true)
  const [wrapping, setWrapping] = useState(false)
  const [lineSpacing, setLineSpacing] = useState('default')
  const [copyCode, setCopyCode] = useState(true)
  const [collapsible, setCollapsible] = useState(false)
  const [highlight, setHighlight] = useState('')
  const [diff, setDiff] = useState(false)
  const [live, setLive] = useState(false)
  const [edits, setEdits] = useState({})
  const highlightLines = useMemo(() => parseLineRanges(highlight), [highlight])
  const source = edits[language] ?? SAMPLES[language]
  const blockOnly = live ? 'Not used while live editing.' : undefined

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <Toolbar label="Language">
          <ToolbarGroup aria-label="Language" value={language} onChange={setLanguage} showLabels options={LANGUAGES} />
        </Toolbar>
        <Toolbar label="Palette">
          <ToolbarGroup aria-label="Palette" value={palette} onChange={setPalette} showLabels options={PALETTES} />
        </Toolbar>
        <Toolbar label="Line spacing">
          <ToolbarGroup aria-label="Line spacing" value={lineSpacing} onChange={setLineSpacing} showLabels
            options={[{ value: 'default', label: 'Default' }, { value: 'separated', label: 'Separated' }]} />
        </Toolbar>
        <TextField label="Highlight lines" size="compact" value={highlight} onChange={event => setHighlight(event.target.value)}
          hint={blockOnly ?? 'Line numbers or ranges, such as 3, 8-12.'} disabled={live} autoComplete="off" />
        <Stack gap={12}>
          <Switch label="Line numbers" checked={lineNumbers} onChange={setLineNumbers} disabled={live} />
          <Switch label="Wrap long lines" checked={wrapping} onChange={setWrapping} disabled={live} />
          <Switch label="Copy button" checked={copyCode} onChange={setCopyCode} disabled={live} />
          <Switch label="Collapse long code" checked={collapsible} onChange={setCollapsible} disabled={live} />
        </Stack>
        <Stack gap={12}>
          <Heading as="h2" size="xs">Experimental</Heading>
          <Switch label="Diff" checked={diff} onChange={setDiff} disabled={live}
            hint={blockOnly ?? 'Shows a change with added and removed lines.'} />
          <Switch label="Live editing" checked={live} onChange={setLive}
            hint="Highlights as you type. Edits are kept per language." />
        </Stack>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="lg">
        <Stack gap={40} className="a1-code-highlighting-lab">
          {live ? (
            <Stack gap={8}>
              <Heading as="h2" size="xs" id="code-hl-editor-label">Edit the {LANGUAGES.find(item => item.value === language).label}</Heading>
              <LiveHighlightEditor aria-labelledby="code-hl-editor-label" language={language} palette={palette} value={source}
                onChange={value => setEdits(previous => ({ ...previous, [language]: value }))} />
            </Stack>
          ) : (
            <HighlightedCode key={`${language}-${diff}`} code={diff ? DIFFS[language] : source} language={language} palette={palette}
              diff={diff} highlightLines={highlightLines} lineSpacing={lineSpacing} lineNumbers={lineNumbers} wrapping={wrapping} copyCode={copyCode}
              collapsible={collapsible} collapsedLines={10} />
          )}

          <Stack gap={12}>
            <Heading as="h2" size="xs">Inline</Heading>
            <Paragraph>
              {INLINE_PROSE[language][0]}{' '}
              <HighlightedCode variant="inline" code={INLINE[language]} language={language} palette={palette} />{' '}
              {INLINE_PROSE[language][1]}
            </Paragraph>
          </Stack>

          <Stack gap={12}>
            <Heading as="h2" size="xs">Token roles</Heading>
            <Stack direction="row" gap={8} wrap role="list" aria-label="Token roles in this palette">
              {ROLES.map(role => (
                <span key={role} role="listitem">
                  <Code variant="inline" className={`a1-code-hl a1-code-hl--${palette}`}>
                    <span className={`a1-code-hl__token--${role}`}>{role}</span>
                  </Code>
                </span>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
