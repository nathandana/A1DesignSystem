import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Pagination",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Pagination",
  "Tokens for the Pagination component — item size, gap, and active state.",
  (k) => k.startsWith("--component-pagination-")
);
