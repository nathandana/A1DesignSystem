import { useState } from "react";
import { Button } from "../button/Button.jsx";
import { Card } from "../card/Card.jsx";
import { Heading } from "../heading/Heading.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { PageLayout } from "../page-layout/PageLayout.jsx";
import { PageNav } from "../page-nav/PageNav.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Section } from "../section/Section.jsx";
import { DataTable } from "./DataTable.jsx";
import { Banner } from "../banner/Banner.jsx";
import { requiredIconArgType } from "../../storybook/icon-controls.js";

export default {
  title: "Components/DataTable",
  component: DataTable,
  parameters: { layout: "padded" },
};

// ── Shared data ──────────────────────────────────────────────────────────────

const STATUS_MAP   = { Active: "success", Inactive: "neutral", "On leave": "warn" };
const LOCATION_MAP = { Remote: "info",    Hybrid: "neutral",   Office: "success"  };

const COLUMNS = [
  { key: "name",       label: "Name",       type: "avatar" },
  { key: "department", label: "Department" },
  { key: "role",       label: "Role" },
  { key: "location",   label: "Location",  type: "badge", statusMap: LOCATION_MAP },
  { key: "status",     label: "Status",    type: "badge", statusMap: STATUS_MAP },
  { key: "salary",     label: "Salary",    type: "currency" },
];

const SORTABLE_COLUMNS = COLUMNS.map((column) => ({
  ...column,
  sortable: ["name", "department", "role", "status", "salary"].includes(column.key),
}));

const ALL_ROWS = [
  { name: "Aria Chen",      department: "Design",      role: "Product Designer",     location: "Remote",  status: "Active",    salary: 92000  },
  { name: "Marcus Webb",    department: "Engineering", role: "Engineering Lead",     location: "Hybrid",  status: "Active",    salary: 148000 },
  { name: "Priya Nair",     department: "Data",        role: "Data Analyst",         location: "Office",  status: "On leave",  salary: 88000  },
  { name: "Tom Erikson",    department: "Sales",       role: "Account Manager",      location: "Remote",  status: "Active",    salary: 95000  },
  { name: "Leila Fontaine", department: "Design",      role: "UX Researcher",        location: "Hybrid",  status: "Inactive",  salary: 82000  },
  { name: "Devon Park",     department: "Engineering", role: "Frontend Engineer",    location: "Remote",  status: "Active",    salary: 118000 },
  { name: "Yuki Tanaka",    department: "Marketing",   role: "Brand Strategist",     location: "Office",  status: "Active",    salary: 87000  },
  { name: "Omar Hassan",    department: "Sales",       role: "Sales Director",       location: "Hybrid",  status: "Active",    salary: 165000 },
  { name: "Stella Bowen",   department: "Marketing",   role: "Content Writer",       location: "Remote",  status: "Inactive",  salary: 72000  },
  { name: "James Ortega",   department: "Engineering", role: "DevOps Engineer",      location: "Hybrid",  status: "Active",    salary: 132000 },
  { name: "Nina Kovac",     department: "Product",     role: "Product Manager",      location: "Office",  status: "Active",    salary: 125000 },
  { name: "Carlos Reyes",   department: "Engineering", role: "QA Engineer",          location: "Remote",  status: "Active",    salary: 98000  },
  { name: "Maya Johnson",   department: "Design",      role: "Visual Designer",      location: "Hybrid",  status: "Active",    salary: 85000  },
  { name: "Raj Patel",      department: "Data",        role: "Data Scientist",       location: "Remote",  status: "Active",    salary: 142000 },
  { name: "Sofia Torres",   department: "Product",     role: "Product Analyst",      location: "Office",  status: "On leave",  salary: 95000  },
  { name: "Leo Nakamura",   department: "Engineering", role: "Backend Engineer",     location: "Remote",  status: "Active",    salary: 125000 },
  { name: "Anna Dubois",    department: "Marketing",   role: "Marketing Manager",    location: "Hybrid",  status: "Active",    salary: 105000 },
  { name: "Kevin Osei",     department: "Sales",       role: "Sales Representative", location: "Office",  status: "Active",    salary: 78000  },
  { name: "Ingrid Larsen",  department: "Design",      role: "Design Lead",          location: "Hybrid",  status: "Active",    salary: 118000 },
  { name: "Mike Chen",      department: "Engineering", role: "Staff Engineer",       location: "Remote",  status: "Active",    salary: 168000 },
];

