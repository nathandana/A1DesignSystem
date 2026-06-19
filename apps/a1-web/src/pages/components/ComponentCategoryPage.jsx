import {
  Breadcrumb,
  Card,
  Grid,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { LAST_UPDATED } from './data.js'
import { getComponentPath, navigateCard } from './utils.js'

export function ComponentCategoryPage({ category, onNavigate }) {
  return (
    <>
    <Section padding="xs" surface='panel'>
      <Stack direction="column" gap="sm">
        <Breadcrumb
          items={[
            { label: 'Components', href: getComponentPath('components'), onClick: (e) => navigateCard(e, onNavigate, 'components') },
            { label: category.title },
          ]}
        />
        <Heading as="h2" size={{ xs: 'lg', md: 'xl' }}>
          {category.title}
        </Heading>
        <Paragraph size="sm" color="muted">{category.body}</Paragraph>
      </Stack>
</Section>
    <Section padding="sm" contentWidth='xl'>
    <Section   padding="xs"
  surface="raised"
  gap="sm"
  borderSize="md"
  borderStyle="dashed"
  radius="lg">

        <Heading as="h3" size="md">Description and general rules</Heading>
        <Paragraph size="sm" color="muted">
          Placeholder for category-level guidance, decision rules, shared anatomy, and usage patterns that apply across {category.title.toLowerCase()} components.
        </Paragraph>
</Section>
</Section>
    <Section padding="sm" contentWidth='xl'>

      <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
        {category.components.map((component) => (
          <Card
            key={component.id}
            variant="navigation"
            icon={component.icon}
            href={getComponentPath(`component-${component.id}`)}
            onClick={(event) => navigateCard(event, onNavigate, `component-${component.id}`)}
          >
            <Stack direction="column" gap="xs">
              <Heading as="h3" size="sm">{component.title}</Heading>
              <Paragraph size="xs" color="muted">{component.body}</Paragraph>
              <MessageBadge size='sm' subtle>{LAST_UPDATED}</MessageBadge>
            </Stack>
          </Card>
        ))}
      </Grid>
    </Section>
    </>
  )
}
