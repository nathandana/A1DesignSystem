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
    state: undefined,
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
    state: {
      control: "inline-radio",
      options: [undefined, "default", "hover", "active"]
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
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="tertiary">
        Tertiary
      </Button>
    </div>
  )
};

export const PrimaryStates = {
  render: args => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button {...args} state="default" variant="primary">
        Default
      </Button>
      <Button {...args} state="hover" variant="primary">
        Hover
      </Button>
      <Button {...args} state="active" variant="primary">
        Active
      </Button>
    </div>
  )
};

export const SecondaryStates = {
  render: args => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button {...args} state="default" variant="secondary">
        Default
      </Button>
      <Button {...args} state="hover" variant="secondary">
        Hover
      </Button>
      <Button {...args} state="active" variant="secondary">
        Active
      </Button>
    </div>
  )
};

export const TertiaryStates = {
  render: args => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button {...args} state="default" variant="tertiary">
        Default
      </Button>
      <Button {...args} state="hover" variant="tertiary">
        Hover
      </Button>
      <Button {...args} state="active" variant="tertiary">
        Active
      </Button>
    </div>
  )
};
