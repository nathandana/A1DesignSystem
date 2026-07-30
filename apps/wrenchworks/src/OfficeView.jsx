import { useState } from 'react'
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
} from '@gtivr4/a1-design-system-react'
import { getEmpireEconomy } from './gameEngine.js'
import { formatMoney, formatNumber, formatRate } from './formatters.js'
import { NoAdsMark } from './GameArt.jsx'

function PromiseCard({ icon, title, children }) {
  return (
    <Card>
      <Stack gap="sm">
        <span className="a1-wrenchworks-promise-icon" aria-hidden="true">
          <Icon name={icon} />
        </span>
        <Heading as="h2" size="sm">{title}</Heading>
        <Paragraph size="sm" color="muted">{children}</Paragraph>
      </Stack>
    </Card>
  )
}

export function OfficeView({ game, onResetRequest }) {
  const [copied, setCopied] = useState(false)
  const economy = getEmpireEconomy(game)
  const businesses = Object.values(game.businesses).filter((business) => business.unlocked).length
  const crew = Object.values(game.businesses).reduce(
    (total, business) => total + business.staff,
    0,
  )

  async function copySummary() {
    const summary = [
      `My Wrenchworks empire has ${businesses} businesses and ${crew} technicians.`,
      `It earns ${formatRate(economy.incomeRate)} and has made ${formatMoney(game.lifetimeEarned)}.`,
      `Franchises: ${formatNumber(game.franchises)}.`,
    ].join(' ')

    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Stack gap="md" className="a1-wrenchworks-screen">
      <Stack gap="xs" className="a1-wrenchworks-screen-heading">
        <Paragraph size="sm" color="muted" className="a1-wrenchworks-screen-eyebrow">
          The quiet room behind the noisy shop
        </Paragraph>
        <Heading as="h1" size="lg">Front office</Heading>
        <Paragraph color="muted" className="a1-wrenchworks-screen-intro">
          Review your save, learn how idle progress works and keep the game yours.
        </Paragraph>
      </Stack>

      <Card className="a1-wrenchworks-office-hero">
        <Stack gap="md" align="center">
          <NoAdsMark />
          <Paragraph align="center" color="muted">
            Wrenchworks has no advertising, paid currency, tracking or account. It is a
            complete game that respects your time.
          </Paragraph>
          <MessageBadge status="success" subtle icon="check_circle">
            Saved locally in this browser
          </MessageBadge>
        </Stack>
      </Card>

      <Grid columns={{ xs: 2, md: 4 }} gap="sm">
        <Card>
          <Stat
            title="Cash"
            value={formatMoney(game.cash)}
            format="none"
            icon="account_balance_wallet"
            size="sm"
          />
        </Card>
        <Card>
          <Stat
            title="Reputation"
            value={formatNumber(game.reputation)}
            format="none"
            icon="thumb_up"
            size="sm"
          />
        </Card>
        <Card>
          <Stat title="Businesses" value={businesses} icon="storefront" size="sm" />
        </Card>
        <Card>
          <Stat title="Technicians" value={crew} icon="groups" size="sm" />
        </Card>
      </Grid>

      <Grid columns={{ xs: 1, sm: 3 }} gap="md">
        <PromiseCard icon="schedule" title="Your crew keeps earning">
          Close the game whenever you want. On your next visit, the save calculates up to
          12 hours of crew income and reputation.
        </PromiseCard>
        <PromiseCard icon="save" title="Progress saves automatically">
          Every purchase, decision and reward is stored in local browser storage. No
          sign-in or connection is required after the page loads.
        </PromiseCard>
        <PromiseCard icon="accessibility_new" title="Comfort comes first">
          Controls work with a keyboard, text stays readable on small screens and motion
          follows your device preference.
        </PromiseCard>
      </Grid>

      <Card>
        <Stack gap="md">
          <Stack gap="xs">
            <Heading as="h2" size="md">Share the score, not your data</Heading>
            <Paragraph color="muted">
              Copy a short text summary of your empire. Your save never leaves this device.
            </Paragraph>
          </Stack>
          <Button
            variant="secondary"
            icon={copied ? 'check' : 'content_copy'}
            onClick={copySummary}
          >
            {copied ? 'Empire summary copied' : 'Copy empire summary'}
          </Button>
        </Stack>
      </Card>

      <Card status="error" statusLabel="Permanent action">
        <Stack gap="md">
          <Stack gap="xs">
            <Heading as="h2" size="md">Start over</Heading>
            <Paragraph color="muted">
              Delete this browser's Wrenchworks save and return to the driveway oil stand.
            </Paragraph>
          </Stack>
          <Button variant="destructive" icon="delete_forever" onClick={onResetRequest}>
            Delete save and restart
          </Button>
        </Stack>
      </Card>
    </Stack>
  )
}