const PAGE_SIZE = 6;

const FILTER_DEFS = [
  {
    key: "department",
    label: "Department",
    type: "multi",  // checkboxes — pick one or many
    options: [
      { value: "Design",      label: "Design" },
      { value: "Engineering", label: "Engineering" },
      { value: "Product",     label: "Product" },
      { value: "Marketing",   label: "Marketing" },
      { value: "Sales",       label: "Sales" },
      { value: "Data",        label: "Data" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "single",  // radio buttons — pick one
    options: [
      { value: "Active",    label: "Active" },
      { value: "Inactive",  label: "Inactive" },
      { value: "On leave",  label: "On leave" },
    ],
  },
  {
    key: "location",
    label: "Location",
    type: "single",
    options: [
      { value: "Remote", label: "Remote" },
      { value: "Hybrid", label: "Hybrid" },
      { value: "Office", label: "Office" },
    ],
  },
];

const SEARCH_COLS = [
  { key: "name",       label: "Name" },
  { key: "role",       label: "Role" },
  { key: "department", label: "Department" },
];

// ── Configurable ─────────────────────────────────────────────────────────────

export const Configurable = {
  args: {
    size:             undefined,
    zebra:            false,
    scrollable:       false,
    caption:          "",
    emptyTitle:       "No results",
    emptyDescription: "",
    emptyIcon:        "inbox",
    pageSize:         undefined,
    rowCount:         8,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["compact", "default", "comfortable", undefined],
      description: 'Omit (default) to auto-select density from available container width',
    },
    zebra:            { control: "boolean" },
    scrollable:       { control: "boolean", description: "Enable horizontal scrolling when content overflows" },
    caption:          { control: "text" },
    emptyTitle:       { control: "text" },
    emptyDescription: { control: "text" },
    emptyIcon:        { ...requiredIconArgType("Empty state icon name") },
    pageSize:         { control: "number", description: "Rows per page for built-in client-side pagination" },
    rowCount: {
      control: { type: "range", min: 0, max: 20 },
      description: "Rows to display — set to 0 to preview the empty state",
    },
  },
  render: ({ rowCount, ...args }) => (
    <DataTable {...args} columns={COLUMNS} rows={ALL_ROWS.slice(0, rowCount)} />
  ),
};

// ── With filters + search ─────────────────────────────────────────────────────

export const WithFilters = {
  render: () => {
    const [filters, setFilters]           = useState({});
    const [searchValue, setSearchValue]   = useState("");
    const [searchColumn, setSearchColumn] = useState("");

    return (
      <DataTable
        columns={COLUMNS}
        rows={ALL_ROWS}
        filters={FILTER_DEFS}
        filterValue={filters}
        onFilterChange={setFilters}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchColumn={searchColumn}
        onSearchColumnChange={setSearchColumn}
        searchableColumns={SEARCH_COLS}
        pageSize={PAGE_SIZE}
        emptyTitle="No matching team members"
        emptyDescription="Try adjusting your search or clearing some filters."
        emptyIcon="person_search"
      />
    );
  },
};

// ── Density comparison ──────────────────────────────────────────────────────

export const DensityComparison = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      {["comfortable", "default", "compact"].map((size) => (
        <div key={size}>
          <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "var(--semantic-color-text-muted)", marginBottom: 8, textTransform: "capitalize" }}>
            {size}
          </p>
          <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 4)} size={size} />
        </div>
      ))}
    </div>
  ),
};

// ── Responsive density ──────────────────────────────────────────────────────

