import { useState } from "react";
import { Card } from "./Card.jsx";
import { Button } from "../button/Button.jsx";
import { ButtonContainer } from "../button-container/ButtonContainer.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Link } from "../link/Link.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

const HERO_COLORS = ["action", "neutral", "info", "success", "warn", "error"];

const meta = {
  title: "Components/Containers/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    bare: false,
    icon: undefined,
    heroIcon: undefined,
    heroColor: "action",
  },
  argTypes: {
    as: {
      control: "select",
      options: ["div", "article", "section"],
    },
    bare: {
      control: "boolean",
      description: "Removes all visual chrome and padding",
    },
    icon: {
      control: "text",
      description: "Small icon in the card header (Material Symbols name)",
    },
    heroIcon: {
      control: "text",
      description: "Full-bleed hero icon at the top of the card (Material Symbols name)",
    },
    heroColor: {
      control: "select",
      options: HERO_COLORS,
      description: "Background color of the hero icon area",
    },
  },
  render: ({ bare, icon, heroIcon, heroColor }) => (
    <Card bare={bare} icon={icon} heroIcon={heroIcon} heroColor={heroColor} style={{ width: 320 }}>
      <Heading as="h3" size="sm" style={{ marginBottom: "8px" }}>Card title</Heading>
      <Paragraph color="muted">Supporting text describing the card content.</Paragraph>
    </Card>
  ),
};

export default meta;

export const Configurable = {};

/* ── Small icon ───────────────────────────────────────────────────────────── */

export const WithSmallIcon = {
  name: "With small icon",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
      <Card icon="bolt" style={{ width: 280 }}>
        <Heading as="h3" size="sm" style={{ marginBottom: "8px" }}>Performance</Heading>
        <Paragraph color="muted">Built for speed with optimised rendering throughout.</Paragraph>
      </Card>
      <Card icon="shield" style={{ width: 280 }}>
        <Heading as="h3" size="sm" style={{ marginBottom: "8px" }}>Security</Heading>
        <Paragraph color="muted">Enterprise-grade security baked in from the ground up.</Paragraph>
      </Card>
      <Card icon="star" style={{ width: 280 }}>
        <Heading as="h3" size="sm" style={{ marginBottom: "8px" }}>Quality</Heading>
        <Paragraph color="muted">Every token and component reviewed against design standards.</Paragraph>
      </Card>
    </div>
  ),
};

/* ── Big icon ─────────────────────────────────────────────────────────────── */

const ICON_CARDS = [
  { heroIcon: "bolt",    heroColor: "action",  label: "Performance", body: "Optimised rendering keeps every interaction snappy at any scale." },
  { heroIcon: "shield",  heroColor: "success", label: "Security",    body: "Enterprise-grade protections baked in from the ground up." },
  { heroIcon: "warning", heroColor: "warn",    label: "Monitoring",  body: "Alerts surface issues before they affect your end users." },
  { heroIcon: "star",    heroColor: "error",   label: "Quality",     body: "Every component reviewed against the full design standard." },
];

export const BigIcon = {
  name: "Big icon",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
      {ICON_CARDS.map(({ heroIcon, heroColor, label, body }) => (
        <Card key={label} heroIcon={heroIcon} heroColor={heroColor} style={{ width: 240 }}>
          <Heading as="h3" size="sm" style={{ marginBottom: "var(--base-spacing-8)" }}>{label}</Heading>
          <Paragraph size="sm" color="muted">{body}</Paragraph>
        </Card>
      ))}
    </div>
  ),
};

/* ── With actions ─────────────────────────────────────────────────────────── */

