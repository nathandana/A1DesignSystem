import {
  Button,
  Card,
  Grid,
  Heading,
  Icon,
  MessageBadge,
  Paragraph,
  Stack,
  Stat,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'
import { BUSINESSES, MAX_SERVICE_LEVEL } from './gameData.js'
import {
  canHireManager,
  getBusinessEconomy,
  getHireCost,
  getManagerCost,
  getManualSecondsRemaining,
  getMaxStaff,
  getPendingDecision,
  getUpgradeCost,
} from './gameEngine.js'
import { formatClock, formatDuration, formatMoney, formatRate } from './formatters.js'
import { GarageScene } from './GameArt.jsx'

function DecisionPanel({ decision, onChoose }) {
  return (
    <Card className="a1-wrenchworks-decision" status="info" statusLabel="Decision ready" statusPulse>
      <Stack gap="md">
        <Stack gap="xs">
          <Heading as="h2" size="md">{decision.title}</Heading>
          <Paragraph>{decision.prompt}</Paragraph>
        </Stack>
        <Grid columns={{ xs: 1, md: 3 }} gap="sm">
          {decision.choices.map((choice) => (
            <div className="a1-wrenchworks-decision__choice" key={choice.id}>
              <Stack gap="sm">
                <span className="a1-wrenchworks-decision__icon" aria-hidden="true">
                  <Icon name={choice.icon} />
                </span>
                <Stack gap="xs">
                  <Heading as="h3" size="xs">{choice.label}</Heading>
                  <Paragraph size="sm" color="muted">{choice.description}</Paragraph>
                </Stack>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => onChoose(decision.id, choice.id)}
                >
                  Choose this path
                </Button>
              </Stack>
            </div>
          ))}
        </Grid>
      </Stack>
    </Card>
  )
}

function Workshop({ game, business, actions }) {
  const serviceState = game.businesses[business.id]
  const economy = getBusinessEconomy(game, business.id)
  const upgradeCost = getUpgradeCost(game, business.id)
  const hireCost = getHireCost(game, business.id)
  const managerCost = getManagerCost(game, business.id)
  const maxStaff = getMaxStaff(serviceState)
  const manualRemaining = getManualSecondsRemaining(game, business.id, game.lastTickAt)
  const upgradeMaxed = serviceState.level >= MAX_SERVICE_LEVEL
  const crewFull = serviceState.staff >= maxStaff
  const managerReady = canHireManager(game, business.id)

  return (
    <div className="a1-wrenchworks-workshop-layout">
      <GarageScene
        business={business}
        serviceState={serviceState}
        economy={economy}
        game={game}
      />

      <Stack gap="md" className="a1-wrenchworks-workshop-layout__controls">
        <Card>
          <Stack gap="md">
            <Stack direction="row" gap="sm" justify="between" align="start" wrap>
              <Stack gap="xs">
                <Paragraph size="sm" color="muted">{business.district}</Paragraph>
                <Heading as="h2" size="lg">{business.name}</Heading>
                <Paragraph color="muted">{business.description}</Paragraph>
              </Stack>
              <Stack direction="row" gap="xs" wrap>
                <MessageBadge status="info" subtle icon={null}>
                  Level {serviceState.level}
                </MessageBadge>
                <MessageBadge status="success" subtle icon={null}>
                  {serviceState.staff} tech{serviceState.staff === 1 ? '' : 's'}
                </MessageBadge>
                {serviceState.manager && (
                  <MessageBadge status="warn" subtle icon="badge">Managed</MessageBadge>
                )}
              </Stack>
            </Stack>

            <Grid columns={{ xs: 2, sm: 3 }} gap="sm">
              <Stat
                title="Shop income"
                value={formatRate(economy.incomeRate)}
                format="none"
                icon="payments"
                size="sm"
              />
              <Stat
                title="Job value"
                value={formatMoney(economy.jobRevenue)}
                format="none"
                icon="receipt_long"
                size="sm"
              />
              <Stat
                title="Crew cycle"
                value={formatDuration(economy.jobDuration)}
                format="none"
                icon="timer"
                size="sm"
              />
            </Grid>
          </Stack>
        </Card>

        <Card>
          <Stack gap="md">
            <Stack gap="xs">
              <Heading as="h2" size="md">Run this shop</Heading>
              <Paragraph color="muted">
                Your crew earns automatically. Jump in or invest where it matters.
              </Paragraph>
            </Stack>

            <Button
              variant="primary"
              size="lg"
              icon={manualRemaining > 0 ? 'hourglass_top' : business.icon}
              fullWidth
              disabled={manualRemaining > 0}
              onClick={() => actions.workJob(business.id)}
            >
              {manualRemaining > 0
                ? `Bay ready in ${formatClock(manualRemaining)}`
                : `${business.actionLabel} for ${formatMoney(economy.manualRevenue)}`}
            </Button>

            <Grid columns={{ xs: 1, sm: 2 }} gap="sm">
              <Button
                variant="secondary"
                icon="upgrade"
                fullWidth
                disabled={upgradeMaxed}
                onClick={() => actions.upgradeBusiness(business.id)}
              >
                {upgradeMaxed
                  ? 'Fully upgraded'
                  : `Upgrade · ${formatMoney(upgradeCost)}`}
              </Button>
              <Button
                variant="secondary"
                icon="person_add"
                fullWidth
                disabled={crewFull}
                onClick={() => actions.hireStaff(business.id)}
              >
                {crewFull
                  ? `Crew full · ${serviceState.staff}/${maxStaff}`
                  : `Hire tech · ${formatMoney(hireCost)}`}
              </Button>
            </Grid>

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
                  : 'Manager unlocks at level 5 with 3 technicians'}
              </Button>
            )}
          </Stack>
        </Card>
      </Stack>
    </div>
  )
}

export function GarageView({ game, actions }) {
  const unlockedBusinesses = BUSINESSES.filter(
    (business) => game.businesses[business.id].unlocked,
  )
  const pendingDecision = getPendingDecision(game)

  return (
    <Stack gap="md" className="a1-wrenchworks-screen">
      <Stack gap="xs" className="a1-wrenchworks-screen-heading">
        <Paragraph size="sm" color="muted" className="a1-wrenchworks-screen-eyebrow">
          Hands-on when you want, idle when you do not
        </Paragraph>
        <Heading as="h1" size="lg">Your garage</Heading>
        <Paragraph color="muted" className="a1-wrenchworks-screen-intro">
          Move between shops, help with a job and let your crew handle the rest.
        </Paragraph>
      </Stack>

      {pendingDecision && (
        <DecisionPanel decision={pendingDecision} onChoose={actions.chooseDecision} />
      )}

      <Tabs
        value={game.activeBusinessId}
        onChange={actions.selectBusiness}
        variant="line"
        labelMode="selected"
      >
        <TabList>
          {unlockedBusinesses.map((business) => (
            <Tab value={business.id} icon={business.icon} key={business.id}>
              {business.shortName}
            </Tab>
          ))}
        </TabList>

        {unlockedBusinesses.map((business) => (
          <TabPanel value={business.id} key={business.id}>
            <Workshop game={game} business={business} actions={actions} />
          </TabPanel>
        ))}
      </Tabs>
    </Stack>
  )
}
