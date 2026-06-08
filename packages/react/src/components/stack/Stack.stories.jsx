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
      description: "Also accepts a breakpoint object: { xs: 'column', md: 'row' }",
    },
    gap: {
      control: "select",
      options: ["xs", "sm", "md", "lg", 0, 2, 4, 8, 12, 16, 24, 32, 40],
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
    gap: "md",
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

export const ResponsiveDirection = {
  name: "Responsive direction",
  render: () => (
    <Card shadow="xs" style={{ maxWidth: 560 }}>
      <Stack direction={{ xs: "column", sm: "row" }} gap="md" align="start">
        <Heading as="h3" size="sm" style={{ whiteSpace: "nowrap" }}>Label</Heading>
        <Paragraph color="muted">
          This stack is column on mobile and switches to row at the sm breakpoint.
          Resize the viewport to see the layout change.
        </Paragraph>
      </Stack>
    </Card>
  ),
};

export const GapScale = {
  name: "Gap scale",
  render: () => (
    <>
      {["xs", "sm", "md", "lg"].map((size) => (
        <Card key={size} shadow="xs" style={{ maxWidth: 560, marginBottom: 16 }}>
          <Stack gap={size}>
            <Heading as="h3" size="sm">gap="{size}"</Heading>
            <Paragraph color="muted">First item in the stack.</Paragraph>
            <Paragraph color="muted">Second item in the stack.</Paragraph>
            <Paragraph color="muted">Third item in the stack.</Paragraph>
          </Stack>
        </Card>
      ))}
    </>
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
