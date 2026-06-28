import {
  Button,
  ButtonContainer,
  Card,
  Grid,
  Heading,
  Inset,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { useT } from '../labels/useT.js'

export function Home({ onNavigate }) {
  const t = useT()

  const stats = [
    { value: '60+', label: t('app.home.statComponents', 'Components') },
    { value: '4', label: t('app.home.statPlatforms', 'Platforms') },
    { value: '4', label: t('app.home.statThemes', 'Themes') },
    { value: '200+', label: t('app.home.statTokens', 'Tokens') },
  ]

  const features = [
    {
      icon: 'token',
      title: t('app.home.featureTokenTitle', 'Token-driven'),
      body: t('app.home.featureTokenBody', 'Every color, spacing unit, typography value, and radius traces to a Style Dictionary token. No raw values anywhere in the system.'),
    },
    {
      icon: 'hub',
      title: t('app.home.featureMultiTitle', 'Multi-platform'),
      body: t('app.home.featureMultiBody', 'React, HTML/CSS, and React Native share the same token foundations. Design once — express consistently across every surface.'),
    },
    {
      icon: 'auto_awesome',
      title: t('app.home.featureAiTitle', 'AI-ready'),
      body: t('app.home.featureAiBody', 'Structured tokens and component rules give agents clear, machine-readable constraints for consistent, on-brand output.'),
    },
    {
      icon: 'accessibility_new',
      title: t('app.home.featureA11yTitle', 'Accessible'),
      body: t('app.home.featureA11yBody', 'WCAG AA contrast, keyboard navigation, and screen reader labels are built into every component — not retrofitted.'),
    },
  ]

  const componentCategories = [
    { icon: 'text_fields', label: t('app.home.catTypography', 'Typography'), count: 6 },
    { icon: 'navigation', label: t('app.home.catNavigation', 'Navigation'), count: 6 },
    { icon: 'smart_button', label: t('app.home.catActions', 'Actions'), count: 4 },
    { icon: 'edit', label: t('app.home.catInputs', 'Inputs'), count: 9 },
    { icon: 'notifications', label: t('app.home.catFeedback', 'Feedback'), count: 6 },
    { icon: 'grid_view', label: t('app.home.catLayout', 'Layout'), count: 11 },
    { icon: 'table_chart', label: t('app.home.catData', 'Data'), count: 2 },
    { icon: 'layers', label: t('app.home.catOverlay', 'Overlay'), count: 2 },
  ]

  const platforms = [
    {
      icon: 'code',
      title: 'React',
      body: t('app.home.platformReactBody', 'Fully typed components with a stable prop API. Every visual value comes from CSS custom properties — never inline styles.'),
      tag: 'packages/react',
    },
    {
      icon: 'palette',
      title: 'HTML / CSS',
      body: t('app.home.platformHtmlBody', 'BEM-style classes and scoped utility classes for use on any page without a framework.'),
      tag: 'packages/pure',
    },
    {
      icon: 'phone_iphone',
      title: 'React Native',
      body: t('app.home.platformNativeBody', 'Token-driven mobile components that share the same design language as the web packages.'),
      tag: 'packages/react-native',
    },
  ]

  const themes = [
    { name: 'Base', desc: t('app.home.themeBaseDesc', 'The global token baseline — active on every page by default.'), selector: ':root' },
    { name: 'A1 Light', desc: t('app.home.themeA1LightDesc', 'Standard brand expression. Clean and production-ready.'), selector: "data-theme='a1-light'" },
    { name: 'Accessible', desc: t('app.home.themeAccessibleDesc', 'High-contrast variant for elevated readability.'), selector: "data-theme='accessible'" },
    { name: 'Heritage', desc: t('app.home.themeHeritageDesc', 'Legacy brand palette for backward-compatible surfaces.'), selector: "data-theme='heritage'" },
  ]

  return (
    <>
      {/* ── Hero ── */}
      <Section
        padding="lg"
        height="hero"
        inverse
        contentWidth="md"
        gap="lg"
        align="center"
        gradient="accent"
        gradientPosition="center"
        aria-labelledby="hero-heading"
      >
<Stack direction="column" gap="xs" align="center">
          <Heading
            as="h1"
            id="hero-heading"
            type="display"
            color="accent"
            align="center"
            size={{ xs: 'xl', md: 'xxl', lg: 'xJumbo' }}
            textWrap="balance"
          >
            A1:Design
          </Heading>
          <Heading
            as="h1"
            id="hero-heading"
            type="display"
            align="center"
            size={{ xs: 'xl', md: 'xxl' }}
            textWrap="balance"
          >
            {t('app.home.heroTagline', 'By the rules')}
          </Heading>
</Stack>
          <Paragraph size={{ xs: 'md', md: 'lg', lg: 'lg' }} align="center">
            {t('app.home.heroParagraph', 'A1 is a rules based eco system. Rooted in a singular and clear source of truth. Explore components in multiple tech stacks, create custom themes, build entire projects with built in data. Use AI tools to assist, not drift.')}
          </Paragraph>

          <ButtonContainer align="center">
            <Button
              variant="primary"
              icon="arrow_forward"
              iconPosition="end"
              onClick={() => onNavigate('editor')}
            >
              {t('app.home.buildProject', 'Build a project')}
            </Button>
            <Button
              variant="secondary"
              icon="arrow_forward"
              iconPosition="end"
              onClick={() => onNavigate('backlog')}
            >
              {t('app.home.viewBacklog', 'View backlog')}
            </Button>
            <Button
              variant="secondary"
              icon="widgets"
              iconPosition="start"
              onClick={() => onNavigate('components')}
            >
              {t('app.home.exploreComponents', 'Explore components')}
            </Button>
          </ButtonContainer>
      </Section>

      {/* ── Stats strip ── */}
      <Section padding="sm" surface="raised" contentWidth="lg" align="center" aria-label={t('app.home.statsLabel', 'System statistics')}>
        <Grid columns={{ xs: 2, sm: 4 }} gap="md">
          {stats.map((stat) => (
            <Inset key={stat.label} block={16} inline={0}>
              <Stack direction="column" gap={4} align="center">
                <Heading as="p" type="display" size={{ xs: 'md', md: 'lg', lg: 'xl' }}>
                  {stat.value}
                </Heading>
                <Paragraph size={{ xs: 'sm', md: 'md', lg: 'lg' }} color="muted">
                  <strong>{stat.label}</strong>
                </Paragraph>
              </Stack>
            </Inset>
          ))}
        </Grid>
      </Section>

      {/* ── Features ── */}
      <Section padding="lg" contentWidth="lg" aria-labelledby="features-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge icon="hub">
              {t('app.home.howItWorksBadge', 'How it works')}
            </MessageBadge>
            <Heading as="h2" type="display" id="features-heading" size={{ xs: 'lg', md: 'xl' }}>
              {t('app.home.featuresHeading', 'Four foundations. One system.')}
            </Heading>
            <Paragraph size="lg" color="muted" style={{ maxInlineSize: 'var(--base-content-width-xs)' }}>
              {t('app.home.featuresParagraph', 'A1 is built on four principles that work together to keep every platform, every agent, and every contributor aligned.')}
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="lg">
            {features.map((feature) => (
              <Card key={feature.title} icon={feature.icon}>
                <Stack direction="column" gap="sm">
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
              {t('app.home.componentsBadge', 'Components')}
            </MessageBadge>
            <Heading as="h2" type="display" id="components-heading" size={{ xs: 'lg', md: 'xl' }}>
              {t('app.home.componentsCatHeading', '40+ components, eight categories.')}
            </Heading>
            <Paragraph size="lg" color="muted">
              {t('app.home.componentsCatParagraph', 'From typography primitives to complex data tables — everything fully tokenized, accessible, and responsive.')}
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 2, sm: 4 }} gap="sm">
            {componentCategories.map((cat) => (
              <Card
                key={cat.label}
                variant="navigation"
                icon={cat.icon}
                onClick={() => onNavigate('components')}
              >
                <Heading as="h3" size="xs">
                  {cat.label}
                </Heading>
                <Paragraph size="sm" color="muted">
                  {cat.count} {t('app.home.catComponentCount', 'components')}
                </Paragraph>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>

      {/* ── Platforms ── */}
      <Section padding="lg" contentWidth="lg" surface="panel" aria-labelledby="platforms-heading" inverse>
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge subtle icon="devices">
              {t('app.home.platformsBadge', 'Platforms')}
            </MessageBadge>
            <Heading as="h2" id="platforms-heading" size={{ xs: 'lg', md: 'xl' }}>
              {t('app.home.platformsHeading', 'One token source. Every surface.')}
            </Heading>
            <Paragraph size="lg" color="muted">
              {t('app.home.platformsParagraph', 'The same token foundations power web, HTML, and mobile. No duplication, no drift.')}
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 3 }} gap="md">
            {platforms.map((platform) => (
              <Card key={platform.title} shadow="sm" icon={platform.icon}>
                <Stack direction="column" gap="sm">
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
      <Section padding="lg" contentWidth="lg" surface="panel" aria-labelledby="themes-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge subtle icon="palette">
              {t('app.home.themesBadge', 'Themes')}
            </MessageBadge>
            <Heading as="h2" id="themes-heading" size={{ xs: 'lg', md: 'xl' }}>
              {t('app.home.themesHeading', 'Four themes. Zero rework.')}
            </Heading>
            <Paragraph size="lg" color="muted" style={{ maxInlineSize: 'var(--base-content-width-xs)' }}>
              {t('app.home.themesParagraph', 'Switch between light, accessible, and heritage themes by changing a single data attribute. Components respond automatically.')}
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2, md: 4 }} gap="md">
            {themes.map((theme) => (
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
        contentWidth="lg"
        align="center"
        aria-labelledby="cta-heading"
      >
        <Stack direction="column" gap="lg">
          <Heading as="h2" id="cta-heading" type="display" size={{ xs: 'lg', md: 'xxl' }} align="center">
            {t('app.home.ctaHeading', 'Start building with A1.')}
          </Heading>
          <Paragraph size="lg" color="muted" align="center">
            {t('app.home.ctaParagraph', 'Explore components, read the token docs, or open the system in Storybook.')}
          </Paragraph>
          <ButtonContainer align="center">
            <Button
              variant="primary"
              icon="arrow_forward"
              iconPosition="end"
              onClick={() => onNavigate('editor')}
            >
              {t('app.home.openEditor', 'Open the editor')}
            </Button>
          </ButtonContainer>
        </Stack>
      </Section>
    </>
  )
}
