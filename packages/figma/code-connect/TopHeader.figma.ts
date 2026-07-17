// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=613-977
// source=packages/react/src/components/top-header/TopHeader.jsx
// component=TopHeader
import figma from "figma";

const instance = figma.selectedInstance;

const logoText = instance.getString("Logo text") || "A1:Design";
const showLogin = instance.getBoolean("Show login button");

function escapeAttr(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

const loginProp = showLogin
  ? `\n  loginButton={<Button variant="secondary" size="sm">Sign in</Button>}`
  : "";

export default {
  id: "a1-top-header",
  imports: [
    'import { TopHeader, Button } from "@gtivr4/a1-design-system-react"',
  ],
  example: figma.code`<TopHeader
  logoText="${escapeAttr(logoText)}"
  navItems={[
    { id: "explore", label: "Explore", items: [{ id: "docs", label: "Documentation", href: "/docs" }] },
    { id: "foundations", label: "Foundations", href: "/foundations" },
    { id: "components", label: "Components", href: "/components", active: true },
  ]}
  actions={[
    { id: "search", label: "Search", icon: "search" },
    { id: "notifications", label: "Notifications", icon: "notifications" },
  ]}${loginProp}
/>`,
  metadata: {
    props: {
      visualStates: ["hover", "Breakpoint"],
      omittedProps: [
        "logo",
        "logoHref",
        "navIconPosition",
        "onClick",
        "menuHeader",
        "className",
        "id",
        "aria-*",
        "ref",
      ],
      figmaGaps: [
        "Nav Items and Actions are composed from Top Header Nav Item and Icon Button instances; their copy and states do not map to single parent properties, so the template emits a representative composition.",
        "Breakpoint variants are visual previews at the shared contract widths; the React component is fluid and emits no breakpoint prop.",
        "Dropdown submenus, the opened mobile nav overlay, and responsive navIconPosition are runtime behavior.",
      ],
    },
  },
};
