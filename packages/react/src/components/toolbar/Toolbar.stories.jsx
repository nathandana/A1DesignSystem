import { useState } from "react";
import {
  Toolbar,
  ToolbarToggle,
  ToolbarButton,
  ToolbarGroup,
  ToolbarMenu,
  ToolbarDivider,
} from "./Toolbar.jsx";

const meta = {
  title: "Components/Controls/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;

const ALIGN_OPTIONS = [
  { value: "none", label: "None" },
  { value: "left", label: "Left", icon: "format_align_left" },
  { value: "center", label: "Center", icon: "format_align_center" },
  { value: "right", label: "Right", icon: "format_align_right" },
  { value: "justify", label: "Justify", icon: "format_align_justify" },
];

const CROP_OPTIONS = [
  { value: "top-left", label: "Top left", icon: "north_west" },
  { value: "top", label: "Top", icon: "north" },
  { value: "top-right", label: "Top right", icon: "north_east" },
  { value: "left", label: "Left", icon: "west" },
  { value: "center", label: "Center", icon: "center_focus_strong" },
  { value: "right", label: "Right", icon: "east" },
  { value: "bottom-left", label: "Bottom left", icon: "south_west" },
  { value: "bottom", label: "Bottom", icon: "south" },
  { value: "bottom-right", label: "Bottom right", icon: "south_east" },
];

const SIZE_OPTIONS = [
  { value: "xs", label: "XS" },
  { value: "sm", label: "SM" },
  { value: "md", label: "MD" },
  { value: "lg", label: "LG" },
  { value: "xl", label: "XL" },
];

const SPACING_OPTIONS = [
  { value: "", label: "None" },
  { value: "4", label: "4" },
  { value: "8", label: "8" },
  { value: "12", label: "12" },
  { value: "16", label: "16" },
  { value: "20", label: "20" },
  { value: "24", label: "24" },
  { value: "32", label: "32" },
  { value: "40", label: "40" },
  { value: "64", label: "64" },
];

const LIST_OPTIONS = [
  { value: "none", label: "None", icon: "format_clear" },
  { value: "bulleted", label: "Bulleted list", icon: "format_list_bulleted" },
  { value: "numbered", label: "Numbered list", icon: "format_list_numbered" },
  { value: "checklist", label: "Checklist", icon: "checklist" },
];

function TextEditorBar(props) {
  const [marks, setMarks] = useState({ bold: true, italic: false, underline: false });
  const [size, setSize] = useState("md");
  const [align, setAlign] = useState("left");
  const [list, setList] = useState("bulleted");
  const set = (k) => (v) => setMarks((m) => ({ ...m, [k]: v }));
  return (
    <Toolbar aria-label="Text formatting" {...props}>
      <ToolbarToggle icon="format_bold" label="Bold" pressed={marks.bold} onChange={set("bold")} />
      <ToolbarToggle icon="format_italic" label="Italic" pressed={marks.italic} onChange={set("italic")} />
      <ToolbarToggle icon="format_underlined" label="Underline" pressed={marks.underline} onChange={set("underline")} />
      <ToolbarDivider />
      <ToolbarMenu icon="format_size" aria-label="Text size" label="Size" value={size} onChange={setSize} items={SIZE_OPTIONS} />
      <ToolbarDivider />
      <ToolbarGroup aria-label="Alignment" value={align} onChange={setAlign} options={ALIGN_OPTIONS} />
      <ToolbarDivider />
      <ToolbarMenu aria-label="List type" label="List" value={list} onChange={setList} items={LIST_OPTIONS} />
      <ToolbarButton icon="link" label="Insert link" />
    </Toolbar>
  );
}

export const TextEditor = {
  name: "Text editor toolbar",
  render: () => <TextEditorBar />,
};

export const WithMenu = {
  name: "Item with a menu — list type",
  render: () => {
    const [list, setList] = useState("bulleted");
    return (
      <Toolbar aria-label="List">
        <ToolbarMenu aria-label="List type" label="List" value={list} onChange={setList} items={LIST_OPTIONS} showLabel />
      </Toolbar>
    );
  },
};

export const Alignment = {
  name: "Single tool — alignment (icon only)",
  render: () => {
    const [align, setAlign] = useState("none");
    return (
      <Toolbar aria-label="Alignment">
        <ToolbarGroup aria-label="Alignment" value={align} onChange={setAlign} options={ALIGN_OPTIONS} />
      </Toolbar>
    );
  },
};

export const LabeledGroup = {
  name: "Group with labels",
  render: () => {
    const [size, setSize] = useState("md");
    return (
      <Toolbar aria-label="Spacing">
        <ToolbarGroup
          aria-label="Padding"
          value={size}
          onChange={setSize}
          showLabels
          options={[
            { value: "none", label: "None" },
            { value: "xs", label: "XS" },
            { value: "sm", label: "SM" },
            { value: "md", label: "MD" },
            { value: "lg", label: "LG" },
          ]}
        />
      </Toolbar>
    );
  },
};

export const LabelOnSelected = {
  name: "Label on selected only (swatch picker)",
  render: () => {
    const [surface, setSurface] = useState("panel");
    return (
      <Toolbar label="Surface">
        <ToolbarGroup
          aria-label="Surface"
          value={surface}
          onChange={setSurface}
          labelMode="selected"
          options={[
            { value: "", label: "None" },
            { value: "page", label: "Page", swatch: "var(--semantic-color-surface-page)" },
            { value: "panel", label: "Panel", swatch: "var(--semantic-color-surface-panel)" },
            { value: "raised", label: "Raised", swatch: "var(--semantic-color-surface-raised)" },
          ]}
        />
      </Toolbar>
    );
  },
};

export const CropGrid = {
  name: "9-item grid — crop direction",
  render: () => {
    const [crop, setCrop] = useState("center");
    return (
      <Toolbar aria-label="Crop">
        <ToolbarGroup aria-label="Crop focal point" value={crop} onChange={setCrop} columns={3} options={CROP_OPTIONS} />
      </Toolbar>
    );
  },
};

export const Toggles = {
  name: "Toggles + actions",
  render: () => {
    const [wrap, setWrap] = useState(false);
    const [grid, setGrid] = useState(true);
    return (
      <Toolbar aria-label="View">
        <ToolbarToggle icon="wrap_text" label="Wrap" pressed={wrap} onChange={setWrap} />
        <ToolbarToggle icon="grid_on" label="Show grid" pressed={grid} onChange={setGrid} />
        <ToolbarDivider />
        <ToolbarButton icon="undo" label="Undo" />
        <ToolbarButton icon="redo" label="Redo" />
      </Toolbar>
    );
  },
};

export const Labeled = {
  name: "With a label",
  render: () => {
    const [align, setAlign] = useState("left");
    return (
      <Toolbar aria-label="Alignment" label="Alignment">
        <ToolbarGroup aria-label="Alignment" value={align} onChange={setAlign} options={ALIGN_OPTIONS} />
      </Toolbar>
    );
  },
};

export const ResponsiveLabels = {
  name: "Responsive labels",
  render: () => {
    const [align, setAlign] = useState("left");
    return (
      <div>
        <p style={{ marginBlock: "0 var(--base-spacing-12)", color: "var(--semantic-color-text-muted)" }}>
          Labels are hidden below the <code>lg</code> breakpoint and shown from <code>lg</code> up.
          Resize the viewport to see the toggle.
        </p>
        <Toolbar aria-label="Formatting">
          <ToolbarToggle icon="format_bold" label="Bold" showLabel={{ xs: false, lg: true }} pressed onChange={() => {}} />
          <ToolbarToggle icon="format_italic" label="Italic" showLabel={{ xs: false, lg: true }} pressed={false} onChange={() => {}} />
          <ToolbarDivider />
          <ToolbarGroup
            aria-label="Alignment"
            value={align}
            onChange={setAlign}
            showLabels={{ xs: false, lg: true }}
            options={ALIGN_OPTIONS}
          />
        </Toolbar>
      </div>
    );
  },
};

export const FullWidth = {
  name: "Full width — tools fill the container",
  render: () => {
    const [marks, setMarks] = useState({ bold: false, italic: false, underline: false });
    const [align, setAlign] = useState("left");
    const set = (k) => (v) => setMarks((m) => ({ ...m, [k]: v }));
    return (
      <div style={{ maxWidth: "640px" }}>
        <Toolbar aria-label="Formatting" fullWidth>
          <ToolbarToggle icon="format_bold" label="Bold" pressed={marks.bold} onChange={set("bold")} />
          <ToolbarToggle icon="format_italic" label="Italic" pressed={marks.italic} onChange={set("italic")} />
          <ToolbarToggle icon="format_underlined" label="Underline" pressed={marks.underline} onChange={set("underline")} />
          <ToolbarDivider />
          <ToolbarGroup aria-label="Alignment" value={align} onChange={setAlign} options={ALIGN_OPTIONS} />
        </Toolbar>
      </div>
    );
  },
};

export const OverflowGroup = {
  name: "Overflow group",
  render: () => {
    const [space, setSpace] = useState("16");
    return (
      <div style={{ inlineSize: "260px" }}>
        <Toolbar aria-label="Padding" fullWidth>
          <ToolbarGroup
            aria-label="Padding"
            value={space}
            onChange={setSpace}
            showLabels
            overflow
            options={SPACING_OPTIONS}
          />
        </Toolbar>
      </div>
    );
  },
};

export const Overlay = {
  name: "Overlay — floating bar over content",
  render: () => (
    <div
      style={{
        position: "relative",
        padding: "var(--base-spacing-40) var(--base-spacing-24) var(--base-spacing-24)",
        background: "var(--semantic-color-surface-page)",
        border: "var(--component-card-border-width) solid var(--semantic-color-border-subtle)",
        borderRadius: "var(--base-radius-md)",
      }}
    >
      <p style={{ margin: 0, color: "var(--semantic-color-text-default)" }}>
        Select text in this block and a floating formatting toolbar appears above the
        selection, lifted onto its own elevated surface.
      </p>
      <div
        style={{
          position: "absolute",
          insetBlockStart: 0,
          insetInlineStart: "var(--base-spacing-24)",
          transform: "translateY(-50%)",
        }}
      >
        <TextEditorBar overlay />
      </div>
    </div>
  ),
};
