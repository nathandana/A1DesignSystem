import {
  Blockquote,
  Button,
  ButtonContainer,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from "../../../packages/react/src/index.js";
import { getRoutePath } from "../utils/routing.js";

export function ProcessPage({ navigate }) {
  return (
    <>
      <Section inverse padding="lg" gap="md" contentWidth="lg">
        <MessageBadge size="lg" status="success" icon="psychology">Design process</MessageBadge>
        <Heading as="h1" type="display" size={{ xs: "lg", md: "xxl" }}>
          From curiosity to craft
        </Heading>
        <Paragraph size={{ xs: "md", md: "lg"}}>
          Design is problem-solving through discovery, structure, and
          iteration — combining empathy with execution. My process balances
          inquisitiveness, collaboration, and precision with speed and
          strategic thinking.
        </Paragraph>
      </Section>

      <Section surface="panel" padding="lg" gap="xs" contentWidth="md">
        <Stack direction={{ xs: "column", sm: "row" }} gap="lg">
          <Stack gap="lg" direction="column">
            <Heading type="display" size={{ xs: "lg", md: "xxl" }}>Asking bold questions</Heading>
            <Paragraph size="lg" color="muted">
              Great solutions require deeply understanding the problem first. I lean into curiosity through design jams and stakeholder workshops — not just asking what, but always why. This phase is about listening, aligning with business goals, understanding user pain points, and uncovering the constraints that actually shape what's possible. I ask the uncomfortable questions across product, design, accessibility, and engineering that others sometimes avoid.
            </Paragraph>
            <Blockquote>Help me understand the hierarchy here. Is this new feature the most important thing for the user?</Blockquote>
          </Stack>
        </Stack>
      </Section>

      <Section padding="lg" gap="xs" contentWidth="md">
        <Stack direction={{ xs: "column", sm: "row" }} gap="lg">
          <Stack gap="lg">
            <Heading type="display" size={{ xs: "lg", md: "xxl" }}>Start ugly and sharp</Heading>
            <Paragraph size="lg" color="muted">
              I'm not a visual artist — and that's a strength, not a limitation. Fat Sharpies, small Post-its, and whiteboards force rapid iteration, clear thinking, and early collaboration. When fidelity is low, feedback is honest. I advocate for content-first design from the start, building around semantic structure and clear hierarchy aligned with accessibility standards. If a screen reader can't navigate it meaningfully, neither can a user.
            </Paragraph>
            <Blockquote>Can you say that back to me in your own words? I want to make sure I'm not talking about triangles when you are talking about pyramids.</Blockquote>
          </Stack>
        </Stack>
      </Section>

      <Section surface="panel" padding="lg" gap="xs" contentWidth="md">
        <Stack direction={{ xs: "column", sm: "row" }} gap="lg">
          <Stack gap="lg">
            <Heading type="display" size={{ xs: "lg", md: "xxl" }}>Jumping into Figma</Heading>
            <Paragraph size="lg" color="muted">
              I leverage deep Figma expertise — components, variables, auto layout, and interactive prototyping — to move quickly without sacrificing scalability or brand consistency. Libraries and systems are the foundation. When a flow is too complex for Figma to communicate accurately, I'll build a quick CodePen or coded prototype instead. AI tools turn repetitive work into minutes, freeing attention for the decisions that actually matter.
            </Paragraph>
            <Blockquote>Check out this quick CodePen I threw together — it better illustrates how responsive behavior should work here.</Blockquote>
          </Stack>
        </Stack>
      </Section>

      <Section padding="lg" gap="xs" contentWidth="md">
        <Stack direction={{ xs: "column", sm: "row" }} gap="lg">
          <Stack gap="lg">
            <Heading type="display" size={{ xs: "lg", md: "xxl" }}>Feedback is fuel</Heading>
            <Paragraph size="lg" color="muted">
              Research isn't a checkpoint — it's an ongoing rhythm. I test early with paper sketches and teammates, then move into usability testing, stakeholder walkthroughs, and analytics as fidelity increases. Sharing work early and often, with leadership, developers, accessibility experts, and end-users, leads to better outcomes and avoids the expensive surprises that come from late-stage feedback. The best validation finds what's broken before it ships.
            </Paragraph>
            <Blockquote>Feedback when you think you are done is the absolute worst. Early on, it's no big deal.</Blockquote>
          </Stack>
        </Stack>
      </Section>

      <Section surface="panel" padding="lg" gap="xs" contentWidth="md">
        <Stack direction={{ xs: "column", sm: "row" }} gap="lg">
          <Stack gap="lg">
            <Heading type="display" size={{ xs: "lg", md: "xxl" }}>Obsess the details</Heading>
            <Paragraph size="lg" color="muted">
              As a project nears completion, my focus sharpens on the details that separate good from great: spacing, hierarchy, interaction logic, accessibility labels, and token consistency. I pair closely with developers through ticket review, documentation, and direct collaboration to ensure high-quality delivery. Every intentional pixel and property decision in this phase is also an investment in the next project — making the system smarter, faster, and more consistent over time.
            </Paragraph>
            <Blockquote>I'm so glad we are past the days of project-final-37.psd.</Blockquote>
          </Stack>
        </Stack>
      </Section>

      <Section inverse padding="lg" gap="md" contentWidth="md">
        <MessageBadge subtle icon="handshake">Building relationships</MessageBadge>
        <Heading as="h2" type="display" size={{ xs: "xl", md: "xxl" }}>Capital in – capital out</Heading>
        <Paragraph size="lg" color="muted">
          Design requires trust — and trust is built through relationships.
          Relationships are capital: earned by listening, supporting,
          documenting, and delivering, and sometimes spent to get a favor or
          move a timeline forward. The best partnerships aren't transactional
          — they're built on mutual respect earned by showing up across every
          discipline and understanding how design can help each person succeed.
        </Paragraph>
        <Paragraph size="md" color="muted">
          I invest time understanding product managers, engineers,
          researchers, and accessibility specialists — not just as
          stakeholders, but as collaborators with their own goals, pressures,
          and expertise. That investment pays dividends on every project.
        </Paragraph>
        <Blockquote variant="feature">
          Relationships are all about capital. You build it by showing up, and sometimes you spend it to move things forward.
        </Blockquote>
      </Section>


    </>
  );
}
