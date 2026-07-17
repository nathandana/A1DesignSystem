// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=662-988
// source=packages/react/src/components/page-nav/PageNav.jsx
// component=PageNav
import figma from "figma";

export default {
  id: "a1-page-nav",
  imports: ['import { PageNav } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<PageNav
  label="On this page"
  sections={[
    { id: "overview", label: "Overview" },
    { id: "getting-started", label: "Getting started" },
    { id: "installation", label: "Installation", level: 2 },
    { id: "configuration", label: "Configuration", level: 2 },
    { id: "api-reference", label: "API reference" },
  ]}
/>`,
  metadata: {
    props: {
      omittedProps: ["className", "style", "aria-*"],
      figmaGaps: [
        "Sections compose Page Nav Item instances (Level=1|2 × State=default|active); the section list is runtime data, so the template emits a representative array.",
        "The reading-progress fill and the active section track scroll position at runtime — the Figma component shows a representative partial fill and one active item.",
      ],
    },
  },
};
