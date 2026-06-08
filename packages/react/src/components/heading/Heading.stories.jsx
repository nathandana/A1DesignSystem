import { Heading, HeadingMark } from "./Heading.jsx";
import { Inverse } from "../inverse/Inverse.jsx";

const meta = {
  title: "Components/Typography/Heading",
  component: Heading,
  tags: ["autodocs"],
  args: {
    children: "The quick brown fox",
    type: "heading",
    color: "default"
  },
  argTypes: {
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"]
    },
    type: {
      control: "inline-radio",
      options: ["heading", "display"]
    },
    size: {
      control: "select",
      options: ["xxl", "xl", "lg", "md", "sm", "xs", "jumbo", "xJumbo"]
    },
    color: {
      control: "inline-radio",
      options: ["default", "muted", "accent"]
    },
    margin: {
      control: "inline-radio",
      options: ["sm", "md", "lg"]
    },
    textWrap: {
      control: "inline-radio",
      options: ["balance", undefined]
    },
    align: {
      control: "inline-radio",
      options: ["left", "center", "right", "start", "end", undefined]
    }
  }
};

export default meta;

export const Configurable = {};

export const HeadingScale = {
  name: "Heading Scale",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {[
        { as: "h1", size: "xxl" },
        { as: "h1", size: "xl" },
        { as: "h2", size: "lg" },
        { as: "h3", size: "md" },
        { as: "h4", size: "sm" },
        { as: "h5", size: "xs" },
        { as: "h6", size: "xs" }
      ].map(({ as, size }) => (
        <div key={as} style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
          <span
            style={{
              width: "28px",
              fontSize: "0.75rem",
              color: "var(--semantic-color-text-muted)",
              flexShrink: 0
            }}
          >
            {as}
          </span>
          <Heading as={as} size={size}>
            The quick brown fox
          </Heading>
        </div>
      ))}
    </div>
  )
};

export const DecoupledSize = {
  name: "Decoupled Semantic vs Visual Size",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Heading as="h1" size="xs">h1 rendered at xs size</Heading>
      <Heading as="h6" size="xl">h6 rendered at xl size</Heading>
      <Heading as="h3" size="lg">h3 rendered at lg size</Heading>
    </div>
  )
};

export const DisplayScale = {
  name: "Display Scale",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {["sm", "md", "lg", "xl", "xxl", "jumbo", "xJumbo"].map(size => (
        <div key={size} style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
          <span
            style={{
              width: "52px",
              fontSize: "0.75rem",
              color: "var(--semantic-color-text-muted)",
              flexShrink: 0
            }}
          >
            {size}
          </span>
          <Heading as="h2" type="display" size={size}>
            Display
          </Heading>
        </div>
      ))}
    </div>
  )
};

export const ResponsiveSize = {
  name: "Responsive Size",
  render: () => (
    <div style={{ maxWidth: "760px" }}>
      <Heading as="h1" type="display" size={{ xs: "lg", md: "jumbo", lg: "xJumbo" }}>
        Resize the preview
      </Heading>
    </div>
  )
};

export const Colors = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Heading as="h2" color="default">Default heading color</Heading>
      <Heading as="h2" color="muted">Muted heading color</Heading>
      <Heading as="h2" color="accent">Accent heading color</Heading>
      <Inverse style={{ padding: "16px", borderRadius: "6px" }}>
        <Heading as="h2">Inverse surface heading</Heading>
      </Inverse>
    </div>
  )
};

export const TextWrap = {
  name: "Text wrap — balance",
  render: () => (
    <div style={{ display: "grid", gap: "32px", maxWidth: "540px" }}>
      <div>
        <p style={{ fontSize: "0.75rem", color: "var(--semantic-color-text-muted)", marginBottom: "8px" }}>Without textWrap</p>
        <Heading as="h2" type="display" size="lg">
          The design system built for the AI era
        </Heading>
      </div>
      <div>
        <p style={{ fontSize: "0.75rem", color: "var(--semantic-color-text-muted)", marginBottom: "8px" }}>textWrap="balance"</p>
        <Heading as="h2" type="display" size="lg" textWrap="balance">
          The design system built for the AI era
        </Heading>
      </div>
    </div>
  )
};

export const Alignment = {
  name: "Alignment",
  render: () => (
    <div style={{ display: "grid", gap: "24px" }}>
      {["left", "center", "right"].map(align => (
        <div key={align}>
          <p style={{ fontSize: "0.75rem", color: "var(--semantic-color-text-muted)", marginBottom: "8px" }}>
            align="{align}"
          </p>
          <Heading as="h2" size="lg" align={align}>
            The quick brown fox jumps over the lazy dog
          </Heading>
        </div>
      ))}
    </div>
  )
};

export const ExpressiveMarks = {
  name: "Expressive Marks",
  render: () => (
    <div style={{ display: "grid", gap: "32px", maxWidth: "980px" }}>
      <Heading as="h1" type="display" size={{ xs: "lg", md: "xxl" }}>
        Build <HeadingMark>alignment</HeadingMark> before the interface.
      </Heading>

      <Heading as="h2" type="display" size="xl">
        Make the moment <HeadingMark variant="underline">impossible to miss</HeadingMark>.
      </Heading>

      <div style={{ display: "grid", gap: "18px" }}>
        <Heading as="h3" size="lg">
          Swoop underline for <HeadingMark variant="underline" underlineStyle="swoop">editorial emphasis</HeadingMark>
        </Heading>
        <Heading as="h3" size="lg">
          Wave underline for <HeadingMark variant="underline" underlineStyle="wave">energetic emphasis</HeadingMark>
        </Heading>
        <Heading as="h3" size="lg">
          Sketch underline for <HeadingMark variant="underline" underlineStyle="sketch">rough-draft emphasis</HeadingMark>
        </Heading>
      </div>
    </div>
  )
};
