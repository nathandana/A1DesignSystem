import { useMemo, useState } from "react";
import { Banner } from "../banner/Banner.jsx";
import { Code } from "../code/Code.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Section } from "../section/Section.jsx";
import { Stack } from "../stack/Stack.jsx";
import { DataGrid, SelectColumn, textEditor } from "./DataGrid.jsx";

/**
 * EXPERIMENTAL — react-data-grid (Comcast) wrapped + themed with A1 tokens.
 * Storybook-only while we evaluate it as the editable *data editor* for the
 * page-data / data-binding feature (A1-94). Not exported from the package index
 * and not in the a1-web configurator.
 */
export default {
  title: "Components/DataGrid (experimental)",
  component: DataGrid,
  parameters: { layout: "padded" },
};

// ── Shared dataset ────────────────────────────────────────────────────────────

const SEED_ROWS = [
  { id: 1, name: "Ada Lovelace",     email: "ada@example.com",   role: "Engineer", team: "Platform",  active: true  },
  { id: 2, name: "Alan Turing",      email: "alan@example.com",  role: "Engineer", team: "Research",  active: true  },
  { id: 3, name: "Grace Hopper",     email: "grace@example.com", role: "Lead",     team: "Compilers", active: true  },
  { id: 4, name: "Katherine Johnson",email: "kj@example.com",    role: "Analyst",  team: "Flight",    active: false },
  { id: 5, name: "Hedy Lamarr",      email: "hedy@example.com",  role: "Inventor", team: "Research",  active: true  },
  { id: 6, name: "Margaret Hamilton",email: "mh@example.com",    role: "Lead",     team: "Apollo",    active: true  },
];

const rowKeyGetter = (row) => row.id;

// ── Editable (primary) ────────────────────────────────────────────────────────

/**
 * The core test: every text column is editable (double-click or press Enter on a
 * cell). Edits flow through `onRowsChange`; the live JSON below proves the data
 * model updates — exactly what the data editor needs.
 */
export const Editable = {
  render: () => {
    const [rows, setRows] = useState(SEED_ROWS);

    const columns = useMemo(
      () => [
        { key: "id",    name: "ID",    width: 64, frozen: true, resizable: false },
        { key: "name",  name: "Name",  renderEditCell: textEditor },
        { key: "email", name: "Email", renderEditCell: textEditor },
        { key: "role",  name: "Role",  renderEditCell: textEditor },
        { key: "team",  name: "Team",  renderEditCell: textEditor },
      ],
      [],
    );

    return (
      <Section padding="lg" contentWidth="lg">
        <Stack direction="column" gap="md">
          <Stack direction="column" gap="xs">
            <Heading as="h2" size="lg">Editable data grid</Heading>
            <Paragraph color="muted">
              Double-click any cell (or select it and start typing) to edit. The JSON
              below reflects the live data model.
            </Paragraph>
          </Stack>

          <DataGrid
            columns={columns}
            rows={rows}
            rowKeyGetter={rowKeyGetter}
            onRowsChange={setRows}
            defaultColumnOptions={{ resizable: true }}
          />

          <Code variant="block" wrapping>{JSON.stringify(rows, null, 2)}</Code>
        </Stack>
      </Section>
    );
  },
};

// ── Row selection ─────────────────────────────────────────────────────────────

/** `SelectColumn` adds checkbox selection; selected rows tint with the action surface. */
export const RowSelection = {
  render: () => {
    const [rows, setRows] = useState(SEED_ROWS);
    const [selected, setSelected] = useState(() => new Set([2, 3]));

    const columns = useMemo(
      () => [
        SelectColumn,
        { key: "name",  name: "Name",  renderEditCell: textEditor },
        { key: "email", name: "Email", renderEditCell: textEditor },
        { key: "role",  name: "Role" },
        { key: "team",  name: "Team" },
      ],
      [],
    );

    return (
      <Section padding="lg" contentWidth="lg">
        <Stack direction="column" gap="md">
          <Heading as="h2" size="lg">Row selection</Heading>
          <Banner status="info">
            {selected.size} of {rows.length} rows selected.
          </Banner>
          <DataGrid
            columns={columns}
            rows={rows}
            rowKeyGetter={rowKeyGetter}
            onRowsChange={setRows}
            selectedRows={selected}
            onSelectedRowsChange={setSelected}
          />
        </Stack>
      </Section>
    );
  },
};

// ── Sortable + resizable ──────────────────────────────────────────────────────

/** Columns sort (click the header) and resize (drag the header edge). */
export const SortableResizable = {
  render: () => {
    const [rows, setRows] = useState(SEED_ROWS);
    const [sortColumns, setSortColumns] = useState([]);

    const columns = useMemo(
      () => [
        { key: "id",    name: "ID",    width: 64 },
        { key: "name",  name: "Name" },
        { key: "email", name: "Email" },
        { key: "role",  name: "Role" },
        { key: "team",  name: "Team" },
      ],
      [],
    );

    const sortedRows = useMemo(() => {
      if (!sortColumns.length) return rows;
      const { columnKey, direction } = sortColumns[0];
      const dir = direction === "ASC" ? 1 : -1;
      return [...rows].sort((a, b) =>
        String(a[columnKey]).localeCompare(String(b[columnKey])) * dir,
      );
    }, [rows, sortColumns]);

    return (
      <Section padding="lg" contentWidth="lg">
        <Stack direction="column" gap="md">
          <Heading as="h2" size="lg">Sortable &amp; resizable</Heading>
          <DataGrid
            columns={columns}
            rows={sortedRows}
            rowKeyGetter={rowKeyGetter}
            onRowsChange={setRows}
            sortColumns={sortColumns}
            onSortColumnsChange={setSortColumns}
            defaultColumnOptions={{ sortable: true, resizable: true }}
          />
        </Stack>
      </Section>
    );
  },
};

// ── Read-only ─────────────────────────────────────────────────────────────────

/** No `renderEditCell` → a presentational, scrollable, virtualized grid. */
export const ReadOnly = {
  render: () => {
    const columns = useMemo(
      () => [
        { key: "id",    name: "ID", width: 64 },
        { key: "name",  name: "Name" },
        { key: "email", name: "Email" },
        { key: "role",  name: "Role" },
        { key: "team",  name: "Team" },
      ],
      [],
    );

    return (
      <Section padding="lg" contentWidth="lg">
        <Stack direction="column" gap="md">
          <Heading as="h2" size="lg">Read-only</Heading>
          <DataGrid columns={columns} rows={SEED_ROWS} rowKeyGetter={rowKeyGetter} />
        </Stack>
      </Section>
    );
  },
};
