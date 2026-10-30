import { useT } from '../../labels/useT.js'
import {
  Card,
  Grid,
  Heading,
  MessageBadge,
  PageTitle,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { componentsCatalog } from './catalog.js'
import { navigateCard } from './utils.js'

function sortByTitle(a, b) {
  return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
}

/** A catalogue category: one navigation card per item in it. */
export function CatalogCategoryPage({ catalog = componentsCatalog, category, onNavigate }) {
  const t = useT()
  const items = [...category.items].sort(sortByTitle)

  return (
    <>
    <PageTitle
      titleId={`${category.id}-category-heading`}
      breadcrumb={catalog.getBreadcrumbItems({ category }, onNavigate, t)}
      title={category.title}
      description={category.body}
    />
    <Section padding="sm" contentWidth="xl" aria-labelledby={`${category.id}-category-heading`}>
      <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
        {items.map((item) => {
          const pageId = catalog.itemPageId(item.id)
          return (
            <Card
              key={item.id}
              variant="navigation"
              icon={item.icon}
              href={catalog.getPath(pageId)}
              onClick={(event) => navigateCard(event, onNavigate, pageId)}
            >
              <Stack direction="column" gap="xs">
                <Heading as="h3" size="sm">{item.titleKey ? t(item.titleKey, item.title) : item.title}</Heading>
                <Paragraph size="xs" color="muted">{item.bodyKey ? t(item.bodyKey, item.body) : item.body}</Paragraph>
                <MessageBadge size='sm' subtle>{catalog.lastUpdated}</MessageBadge>
              </Stack>
            </Card>
          )
        })}
      </Grid>
    </Section>
    </>
  )
}

export function ComponentCategoryPage(props) {
  return <CatalogCategoryPage catalog={componentsCatalog} {...props} />
}
