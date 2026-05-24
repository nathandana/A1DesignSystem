import { Cluster } from "./Cluster.jsx";
import { Button } from "../button/Button.jsx";
import { Card } from "../card/Card.jsx";
import { Heading } from "../heading/Heading.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

const meta = {
  title: "Components/Structure/Cluster",
  component: Cluster,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    gap: {
      control: "select",
      options: [0, 2, 4, 8, 12, 16, 24, 32],
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch", "baseline"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
    },
  },
};

export default meta;

export const Configurable = {
  args: {
    gap: 8,
    align: "center",
    justify: "start",
  },
  render: (args) => (
    <Card shadow="xs" style={{ maxWidth: 640 }}>
      <Cluster {...args}>
        <MessageBadge subtle status="success">Ready</MessageBadge>
        <MessageBadge subtle status="info">Docs</MessageBadge>
        <MessageBadge subtle status="warn">Review</MessageBadge>
        <Button size="sm" variant="secondary">Open</Button>
        <Button size="sm">Publish</Button>
      </Cluster>
    </Card>
  ),
};

export const WrappingActions = {
  name: "Wrapping actions",
  render: () => (
    <Card shadow="xs" style={{ maxWidth: 520 }}>
      <Heading as="h2" size="md">Cluster</Heading>
      <Paragraph color="muted">
        Cluster wraps inline groups while preserving consistent row and column gaps.
      </Paragraph>
      <Cluster gap={8}>
        <Button size="sm" variant="secondary">Preview</Button>
        <Button size="sm" variant="secondary">Duplicate</Button>
        <Button size="sm" variant="secondary">Archive</Button>
        <Button size="sm">Share</Button>
      </Cluster>
    </Card>
  ),
};
