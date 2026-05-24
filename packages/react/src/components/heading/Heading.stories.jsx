import { Heading } from "./Heading.jsx";
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
      options: ["xl", "lg", "md", "sm", "xs", "xxl", "jumbo", "xJumbo"]
    },
    color: {
      control: "inline-radio",
      options: ["default", "muted", "accent"]
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
