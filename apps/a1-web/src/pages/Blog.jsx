import { useMemo, useState } from 'react'
import {
  Card,
  Figure,
  Grid,
  Heading,
  Link,
  Paragraph,
  SearchField,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { BLOG_POSTS } from './blogPosts.js'
import { PageTitleArea } from './PageTitleArea.jsx'

function matchesPost(post, query) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    post.title,
    post.kicker,
    post.date,
    post.version,
    post.description,
    ...(post.keywords || []),
  ].join(' ').toLowerCase().includes(normalized)
}

function BlogCard({ post, onNavigate }) {
  const href = `/blog/${post.slug}`

  return (
    <article>
      <Card >
        <Stack direction="column" gap="sm">
          <Figure
            src={post.image}
            alt={post.imageAlt}
            aspectRatio="21:9"
            radius="md"
            crop="top"
            captionSrOnly
          />
          <Stack direction="column" gap="xs">
            <Paragraph size="xs" color="muted">{post.kicker} · {post.version} · {post.date}</Paragraph>
            <Heading as="h2" size="md">
              <Link
                href={href}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate?.('blog-article', { path: href })
                }}
              >
                {post.title}
              </Link>
            </Heading>
            <Paragraph size="sm" color="muted">{post.description}</Paragraph>
          </Stack>
        </Stack>
      </Card>
    </article>
  )
}

export function Blog({ onNavigate }) {
  const [query, setQuery] = useState('')
  const filteredPosts = useMemo(
    () => BLOG_POSTS.filter((post) => matchesPost(post, query)),
    [query],
  )

  return (
    <>
      <PageTitleArea
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
          { label: 'Blog' },
        ]}
        title="Blog"
        description="Release newsletters, demos, and walkthroughs from the A1 product and design system."
      >
        <SearchField
          data-a1-page-search=""
          placeholder="Search releases, demos, or topics"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
        />
      </PageTitleArea>

      <Section padding="md" contentWidth="xl">
        <Stack direction="column" gap="lg">

          {filteredPosts.length > 0 ? (
            <Grid columns={{ xs: 1, md: 2, xl: 3 }} gap="xl">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} onNavigate={onNavigate} />
              ))}
            </Grid>
          ) : (
            <Stack direction="column" gap="xs">
              <Heading as="h2" size="md">No matching articles</Heading>
              <Paragraph color="muted">Try a different release, feature, or topic.</Paragraph>
            </Stack>
          )}
        </Stack>
      </Section>
    </>
  )
}
