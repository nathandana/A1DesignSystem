import {
  Accordion, Button, Code, Divider, Heading, Link, PageTitle, Paragraph, Section, Stack,
} from '@gtivr4/a1-design-system-react'
import { useT } from '../labels/useT.js'

const endpoint = 'https://mcp.a1design.app/mcp'
const agents = [
  { id: 'codex', command: `codex mcp add a1 --url ${endpoint}`, docs: 'https://developers.openai.com/codex/mcp', context: 'https://developers.openai.com/codex/guides/agents-md' },
  { id: 'claude', command: `claude mcp add --transport http --scope project a1 ${endpoint}`, docs: 'https://code.claude.com/docs/en/mcp', context: 'https://code.claude.com/docs/en/memory' },
  { id: 'cursor', command: JSON.stringify({ mcpServers: { a1: { url: endpoint } } }, null, 2), docs: 'https://cursor.com/docs/mcp', context: 'https://cursor.com/docs/rules' },
  { id: 'gemini', command: `gemini mcp add --transport http a1 ${endpoint}`, docs: 'https://geminicli.com/docs/tools/mcp-server/', context: 'https://geminicli.com/docs/cli/gemini-md/' },
]

export function DesignWithA1() {
  const t = useT()
  const label = key => t(`designWithA1.${key}`)
  return (
    <>
      <PageTitle
        title={label('title')}
        description={label('intro')}
        contentWidth="md"
        backLabel={t('app.page.home', 'Home')}
        breadcrumb={[{ label: t('app.page.home', 'Home'), href: '/' }, { label: label('title') }]}
        actions={<Button as="a" href="/design.md" download="design.md" icon="download">{label('download')}</Button>}
      />
      <Section as="article" contentWidth="md" padding={{ xs: 'sm', md: 'lg' }} gap="xl" aria-label={label('title')}>
        <Stack as="section" gap="md" aria-labelledby="design-react">
          <Heading as="h2" id="design-react">{label('reactTitle')}</Heading>
          <Paragraph>{label('reactBody')}</Paragraph>
          <Code variant="block" wrapping copyCode>{'npm install @gtivr4/a1-design-system-react'}</Code>
          <Paragraph>{label('setupBody')}</Paragraph>
          <Link href="/react-setup.md">{label('setupLink')}</Link>
          <Heading as="h3">{label('promptTitle')}</Heading>
          <Code variant="block" wrapping copyCode>{label('reactPrompt')}</Code>
        </Stack>
        <Divider />
        <Stack as="section" gap="md" aria-labelledby="design-agents">
          <Heading as="h2" id="design-agents">{label('agentsTitle')}</Heading>
          <Paragraph>{label('agentsBody')}</Paragraph>
          <Code variant="block" wrapping copyCode>{endpoint}</Code>
          {agents.map(agent => (
            <Accordion key={agent.id} label={label(agent.id)} divider>
              <Stack gap="md">
                <Paragraph>{label(`${agent.id}Body`)}</Paragraph>
                <Code variant="block" wrapping copyCode>{agent.command}</Code>
                <Stack direction="row" wrap gap="md">
                  <Link href={agent.docs}>{label('docsLink')}</Link>
                  <Link href={agent.context}>{label('contextLink')}</Link>
                </Stack>
              </Stack>
            </Accordion>
          ))}
          <Accordion label={label('otherTitle')} divider>
            <Paragraph>{label('otherBody')}</Paragraph>
          </Accordion>
        </Stack>
        <Divider />
        <Stack as="section" gap="md" aria-labelledby="design-json">
          <Heading as="h2" id="design-json">{label('jsonTitle')}</Heading>
          <Paragraph>{label('jsonBody')}</Paragraph>
          <Code variant="block" wrapping copyCode>{label('jsonPrompt')}</Code>
          <Stack direction="row" wrap gap="md">
            <Link href="/projects">{label('projectsLink')}</Link>
            <Link href="/a1-agent-brief.md">{label('modelLink')}</Link>
          </Stack>
        </Stack>
        <Divider />
        <Stack as="section" gap="md" aria-labelledby="design-context">
          <Heading as="h2" id="design-context">{label('designTitle')}</Heading>
          <Paragraph>{label('designBody')}</Paragraph>
          <Stack direction="row" wrap gap="md">
            <Link href="/design.md" download="design.md">{label('download')}</Link>
            <Link href="https://github.com/google-labs-code/design.md/blob/main/docs/spec.md">{label('specLink')}</Link>
          </Stack>
        </Stack>
      </Section>
    </>
  )
}
