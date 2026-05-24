import { Bleed } from "./Bleed.jsx";
import { Card } from "../card/Card.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Inset } from "../inset/Inset.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Stack } from "../stack/Stack.jsx";

const meta = {
  title: "Components/Structure/Bleed",
  component: Bleed,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    space: {
      control: "select",
      options: [0, 4, 8, 12, 16, 24, 32, 40],
    },
    block: {
      control: "select",
      options: ["none", 0, 4, 8, 12, 16, 24, 32, 40],
    },
    inline: {
      control: "select",
      options: [undefined, 0, 4, 8, 12, 16, 24, 32, 40],
    },
  },
};

export default meta;

export const Configurable = {
  args: {
    space: 24,
    block: "none",
  },
  render: (args) => (
    <Card shadow="xs" style={{ maxWidth: 560, padding: 0, overflow: "hidden" }}>
      <Inset space={24}>
        <Stack gap={16}>
          <Stack gap={8}>
            <Heading as="h2" size="md">Bleed</Heading>
            <Paragraph color="muted">
              Bleed lets selected content extend through surrounding inset spacing.
            </Paragraph>
          </Stack>
          <Bleed {...args}>
            <div style={{ minHeight: 120, background: "var(--semantic-color-surface-raised)" }} />
          </Bleed>
          <Paragraph>
            The visual band reaches the card edge while the text remains inset.
          </Paragraph>
        </Stack>
      </Inset>
    </Card>
  ),
};

export const MediaBleed = {
  name: "Media bleed",
  render: () => (
    <Card shadow="xs" style={{ maxWidth: 560, padding: 0, overflow: "hidden" }}>
      <Inset space={32}>
        <Stack gap={16}>
          <Heading as="h2" size="md">Card with edge-to-edge media</Heading>
          <Bleed space={32}>
            <div style={{ minHeight: 160, background: "var(--semantic-color-text-accent)" }} />
          </Bleed>
          <Paragraph color="muted">
            Pair Inset and Bleed when media should reach the container edge but copy should stay comfortably padded.
          </Paragraph>
        </Stack>
      </Inset>
    </Card>
  ),
};
