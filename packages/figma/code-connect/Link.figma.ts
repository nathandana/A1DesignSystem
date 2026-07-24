// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=487-1143
// source=packages/react/src/components/link/Link.jsx
// component=Link
import figma from "figma";

const instance = figma.selectedInstance;
const label = instance.getString("Label") || "Learn more";
const size = instance.getEnum("Size", {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
});
const weight = instance.getEnum("Weight", {
  normal: "normal",
  medium: "medium",
  semibold: "semibold",
  bold: "bold",
});
const iconPosition = instance.getEnum("Icon position", {
  start: "start",
  end: "end",
});
const showIcon = instance.getBoolean("Show icon");

const prop = (name: string, value: string | undefined) =>
  value ? ` ${name}="${value}"` : "";
const iconProp = showIcon ? ' icon="star"' : "";
const iconPositionProp =
  showIcon && iconPosition === "end" ? ' iconPosition="end"' : "";

export default {
  id: "a1-link",
  imports: ['import { Link } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<Link${prop("size", size)}${prop("weight", weight)}${iconProp}${iconPositionProp}>${label}</Link>`,
  metadata: {
    props: {
      omittedProps: [
        "href",
        "target",
        "onClick",
        "className",
        "style",
        "aria-*",
        "ref",
      ],
    },
  },
};
