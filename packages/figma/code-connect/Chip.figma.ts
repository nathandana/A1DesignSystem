// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=752-61
// source=packages/react/src/components/chip/Chip.jsx
// component=Chip / ChipGroup
import figma from "figma";

const instance = figma.selectedInstance;
const size = instance.getEnum("Size", { sm: "sm", md: "md", lg: "lg" });
const state = instance.getEnum("State", { default: "default", selected: "selected", disabled: "disabled" });
const label = instance.getString("Label") || "Filter";
const showCaret = instance.getBoolean("Show caret");

function escapeText(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const sizeProp = size && size !== "md" ? ` size="${size}"` : "";
const stateProps = `${state === "selected" ? " selected" : ""}${state === "disabled" ? " disabled" : ""}`;
const menuProps = showCaret
  ? `\n    menu={[{ id: "newest", label: "Newest first" }, { id: "oldest", label: "Oldest first" }]}`
  : "";

export default {
  id: "a1-chip",
  imports: ['import { ChipGroup, Chip } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<ChipGroup selectionMode="single" defaultValue="all" label="Filter by category">
  <Chip value="all"${sizeProp}${stateProps}${menuProps}>${escapeText(label)}</Chip>
  <Chip value="design" icon="palette">Design</Chip>
  <Chip value="engineering" icon="code">Engineering</Chip>
</ChipGroup>`,
  metadata: {
    props: {
      omittedProps: ["as", "href", "menuLabel", "onChange", "value", "wrap", "className"],
      figmaGaps: [
        "Chip heights sit on the 28/40/56 total-height standard; selected binds the action background/foreground and disabled renders at 55% opacity.",
        "Show caret marks a menu (filter) chip with the expand_more glyph — the open A1 Menu, selection state management, and navigation chips (as/href) are runtime-owned.",
        "Chip Group composes wrapping md Chip instances with an optional compact muted label; selectionMode/value/onChange and wrap={false} single-row toolbars are runtime props.",
      ],
    },
  },
};
