import { useState } from 'react'
import {
  BottomDrawer,
  Button,
  Card,
  Dialog,
  Grid,
  Heading,
  Icon,
  MessageBadge,
  Paragraph,
  SegmentedControl,
  Snackbar,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { MILESTONES } from './gameData.js'
import {
  getEmpireEconomy,
  getMilestoneValue,
  getPendingDecision,
} from './gameEngine.js'
import { formatDuration, formatMoney, formatNumber, formatRate } from './formatters.js'
import { GarageView } from './GarageView.jsx'
import { EmpireView } from './EmpireView.jsx'
import { GoalsView } from './GoalsView.jsx'
import { OfficeView } from './OfficeView.jsx'
import { useWrenchworks } from './useWrenchworks.js'

const viewOptions = [
  { value: 'garage', label: 'Garage', icon: 'home_repair_service' },
  { value: 'empire', label: 'Empire', icon: 'location_city' },
  { value: 'goals', label: 'Goals', icon: 'flag' },
  { value: 'office', label: 'Office', icon: 'storefront' },
]

function GameHeader({ game, activeView, onViewChange }) {
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
              <small>No-ads garage empire</small>
            </span>
          </Stack>

          <div className="a1-wrenchworks-desktop-nav">
            <SegmentedControl
              aria-label="Game sections"
              options={viewOptions}
              value={activeView}
              onChange={onViewChange}
              size="sm"
            />
          </div>

          <Stack direction="row" gap="xs" align="center">
            <span className="a1-wrenchworks-hud-chip">
              <Icon name="payments" aria-hidden="true" />
              <span>
                <small>Cash</small>
                <strong>{formatMoney(game.cash)}</strong>
              </span>
            </span>
            <span className="a1-wrenchworks-hud-chip a1-wrenchworks-hud-chip--wide">
              <Icon name="analytics" aria-hidden="true" />
              <span>
                <small>Income</small>
                <strong>{formatRate(economy.incomeRate)}</strong>
              </span>
            </span>
          </Stack>
        </Stack>
      </div>
    </header>
  )
}

function OfflineDialog({ summary, open, onClose }) {
  if (!summary) return null

  return (
    <Dialog
      open={open}
      title="The crew kept working"
      status="success"
      icon="engineering"
      onClose={onClose}
      footer={(
        <Button variant="primary" icon="check" fullWidth onClick={onClose}>
          Collect and continue
        </Button>
      )}
    >
      <Stack gap="md">
        <Paragraph>
          While you were away, every staffed shop kept earning at its normal rate.
        </Paragraph>
        <Grid columns={{ xs: 2 }} gap="sm">
          <Card>
            <Stack gap="xs">
              <Paragraph size="sm" color="muted">Cash earned</Paragraph>
              <Heading as="p" size="md">{formatMoney(summary.earned)}</Heading>
            </Stack>
          </Card>
          <Card>
            <Stack gap="xs">
              <Paragraph size="sm" color="muted">Reputation earned</Paragraph>
              <Heading as="p" size="md">{formatNumber(summary.reputationEarned)}</Heading>
            </Stack>
          </Card>
        </Grid>
        <Paragraph size="sm" color="muted">
          Progress covered {formatDuration(summary.elapsedSeconds)}
          {summary.capped ? ', the 12-hour offline maximum.' : '.'}
        </Paragraph>
      </Stack>
    </Dialog>
  )
}

