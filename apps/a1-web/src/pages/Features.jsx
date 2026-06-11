import {
  Card,
  Grid,
  Heading,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'

const topLevelFeatures = [
  {
    icon: 'token',
    label: 'Foundation',
    title: 'Token-driven by default',
    page: 'foundations',
    body: 'A single Style Dictionary source defines color, spacing, radius, typography, motion, shadows, component sizing, and theme behavior.',
    points: [
      'Base, semantic, and component token layers',
      'No hard-coded component styling',
      'Theme output shared across packages',
    ],
  },
  {
    icon: 'devices',
    label: 'Platforms',
    title: 'One system - multiple platforms',
    page: 'get-started',
    body: 'React, React Native, and pure HTML/CSS packages express the same design decisions in the language each platform expects.',
    points: [
      'React component package',
      'React Native mobile package',
      'Zero-JS HTML/CSS package',
    ],
  },
  {
    icon: 'accessibility_new',
    label: 'Quality',
    title: 'Accessible interaction patterns',
    page: 'components',
    body: 'Components are designed around semantic markup, keyboard use, screen reader labels, visible focus states, and token-backed contrast.',
    points: [
      'Semantic heading and section APIs',
      'Accessible form and navigation patterns',
      'Status, feedback, and dialog primitives',
      'prefers-contrast: more steps every interactive token one ramp deeper',
      'prefers-reduced-motion collapses all duration tokens to 0ms at the token level',
    ],
  },
  {
    icon: 'auto_awesome',
    label: 'AI-ready',
    title: 'Structured for agentic work',
    page: 'get-started',
    body: 'Clear props, tokens, rules, and examples give AI tools the constraints they need to generate on-brand, maintainable UI.',
    points: [
      'Reusable component primitives',
      'Documented design rules',
      'Predictable prop APIs',
    ],
  },
]

const minorFeatureGroups = [
  {
    title: 'Foundations',
    icon: 'foundation',
    page: 'foundations',
    features: [
      'Color ramps and semantic color roles',
      'Light, dark, accessible, and heritage themes',
      'Typography scales for body, heading, and display text',
      'Spacing scale, semantic gaps, and component spacing tokens',
      'Radius, shadow, motion, icon, and focus-ring tokens',
      'Style Dictionary build pipeline',
      'Localised label system with per-locale translations and RTL support',
    ],
  },
  {
    title: 'Components',
    icon: 'widgets',
    page: 'components',
    features: [
      'Typography: Heading, Paragraph, List, Blockquote, Figure',
      'Actions: Button, ButtonContainer, IconButton, links',
      'Inputs: TextField, TextareaField, SelectField, DateField, CheckboxGroup, RadioGroup, Switch',
      'Feedback: MessageBadge, Banner, Snackbar, Empty State',
      'Navigation: TopHeader, SideNav, Breadcrumb, PageNav, Tabs, Pagination',
      'Structure: Section, Stack, Grid, Card, Surface, Inset, Bleed, Divider',
      'Data and overlays: DataTable, Dialog, Menu, Notification',
    ],
  },
  {
    title: 'Platform Coverage',
    icon: 'hub',
    page: 'get-started',
    features: [
      'React components with CSS custom property styling',
      'React Native components connected to generated token values',
      'Pure HTML/CSS output with theme CSS files and no JavaScript-only components',
      'Shared JSON examples for Priority Guide web and iOS experiences',
      'Storybook examples for component states, variants, and usage rules',
    ],
  },
  {
    title: 'Workflow',
    icon: 'route',
    page: 'get-started',
    features: [
      'Responsive props for typography, layout, and Section behavior',
      'Container-query-aware button grouping',
      'Inverse Sections, surfaces, gradient washes, and full-bleed bands',
      'Material Symbols icon support through simple icon name props',
      'Contrast mode and reduced motion controls in the settings menu, persisted to localStorage',
      'Locale selector in settings for live translation preview across all labeled components',
      'Design rules and project context files for AI-assisted development',
      'A1 web changelog documenting prompt-by-prompt changes',
    ],
  },
]

const techStack = [
  {
    title: 'Core build tools',
    icon: 'precision_manufacturing',
    items: [
      'Style Dictionary for token generation',
      'Vite for local apps and examples',
      'Storybook for component documentation and QA',
      'PostCSS custom media for breakpoint tokens',
    ],
  },
  {
    title: 'Web platform',
    icon: 'language',
    items: [
      'React 19 for the A1 web app and React package',
      'CSS custom properties for token delivery',
      'Container queries for responsive component behavior',
      'Material Symbols for icon rendering',
    ],
  },
  {
    title: 'Native platform',
    icon: 'phone_iphone',
    items: [
      'React Native components in TypeScript',
      'Expo-compatible peer dependencies',
      '@expo/vector-icons for Material icon support',
      'Shared token output for mobile themes',
    ],
  },
  {
    title: 'Quality and automation',
    icon: 'check_circle',
    items: [
      'Playwright and axe-core for browser QA',
      'Storybook test runner for component checks',
      'Project context markdown for AI-assisted work',
      'Prompt-by-prompt changelog entries for traceability',
    ],
  },
]

const builtWithTools = [
  {
    title: 'Codex',
    icon: 'auto_awesome',
    body: 'Used for implementation work, refactors, local verification, and prompt-by-prompt changelog updates.',
  },
  {
    title: 'Claude Code',
    icon: 'code',
    body: 'Supported codebase exploration, component planning, and alternate AI-assisted development workflows.',
  },
  {
    title: 'VS Code',
    icon: 'terminal',
    body: 'The primary editor surface for source review, local development, and project navigation.',
  },
  {
    title: 'Figma',
    icon: 'design_services',
    body: 'Used as the design environment for system thinking, component mapping, and design-to-code workflows.',
  },
]

const capabilityStats = [
  { value: '40+', label: 'Components' },
  { value: '3', label: 'Packages' },
  { value: '4', label: 'Themes' },
  { value: '0', label: 'Custom values' },
]

export function Features({ onNavigate }) {
  const handleNavigationCardClick = (event, page) => {
    if (!onNavigate) return

    event.preventDefault()
    onNavigate(page)
  }

  return (
    <>
      <Section
        padding="sm"
        surface="panel"
        gradient="accent"
        gradientPosition="top-right"
        contentWidth="lg"
        gap="lg"
        aria-labelledby="features-page-heading"
      >
        <Stack direction="column" gap="sm">
          <Heading
            as="h1"
            id="features-page-heading"
            type="display"
            size={{ xs: 'xl', md: 'xxl' }}
            textWrap="balance"
          >
            Everything A1 does
          </Heading>
          <Heading as="h2" color="muted" size="md"> for product teams, platforms, and AI-assisted UI.</Heading>
          <Paragraph size="md" color="muted">
            A1 is more than a component kit. It is a token-governed system for building consistent interfaces across web, mobile, static HTML, and AI-generated work.
          </Paragraph>
        </Stack>

        <Grid columns={{ xs: 2, sm: 4 }} gap="md">
          {capabilityStats.map((stat) => (
            <Card key={stat.label}>
              <Heading as="p" type="display" size={{ xs: 'md', md: 'lg' }}>
                {stat.value}
              </Heading>
              <Paragraph size="sm" color="muted">
                <strong>{stat.label}</strong>
              </Paragraph>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section padding="sm" contentWidth="lg" aria-labelledby="top-features-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <Heading as="h2" id="top-features-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
              Top features
            </Heading>
            <Paragraph size="lg" color="muted">
              These are the system-level capabilities that shape every component, package, and example.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, md: 2 }} gap="lg">
            {topLevelFeatures.map((feature) => (
              <Card
                key={feature.title}
                variant="navigation"
                href={`/?page=${feature.page}`}
                icon={feature.icon}
                heroColor="info"
                  iconDisplay="hero"

                onClick={(event) => handleNavigationCardClick(event, feature.page)}
              >
                <Stack direction="column" gap="md">
                  <Stack direction="column" gap="xs">
                    <Heading as="h3" size="md">
                      {feature.title}
                    </Heading>
                    <Paragraph size="sm" color="muted">
                      {feature.body}
                    </Paragraph>
                  </Stack>
                  <List icon="check_circle" size="sm" color="muted">
                    {feature.points.map((point) => (
                      <ListItem key={point}>{point}</ListItem>
                    ))}
                  </List>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>

      <Section padding="md" surface="panel" contentWidth="lg" aria-labelledby="tech-stack-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <Heading as="h2" id="tech-stack-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
              The tools behind the system.
            </Heading>
            <Paragraph size="lg" color="muted">
              A1 uses a small, practical stack: generated tokens, platform-native packages, documented examples, and automated checks.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2 }} gap="md">
            {techStack.map((group) => (
              <Card key={group.title} icon={group.icon}>
                <Stack direction="column" gap="md">
                  <Heading as="h3" size="md">
                    {group.title}
                  </Heading>
                  <List icon="check" size="sm" color="muted">
                    {group.items.map((item) => (
                      <ListItem key={item}>{item}</ListItem>
                    ))}
                  </List>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>

      <Section padding="lg" contentWidth="lg" aria-labelledby="built-with-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <MessageBadge icon="construction">Built with</MessageBadge>
            <Heading as="h2" id="built-with-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
              The tools behind the work.
            </Heading>
            <Paragraph size="lg" color="muted" className="a1-web-section-body">
              A1 was shaped through a practical design and development loop across AI coding tools, an editor, and Figma.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
            {builtWithTools.map((tool) => (
              <Card key={tool.title} icon={tool.icon}>
                <Stack direction="column" gap="sm">
                  <Heading as="h3" size="md">
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

      <Section padding="md" surface="raised" contentWidth="lg" aria-labelledby="minor-features-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <Heading as="h2" id="minor-features-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
              Minor features
            </Heading>
            <Paragraph size="lg" color="muted" className="a1-web-section-body">
              Smaller capabilities add up: token scales, responsive props, package parity, documentation patterns, and interface primitives for real product work.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2 }} gap="md">
            {minorFeatureGroups.map((group) => (
              <Card
                key={group.title}
                variant="navigation"
                href={`/?page=${group.page}`}
                icon={group.icon}
                onClick={(event) => handleNavigationCardClick(event, group.page)}
              >
                <Stack direction="column" gap="md">
                  <Heading as="h3" size="md">
                    {group.title}
                  </Heading>
                  <List icon="arrow_right" size="sm" color="muted">
                    {group.features.map((feature) => (
                      <ListItem key={feature}>{feature}</ListItem>
                    ))}
                  </List>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>
    </>
  )
}
