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
      options: ["subtle", "strong", "accent"],
    },
    lineStyle: {
      control: "select",
      options: ["solid", "dashed", "dotted"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    space: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl", "xxl"],
    },
    decorative: { control: "boolean" },
  },
};

export default meta;

export const Configurable = {
  args: {
    orientation: "horizontal",
    variant: "subtle",
    lineStyle: "solid",
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
        Adjust orientation, tone, line style, thickness, and spacing from the controls panel.
      </Paragraph>
    </Card>
  ),
};

export const HorizontalVariants = {
  name: "Horizontal variants",
  render: () => (
    <Card shadow="xs" style={{ maxWidth: 640 }}>
      {["subtle", "strong", "accent"].map((variant) => (
        <div key={variant}>
          <Paragraph size="sm" color="muted">{variant}</Paragraph>
          <Divider variant={variant} space="sm" />
        </div>
      ))}
    </Card>
  ),
};

export const LineStyleCombinations = {
  name: "Line style combinations",
  render: () => (
    <Card shadow="xs" style={{ maxWidth: 640 }}>
      {[
        { variant: "subtle", lineStyle: "dotted" },
        { variant: "strong", lineStyle: "dashed" },
        { variant: "accent", lineStyle: "dashed" },
        { variant: "accent", lineStyle: "dotted" },
      ].map(({ variant, lineStyle }) => (
        <div key={`${variant}-${lineStyle}`}>
          <Paragraph size="sm" color="muted">{variant} + {lineStyle}</Paragraph>
          <Divider variant={variant} lineStyle={lineStyle} size="sm" space="sm" />
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

export const ResponsiveOrientation = {
  name: "Responsive orientation",
  render: () => (
    <Card
      shadow="xs"
      style={{ display: "flex", alignItems: "stretch", maxWidth: 640 }}
    >
      <div style={{ flex: 1 }}>
        <Heading as="h2" size="sm">Left</Heading>
        <Paragraph size="sm" color="muted">Horizontal on mobile, vertical on wider screens.</Paragraph>
      </div>
      <Divider
        orientation={{ xs: "horizontal", sm: "vertical" }}
        variant="subtle"
        lineStyle="dashed"
        size="sm"
        space="md"
      />
      <div style={{ flex: 1 }}>
        <Heading as="h3" size="sm">Right</Heading>
        <Paragraph size="sm" color="muted">Resize the window to see it switch.</Paragraph>
      </div>
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
