import {
  Blockquote,
  Figure,
  Heading,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  Section,
  Spacer,
  Stack,
} from "../../../packages/react/src/index.js";
import { CaseStudyLayout } from "../pages/CaseStudyLayout.jsx";

const principles = [
  {
    number: "01.",
    title: "Start with priority, not layout",
    body: "A1 encourages the creation of a priority guide before jumping into page composition. The system pushes the designer or AI to define what matters most before deciding where things go — preventing pages from becoming a collection of well-styled components without a clear user path.",
    questions: [
      "What is the primary user goal?",
      "What action should be most prominent?",
      "What information is required before that action?",
      "What can be secondary, collapsed, deferred, or removed?",
    ],
  },
  {
    number: "02.",
    title: "Make hierarchy explicit",
    body: "A1 treats hierarchy as both an information problem and a visual problem. The system defines how hierarchy should be expressed through heading structure, spacing, component grouping, color emphasis, typography scale, action priority, surface depth, and content density — giving AI clearer criteria for evaluating whether an interface is understandable, not just visually balanced.",
    questions: null,
  },
  {
    number: "03.",
    title: "Design for predictable rhythm",
    body: "Vertical rhythm is treated as a system-level concern, not a page-by-page styling choice. A1 uses spacing rules to create consistency across sections, cards, forms, lists, and page layouts. The goal is to make interfaces feel intentional while reducing the number of arbitrary spacing decisions.",
    questions: null,
  },
  {
    number: "04.",
    title: "Use color with purpose",
    body: "A1 avoids decorative color usage as the default. Color is assigned meaning through defined roles: accent, surface, border, text, status, interaction, and emphasis. The system supports theme variation while maintaining contrast, accessibility, and semantic clarity.",
    questions: null,
  },
  {
    number: "05.",
    title: "Accessibility is a system rule, not a final review",
    body: "Accessibility is built into the component and interaction model from the start. A1 considers semantic HTML expectations, focus states, keyboard behavior, color contrast, touch targets, error messaging, form labeling, and reduced ambiguity between disabled and read-only states. The system assumes that an interface is not complete unless it is usable.",
    questions: null,
  },
  {
    number: "06.",
    title: "AI output must be challenged",
    body: "A1 does not treat AI-generated work as automatically correct. It creates a review model for identifying when AI has produced something that looks complete but fails under closer inspection — checking hierarchy, component accuracy, action priority, responsive behavior, interaction states, semantic markup, accessibility, and scalability.",
    questions: null,
  },
];

