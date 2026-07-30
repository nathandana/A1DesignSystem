import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  Grid,
  Heading,
  Icon,
  IconButton,
  MessageBadge,
  Paragraph,
  Stack,
  Stat,
} from '@gtivr4/a1-design-system-react'
import { BUSINESSES, MAX_SERVICE_LEVEL } from './gameData.js'
import {
  canHireManager,
  getBusinessEconomy,
  getHireCost,
  getManagerCost,
  getMaxStaff,
  getPendingDecision,
  getUpgradeCost,
} from './gameEngine.js'
import { formatDuration, formatMoney, formatRate } from './formatters.js'
import { EmpireView } from './EmpireView.jsx'
import { GoalsView } from './GoalsView.jsx'
import { OfficeView } from './OfficeView.jsx'
import { WorkshopWorld } from './WorkshopWorld.jsx'

const panelTitles = {
  tools: ['Tool bench', 'upgrade'],
  office: ['Front office', 'badge'],
  city: ['Wrenchworks city map', 'location_city'],
  goals: ['Career ledger', 'flag'],
  settings: ['Game and save', 'settings'],
}

function ToolBenchPanel({ game, business, actions }) {
  const serviceState = game.businesses[business.id]
  const economy = getBusinessEconomy(game, business.id)
  const upgradeCost = getUpgradeCost(game, business.id)
  const upgradeMaxed = serviceState.level >= MAX_SERVICE_LEVEL

  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Paragraph size="sm" color="muted">{business.name}</Paragraph>
        <Heading as="h2" size="lg">Build a better shop</Heading>
        <Paragraph color="muted">
          Better lifts, tools and diagnostics raise every crew member's output.
        </Paragraph>
      </Stack>

      <Grid columns={{ xs: 2 }} gap="sm">
        <Card>
          <Stat title="Shop level" value={serviceState.level} icon="upgrade" size="sm" />
        </Card>
        <Card>
          <Stat
            title="Job value"
            value={formatMoney(economy.jobRevenue)}
            format="none"
            icon="payments"
            size="sm"
          />
        </Card>
      </Grid>

      <Card status={upgradeMaxed ? 'success' : 'info'}>
        <Stack gap="md">
          <Stack direction="row" gap="sm" justify="between" align="center">
            <span className="a1-wrenchworks-panel-icon" aria-hidden="true">
              <Icon name="construction" />
            </span>
            <MessageBadge status={upgradeMaxed ? 'success' : 'info'} subtle>
              {upgradeMaxed ? 'Maximum level' : `Level ${serviceState.level + 1}`}
            </MessageBadge>
          </Stack>
          <Stack gap="xs">
            <Heading as="h3" size="md">Workshop upgrade</Heading>
            <Paragraph size="sm" color="muted">
              Increase revenue, add room for technicians and visibly advance this location.
            </Paragraph>
          </Stack>
          <Button
            variant="primary"
            size="lg"
            icon="upgrade"
            fullWidth
            disabled={upgradeMaxed}
            onClick={() => actions.upgradeBusiness(business.id)}
          >
            {upgradeMaxed ? 'Shop fully upgraded' : `Install upgrade · ${formatMoney(upgradeCost)}`}
          </Button>
        </Stack>
      </Card>

      <Paragraph size="sm" color="muted">
        Walk back onto the shop floor to continue the current job route.
      </Paragraph>
    </Stack>
  )
}

