import { useState } from "react";
import { SegmentedControl } from "./SegmentedControl.jsx";

const meta = {
  title: "Components/Controls/Segmented Control",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    fullWidth: {
      control: "boolean",
    },
  },
};

export default meta;

/* ── Text options ─────────────────────────────────────────────────────────── */

export const Default = {
  render: (args) => {
    const [value, setValue] = useState("week");
    return (
      <SegmentedControl
        {...args}
        value={value}
        onChange={setValue}
        options={["Day", "Week", "Month", "Year"].map(s => ({
          value: s.toLowerCase(),
          label: s,
        }))}
      />
    );
  },
};

/* ── Icon + label ─────────────────────────────────────────────────────────── */

export const WithIcons = {
  name: "With icons",
  render: (args) => {
    const [value, setValue] = useState("list");
    return (
      <SegmentedControl
        {...args}
        value={value}
        onChange={setValue}
        options={[
          { value: "list",      label: "List",      icon: "view_list" },
          { value: "grid",      label: "Grid",      icon: "grid_view" },
          { value: "dashboard", label: "Dashboard", icon: "dashboard" },
        ]}
      />
    );
  },
};

/* ── Icon only ────────────────────────────────────────────────────────────── */

export const IconOnly = {
  name: "Icon only",
  render: (args) => {
    const [value, setValue] = useState("left");
    return (
      <SegmentedControl
        {...args}
        value={value}
        onChange={setValue}
        options={[
          { value: "left",    icon: "format_align_left",    ariaLabel: "Align left" },
          { value: "center",  icon: "format_align_center",  ariaLabel: "Align center" },
          { value: "right",   icon: "format_align_right",   ariaLabel: "Align right" },
          { value: "justify", icon: "format_align_justify", ariaLabel: "Justify" },
        ]}
      />
    );
  },
};

/* ── Full width ───────────────────────────────────────────────────────────── */

export const FullWidth = {
  name: "Full width",
  parameters: { layout: "padded" },
  render: (args) => {
    const [value, setValue] = useState("personal");
    return (
      <div style={{ width: "400px" }}>
        <SegmentedControl
          {...args}
          fullWidth
          value={value}
          onChange={setValue}
          options={[
            { value: "personal", label: "Personal" },
            { value: "team",     label: "Team" },
            { value: "org",      label: "Organization" },
          ]}
        />
      </div>
    );
  },
};
