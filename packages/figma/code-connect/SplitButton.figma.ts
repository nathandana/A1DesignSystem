// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=660-1020
// source=packages/react/src/components/split-button/SplitButton.jsx
// component=SplitButton
import figma from "figma";

const instance = figma.selectedInstance;
const variant = instance.getEnum("Variant", {
  primary: "primary",
  secondary: "secondary",
});
const size = instance.getEnum("Size", {
  sm: "sm",
  md: "md",
  lg: "lg",
});
const label = instance.getString("Label") || "Save";

function escapeText(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const variantProp = variant && variant !== "primary" ? `\n  variant="${variant}"` : "";
const sizeProp = size && size !== "md" ? `\n  size="${size}"` : "";

export default {
  id: "a1-split-button",
  imports: ['import { SplitButton } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<SplitButton${variantProp}${sizeProp}
  onClick={() => {}}
  actions={[
    { id: "save-draft", label: "Save as draft" },
    { id: "save-close", label: "Save and close" },
  ]}
>
  ${escapeText(label)}
</SplitButton>`,
  metadata: {
    props: {
      omittedProps: ["icon", "iconPosition", "loading", "disabled", "menuLabel", "toggleLabel", "className", "aria-*", "ref"],
      figmaGaps: [
        "The dropdown Menu and its actions are runtime-owned — compose an A1 Menu instance below the caret to show the open state in a design.",
        "The Figma set covers primary and secondary at sm/md/lg on the 28/40/56 height standard; destructive/success and loading/disabled states are not represented in v1.",
        "The hairline divider renders the segment foreground at 35% opacity, mirroring split-button.css color-mix.",
      ],
    },
  },
};
