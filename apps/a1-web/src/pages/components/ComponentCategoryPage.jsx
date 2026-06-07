import {
  Card,
  Grid,
  Heading,
  MessageBadge,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { LAST_UPDATED } from './data.js'
import { getComponentPath, navigateCard } from './utils.js'

export function ComponentCategoryPage({ category, onNavigate }) {
  return (
    <Stack gap="lg">
      <Stack direction="column" gap="sm">
        <MessageBadge subtle icon={category.icon}>Component category</MessageBadge>
        <Heading as="h2" type="display" size={{ xs: 'lg', md: 'xl' }}>
          {category.title}
        </Heading>
        <Paragraph size="md" color="muted">{category.body}</Paragraph>
      </Stack>

      <div className="a1-web-components-placeholder">
        <Heading as="h3" size="md">Description and general rules</Heading>
        <Paragraph size="sm" color="muted">
          Placeholder for category-level guidance, decision rules, shared anatomy, and usage patterns that apply across {category.title.toLowerCase()} components.
        </Paragraph>
      </div>

      <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
        {category.components.map((component) => (
          <Card
            key={component.id}
            variant="navigation"
            href={getComponentPath(`component-${component.id}`)}
            onClick={(event) => navigateCard(event, onNavigate, `component-${component.id}`)}
          >
            <Stack direction="column" gap="sm">
              <Heading as="h3" size="md">{component.title}</Heading>
              <Paragraph size="sm" color="muted">{component.body}</Paragraph>
              <MessageBadge subtle>{LAST_UPDATED}</MessageBadge>
            </Stack>
          </Card>
        ))}
      </Grid>
    </Stack>
  )
}
