import {
  Blockquote,
  Card,
  Cluster,
  Figure,
  Grid,
  GridItem,
  Heading,
  HeadingMark,
  Link,
  List,
  ListItem,
  Paragraph,
  Section,
  Stack,
  Stat,
} from "../../../packages/react/src/index.js";
import { getRouteBase, getRoutePath } from "../utils/routing.js";

export function A1Study() {
  return (
    <article>
      <Section padding="md" surface="raised" contentWidth="xl" gap="sm">
        <Cluster gap="lg">
          <Link href={getRoutePath("home")}>← Home</Link>
        </Cluster>
        <Heading as="h1" type="display" size={{ xs: "lg", md: "jumbo" }}>
          I built A1 to give people and AI a <HeadingMark>shared design language</HeadingMark>.
        </Heading>
        <Paragraph size="lg">
          A personal exploration of how tokens, components, documentation and explicit rules can support more
          consistent product design.
        </Paragraph>
        <Grid columns={{ xs: 1, md: 3 }} gap="lg" alignItems="center">
          <GridItem>
            <Figure
              src={`${getRouteBase()}/img/a1/portfolio-home.png`}
              alt="A1 portfolio homepage built with the design system"
            />
          </GridItem>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Grid columns={{ xs: 1, sm: 2 }} gap="lg">
              <Card icon="work">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">
                    Role
                  </Paragraph>
                  <Paragraph size="lg">Principal Designer</Paragraph>
                </Stack>
              </Card>
              <Card icon="calendar_month">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">
                    Timeline
                  </Paragraph>
                  <Paragraph size="lg">2026</Paragraph>
                </Stack>
              </Card>
              <Card icon="center_focus_strong">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">
                    Focus
                  </Paragraph>
                  <Paragraph size="lg">Design systems, AI and design engineering</Paragraph>
                </Stack>
              </Card>
              <Card>
                <Stat
                  size="lg"
                  value={3}
                  description="Implementation platforms: React, HTML/CSS and React Native"
                />
              </Card>
              <Card>
                <Stat size="lg" value={3} description="Token tiers: base, semantic and component" />
              </Card>
              <Card>
                <Stat size="lg" value={1} description="Shared source of truth for system decisions" />
              </Card>
            </Grid>
          </GridItem>
        </Grid>
      </Section>

      <Section id="the-project" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            01 / The project
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                A1 explores what happens when a design system is built for AI, too.
              </Heading>
              <Paragraph size="lg">
                An AI-native product design platform built to explore what happens when design systems are
                created for AI as much as they are for designers and developers.
              </Paragraph>
              <Blockquote variant="feature">
                AI does not need prettier components. It needs better structure.
              </Blockquote>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="the-challenge" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            02 / The challenge
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Generated interfaces need clearer rules for quality.
              </Heading>
              <Paragraph size="lg">
                AI can generate interfaces in seconds. But speed is not the problem. Quality is.
              </Paragraph>
              <List variant="unordered" size="lg">
                <ListItem>Weak hierarchy</ListItem>
                <ListItem>Invented patterns</ListItem>
                <ListItem>Inconsistent spacing</ListItem>
                <ListItem>Poor accessibility</ListItem>
                <ListItem>Components that do not scale</ListItem>
                <ListItem>Interfaces that look finished but are not production ready</ListItem>
              </List>
              <Blockquote variant="border">
                What if a design system was built for AI as much as it was built for designers and developers?
              </Blockquote>
              <Paragraph size="lg">
                That question became A1: a structured product design platform where every layer of the system
                gives both people and AI clearer decisions to work from.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="the-approach" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            03 / The approach
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Shared decisions connect design, code, documentation and AI.
              </Heading>
              <Paragraph size="lg">
                Most design systems document components. A1 documents decisions.
              </Paragraph>
              <Paragraph size="lg">
                Tokens, components, patterns, page layouts, labels, icons, documentation, and AI guidance all
                share the same source of truth.
              </Paragraph>
              <List variant="unordered" size="lg">
                <ListItem>Design defines intent</ListItem>
                <ListItem>Code enforces structure</ListItem>
                <ListItem>Documentation explains usage</ListItem>
                <ListItem>AI follows rules instead of inventing them</ListItem>
              </List>
              <Blockquote variant="feature">
                The goal is not to generate more UI. The goal is to generate better decisions.
              </Blockquote>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="core-principles" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            04 / Core principles
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Explicit rules make the system easier to understand and evaluate.
              </Heading>
              <Heading as="h3" size="lg">
                Structure over convention
              </Heading>
              <Paragraph size="lg">
                If a decision matters, define it. A1 replaces tribal knowledge with explicit rules that people
                and AI can both apply.
              </Paragraph>
              <Heading as="h3" size="lg">
                Metadata is a feature
              </Heading>
              <Paragraph size="lg">
                AI cannot reason about information that does not exist. Components, patterns, labels, and
                layouts all need enough meaning to be understood, reused, and evaluated.
              </Paragraph>
              <Heading as="h3" size="lg">
                Constraints create speed
              </Heading>
              <Paragraph size="lg">
                Removing arbitrary decisions makes teams faster. It also gives AI fewer opportunities to
                invent inconsistent solutions.
              </Paragraph>
              <Heading as="h3" size="lg">
                One definition
              </Heading>
              <Paragraph size="lg">
                Design, code, documentation, and AI should consume the same system logic instead of
                maintaining separate interpretations.
              </Paragraph>
              <Heading as="h3" size="lg">
                AI output must be challenged
              </Heading>
              <Paragraph size="lg">
                A1 does not treat AI-generated work as automatically correct. It gives humans the criteria to
                review hierarchy, accessibility, component usage, interaction states, responsiveness, and
                scalability.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="feature-stories" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            05 / Feature stories
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Real product problems shaped the tools inside A1.
              </Heading>
              <Paragraph size="lg">
                Each feature in A1 started with a real problem I have encountered while building design
                systems and product platforms.
              </Paragraph>
              <Heading as="h3" size="lg">
                Custom icons
              </Heading>
              <Paragraph size="lg">
                Adding a single icon should not require weeks of coordination. But in many systems, design and
                engineering use different icon libraries, and every new icon becomes a manual request.
              </Paragraph>
              <List variant="unordered" size="lg">
                <ListItem>Shared icon definitions</ListItem>
                <ListItem>Figma and React stay synchronized</ListItem>
                <ListItem>Automatic packaging</ListItem>
                <ListItem>Consistent naming</ListItem>
                <ListItem>No design/development drift</ListItem>
              </List>
              <Paragraph size="lg">Next: AI-generated icons, semantic search, and usage analytics.</Paragraph>
              <Heading as="h3" size="lg">
                Patterns
              </Heading>
              <Paragraph size="lg">
                Every company rebuilds the same screens: settings, search, dashboards, tables, forms, and
                filters. Six teams create six implementations, and small differences become long-term design
                debt.
              </Paragraph>
              <Paragraph size="lg">
                A1 treats patterns as reusable product assets instead of static examples. AI assembles proven
                solutions rather than inventing new ones.
              </Paragraph>
              <Paragraph size="lg">
                Next: pattern recommendations, analytics, and organization-wide pattern libraries.
              </Paragraph>
              <Heading as="h3" size="lg">
                JSON page architecture
              </Heading>
              <Paragraph size="lg">
                Components prevent visual drift. They do not prevent page drift.
              </Paragraph>
              <Paragraph size="lg">
                A1 pages are assembled from structured JSON with defined slots, boundaries, and rules. Instead
                of asking AI to design a dashboard from scratch, the system gives it validated page structures
                to work within.
              </Paragraph>
              <List variant="unordered" size="lg">
                <ListItem>Better accessibility</ListItem>
                <ListItem>Predictable layouts</ListItem>
                <ListItem>Easier maintenance</ListItem>
                <ListItem>Faster implementation</ListItem>
                <ListItem>Higher-quality AI output</ListItem>
              </List>
              <Paragraph size="lg">
                Next: AI-generated pages, automatic design reviews, and heuristic scoring.
              </Paragraph>
              <Heading as="h3" size="lg">
                Labels and localization
              </Heading>
              <Paragraph size="lg">
                Most applications treat text as something added late. That creates duplicated copy,
                inconsistent terminology, and painful localization.
              </Paragraph>
              <Paragraph size="lg">
                A1 turns labels into reusable product assets: one definition, shared everywhere, designed for
                translation from the beginning.
              </Paragraph>
              <Paragraph size="lg">
                Next: context-aware translation, terminology governance, and AI-assisted copy management.
              </Paragraph>
              <Heading as="h3" size="lg">
                Figma to code and code to Figma
              </Heading>
              <Paragraph size="lg">
                The biggest problem with design handoff is not code generation. It is inconsistency. Figma
                allows almost anything. Production systems cannot.
              </Paragraph>
              <Paragraph size="lg">
                I built a Figma plugin that rebuilds pages into strict, machine-readable structures before
                export. Once the design follows the system rules, exporting to production-ready code becomes
                much more direct.
              </Paragraph>
              <Paragraph size="lg">
                The result is rapid prototyping with real components, not visual approximations.
              </Paragraph>
              <Paragraph size="lg">
                Next: bidirectional synchronization and implementation validation.
              </Paragraph>
              <Heading as="h3" size="lg">
                Embedded backlog
              </Heading>
              <Paragraph size="lg">Ideas happen everywhere. Most disappear before they reach Jira.</Paragraph>
              <Paragraph size="lg">
                A1 includes a lightweight backlog inside the product itself. While building, I could log bugs,
                capture ideas, and create epics without leaving the system.
              </Paragraph>
              <List variant="unordered" size="lg">
                <ListItem>Log bugs immediately</ListItem>
                <ListItem>Capture ideas in seconds</ListItem>
                <ListItem>Create epics from anywhere</ListItem>
                <ListItem>Stay focused instead of switching tools</ListItem>
              </List>
              <Paragraph size="lg">
                Next: AI clustering, duplicate detection, and automatic prioritization.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/a1/storybook-grid.png`}
          alt="Storybook showing the A1 bento grid pattern with responsive card tiles"
          caption="Patterns define how components work together, giving AI known structures to assemble from."
        />
      </Section>

      <Section id="building-blocks" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            06 / Building blocks
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Tokens, components and themes work as layers of one system.
              </Heading>
              <Paragraph size="lg">
                A1 works because the pieces are connected. Tokens, components, patterns, and prompts are not
                separate artifacts. They are layers of the same system.
              </Paragraph>
              <Heading as="h3" size="lg">
                Tokens
              </Heading>
              <Paragraph size="lg">
                Tokens define color, typography, spacing, radius, border, elevation, and motion. The structure
                supports theming while keeping behavior predictable.
              </Paragraph>
              <Heading as="h3" size="lg">
                Components
              </Heading>
              <Paragraph size="lg">
                Components define purpose, anatomy, states, behavior, accessibility expectations, responsive
                rules, and AI usage guidance.
              </Paragraph>
              <Heading as="h3" size="lg">
                Themes
              </Heading>
              <Paragraph size="lg">
                Themes test whether the system survives aesthetic change. Color, typography, radius, density,
                and surface treatment can shift while the underlying rules remain stable.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/a1/storybook-blockquote.png`}
          alt="Storybook documentation showing A1 Blockquote variants"
          caption="Components document behavior, not just appearance."
        />
        <Figure
          src={`${getRouteBase()}/img/a1/storybook-section-stacked.png`}
          alt="Storybook showing stacked Section bands with inverse, default, and panel surfaces"
          caption="The surface system creates page rhythm while adapting to the active theme."
        />
      </Section>

      <Section id="why-it-matters" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            07 / Why it matters
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Shared structure reduces the decisions teams have to repeat.
              </Heading>
              <Paragraph size="lg">
                A1 is not really about building another design system. It is about designing a system that AI
                can participate in safely.
              </Paragraph>
              <List variant="unordered" size="lg">
                <ListItem>Icons should not take weeks</ListItem>
                <ListItem>Patterns should not be reinvented</ListItem>
                <ListItem>Translations should not be an afterthought</ListItem>
                <ListItem>Pages should not drift from approved structures</ListItem>
                <ListItem>Documentation should not become stale</ListItem>
              </List>
              <Blockquote variant="border">
                The future is not design-first or engineering-first. It is structure-first.
              </Blockquote>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="lessons-learned" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            08 / Lessons learned
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Using the software gives design decisions immediate feedback.
              </Heading>
              <Blockquote variant="feature">Designing software requires using the software.</Blockquote>
              <Paragraph size="lg">
                Designing in code creates immediate feedback. Ideas are tested instead of imagined. Rules
                evolve through practice instead of documentation alone.
              </Paragraph>
              <Paragraph size="lg">
                Some rules in A1 come from years of design systems experience. Some come from industry best
                practices. Some simply break ties so teams and AI can move forward consistently.
              </Paragraph>
              <Paragraph size="lg">
                The important part is not that every rule is perfect. The important part is that every
                important decision has a definition.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="outcome" padding="lg" contentWidth="sm" gap="sm" inverse>
        <Heading as="h2" size="xl">
          A1 brings product development into a shared language.
        </Heading>
        <Paragraph size="lg">
          A1 began as an experiment in AI-assisted design systems. It became an exploration of what happens
          when every layer of product development shares the same language.
        </Paragraph>
        <List variant="unordered" size="lg">
          <ListItem>Tokens</ListItem>
          <ListItem>Components</ListItem>
          <ListItem>Patterns</ListItem>
          <ListItem>Pages</ListItem>
          <ListItem>Documentation</ListItem>
          <ListItem>AI guidance</ListItem>
        </List>
        <Blockquote variant="feature" cite="A1 Design System">
          The teams that succeed will not simply have better AI. They will have better systems for AI to
          reason about.
        </Blockquote>
        <Cluster gap="lg">
          <Link href={getRoutePath("home")}>Explore more work →</Link>
        </Cluster>
      </Section>
    </article>
  );
}
