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
  },
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
