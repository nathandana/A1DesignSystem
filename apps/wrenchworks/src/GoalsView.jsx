import {
  Button,
  Card,
  Grid,
  Heading,
  Icon,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Stack,
  Stat,
} from '@gtivr4/a1-design-system-react'
import { DECISIONS, MILESTONES } from './gameData.js'
import {
  getDecisionBonuses,
  getFranchiseMultiplier,
  getFranchiseReadiness,
  getMilestoneValue,
} from './gameEngine.js'
import { formatMoney, formatNumber } from './formatters.js'

function milestoneFormatter(milestone, value) {
  return milestone.metric === 'lifetimeEarned'
    ? formatMoney(value)
    : formatNumber(value)
}

function MilestoneCard({ milestone, game, onClaim }) {
  const value = getMilestoneValue(game, milestone)
  const complete = value >= milestone.target
  const claimed = game.claimedMilestones.includes(milestone.id)
  const progress = Math.min(100, value / milestone.target * 100)

  return (
    <Card status={claimed ? 'success' : complete ? 'info' : 'neutral'}>
      <Stack gap="md">
        <Stack direction="row" gap="sm" justify="between" align="start">
          <span className="a1-wrenchworks-goal-icon" aria-hidden="true">
            <Icon name={milestone.icon} />
          </span>
          {claimed && <MessageBadge status="success" subtle>Claimed</MessageBadge>}
          {!claimed && complete && <MessageBadge status="info" subtle>Ready</MessageBadge>}
        </Stack>
        <Stack gap="xs">
          <Heading as="h2" size="sm">{milestone.title}</Heading>
          <Paragraph size="sm" color="muted">{milestone.description}</Paragraph>
        </Stack>
        <Stack gap="xs">
          <progress
            className="a1-wrenchworks-progress"
            max="100"
            value={progress}
            aria-label={`${milestone.title}: ${Math.round(progress)}% complete`}
          />
          <Paragraph size="sm" color="muted">
            {milestoneFormatter(milestone, Math.min(value, milestone.target))}
            {' / '}
            {milestoneFormatter(milestone, milestone.target)}
          </Paragraph>
        </Stack>
        <Button
          variant={complete && !claimed ? 'primary' : 'tertiary'}
          size="sm"
          fullWidth
          disabled={!complete || claimed}
          onClick={() => onClaim(milestone.id)}
        >
          {claimed ? 'Reward claimed' : `Claim ${formatMoney(milestone.reward)}`}
        </Button>
      </Stack>
    </Card>
  )
}

