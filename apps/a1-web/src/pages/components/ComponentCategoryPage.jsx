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
    <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
      <Stack direction="column" gap="xs">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/', onClick: (e) => navigateCard(e, onNavigate, 'home') },
            { label: 'Components', href: getComponentPath('components'), onClick: (e) => navigateCard(e, onNavigate, 'components') },
            { label: category.title },
          ]}
        />
        <Heading as="h1" id={`${category.id}-category-heading`} size={{ xs: 'lg', md: 'xxl' }}>
          {category.title}
        </Heading>
        <Paragraph size="sm" color="muted">{category.body}</Paragraph>
      </Stack>
</Section>
    <Section padding="sm" contentWidth="xl" aria-labelledby={`${category.id}-category-heading`}>
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
