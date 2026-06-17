import {
  Code,
  Paragraph,
  Stack,
  TextareaField,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'

const SAMPLE_MARKDOWN = 'Example paragraph with **bold** and *italic*, `code`, ==marked text==, [kbd:⌘K], [abbr:CSS|Cascading Style Sheets], [cite:A1 Design System], [q:semantic text], [time:2026-06-15|June 15, 2026], ~~removed text~~, ++inserted text++, __underlined text__, [small:fine print], H[sub:2]O, x[sup:2], [samp:Error: missing token], [var:width], [muted:muted text], and [accent:accent text].'

const INLINE_EXAMPLES = [
  { value: 'all', label: 'All', markdown: SAMPLE_MARKDOWN },
  { value: 'strong', label: 'strong', markdown: 'Use **strong importance** for content that should carry semantic importance.' },
  { value: 'b', label: 'b', markdown: 'Use [b:stylistic bold] when text is visually offset without added importance.' },
  { value: 'em', label: 'em', markdown: 'Use *emphasis* for words that change the stress or meaning of a sentence.' },
  { value: 'i', label: 'i', markdown: 'Use [i:alternate voice] for a term, idiom, or technical designation.' },
  { value: 'u', label: 'u', markdown: 'Use __underlined text__ only when an underline has a clear non-link meaning.' },
  { value: 's', label: 's', markdown: 'Use [s:no longer accurate] for information that is no longer relevant.' },
  { value: 'del', label: 'del', markdown: 'Use ~~deleted text~~ for removed or changed content.' },
  { value: 'ins', label: 'ins', markdown: 'Use ++inserted text++ for content that was added.' },
  { value: 'mark', label: 'mark', markdown: 'Use ==highlighted text== for search hits or marked passages.' },
  { value: 'small', label: 'small', markdown: 'Use [small:fine print] for side comments or legal-style notes.' },
  { value: 'sub', label: 'sub', markdown: 'Chemical formulas can use H[sub:2]O.' },
  { value: 'sup', label: 'sup', markdown: 'Mathematical notation can use x[sup:2].' },
  { value: 'abbr', label: 'abbr', markdown: 'Use [abbr:CSS|Cascading Style Sheets] when an abbreviation needs expansion.' },
  { value: 'cite', label: 'cite', markdown: 'Reference [cite:The Elements of Typographic Style] with cite text.' },
  { value: 'q', label: 'q', markdown: 'Use [q:semantic text should stay meaningful] for inline quotations.' },
  { value: 'time', label: 'time', markdown: 'Publish on [time:2026-06-15|June 15, 2026].' },
  { value: 'code', label: 'code', markdown: 'Set `--semantic-color-text-default` in your CSS.' },
  { value: 'kbd', label: 'kbd', markdown: 'Press [kbd:⌘K] to open the command palette.' },
  { value: 'samp', label: 'samp', markdown: 'The terminal returned [samp:Error: missing token].' },
  { value: 'var', label: 'var', markdown: 'The function accepts [var:width] and [var:height].' },
  { value: 'muted', label: 'muted', markdown: 'Use [muted:muted text] for lower-emphasis inline content.' },
  { value: 'accent', label: 'accent', markdown: 'Use [accent:accent text] for inline text that needs action color.' },
]

const INLINE_PATTERNS = [
  { type: 'strong', regex: /\*\*([^*\n]+?)\*\*/ },
  { type: 'code', regex: /`([^`\n]+?)`/ },
  { type: 'mark', regex: /==([^=\n]+?)==/ },
  { type: 'del', regex: /~~([^~\n]+?)~~/ },
  { type: 'ins', regex: /\+\+([^+\n]+?)\+\+/ },
  { type: 'u', regex: /__([^_\n]+?)__/ },
  { type: 'b', regex: /\[b:([^\]\n]+?)\]/ },
  { type: 'i', regex: /\[i:([^\]\n]+?)\]/ },
  { type: 's', regex: /\[s:([^\]\n]+?)\]/ },
  { type: 'abbr', regex: /\[abbr:([^|\]\n]+?)\|([^\]\n]+?)\]/ },
  { type: 'time', regex: /\[time:([^|\]\n]+?)\|([^\]\n]+?)\]/ },
  { type: 'kbd', regex: /\[kbd:([^\]\n]+?)\]/ },
  { type: 'cite', regex: /\[cite:([^\]\n]+?)\]/ },
  { type: 'q', regex: /\[q:([^\]\n]+?)\]/ },
  { type: 'small', regex: /\[small:([^\]\n]+?)\]/ },
  { type: 'sub', regex: /\[sub:([^\]\n]+?)\]/ },
  { type: 'sup', regex: /\[sup:([^\]\n]+?)\]/ },
  { type: 'samp', regex: /\[samp:([^\]\n]+?)\]/ },
  { type: 'var', regex: /\[var:([^\]\n]+?)\]/ },
  { type: 'muted', regex: /\[muted:([^\]\n]+?)\]/ },
  { type: 'accent', regex: /\[accent:([^\]\n]+?)\]/ },
  { type: 'em', regex: /\*([^*\n]+?)\*/ },
]

function escapeJsxText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('{', '&#123;')
    .replaceAll('}', '&#125;')
}

function escapeAttr(value) {
  return escapeJsxText(value).replaceAll('"', '&quot;')
}

function parseInlineMarkdown(value) {
  const tokens = []
  let remaining = String(value ?? '')

  while (remaining.length > 0) {
    let nextMatch = null
    let nextPattern = null

    for (const pattern of INLINE_PATTERNS) {
      const match = pattern.regex.exec(remaining)
      if (!match) continue
      if (!nextMatch || match.index < nextMatch.index) {
        nextMatch = match
        nextPattern = pattern
      }
    }

    if (!nextMatch || !nextPattern) {
      tokens.push({ type: 'text', text: remaining })
      break
    }

    if (nextMatch.index > 0) {
      tokens.push({ type: 'text', text: remaining.slice(0, nextMatch.index) })
    }

    tokens.push({
      type: nextPattern.type,
      text: nextPattern.type === 'time' ? nextMatch[2] : nextMatch[1],
      value: nextPattern.type === 'abbr' ? nextMatch[2] : nextMatch[1],
    })

    remaining = remaining.slice(nextMatch.index + nextMatch[0].length)
  }

  return tokens
}

function renderToken(token, index) {
  switch (token.type) {
    case 'strong': return <strong key={index}>{token.text}</strong>
    case 'b': return <b key={index}>{token.text}</b>
    case 'em': return <em key={index}>{token.text}</em>
    case 'i': return <i key={index}>{token.text}</i>
    case 'code': return <Code key={index}>{token.text}</Code>
    case 'mark': return <mark key={index}>{token.text}</mark>
    case 's': return <s key={index}>{token.text}</s>
    case 'del': return <del key={index}>{token.text}</del>
    case 'ins': return <ins key={index}>{token.text}</ins>
    case 'u': return <u key={index}>{token.text}</u>
    case 'abbr': return <abbr key={index} title={token.value}>{token.text}</abbr>
    case 'time': return <time key={index} dateTime={token.value}>{token.text}</time>
    case 'kbd': return <kbd key={index}>{token.text}</kbd>
    case 'cite': return <cite key={index}>{token.text}</cite>
    case 'q': return <q key={index}>{token.text}</q>
    case 'small': return <small key={index}>{token.text}</small>
    case 'sub': return <sub key={index}>{token.text}</sub>
    case 'sup': return <sup key={index}>{token.text}</sup>
    case 'samp': return <samp key={index}>{token.text}</samp>
    case 'var': return <var key={index}>{token.text}</var>
    case 'muted': return <span key={index} className="a1-muted">{token.text}</span>
    case 'accent': return <span key={index} className="a1-accent">{token.text}</span>
    default: return token.text
  }
}

function tokenSnippet(token) {
  const text = escapeJsxText(token.text)

  switch (token.type) {
    case 'strong': return `<strong>${text}</strong>`
    case 'b': return `<b>${text}</b>`
    case 'em': return `<em>${text}</em>`
    case 'i': return `<i>${text}</i>`
    case 'code': return `<Code>${text}</Code>`
    case 'mark': return `<mark>${text}</mark>`
    case 's': return `<s>${text}</s>`
    case 'del': return `<del>${text}</del>`
    case 'ins': return `<ins>${text}</ins>`
    case 'u': return `<u>${text}</u>`
    case 'abbr': return `<abbr title="${escapeAttr(token.value)}">${text}</abbr>`
    case 'time': return `<time dateTime="${escapeAttr(token.value)}">${text}</time>`
    case 'kbd': return `<kbd>${text}</kbd>`
    case 'cite': return `<cite>${text}</cite>`
    case 'q': return `<q>${text}</q>`
    case 'small': return `<small>${text}</small>`
    case 'sub': return `<sub>${text}</sub>`
    case 'sup': return `<sup>${text}</sup>`
    case 'samp': return `<samp>${text}</samp>`
    case 'var': return `<var>${text}</var>`
    case 'muted': return `<span className="a1-muted">${text}</span>`
    case 'accent': return `<span className="a1-accent">${text}</span>`
    default: return escapeJsxText(token.text)
  }
}

function buildInlineSnippet(config) {
  const tokens = parseInlineMarkdown(config.children || SAMPLE_MARKDOWN)
  return `<Paragraph>\n  ${tokens.map(tokenSnippet).join('')}\n</Paragraph>`
}

export function getDefaultConfig() {
  return {
    inlineElement: 'all',
    children: SAMPLE_MARKDOWN,
  }
}

export function Preview({ config }) {
  const tokens = parseInlineMarkdown(config.children || SAMPLE_MARKDOWN)
  return (
    <Paragraph>
      {tokens.map(renderToken)}
    </Paragraph>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <Choice
        label="Element"
        size="compact"
        hideIndicator
        columns={3}
        value={config.inlineElement}
        onChange={(inlineElement) => {
          const example = INLINE_EXAMPLES.find((item) => item.value === inlineElement)
          setConfig((current) => ({
            ...current,
            inlineElement,
            children: example?.markdown ?? current.children,
          }))
        }}
        options={INLINE_EXAMPLES.map((item) => ({ label: item.label, value: item.value }))}
      />
      <TextareaField
        label="Markdown"
        hint="Use **bold**, [b:bold], *italic*, [i:italic], `code`, ==mark==, [s:struck], ~~delete~~, ++insert++, __underline__, [kbd:⌘K], [abbr:CSS|Cascading Style Sheets], [cite:Title], [q:quote], [time:2026-06-15|June 15, 2026], [sub:2], [sup:2], [muted:text], or [accent:text]."
        size="compact"
        rows={10}
        value={config.children}
        onChange={(event) => setConfig((current) => ({ ...current, children: event.target.value }))}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildInlineSnippet(config)}</Code>
}
