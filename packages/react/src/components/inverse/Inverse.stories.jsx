import { Inverse } from "./Inverse.jsx";
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

const padding = "var(--base-spacing-32)";

function SurfaceLabel({ children }) {
  return (
    <Paragraph size="xs" color="muted" style={{ marginBottom: "var(--base-spacing-4)" }}>
      {children}
    </Paragraph>
  );
}

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

export const Default = {
  name: "Inverse section",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>

      {/* Ambient surface (follows the active theme) */}
      <div style={{
        padding,
        background: "var(--semantic-color-surface-page)",
        border: "1px solid var(--semantic-color-border-subtle)",
        borderRadius: "var(--base-radius-lg) var(--base-radius-lg) 0 0",
      }}>
        <SurfaceLabel>Current theme surface</SurfaceLabel>
        <SampleContent />
      </div>

      {/* Inverse section */}
      <Inverse style={{
        padding,
        borderRadius: "0 0 var(--base-radius-lg) var(--base-radius-lg)",
      }}>
        <SurfaceLabel>Inverse surface</SurfaceLabel>
        <SampleContent />
      </Inverse>

    </div>
  ),
};

export const InCard = {
  name: "Inverse card",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)" }}>
      <Paragraph size="sm" color="muted">
        The card below uses <code>as="article"</code> so it renders semantic markup
        while applying the inverse color set.
      </Paragraph>

      <Card shadow="lg">
        <Inverse as="article" style={{ padding }}>
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

export const NestedInverse = {
  name: "Nested inverse",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>

      <div style={{
        padding,
        background: "var(--semantic-color-surface-page)",
        border: "1px solid var(--semantic-color-border-subtle)",
        borderRadius: "var(--base-radius-lg) var(--base-radius-lg) 0 0",
      }}>
        <SurfaceLabel>Current theme surface</SurfaceLabel>
        <SampleContent />
      </div>

      <Inverse style={{ padding, display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>
        <SurfaceLabel>Inverse surface</SurfaceLabel>
        <SampleContent />

        {/* Second inverse: back to original scheme */}
        <Inverse style={{
          padding,
          marginTop: "var(--base-spacing-16)",
          borderRadius: "var(--base-radius-md)",
        }}>
          <SurfaceLabel>Double-inverse (original scheme)</SurfaceLabel>
          <SampleContent />
        </Inverse>
      </Inverse>

    </div>
  ),
};
