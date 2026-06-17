import { SplitButton } from "./SplitButton.jsx";

const SAMPLE_ACTIONS = [
  { id: "draft", label: "Save as draft", icon: "draft" },
  { id: "template", label: "Save as template", icon: "bookmark" },
  { id: "copy", label: "Duplicate", icon: "content_copy" },
];

const meta = {
  title: "Components/Actions/Split Button",
  component: SplitButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "tertiary", "destructive", "success"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    icon: { control: "text" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;

export const Default = {
  name: "Split Button",
  args: {
    children: "Save changes",
    variant: "primary",
    size: "md",
    actions: SAMPLE_ACTIONS,
  },
  render: (args) => <SplitButton {...args} />,
};

export const Variants = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {["primary", "secondary", "tertiary", "destructive", "success"].map((variant) => (
        <SplitButton key={variant} variant={variant} actions={SAMPLE_ACTIONS}>
          Save changes
        </SplitButton>
      ))}
    </div>
  ),
};

export const Sizes = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {["sm", "md", "lg"].map((size) => (
        <SplitButton key={size} size={size} actions={SAMPLE_ACTIONS}>
          Save
        </SplitButton>
      ))}
    </div>
  ),
};

export const WithIcon = {
  render: () => (
    <SplitButton icon="save" variant="secondary" actions={SAMPLE_ACTIONS}>
      Save changes
    </SplitButton>
  ),
};

export const Disabled = {
  render: () => (
    <SplitButton disabled actions={SAMPLE_ACTIONS}>
      Save changes
    </SplitButton>
  ),
};
