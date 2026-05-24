import { Inset } from "./Inset.jsx";
import { Card } from "../card/Card.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Stack } from "../stack/Stack.jsx";

const meta = {
  title: "Components/Structure/Inset",
  component: Inset,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    space: {
      control: "select",
      options: [0, 4, 8, 12, 16, 24, 32, 40],
    },
    block: {
      control: "select",
      options: [undefined, 0, 4, 8, 12, 16, 24, 32, 40],
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
  },
  render: (args) => (
    <Card shadow="xs" style={{ maxWidth: 560, padding: 0 }}>
      <Inset {...args}>
        <Stack gap={12}>
          <Heading as="h2" size="md">Inset</Heading>
          <Paragraph color="muted">
            Inset applies consistent internal padding to a region.
          </Paragraph>
        </Stack>
      </Inset>
    </Card>
  ),
};

export const AsymmetricInset = {
  name: "Asymmetric inset",
  render: () => (
    <Card shadow="xs" style={{ maxWidth: 560, padding: 0 }}>
      <Inset block={16} inline={32}>
        <Stack gap={8}>
          <Heading as="h2" size="md">Compact block, roomy inline</Heading>
          <Paragraph color="muted">
            Use separate block and inline values when the content needs different breathing room by axis.
          </Paragraph>
        </Stack>
      </Inset>
    </Card>
  ),
};
