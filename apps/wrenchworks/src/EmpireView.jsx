import {
  Button,
  Card,
  Grid,
  Heading,
  MessageBadge,
  Paragraph,
  Stack,
  Stat,
} from '@gtivr4/a1-design-system-react'
import { BUSINESSES } from './gameData.js'
import { getBusinessEconomy, getEmpireEconomy } from './gameEngine.js'
import { formatMoney, formatNumber, formatRate } from './formatters.js'
import { BusinessThumbnail } from './GameArt.jsx'

function RequirementProgress({ label, value, target, format = formatNumber }) {
  const progress = target > 0 ? Math.min(100, value / target * 100) : 100
  const complete = value >= target

  return (
    <Stack gap="xs">
      <Stack direction="row" gap="sm" justify="between" align="baseline">
        <Paragraph size="sm" color="muted">{label}</Paragraph>
        <Paragraph size="sm">
          {format(Math.min(value, target))} / {format(target)}
        </Paragraph>
      </Stack>
      <progress
        className="a1-wrenchworks-progress"
        max="100"
        value={progress}
        aria-label={`${label}: ${complete ? 'ready' : `${Math.round(progress)}% complete`}`}
      />
    </Stack>
  )
}

function BusinessCard({ business, index, game, actions, onVisit }) {
  const serviceState = game.businesses[business.id]
  const previous = BUSINESSES[index - 1]
  const pathOpen = !previous || game.businesses[previous.id].unlocked
  const economy = getBusinessEconomy(game, business.id)
  const isActive = game.activeBusinessId === business.id

  return (
    <Card
      className="a1-wrenchworks-business-card"
      status={serviceState.unlocked ? 'success' : pathOpen ? 'info' : 'neutral'}
      statusLabel={serviceState.unlocked ? 'Open' : pathOpen ? 'Available' : 'Locked'}
    >
      <Stack gap="md">
        <BusinessThumbnail business={business} locked={!serviceState.unlocked} />

        <Stack gap="xs">
          <Paragraph size="sm" color="muted">
            Stop {index + 1} · {business.district}
          </Paragraph>
          <Heading as="h2" size="md">{business.name}</Heading>
          <Paragraph size="sm" color="muted">{business.description}</Paragraph>
        </Stack>

        {serviceState.unlocked ? (
          <>
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
            <Stat
              title="Current income"
              value={formatRate(economy.incomeRate)}
              format="none"
              icon="payments"
              size="sm"
            />
            <Button
              variant={isActive ? 'tertiary' : 'secondary'}
              icon={isActive ? 'location_on' : 'arrow_forward'}
              iconPosition="end"
              fullWidth
              onClick={() => onVisit(business.id)}
            >
              {isActive ? 'Return to active shop' : 'Visit this shop'}
            </Button>
          </>
        ) : pathOpen ? (
          <>
            <RequirementProgress
              label="Opening cash"
              value={game.cash}
              target={business.unlockCost}
              format={formatMoney}
            />
            <RequirementProgress
              label="Reputation"
              value={game.reputation}
              target={business.reputationRequired}
            />
            <Button
              variant="primary"
              icon="key"
              fullWidth
              onClick={() => actions.unlockBusiness(business.id)}
            >
              Open for {formatMoney(business.unlockCost)}
            </Button>
          </>
        ) : (
          <Paragraph size="sm" color="muted">
            Open {previous.shortName} to reach this part of the city.
          </Paragraph>
        )}
      </Stack>
    </Card>
  )
}

export function EmpireView({ game, actions, onVisit }) {
  const economy = getEmpireEconomy(game)
  const serviceStates = Object.values(game.businesses)
  const businessCount = serviceStates.filter((business) => business.unlocked).length
  const crewCount = serviceStates.reduce((total, business) => total + business.staff, 0)

  return (
    <Stack gap="md" className="a1-wrenchworks-screen">
      <Stack gap="xs" className="a1-wrenchworks-screen-heading">
        <Paragraph size="sm" color="muted" className="a1-wrenchworks-screen-eyebrow">
          From one driveway to every highway
        </Paragraph>
        <Heading as="h1" size="lg">Your empire</Heading>
        <Paragraph color="muted" className="a1-wrenchworks-screen-intro">
          Open the next business when your cash and reputation are both ready.
        </Paragraph>
      </Stack>

      <Grid columns={{ xs: 2, md: 4 }} gap="sm">
        <Card>
          <Stat title="Businesses" value={businessCount} icon="storefront" size="sm" />
        </Card>
        <Card>
          <Stat title="Crew" value={crewCount} icon="groups" size="sm" />
        </Card>
        <Card>
          <Stat
            title="Empire income"
            value={formatRate(economy.incomeRate)}
            format="none"
            icon="analytics"
            size="sm"
          />
        </Card>
        <Card>
          <Stat
            title="Career earnings"
            value={formatMoney(game.lifetimeEarned)}
            format="none"
            icon="savings"
            size="sm"
          />
        </Card>
      </Grid>

      <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
        {BUSINESSES.map((business, index) => (
          <BusinessCard
            business={business}
            index={index}
            game={game}
            actions={actions}
            onVisit={onVisit}
            key={business.id}
          />
        ))}
      </Grid>
    </Stack>
  )
}
