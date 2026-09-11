import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  ButtonContainer,
  Card,
  Grid,
  GridItem,
  Heading,
  Icon,
  Link,
  MessageEmptyState,
  Paragraph,
  SearchField,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { HELP_CONTENT } from '../help/helpContent.jsx'
import { matchHelpArticle } from '../help/helpModel.jsx'
import { useT } from '../labels/useT.js'
import { PageTitleArea } from './PageTitleArea.jsx'

export const HELP_ARTICLE_PAGE_PREFIX = 'help-article-'

export function helpArticlePageId(articleId) {
  return `${HELP_ARTICLE_PAGE_PREFIX}${articleId}`
}

export function helpArticleIdFromPage(pageId) {
  return pageId?.startsWith(HELP_ARTICLE_PAGE_PREFIX)
    ? pageId.slice(HELP_ARTICLE_PAGE_PREFIX.length)
    : null
}

export function getHelpArticlePath(articleId) {
  return `/help/${articleId}`
}

export const HELP_ARTICLES = HELP_CONTENT.flatMap((category) =>
  category.articles.map((article) => ({ ...article, category })),
)

export const HELP_ARTICLE_PAGE_IDS = HELP_ARTICLES.map((article) => helpArticlePageId(article.id))

export const HELP_ARTICLE_PAGE_TITLES = Object.fromEntries(
  HELP_ARTICLES.map((article) => [helpArticlePageId(article.id), article.title]),
)

function isPlainLeftClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

function navigateToHelp(event, onNavigate, articleId = null) {
  if (!isPlainLeftClick(event)) return
  event.preventDefault()
  onNavigate?.(articleId ? helpArticlePageId(articleId) : 'help')
}

function RelatedHelpArticles({ article, onNavigate }) {
  const t = useT()
  const relatedArticles = article.category.articles.filter((candidate) => candidate.id !== article.id)

  if (!relatedArticles.length) return null

  return (
    <Card>
      <nav aria-label={t('app.page.helpRelatedArticles', 'Related articles')}>
        <Stack direction="column" gap="sm">
          <Heading as="h2" size="sm">
            {t('app.page.helpRelatedArticles', 'Related articles')}
          </Heading>
          <Stack direction="column" gap="xs">
            {relatedArticles.map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                href={getHelpArticlePath(relatedArticle.id)}
                onClick={(event) => navigateToHelp(event, onNavigate, relatedArticle.id)}
              >
                {relatedArticle.title}
              </Link>
            ))}
          </Stack>
        </Stack>
      </nav>
    </Card>
  )
}

function HelpIndex({ initialQuery, onNavigate }) {
  const t = useT()
  const [query, setQuery] = useState(initialQuery || '')

  useEffect(() => {
    setQuery(initialQuery || '')
  }, [initialQuery])

  const normalizedQuery = query.trim().toLowerCase()
  const tokens = useMemo(() => normalizedQuery.split(/\s+/).filter(Boolean), [normalizedQuery])
  const filtered = useMemo(
    () => HELP_CONTENT.map((category) => ({
      ...category,
      articles: category.articles.filter((article) => matchHelpArticle(article, tokens)),
    })).filter((category) => category.articles.length > 0),
    [tokens],
  )
  const searching = tokens.length > 0
  const resultCount = filtered.reduce((sum, category) => sum + category.articles.length, 0)

  return (
    <>
      <PageTitleArea
        headingId="help-heading"
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (event) => { event?.preventDefault?.(); onNavigate?.('home') } },
          { label: 'Help' },
        ]}
        title="Help"
        description={t('app.page.helpDescription', 'Search guides for the editor, projects, components, themes, data, and A1 workflows.')}
      >
        <SearchField
          data-a1-page-search=""
          label={t('app.page.helpSearchLabel', 'Search help')}
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
        />
      </PageTitleArea>

      <Section padding="sm" contentWidth="xl" aria-labelledby="help-heading">
        <Stack direction="column" gap="lg">
          {searching && (
            <Paragraph size="sm" color="muted">
              {resultCount} {resultCount === 1 ? 'result' : 'results'} for "{query.trim()}"
            </Paragraph>
          )}

          {filtered.length === 0 ? (
            <MessageEmptyState
              icon="search_off"
              title="No matching help"
              description={'Try a different word — e.g. "drag", "prototype", "shortcut", or a component name.'}
              action={<Button variant="secondary" onClick={() => setQuery('')}>Clear search</Button>}
            />
          ) : (
            filtered.map((category) => (
              <Stack key={category.id} direction="column" gap="sm">
                  <Heading as="h2" size="lg">{category.title}</Heading>
                <Stack direction="column" gap="lg">
                  {category.articles.map((article) => (
                    <article key={article.id}>
                      <Stack direction="column" gap="xs">
                        <Heading as="h3" size="sm">
                          <Link
                            href={getHelpArticlePath(article.id)}
                            onClick={(event) => navigateToHelp(event, onNavigate, article.id)}
                          >
                            {article.title}
                          </Link>
                        </Heading>
                        <Paragraph size="sm" color="muted">{article.summary}</Paragraph>
                      </Stack>
                    </article>
                  ))}
                </Stack>
              </Stack>
            ))
          )}

          <Section padding="md" surface="panel" radius="md" gap="sm">
            <Heading as="h2" size="sm">Ready to build?</Heading>
            <Paragraph size="sm" color="muted">Jump into the editor and try these features on the sample project.</Paragraph>
            <ButtonContainer align="start">
              <Button icon="arrow_forward" onClick={() => onNavigate?.('editor')}>Open the editor</Button>
            </ButtonContainer>
          </Section>
        </Stack>
      </Section>
    </>
  )
}

function HelpArticle({ articleId, onNavigate }) {
  const t = useT()
  const article = HELP_ARTICLES.find((candidate) => candidate.id === articleId)
  if (!article) return <HelpIndex onNavigate={onNavigate} />

  return (
    <>
      <PageTitleArea
        headingId="help-article-heading"
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (event) => { event?.preventDefault?.(); onNavigate?.('home') } },
          { label: 'Help', href: '/help', onClick: (event) => navigateToHelp(event, onNavigate) },
          { label: article.title },
        ]}
        title={article.title}
        description={article.summary}
      />

      <Section padding="sm" contentWidth="xl" aria-labelledby="help-article-heading">
        <Grid columns={{ xs: 1, lg: 3 }} gap="xl">
          <GridItem span={{ xs: 1, lg: 2 }}>
            <article>
              <Stack direction="column" gap="lg">
                {article.body}
                <Link href="/help" onClick={(event) => navigateToHelp(event, onNavigate)}>
                  {t('app.page.helpBackToAllArticles', 'Back to all help articles')}
                </Link>
              </Stack>
            </article>
          </GridItem>
          <GridItem span={{ xs: 1, lg: 1 }}>
            <RelatedHelpArticles article={article} onNavigate={onNavigate} />
          </GridItem>
        </Grid>
      </Section>
    </>
  )
}

export function Help({ articleId = null, initialQuery = '', onNavigate }) {
  return articleId
    ? <HelpArticle articleId={articleId} onNavigate={onNavigate} />
    : <HelpIndex initialQuery={initialQuery} onNavigate={onNavigate} />
}
