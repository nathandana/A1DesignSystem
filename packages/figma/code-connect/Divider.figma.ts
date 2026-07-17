// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=491-1126
// source=packages/react/src/components/divider/Divider.jsx
// component=Divider
import figma from "figma";

const instance = figma.selectedInstance;
const orientation = instance.getEnum("Orientation", {
  horizontal: "horizontal",
  vertical: "vertical",
});
const variant = instance.getEnum("Variant", {
  subtle: "subtle",
  strong: "strong",
  accent: "accent",
});
const lineStyle = instance.getEnum("Line style", {
  solid: "solid",
  dashed: "dashed",
  dotted: "dotted",
});
const size = instance.getEnum("Size", {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
});
const prop = (name: string, value: string | undefined, defaultValue: string) =>
  value && value !== defaultValue ? ` ${name}="${value}"` : "";

export default {
  id: "a1-divider",
  imports: ['import { Divider } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<Divider${prop("orientation", orientation, "horizontal")}${prop("variant", variant, "subtle")}${prop("lineStyle", lineStyle, "solid")}${prop("size", size, "xs")} />`,
  metadata: {
    props: {
      omittedProps: [
        "space",
        "decorative",
        "className",
        "style",
        "aria-*",
        "ref",
      ],
    },
  },
};