export const WithActions = {
  name: "With actions",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
      <Card style={{ width: 320 }}>
        <Heading as="h3" size="sm" style={{ marginBottom: "var(--base-spacing-8)" }}>Confirm action</Heading>
        <Paragraph color="muted" style={{ marginBottom: "var(--base-spacing-20)" }}>
          Are you sure you want to proceed? This cannot be undone.
        </Paragraph>
        <ButtonContainer align="end">
          <Button variant="primary" icon="check">Confirm</Button>
          <Button variant="secondary">Cancel</Button>
        </ButtonContainer>
      </Card>

      <Card style={{ width: 320 }}>
        <Heading as="h3" size="sm" style={{ marginBottom: "var(--base-spacing-8)" }}>Upgrade plan</Heading>
        <Paragraph color="muted" style={{ marginBottom: "var(--base-spacing-20)" }}>
          Unlock unlimited exports, priority support, and advanced analytics.
        </Paragraph>
        <ButtonContainer align="start">
          <Button variant="primary">Upgrade now</Button>
          <Link href="#">Compare plans</Link>
        </ButtonContainer>
      </Card>
    </div>
  ),
};

/* ── Read more ────────────────────────────────────────────────────────────── */

const EXPANDABLE_CARDS = [
  {
    title: "What is a design token?",
    preview: "Design tokens are the atomic values that underpin your visual language — spacing, colour, and type all in one place.",
    full: "Design tokens are the atomic values that underpin your visual language — spacing, colour, and type all in one place. They replace hardcoded values like #2563eb or 16px with named references like color.action.background and spacing.16, which can be swapped across platforms without touching component code. A single token change ripples consistently across web, iOS, and Android simultaneously.",
  },
  {
    title: "Component anatomy",
    preview: "Every component is built from tokens, making it straightforward to update a single value and see it ripple across the system.",
    full: "Every component is built from tokens, making it straightforward to update a single value and see it ripple across the system. A button's background, padding, border-radius, and focus ring are all token references. Swap a brand colour in the token file and every button, link, and badge updates automatically — no find-and-replace required.",
  },
  {
    title: "Contributing guidelines",
    preview: "Learn how to propose new components, raise token changes, and get your work reviewed by the design systems team.",
    full: "Learn how to propose new components, raise token changes, and get your work reviewed by the design systems team. Start by opening a discussion in the #design-system Slack channel, then follow the RFC template to describe the problem, proposed API, and accessibility considerations. All contributions require a Storybook story and a passing accessibility audit before merging.",
  },
];

function ExpandableCard({ title, preview, full }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card style={{ width: 300 }}>
      <Heading as="h3" size="sm" style={{ marginBottom: "var(--base-spacing-8)" }}>{title}</Heading>
      <Paragraph size="sm" color="muted" style={{ marginBottom: "var(--base-spacing-16)" }}>
        {expanded ? full : preview}
      </Paragraph>
      <Button
        variant="tertiary"
        size="sm"
        icon={expanded ? "expand_less" : "expand_more"}
        iconPosition="end"
        onClick={() => setExpanded(e => !e)}
      >
        {expanded ? "Show less" : "Read more"}
      </Button>
    </Card>
  );
}

export const ReadMore = {
  name: "Read more",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
      {EXPANDABLE_CARDS.map(card => <ExpandableCard key={card.title} {...card} />)}
    </div>
  ),
};

/* ── Bare variant ─────────────────────────────────────────────────────────── */

export const Bare = {
  name: "Bare (no chrome)",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "flex-start" }}>
      <div>
        <Paragraph size="xs" color="muted" style={{ marginBottom: "var(--base-spacing-8)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Default</Paragraph>
        <Card style={{ width: 280 }}>
          <Heading as="h3" size="sm" style={{ marginBottom: "var(--base-spacing-8)" }}>Standard card</Heading>
          <Paragraph color="muted">Full border, shadow and padding.</Paragraph>
        </Card>
      </div>
      <div>
        <Paragraph size="xs" color="muted" style={{ marginBottom: "var(--base-spacing-8)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bare</Paragraph>
        <Card bare style={{ width: 280 }}>
          <Heading as="h3" size="sm" style={{ marginBottom: "var(--base-spacing-8)" }}>Bare card</Heading>
          <Paragraph color="muted">No border, shadow or padding — just structure.</Paragraph>
        </Card>
      </div>
    </div>
  ),
};
