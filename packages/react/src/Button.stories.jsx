import { Button } from "./Button.jsx";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    as: "button",
    children: "Button",
    disabled: false,
    href: "#",
    icon: undefined,
    iconPosition: "start",
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
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "tertiary"]
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
    </div>
  )
};

export const WithIconStart = {
  name: "Icon — Start",
  render: args => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button {...args} variant="primary" icon="add">Add item</Button>
      <Button {...args} variant="secondary" icon="download">Download</Button>
      <Button {...args} variant="tertiary" icon="settings">Settings</Button>
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
    </div>
  )
};

