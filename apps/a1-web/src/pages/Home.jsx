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
import colorTokenAudit from '../../../../packages/react/ai/color-token-audit.md?raw'
import { componentCategories as registryCategories } from './components/data.js'

function parseTokenDefinitionCount(audit) {
  return audit.match(/\| Token definitions \|\s*(\d+)\s*\|/)?.[1] ?? '0'
}

const componentCount = registryCategories.reduce((count, category) => count + category.components.length, 0)
const categoryCount = registryCategories.length
const tokenCount = parseTokenDefinitionCount(colorTokenAudit)

const HOME_CATEGORY_LABEL_KEYS = {
  layout: 'app.home.catLayout',
  typography: 'app.home.catTypography',
  actions: 'app.home.catActions',
  navigation: 'app.home.catNavigation',
  inputs: 'app.home.catInputs',
  feedback: 'app.home.catFeedback',
  'media-iconography': 'app.home.catMediaIconography',
  overlay: 'app.home.catOverlay',
  'data-viz': 'app.home.catDataViz',
  data: 'app.home.catData',
}

export function Home({ onNavigate }) {
  const t = useT()

  const stats = [
    { value: String(componentCount), label: t('app.home.statComponents', 'Components') },
    { value: '4', label: t('app.home.statPlatforms', 'Packages') },
    { value: '9', label: t('app.home.statThemes', 'Themes') },
    { value: tokenCount, label: t('app.home.statTokens', 'Tokens') },
  ]

  const features = [
    {
      icon: 'widgets',
      title: t('app.home.featureTokenTitle', 'Registry-backed'),
      body: t('app.home.featureTokenBody', 'Every visible component is defined from the registry, with category pages, live configurators, rules, properties, and accessibility reports.'),
    },
    {
      icon: 'edit_square',
      title: t('app.home.featureMultiTitle', 'Editor-ready'),
      body: t('app.home.featureMultiBody', 'Build projects from A1 components, patterns, datasets, image libraries, and label-driven content without leaving the app.'),
    },
    {
      icon: 'auto_awesome',
      title: t('app.home.featureAiTitle', 'Governed AI workflows'),
      body: t('app.home.featureAiBody', 'Local AI helpers and structured rules help propose components, generate data-aware pages, and file backlog work without inventing patterns.'),
    },
    {
      icon: 'accessibility_new',
      title: t('app.home.featureA11yTitle', 'Automated quality'),
      body: t('app.home.featureA11yBody', 'Component reports cover contrast, target size, keyboard behavior, screen reader expectations, WCAG mappings, and Storybook axe scans.'),
    },
  ]

  const componentCategories = registryCategories.map((category) => ({
    icon: category.icon,
    label: t(HOME_CATEGORY_LABEL_KEYS[category.id] ?? `app.home.cat.${category.id}`, category.title),
    count: category.components.length,
    page: `components-${category.id}`,
  }))

  const tools = [
    {
      id: 'projects',
      page: 'projects',
      icon: 'folder',
      title: t('app.home.toolProjectsTitle', 'Projects'),
      body: t('app.home.toolProjectsBody', "The flagship product: create and edit governed projects through a JSON page model that can't move outside the rules."),
      aiReady: true,
    },
    {
      id: 'patterns',
      page: 'patterns',
      icon: 'dashboard_customize',
      title: t('app.home.toolPatternsTitle', 'Patterns'),
      body: t('app.home.toolPatternsBody', 'Commonly defined patterns that can be shared within or across projects.'),
    },
    {
      id: 'image-library',
      page: 'image-library',
      icon: 'photo_library',
      title: t('app.home.toolImageLibraryTitle', 'Image library'),
      body: t('app.home.toolImageLibraryBody', 'Lightweight digital asset management for project images and reusable media.'),
      aiReady: true,
    },
    {
      id: 'custom-icons',
      page: 'custom-icons',
      icon: 'font_download',
      title: t('app.home.toolIconsTitle', 'Icons'),
      body: t('app.home.toolIconsBody', 'Quick custom icons with upload, validation, and font generation.'),
      aiReady: true,
    },
    {
      id: 'data',
      page: 'data',
      icon: 'table_chart',
      title: t('app.home.toolDataSourcesTitle', 'Data sources'),
      body: t('app.home.toolDataSourcesBody', 'Plug-and-play datasets, custom or out of the box, for binding pages to real content.'),
      aiReady: true,
    },
    {
      id: 'theme-editor',
      page: 'theme-editor',
      icon: 'palette',
      title: t('app.home.toolThemeEditorTitle', 'Theme editor'),
      body: t('app.home.toolThemeEditorBody', 'Custom themes with a few clicks, from color ramps to typography and semantic roles.'),
      aiReady: true,
      alpha: true,
    },
    {
      id: 'rules',
      page: 'rules',
      icon: 'gavel',
      title: t('app.home.toolRulesTitle', 'Rules engine'),
      body: t('app.home.toolRulesBody', 'Define UI, component, accessibility, and workflow rules for humans and agents to follow.'),
      aiReady: true,
    },
    {
      id: 'label-editor',
      page: 'label-editor',
      icon: 'translate',
      title: t('app.home.toolLabelsTitle', 'Labels'),
      body: t('app.home.toolLabelsBody', 'Shared labels and translations for reusable, locale-ready interface text.'),
      aiReady: true,
    },
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
    {
      icon: 'integration_instructions',
      title: 'Web Components',
      body: t('app.home.platformWebComponentsBody', 'Standards-based custom elements for framework-agnostic surfaces that still share A1 tokens and interaction rules.'),
      tag: 'packages/web-components',
    },
  ]

  const themes = [
    { name: 'Base', desc: t('app.home.themeBaseDesc', 'The global token baseline — active on every page by default.'), selector: ':root' },
    { name: 'A1 Light', desc: t('app.home.themeA1LightDesc', 'Standard brand expression. Clean and production-ready.'), selector: "data-theme='a1-light'" },
    { name: 'Accessible', desc: t('app.home.themeAccessibleDesc', 'High-contrast variant for elevated readability.'), selector: "data-theme='accessible'" },
    { name: 'Aperture', desc: t('app.home.themeApertureDesc', 'A crisp editorial theme with cool action colour and neutral surfaces.'), selector: "data-theme='aperture'" },
    { name: 'CatLympics', desc: t('app.home.themeCatlympicsDesc', 'A playful event palette with bright pink action colour and high-energy contrast.'), selector: "data-theme='catlympics'" },
    { name: 'Crochet', desc: t('app.home.themeCrochetDesc', 'A soft craft palette with warm surfaces, gentle accents, and expressive type.'), selector: "data-theme='crochet'" },
    { name: 'Fresh', desc: t('app.home.themeFreshDesc', 'A bright green-blue theme for fresh, friendly product surfaces.'), selector: "data-theme='fresh'" },
    { name: 'Heritage', desc: t('app.home.themeHeritageDesc', 'Legacy brand palette for backward-compatible surfaces.'), selector: "data-theme='heritage'" },
    { name: 'Marshmallow', desc: t('app.home.themeMarshmallowDesc', 'A pillowy pastel theme with soft depth and rounded controls.'), selector: "data-theme='marshmallow'" },
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
            as="p"
            type="display"
            align="center"
            size={{ xs: 'xl', md: 'xxl' }}
            textWrap="balance"
          >
            {t('app.home.heroTagline', 'By the rules')}
          </Heading>
</Stack>
          <Paragraph size={{ xs: 'md', md: 'lg', lg: 'lg' }} align="center">
            {t('app.home.heroParagraph', 'A1 is a rules-based design system and product workspace. Explore the live component registry, build projects with patterns and datasets, manage labels, review accessibility reports, and use AI helpers inside clear system guardrails.')}
          </Paragraph>

          <ButtonContainer align="center">
            <Button
              variant="primary"
              icon="arrow_forward"
              iconPosition="end"
              size='lg'
              onClick={() => onNavigate('editor')}
            >
              {t('app.home.buildProject', 'Build a project')}
            </Button>
            {/* <Button
              variant="secondary"
              icon="arrow_forward"
              iconPosition="end"
              onClick={() => onNavigate('backlog')}
            >
              {t('app.home.viewBacklog', 'View backlog')}
            </Button> */}
            <Button
              size='lg'
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
        <Stack gap="md">
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
          <Card variant="navigation" icon="monitoring" onClick={() => onNavigate('dashboard')}>
            <Stack direction={{ xs: 'column', md: 'row' }} gap="sm" align="center" justify={{ md: 'between' }}>
              <Stack gap="xs">
                <Heading as="h2" size="md">
                  {t('app.home.dashboardTitle', 'Open the system dashboard')}
                </Heading>
                <Paragraph size="sm" color="muted">
                  {t('app.home.dashboardBody', 'Explore A1 health, backlog progress, component coverage, token volume, rules, labels, and system flow in one Recharts-powered view.')}
                </Paragraph>
              </Stack>
              <MessageBadge icon="arrow_forward" subtle>
                {t('app.home.dashboardBadge', 'Dashboard')}
              </MessageBadge>
            </Stack>
          </Card>
        </Stack>
      </Section>

      {/* ── Features ── */}
      <Section padding="lg" contentWidth="lg" aria-labelledby="features-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge icon="hub">
              {t('app.home.howItWorksBadge', 'How it works')}
            </MessageBadge>
            <Heading as="h2" type="display" id="features-heading" size={{ xs: 'lg', md: 'xl' }}>
              {t('app.home.featuresHeading', 'Current capabilities. One system.')}
            </Heading>
            <Paragraph size="lg" color="muted" style={{ maxInlineSize: 'var(--base-content-width-xs)' }}>
              {t('app.home.featuresParagraph', 'A1 brings the component registry, editor workflows, labels, accessibility reporting, and AI guardrails into one governed workspace.')}
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

      {/* ── Tools ── */}
      <Section padding="lg" contentWidth="lg" surface="raised" aria-labelledby="tools-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge icon="apps">
              {t('app.home.toolsBadge', 'Tools')}
            </MessageBadge>
            <Heading as="h2" type="display" id="tools-heading" size={{ xs: 'lg', md: 'xl' }}>
              {t('app.home.toolsHeading', 'Tools for making governed systems')}
            </Heading>
            <Paragraph size="lg" color="muted" style={{ maxInlineSize: 'var(--base-content-width-xs)' }}>
              {t('app.home.toolsParagraph', 'A1 combines project editing, shared assets, data, themes, labels, and rules so teams can build with structure instead of starting from a blank page.')}
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
            {tools.map((tool) => (
              <Card
                key={tool.id}
                variant="navigation"
                icon={tool.icon}
                onClick={() => onNavigate(tool.page)}
              >
                <Stack direction="column" gap="sm">
                  <Stack direction="row" gap="xs" wrap align="center">
                    {tool.aiReady && (
                      <MessageBadge size="sm" subtle icon="auto_awesome">
                        {t('app.home.aiReadyBadge', 'AI ready')}
                      </MessageBadge>
                    )}
                    {tool.alpha && (
                      <MessageBadge size="sm" status="info" subtle>
                        {t('app.home.alphaBadge', 'Alpha')}
                      </MessageBadge>
                    )}
                  </Stack>
                  <Heading as="h3" size="sm">
                    {tool.title}
                  </Heading>
                  <Paragraph size="sm" color="muted">
                    {tool.body}
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
              {t('app.home.componentsCatHeading', 'Components by category')}
            </Heading>
            <Paragraph size="lg" color="muted">
              {componentCount} {t('app.home.catComponentCount', 'components')} · {categoryCount} {t('app.home.catCategoryCount', 'categories')}. {t('app.home.componentsCatParagraph', 'From typography primitives to complex data tables — everything is tokenized, accessible, responsive, and connected to the live component docs.')}
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 2, sm: 4 }} gap="sm">
            {componentCategories.map((cat) => (
              <Card
                key={cat.label}
                variant="navigation"
                icon={cat.icon}
                onClick={() => onNavigate(cat.page)}
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
      <Section padding="lg" contentWidth="lg" surface="page" aria-labelledby="platforms-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge subtle icon="devices">
              {t('app.home.platformsBadge', 'Platforms')}
            </MessageBadge>
            <Heading as="h2" id="platforms-heading" size={{ xs: 'lg', md: 'xl' }}>
              {t('app.home.platformsHeading', 'One token source. Every surface.')}
            </Heading>
            <Paragraph size="lg" color="muted">
              {t('app.home.platformsParagraph', 'The same token foundations power React, pure HTML/CSS, React Native, and Web Components package output. No duplication, no drift.')}
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2 }} gap="md">
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
      {/* <Section padding="lg" contentWidth="lg" surface="panel" aria-labelledby="themes-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge subtle icon="palette">
              {t('app.home.themesBadge', 'Themes')}
            </MessageBadge>
            <Heading as="h2" id="themes-heading" size={{ xs: 'lg', md: 'xl' }}>
              {t('app.home.themesHeading', 'Nine themes. Zero rework.')}
            </Heading>
            <Paragraph size="lg" color="muted">
              {t('app.home.themesParagraph', 'Switch themes or color mode by changing the active theme selector. Components respond automatically through shared tokens.')}
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2, md: 3 }} gap="md">
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
      </Section> */}

      {/* ── CTA ── */}
      <Section
        padding="lg"
        inverse
        gradient="accent"
        gradientPosition="top"
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
