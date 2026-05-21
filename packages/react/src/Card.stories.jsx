import { Card } from "./Card.jsx";
import { Button } from "./Button.jsx";
import { Heading } from "./Heading.jsx";
import { Paragraph } from "./Paragraph.jsx";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    shadow: "sm",
    icon: undefined
  },
  argTypes: {
    as: {
      control: "select",
      options: ["div", "article", "section"]
    },
    icon: {
      control: "text",
      description: "Material Symbols icon name (e.g. \"star\", \"bolt\", \"shield\")"
    },
    shadow: {
      control: "inline-radio",
      options: ["none", "xs", "sm", "md", "lg", "xl"]
    }
  },
  render: ({ shadow, icon }) => (
    <Card shadow={shadow} icon={icon} style={{ width: 320 }}>
      <Heading as="h3" size="sm" style={{ marginBottom: "8px" }}>
        Card title
      </Heading>
      <Paragraph color="muted">Supporting text describing the card content.</Paragraph>
    </Card>
  )
};

export default meta;

export const Configurable = {};

export const WithIcon = {
  name: "With Icon",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
      <Card shadow="sm" icon="bolt" style={{ width: 280 }}>
        <Heading as="h3" size="sm" style={{ marginBottom: "8px" }}>Performance</Heading>
        <Paragraph color="muted">Built for speed with optimised rendering throughout.</Paragraph>
      </Card>
      <Card shadow="sm" icon="shield" style={{ width: 280 }}>
        <Heading as="h3" size="sm" style={{ marginBottom: "8px" }}>Security</Heading>
        <Paragraph color="muted">Enterprise-grade security baked in from the ground up.</Paragraph>
      </Card>
      <Card shadow="sm" icon="star" style={{ width: 280 }}>
        <Heading as="h3" size="sm" style={{ marginBottom: "8px" }}>Quality</Heading>
        <Paragraph color="muted">Every token and component reviewed against design standards.</Paragraph>
      </Card>
    </div>
  )
};

export const ShadowScale = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        padding: "32px",
        background: "var(--semantic-color-surface-page)"
      }}
    >
      {["none", "xs", "sm", "md", "lg", "xl"].map(shadow => (
        <Card key={shadow} shadow={shadow} style={{ width: 160 }}>
          <Heading as="h4" size="xs" style={{ marginBottom: "4px" }}>{shadow}</Heading>
          <Paragraph size="xs" color="muted">shadow="{shadow}"</Paragraph>
        </Card>
      ))}
    </div>
  )
};

export const WithActions = {
  render: () => (
    <Card shadow="sm" icon="check_circle" style={{ width: 320 }}>
      <Heading as="h3" size="sm" style={{ marginBottom: "8px" }}>Confirm action</Heading>
      <Paragraph color="muted" style={{ marginBottom: "20px" }}>
        Cards can contain any content including action buttons.
      </Paragraph>
      <div style={{ display: "flex", gap: "8px" }}>
        <Button variant="primary" icon="check" iconPosition="start">Confirm</Button>
        <Button variant="secondary">Cancel</Button>
      </div>
    </Card>
  )
};
