import { Spacer } from "./Spacer.jsx";
import { Card } from "../card/Card.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Stack } from "../stack/Stack.jsx";

const meta = {
  title: "Components/Structure/Spacer",
  component: Spacer,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "xxl"],
    },
  },
};

export default meta;

export const Configurable = {
  args: {
    size: "md",
  },
  render: (args) => (
    <Card shadow="xs" style={{ maxWidth: 560 }}>
      <Stack gap="xs">
        <Heading as="h2" size="md">Spacer</Heading>
        <Paragraph color="muted">
          Spacer creates intentional vertical breathing room without adding visible content.
        </Paragraph>
        <div style={{ background: "var(--semantic-color-surface-raised)", padding: "var(--base-spacing-12)" }}>
          <Paragraph size="sm">Before</Paragraph>
          <Spacer {...args} />
          <Paragraph size="sm">After</Paragraph>
        </div>
      </Stack>
    </Card>
  ),
};

export const SizeScale = {
  name: "Size scale",
  parameters: { controls: { include: [] } },
  render: () => (
    <Stack gap="sm">
      {["xs", "sm", "md", "lg", "xl", "xxl"].map((size) => (
        <Card key={size} shadow="xs" style={{ maxWidth: 560 }}>
          <Stack gap="xs">
            <Heading as="h2" size="xs">{size}</Heading>
            <div style={{ background: "var(--semantic-color-surface-raised)", padding: "var(--base-spacing-8)" }}>
              <Paragraph size="xs">Before</Paragraph>
              <Spacer size={size} />
              <Paragraph size="xs">After</Paragraph>
            </div>
          </Stack>
        </Card>
      ))}
    </Stack>
  ),
};

export const ResponsiveSize = {
  name: "Responsive size",
  parameters: { controls: { include: [] } },
  render: () => (
    <Card shadow="xs" style={{ maxWidth: 560 }}>
      <Stack gap="xs">
        <Heading as="h2" size="md">Responsive spacer</Heading>
        <Paragraph color="muted">
          This spacer grows from small at xs to large from md upward.
        </Paragraph>
        <div style={{ background: "var(--semantic-color-surface-raised)", padding: "var(--base-spacing-12)" }}>
          <Paragraph size="sm">Before</Paragraph>
          <Spacer size={{ xs: "sm", md: "lg" }} />
          <Paragraph size="sm">After</Paragraph>
        </div>
      </Stack>
    </Card>
  ),
};