function DecisionPanel({ decision, onChoose }) {
  return (
    <Card status="info" statusLabel="Decision ready" statusPulse>
      <Stack gap="md">
        <Stack gap="xs">
          <Heading as="h3" size="md">{decision.title}</Heading>
          <Paragraph>{decision.prompt}</Paragraph>
        </Stack>
        <Stack gap="sm">
          {decision.choices.map((choice) => (
            <Button
              variant="secondary"
              icon={choice.icon}
              fullWidth
              key={choice.id}
              onClick={() => onChoose(decision.id, choice.id)}
            >
              {choice.label} · {choice.description}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}

function OfficePanel({ game, business, actions, onOpenPanel }) {
  const serviceState = game.businesses[business.id]
  const economy = getBusinessEconomy(game, business.id)
  const hireCost = getHireCost(game, business.id)
  const managerCost = getManagerCost(game, business.id)
  const maxStaff = getMaxStaff(serviceState)
  const crewFull = serviceState.staff >= maxStaff
  const managerReady = canHireManager(game, business.id)
  const pendingDecision = getPendingDecision(game)

  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Paragraph size="sm" color="muted">{business.name}</Paragraph>
        <Heading as="h2" size="lg">Run the crew</Heading>
        <Paragraph color="muted">
          The team keeps earning while you work the floor—or while the game is closed.
        </Paragraph>
      </Stack>

      <Grid columns={{ xs: 2 }} gap="sm">
        <Card>
          <Stat
            title="Crew"
            value={`${serviceState.staff} / ${maxStaff}`}
            format="none"
            icon="groups"
            size="sm"
          />
        </Card>
        <Card>
          <Stat
            title="Passive income"
            value={formatRate(economy.incomeRate)}
            format="none"
            icon="analytics"
            size="sm"
          />
        </Card>
      </Grid>

      {pendingDecision && (
        <DecisionPanel decision={pendingDecision} onChoose={actions.chooseDecision} />
      )}

      <Card>
        <Stack gap="md">
          <Stack gap="xs">
            <Heading as="h3" size="md">Shop staff</Heading>
            <Paragraph size="sm" color="muted">
              Each technician runs another service cycle in the background.
            </Paragraph>
          </Stack>
          <Button
            variant="primary"
            icon="person_add"
            fullWidth
            disabled={crewFull}
            onClick={() => actions.hireStaff(business.id)}
          >
            {crewFull
              ? `Crew full · ${serviceState.staff}/${maxStaff}`
              : `Hire technician · ${formatMoney(hireCost)}`}
          </Button>
          {!serviceState.manager && (
            <Button
              variant={managerReady ? 'success' : 'tertiary'}
              icon="badge"
              fullWidth
              disabled={!managerReady}
              onClick={() => actions.hireManager(business.id)}
            >
              {managerReady
                ? `Promote manager · ${formatMoney(managerCost)}`
                : 'Manager requires level 5 and 3 technicians'}
            </Button>
          )}
          {serviceState.manager && (
            <MessageBadge status="success" subtle icon="badge">
              Managed · 80% faster output
            </MessageBadge>
          )}
        </Stack>
      </Card>

      <Grid columns={{ xs: 1, sm: 2 }} gap="sm">
        <Button variant="secondary" icon="flag" onClick={() => onOpenPanel('goals')}>
          Open career ledger
        </Button>
        <Button variant="tertiary" icon="settings" onClick={() => onOpenPanel('settings')}>
          Game and save
        </Button>
      </Grid>

      <Paragraph size="sm" color="muted">
        Current crew cycle: {formatDuration(economy.jobDuration)}.
      </Paragraph>
    </Stack>
  )
}

function WorldPanel({ panel, onClose, children }) {
  const [title, icon] = panelTitles[panel]

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="a1-wrenchworks-world-panel-layer">
      <button
        className="a1-wrenchworks-world-panel__scrim"
        type="button"
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside className="a1-wrenchworks-world-panel" aria-label={title}>
        <header className="a1-wrenchworks-world-panel__header">
          <Stack direction="row" gap="sm" align="center">
            <span className="a1-wrenchworks-panel-icon" aria-hidden="true">
              <Icon name={icon} />
            </span>
            <Heading as="h2" size="md">{title}</Heading>
          </Stack>
          <IconButton icon="close" label={`Close ${title}`} onClick={onClose} />
        </header>
        <div className="a1-wrenchworks-world-panel__content">
          {children}
        </div>
      </aside>
    </div>
  )
}

export function GarageView({
  game,
  actions,
  onFranchiseRequest,
  onResetRequest,
}) {
  const [panel, setPanel] = useState(null)
  const previousBusinessRef = useRef(game.activeBusinessId)
  const business = BUSINESSES.find((item) => item.id === game.activeBusinessId) ?? BUSINESSES[0]

  useEffect(() => {
    if (
      panel === 'city'
      && previousBusinessRef.current !== game.activeBusinessId
    ) {
      setPanel(null)
    }
    previousBusinessRef.current = game.activeBusinessId
  }, [game.activeBusinessId, panel])

  function visitBusiness(businessId) {
    actions.selectBusiness(businessId)
    setPanel(null)
  }

  return (
    <div className="a1-wrenchworks-game">
      <WorkshopWorld
        game={game}
        actions={actions}
        panelOpen={Boolean(panel)}
        onOpenPanel={setPanel}
      />

      {panel && (
        <WorldPanel panel={panel} onClose={() => setPanel(null)}>
          {panel === 'tools' && (
            <ToolBenchPanel game={game} business={business} actions={actions} />
          )}
          {panel === 'office' && (
            <OfficePanel
              game={game}
              business={business}
              actions={actions}
              onOpenPanel={setPanel}
            />
          )}
          {panel === 'city' && (
            <EmpireView game={game} actions={actions} onVisit={visitBusiness} />
          )}
          {panel === 'goals' && (
            <GoalsView
              game={game}
              actions={actions}
              onFranchiseRequest={onFranchiseRequest}
            />
          )}
          {panel === 'settings' && (
            <OfficeView game={game} onResetRequest={onResetRequest} />
          )}
        </WorldPanel>
      )}
    </div>
  )
}
