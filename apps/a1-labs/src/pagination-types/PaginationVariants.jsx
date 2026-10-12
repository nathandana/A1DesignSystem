import React, { useEffect, useId, useRef, useState } from 'react'
import { Button, IconButton, NumberField, Pagination, Paragraph, SelectField, Stack } from '@gtivr4/a1-design-system-react'
import { parsePage } from './pagination-model.js'

function PageJump({ page, totalPages, onChange, size }) {
  const [draft, setDraft] = useState(String(page)), [error, setError] = useState('')
  const input = useRef(null), errorId = useId()
  useEffect(() => { setDraft(String(page)); setError('') }, [page, totalPages])
  const submit = event => {
    event.preventDefault()
    const next = parsePage(draft, totalPages)
    if (next === null) { setError(`Enter a whole page number from 1 to ${totalPages}.`); input.current?.focus(); return }
    setError(''); onChange(next)
  }
  return <Stack as="form" onSubmit={submit} noValidate gap={8}>
    <Stack direction="row" wrap align="end" gap={8}>
      <NumberField ref={input} label="Go to page" value={draft} min={1} max={totalPages} step={1} size="compact" inputMode="numeric" aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} onChange={event => { setDraft(event.target.value); setError('') }} />
      <Button type="submit" variant="secondary" size={size}>Go</Button>
    </Stack>
    {error && <Paragraph size="sm" id={errorId} role="alert">{error}</Paragraph>}
  </Stack>
}

/** Controlled, shell-independent alternatives to A1 page navigation. */
export function PaginationVariants({ variant = 'compact', page, totalPages, pageSize, totalRows, size = 'md', onChange }) {
  const previous = <Button variant="tertiary" size={size} icon="chevron_left" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button>
  const next = <Button variant="tertiary" size={size} icon="chevron_right" iconPosition="end" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</Button>
  const position = <Paragraph size="sm">Page {page} of {totalPages}</Paragraph>
  const numbers = <Pagination page={page} totalPages={totalPages} onChange={onChange} size={size} />
  if (variant === 'a1') return numbers
  // The hybrid contains the real A1 navigation landmark, so it needs no outer nav.
  if (variant === 'hybrid') return <Stack gap={12}>
    {numbers}
    <PageJump page={page} totalPages={totalPages} onChange={onChange} size={size} />
  </Stack>
  return <Stack as="nav" aria-label="Pagination" gap={12}>
    <Stack direction="row" wrap align="center" gap={8}>
      {variant === 'bookends' && <IconButton label="First page" icon="first_page" size={size} variant="tertiary" disabled={page <= 1} onClick={() => onChange(1)} />}
      {previous}
      {variant === 'select' ? <SelectField label="Page" size="compact" value={page} onChange={event => onChange(Number(event.target.value))}>
        {Array.from({ length: totalPages }, (_, index) => { const value = index + 1; return <option key={value} value={value}>Page {value} · rows {index * pageSize + 1}–{Math.min(value * pageSize, totalRows)}</option> })}
      </SelectField> : position}
      {next}
      {variant === 'bookends' && <IconButton label="Last page" icon="last_page" size={size} variant="tertiary" disabled={page >= totalPages} onClick={() => onChange(totalPages)} />}
    </Stack>
    {variant === 'jump' && <PageJump page={page} totalPages={totalPages} onChange={onChange} size={size} />}
  </Stack>
}
