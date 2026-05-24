import { Stack } from "./Stack.jsx";
import { Button } from "../button/Button.jsx";
import { Card } from "../card/Card.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

const meta = {
  title: "Components/Structure/Stack",
  component: Stack,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    direction: {
      control: "select",
      options: ["column", "column-reverse", "row", "row-reverse"],
    },
    gap: {
      control: "select",
      options: [0, 2, 4, 8, 12, 16, 24, 32, 40],
    },
    align: {
      control: "select",
      options: ["stretch", "start", "center", "end", "baseline"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
    },
    wrap: { control: "boolean" },
  },
};

export default meta;

export const Configurable = {
  args: {
    direction: "column",
    gap: 16,
    align: "stretch",
    justify: "start",
    wrap: false,
  },
  render: (args) => (
    <Card shadow="xs" style={{ maxWidth: 560 }}>
      <Stack {...args}>
        <Heading as="h2" size="md">Stack</Heading>
        <Paragraph color="muted">
          Stack arranges children in a single axis with token-based spacing.
        </Paragraph>
        <Button variant="secondary">Secondary action</Button>
        <Button>Primary action</Button>
      </Stack>
    </Card>
  ),
};

export const ContentStack = {
  name: "Content stack",
  render: () => (
    <Card shadow="xs" style={{ maxWidth: 560 }}>
      <Stack gap={12}>
        <Heading as="h2" size="md">Release checklist</Heading>
        <Paragraph color="muted">
          Use smaller gaps for tightly related text and larger gaps when moving between groups.
        </Paragraph>
        <Stack gap={8}>
          <Paragraph>Validate component states</Paragraph>
          <Paragraph>Run visual review</Paragraph>
          <Paragraph>Publish Storybook</Paragraph>
        </Stack>
      </Stack>
    </Card>
  ),
};
