// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=728-38
// source=packages/react/src/components/data-table/DataTable.jsx
// component=DataTable
import figma from "figma";

export default {
  id: "a1-data-table",
  imports: ['import { DataTable } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<DataTable
  caption="Team members"
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "status", label: "Status" },
    { key: "points", label: "Points", sortable: true, align: "end" },
  ]}
  rows={[
    { id: "ava", name: "Ava Chen", role: "Product designer", status: "Active", points: 1240 },
    { id: "leo", name: "Leo Fischer", role: "Engineer", status: "Active", points: 860 },
    { id: "mia", name: "Mia Torres", role: "Researcher", status: "Invited", points: 312 },
    { id: "noah", name: "Noah Patel", role: "Engineer", status: "Paused", points: 74 },
  ]}
  defaultSort={{ key: "name", direction: "asc" }}
/>`,
  metadata: {
    props: {
      visualStates: ["Sort"],
      omittedProps: ["size", "selectable", "search", "pagination", "notices", "scrollable", "onSelectionChange", "className"],
      figmaGaps: [
        "The Figma component is the default density only — compact/comfortable density, row selection, search, pagination, notice rows, column renderer functions, and the mobile-cards layout are runtime-owned.",
        "Columns are composed from Data Table Column components. Each column owns one Data Table Header Cell and a Cell Slot of Data Table Cell instances; zebra is represented by the Data Table Cell stripe variant.",
        "The last row's bottom hairline is dropped via an instance stroke override, mirroring tbody tr:last-child td.",
      ],
    },
  },
};
