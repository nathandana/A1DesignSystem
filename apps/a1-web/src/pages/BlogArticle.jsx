import {
  Breadcrumb,
  Button,
  ButtonContainer,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { RenderPageDefinition } from '../editor/pageRenderer.tsx'
import { BLOG_POSTS, getBlogPostBySlug } from './blogPosts.js'

function textNode(type, id, fallback, props = {}) {
  return {
    type,
    id,
    props,
    content: { fallback },
  }
}

function figureNode(id, src, alt, extraProps = {}) {
  return {
    type: 'Figure',
    id,
    props: {
      src,
      alt,
      radius: 'md',
      captionSrOnly: true,
      ...extraProps,
    },
  }
}

function bodyParagraphs(body) {
  if (Array.isArray(body)) {
    return body.filter(Boolean)
  }
  return body ? [body] : []
}

function releaseReaderParagraph(post, section, index) {
  if (index === 0) {
    return `For people using A1 day to day, the useful part is practical: ${post.description} This release note is written as a product update, so you can scan what changed, understand why it matters, and decide what to try in your own workspace.`
  }

  if (index === 1) {
    return `The change also fits into the larger A1 direction: keep the system useful inside real product work, not only in documentation. ${section.title} is less about a single screen and more about making the app feel clearer, safer, and easier to return to after a week away.`
  }

  return `If you are evaluating this release, look for the small workflow details: the labels, defaults, navigation paths, and recovery states. Those are usually where A1 becomes faster for repeat use, and they are the details that shape what should land in the backlog next.`
}

function tryNextSection(post) {
  const keywordList = (post.keywords || []).slice(0, 3).join(', ')
  const videoPrompt = post.video
    ? 'Start with the walkthrough video, then repeat the same flow yourself so the shortcut, page transition, and final destination feel familiar.'
    : 'Open the related area in A1 and compare the current experience with the release story above; the most valuable improvements should be visible without reading implementation notes.'

  return {
    title: 'What to try next',
    body: [
      videoPrompt,
      `If this update touches your daily work, use the release as a checklist. Search for ${keywordList || 'the related feature'}, try the primary workflow once, and file anything confusing as a backlog ticket while the context is fresh.`,
    ],
  }
}

function articleSections(post) {
  const sections = post.sections.map((section, index) => ({
    ...section,
    body: [
      ...bodyParagraphs(section.body),
      releaseReaderParagraph(post, section, index),
    ],
  }))

  return [...sections, tryNextSection(post)]
}

function articleDefinition(post) {
  const sections = articleSections(post).map((section, index) => (
    index === 1
      ? { ...section, image: post.image, imageAlt: post.imageAlt }
      : section
  ))

  const sectionNodes = sections.map((section, index) => {
    const sectionId = `article-section-${index + 1}`
    const children = [
      textNode('Heading', `${sectionId}-title`, section.title, {
        as: index === 0 ? 'h2' : 'h3',
        type: 'heading',
        size: index === 0 ? 'xl' : 'md',
        color: 'default',
        align: 'left',
      }),
      ...bodyParagraphs(section.body).map((body, paragraphIndex) => textNode('Paragraph', `${sectionId}-body-${paragraphIndex + 1}`, body, {
        as: 'p',
        size: index === 0 && paragraphIndex === 0 ? 'lg' : 'md',
        color: 'default',
        align: 'left',
      })),
    ]
    if (section.image) {
      children.push(figureNode(`${sectionId}-figure`, section.image, section.imageAlt || '', { size: 'lg' }))
    }
    return {
      type: 'Section',
      props: {
        as: 'section',
        padding: 'md',
        surface: index % 2 === 0 ? 'raised' : 'panel',
        gap: 'sm',
        contentWidth: 'sm',
        borderStyle: 'solid',
        borderVariant: 'subtle',
        radius: 'none',
      },
      id: sectionId,
      children,
    }
  })

  return {
    schemaVersion: '1.0.0',
    page: {
      id: `blog-${post.slug}`,
      name: post.title,
      layout: {
        type: 'PageLayout',
        regions: [
          {
            id: 'main',
            name: 'Main',
            nodes: [
              {
                type: 'Section',
                props: {
                  as: 'section',
                  padding: 'lg',
                  surface: 'raised',
                  gap: 'xs',
                  contentWidth: 'md',
                  borderStyle: 'solid',
                  borderVariant: 'subtle',
                  radius: 'none',
                  inverse: true,
                },
                id: 'article-hero',
                children: [
                  textNode('MessageBadge', 'article-badge', `${post.kicker} · ${post.version}`, {
                    status: 'neutral',
                    size: 'lg',
                  }),
                  textNode('Heading', 'article-title', post.title, {
                    as: 'h1',
                    type: 'display',
                    size: 'jumbo',
                    color: 'default',
                    align: 'left',
                  }),
                  textNode('Paragraph', 'article-subtitle', post.subtitle, {
                    as: 'p',
                    size: 'xl',
                    color: 'default',
                    align: 'left',
                  }),
                ],
              },
              ...sectionNodes,
            ],
          },
        ],
      },
    },
  }
}

function bodyDefinition(post) {
  const definition = articleDefinition(post)
  const [, ...rest] = definition.page.layout.regions[0].nodes
  return {
    ...definition,
    page: {
      ...definition.page,
      layout: {
        ...definition.page.layout,
        regions: [{
          ...definition.page.layout.regions[0],
          nodes: rest,
        }],
      },
    },
  }
}

function currentSlug() {
  const path = window.location.pathname.replace(/^\/|\/$/g, '')
  return path.startsWith('blog/') ? path.slice('blog/'.length) : BLOG_POSTS[0].slug
}

export function BlogArticle({ onNavigate }) {
  const post = getBlogPostBySlug(currentSlug()) || BLOG_POSTS[0]
  const body = bodyDefinition(post)

  return (
    <>
      <Section padding="lg" contentWidth="md" surface="raised" gap="xs" inverse borderSize="sm" borderVariant="subtle">
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { label: 'Blog', href: '/blog', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('blog') } },
              { label: post.title },
            ]}
          />
          <MessageBadge status="neutral" size="lg">{post.kicker} · {post.version}</MessageBadge>
          <Heading as="h1" type="display" size="jumbo">{post.title}</Heading>
          <Paragraph size="xl">{post.subtitle}</Paragraph>
        </Stack>
      </Section>

      <RenderPageDefinition definition={body} />

      {post.video && (
        <Section padding="md" contentWidth="md" surface="raised" borderSize="sm" borderVariant="subtle" borderSides="top">
          <Stack direction="column" gap="md">
            <Stack direction="column" gap="xs">
              <Heading as="h2" size="lg">Watch the walkthrough</Heading>
              <Paragraph color="muted">
                The release video was generated from the local walkthrough pipeline and embedded as the companion demo for this article.
              </Paragraph>
            </Stack>
            <div className="a1-web-blog-video">
              <video controls preload="metadata" src={post.video}>
                <a href={post.video}>Download the walkthrough video.</a>
              </video>
            </div>
            <ButtonContainer align='center'>
            <Button icon="new_releases" variant="secondary" onClick={() => onNavigate?.('releases')}>
              Read release notes
            </Button>
            </ButtonContainer>
          </Stack>
        </Section>
      )}
    </>
  )
}