export const ResponsiveDensity = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ padding: 24 }}>
      <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "var(--semantic-color-text-muted)", marginBottom: 16 }}>
        Resize the Storybook canvas — the table automatically switches between comfortable,
        default, and compact density based on the available container width and column type estimates.
      </p>
      <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 8)} zebra caption="Team directory — auto density" />
    </div>
  ),
};

// ── Zebra striping ──────────────────────────────────────────────────────────

export const ZebraStriping = {
  render: () => (
    <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 8)} zebra caption="Team members" />
  ),
};

// ── With pagination ─────────────────────────────────────────────────────────

export const WithPagination = {
  render: () => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(ALL_ROWS.length / PAGE_SIZE);
    const pageRows   = ALL_ROWS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return (
      <DataTable
        columns={COLUMNS} rows={pageRows}
        page={page} totalPages={totalPages} totalRows={ALL_ROWS.length}
        onPageChange={setPage} zebra caption="All team members"
      />
    );
  },
};

// ── Sorting ────────────────────────────────────────────────────────────────

export const Sortable = {
  render: () => {
    const [sort, setSort] = useState({ key: "name", direction: "asc" });

    return (
      <DataTable
        columns={SORTABLE_COLUMNS}
        rows={ALL_ROWS.slice(0, 10)}
        sort={sort}
        onSortChange={setSort}
        zebra
        caption="Sortable team directory"
      />
    );
  },
};

// ── Selection + bulk actions ───────────────────────────────────────────────

export const SelectableRows = {
  render: () => {
    const [rows, setRows] = useState(ALL_ROWS.slice(0, 10));
    const [selectedRowIds, setSelectedRowIds] = useState([]);

    function handleDeleteSelected(_selectedRows, selectedIds) {
      setRows((currentRows) => currentRows.filter((row, index) => {
        const rowId = String(row.id ?? row.key ?? row.name ?? index);
        return !selectedIds.includes(rowId);
      }));
    }

    return (
      <DataTable
        columns={SORTABLE_COLUMNS}
        rows={rows}
        selectable
        selectedRowIds={selectedRowIds}
        onSelectedRowIdsChange={setSelectedRowIds}
        onDeleteSelected={handleDeleteSelected}
        defaultSort={{ key: "name", direction: "asc" }}
        zebra
        caption="Selectable team directory"
      />
    );
  },
};

// ── Empty state ─────────────────────────────────────────────────────────────

export const EmptyState = {
  render: () => (
    <DataTable
      columns={COLUMNS} rows={[]}
      emptyTitle="No team members found"
      emptyDescription="Try adjusting your filters or search term."
      emptyIcon="person_search"
    />
  ),
};

export const NoticeRow = {
  name: "Notice row",
  render: () => (
    <DataTable
      columns={COLUMNS}
      rows={ALL_ROWS.slice(0, 6)}
      notices={[
        {
          content: (
            <Banner variant="system" status="warn" title="Scheduled maintenance">
              This table will be read-only on Saturday 14 June from 2:00–4:00 am UTC.
            </Banner>
          ),
          afterRow: 2,
        },
      ]}
    />
  ),
};

export const MultipleNotices = {
  name: "Multiple notice rows",
  render: () => (
    <DataTable
      columns={COLUMNS}
      rows={ALL_ROWS.slice(0, 8)}
      notices={[
        {
          content: (
            <Banner variant="system" status="info" title="New records available">
              3 team members were added since your last visit.
            </Banner>
          ),
          afterRow: 0,
        },
        {
          content: (
            <Banner variant="system" status="warn" title="Scheduled maintenance">
              This table will be read-only on Saturday 14 June from 2:00–4:00 am UTC.
            </Banner>
          ),
          afterRow: 4,
        },
      ]}
    />
  ),
};

// ── Column types ────────────────────────────────────────────────────────────

const TYPE_COLUMNS = [
  { key: "name",    label: "Name",    type: "avatar" },
  { key: "score",   label: "Score",   type: "number",   align: "end" },
  { key: "budget",  label: "Budget",  type: "currency" },
  { key: "status",  label: "Status",  type: "badge",    statusMap: { Approved: "success", Pending: "warn", Rejected: "error", Draft: "neutral" } },
  { key: "brief",   label: "Brief",   type: "link" },
  { key: "updated", label: "Updated", type: "date" },
  { key: "notes",   label: "Notes" },
  { key: "actions", label: "Actions", type: "actions", align: "end" },
];

