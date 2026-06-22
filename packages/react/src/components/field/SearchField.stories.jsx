import { SearchField } from "./SearchField.jsx";

const LABEL_STYLE = {
  fontFamily: "var(--component-paragraph-font-family)",
  fontSize: "var(--semantic-font-size-body-xs)",
  fontWeight: 600,
  color: "var(--semantic-color-text-muted)",
  letterSpacing: "0.04em",
  marginBottom: "var(--base-spacing-12)",
};

const meta = {
  title: "Components/Forms/Search Field",
  component: SearchField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Search",
    size: "default",
    disabled: false,
    required: false,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["comfortable", "default", "compact"] },
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    clearLabel: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    onSearch: { action: "search" },
    onClear: { action: "clear" },
  },
};

export default meta;

export const Configurable = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <SearchField {...args} />
    </div>
  ),
};

/* ── Basic — empty vs. with a value (clear button appears) ───────────────────── */

export const Basic = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", maxWidth: 360 }}>
      <div>
        <p style={LABEL_STYLE}>Empty — leading search icon only</p>
        <SearchField label="Search" hint="Type to search; press Enter to submit." />
      </div>
      <div>
        <p style={LABEL_STYLE}>With a value — trailing clear button shows</p>
        <SearchField label="Search" defaultValue="navigation" />
      </div>
    </div>
  ),
};

/* ── No visible label — a compact search bar (icon carries the meaning) ───────── */

export const LabelHidden = {
  name: "No visible label (aria-label)",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <SearchField aria-label="Search the backlog" size="compact" defaultValue="A1-187" />
    </div>
  ),
};

/* ── Sizes ───────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: 360 }}>
      <div>
        <p style={LABEL_STYLE}>Comfortable</p>
        <SearchField size="comfortable" label="Search" defaultValue="menu" />
      </div>
      <div>
        <p style={LABEL_STYLE}>Default</p>
        <SearchField size="default" label="Search" defaultValue="menu" />
      </div>
      <div>
        <p style={LABEL_STYLE}>Compact</p>
        <SearchField size="compact" label="Search" defaultValue="menu" />
      </div>
    </div>
  ),
};

/* ── States ──────────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: 400 }}>
      <SearchField {...args} label="Default" hint="Search by keyword or A1 number." />
      <SearchField {...args} label="With a value" defaultValue="slider" hint="Clear button appears on the right." />
      <SearchField {...args} label="Error" defaultValue="???" error="No results — try a different term." />
      <SearchField {...args} label="Disabled" defaultValue="archived" disabled />
    </div>
  ),
};
