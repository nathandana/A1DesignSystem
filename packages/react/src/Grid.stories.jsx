import { Grid, GridItem } from "./Grid.jsx";
import { Heading } from "./Heading.jsx";
import { Paragraph } from "./Paragraph.jsx";

const meta = {
  title: "Components/Containers/Grid",
  component: Grid,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    columns: { control: "number" },
    gap:     { control: "select", options: [4, 8, 12, 16, 20, 24, 32] },
  },
};

export default meta;

// ─── Demo cell ────────────────────────────────────────────────────────────────

function Cell({ label, height = 64 }) {
  return (
    <div style={{
      height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--semantic-color-action-surface)",
      border: "1px solid var(--semantic-color-action-border)",
      borderRadius: "var(--base-radius-control)",
    }}>
      <Paragraph size="xs" style={{ fontWeight: "var(--base-font-weight-semibold)", color: "var(--semantic-color-action-background)" }}>
        {label}
      </Paragraph>
    </div>
  );
}

// ─── Section label used above each demo block ─────────────────────────────────

function Label({ children }) {
  return (
    <Paragraph size="xs" color="muted" style={{ marginBottom: "var(--base-spacing-8)" }}>
      {children}
    </Paragraph>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Configurable = {
  args: { columns: 3, gap: 16 },
  render: ({ columns, gap }) => (
    <Grid columns={columns} gap={gap}>
      {Array.from({ length: columns * 2 }, (_, i) => (
        <Cell key={i} label={`Item ${i + 1}`} />
      ))}
    </Grid>
  ),
};

export const ColumnCounts = {
  name: "Column Counts",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)" }}>
      {[1, 2, 3, 4, 6, 12].map(cols => (
        <div key={cols}>
          <Label>columns={cols}</Label>
          <Grid columns={cols} gap={8}>
            {Array.from({ length: cols }, (_, i) => (
              <Cell key={i} label={String(i + 1)} height={48} />
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
};

export const SpanItems = {
  name: "Span Items",
  render: () => (
    <div>
      <Heading as="h2" size="xs" style={{ marginBottom: "var(--base-spacing-16)" }}>
        12-column grid with varying spans
      </Heading>
      <Grid columns={12} gap={8}>
        <GridItem span={12}><Cell label="span 12" /></GridItem>
        <GridItem span={6}><Cell label="span 6" /></GridItem>
        <GridItem span={6}><Cell label="span 6" /></GridItem>
        <GridItem span={4}><Cell label="span 4" /></GridItem>
        <GridItem span={4}><Cell label="span 4" /></GridItem>
        <GridItem span={4}><Cell label="span 4" /></GridItem>
        <GridItem span={3}><Cell label="span 3" /></GridItem>
        <GridItem span={3}><Cell label="span 3" /></GridItem>
        <GridItem span={3}><Cell label="span 3" /></GridItem>
        <GridItem span={3}><Cell label="span 3" /></GridItem>
        <GridItem span="full"><Cell label='span="full"' /></GridItem>
      </Grid>
    </div>
  ),
};

export const Responsive = {
  name: "Responsive Columns",
  render: () => (
    <div>
      <Heading as="h2" size="xs" style={{ marginBottom: "var(--base-spacing-4)" }}>
        Responsive columns
      </Heading>
      <Paragraph size="sm" color="muted" style={{ marginBottom: "var(--base-spacing-16)" }}>
        xs:1 → sm:2 → md:3 → lg:4. Resize the preview to see it change.
      </Paragraph>
      <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap={16}>
        {Array.from({ length: 8 }, (_, i) => (
          <Cell key={i} label={`Item ${i + 1}`} height={80} />
        ))}
      </Grid>
    </div>
  ),
};

export const GapScale = {
  name: "Gap Scale",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-40)" }}>
      {[4, 8, 16, 24, 32].map(g => (
        <div key={g}>
          <Label>gap={g}</Label>
          <Grid columns={4} gap={g}>
            {Array.from({ length: 4 }, (_, i) => (
              <Cell key={i} label={String(i + 1)} height={48} />
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
};
