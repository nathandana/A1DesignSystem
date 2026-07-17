// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=658-1020
// source=packages/react/src/components/list/List.jsx
// component=List
import figma from "figma";

const instance = figma.selectedInstance;
const variant = instance.getEnum("Variant", {
  unordered: "unordered",
  ordered: "ordered",
  icon: "icon",
  divider: "divider",
});
const items = [
  instance.getString("Item 1") || "First item in the list",
  instance.getString("Item 2") || "Second item with more detail",
  instance.getString("Item 3") || "Third item",
];

function escapeText(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const asProp = variant === "ordered" ? ' as="ol"' : "";
const extraProps =
  variant === "icon"
    ? ' icon="check_circle"'
    : variant === "divider"
      ? ' variant="divider"'
      : "";
const children = items.map((item) => `  <ListItem>${escapeText(item)}</ListItem>`).join("\n");

export default {
  id: "a1-list",
  imports: ['import { List, ListItem } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<List${asProp}${extraProps}>
${children}
</List>`,
  metadata: {
    props: {
      omittedProps: ["className", "style", "marginBottom"],
      figmaGaps: [
        "The Figma component shows the md size with three items; size/color/responsive props and per-item icon overrides are runtime-owned.",
        "Ordered numbering is representative text — Figma cannot auto-number.",
        "The icon variant shows check_circle; swap happens in code via the List icon prop.",
      ],
    },
  },
};
