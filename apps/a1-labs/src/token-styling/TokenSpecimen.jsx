import React from 'react'
import { Code } from '@gtivr4/a1-design-system-react'
import './token-styling.css'
import { tokenParts } from './token-options.js'
export const tokenTreatments = [
  { value: 'syntax', label: 'Syntax highlighting', description: 'Color distinguishes level, type, group and name.' },
  { value: 'default', label: 'A1 code', description: 'The existing inline Code component.' },
  { value: 'pill', label: 'Soft pill', description: 'A compact surface with fully rounded ends.' },
  { value: 'outline', label: 'Outlined', description: 'A light boundary with an unfilled background.' },
  { value: 'namespace', label: 'Namespace emphasis', description: 'A quieter namespace and a stronger final token name.' },
  { value: 'swatch', label: 'Swatch led', description: 'Color tokens carry a sample; other tokens retain a neutral marker.' },
  { value: 'stacked', label: 'Name and value', description: 'The token name with its resolved value below.' },
]
/** Noninteractive token reference. Copy/select behavior belongs to the host. */
export function TokenSpecimen({ token, value, treatment = 'default', color = false }) {
  const split = token.lastIndexOf('-'), prefix = token.slice(0, split + 1), name = token.slice(split + 1)
  if (treatment === 'default') return <Code wrapping>{token}</Code>
  return <span className="a1-token-label" data-treatment={treatment} style={color ? { '--a1-token-label-swatch': `var(${token})` } : undefined}>
    {treatment === 'swatch' && <span className="a1-token-label__swatch" aria-hidden="true" />}
    <code className="a1-token-label__name">{treatment === 'syntax' ? tokenParts(token).map((part, index) => <span key={index} className={`a1-token-label__${part.role}`}>{part.text}</span>) : treatment === 'namespace' ? <><span className="a1-token-label__namespace">{prefix}</span><strong>{name}</strong></> : token}</code>
    {treatment === 'stacked' && <span className="a1-token-label__value">{value}</span>}
  </span>
}