const TYPE_ROWS = [
  {
    name: "Aria Chen",
    score: 9821,
    budget: 45000,
    status: "Approved",
    brief: { href: "#aria-chen", label: "Open brief", icon: "open_in_new" },
    updated: "May 20, 2026",
    notes: "Q2 review complete",
    actions: [{ label: "View", icon: "visibility", onClick: () => {} }],
  },
  {
    name: "Marcus Webb",
    score: 7403,
    budget: 120000,
    status: "Pending",
    brief: { href: "#marcus-webb", label: "Open brief", icon: "open_in_new" },
    updated: "May 18, 2026",
    notes: "Awaiting sign-off",
    actions: [{ label: "Review", icon: "rate_review", onClick: () => {} }],
  },
  {
    name: "Priya Nair",
    score: 5190,
    budget: 22500,
    status: "Draft",
    brief: { href: "#priya-nair", label: "Open brief", icon: "open_in_new" },
    updated: "May 15, 2026",
    notes: "",
    actions: [{ label: "Edit", icon: "edit", onClick: () => {} }],
  },
  {
    name: "Tom Erikson",
    score: 11204,
    budget: 88000,
    status: "Rejected",
    brief: { href: "#tom-erikson", label: "Open brief", icon: "open_in_new" },
    updated: "May 10, 2026",
    notes: "See attached brief",
    actions: [{ label: "Resolve", icon: "check_circle", onClick: () => {} }],
  },
  {
    name: "Leila F.",
    score: 3051,
    budget: 15000,
    status: "Approved",
    brief: { href: "#leila-f", label: "Open brief", icon: "open_in_new" },
    updated: "Apr 30, 2026",
    notes: "",
    actions: [{ label: "View", icon: "visibility", onClick: () => {} }],
  },
];

export const ColumnTypes = {
  render: () => (
    <DataTable columns={TYPE_COLUMNS} rows={TYPE_ROWS} caption="All column types — avatar, number, currency, badge, link, date, text, actions" scrollable />
  ),
};

// ── Horizontal scroll ───────────────────────────────────────────────────────

export const HorizontalScroll = {
  render: () => (
    <div style={{ maxWidth: 500 }}>
      <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "var(--semantic-color-text-muted)", marginBottom: 12 }}>
        Container constrained to 500px — scrollable prop enables horizontal overflow.
      </p>
      <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 5)} scrollable />
    </div>
  ),
};

// ── Documentation ─────────────────────────────────────────────────────────────

const DOC_SECTIONS = [
  { id: "dt-overview",    label: "Overview" },
  { id: "dt-columns",     label: "Columns" },
  { id: "dt-density",     label: "Density" },
  { id: "dt-filtering",   label: "Filtering" },
  { id: "dt-responsive",  label: "Responsive" },
  { id: "dt-props",       label: "Props" },
];

function CodeValue({ children, muted = false }) {
  return (
    <code
      style={{
        fontFamily: "monospace",
        fontSize: 12,
        color: muted ? "var(--semantic-color-text-muted)" : "var(--semantic-color-action-background)",
      }}
    >
      {children}
    </code>
  );
}

const PROP_COLUMNS = [
  { key: "name", label: "Prop", width: "150px" },
  { key: "type", label: "Type", width: "280px" },
  { key: "defaultVal", label: "Default", width: "120px" },
  { key: "description", label: "Description" },
];

