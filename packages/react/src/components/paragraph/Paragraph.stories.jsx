import { Paragraph } from "./Paragraph.jsx";
import { Inverse } from "../inverse/Inverse.jsx";

const meta = {
  title: "Components/Typography/Paragraph",
  component: Paragraph,
  tags: ["autodocs"],
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    size: "md",
    color: "default"
  },
  argTypes: {
    as: {
      control: "select",
      options: ["p", "span", "div", "li"]
    },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg", "xl"]
    },
    color: {
      control: "inline-radio",
      options: ["default", "muted", "inverse"]
    }
  }
};

export default meta;

export const Configurable = {};

export const SizeScale = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {["xs", "sm", "md", "lg", "xl"].map(size => (
        <div key={size} style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
          <span
            style={{
              width: "28px",
              fontSize: "0.75rem",
              color: "var(--semantic-color-text-muted)",
              flexShrink: 0
            }}
          >
            {size}
          </span>
          <Paragraph size={size}>
            The quick brown fox jumps over the lazy dog.
          </Paragraph>
        </div>
      ))}
    </div>
  )
};

export const Colors = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Paragraph color="default">Default — primary text color for body copy.</Paragraph>
      <Paragraph color="muted">Muted — secondary text for captions and supporting copy.</Paragraph>
      <Inverse style={{ padding: "12px", borderRadius: "6px" }}>
        <Paragraph>Inverse surface — text color adapts automatically.</Paragraph>
      </Inverse>
    </div>
  )
};
