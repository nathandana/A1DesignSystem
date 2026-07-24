// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=659-999
// source=packages/react/src/components/breadcrumb/Breadcrumb.jsx
// component=Breadcrumb
import figma from "figma";

const instance = figma.selectedInstance;
const container = instance.getEnum("Container", {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
});
const backLabel = instance.getString("Back label") || "Back";

function escapeAttr(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const backProp = container === "sm" && backLabel !== "Back" ? `\n  backLabel="${escapeAttr(backLabel)}"` : "";

export default {
  id: "a1-breadcrumb",
  imports: ['import { Breadcrumb } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<Breadcrumb${backProp}
  items={[
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Wireless headphones" },
  ]}
/>`,
  metadata: {
    props: {
      visualStates: ["Container"],
      omittedProps: ["className", "style", "onClick", "aria-*"],
      figmaGaps: [
        "The trail is a real Items Slot of Breadcrumb Item instances (Type=link|current|ancestor); each item carries its own leading / separator via Show separator (off on the first item). Item labels/hrefs are runtime data, so the template emits a representative items array.",
        "Container variants preview the 480px container query on the documented container-query scale (sm 320 / md 480 / lg 640 / xl 960), widths bound to the Container collection's container/width/preview — Container=sm shows the back-link form; the axis emits no React prop.",
      ],
    },
  },
};