export function App() {
  const { game, actions, offlineSummary, dismissOfflineSummary } = useWrenchworks()
  const [activeView, setActiveView] = useState('garage')
  const [franchiseConfirmOpen, setFranchiseConfirmOpen] = useState(false)
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)
  const [dismissedEventId, setDismissedEventId] = useState(0)

  const pendingDecision = getPendingDecision(game)
  const readyMilestones = MILESTONES.filter(
    (milestone) =>
      !game.claimedMilestones.includes(milestone.id)
      && getMilestoneValue(game, milestone) >= milestone.target,
  ).length
  const goalsBadge = readyMilestones + (pendingDecision ? 1 : 0)
  const eventOpen = Boolean(game.lastEvent && game.lastEvent.id !== dismissedEventId)

  function visitBusiness(businessId) {
    actions.selectBusiness(businessId)
    setActiveView('garage')
  }

  function confirmFranchise() {
    actions.startFranchise()
    setFranchiseConfirmOpen(false)
    setActiveView('garage')
  }

  function confirmReset() {
    actions.resetGame()
    setResetConfirmOpen(false)
    setActiveView('garage')
  }

  const bottomItems = viewOptions.map((option) => ({
    id: option.value,
    label: option.label,
    icon: option.icon,
    active: activeView === option.value,
    badge: option.value === 'goals' ? goalsBadge : 0,
    onClick: () => setActiveView(option.value),
  }))

  return (
    <div className="a1-wrenchworks-app a1-theme-light">
      <GameHeader game={game} activeView={activeView} onViewChange={setActiveView} />

      <main id="a1-wrenchworks-main">
        <div className="a1-wrenchworks-shell">
          <div className="a1-wrenchworks-view" key={activeView}>
            {activeView === 'garage' && <GarageView game={game} actions={actions} />}
            {activeView === 'empire' && (
              <EmpireView game={game} actions={actions} onVisit={visitBusiness} />
            )}
            {activeView === 'goals' && (
              <GoalsView
                game={game}
                actions={actions}
                onFranchiseRequest={() => setFranchiseConfirmOpen(true)}
              />
            )}
            {activeView === 'office' && (
              <OfficeView game={game} onResetRequest={() => setResetConfirmOpen(true)} />
            )}
          </div>
        </div>
      </main>

      <BottomDrawer items={bottomItems} aria-label="Game sections" />

      <OfflineDialog
        summary={offlineSummary}
        open={Boolean(offlineSummary)}
        onClose={dismissOfflineSummary}
      />

      <Dialog
        open={franchiseConfirmOpen}
        title="Start a new franchise?"
        status="warn"
        icon="hub"
        onClose={() => setFranchiseConfirmOpen(false)}
        footer={(
          <Stack direction={{ xs: 'column', sm: 'row' }} gap="sm" justify="end">
            <Button variant="tertiary" onClick={() => setFranchiseConfirmOpen(false)}>
              Keep this empire
            </Button>
            <Button variant="primary" icon="rocket_launch" onClick={confirmFranchise}>
              Start the franchise
            </Button>
          </Stack>
        )}
      >
        <Stack gap="sm">
          <Paragraph>
            Your current shops, crew, cash and most reputation will reset. Career
            milestones and strategic choices stay with you.
          </Paragraph>
          <MessageBadge status="warn" subtle>
            Permanent income bonus: +60%
          </MessageBadge>
        </Stack>
      </Dialog>

      <Dialog
        open={resetConfirmOpen}
        title="Delete your Wrenchworks save?"
        status="error"
        icon="delete_forever"
        onClose={() => setResetConfirmOpen(false)}
        footer={(
          <Stack direction={{ xs: 'column', sm: 'row' }} gap="sm" justify="end">
            <Button variant="tertiary" onClick={() => setResetConfirmOpen(false)}>
              Keep my save
            </Button>
            <Button variant="destructive" icon="delete_forever" onClick={confirmReset}>
              Delete save
            </Button>
          </Stack>
        )}
      >
        <Paragraph>
          This permanently removes every business, upgrade, milestone and franchise from
          this browser.
        </Paragraph>
      </Dialog>

      <Snackbar
        open={eventOpen}
        position="bottom-right"
        autoHideDuration={3500}
        onClose={() => setDismissedEventId(game.lastEvent?.id ?? 0)}
        role={game.lastEvent?.type === 'error' ? 'alert' : 'status'}
        className="a1-wrenchworks-snackbar"
      >
        {game.lastEvent?.message}
      </Snackbar>
    </div>
  )
}
