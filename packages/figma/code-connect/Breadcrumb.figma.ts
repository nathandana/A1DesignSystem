// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=659-999
// source=packages/react/src/components/breadcrumb/Breadcrumb.jsx
// component=Breadcrumb
import figma from "figma";

const instance = figma.selectedInstance;
const variant = instance.getEnum("Variant", {
  default: "default",
  back: "back",
});
const backLabel = instance.getString("Back label") || "Back";

function escapeAttr(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const backProp = variant === "back" && backLabel !== "Back" ? `\n  backLabel="${escapeAttr(backLabel)}"` : "";

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
      visualStates: ["Variant"],
      omittedProps: ["className", "style", "onClick", "aria-*"],
      figmaGaps: [
        "The item list is composed from Breadcrumb Item instances (Type=link|current|ancestor) with / separators; item labels/hrefs are runtime data, so the template emits a representative items array.",
        "Variant=back shows the <480px container form React switches to automatically — it is a preview, not a prop.",
      ],
    },
  },
};
