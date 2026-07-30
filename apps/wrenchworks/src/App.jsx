import { useState } from 'react'
import {
  Button,
  Card,
  Grid,
  Heading,
  Icon,
  MessageBadge,
  Overlay,
  Paragraph,
  Snackbar,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { getEmpireEconomy } from './gameEngine.js'
import { formatDuration, formatMoney, formatNumber, formatRate } from './formatters.js'
import { GarageView } from './GarageView.jsx'
import { useWrenchworks } from './useWrenchworks.js'

function GameHeader({ game }) {
  const economy = getEmpireEconomy(game)

  return (
    <header className="a1-wrenchworks-header">
      <div className="a1-wrenchworks-header__inner">
        <Stack direction="row" gap="sm" justify="between" align="center">
          <Stack direction="row" gap="sm" align="center">
            <span className="a1-wrenchworks-brand-mark" aria-hidden="true">
              <Icon name="handyman" />
            </span>
            <span className="a1-wrenchworks-brand-copy">
              <strong>Wrenchworks</strong>
              <small>{game.franchises > 0 ? `Franchise ${game.franchises + 1}` : 'Garage empire'}</small>
            </span>
          </Stack>

          <Stack direction="row" gap="xs" align="center">
            <span className="a1-wrenchworks-hud-chip">
              <Icon name="payments" aria-hidden="true" />
              <span>
                <small>Cash</small>
                <strong>{formatMoney(game.cash)}</strong>
              </span>
            </span>
            <span className="a1-wrenchworks-hud-chip">
              <Icon name="thumb_up" aria-hidden="true" />
              <span>
                <small>Reputation</small>
                <strong>{formatNumber(game.reputation)}</strong>
              </span>
            </span>
            <span className="a1-wrenchworks-hud-chip a1-wrenchworks-hud-chip--wide">
              <Icon name="analytics" aria-hidden="true" />
              <span>
                <small>Empire income</small>
                <strong>{formatRate(economy.incomeRate)}</strong>
              </span>
            </span>
          </Stack>
        </Stack>
      </div>
    </header>
  )
}

function OfflineOverlay({ summary, open, onClose }) {
  if (!summary) return null

  return (
    <Overlay
      open={open}
      status="success"
      icon="engineering"
      title="The crew kept working"
      body="Every staffed shop kept earning while you were away."
      onClose={onClose}
      actions={(
        <Button variant="primary" size="lg" icon="check" onClick={onClose}>
          Collect and walk in
        </Button>
      )}
    >
      <Grid columns={{ xs: 2 }} gap="sm">
        <Card>
          <Stack gap="xs">
            <Paragraph size="sm" color="muted">Cash earned</Paragraph>
            <Heading as="p" size="md">{formatMoney(summary.earned)}</Heading>
          </Stack>
        </Card>
        <Card>
          <Stack gap="xs">
            <Paragraph size="sm" color="muted">Reputation</Paragraph>
            <Heading as="p" size="md">+{formatNumber(summary.reputationEarned)}</Heading>
          </Stack>
        </Card>
      </Grid>
      <Paragraph size="sm" color="muted">
        Progress covered {formatDuration(summary.elapsedSeconds)}
        {summary.capped ? ', the 12-hour offline maximum.' : '.'}
      </Paragraph>
    </Overlay>
  )
}

export function App() {
  const { game, actions, offlineSummary, dismissOfflineSummary } = useWrenchworks()
  const [franchiseConfirmOpen, setFranchiseConfirmOpen] = useState(false)
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)
  const [dismissedEventId, setDismissedEventId] = useState(0)
  const eventOpen = Boolean(game.lastEvent && game.lastEvent.id !== dismissedEventId)

  function confirmFranchise() {
    actions.startFranchise()
    setFranchiseConfirmOpen(false)
  }

  function confirmReset() {
    actions.resetGame()
    setResetConfirmOpen(false)
  }

  return (
    <div className="a1-wrenchworks-app a1-theme-light">
      <GameHeader game={game} />

      <main id="a1-wrenchworks-main">
        <GarageView
          game={game}
          actions={actions}
          onFranchiseRequest={() => setFranchiseConfirmOpen(true)}
          onResetRequest={() => setResetConfirmOpen(true)}
        />
      </main>

      <OfflineOverlay
        summary={offlineSummary}
        open={Boolean(offlineSummary)}
        onClose={dismissOfflineSummary}
      />

      <Overlay
        open={franchiseConfirmOpen}
        status="warn"
        icon="hub"
        title="Start a new franchise?"
        body="Your shops, crew, cash and most reputation will reset. Career milestones and strategic choices stay with you."
        onClose={() => setFranchiseConfirmOpen(false)}
        actions={(
          <Stack direction={{ xs: 'column', sm: 'row' }} gap="sm">
            <Button variant="tertiary" onClick={() => setFranchiseConfirmOpen(false)}>
              Keep this empire
            </Button>
            <Button variant="primary" icon="rocket_launch" onClick={confirmFranchise}>
              Start the franchise
            </Button>
          </Stack>
        )}
      >
        <MessageBadge status="warn" subtle>
          Permanent future-income bonus: +60%
        </MessageBadge>
      </Overlay>

      <Overlay
        open={resetConfirmOpen}
        status="error"
        icon="delete_forever"
        title="Delete your Wrenchworks save?"
        body="This permanently removes every business, upgrade, milestone and franchise from this browser."
        onClose={() => setResetConfirmOpen(false)}
        actions={(
          <Stack direction={{ xs: 'column', sm: 'row' }} gap="sm">
            <Button variant="tertiary" onClick={() => setResetConfirmOpen(false)}>
              Keep my save
            </Button>
            <Button variant="destructive" icon="delete_forever" onClick={confirmReset}>
              Delete save
            </Button>
          </Stack>
        )}
      />

      <Snackbar
        open={eventOpen}
        position="top-right"
        autoHideDuration={3200}
        onClose={() => setDismissedEventId(game.lastEvent?.id ?? 0)}
        role={game.lastEvent?.type === 'error' ? 'alert' : 'status'}
        className="a1-wrenchworks-snackbar"
      >
        {game.lastEvent?.message}
      </Snackbar>
    </div>
  )
}
