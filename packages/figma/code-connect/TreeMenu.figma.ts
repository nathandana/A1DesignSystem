// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=664-1011
// source=packages/react/src/components/tree-menu/TreeMenu.jsx
// component=TreeMenu
import figma from "figma";

export default {
  id: "a1-tree-menu",
  imports: ['import { TreeMenu } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<TreeMenu
  aria-label="Files"
  selectedId="invoices"
  defaultExpandedIds={["documents"]}
  items={[
    {
      id: "documents",
      label: "Documents",
      icon: "folder",
      children: [
        { id: "reports", label: "Reports", icon: "folder", children: [] },
        { id: "invoices", label: "Invoices", icon: "description" },
        { id: "contracts", label: "Contracts", icon: "description" },
      ],
    },
    { id: "images", label: "Images", icon: "folder", children: [] },
  ]}
  onSelect={setSelectedId}
/>`,
  metadata: {
    props: {
      omittedProps: ["variant", "expandedIds", "onExpandedChange", "showExpandControls", "onHoverChange", "draggable", "onMove", "editingId", "onRename*", "className"],
      figmaGaps: [
        "Rows compose Tree Item instances (Type=branch-expanded|branch-collapsed|leaf × State=default|selected) with 12px-per-depth indent wrappers; the items tree is runtime data.",
        "Expand/collapse toggles use the add_box / indeterminate_check_box glyphs; selection binds the full action background per the React selected treatment.",
        "The collapsed icon-rail variant, drag-and-drop reordering, and inline rename are runtime-owned.",
      ],
    },
  },
};
