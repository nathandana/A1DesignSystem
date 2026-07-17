// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=661-1036
// source=packages/react/src/components/bottom-drawer/BottomDrawer.jsx
// component=BottomDrawer
import figma from "figma";

export default {
  id: "a1-bottom-drawer",
  imports: ['import { BottomDrawer } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<BottomDrawer
  aria-label="Primary"
  items={[
    { id: "home", label: "Home", icon: "home", active: true },
    { id: "search", label: "Search", icon: "search" },
    { id: "alerts", label: "Alerts", icon: "notifications", badge: 3 },
    { id: "settings", label: "Settings", icon: "settings" },
  ]}
/>`,
  metadata: {
    props: {
      omittedProps: ["className", "onClick", "href", "disabled"],
      figmaGaps: [
        "Items are composed Bottom Drawer Item instances (State=default|active with Label, Icon swap, Show badge, Badge) — item data is runtime-owned, so the template emits a representative items array.",
        "The bar is shown at the xs width (375); React caps items at 5 and pins the bar with safe-area padding at the viewport bottom.",
        "Badge values cap at 99+ in React.",
      ],
    },
  },
};
