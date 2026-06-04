import {
  Button,
  ButtonContainer,
  Card,
  Grid,
  Heading,
  Icon,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'

const stats = [
  { value: '40+', label: 'Components' },
  { value: '3', label: 'Platforms' },
  { value: '4', label: 'Themes' },
  { value: '200+', label: 'Tokens' },
]

const features = [
  {
    icon: 'token',
    title: 'Token-driven',
    body: 'Every color, spacing unit, typography value, and radius traces to a Style Dictionary token. No raw values anywhere in the system.',
  },
  {
    icon: 'hub',
    title: 'Multi-platform',
    body: 'React, HTML/CSS, and React Native share the same token foundations. Design once — express consistently across every surface.',
  },
  {
    icon: 'auto_awesome',
    title: 'AI-ready',
    body: 'Structured tokens and component rules give agents clear, machine-readable constraints for consistent, on-brand output.',
  },
  {
    icon: 'accessibility_new',
    title: 'Accessible',
    body: 'WCAG AA contrast, keyboard navigation, and screen reader labels are built into every component — not retrofitted.',
  },
]

const componentCategories = [
  { icon: 'text_fields', label: 'Typography', count: 6 },
  { icon: 'navigation', label: 'Navigation', count: 6 },
  { icon: 'smart_button', label: 'Actions', count: 4 },
  { icon: 'edit', label: 'Inputs', count: 9 },
  { icon: 'notifications', label: 'Feedback', count: 6 },
  { icon: 'grid_view', label: 'Layout', count: 11 },
  { icon: 'table_chart', label: 'Data', count: 2 },
  { icon: 'layers', label: 'Overlay', count: 2 },
]

const platforms = [
  {
    icon: 'code',
    title: 'React',
    body: 'Fully typed components with a stable prop API. Every visual value comes from CSS custom properties — never inline styles.',
    tag: 'packages/react',
  },
  {
    icon: 'style',
    title: 'HTML / CSS',
    body: 'BEM-style classes and scoped utility classes for use on any page without a framework.',
    tag: 'packages/html-css',
  },
  {
    icon: 'phone_iphone',
    title: 'React Native',
    body: 'Token-driven mobile components that share the same design language as the web packages.',
    tag: 'packages/react-native',
  },
]

export function Home({ onNavigate }) {
  return (
    <>
      {/* ── Hero ── */}
      <Section
        padding="lg"
        height="hero"
        inverse
        contentWidth="md"
        gap="lg"
        alignment="center"
        gradient="accent"
        gradientPosition="center"
        aria-labelledby="hero-heading"
      >
        {/*
          No align="center" on Stack — ButtonContainer uses container queries that
          require full width to render buttons in row mode. Section alignment="center"
          centers direct children as layout items. ButtonContainer align="center" handles buttons.
        */}
          <MessageBadge icon="auto_awesome">
            AI-first design system
          </MessageBadge>

          <Heading
            as="h1"
            id="hero-heading"
            type="display"
            align="center"
            size={{ xs: 'xl', md: 'xxl', lg: 'jumbo' }}
            textWrap="balance"
          >
            The design system<br />built for the&nbsp;AI&nbsp;era.
          </Heading>

          <Paragraph size={{ xs: 'md', md: 'lg', lg: 'xl' }} color="muted" align="center">
            40+ production-ready components across React, HTML/CSS, and React Native — all driven by a single Style Dictionary token source.
          </Paragraph>

          <ButtonContainer align="center" size="lg">
            <Button
              variant="primary"
              icon="arrow_forward"
              iconPosition="end"
              onClick={() => onNavigate('components')}
            >
              Explore components
            </Button>
            <Button
              variant="secondary"
              icon="auto_stories"
              iconPosition="start"
              as="a"
              href="../../storybook-static/"
            >
              View Storybook
            </Button>
          </ButtonContainer>
      </Section>

      {/* ── Stats strip ── */}
      <Section padding="sm" surface="raised" contentWidth="lg" alignment="center" aria-label="System statistics">
        <Grid columns={{ xs: 2, sm: 4 }} gap="md">
          {stats.map((stat) => (
            <div key={stat.label} className="a1-web-stat">
              <Heading as="p" type="display" size={{ xs: 'md', md: 'lg', lg: 'xl' }}>
                {stat.value}
              </Heading>
              <Paragraph size={{ xs: 'sm', md: 'md', lg: 'lg' }} color="muted">
                <strong>{stat.label}</strong>
              </Paragraph>
            </div>
          ))}
        </Grid>
      </Section>

      {/* ── Features ── */}
      <Section padding="lg" contentWidth="lg" aria-labelledby="features-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge icon="hub">
              How it works
            </MessageBadge>
            <Heading as="h2" type="display" id="features-heading" size={{ xs: 'lg', md: 'xl' }}>
              Four foundations. One system.
            </Heading>
            <Paragraph size="lg" color="muted" className="a1-web-section-body">
              A1 is built on four principles that work together to keep every platform, every agent, and every contributor aligned.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="lg">
            {features.map((feature) => (
              <Card key={feature.title}>
                <Stack direction="column" gap="sm">
                  <span className="a1-web-feature-card__icon" aria-hidden="true">
                    <Icon name={feature.icon} />
                  </span>
                  <Heading as="h3" size="md">
                    {feature.title}
                  </Heading>
                  <Paragraph size="md" color="muted">
                    {feature.body}
                  </Paragraph>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>

      {/* ── Component categories ── */}
      <Section padding="lg" contentWidth="lg" surface="panel" aria-labelledby="components-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge icon="widgets">
              Components
            </MessageBadge>
            <Heading as="h2" type="display" id="components-heading" size={{ xs: 'lg', md: 'xl' }}>
              40+ components, eight categories.
            </Heading>
            <Paragraph size="lg" color="muted">
              From typography primitives to complex data tables — everything fully tokenized, accessible, and responsive.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 2, sm: 4 }} gap="sm">
            {componentCategories.map((cat) => (
              <Card
                key={cat.label}
                shadow="xs"
                className="a1-web-category-card"
                as="button"
                type="button"
                onClick={() => onNavigate('components')}
              >
                <span className="a1-web-category-card__icon" aria-hidden="true">
                  <Icon name={cat.icon} />
                </span>
                <Heading as="span" size="xs" align="left">
                  {cat.label}
                </Heading>
                <Paragraph size="sm" align="left" color="muted">
                  {cat.count} components
                </Paragraph>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>

      {/* ── Platforms ── */}
      <Section padding="lg" inverse alignment="center" contentWidth="lg" aria-labelledby="platforms-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge subtle icon="devices">
              Platforms
            </MessageBadge>
            <Heading as="h2" id="platforms-heading" size={{ xs: 'lg', md: 'xl' }} align="center">
              One token source. Every surface.
            </Heading>
            <Paragraph size="lg" color="muted" align="center" className="a1-web-section-body">
              The same token foundations power web, HTML, and mobile. No duplication, no drift.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 3 }} gap="md">
            {platforms.map((platform) => (
              <Card key={platform.title} shadow="sm">
                <Stack direction="column" gap="sm">
                  <span className="a1-web-platform-card__icon" aria-hidden="true">
                    <Icon name={platform.icon} />
                  </span>
                  <Heading as="h3" size="md">
                    {platform.title}
                  </Heading>
                  <Paragraph size="sm" color="muted">
                    {platform.body}
                  </Paragraph>
                  <code className="a1-web-platform-card__tag">{platform.tag}</code>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>

      {/* ── Themes ── */}
      <Section padding="lg" aria-labelledby="themes-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge subtle icon="palette">
              Themes
            </MessageBadge>
            <Heading as="h2" id="themes-heading" size={{ xs: 'lg', md: 'xl' }}>
              Four themes. Zero rework.
            </Heading>
            <Paragraph size="lg" color="muted" className="a1-web-section-body">
              Switch between light, accessible, and heritage themes by changing a single data attribute. Components respond automatically.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2, md: 4 }} gap="md">
            {[
              { name: 'Base', desc: 'The global token baseline — active on every page by default.', selector: ':root' },
              { name: 'A1 Light', desc: 'Standard brand expression. Clean and production-ready.', selector: "data-theme='a1-light'" },
              { name: 'Accessible', desc: 'High-contrast variant for elevated readability.', selector: "data-theme='accessible'" },
              { name: 'Heritage', desc: 'Legacy brand palette for backward-compatible surfaces.', selector: "data-theme='heritage'" },
            ].map((theme) => (
              <Card key={theme.name} shadow="xs">
                <Stack direction="column" gap="xs">
                  <Heading as="h3" size="sm">
                    {theme.name}
                  </Heading>
                  <Paragraph size="sm" color="muted">
                    {theme.desc}
                  </Paragraph>
                  <code className="a1-web-theme-card__selector">{theme.selector}</code>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>

      {/* ── CTA ── */}
      <Section
        padding="lg"
        gradient="accent"
        gradientPosition="top-right"
        contentWidth="sm"
        alignment="center"
        aria-labelledby="cta-heading"
      >
        <Stack direction="column" gap="lg">
          <Heading as="h2" id="cta-heading" type="display" size={{ xs: 'lg', md: 'xl' }} align="center">
            Start building with A1.
          </Heading>
          <Paragraph size="lg" color="muted" align="center">
            Explore components, read the token docs, or open the system in Storybook.
          </Paragraph>
          <ButtonContainer align="center">
            <Button
              variant="primary"
              icon="arrow_forward"
              iconPosition="end"
              onClick={() => onNavigate('components')}
            >
              Explore components
            </Button>
            <Button
              variant="secondary"
              icon="description"
              iconPosition="start"
              onClick={() => onNavigate('tokens')}
            >
              Browse tokens
            </Button>
          </ButtonContainer>
        </Stack>
      </Section>
    </>
  )
}