export function A1Study() {
  return (
    <CaseStudyLayout
      title="A1 Design System"
      tags={["Design Systems", "AI Design"]}
      meta={[
        { label: "Year", value: "2026" },
        { label: "Type", value: "Personal project" },
        { label: "Role", value: "Principal AI Designer" },
      ]}
    >
      {/* ── Overview ─────────────────────────────────────────────────────── */}
      <Section as="div" padding="sm" contentWidth="md">
        <Paragraph size="lg">
          A1 Design System is an experimental, AI-first design system built to
          explore how structured design rules, reusable components, accessibility
          standards, and tokenized theming can work together to produce
          higher-quality digital products faster.
        </Paragraph>
        <Paragraph size="lg">
          The goal was not simply to create another component library. The goal
          was to create a system that could guide both humans and AI toward
          better decisions: clearer hierarchy, stronger accessibility, more
          consistent layouts, predictable interaction patterns, and
          production-ready interface logic.
        </Paragraph>
        <Paragraph size="lg">
          As AI tools become increasingly capable of generating complete
          interfaces, the role of a design system changes. A traditional system
          helps designers and developers work consistently. An AI-first system
          must do more: it must provide enough structure for AI to generate
          usable, accessible, brand-aligned experiences without inventing
          patterns, ignoring hierarchy, or producing visually polished but
          functionally weak output. A1 Design System was created around that
          challenge.
        </Paragraph>

      <Figure
        src="img/a1/portfolio-home.png"
        alt="The A1 Design System portfolio homepage showing the sidebar navigation, hero section, and case study cards"
        caption="The portfolio itself is built entirely with A1 components — every layout, heading, button, and section comes from the system."
        marginTop="lg"
        marginBottom="lg"
        
      />
      </Section>

      {/* ── The Challenge ────────────────────────────────────────────────── */}
      <Section as="div" padding="sm" surface="raised" contentWidth="md" inverse>
        <Heading as="h2" size="lg" margin="md">The Challenge</Heading>
        <Paragraph size="lg">
          AI can generate interfaces quickly, but speed alone creates risk.
          Without strong rules, AI-generated UI often looks convincing while
          failing in important ways:
        </Paragraph>
        <List variant="unordered" size="lg">
          <ListItem>Weak information hierarchy</ListItem>
          <ListItem>Inconsistent spacing and rhythm</ListItem>
          <ListItem>Misused components</ListItem>
          <ListItem>Poor accessibility decisions</ListItem>
          <ListItem>Unclear interaction states</ListItem>
          <ListItem>Invented visual patterns</ListItem>
          <ListItem>Incomplete responsive behavior</ListItem>
          <ListItem>Components that look finished but are not scalable</ListItem>
        </List>
        <Spacer size="sm" />
        <Blockquote variant="border">
          What does a design system need to become when AI is part of the design and development workflow?
        </Blockquote>
        <Paragraph size="lg">
          For a design system to work in an AI-assisted process, it needs to be
          more explicit than a traditional component library. It cannot rely on
          taste, intuition, or tribal knowledge. It needs documented rules that
          AI can understand, apply, and be evaluated against.
        </Paragraph>
      </Section>

      {/* ── My Role ──────────────────────────────────────────────────────── */}
      <Section as="div" padding="md" contentWidth="md">
        <Heading as="h2" size="xl" margin="md">My Role</Heading>
        <Paragraph size="lg">
          I led the concept, structure, design direction, and system logic for
          A1 Design System. This work combines UX architecture, design systems,
          accessibility, visual design, front-end implementation, product
          strategy, and AI direction.
        </Paragraph>
        <List variant="unordered" size="lg">
          <ListItem>Defining the system principles</ListItem>
          <ListItem>Creating rules for hierarchy, rhythm, color, spacing, and component usage</ListItem>
          <ListItem>Establishing token structures for theme flexibility</ListItem>
          <ListItem>Designing and building reusable component patterns</ListItem>
          <ListItem>Writing prompts and guidance to help AI use the system correctly</ListItem>
          <ListItem>Testing the system against different product types and themes</ListItem>
          <ListItem>Evaluating AI-generated output for usability, accessibility, scalability, and visual quality</ListItem>
        </List>
      </Section>

      {/* ── Design Philosophy ────────────────────────────────────────────── */}
      <Section as="div" padding="sm" contentWidth="md">
        <Heading as="h2" size="xl" margin="md">Design Philosophy</Heading>
        <Blockquote variant="feature">
          AI performs better when the rules are clearer.
        </Blockquote>
        <Paragraph size="lg">
          Design systems have always been about rules. The difference now is
          that those rules need to be usable by both people and machines. A1
          treats the design system as a shared operating model — defining not
          just what components exist, but how they should behave, when they
          should be used, how they should scale, and how they should support
          user goals.
        </Paragraph>
        <Figure
          src="img/a1/storybook-heading-display.png"
          alt="Storybook showing the A1 display type scale from sm through xJumbo"
          caption="The display type scale — sm through xJumbo — gives AI and designers a defined set of size options, each with semantic meaning and clear visual weight."
          marginTop="lg"
          marginBottom="lg"
          radius="sm"
          size="lg"
          align="center"
          imgStyle={{ border: "1px solid var(--semantic-color-border-subtle)" }}
        />
      </Section>

      {/* ── Principles ───────────────────────────────────────────────────── */}
      {principles.map(({ number, title, body, questions }, i) => (
        <Section
          key={number}
          as="div"
          padding="lg"
          gap="xs"
          contentWidth="md"
          surface={i % 2 !== 0 ? "panel" : undefined}
        >
          <Stack direction={{ xs: "column", sm: "row" }} gap="lg">
            <Heading type="display" color="accent" size={{ xs: "xl", md: "xJumbo" }}>
              {number}
            </Heading>
            <Stack gap="md">
              <Heading type="display" size={{ xs: "lg", md: "xl" }}>{title}</Heading>
              <Paragraph size="lg" color="muted">{body}</Paragraph>
              {questions && (
                <List variant="unordered">
                  {questions.map((q) => <ListItem key={q}>{q}</ListItem>)}
                </List>
              )}
            </Stack>
          </Stack>
        </Section>
      ))}

      {/* ── System Structure ─────────────────────────────────────────────── */}
      <Section as="div" padding="md" contentWidth="md">
        <Heading as="h2" size="xl" margin="md">System Structure</Heading>
        <Paragraph size="lg">
          A1 Design System includes several major layers that work together as
          an integrated system rather than isolated artifacts.
        </Paragraph>

        <Heading as="h3" size="lg" margin="md">Design Tokens</Heading>
        <Paragraph size="lg">
          Tokens define the visual foundation — color, typography, spacing,
          radius, border, elevation, and motion — down to component-level
          values. The token structure supports theming without requiring every
          component to be redesigned, allowing the system to shift visual
          personality while retaining predictable behavior.
        </Paragraph>

        <Heading as="h3" size="lg" margin="md">Components</Heading>
        <Paragraph size="lg">
          Components are designed to be reusable, composable, and rule-bound.
          Rather than treating them as isolated visual assets, A1 defines each
          component by purpose, behavior, anatomy, states, and usage guidance —
          including accessibility requirements, content rules, responsive
          behavior, and AI usage guidance.
        </Paragraph>
        <Figure
          src="img/a1/storybook-blockquote.png"
          alt="Storybook documentation showing all seven Blockquote variants: border, filled, feature, minimal, accent, pull, and ruled"
          caption="The Blockquote component with seven distinct variants — each with defined usage rules for when and how to use it. Components document behavior, not just appearance."
          marginTop="lg"
          marginBottom="lg"
          radius="sm"
          size="lg"
          align="center"
          imgStyle={{ border: "1px solid var(--semantic-color-border-subtle)" }}
        />

        <Heading as="h3" size="lg" margin="md">Patterns</Heading>
        <Paragraph size="lg">
          Patterns describe how components work together to solve common
          interface problems: forms, data tables, filtering, cards, empty
          states, navigation, page headers, settings panels, and progressive
          disclosure. Patterns are especially important for AI because they
          reduce invention — instead of asking AI to "design a page," the
          system gives it known structures to assemble from.
        </Paragraph>
        <Figure
          src="img/a1/storybook-grid.png"
          alt="Storybook showing the bento grid pattern with responsive card tiles at varying spans"
          caption="The bento grid pattern — composable card layouts with responsive column and row spans, assembled entirely from system components with no custom CSS."
          marginTop="lg"
          marginBottom="lg"
          radius="sm"
          imgStyle={{ border: "1px solid var(--semantic-color-border-subtle)" }}
        />

        <Heading as="h3" size="lg" margin="md">Themes</Heading>
        <Paragraph size="lg">
          A1 supports multiple visual themes to test whether the system remains
          stable across different brand expressions — adjusting color ramps,
          typography pairings, border radius, density, and surface treatment.
          The purpose of theming is not only visual variety: it also tests
          whether the system's underlying rules are strong enough to survive
          aesthetic change.
        </Paragraph>
      </Section>

      {/* ── AI Prompt Guidance ───────────────────────────────────────────── */}
      <Section as="div" padding="md" surface="panel" contentWidth="md">
        <Heading as="h2" size="xl" margin="md">AI Prompt Guidance</Heading>
        <Paragraph size="lg">
          A1 includes promptable rules that shift AI from a visual generator
          into a design collaborator that can be directed, corrected, and
          evaluated. These rules direct AI to:
        </Paragraph>
        <List variant="unordered" size="lg">
          <ListItem>Follow the design system and use existing components only</ListItem>
          <ListItem>Avoid inventing new patterns</ListItem>
          <ListItem>Create priority guides before layout</ListItem>
          <ListItem>Respect spacing and hierarchy rules</ListItem>
          <ListItem>Use semantic structure and include accessibility considerations</ListItem>
          <ListItem>Account for responsive behavior</ListItem>
          <ListItem>Explain design decisions against system principles</ListItem>
        </List>
        <Spacer size="sm" />
        <Heading as="h3" size="lg" margin="md">Example Workflow</Heading>
        <Paragraph size="lg">
          A typical A1 workflow starts with a product scenario, then a priority
          guide to establish content-first structure before any visual design
          begins. AI is then directed to use system rules, components, and
          layout patterns — with the output evaluated against A1 standards
          rather than accepted as-is. Successful solutions are documented as
          reusable patterns or prompt templates within the system.
        </Paragraph>
        <Blockquote variant="pull">
          Create a SaaS analytics dashboard for a product operations team using the existing A1 components and theme.
        </Blockquote>
        <Paragraph size="lg">
          Before generating any layout, the process begins by defining the order
          of importance: current system health, critical alerts, key performance
          metrics, trend analysis, secondary filters, supporting details. This
          creates a content-first structure that drives every subsequent
          decision.
        </Paragraph>
      </Section>

      {/* ── What Made This Different ─────────────────────────────────────── */}
      <Section as="div" padding="md" contentWidth="md">
        <Heading as="h2" size="xl" margin="md">What Made This Different</Heading>
        <Paragraph size="lg">
          Most design systems are built for designers and developers. A1 was
          built for designers, developers, and AI. That required a different
          level of specificity.
        </Paragraph>
        <Paragraph size="lg">
          Instead of documenting only what a component looks like, A1 documents
          how decisions should be made. It gives AI the constraints it needs to
          produce better work and gives humans the review criteria needed to
          judge that work accurately. This turns the design system into an
          active design partner rather than a passive library.
        </Paragraph>

      <Figure
        src="img/a1/storybook-section-stacked.png"
        alt="Storybook showing three stacked Section bands: inverse dark, default white, and panel light — each with heading, paragraph, and button content"
        caption="The Section component's surface system — inverse, default, and panel — creates visual rhythm across page bands while automatically adapting to the active theme."
        marginTop="lg"
        marginBottom="lg"
      />
      </Section>

      {/* ── Outcomes ─────────────────────────────────────────────────────── */}
      <Section as="div" padding="sm" surface="raised" contentWidth="md" inverse>
        <Heading as="h2" size="lg" margin="md">Outcomes</Heading>
        <Paragraph size="lg">
          A1 Design System demonstrates how AI can be used to accelerate design
          and development without abandoning quality standards. The system helps:
        </Paragraph>
        <List variant="unordered" size="lg">
          <ListItem>Generate product concepts faster</ListItem>
          <ListItem>Maintain visual and structural consistency</ListItem>
          <ListItem>Reduce arbitrary design decisions</ListItem>
          <ListItem>Improve accessibility from the start</ListItem>
          <ListItem>Test themes across realistic product scenarios</ListItem>
          <ListItem>Create reusable prompts and patterns</ListItem>
          <ListItem>Evaluate AI-generated work more rigorously</ListItem>
          <ListItem>Bridge the gap between design intent and working software</ListItem>
        </List>
        <Spacer size="sm" />
        <Blockquote variant="border">
          AI does not replace design systems. It increases the need for them.
        </Blockquote>
      </Section>

      {/* ── Reflection ───────────────────────────────────────────────────── */}
      <Section as="div" padding="md" contentWidth="md">
        <Heading as="h2" size="xl" margin="md">Reflection</Heading>
        <Paragraph size="lg">
          AI changes the speed of design, but it does not remove the need for
          judgment. A strong design system gives AI something to follow. A
          strong designer knows when the result is working, when it is merely
          impressive, and when it needs to be challenged.
        </Paragraph>
        <Paragraph size="lg">
          A1 Design System is an exploration of that future: a system where
          rules, components, accessibility, product thinking, and AI direction
          work together to produce better digital experiences. The value is not
          just faster output. The value is faster output with stronger judgment
          behind it.
        </Paragraph>
        <Blockquote variant="feature" cite="On AI-first design systems">
          AI performs better when the rules are clearer. And better rules make everyone — human or machine — more effective.
        </Blockquote>
      </Section>
    </CaseStudyLayout>
  );
}
