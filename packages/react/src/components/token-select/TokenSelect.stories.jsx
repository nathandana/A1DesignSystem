import { useState } from "react";
import { TokenSelect } from "./TokenSelect.jsx";
import { Card } from "../card/Card.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Stack } from "../stack/Stack.jsx";

const RAMP_COLORS = {
  accent: {
    100: "#EDE9FE",
    300: "#C4B5FD",
    500: "#7C3AED",
    700: "#5B21B6",
    900: "#2E1065",
  },
  neutral: {
    100: "#F1F5F9",
    300: "#CBD5E1",
    500: "#64748B",
    700: "#334155",
    900: "#060B14",
  },
};

const RAMP_LABELS = {
  accent: "Accent",
  neutral: "Neutral",
};

const meta = {
  title: "Components/Inputs/TokenSelect",
  component: TokenSelect,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["comfortable", "default", "compact"],
    },
    disabled: { control: "boolean" },
    suggestedRamp: {
      control: "inline-radio",
      options: ["accent", "neutral"],
    },
  },
};

export default meta;

function ConfigurableTokenSelect(args) {
  const [value, setValue] = useState("var(--base-color-accent-500)");

  return (
    <Card shadow="xs" style={{ maxWidth: 360 }}>
      <Stack gap="sm">
        <TokenSelect
          {...args}
          value={value}
          onChange={setValue}
          rampColors={RAMP_COLORS}
          rampLabels={RAMP_LABELS}
        />
        <Paragraph size="sm" color="muted">{value}</Paragraph>
      </Stack>
    </Card>
  );
}

function RawHexIdentifiedTokenSelect() {
  const [value, setValue] = useState("#64748B");

  return (
    <Card shadow="xs" style={{ maxWidth: 360 }}>
      <Stack gap="sm">
        <TokenSelect
          label="Neutral token"
          value={value}
          onChange={setValue}
          rampColors={RAMP_COLORS}
          rampLabels={RAMP_LABELS}
          suggestedRamp="neutral"
          size="default"
        />
        <Paragraph size="sm" color="muted">{value}</Paragraph>
      </Stack>
    </Card>
  );
}

export const Configurable = {
  args: {
    label: "Accent token",
    size: "compact",
    suggestedRamp: "accent",
    disabled: false,
  },
  render: (args) => <ConfigurableTokenSelect {...args} />,
};

export const RawHexIdentified = {
  name: "Raw hex identified",
  render: () => <RawHexIdentifiedTokenSelect />,
};

export const Disabled = {
  render: () => (
    <Card shadow="xs" style={{ maxWidth: 360 }}>
      <Stack gap="sm">
        <Heading as="h2" size="sm">Disabled selector</Heading>
        <TokenSelect
          label="Accent token"
          value="var(--base-color-accent-500)"
          rampColors={RAMP_COLORS}
          rampLabels={RAMP_LABELS}
          suggestedRamp="accent"
          disabled
        />
      </Stack>
    </Card>
  ),
};
