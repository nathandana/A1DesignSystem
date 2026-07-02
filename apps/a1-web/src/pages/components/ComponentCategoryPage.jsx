import {
  Card,
  Grid,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { PageTitleArea } from '../PageTitleArea.jsx'
import { LAST_UPDATED } from './data.js'
import { getComponentPath, navigateCard } from './utils.js'

function sortByTitle(a, b) {
  return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
}

export function ComponentCategoryPage({ category, onNavigate }) {
  const components = [...category.components].sort(sortByTitle)

  return (
    <>
    <PageTitleArea
      headingId={`${category.id}-category-heading`}
      breadcrumbItems={[
        { label: 'Home', href: '/', onClick: (e) => navigateCard(e, onNavigate, 'home') },
        { label: 'Components', href: getComponentPath('components'), onClick: (e) => navigateCard(e, onNavigate, 'components') },
        { label: category.title },
      ]}
      title={category.title}
      description={category.body}
    />
    <Section padding="sm" contentWidth="xl" aria-labelledby={`${category.id}-category-heading`}>
      <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
        {components.map((component) => (
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
