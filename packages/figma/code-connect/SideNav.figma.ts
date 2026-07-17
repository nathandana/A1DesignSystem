// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=665-1047
// source=packages/react/src/components/side-nav/SideNav.jsx
// component=SideNav
import figma from "figma";

const instance = figma.selectedInstance;
const variant = instance.getEnum("Variant", {
  expanded: "expanded",
  collapsed: "collapsed",
});

const collapsedProp = variant === "collapsed" ? "\n  defaultCollapsed" : "";

export default {
  id: "a1-side-nav",
  imports: ['import { SideNav, SideNavItem } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<SideNav${collapsedProp}
  header={<Logo />}
  footer={<AccountRow />}
>
  <SideNavItem icon="dashboard" label="Dashboard" active href="/" />
  <SideNavItem icon="folder" label="Projects" href="/projects" />
  <SideNavItem icon="bar_chart" label="Reports" badge={3} href="/reports" />
  <SideNavItem icon="settings" label="Settings" href="/settings" />
</SideNav>`,
  metadata: {
    props: {
      visualStates: ["Variant"],
      omittedProps: ["open", "onClose", "collapsed", "onCollapsedChange", "collapseButtonPlacement", "placement", "className"],
      figmaGaps: [
        "Items compose Side Nav Item instances (State=default|active with Label, Icon swap, Show badge, Badge); the active tint binds the color/sideNav/itemActiveBackground variable (text/accent at 10%).",
        "Variant=collapsed shows the 52px icon rail (desktop lg/xl); the rail rows are icon-only compositions, not Item instances.",
        "SideNavGroup disclosure groups, the xs–md overlay + scrim, header/footer render-function slots, and collapse behavior are runtime-owned.",
      ],
    },
  },
};
