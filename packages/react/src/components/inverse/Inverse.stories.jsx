import { Inverse } from "./Inverse.jsx";
import { Section } from "../section/Section.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Button } from "../button/Button.jsx";
import { Card } from "../card/Card.jsx";
import { MessageBadge } from "../message/Message.jsx";

const meta = {
  title: "Components/Containers/Inverse",
  component: Inverse,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    as: { control: "text" },
  },
};

export default meta;

// ─── Demo helpers ─────────────────────────────────────────────────────────────

function SampleContent() {
  return (
    <>
      <Heading as="h3" size="sm" style={{ marginBottom: "var(--base-spacing-8)" }}>
        Surface heading
      </Heading>
      <Paragraph size="sm" color="muted" style={{ marginBottom: "var(--base-spacing-16)" }}>
        Text, borders, and component colors all adapt to whichever color scheme
        is active on this surface.
      </Paragraph>
      <div style={{ display: "flex", gap: "var(--base-spacing-8)", flexWrap: "wrap" }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
      </div>
    </>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Use the `Section` component (`Components/Containers/Section`) for full-width page bands.
 * `Inverse` is best suited for inline elements: cards, articles, or any contained region
 * within a larger surface that should flip its color scheme.
 */
export const InCard = {
  name: "Inverse card",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)" }}>
      <Paragraph size="sm" color="muted">
        The card below uses <code>as="article"</code> so it renders semantic markup
        while applying the inverse color set.
      </Paragraph>

      <Card shadow="lg">
        <Inverse as="article" style={{ padding: "var(--base-spacing-32)" }}>
          <MessageBadge status="info">Highlighted</MessageBadge>
          <Heading as="h2" size="md" style={{ margin: "var(--base-spacing-12) 0 var(--base-spacing-8)" }}>
            Featured announcement
          </Heading>
          <Paragraph style={{ marginBottom: "var(--base-spacing-20)" }}>
            This entire card interior renders in the opposite color scheme from the
            surrounding page — dark in light mode, light in dark mode.
          </Paragraph>
          <Button variant="primary" icon="arrow_forward" iconPosition="end">
            Learn more
          </Button>
        </Inverse>
      </Card>
    </div>
  ),
};

/**
 * Inverse sections nest: a second `Inverse` inside the first flips back to the original
 * scheme. This works at any depth and across any theme.
 */
export const NestedInverse = {
  name: "Nested inverse",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>

      <div style={{
        padding: "var(--base-spacing-32)",
        background: "var(--semantic-color-surface-page)",
        border: "1px solid var(--semantic-color-border-subtle)",
        borderRadius: "var(--base-radius-lg) var(--base-radius-lg) 0 0",
      }}>
        <Paragraph size="xs" color="muted" style={{ marginBottom: "var(--base-spacing-4)" }}>Current theme surface</Paragraph>
        <SampleContent />
      </div>

      <Inverse style={{
        padding: "var(--base-spacing-32)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-4)",
      }}>
        <Paragraph size="xs" color="muted" style={{ marginBottom: "var(--base-spacing-4)" }}>Inverse surface</Paragraph>
        <SampleContent />

        <Inverse style={{
          padding: "var(--base-spacing-32)",
          marginTop: "var(--base-spacing-16)",
          borderRadius: "var(--base-radius-md)",
        }}>
          <Paragraph size="xs" color="muted" style={{ marginBottom: "var(--base-spacing-4)" }}>Double-inverse (original scheme)</Paragraph>
          <SampleContent />
        </Inverse>
      </Inverse>

    </div>
  ),
};

/**
 * For full-width page bands and hero sections, prefer `Section` with `inverse` prop.
 * This story shows both side by side to illustrate the relationship.
 */
export const VsSection = {
  name: "Inverse vs Section",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>
      <div style={{ padding: "var(--base-spacing-8) var(--base-spacing-16)", background: "var(--semantic-color-surface-raised)", fontSize: 12, color: "var(--semantic-color-text-muted)" }}>
        Use <strong>Section inverse</strong> for full-width page bands ↓
      </div>
      <Section padding="md" inverse>
        <Heading as="h2" size="lg" style={{ marginBottom: "var(--base-spacing-8)" }}>Section — full-width band</Heading>
        <Paragraph color="muted">
          <code>{'<Section padding="md" inverse>'}</code> — handles padding, width, and color-scheme in one component.
          Use for hero sections, CTAs, and page-level bands.
        </Paragraph>
      </Section>

      <div style={{ padding: "var(--base-spacing-8) var(--base-spacing-16)", background: "var(--semantic-color-surface-raised)", fontSize: 12, color: "var(--semantic-color-text-muted)" }}>
        Use <strong>Inverse</strong> for inline elements within a surface ↓
      </div>
      <div style={{ padding: "var(--base-spacing-32)" }}>
        <Card shadow="md">
          <Inverse as="article" style={{ padding: "var(--base-spacing-24)" }}>
            <Heading as="h3" size="sm" style={{ marginBottom: "var(--base-spacing-8)" }}>Inverse — inline element</Heading>
            <Paragraph size="sm" color="muted">
              <code>{'<Inverse as="article">'}</code> — flips the color scheme on a contained element
              without touching padding or width. Use inside cards, callouts, or modals.
            </Paragraph>
          </Inverse>
        </Card>
      </div>
    </div>
  ),
};
