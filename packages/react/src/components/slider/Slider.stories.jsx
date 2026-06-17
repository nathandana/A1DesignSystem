import { useState } from "react";
import { Slider } from "./Slider.jsx";

const SIZE_DETENTS = [
  { value: 0, label: "None" },
  { value: 1, label: "XS" },
  { value: 2, label: "SM" },
  { value: 3, label: "MD" },
  { value: 4, label: "LG" },
];

const meta = {
  title: "Components/Controls/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    label: { control: "text" },
    size: { control: "inline-radio", options: ["compact", "default", "comfortable"] },
    variant: { control: "inline-radio", options: ["default", "subtle"] },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    showValue: { control: "boolean" },
    valuePosition: { control: "inline-radio", options: ["above", "below"] },
    bubbleLabel: { control: false },
    disabled: { control: "boolean" },
  },
};

// Long, spoken-out names shown in the value bubble while the detent stays short.
const SIZE_LONG = ["None", "Extra small", "Small", "Medium", "Large"];

export default meta;

function Demo({ initial = 40, ...args }) {
  const [value, setValue] = useState(initial);
  return (
    <div style={{ maxWidth: 360, paddingBlock: 24 }}>
      <Slider {...args} value={value} onChange={setValue} />
    </div>
  );
}

export const Default = {
  name: "Slider",
  args: { label: "Opacity", min: 0, max: 100, step: 1, showValue: true, valuePosition: "above" },
  render: (args) => <Demo initial={40} {...args} />,
};

export const SubtleVariant = {
  name: "Subtle variant (neutral)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 360, paddingBlock: 24 }}>
      <Demo initial={2} variant="subtle" label="Padding" detents={SIZE_DETENTS} />
      <Demo initial={60} variant="subtle" label="Opacity" />
    </div>
  ),
};

export const Sizes = {
  name: "Sizes (match fields)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 360, paddingBlock: 24 }}>
      {["compact", "default", "comfortable"].map((size) => (
        <Demo key={size} initial={2} size={size} label={`Padding (${size})`} detents={SIZE_DETENTS} />
      ))}
    </div>
  ),
};

export const NumericDetents = {
  name: "Detents (no labels)",
  render: () => {
    const [value, setValue] = useState(50);
    return (
      <div style={{ maxWidth: 360, paddingBlock: 24 }}>
        <Slider
          label="Quality"
          detents={[0, 25, 50, 75, 100]}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const LabeledDetents = {
  name: "Detents with labels — size control",
  render: () => {
    const [value, setValue] = useState(2);
    return (
      <div style={{ maxWidth: 360, paddingBlock: 24 }}>
        <Slider
          label="Padding"
          detents={SIZE_DETENTS}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const IconDetents = {
  name: "Detents with icons",
  render: () => {
    const [value, setValue] = useState(2);
    return (
      <div style={{ maxWidth: 360, paddingBlock: 24 }}>
        <Slider
          label="Alignment"
          detents={[
            { value: 0, label: "None", icon: "block" },
            { value: 1, label: "Left", icon: "format_align_left" },
            { value: 2, label: "Center", icon: "format_align_center" },
            { value: 3, label: "Right", icon: "format_align_right" },
            { value: 4, label: "Justify", icon: "format_align_justify" },
          ]}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const ValueBelow = {
  name: "Value below",
  render: () => <Demo initial={65} label="Volume" valuePosition="below" />,
};

export const CustomFormat = {
  name: "Custom value format",
  render: () => {
    const [value, setValue] = useState(8);
    return (
      <div style={{ maxWidth: 360, paddingBlock: 24 }}>
        <Slider
          label="Gap"
          min={0}
          max={16}
          step={2}
          value={value}
          onChange={setValue}
          formatValue={(v) => `${v}px`}
        />
      </div>
    );
  },
};

export const BubbleLabel = {
  name: "Bubble label (long size names)",
  render: () => {
    const [value, setValue] = useState(2);
    return (
      <div style={{ maxWidth: 360, paddingBlock: 24 }}>
        <Slider
          label="Padding"
          variant="subtle"
          detents={SIZE_DETENTS}
          value={value}
          onChange={setValue}
          // The detents read "None / XS / SM / MD / LG"; the bubble spells them out.
          bubbleLabel={(v) => SIZE_LONG[v]}
        />
      </div>
    );
  },
};

export const ClampedBubble = {
  name: "Bubble stays within the track at the ends",
  render: () => {
    const [value, setValue] = useState(0);
    return (
      <div style={{ maxWidth: 320, paddingBlock: 24 }}>
        <Slider
          label="Drag to either end — the bubble never spills past the edge"
          detents={SIZE_DETENTS}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const Disabled = {
  name: "Disabled",
  render: () => (
    <div style={{ maxWidth: 360, paddingBlock: 24 }}>
      <Slider label="Disabled" detents={SIZE_DETENTS} defaultValue={2} disabled />
    </div>
  ),
};
