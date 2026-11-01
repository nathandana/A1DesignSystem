import React, { useRef, useState } from 'react'
import {
  Card, Heading, IconButton, MessageBadge, Paragraph, Stack,
} from '@gtivr4/a1-design-system-react'
import './touch-card.css'

export function TouchActionCard({ enlargeOnHover = false }) {
  const [touchReady, setTouchReady] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [notice, setNotice] = useState('No action selected.')
  const pointerType = useRef('')

  function runAction(event, action) {
    if (pointerType.current === 'touch' && !touchReady) {
      setTouchReady(true)
      setNotice('Actions enlarged. Tap an action again to use it.')
      return
    }
    action()
    setTouchReady(false)
    pointerType.current = ''
  }

  const actionProps = {
    size: 'sm',
    onPointerDown: event => { pointerType.current = event.pointerType },
  }

  return (
    <Card as="article" className="a1-touch-card" aria-labelledby="touch-card-title">
      <Stack gap={24}>
        <Stack direction="row" gap={16} align="start" justify="between">
          <Stack gap={8}>
            <MessageBadge status="info" size="sm">Research</MessageBadge>
            <Heading id="touch-card-title" as="h2" size="md">Making city services easier to find</Heading>
            <Paragraph size="sm" color="muted">Field study · 12 participants · Updated yesterday</Paragraph>
          </Stack>
          <div className="a1-touch-card__actions-slot">
            <div
              className="a1-touch-card__actions"
              data-touch-ready={touchReady || undefined}
              data-hover-enlarge={enlargeOnHover || undefined}
              role="group"
              aria-label="Card actions"
            >
              <IconButton
                {...actionProps}
                icon={saved ? 'bookmark_added' : 'bookmark'}
                label={saved ? 'Remove field notes from saved items' : 'Save field notes'}
                variant={saved ? 'secondary' : 'tertiary'}
                aria-pressed={saved}
                onClick={event => runAction(event, () => {
                  setSaved(value => !value)
                  setNotice(saved ? 'Field notes removed from saved items.' : 'Field notes saved.')
                })}
              />
              <IconButton
                {...actionProps}
                icon="share"
                label="Share field notes"
                onClick={event => runAction(event, () => setNotice('Share options opened.'))}
              />
              <IconButton
                {...actionProps}
                icon="more_horiz"
                label={showDetails ? 'Hide project details' : 'Show project details'}
                aria-expanded={showDetails}
                onClick={event => runAction(event, () => {
                  setShowDetails(value => !value)
                  setNotice(showDetails ? 'Project details hidden.' : 'Project details shown.')
                })}
              />
            </div>
          </div>
        </Stack>

        <Paragraph>Residents could usually name the service they needed, but many did not know which department owned it. Participants succeeded faster when tasks were grouped by goal instead of agency.</Paragraph>

        {showDetails && (
          <Stack gap={8}>
            <Heading as="h3" size="sm">Next step</Heading>
            <Paragraph size="sm">Test a task-first service directory with the same participants before the Nov. 18 design review.</Paragraph>
          </Stack>
        )}

        <Paragraph className="a1-sr-only" role="status" aria-live="polite">{notice}</Paragraph>
      </Stack>
    </Card>
  )
}
