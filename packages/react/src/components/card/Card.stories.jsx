import { useState } from "react";
import { Card } from "./Card.jsx";
import { Button } from "../button/Button.jsx";
import { ButtonContainer } from "../button-container/ButtonContainer.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Link } from "../link/Link.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { iconArgType } from "../../storybook/icon-controls.js";

const HERO_COLORS = ["action", "neutral", "info", "success", "warn", "error"];

const meta = {
  title: "Components/Containers/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    bare: false,
    variant: "default",
    icon: undefined,
    iconDisplay: "default",
    heroColor: "action",
  },
  argTypes: {
    as: {
      control: "select",
      options: ["div", "article", "section"],
    },
    variant: {
      control: "select",
      options: ["default", "navigation"],
      description: "Use navigation when the whole card links to another page. Do not place buttons or links inside navigation cards.",
    },
    bare: {
      control: "boolean",
      description: "Removes all visual chrome and padding",
    },
    icon: {
      ...iconArgType("Material Symbols icon name"),
    },
    iconDisplay: {
      control: "inline-radio",
      options: ["none", "default", "hero"],
      description: "How the icon is rendered. default = small block above content (scales with container). hero = full-bleed coloured header.",
    },
    heroColor: {
      control: "select",
      options: HERO_COLORS,
      description: "Background colour of the hero area (only used when iconDisplay=\"hero\")",
    },
    heroBadge: {
      control: "text",
      description: "Badge label overlaid on the hero (only with iconDisplay=\"hero\")",
    },
    heroBadgeStatus: {
      control: "select",
      options: ["neutral", "info", "success", "warn", "error"],
      description: "Status colour of the hero badge",
    },
    heroBadgePosition: {
      control: "select",
      options: [
        "top-start", "top-center", "top-end",
        "middle-start", "middle-center", "middle-end",
        "bottom-start", "bottom-center", "bottom-end",
      ],
      description: "3×3 placement of the hero badge",
    },
  },
  render: ({ bare, variant, icon, iconDisplay, heroColor, heroBadge, heroBadgeStatus, heroBadgePosition }) => (
    <Card
      bare={bare}
      variant={variant}
      href={variant === "navigation" ? "#" : undefined}
      icon={icon}
      iconDisplay={iconDisplay}
      heroColor={heroColor}
      heroBadge={heroBadge || undefined}
      heroBadgeStatus={heroBadgeStatus}
      heroBadgePosition={heroBadgePosition}
    >
      <Heading as="h3" size="sm" style={{ marginBottom: "8px" }}>Card title</Heading>
      <Paragraph color="muted">Supporting text describing the card content.</Paragraph>
    </Card>
  ),
};

export default meta;

export const Configurable = {};

/* ── Default icon — responsive scaling ───────────────────────────────────── */

export const IconDefaultResponsive = {
  name: "Default icon — responsive (resize to see steps)",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Paragraph size="sm" color="muted">
        Drag the card width or resize the window. At ≥ 320 px the icon grows one step, at ≥ 480 px the box expands, at ≥ 640 px the icon shifts left alongside the content.
      </Paragraph>
      <div style={{ resize: "horizontal", overflow: "hidden", minWidth: 200, maxWidth: 900, border: "1px dashed var(--semantic-color-border-subtle)", padding: 8 }}>
        <Card icon="bolt">
          <Heading as="h3" size="sm" style={{ marginBottom: "8px" }}>Responsive icon</Heading>
          <Paragraph color="muted">This card responds to its own width via container queries.</Paragraph>
        </Card>
      </div>
    </div>
  ),
};

/* ── Default icon — three at once ────────────────────────────────────────── */

export const WithIcon = {
  name: "With icon (default display)",
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

/* ── Navigation variant ──────────────────────────────────────────────────── */

export const Navigation = {
  name: "Navigation",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "grid", gap: "var(--base-spacing-16)" }}>
      <Card variant="navigation" href="#" icon="palette">
        <Heading as="h3" size="sm" style={{ marginBottom: "var(--base-spacing-8)" }}>
          Color foundation
        </Heading>
        <Paragraph color="muted">
          Navigate to the color foundation page. Navigation cards must not contain nested buttons or links.
        </Paragraph>
      </Card>
      <Card variant="navigation" href="#" icon="widgets">
        <Heading as="h3" size="sm" style={{ marginBottom: "var(--base-spacing-8)" }}>
          Components
        </Heading>
        <Paragraph color="muted">
          Use the whole card as one target when the card represents a single destination.
        </Paragraph>
      </Card>
    </div>
  ),
};

/* ── Hero icon ───────────────────────────────────────────────────────────── */

const ICON_CARDS = [
  { icon: "bolt",    heroColor: "action",  label: "Performance", body: "Optimised rendering keeps every interaction snappy at any scale." },
  { icon: "shield",  heroColor: "success", label: "Security",    body: "Enterprise-grade protections baked in from the ground up." },
  { icon: "warning", heroColor: "warn",    label: "Monitoring",  body: "Alerts surface issues before they affect your end users." },
  { icon: "star",    heroColor: "error",   label: "Quality",     body: "Every component reviewed against the full design standard." },
];

export const HeroIcon = {
  name: "Hero icon",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
      {ICON_CARDS.map(({ icon, heroColor, label, body }) => (
        <Card key={label} icon={icon} iconDisplay="hero" heroColor={heroColor} style={{ width: 240 }}>
          <Heading as="h3" size="sm" style={{ marginBottom: "var(--base-spacing-8)" }}>{label}</Heading>
          <Paragraph size="sm" color="muted">{body}</Paragraph>
        </Card>
      ))}
    </div>
  ),
};

export const HeroBadge = {
  name: "Hero badge (3×3 placement)",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
      {[
        { pos: "top-end", status: "success", badge: "New", label: "Top end" },
        { pos: "top-start", status: "info", badge: "Beta", label: "Top start" },
        { pos: "bottom-end", status: "warn", badge: "Sale", label: "Bottom end" },
        { pos: "middle-center", status: "error", badge: "Live", label: "Centre" },
      ].map(({ pos, status, badge, label }) => (
        <Card key={pos} icon="image" iconDisplay="hero" heroColor="neutral" heroBadge={badge} heroBadgeStatus={status} heroBadgePosition={pos} style={{ width: 240 }}>
          <Heading as="h3" size="sm" style={{ marginBottom: "var(--base-spacing-8)" }}>{label}</Heading>
          <Paragraph size="sm" color="muted">A badge overlaid on the hero, placed via the 3×3 grid.</Paragraph>
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
