import { SectionSeparator } from "./SectionSeparator.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Section } from "../section/Section.jsx";
import { Stack } from "../stack/Stack.jsx";

const meta = {
  title: "Components/Structure/Section Separator",
  component: SectionSeparator,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    topSurface: {
      control: "select",
      options: ["page", "panel", "raised"],
    },
    bottomSurface: {
      control: "select",
      options: ["page", "panel", "raised"],
    },
    topInverse: { control: "boolean" },
    bottomInverse: { control: "boolean" },
    shape: {
      control: "select",
      options: ["wave", "swell", "curve", "slope", "peak", "valley", "ribbon"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    border: { control: "boolean" },
    borderSize: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    borderVariant: {
      control: "select",
      options: ["subtle", "strong", "accent"],
    },
    decorative: { control: "boolean" },
  },
};

export default meta;

export const Configurable = {
  args: {
    topSurface: "panel",
    bottomSurface: "raised",
    topInverse: false,
    bottomInverse: false,
    shape: "wave",
    size: "md",
    border: true,
    borderSize: "sm",
    borderVariant: "accent",
    decorative: true,
  },
  render: (args) => (
    <>
      <Section padding="lg" surface={args.topSurface} inverse={args.topInverse} align="center" gap="sm">
        <Heading as="h2" size="xl">Top section</Heading>
        <Paragraph color="muted">The separator bridges this surface into the next one.</Paragraph>
      </Section>
      <SectionSeparator {...args} />
      <Section padding="lg" surface={args.bottomSurface} inverse={args.bottomInverse} align="center" gap="sm">
        <Heading as="h2" size="xl">Bottom section</Heading>
        <Paragraph color="muted">Use the controls to test surfaces, inverse scopes, shapes, and the border highlight.</Paragraph>
      </Section>
    </>
  ),
};

export const ShapeRange = {
  name: "Shape range",
  render: () => (
    <Stack gap="none">
      {["wave", "swell", "curve", "slope", "peak", "valley", "ribbon"].map((shape, index) => (
        <SectionSeparator
          key={shape}
          topSurface={index % 2 === 0 ? "page" : "panel"}
          bottomSurface={index % 2 === 0 ? "panel" : "page"}
          shape={shape}
          size="sm"
          border
          borderVariant={index % 3 === 0 ? "accent" : "subtle"}
        />
      ))}
    </Stack>
  ),
};

export const InverseSurfaces = {
  name: "Inverse surfaces",
  render: () => (
    <>
      <Section padding="lg" surface="page" align="center">
        <Heading as="h2" size="lg">Page to inverse panel</Heading>
      </Section>
      <SectionSeparator
        topSurface="page"
        bottomSurface="panel"
        bottomInverse
        shape="swell"
        size="lg"
        border
        borderVariant="strong"
      />
      <Section padding="lg" surface="panel" inverse align="center">
        <Heading as="h2" size="lg">Inverse panel</Heading>
      </Section>
    </>
  ),
};