const PROP_ROWS = [
  { name: <CodeValue>columns</CodeValue>, type: <CodeValue>Column[]</CodeValue>, defaultVal: <CodeValue muted>[]</CodeValue>, description: "Column definitions — key, label, type, align, width, statusMap" },
  { name: <CodeValue>rows</CodeValue>, type: <CodeValue>Record&lt;string,any&gt;[]</CodeValue>, defaultVal: <CodeValue muted>[]</CodeValue>, description: "Row data — keys must match column keys" },
  { name: <CodeValue>sort</CodeValue>, type: <CodeValue>{'{ key: string, direction: "asc"|"desc" }'}</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Controlled sort state" },
  { name: <CodeValue>defaultSort</CodeValue>, type: <CodeValue>{'{ key: string, direction: "asc"|"desc" }'}</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Initial sort state for uncontrolled tables" },
  { name: <CodeValue>onSortChange</CodeValue>, type: <CodeValue>(sort: Sort | null) =&gt; void</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Called when a sortable header or mobile sort select changes" },
  { name: <CodeValue>selectable</CodeValue>, type: <CodeValue>boolean</CodeValue>, defaultVal: <CodeValue muted>false</CodeValue>, description: "Adds row selection checkboxes and a select-all header control" },
  { name: <CodeValue>selectedRowIds</CodeValue>, type: <CodeValue>Array&lt;string|number&gt;</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Controlled selected row ids" },
  { name: <CodeValue>defaultSelectedRowIds</CodeValue>, type: <CodeValue>Array&lt;string|number&gt;</CodeValue>, defaultVal: <CodeValue muted>[]</CodeValue>, description: "Initial selected row ids for uncontrolled tables" },
  { name: <CodeValue>onSelectedRowIdsChange</CodeValue>, type: <CodeValue>(ids: string[]) =&gt; void</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Called when row selection changes" },
  { name: <CodeValue>onDeleteSelected</CodeValue>, type: <CodeValue>(rows: Row[], ids: string[]) =&gt; void</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Shows a destructive Delete bulk action and calls back with selected rows and ids" },
  { name: <CodeValue>getRowId</CodeValue>, type: <CodeValue>(row, index) =&gt; string|number</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Returns each row's stable id. Defaults to id, key, name, then index" },
  { name: <CodeValue>size</CodeValue>, type: <CodeValue>"compact"|"default"|"comfortable"</CodeValue>, defaultVal: <CodeValue muted>auto</CodeValue>, description: 'Cell spacing density. Omit to auto-select from container width.' },
  { name: <CodeValue>zebra</CodeValue>, type: <CodeValue>boolean</CodeValue>, defaultVal: <CodeValue muted>false</CodeValue>, description: "Alternate row background shading" },
  { name: <CodeValue>scrollable</CodeValue>, type: <CodeValue>boolean</CodeValue>, defaultVal: <CodeValue muted>false</CodeValue>, description: "Enable horizontal overflow scrolling" },
  { name: <CodeValue>caption</CodeValue>, type: <CodeValue>string</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Accessible table caption (renders above header)" },
  { name: <CodeValue>page</CodeValue>, type: <CodeValue>number</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Current page (1-indexed). Enables pagination footer" },
  { name: <CodeValue>defaultPage</CodeValue>, type: <CodeValue>number</CodeValue>, defaultVal: <CodeValue muted>1</CodeValue>, description: "Initial page for uncontrolled pagination" },
  { name: <CodeValue>pageSize</CodeValue>, type: <CodeValue>number</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Rows per page for built-in client-side pagination" },
  { name: <CodeValue>totalPages</CodeValue>, type: <CodeValue>number</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Total number of pages" },
  { name: <CodeValue>totalRows</CodeValue>, type: <CodeValue>number</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Total row count across all pages (for footer text)" },
  { name: <CodeValue>onPageChange</CodeValue>, type: <CodeValue>(page: number) =&gt; void</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Called when the user changes page" },
  { name: <CodeValue>emptyTitle</CodeValue>, type: <CodeValue>string</CodeValue>, defaultVal: <CodeValue muted>"No results"</CodeValue>, description: "Heading shown when rows is empty" },
  { name: <CodeValue>emptyDescription</CodeValue>, type: <CodeValue>string</CodeValue>, defaultVal: <CodeValue muted>—</CodeValue>, description: "Body text in the empty state" },
  { name: <CodeValue>emptyIcon</CodeValue>, type: <CodeValue>string</CodeValue>, defaultVal: <CodeValue muted>"inbox"</CodeValue>, description: "Material symbol name for the empty state icon" },
];

export const Documentation = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ background: "var(--semantic-color-surface-page)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) 220px", gap: 48, alignItems: "start" }}>
          {/* ── Main content ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

            <div>
              <MessageBadge status="info" subtle style={{ marginBottom: 12 }}>Component</MessageBadge>
              <Heading as="h1" size="lg" style={{ marginBottom: 8 }}>DataTable</Heading>
              <Paragraph size="lg" color="muted">
                Displays tabular data with configurable density, sorting, filtering, pagination,
                and responsive card-flip layout for narrow viewports.
              </Paragraph>
            </div>

            {/* Overview */}
            <section id="dt-overview">
              <Heading as="h2" size="xs" style={{ marginBottom: 16 }}>Overview</Heading>
              <Paragraph style={{ marginBottom: 20 }}>
                DataTable accepts a <code style={{ fontFamily: "monospace" }}>columns</code> definition and <code style={{ fontFamily: "monospace" }}>rows</code> array.
                Each column specifies a <code style={{ fontFamily: "monospace" }}>type</code> that controls rendering — text, number, currency, date, badge, or avatar.
                Mark columns as <code style={{ fontFamily: "monospace" }}>sortable</code> to add header controls and a mobile sort selector.
                Enable <code style={{ fontFamily: "monospace" }}>selectable</code> to add row checkboxes and bulk actions.
                Use the built-in <code style={{ fontFamily: "monospace" }}>filters</code> and <code style={{ fontFamily: "monospace" }}>searchableColumns</code> props for interactive filtering and search.
                Add <code style={{ fontFamily: "monospace" }}>pageSize</code> for client-side pagination, or control pages externally with <code style={{ fontFamily: "monospace" }}>page</code>, <code style={{ fontFamily: "monospace" }}>totalPages</code>, and <code style={{ fontFamily: "monospace" }}>onPageChange</code>.
              </Paragraph>
              <DataTable columns={SORTABLE_COLUMNS} rows={ALL_ROWS.slice(0, 5)} zebra caption="Team members" defaultSort={{ key: "name", direction: "asc" }} />
            </section>

            {/* Columns */}
            <section id="dt-columns">
              <Heading as="h2" size="xs" style={{ marginBottom: 8 }}>Columns</Heading>
              <Paragraph style={{ marginBottom: 20 }}>
                The <code style={{ fontFamily: "monospace" }}>type</code> prop controls cell rendering.
                Numeric types (<code style={{ fontFamily: "monospace" }}>number</code>, <code style={{ fontFamily: "monospace" }}>currency</code>) are automatically right-aligned with tabular numerals.
                Use <code style={{ fontFamily: "monospace" }}>align</code> to override alignment. <code style={{ fontFamily: "monospace" }}>badge</code> uses a <code style={{ fontFamily: "monospace" }}>statusMap</code> to color-code values.
              </Paragraph>
              <DataTable columns={TYPE_COLUMNS} rows={TYPE_ROWS} />
            </section>

            {/* Density */}
            <section id="dt-density">
              <Heading as="h2" size="xs" style={{ marginBottom: 8 }}>Density</Heading>
              <Paragraph style={{ marginBottom: 20 }}>
                Three densities — <strong>compact</strong>, <strong>default</strong>, and <strong>comfortable</strong> — adjust cell padding and font size.
                Compact mode also switches badges to the <code style={{ fontFamily: "monospace" }}>sm</code> size and hides their icons.
                Omit <code style={{ fontFamily: "monospace" }}>size</code> (the default) to let the table choose based on available container width.
              </Paragraph>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {["comfortable", "default", "compact"].map((d) => (
                  <div key={d}>
                    <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{d}</p>
                    <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 3)} size={d} />
                  </div>
                ))}
              </div>
            </section>

            {/* Filtering */}
            <section id="dt-filtering">
              <Heading as="h2" size="xs" style={{ marginBottom: 8 }}>Filtering</Heading>
              <Paragraph style={{ marginBottom: 20 }}>
                <code style={{ fontFamily: "monospace" }}>DataTable</code> renders configured filters as a chip row on wider screens and collapses them into a single menu button at the xs breakpoint (≤480px).
                Filters support <strong>single-select</strong> (radio buttons) and <strong>multi-select</strong> (checkboxes).
                A search input with an optional column-scope selector is included.
              </Paragraph>
              {(() => {
                const [filters, setFilters] = useState({});
                const [search, setSearch]   = useState("");
                const [col, setCol]         = useState("");
                return (
                  <DataTable
                    columns={COLUMNS}
                    rows={ALL_ROWS}
                    filters={FILTER_DEFS}
                    filterValue={filters}
                    onFilterChange={setFilters}
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchColumn={col}
                    onSearchColumnChange={setCol}
                    searchableColumns={SEARCH_COLS}
                    pageSize={PAGE_SIZE}
                    emptyTitle="No matching team members"
                    emptyDescription="Try adjusting your search or filters."
                    emptyIcon="person_search"
                  />
                );
              })()}
            </section>

            {/* Responsive */}
            <section id="dt-responsive">
              <Heading as="h2" size="xs" style={{ marginBottom: 8 }}>Responsive</Heading>
              <Paragraph style={{ marginBottom: 20 }}>
                Below 640px, each row flips to a labeled card layout using CSS <code style={{ fontFamily: "monospace" }}>display: block</code> and <code style={{ fontFamily: "monospace" }}>data-label</code> attributes.
                No JavaScript required. Horizontal scrolling is off by default — enable it with <code style={{ fontFamily: "monospace" }}>scrollable</code> for tables that must preserve column widths.
              </Paragraph>
              <Card style={{ padding: 16, background: "var(--semantic-color-surface-panel)" }}>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "var(--semantic-color-text-muted)", marginBottom: 12 }}>
                  Card-flip preview (simulated at 400px max-width)
                </p>
                <div style={{ maxWidth: 400 }}>
                  <DataTable columns={COLUMNS.slice(0, 4)} rows={ALL_ROWS.slice(0, 3)} />
                </div>
              </Card>
            </section>

            {/* Props */}
            <section id="dt-props">
              <Heading as="h2" size="xs" style={{ marginBottom: 16 }}>Props</Heading>
              <DataTable
                columns={PROP_COLUMNS}
                rows={PROP_ROWS}
                size="compact"
                scrollable
              />
            </section>

          </div>

          {/* ── Sticky page nav ── */}
          <div style={{ position: "sticky", top: 32, maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
            <PageNav sections={DOC_SECTIONS} label="On this page" />
          </div>
        </div>
      </div>
    </div>
  ),
};

/* ── Image thumbnails + selection ─────────────────────────────────────────── */

export const ImageThumbnails = {
  name: "Image column + bulk delete",
  render: () => {
    const photo = (id) => `https://images.unsplash.com/photo-${id}?w=96&h=96&q=70&auto=format&fit=crop`;
    const [rows, setRows] = useState([
      { id: "1", thumb: { src: photo("1518770660439-4636190af475"), alt: "Circuit" }, name: "circuit-board", size: "182 KB" },
      { id: "2", thumb: { src: photo("1506744038136-46273834b3fb"), alt: "Landscape" }, name: "mountain-lake", size: "240 KB" },
      { id: "3", thumb: { src: "", alt: "" }, name: "missing-source", size: "—" },
    ]);
    return (
      <DataTable
        columns={[
          { key: "thumb", label: "", type: "image", width: "3.5rem" },
          { key: "name", label: "Name", sortable: true },
          { key: "size", label: "Size", align: "end" },
        ]}
        rows={rows}
        size="compact"
        selectable
        getRowId={(row) => row.id}
        onDeleteSelected={(_rows, ids) => setRows((r) => r.filter((row) => !ids.includes(row.id)))}
      />
    );
  },
};
