import React from 'react'
import { Button, Card, Grid, Heading, Paragraph, Section, Stack } from '@gtivr4/a1-design-system-react'

// The sample page every page-loading experiment loads: a small waterfront
// restaurant. Its main pieces are plain wrappers marked data-loading-block, so
// loaders can find them (and use the wrappers' ::before/::after) without
// touching A1 components.

const FEATURES = [
  ['Fresh catch', 'Whatever the boats bring in this morning.'],
  ['Sunset deck', 'Thirty seats over the water, first come first served.'],
  ['Small plates', 'Made for sharing, best with friends.'],
]

export function SamplePage() {
  return (
    <Section padding="sm" gap="md" aria-label="Sample page">
      <div data-loading-block>
        <Stack direction="row" justify="between" align="center" gap={12}>
          <Heading as="p" size="sm">Harbor House</Heading>
          <Paragraph size="sm" color="muted">Open today 11–10</Paragraph>
        </Stack>
      </div>
      <div data-loading-block>
        <Stack gap={8}>
          <Paragraph size="sm" color="muted">Waterfront kitchen</Paragraph>
          <Heading as="h1" size="lg">Plan your evening by the water.</Heading>
          <Paragraph color="muted">Seasonal plates, a long view of the harbor and a table waiting for you.</Paragraph>
        </Stack>
      </div>
      <Grid columns={{ xs: 1, md: 3 }} gap={16}>
        {FEATURES.map(([title, text]) => (
          <div key={title} data-loading-block>
            <Card>
              <Stack gap={4}>
                <Heading as="h2" size="sm">{title}</Heading>
                <Paragraph size="sm" color="muted">{text}</Paragraph>
              </Stack>
            </Card>
          </div>
        ))}
      </Grid>
      <div data-loading-block>
        <Button fullWidth icon="restaurant">Book a table</Button>
      </div>
    </Section>
  )
}
