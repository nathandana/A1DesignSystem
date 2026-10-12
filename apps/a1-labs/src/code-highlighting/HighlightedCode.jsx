import React, { useMemo, useRef } from 'react'
import { Code, codeLineIndent } from '@gtivr4/a1-design-system-react'
import { diffKind, toLines, tokenize } from './highlight.js'
import './code-highlighting.css'

export const PALETTES = [
  { value: 'full', label: 'Full color' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'mono', label: 'Monochrome' },
]
const paletteClass = palette => `a1-code-hl a1-code-hl--${PALETTES.some(item => item.value === palette) ? palette : 'full'}`

// Returns plain strings and spans — not a component — so A1 Code can read the
// text from its children (copy, line numbers and wrapped-line measurement
// walk element props, and can't see inside another component's output).
function renderTokens(tokens) {
  return tokens.map((token, index) => (token.type === 'plain'
    ? token.text
    : <span key={index} className={`a1-code-hl__token--${token.type}`}>{token.text}</span>))
}

// Candidate extension of A1 Code: the same component and props, with the
// children replaced by highlighted spans. Text, copy, line numbers, wrapping
// and collapse are unchanged because the spans contain exactly the source.
export function HighlightedCode({
  code = '',
  language = 'jsx',
  palette = 'full',
  highlightLines,
  diff = false,
  lineSpacing = 'default',
  variant = 'block',
  className = '',
  ...codeProps
}) {
  const lines = useMemo(() => toLines(tokenize(code, language)), [code, language])
  const sourceLines = useMemo(() => String(code).split('\n'), [code])
  const classes = [paletteClass(palette), lineSpacing === 'separated' && 'a1-code-hl--separated', className].filter(Boolean).join(' ')

  if (variant === 'inline') {
    return <Code variant="inline" className={classes} {...codeProps}>{renderTokens(lines.flat())}</Code>
  }

  return (
    <Code variant="block" className={classes} {...codeProps}>
      {lines.map((tokens, index) => {
        const kind = diff ? diffKind(sourceLines[index]) : null
        const indent = codeLineIndent(sourceLines[index])
        const lineClass = [
          'a1-code-block__line',
          'a1-code-hl__line',
          highlightLines?.has(index + 1) && 'a1-code-hl__line--highlight',
          kind && `a1-code-hl__line--${kind}`,
        ].filter(Boolean).join(' ')
        return (
          <React.Fragment key={index}>
            <span className={lineClass} style={indent ? { '--a1-code-indent': indent } : undefined}>{renderTokens(tokens)}</span>
            {index < lines.length - 1 ? '\n' : null}
          </React.Fragment>
        )
      })}
    </Code>
  )
}

// Experimental: an editable block that highlights as you type. A transparent
// textarea (the real, accessible control) sits over an aria-hidden layer.
export function LiveHighlightEditor({ value, onChange, language = 'jsx', palette = 'full', rows = 16, ...textareaProps }) {
  const layerRef = useRef(null)
  const tokens = useMemo(() => tokenize(value, language), [value, language])
  const syncScroll = event => {
    if (!layerRef.current) return
    layerRef.current.scrollTop = event.currentTarget.scrollTop
    layerRef.current.scrollLeft = event.currentTarget.scrollLeft
  }
  return (
    <div className={`a1-code-hl-editor ${paletteClass(palette)}`}>
      <pre ref={layerRef} className="a1-code-hl-editor__layer" aria-hidden="true">
        {/* A trailing newline keeps the layer as tall as the textarea's last line. */}
        <code>{renderTokens(tokens)}{'\n'}</code>
      </pre>
      <textarea
        className="a1-code-hl-editor__input"
        value={value}
        onChange={event => onChange?.(event.target.value)}
        onScroll={syncScroll}
        rows={rows}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        wrap="off"
        {...textareaProps}
      />
    </div>
  )
}
