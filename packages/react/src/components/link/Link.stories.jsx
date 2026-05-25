import { Link } from "./Link.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

const meta = {
  title: "Components/Controls/Link",
  component: Link,
  tags: ["autodocs"],
  args: {
    children: "Link text",
    href: "#",
    size: undefined,
    weight: undefined,
    icon: undefined,
    iconPosition: "start"
  },
  argTypes: {
    size: {
      control: "select",
      options: [undefined, "xs", "sm", "md", "lg", "xl"],
      description: "Font size — omit to inherit from parent"
    },
    weight: {
      control: "select",
      options: [undefined, "normal", "medium", "semibold", "bold"],
      description: "Font weight — omit to inherit from parent"
    },
    icon: {
      control: "text",
      description: "Material Symbols icon name (e.g. \"open_in_new\", \"arrow_forward\")"
    },
    iconPosition: {
      control: "inline-radio",
      options: ["start", "end"]
    }
  }
};

export default meta;

export const Configurable = {};

export const Sizes = {
  parameters: { controls: { include: ["weight", "icon", "iconPosition"] } },
  render: args => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
      {["xs", "sm", "md", "lg", "xl"].map(size => (
        <Link key={size} {...args} size={size} href="#">
          {size} — Link text
        </Link>
      ))}
    </div>
  )
};

export const Weights = {
  parameters: { controls: { include: ["size", "icon", "iconPosition"] } },
  render: args => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)", fontSize: "var(--semantic-font-size-body-md)" }}>
      <Link {...args} href="#">Inherited weight (default)</Link>
      {["normal", "medium", "semibold", "bold"].map(weight => (
        <Link key={weight} {...args} weight={weight} href="#">
          {weight.charAt(0).toUpperCase() + weight.slice(1)} weight
        </Link>
      ))}
    </div>
  )
};

export const WithIcons = {
  args: {
    size: "xl",
    weight: "bold"
  },
  name:"With icons",
  parameters: { controls: { include: ["size", "weight"] } },
  render:args => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
      <Link {...args} icon="arrow_forward" iconPosition="end" href="#">Continue reading</Link>
      <Link {...args} icon="open_in_new" iconPosition="end" href="#">Open in new tab</Link>
      <Link {...args} icon="download" iconPosition="start" href="#">Download file</Link>
      <Link {...args} icon="arrow_back" iconPosition="start" href="#">Go back</Link>
    </div>
  )
};

export const InlineText = {
  name: "Inline in text",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
      <Paragraph>
        You can read more about this in our <Link href="#">documentation</Link>, or{" "}
        <Link href="#">contact support</Link> if you need help.
      </Paragraph>
      <Paragraph size="sm">
        By continuing you agree to our{" "}
        <Link href="#" weight="medium">Terms of Service</Link> and{" "}
        <Link href="#" weight="medium">Privacy Policy</Link>.
      </Paragraph>
      <Paragraph size="lg">
        <Link href="#" icon="open_in_new" iconPosition="end">View the full changelog</Link>
      </Paragraph>
    </div>
  )
};
