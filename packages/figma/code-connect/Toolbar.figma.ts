// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=840-213
// source=packages/react/src/components/toolbar/Toolbar.jsx
// component=Toolbar
import figma from "figma";

const instance = figma.selectedInstance;
const variant = instance.getEnum("Variant", {
  default: "default",
  overlay: "overlay",
});
const label = instance.getBoolean("Show label") ? instance.getString("Label") : "";

function escapeAttr(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const labelProp = label ? `\n  label="${escapeAttr(label)}"` : `\n  aria-label="Formatting"`;
const overlayProp = variant === "overlay" ? "\n  overlay" : "";

export default {
  id: "a1-toolbar",
  imports: ['import { Toolbar, ToolbarToggle, ToolbarButton, ToolbarGroup, ToolbarMenu, ToolbarDivider } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<Toolbar${labelProp}${overlayProp}>
  <ToolbarToggle icon="format_bold" label="Bold" pressed={bold} onChange={setBold} />
  <ToolbarToggle icon="format_italic" label="Italic" pressed={italic} onChange={setItalic} />
  <ToolbarDivider />
  <ToolbarGroup
    aria-label="Alignment"
    value={align}
    onChange={setAlign}
    options={[
      { value: "left", icon: "format_align_left", label: "Align left" },
      { value: "center", icon: "format_align_center", label: "Align center" },
      { value: "right", icon: "format_align_right", label: "Align right" },
    ]}
  />
  <ToolbarDivider />
  <ToolbarMenu
    icon="format_size"
    label="Size"
    value={size}
    onChange={setSize}
    showLabel
    items={[{ value: "sm", label: "Body SM" }, { value: "md", label: "Body MD" }, { value: "lg", label: "Body LG" }]}
  />
</Toolbar>`,
  metadata: {
    props: {
      visualStates: ["State"],
      omittedProps: ["fullWidth", "overflow", "overflowLabel", "onChange", "className"],
      figmaGaps: [
        "The Tools slot composes Toolbar Tool instances (State=default|selected|disabled with Show icon/Icon swap, Show label + Label, Show caret for menu tools, Show swatch) and Toolbar Divider instances — tool data and selection semantics are runtime, so the template emits a representative composition.",
        "State=selected covers both aria-pressed toggles and aria-checked group radios; the selected fill binds color/toolbar/selectedBackground (text/default at 16%).",
        "fullWidth, overflow collapse (the More menu), roving focus, open menus, and responsive per-breakpoint label visibility are runtime-owned. Place the bar on page/panel surfaces only (rule toolbar-surface-contrast).",
      ],
    },
  },
};
