import { Grid, GridItem } from "./Grid.jsx";
import { Card } from "../card/Card.jsx";
import { Heading } from "../heading/Heading.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Stack } from "../stack/Stack.jsx";

const meta = {
  title: "Components/Containers/Grid",
  component: Grid,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    columns: { control: "number" },
    gap:     { control: "select", options: ["sm", "md", "lg"] },
    layout:  { control: "select", options: ["default", "bento"] },
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

function BentoCard({ badge, title, body, tone = "neutral" }) {
  return (
    <Card
      shadow="xs"
      style={{
        height: "100%",
        background: tone === "accent"
          ? "var(--semantic-color-action-surface)"
          : "var(--semantic-color-surface-panel)",
      }}
    >
      <Stack gap={12} style={{ height: "100%" }}>
        <MessageBadge subtle status={tone === "accent" ? "info" : "neutral"}>
          {badge}
        </MessageBadge>
        <Heading as="h3" size="sm">{title}</Heading>
        <Paragraph size="sm" color="muted">{body}</Paragraph>
      </Stack>
    </Card>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Configurable = {
  args: { columns: 3, gap: "md" },
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
          <Grid columns={cols} gap="sm">
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
      <Grid columns={12} gap="sm">
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
      <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="md">
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
      {["sm", "md", "lg"].map(g => (
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

export const BentoGrid = {
  name: "Bento grid",
  render: () => (
    <div>
      <Heading as="h2" size="xs" style={{ marginBottom: "var(--base-spacing-4)" }}>
        Bento grid
      </Heading>
      <Paragraph size="sm" color="muted" style={{ marginBottom: "var(--base-spacing-16)" }}>
        Use layout="bento" with responsive column and row spans for editorial dashboards,
        feature summaries, or mixed-density landing sections.
      </Paragraph>
      <Grid
        layout="bento"
        columns={{ xs: 1, md: 6, lg: 12 }}
        gap="md"
        autoRows="minmax(120px, auto)"
      >
        <GridItem span={{ xs: 1, md: 6, lg: 6 }} rowSpan={{ xs: 1, md: 2 }}>
          <BentoCard
            badge="Overview"
            title="Primary feature area"
            body="A larger tile can hold summary content, metrics, or a preview without leaving the grid system."
            tone="accent"
          />
        </GridItem>
        <GridItem span={{ xs: 1, md: 3, lg: 3 }}>
          <BentoCard
            badge="Status"
            title="Compact tile"
            body="Short cards stay aligned with the same row rhythm."
          />
        </GridItem>
        <GridItem span={{ xs: 1, md: 3, lg: 3 }}>
          <BentoCard
            badge="Activity"
            title="Secondary tile"
            body="Dense placement fills open cells as content varies."
          />
        </GridItem>
        <GridItem span={{ xs: 1, md: 3, lg: 4 }}>
          <BentoCard
            badge="Insight"
            title="Wide supporting tile"
            body="Use medium spans to create visual variety without custom CSS."
          />
        </GridItem>
        <GridItem span={{ xs: 1, md: 3, lg: 4 }}>
          <BentoCard
            badge="Workflow"
            title="Balanced tile"
            body="Responsive spans keep the pattern usable on smaller screens."
          />
        </GridItem>
        <GridItem span={{ xs: 1, md: 6, lg: 4 }}>
          <BentoCard
            badge="Detail"
            title="Full-width mobile"
            body="Each item collapses to one column on xs viewports."
          />
        </GridItem>
      </Grid>
    </div>
  ),
};
