import { useState } from 'react'
import {
  Breadcrumb,
  Card,
  Code,
  Grid,
  Heading,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'

const packages = [
  {
    value: 'react',
    label: 'React',
    icon: 'code',
    badge: '@gtivr4/a1-design-system-react',
    intro: 'Use the React package for product apps, documentation sites, dashboards, and design-system-powered web interfaces.',
    install: [
      'Install the package in a React app: npm install @gtivr4/a1-design-system-react',
      'Import components from the package entry point.',
      'Use component props for variants, size, alignment, icons, surfaces, and responsive behavior.',
      'Use design system composition primitives first: Section, Stack, Grid, Card, Heading, Paragraph, and ButtonContainer.',
    ],
    contextFiles: [
      'packages/react/AGENTS.md',
      'packages/react/CLAUDE.md',
      'packages/react/ai/project-context.md',
      'packages/react/ai/components.md',
      'packages/react/README.md',
      'apps/a1-web/CHANGELOG.md',
    ],
    prompt: `Use the A1 React package. Before coding, read packages/react/AGENTS.md, packages/react/CLAUDE.md, packages/react/ai/project-context.md, and packages/react/ai/components.md. Follow the component APIs and existing page patterns. Use Section, Stack, Grid, Card, Heading, Paragraph, Button, ButtonContainer, MessageBadge, and List before adding custom CSS. Do not invent raw colors, spacing, radius, font sizes, or one-off styles. Update apps/a1-web/CHANGELOG.md with the prompt and changes.`,
    code: `import {
  Button,
  ButtonContainer,
  Card,
  Grid,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'

export function ExamplePage() {
  return (
    <Section padding="lg" contentWidth="lg" gap="lg" aria-labelledby="example-heading">
      <Stack gap="sm">
        <MessageBadge icon="auto_awesome">React</MessageBadge>
        <Heading as="h1" id="example-heading" type="display" size={{ xs: 'xl', md: 'xxl' }}>
          Build with system primitives.
        </Heading>
        <Paragraph size="lg" color="muted">
          Compose pages from A1 components and let tokens handle the styling.
        </Paragraph>
      </Stack>

      <Grid columns={{ xs: 1, md: 3 }} gap="md">
        {['Tokens', 'Components', 'Themes'].map((item) => (
          <Card key={item}>
            <Heading as="h2" size="md">{item}</Heading>
            <Paragraph color="muted">Use props and semantic components first.</Paragraph>
          </Card>
        ))}
      </Grid>

      <ButtonContainer>
        <Button icon="arrow_forward" iconPosition="end">Continue</Button>
      </ButtonContainer>
    </Section>
  )
}`,
  },
  {
    value: 'react-native',
    label: 'React Native',
    icon: 'phone_iphone',
    badge: '@gtivr4/a1-design-system-react-native',
    intro: 'Use the React Native package for Expo and mobile apps that should match the same token language as A1 web surfaces.',
    install: [
      'Install the package: npm install @gtivr4/a1-design-system-react-native',
      'Install peer dependencies required by your app, including react, react-native, and react-native-safe-area-context.',
      'For Expo apps that use built-in Material icons, keep @expo/vector-icons available.',
      'Wrap screens in the design system provider pattern already used by the iOS example app.',
    ],
    contextFiles: [
      'packages/react-native/AGENTS.md',
      'packages/react-native/CLAUDE.md',
      'packages/react-native/ai/project-context.md',
      'apps/ios-example/App.tsx',
      'apps/priority-guide-ios/App.tsx',
      'packages/react/ai/project-context.md',
    ],
    prompt: `Use the A1 React Native package. Before coding, read packages/react-native/AGENTS.md, packages/react-native/CLAUDE.md, packages/react-native/ai/project-context.md, packages/react/ai/project-context.md, and the existing iOS example screens. Use exported native components and generated token values. Do not hardcode colors, spacing, type sizes, radius, shadows, or icon sizing. Prefer icon name props where supported. Keep iOS and web examples aligned when they represent the same product surface.`,
    code: `import {
  Button,
  Card,
  Heading,
  Paragraph,
  Section,
} from '@gtivr4/a1-design-system-react-native'

export function ExampleScreen() {
  return (
    <Section padding="lg" gap="md">
      <Heading type="display" size="lg">
        Mobile screens use the same system language.
      </Heading>
      <Paragraph size="lg" color="muted">
        Use native A1 components instead of custom StyleSheet values.
      </Paragraph>

      <Card>
        <Heading size="md">Token-backed component</Heading>
        <Paragraph color="muted">
          Color, spacing, typography, and radius come from the design system.
        </Paragraph>
        <Button icon="arrow-forward">Continue</Button>
      </Card>
    </Section>
  )
}`,
  },
  {
    value: 'pure',
    label: 'Pure',
    icon: 'html',
    badge: '@a1/pure',
    intro: 'Use the pure HTML/CSS package for static pages, framework-free prototypes, and environments where JavaScript components are not available.',
    install: [
      'Build the CSS output from the workspace: npm run build:html-css',
      'Load packages/pure/dist/a1-base.css first.',
      'Load one theme file after the base file, such as packages/pure/dist/a1-heritage.css.',
      'Use scoped class names like a1-button, a1-section, a1-card, a1-heading, and a1-paragraph.',
      'Do not use components that require JavaScript behavior in this package.',
    ],
    contextFiles: [
      'packages/pure/AGENTS.md',
      'packages/pure/CLAUDE.md',
      'packages/pure/ai/project-context.md',
      'packages/pure/README.md',
      'packages/pure/dist/index.html',
      'packages/react/ai/project-context.md',
    ],
    prompt: `Use the A1 pure HTML/CSS package. Before coding, read packages/pure/AGENTS.md, packages/pure/CLAUDE.md, packages/pure/ai/project-context.md, packages/pure/README.md, and packages/pure/dist/index.html. Output semantic HTML and A1 classes only. No JavaScript. Do not add custom CSS unless a missing system class is being added to the package generator. Use values from generated theme CSS and style dictionary output.`,
    code: `<link rel="stylesheet" href="./a1-base.css">
<link rel="stylesheet" href="./a1-heritage.css">

<section class="a1-section a1-section--padding-lg a1-section--surface-panel">
  <span class="a1-badge a1-badge-info">HTML/CSS</span>
  <h1 class="a1-display a1-display-xl">
    Static pages can still use the system.
  </h1>
  <p class="a1-paragraph a1-paragraph-lg a1-paragraph-muted">
    Use semantic markup with scoped A1 classes and generated theme files.
  </p>
  <a class="a1-button a1-button-primary a1-button-large" href="/components">
    Explore components
  </a>
</section>`,
  },
]

function CodeExample({ children, wrap = false }) {
  return (
    <Code variant="block" wrapping={wrap} copyCode>
      {children}
    </Code>
  )
}

const repoSetupCommand = `git clone https://github.com/nathandana/A1DesignSystem.git
cd A1DesignSystem
npm install
npm run build:tokens && npm run build:html-css
npm run dev:a1-web`

const repoContextFiles = [
  'AGENTS.md',
  'CLAUDE.md',
  'packages/react/ai/project-context.md',
  'packages/react/ai/components.md',
  'packages/react/ai/quick-orientation.md',
  'packages/react/ai/a11y-policy.md',
]

function PackagePanel({ pkg }) {
  return (
    <Stack gap="lg">
      <Card icon={pkg.icon}>
        <Stack gap="sm">
          <MessageBadge subtle>{pkg.badge}</MessageBadge>
          <Heading as="h2" size="lg">
            {pkg.label}
          </Heading>
          <Paragraph size="lg" color="muted">
            {pkg.intro}
          </Paragraph>
        </Stack>
      </Card>

      <Grid columns={{ xs: 1, md: 2 }} gap="md">
        <Card>
          <Stack gap="sm">
            <Heading as="h3" size="md">
              Manual installation
            </Heading>
            <List as="ol" size="sm" color="muted">
              {pkg.install.map((step) => (
                <ListItem key={step}>{step}</ListItem>
              ))}
            </List>
          </Stack>
        </Card>

        <Card>
          <Stack gap="sm">
            <Heading as="h3" size="md">
              Context files for AI
            </Heading>
            <Paragraph size="sm" color="muted">
              Ask the assistant to read these files before editing. The package-level files should come before broad repo context.
            </Paragraph>
            <List icon="description" size="sm" color="muted">
              {pkg.contextFiles.map((file) => (
                <ListItem key={file}>
                  <Code wrapping>{file}</Code>
                </ListItem>
              ))}
            </List>
          </Stack>
        </Card>
      </Grid>

      <Card icon="auto_awesome">
        <Stack gap="sm">
          <Heading as="h3" size="md">
            AI prompt
          </Heading>
          <Paragraph size="sm" color="muted">
            Use this shape when you want AI help without losing the design system rules.
          </Paragraph>
          <CodeExample wrap>{pkg.prompt}</CodeExample>
        </Stack>
      </Card>

      <Card>
        <Stack gap="sm">
          <Heading as="h3" size="md">
            Good code example
          </Heading>
          <Paragraph size="sm" color="muted">
            These examples use system components, semantic markup, and package conventions instead of custom styling.
          </Paragraph>
          <CodeExample>{pkg.code}</CodeExample>
        </Stack>
      </Card>
    </Stack>
  )
}

export function GetStarted({ onNavigate }) {
  const [activePackage, setActivePackage] = useState(packages[0].value)

  return (
    <>
      <Section
        padding="xs"
        contentWidth="xl"
        surface="panel"
        borderSize="sm"
        borderVariant="accent"
        borderSides="bottom"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { label: 'Setup guides' },
            ]}
          />
          <Heading as="h1" id="get-started-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Setup guides
          </Heading>
          <Paragraph size="sm" color="muted">
            Add A1 from GitHub, run the local docs site, or use the package tabs for implementation-specific setup.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="repo-setup-heading">
        <Grid columns={{ xs: 1, md: 2 }} gap="md">
          <Card icon="code">
            <Stack gap="sm">
              <Heading as="h2" id="repo-setup-heading" size="md">
                Add the GitHub repo
              </Heading>
              <Paragraph size="sm" color="muted">
                Clone <Code variant="inline">nathandana/A1DesignSystem</Code>, install workspace dependencies, build generated assets, and start the A1 web app locally.
              </Paragraph>
              <CodeExample wrap>{repoSetupCommand}</CodeExample>
              <Paragraph size="sm" color="muted">
                Repository URL: <Code variant="inline">https://github.com/nathandana/A1DesignSystem</Code>
              </Paragraph>
            </Stack>
          </Card>

          <Card icon="auto_awesome">
            <Stack gap="sm">
              <Heading as="h2" size="md">
                Before editing with AI
              </Heading>
              <Paragraph size="sm" color="muted">
                Ask the assistant to read the repo instructions and central context before changing components, tokens, labels, or documentation.
              </Paragraph>
              <List icon="description" size="sm" color="muted">
                {repoContextFiles.map((file) => (
                  <ListItem key={file}>
                    <Code wrapping>{file}</Code>
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Card>
        </Grid>
      </Section>
  
      <Section padding="sm" contentWidth="xl" aria-labelledby="package-tabs-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="xs">
            <Heading as="h2" id="package-tabs-heading" size={{ xs: 'md', md: 'lg' }}>
              Package setup
            </Heading>
            <Paragraph size="md" color="muted">
              Each tab includes installation steps, AI context prompts, and examples of code that fits the system.
            </Paragraph>
          </Stack>
          <Tabs value={activePackage} onChange={setActivePackage}>
            <TabList>
              {packages.map((pkg) => (
                <Tab key={pkg.value} value={pkg.value} icon={pkg.icon}>
                  {pkg.label}
                </Tab>
              ))}
            </TabList>

            {packages.map((pkg) => (
              <TabPanel key={pkg.value} value={pkg.value}>
                <Stack gap="lg">
                  <PackagePanel pkg={pkg} />
                </Stack>
              </TabPanel>
            ))}
          </Tabs>
        </Stack>
      </Section>
    </>
  )
}
