// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=489-1014
// source=packages/react/src/components/icon-button/IconButton.jsx
// component=IconButton
import figma from "figma";

const instance = figma.selectedInstance;
const label = instance.getString("Aria label") || "Icon button";
const variant = instance.getEnum("Variant", {
  tertiary: "tertiary",
  secondary: "secondary",
  destructive: "destructive",
  success: "success",
});
const size = instance.getEnum("Size", { sm: "sm", md: "md", lg: "lg" });
const prop = (name: string, value: string | undefined, defaultValue: string) =>
  value && value !== defaultValue ? ` ${name}="${value}"` : "";

export default {
  id: "a1-icon-button",
  imports: ['import { IconButton } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<IconButton icon="star" label="${label}"${prop("variant", variant, "tertiary")}${prop("size", size, "md")} />`,
  metadata: {
    props: {
      omittedProps: [
        "as",
        "href",
        "disabled",
        "onClick",
        "className",
        "style",
        "aria-*",
        "ref",
      ],
    },
  },
};