function DecisionHistory({ game }) {
  const made = DECISIONS.flatMap((decision) => {
    const choiceId = game.decisionChoices[decision.id]
    const choice = decision.choices.find((item) => item.id === choiceId)
    return choice ? [{ decision, choice }] : []
  })

  return (
    <Card>
      <Stack gap="md">
        <Stack gap="xs">
          <Heading as="h2" size="md">Wrenchworks playbook</Heading>
          <Paragraph color="muted">
            Your decisions permanently shape speed, earnings and reputation.
          </Paragraph>
        </Stack>
        {made.length === 0 ? (
          <MessageEmptyState
            scale="card"
            icon="fork_right"
            title="Your first big decision is ahead"
            description="Earn $1,000 to choose what the shop stands for."
          />
        ) : (
          <Stack gap="sm">
            {made.map(({ decision, choice }) => (
              <div className="a1-wrenchworks-playbook-item" key={decision.id}>
                <Stack direction="row" gap="sm" align="center">
                  <span className="a1-wrenchworks-playbook-item__icon" aria-hidden="true">
                    <Icon name={choice.icon} />
                  </span>
                  <Stack gap="xs">
                    <Paragraph size="sm" color="muted">{decision.title}</Paragraph>
                    <Paragraph><strong>{choice.label}</strong></Paragraph>
                    <Paragraph size="sm" color="muted">{choice.description}</Paragraph>
                  </Stack>
                </Stack>
              </div>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  )
}

function FranchiseCard({ game, onRequest }) {
  const readiness = getFranchiseReadiness(game)
  const nextMultiplier = 1 + (game.franchises + 1) * 0.6

  return (
    <Card
      className="a1-wrenchworks-franchise"
      status={readiness.ready ? 'warn' : 'neutral'}
      statusLabel={readiness.ready ? 'Franchise ready' : 'Long-term goal'}
      statusPulse={readiness.ready}
    >
      <Stack gap="md">
        <Stack gap="xs">
          <Heading as="h2" size="md">Start another franchise</Heading>
          <Paragraph color="muted">
            Restart with your playbook and career milestones intact. Each franchise adds
            60% to all future income.
          </Paragraph>
        </Stack>

        <Grid columns={{ xs: 1, sm: 2 }} gap="sm">
          <Stack gap="xs">
            <Stack direction="row" gap="sm" justify="between">
              <Paragraph size="sm" color="muted">Businesses</Paragraph>
              <Paragraph size="sm">
                {readiness.businessCount} / {readiness.businessTarget}
              </Paragraph>
            </Stack>
            <progress
              className="a1-wrenchworks-progress"
              max={readiness.businessTarget}
              value={readiness.businessCount}
              aria-label={`Businesses: ${readiness.businessCount} of ${readiness.businessTarget}`}
            />
          </Stack>
          <Stack gap="xs">
            <Stack direction="row" gap="sm" justify="between">
              <Paragraph size="sm" color="muted">This run</Paragraph>
              <Paragraph size="sm">
                {formatMoney(Math.min(readiness.runEarned, readiness.runEarnedTarget))}
                {' / '}
                {formatMoney(readiness.runEarnedTarget)}
              </Paragraph>
            </Stack>
            <progress
              className="a1-wrenchworks-progress"
              max={readiness.runEarnedTarget}
              value={readiness.runEarned}
              aria-label="Franchise earnings progress"
            />
          </Stack>
        </Grid>

        <Grid columns={{ xs: 2 }} gap="sm">
          <Stat
            title="Current multiplier"
            value={`${getFranchiseMultiplier(game).toFixed(1)}×`}
            format="none"
            icon="bolt"
            size="sm"
          />
          <Stat
            title="Next multiplier"
            value={`${nextMultiplier.toFixed(1)}×`}
            format="none"
            icon="rocket_launch"
            size="sm"
          />
        </Grid>

        <Button
          variant={readiness.ready ? 'primary' : 'tertiary'}
          icon="hub"
          fullWidth
          disabled={!readiness.ready}
          onClick={onRequest}
        >
          {readiness.ready ? 'Start a new franchise' : 'Open the dealership and earn $100B this run'}
        </Button>
      </Stack>
    </Card>
  )
}

export function GoalsView({ game, actions, onFranchiseRequest }) {
  const bonuses = getDecisionBonuses(game)

  return (
    <Stack gap="md" className="a1-wrenchworks-screen">
      <Stack gap="xs" className="a1-wrenchworks-screen-heading">
        <Paragraph size="sm" color="muted" className="a1-wrenchworks-screen-eyebrow">
          Rewards now, legacy later
        </Paragraph>
        <Heading as="h1" size="lg">Goals and legacy</Heading>
        <Paragraph color="muted" className="a1-wrenchworks-screen-intro">
          Claim career rewards, review your choices and prepare the next franchise.
        </Paragraph>
      </Stack>

      <Grid columns={{ xs: 2, md: 4 }} gap="sm">
        <Card>
          <Stat
            title="Revenue bonus"
            value={`${Math.round(bonuses.revenue * 100)}%`}
            format="none"
            icon="payments"
            size="sm"
          />
        </Card>
        <Card>
          <Stat
            title="Speed bonus"
            value={`${Math.round(bonuses.speed * 100)}%`}
            format="none"
            icon="speed"
            size="sm"
          />
        </Card>
        <Card>
          <Stat
            title="Reputation bonus"
            value={`${Math.round(bonuses.reputation * 100)}%`}
            format="none"
            icon="thumb_up"
            size="sm"
          />
        </Card>
        <Card>
          <Stat
            title="Franchises"
            value={game.franchises}
            icon="hub"
            size="sm"
          />
        </Card>
      </Grid>

      <Stack gap="md">
        <Heading as="h2" size="lg">Career milestones</Heading>
        <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
          {MILESTONES.map((milestone) => (
            <MilestoneCard
              milestone={milestone}
              game={game}
              onClaim={actions.claimMilestone}
              key={milestone.id}
            />
          ))}
        </Grid>
      </Stack>

      <Grid columns={{ xs: 1, lg: 2 }} gap="md">
        <DecisionHistory game={game} />
        <FranchiseCard game={game} onRequest={onFranchiseRequest} />
      </Grid>
    </Stack>
  )
}
