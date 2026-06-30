import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Heading,
  MessageBadge,
  MessageEmptyState,
  SearchField,
  Stack,
} from '@gtivr4/a1-design-system-react'
import './global-search-dialog.css'

const CLOSE_ANIMATION_MS = 150

const RELATED_TERMS = {
  a11y: ['accessibility', 'wcag', 'contrast', 'keyboard'],
  accessibility: ['a11y', 'wcag', 'contrast', 'keyboard'],
  ai: ['generate', 'compose', 'assistant'],
  asset: ['image', 'library', 'media'],
  cta: ['button', 'action', 'link'],
  dataset: ['data', 'source', 'table'],
  grid: ['layout', 'data-table', 'table'],
  iconography: ['icon', 'symbol'],
  issue: ['backlog', 'ticket', 'bug'],
  label: ['translation', 'locale', 'copy'],
  page: ['project', 'editor', 'screen'],
  rule: ['governance', 'lint', 'standard'],
  table: ['data-table', 'grid', 'rows', 'columns'],
  theme: ['token', 'color', 'brand'],
  ticket: ['backlog', 'issue', 'bug'],
  translate: ['label', 'locale', 'language'],
}

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function tokensFor(value) {
  return normalize(value).split(/\s+/).filter(Boolean)
}

function distance(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  const curr = Array.from({ length: b.length + 1 }, () => 0)
  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
    }
    for (let j = 0; j <= b.length; j += 1) prev[j] = curr[j]
  }
  return prev[b.length]
}

function expandedQueryTokens(query) {
  const base = tokensFor(query)
  const related = base.flatMap((token) => RELATED_TERMS[token] ?? [])
  return [...new Set([...base, ...related.flatMap(tokensFor)])]
}

function scoreEntry(entry, query) {
  const queryText = normalize(query)
  const queryTokens = tokensFor(query)
  const expandedTokens = expandedQueryTokens(query)
  if (!queryTokens.length) return 0

  const title = normalize(entry.title)
  const category = normalize(entry.category)
  const description = normalize(entry.description)
  const keywords = normalize((entry.keywords ?? []).join(' '))
  const haystack = `${title} ${category} ${description} ${keywords}`
  const haystackTokens = tokensFor(haystack)

  let score = 0
  if (title === queryText) score += 120
  if (title.startsWith(queryText)) score += 90
  if (title.includes(queryText)) score += 70
  if (haystack.includes(queryText)) score += 45

  for (const token of queryTokens) {
    if (title.split(' ').some((part) => part.startsWith(token))) score += 35
    if (keywords.includes(token)) score += 22
    if (description.includes(token) || category.includes(token)) score += 14
    if (haystackTokens.some((part) => part.length > 3 && token.length > 3 && distance(token, part) <= 1)) score += 18
  }

  for (const token of expandedTokens) {
    if (!queryTokens.includes(token) && haystack.includes(token)) score += 10
  }

  return score
}

function groupedResults(entries, query) {
  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 24)
    .reduce((groups, result) => {
      const category = result.entry.category || 'Results'
      const existing = groups.find((group) => group.category === category)
      if (existing) existing.results.push(result.entry)
      else groups.push({ category, results: [result.entry] })
      return groups
    }, [])
}

export function GlobalSearchDialog({ open, entries = [], onClose }) {
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [closing, setClosing] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const trimmedQuery = query.trim()
  const groups = useMemo(() => groupedResults(entries, trimmedQuery), [entries, trimmedQuery])
  const flatResults = useMemo(() => groups.flatMap((group) => group.results), [groups])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      triggerRef.current = document.activeElement
      setClosing(false)
      setQuery('')
      if (!dialog.open) dialog.showModal()
      window.setTimeout(() => inputRef.current?.focus(), 0)
    } else if (dialog.open) {
      setClosing(true)
      const timeout = window.setTimeout(() => {
        dialog.close()
        setClosing(false)
        triggerRef.current?.focus()
        triggerRef.current = null
      }, CLOSE_ANIMATION_MS)
      return () => window.clearTimeout(timeout)
    }
    return undefined
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined
    const handleCancel = (event) => {
      event.preventDefault()
      onClose?.()
    }
    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return undefined
    const onBackdrop = (event) => {
      const rect = dialog.getBoundingClientRect()
      return event.clientX < rect.left
        || event.clientX > rect.right
        || event.clientY < rect.top
        || event.clientY > rect.bottom
    }
    let downOnBackdrop = false
    const handleMouseDown = (event) => {
      downOnBackdrop = event.target === dialog && onBackdrop(event)
    }
    const handleClick = (event) => {
      if (downOnBackdrop && event.target === dialog && onBackdrop(event)) onClose?.()
      downOnBackdrop = false
    }
    dialog.addEventListener('mousedown', handleMouseDown)
    dialog.addEventListener('click', handleClick)
    return () => {
      dialog.removeEventListener('mousedown', handleMouseDown)
      dialog.removeEventListener('click', handleClick)
    }
  }, [open, onClose])

  useEffect(() => {
    setSelectedIndex(0)
  }, [trimmedQuery, flatResults.length])

  function choose(entry) {
    entry.onSelect?.()
    onClose?.()
  }

  function handleSearchKeyDown(event) {
    if (!flatResults.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((index) => Math.min(index + 1, flatResults.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((index) => Math.max(index - 1, 0))
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={['a1-global-search-dialog', closing && 'a1-global-search-dialog--closing'].filter(Boolean).join(' ')}
      aria-label="Search A1"
    >
      <Stack direction="column" gap="sm" className="a1-global-search-dialog__layout">
        <div className="a1-global-search-dialog__field">
          <SearchField
            ref={inputRef}
            size="comfortable"
            aria-label="Search A1"
            placeholder="Search A1"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            onSearch={() => {
              const selected = flatResults[selectedIndex] || flatResults[0]
              if (selected) choose(selected)
            }}
          />
        </div>

        {trimmedQuery && (
          <div className="a1-global-search-dialog__results">
            {groups.length ? (
              <Stack direction="column" gap="md">
                {groups.map((group) => (
                  <Stack key={group.category} direction="column" gap="xs">
                    <Heading as="h2" size="xs">{group.category}</Heading>
                    <Stack direction="column" gap="xs">
                      {group.results.map((entry) => {
                        const resultIndex = flatResults.findIndex((result) => result.id === entry.id)
                        const selected = resultIndex === selectedIndex
                        return (
                        <button
                          key={entry.id}
                          type="button"
                          className={[
                            'a1-global-search-dialog__result',
                            selected && 'a1-global-search-dialog__result--selected',
                          ].filter(Boolean).join(' ')}
                          aria-current={selected ? 'true' : undefined}
                          onMouseEnter={() => setSelectedIndex(resultIndex)}
                          onClick={() => choose(entry)}
                        >
                          <span className="a1-global-search-dialog__result-kicker">
                            {entry.category}
                            {entry.badge && <MessageBadge size="sm" subtle>{entry.badge}</MessageBadge>}
                          </span>
                          <span className="a1-global-search-dialog__result-title">{entry.title}</span>
                          {entry.description && (
                            <span className="a1-global-search-dialog__result-description">{entry.description}</span>
                          )}
                        </button>
                        )
                      })}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <MessageEmptyState
                icon="search_off"
                title="No matching results"
                description="Try a page, component, project, ticket, label, or related term."
              />
            )}
          </div>
        )}
      </Stack>
    </dialog>
  )
}
