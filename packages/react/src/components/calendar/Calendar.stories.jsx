import { useState } from "react";
import { Calendar } from "./Calendar.jsx";

const meta = {
  title: "Components/Data/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    highlightToday: true,
    dimPast: true,
    monthsToShow: 13,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["scroll", "paginated"],
      description: "Display mode: vertical scroll through months, or single-month with prev/next navigation.",
    },
    highlightToday: {
      control: "boolean",
      description: "Highlight today's date with the action colour.",
    },
    dimPast: {
      control: "boolean",
      description: "Apply a background tint to dates before today.",
    },
    todayButton: {
      control: "boolean",
      description: "Show a Today button in the paginated nav that jumps to the current month. Only applies to variant=\"paginated\".",
    },
    monthsToShow: {
      control: { type: "number", min: 1, max: 36 },
      description: "Total number of months to render. Applies to scroll variant only.",
    },
    initialMonth: {
      control: false,
      description: "Starting month. Accepts a Date or { year, month }.",
    },
    selectedDate:        { control: false },
    defaultSelectedDate: { control: false },
    onChange:            { control: false },
    minDate:             { control: false },
    maxDate:             { control: false },
  },
};

const LABEL = {
  fontFamily: "var(--component-paragraph-font-family)",
  fontSize: "var(--semantic-font-size-body-xs)",
  fontWeight: 600,
  color: "var(--semantic-color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "var(--base-spacing-12)",
};

export default meta;

export const Default = {};

export const Paginated = {
  name: "Paginated (single month)",
  args: { variant: "paginated" },
};

export const PaginatedWithToday = {
  name: "Paginated — with Today button",
  args: { variant: "paginated", todayButton: true },
};

export const PaginatedNarrow = {
  name: "Paginated — narrow container (< 480px)",
  args: { variant: "paginated" },
  render: (args) => (
    <div style={{ width: "400px" }}>
      <Calendar {...args} />
    </div>
  ),
};

export const NoHighlightNoFade = {
  name: "No highlight, no fade",
  args: { highlightToday: false, dimPast: false },
};

export const HighlightOnly = {
  name: "Highlight today only",
  args: { highlightToday: true, dimPast: false },
};

export const SpecificMonth = {
  name: "Specific initial month",
  args: { initialMonth: { year: 2025, month: 1 }, monthsToShow: 3 },
};

export const Narrow = {
  name: "Narrow container (< 480px)",
  args: { monthsToShow: 3 },
  render: (args) => (
    <div style={{ width: "400px" }}>
      <Calendar {...args} />
    </div>
  ),
};

export const VeryNarrow = {
  name: "Very narrow container (< 320px)",
  args: { monthsToShow: 3 },
  render: (args) => (
    <div style={{ width: "280px" }}>
      <Calendar {...args} />
    </div>
  ),
};

export const FewMonths = {
  name: "Three months only",
  args: { monthsToShow: 3 },
};

/* ── Selected date ────────────────────────────────────────────────────────── */

function SelectedDateDemo() {
  const today = new Date();
  const init  = new Date(today.getFullYear(), today.getMonth(), 15);
  const [selected, setSelected] = useState(init);

  const fmt = (d) => d
    ? d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "None";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
      <p style={{ ...LABEL, marginBottom: 0 }}>Selected: {fmt(selected)}</p>
      <Calendar
        variant="paginated"
        selectable
        selectedDate={selected}
        onChange={setSelected}
        todayButton
      />
    </div>
  );
}

export const SelectedDate = {
  name: "Selected date",
  parameters: { controls: { include: [] } },
  render: () => <SelectedDateDemo />,
};

/* ── Date range ───────────────────────────────────────────────────────────── */

function DateRangeDemo() {
  const now     = new Date();
  const year    = now.getFullYear();
  const minDate = new Date(year, 5, 1);              // June 1 this year
  const maxDate = new Date(year + 1, 6, 31);         // July 31 next year
  const [selected, setSelected] = useState(null);

  const fmt = (d) => d
    ? d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "None";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
      <p style={{ ...LABEL, marginBottom: 0 }}>
        Range: {fmt(minDate)} – {fmt(maxDate)}&nbsp;&nbsp;·&nbsp;&nbsp;Selected: {fmt(selected)}
      </p>
      <Calendar
        variant="paginated"
        selectable
        selectedDate={selected}
        onChange={setSelected}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );
}

export const DateRange = {
  name: "Date range (min / max)",
  parameters: { controls: { include: [] } },
  render: () => <DateRangeDemo />,
};
