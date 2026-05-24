import { Button } from "./Button.jsx";

const meta = {
  title: "Components/Controls/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    as: "button",
    children: "Button",
    disabled: false,
    href: "#",
    icon: undefined,
    iconPosition: "start",
    size: "md",
    variant: "primary"
  },
  argTypes: {
    as: {
      control: "select",
      options: ["button", "a"]
    },
    children: {
      control: "text",
      name: "label"
    },
    disabled: {
      control: "boolean"
    },
    href: {
      control: "text",
      if: { arg: "as", eq: "a" }
    },
    icon: {
      control: "text",
      description: "Material Symbols icon name (e.g. \"add\", \"arrow_forward\")"
    },
    iconPosition: {
      control: "inline-radio",
      options: ["start", "end"]
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"]
    },
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "tertiary", "destructive", "success"]
    }
  },
  render: ({ as, disabled, href, ...args }) => (
    <Button
      {...args}
      aria-disabled={as === "a" && disabled ? "true" : undefined}
      as={as}
      disabled={as === "button" ? disabled : undefined}
      href={as === "a" ? href : undefined}
    />
  )
};

export default meta;

export const Configurable = {};

export const Variants = {
  render: args => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="tertiary">Tertiary</Button>
      <Button {...args} variant="destructive">Destructive</Button>
      <Button {...args} variant="success">Success</Button>
    </div>
  )
};

const labelStyle = {
  fontFamily: "var(--component-paragraph-font-family)",
  fontSize: "var(--semantic-font-size-body-xs)",
  color: "var(--semantic-color-text-muted)",
  width: "80px",
};

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => {
    const variants = ["primary", "secondary", "tertiary", "destructive", "success"];
    const sizes = ["sm", "md", "lg"];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {sizes.map(size => (
          <div key={size} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={labelStyle}>{size}</span>
            {variants.map(variant => (
              <Button key={variant} size={size} variant={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  }
};

export const WithIconStart = {
  name: "Icon — Start",
  render: args => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button {...args} variant="primary" icon="add">Add item</Button>
      <Button {...args} variant="secondary" icon="download">Download</Button>
      <Button {...args} variant="tertiary" icon="settings">Settings</Button>
      <Button {...args} variant="destructive" icon="delete">Delete</Button>
      <Button {...args} variant="success" icon="check">Approve</Button>
    </div>
  )
};

export const WithIconEnd = {
  name: "Icon — End",
  render: args => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button {...args} variant="primary" icon="arrow_forward" iconPosition="end">Continue</Button>
      <Button {...args} variant="secondary" icon="open_in_new" iconPosition="end">Open link</Button>
      <Button {...args} variant="tertiary" icon="chevron_right" iconPosition="end">See more</Button>
      <Button {...args} variant="destructive" icon="delete" iconPosition="end">Delete</Button>
      <Button {...args} variant="success" icon="check" iconPosition="end">Approve</Button>
    </div>
  )
};
