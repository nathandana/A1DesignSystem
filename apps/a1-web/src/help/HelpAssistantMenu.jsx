import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Heading,
  Menu,
  Paragraph,
  SearchField,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { answerHelpQuestion, HELP_ASSISTANT_STARTERS } from './helpAssistant.js'

export function HelpAssistantMenu({ open, anchorRef, onClose, onOpenHelp }) {
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  useEffect(() => {
    if (!open) return undefined
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(timeout)
  }, [open])

  const response = useMemo(
    () => answerHelpQuestion(submittedQuery || query),
    [query, submittedQuery],
  )

  function submit(nextQuery) {
    const value = String(nextQuery ?? query).trim()
    setQuery(value)
    setSubmittedQuery(value)
  }

  function handleOpenHelp(nextQuery = '') {
    onClose?.()
    onOpenHelp?.(nextQuery)
  }

  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      aria-label="Help assistant"
      className="a1-web-help-assistant-menu"
    >
      <div className="a1-web-help-assistant">
        <Stack direction="column" gap="sm">
          <Stack direction="column" gap="xs">
            <Heading as="h2" size="xs">Ask Help</Heading>
            <Paragraph size="sm" color="muted">
              Ask in plain language and I will look through the built-in Help topics.
            </Paragraph>
          </Stack>

          <SearchField
            ref={inputRef}
            label="Ask Help"
            aria-label="Ask Help"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => { setQuery(''); setSubmittedQuery('') }}
            onSearch={() => submit()}
          />

          {!query.trim() && !submittedQuery ? (
            <Stack direction="column" gap="xs">
              <Paragraph size="sm" color="muted">Try one of these:</Paragraph>
              <Stack direction="column" gap="xs">
                {HELP_ASSISTANT_STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    className="a1-web-help-assistant__starter"
                    onClick={() => submit(starter)}
                  >
                    {starter}
                  </button>
                ))}
              </Stack>
            </Stack>
          ) : (
            <Stack direction="column" gap="sm">
              <div className="a1-web-help-assistant__answer">
                <Paragraph size="sm">{response.answer}</Paragraph>
              </div>

              {response.matches.length > 0 && (
                <Stack direction="column" gap="xs">
                  <Paragraph size="sm" color="muted">Related Help topics</Paragraph>
                  <Stack direction="column" gap="xs">
                    {response.matches.map((match) => (
                      <button
                        key={match.articleId}
                        type="button"
                        className="a1-web-help-assistant__match"
                        onClick={() => handleOpenHelp(match.articleTitle)}
                      >
                        <span className="a1-web-help-assistant__match-category">{match.categoryTitle}</span>
                        <span className="a1-web-help-assistant__match-title">{match.articleTitle}</span>
                        {match.summary && <span className="a1-web-help-assistant__match-summary">{match.summary}</span>}
                      </button>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          )}

          <Stack direction="row" gap="xs" justify="end" wrap>
            <Button variant="secondary" size="sm" onClick={() => handleOpenHelp(query.trim() || submittedQuery)}>
              Open full Help
            </Button>
          </Stack>
        </Stack>
      </div>
    </Menu>
  )
}
