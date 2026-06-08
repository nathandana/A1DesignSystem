import {
  Blockquote,
  ButtonContainer,
  Button,
  Heading,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  Section,
  Spacer,
  Stack,
  Grid,
} from "../../../packages/react/src/index.js";
import { getRoutePath } from "../utils/routing.js";

const values = [
  {
    icon: "accessibility_new",
    label: "Accessible by default",
    body: "Accessibility isn't a checklist item — it's a design constraint that makes everything better. I design with semantic structure, keyboard navigation, and screen readers in mind from the very first sketch.",
  },
  {
    icon: "hub",
    label: "Systems thinking",
    body: "Every component I design is part of a larger ecosystem. I think in patterns, tokens, and relationships — building things that scale instead of solving the same problem twice.",
  },
  {
    icon: "groups",
    label: "Collaboration first",
    body: "The best design decisions happen in conversation with engineers, product managers, researchers, and the people actually using the product. I design with others, not for them.",
  },
  {
    icon: "smart_toy",
    label: "AI as a design material",
    body: "I work at the edge of AI and UX — shaping how intelligent systems communicate, behave, and earn user trust. Good AI design makes the model's capabilities legible without making the complexity visible.",
  },
];

export function AboutPage({ navigate }) {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Section inverse padding="lg" gap="md" contentWidth="lg">
        <MessageBadge size="lg" icon="person">About me</MessageBadge>
        <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo" }}>
          Designing at the edge of what's possible
        </Heading>
        <Paragraph size={{ xs: "md", md: "lg" }} color="muted">
          I'm a <strong>Principal AI Designer</strong> with over 20 years of experience shaping
          enterprise products, design systems, and — more recently — AI-native
          experiences. I bring systems thinking, deep accessibility knowledge,
          and a bias toward clarity to every problem I touch.
        </Paragraph>
      </Section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <Section padding="sm" gap="lg" contentWidth="md">
        <Heading as="h2" type="display" size={{ xs: "lg", md: "xxl" }} margin="sm">
          The longer version
        </Heading>
        <Paragraph size="lg" color="muted">
          I started as a web designer in the late 1990s — hand-coding HTML in text editors and
          CSS before most people had a name for what we were doing. Over time my
          work grew from visual design into interaction design, and eventually
          into the complex challenge of designing at scale inside large
          organizations.
        </Paragraph>
        <Paragraph size="lg" color="muted">
          I spent nearly a decade in the automotive research space working on
          consumer-facing search and vehicle detail experiences used by millions
          of car shoppers each month. That work taught me how to balance speed
          of iteration with the stakes of high-intent, high-anxiety decisions.
        </Paragraph>
        <Paragraph size="lg" color="muted">
          From there I became deeply invested in design systems — building
          Transform, an internal system used daily by 20,000+ employees at a
          Fortune 25 enterprise, and Fondue, a structured and accessible system
          for a growing healthcare platform. Design systems changed how I
          think: everything became a component, a token, a pattern.
        </Paragraph>
        <Paragraph size="lg" color="muted">
          Now I'm focused on AI-native design — working on how intelligent
          systems present information, earn trust, and stay legible as they grow
          more capable. It's the hardest design problem I've encountered, and
          the most important.
        </Paragraph>
        <Blockquote variant="feature" cite="On design systems">
          Every decision you make inside a system either makes the next decision easier or harder. I try to make them easier.
        </Blockquote>
      </Section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <Section surface="panel" padding="lg" gap="lg" contentWidth="lg">
        <Heading as="h2" type="display" size={{ xs: "lg", md: "xxl" }} margin="sm">
          What I believe
        </Heading>
        <Grid columns={{ xs: 1, sm: 2 }} gap="xl">
          {values.map(({ icon, label, body }) => (
            <Stack key={label} gap="sm">
              <Heading as="h3" size="sm">
                {label}
              </Heading>
              <Paragraph color="muted">{body}</Paragraph>
            </Stack>
          ))}
        </Grid>
      </Section>

      {/* ── Skills & Tools ───────────────────────────────────────────────── */}
      <Section padding="lg" gap="lg" contentWidth="md">
        <Heading as="h2" type="display" size={{ xs: "lg", md: "xxl" }} margin="sm">
          Skills &amp; tools
        </Heading>
        <Grid columns={{ xs: 1, sm: 2 }} gap="xl">
          <div>
            <Heading as="h3" size="sm" margin="sm">Design</Heading>
            <List variant="divider">
              <ListItem>UX &amp; interaction design</ListItem>
              <ListItem>Design systems architecture</ListItem>
              <ListItem>Accessibility (WCAG, ARIA)</ListItem>
              <ListItem>Information architecture</ListItem>
              <ListItem>Prototyping &amp; usability testing</ListItem>
              <ListItem>AI/LLM experience design</ListItem>
            </List>
          </div>
          <div>
            <Heading as="h3" size="sm" margin="sm">Tools &amp; technology</Heading>
            <List variant="divider">
              <ListItem>Figma (components, variables, prototyping)</ListItem>
              <ListItem>HTML, CSS, JavaScript, React</ListItem>
              <ListItem>Style Dictionary / design tokens</ListItem>
              <ListItem>Storybook</ListItem>
              <ListItem>Claude, ChatGPT, Cursor, Claude Code</ListItem>
              <ListItem>Git, GitHub, CI/CD workflows</ListItem>
            </List>
          </div>
        </Grid>
      </Section>


      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <Section inverse padding="lg" gap="md" contentWidth="md">
        <MessageBadge subtle icon="handshake">Let's connect</MessageBadge>
        <Heading as="h2" type="display" size={{ xs: "xl", md: "xxl" }}>
          Want to work together?
        </Heading>
        <Paragraph size="lg" color="muted">
          I'm open to new opportunities, consulting engagements, and
          interesting conversations about design, AI, and the problems worth
          solving.
        </Paragraph>
        <Spacer size="xs" />
        <ButtonContainer>
          <Button
            variant="primary"
            icon="mail"
            href={getRoutePath("contact")}
            onClick={navigate ? (e) => { e.preventDefault(); navigate("contact"); } : undefined}
          >
            Get in touch
          </Button>
          <Button
            variant="secondary"
            href={getRoutePath("resume")}
            onClick={navigate ? (e) => { e.preventDefault(); navigate("resume"); } : undefined}
          >
            View résumé
          </Button>
        </ButtonContainer>
      </Section>
    </>
  );
}
