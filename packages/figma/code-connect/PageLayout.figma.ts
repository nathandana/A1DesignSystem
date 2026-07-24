// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=690-1251
// source=packages/react/src/components/page-layout/PageLayout.jsx
// component=PageLayout
import figma from "figma";

export default {
  id: "a1-page-layout",
  imports: ['import { PageLayout, TopHeader, Section } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<PageLayout
  header={
    <TopHeader
      logoText="A1:Design"
      navItems={[{ id: "overview", label: "Overview", active: true }]}
      actions={[{ id: "search", label: "Search", icon: "search" }]}
    />
  }
>
  <Section padding="lg" contentWidth="lg">
    {/* page content */}
  </Section>
</PageLayout>`,
  metadata: {
    props: {
      omittedProps: ["sidebar", "aside", "footer", "sidebarPlacement", "asidePlacement", "stickyHeader", "viewportHeight", "className"],
      figmaGaps: [
        "The Figma v1 shell composes a Top Header instance above a Page Content Slot — configure the header on the nested instance and drop Sections into the slot.",
        "Sidebar, aside, and footer slots, their placements, sticky header, and viewport-height behavior are runtime-owned.",
        "The JSON bridge exports the nested Top Header as the PageLayout node's first child and the slot contents as the remaining children.",
      ],
    },
  },
};
