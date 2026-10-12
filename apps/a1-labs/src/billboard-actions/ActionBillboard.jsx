import React, { useId } from 'react'
import { ActionTile, ActionTiles, Card, Grid, Heading, Icon, Paragraph, Section, Stack } from '@gtivr4/a1-design-system-react'

/** A token-native A1 composition. Content and destinations belong to the host. */
export function ActionBillboard({
  eyebrow, title, description, callout, features = [], panelTitle, panelDescription,
  actions = [], tone = 'accent', actionStyle = 'cards', showDetails = true,
  stacked = false, headingAs = 'h1',
}) {
  const titleId = useId()
  const panelId = useId()
  return <Section className="a1-billboard-actions" aria-labelledby={titleId}
    surface={tone === 'accent' ? 'var(--semantic-color-action-background-hover)' : 'panel'}
    padding={{xs:'sm',lg:'lg'}} contentWidth="xl">
    <Grid columns={stacked ? 1 : {xs:1,md:2}} gap={32} alignItems="center">
      <Card surface={tone === 'accent' ? 'accent' : 'default'} bare={tone !== 'accent'}>
        <Stack gap={32}>
          <Stack gap={16}>
            {eyebrow && <Paragraph size="sm" weight="semibold">{eyebrow}</Paragraph>}
            <Heading id={titleId} as={headingAs} type="display" size={{xs:'xl',lg:'xxl'}} textWrap="balance">{title}</Heading>
            <Paragraph size={{xs:'md',lg:'lg'}}>{description}</Paragraph>
          </Stack>
          {callout && <Stack direction="row" gap={12} align="center">
            <Icon name={callout.icon || 'event_available'} size="lg" />
            <Paragraph size="lg" weight="bold">{callout.label}</Paragraph>
          </Stack>}
          {features.length > 0 && <Stack direction="row" wrap gap={24}>
            {features.map(feature=><Stack key={feature.id} direction="row" gap={8} align="center">
              <Icon name={feature.icon} /><Paragraph size="sm">{feature.label}</Paragraph>
            </Stack>)}
          </Stack>}
        </Stack>
      </Card>
      <Section surface="page" radius="xl" padding={{xs:'sm',lg:'md'}} aria-labelledby={panelId}>
        <Stack gap={24}>
          <Stack gap={12}>
            <Heading id={panelId} as={headingAs === 'h1' ? 'h2' : 'h3'} size="lg">{panelTitle}</Heading>
            {panelDescription && <Paragraph color="muted">{panelDescription}</Paragraph>}
          </Stack>
          <nav aria-labelledby={panelId}>
            {actionStyle === 'tiles' ? <ActionTiles layout="stack" iconLayout="side">
              {actions.map(action=><ActionTile key={action.id} href={action.href} target={action.target}
                aria-label={action.target === '_blank' ? `${action.title} (opens in a new tab)` : undefined}
                rel={action.target === '_blank' ? 'noreferrer' : undefined}
                icon={action.icon} title={action.title} subtitle={showDetails ? action.description : undefined} />)}
            </ActionTiles> : <Stack gap={16}>
              {actions.map((action,index)=><Card key={action.id} variant="navigation" href={action.href}
                aria-label={action.target === '_blank' ? `${action.title} (opens in a new tab)` : undefined}
                target={action.target} rel={action.target === '_blank' ? 'noreferrer' : undefined}
                surface={index === 0 ? 'info' : 'default'}>
                <Stack direction="row" gap={16} align="center">
                  <Icon name={action.icon} size="lg" color="accent" />
                  <Stack grow gap={4}>
                    <Paragraph weight="bold">{action.title}</Paragraph>
                    {showDetails && <Paragraph size="sm" color="muted">{action.description}</Paragraph>}
                  </Stack>
                  <Icon name={action.target === '_blank' ? 'arrow_outward' : 'arrow_forward'} />
                </Stack>
              </Card>)}
            </Stack>}
          </nav>
        </Stack>
      </Section>
    </Grid>
  </Section>
}
