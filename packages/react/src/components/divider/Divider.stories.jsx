import { Divider } from "./Divider.jsx";
import { Card } from "../card/Card.jsx";
import { Grid } from "../grid/Grid.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

const meta = {
  title: "Components/Structure/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    variant: {
      control: "select",
      options: ["subtle", "strong", "accent", "dashed", "dotted"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    space: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg"],
    },
    decorative: { control: "boolean" },
  },
};

export default meta;

export const Configurable = {
  args: {
    orientation: "horizontal",
    variant: "subtle",
    size: "xs",
    space: "sm",
    decorative: true,
  },
  render: (args) => (
    <Card shadow="xs" style={{ maxWidth: 560 }}>
      <Heading as="h2" size="md">Divider</Heading>
      <Paragraph color="muted">
        Use dividers to separate related groups without creating another container.
      </Paragraph>
      <Divider {...args} />
      <Paragraph>
        Adjust orientation, visual weight, style, and spacing from the controls panel.
      </Paragraph>
    </Card>
  ),
};

export const HorizontalVariants = {
  name: "Horizontal variants",
  render: () => (
    <Card shadow="xs" style={{ maxWidth: 640 }}>
      {["subtle", "strong", "accent", "dashed", "dotted"].map((variant) => (
        <div key={variant}>
          <Paragraph size="sm" color="muted">{variant}</Paragraph>
          <Divider variant={variant} space="sm" />
        </div>
      ))}
    </Card>
  ),
};

export const SizeScale = {
  name: "Size scale",
  render: () => (
    <Card shadow="xs" style={{ maxWidth: 640 }}>
      {["xs", "sm", "md", "lg"].map((size) => (
        <div key={size}>
          <Paragraph size="sm" color="muted">{size}</Paragraph>
          <Divider size={size} variant={size === "xs" ? "subtle" : "strong"} space="sm" />
        </div>
      ))}
    </Card>
  ),
};

export const VerticalDividers = {
  name: "Vertical dividers",
  render: () => (
    <Grid columns={{ xs: 1, md: 3 }} gap="md" style={{ maxWidth: 760 }}>
      {["subtle", "strong", "accent"].map((variant) => (
        <Card
          key={variant}
          shadow="xs"
          style={{ display: "flex", alignItems: "stretch", minHeight: 160 }}
        >
          <div>
            <Heading as="h2" size="sm">{variant}</Heading>
            <Paragraph size="sm" color="muted">Left content</Paragraph>
          </div>
          <Divider orientation="vertical" variant={variant} size="sm" space="md" />
          <div>
            <Heading as="h3" size="sm">Detail</Heading>
            <Paragraph size="sm" color="muted">Right content</Paragraph>
          </div>
        </Card>
      ))}
    </Grid>
  ),
};
