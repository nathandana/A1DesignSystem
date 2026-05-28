import { Blockquote } from "./Blockquote.jsx";

const QUOTE_SHORT = "Design is not just what it looks like and feels like. Design is how it works.";
const QUOTE_LONG  = "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.";

const meta = {
  title: "Components/Messaging/Blockquote",
  component: Blockquote,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    variant: "border",
    cite: "Steve Jobs",
    children: QUOTE_SHORT,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["border", "filled", "feature", "minimal"],
      description: "Visual style of the blockquote",
    },
    cite: { control: "text", description: "Attribution name or source" },
    citeUrl: { control: "text", description: "Optional URL — wraps cite in a link" },
    children: { control: "text", name: "quote" },
  },
};

export default meta;

export const Configurable = {};

export const AllVariants = {
  name: "All variants",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-48, 3rem)", maxWidth: 640 }}>
      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--semantic-color-text-muted)", marginBottom: "var(--base-spacing-16)" }}>border (default)</p>
        <Blockquote variant="border" cite="Steve Jobs">
          {QUOTE_SHORT}
        </Blockquote>
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--semantic-color-text-muted)", marginBottom: "var(--base-spacing-16)" }}>filled</p>
        <Blockquote variant="filled" cite="Maya Angelou">
          {QUOTE_LONG}
        </Blockquote>
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--semantic-color-text-muted)", marginBottom: "var(--base-spacing-16)" }}>feature</p>
        <Blockquote variant="feature" cite="Dieter Rams">
          Good design is as little design as possible.
        </Blockquote>
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--semantic-color-text-muted)", marginBottom: "var(--base-spacing-16)" }}>minimal</p>
        <Blockquote variant="minimal" cite="Charles Eames">
          The details are not the details. They make the design.
        </Blockquote>
      </div>
    </div>
  ),
};

export const WithoutCite = {
  name: "Without citation",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-40)", maxWidth: 560 }}>
      <Blockquote variant="border">{QUOTE_SHORT}</Blockquote>
      <Blockquote variant="filled">{QUOTE_SHORT}</Blockquote>
      <Blockquote variant="feature">{QUOTE_SHORT}</Blockquote>
      <Blockquote variant="minimal">{QUOTE_SHORT}</Blockquote>
    </div>
  ),
};

export const WithCiteLink = {
  name: "With linked citation",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Blockquote
        variant="border"
        cite="A1 Design System docs"
        citeUrl="#"
      >
        Consistent, accessible components let teams ship better products faster.
      </Blockquote>
    </div>
  ),
};
