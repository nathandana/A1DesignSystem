import {
  Card,
  Grid,
  Heading,
  Icon,
  Link,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { version } from '../../package.json'
import { PageTitleArea } from './PageTitleArea.jsx'

// Surfaces of the app, surfaced as navigation cards.
const EXPLORE = [
  { id: 'foundations', icon: 'palette', title: 'Foundations', body: 'Colour, type, spacing, shape, motion, and icons — the tokens every component is built from.' },
  { id: 'components', icon: 'widgets', title: 'Components', body: 'Browse every component with a live configurator, properties, rules, and copy-paste code.' },
  { id: 'editor', icon: 'edit_square', title: 'Editor', body: 'Compose pages from A1 components on a canvas, then preview, prototype, and export.' },
  { id: 'theme-editor', icon: 'format_paint', title: 'Themes', body: 'Author themes from approved colour ramps and type, and apply them across the system.' },
  { id: 'backlog', icon: 'task_alt', title: 'Backlog', body: 'A shared, lightweight ticket tracker — create bugs, features, and epics from anywhere.' },
  { id: 'accessibility', icon: 'accessibility', title: 'Accessibility', body: 'The live a11y report — every component is checked for keyboard, contrast, and ARIA.' },
]

// What makes A1 what it is.
const PRINCIPLES = [
  { icon: 'account_tree', title: 'One source of truth', body: 'Every colour, space, font, radius, and motion value is a Style Dictionary token, consumed by React, HTML/CSS, and React Native alike.' },
  { icon: 'category', title: 'System first', body: 'Reach for A1 components, patterns, and layout primitives before writing custom UI — composition over one-off CSS.' },
  { icon: 'accessibility_new', title: 'Accessible by default', body: 'Semantic HTML, keyboard support, visible focus, and WCAG AA contrast are requirements, not afterthoughts.' },
  { icon: 'devices', title: 'Multi-platform', body: 'The React library is the canonical spec; HTML/CSS and React Native replicate the same design without duplicating tokens.' },
]

export function About({ onNavigate }) {
  return (
    <>
      <PageTitleArea
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
          { label: 'About' },
        ]}
        title="About A1"
        titleAccessory={<MessageBadge status="info" >Version {version}</MessageBadge>}
        description="A1 is a multi-platform, token-driven design system — and a place to design, theme, and build with it."
      />

      <Section padding="md" contentWidth="xl">
        <Stack gap="lg">
          <Stack gap="sm">
            <Heading as="h2" size="lg">What A1 is</Heading>
            <Paragraph>
              A1 covers React, HTML/CSS, and React Native from a single set of design tokens. Every visual
              decision — colour, spacing, typography, radius, shadow, motion — is defined once and shared by
              every package, so a change to a token ripples consistently everywhere. The React component
              library is the canonical reference for component behaviour and API; the other packages replicate
              the same design without re-defining the tokens.
            </Paragraph>
            <Paragraph>
              This app, <strong>a1-web</strong>, is the home for the system: an explorer for the foundations and
              components, a live page editor for composing real layouts from A1 components, a theme editor, and a
              shared backlog — with AI-assisted tools woven throughout for generating themes, finding icons, and
              drafting pages.
            </Paragraph>
          </Stack>

          <Stack gap="sm">
            <Heading as="h2" size="lg">Explore</Heading>
            <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
              {EXPLORE.map((item) => (
                <Card key={item.id} variant="navigation" icon={item.icon} onClick={() => onNavigate?.(item.id)}>
                  <Stack gap="3xs">
                    <Heading as="h3" size="sm">{item.title}</Heading>
                    <Paragraph size="sm" color="muted">{item.body}</Paragraph>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Stack>

          <Stack gap="sm">
            <Heading as="h2" size="lg">How it's built</Heading>
            <Grid columns={{ xs: 1, md: 2 }} gap="md">
              {PRINCIPLES.map((p) => (
                <Card key={p.title}>
                  <Stack direction="row" gap="sm" align="start">
                    <Icon name={p.icon} color="accent" />
                    <Stack gap="3xs">
                      <Heading as="h3" size="sm">{p.title}</Heading>
                      <Paragraph size="sm" color="muted">{p.body}</Paragraph>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Stack>
        </Stack>
      </Section>

      <Section padding="lg" contentWidth="lg" surface="panel" borderSize="sm" borderVariant="subtle" borderSides="top">
        <Stack direction="row" gap="sm" align="center" justify="between" wrap>
          <Paragraph size="sm" color="muted">
            a1-web {version} · built entirely with A1 components.
          </Paragraph>
          <Stack direction="row" gap="md" wrap>
            <Link href="/" onClick={(e) => { e?.preventDefault?.(); onNavigate?.('get-started') }}>Get started</Link>
            <Link href="/" onClick={(e) => { e?.preventDefault?.(); onNavigate?.('releases') }}>Release notes</Link>
            <Link href="/" onClick={(e) => { e?.preventDefault?.(); onNavigate?.('help') }}>Help</Link>
          </Stack>
        </Stack>
      </Section>
    </>
  )
}
