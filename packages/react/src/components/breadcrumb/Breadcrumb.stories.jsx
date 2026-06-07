import { userEvent, within, waitFor } from "storybook/test";
import { Breadcrumb } from "./Breadcrumb.jsx";

const meta = {
  title: "Components/Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Components", href: "#" },
      { label: "Breadcrumb" },
    ],
    backLabel: "Back",
  },
  argTypes: {
    items: {
      control: "object",
      description:
        "Ordered list of breadcrumb items. The last item is the current page (non-interactive). Earlier items render as links when `href` is provided, or as buttons when `onClick` is provided.",
    },
    backLabel: {
      control: "text",
      description: "Label for the back link shown in narrow containers.",
    },
  },
};

export default meta;

export const Configurable = {};

export const TwoLevels = {
  name: "Two levels",
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Documentation" },
    ],
  },
};

export const ThreeLevels = {
  name: "Three levels",
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Components", href: "#" },
      { label: "Breadcrumb" },
    ],
  },
};

export const FourLevels = {
  name: "Four levels",
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Design system", href: "#" },
      { label: "Components", href: "#" },
      { label: "Navigation" },
    ],
  },
};

export const ButtonItems = {
  name: "Button items (onClick)",
  args: {
    items: [
      { label: "Home", onClick: () => {} },
      { label: "Settings", onClick: () => {} },
      { label: "Profile" },
    ],
  },
};

export const SingleItem = {
  name: "Single item",
  args: {
    items: [{ label: "Home" }],
  },
};

export const NarrowContainer = {
  name: "Narrow container (back link)",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "320px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Components", href: "#" },
      { label: "Breadcrumb" },
    ],
  },
};

// ─── Accessibility stories ────────────────────────────────────────────────────

export const A11yStructure = {
  name: "[A11y] Semantic structure",
  tags: ["a11y", "a11y-required"],
  parameters: { layout: "padded" },
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Design System", href: "#" },
      { label: "Navigation", href: "#" },
      { label: "Breadcrumb" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify landmark exists
    await waitFor(() => {
      const nav = canvas.getByRole("navigation", { name: "Breadcrumb" });
      if (!nav) throw new Error("Navigation landmark not found");
    });
    // Verify current page item
    await waitFor(() => {
      const current = canvasElement.querySelector("[aria-current='page']");
      if (!current) throw new Error("No aria-current=page found");
      if (current.tagName !== "SPAN") throw new Error("Current item should be a non-interactive span");
    });
  },
};

export const A11yHighContrast = {
  name: "[A11y] High contrast theme",
  tags: ["a11y", "a11y-theme"],
  globals: { theme: "a1Accessible" },
  parameters: { layout: "padded" },
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Components", href: "#" },
      { label: "Breadcrumb" },
    ],
  },
};

// Negative example — missing aria-current on current page item
export const A11yCurrentPageMissing = {
  name: "[A11y] ⚠ No aria-current (negative example)",
  tags: ["a11y", "a11y-negative-example"],
  parameters: { layout: "padded" },
  render: () => (
    <nav aria-label="Breadcrumb">
      <ol style={{ display: "flex", gap: "8px", listStyle: "none", padding: 0, margin: 0 }}>
        <li><a href="#">Home</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="#">Components</a></li>
        <li aria-hidden="true">/</li>
        {/* Missing aria-current="page" — screen readers treat this as a link, not the current page */}
        <li><a href="#">Breadcrumb</a></li>
      </ol>
    </nav>
  ),
};
