import {
  Code,
  Heading,
  Link,
  List,
  ListItem,
  Paragraph,
  Section,
  Stack,
  useLabel,
} from '@gtivr4/a1-design-system-react'
import contentStandardsMarkdown from '../../../../../packages/react/guidelines/content-standards.md?raw'
import { PageTitleArea } from '../PageTitleArea.jsx'
import { parseContentStandards } from './contentStandardsParser.js'
import { getFoundationBreadcrumbItems } from './utils.js'

const contentStandards = parseContentStandards(contentStandardsMarkdown)
const INLINE_MARKDOWN = /\*\*(.+?)\*\*|`(.+?)`|\[([^\]]+)\]\(([^)]+)\)/g

function inlineContent(text) {
  const nodes = []
  let lastIndex = 0
  let match
  INLINE_MARKDOWN.lastIndex = 0

  while ((match = INLINE_MARKDOWN.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    if (match[1] != null) {
      nodes.push(<strong key={match.index}>{match[1]}</strong>)
    } else if (match[2] != null) {
      nodes.push(<Code key={match.index} variant="inline">{match[2]}</Code>)
    } else {
      nodes.push(
        <Link key={match.index} href={match[4]}>
          {match[3]}
        </Link>,
      )
    }
    lastIndex = INLINE_MARKDOWN.lastIndex
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

function ContentBlock({ block }) {
  if (block.type === 'paragraph') {
    return <Paragraph size="md">{inlineContent(block.text)}</Paragraph>
  }
  if (block.type === 'code') {
    return <Code variant="block" wrapping>{block.text}</Code>
  }
  if (block.type === 'list') {
    return (
      <List as={block.ordered ? 'ol' : 'ul'} variant={block.ordered ? 'ordered' : 'unordered'} size="md">
        {block.items.map((item) => (
          <ListItem key={item}>{inlineContent(item)}</ListItem>
        ))}
      </List>
    )
  }
  return null
}

function headingId(title) {
  return `content-standards-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

export function ContentStandardsFoundationPage({ onNavigate }) {
  const title = useLabel('app.contentStandards.title', contentStandards.title)
  const intro = contentStandards.intro.find((block) => block.type === 'paragraph')?.text ?? ''
  const description = useLabel('app.contentStandards.introduction', intro)

  return (
    <>
      <PageTitleArea
        headingId="content-standards-heading"
        breadcrumbItems={getFoundationBreadcrumbItems(title, onNavigate)}
        title={title}
        description={description}
      />

      <Section padding="sm" contentWidth="md" aria-label={title}>
        <Stack gap="xl">
          {contentStandards.sections.map((section) => {
            const id = headingId(section.title)
            return (
              <Stack key={section.title} gap="md">
                <Heading as="h2" id={id} type="display" size={{ xs: 'lg', md: 'xl' }}>
                  {section.title}
                </Heading>
                {section.blocks.map((block, index) => (
                  <ContentBlock key={`${section.title}-${block.type}-${index}`} block={block} />
                ))}
              </Stack>
            )
          })}
        </Stack>
      </Section>
    </>
  )
}
