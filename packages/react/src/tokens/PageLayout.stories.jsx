import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Page Layout",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Page Layout",
  "Layout tokens for the PageLayout component — sidebar width and zone gap.",
  (k) => k.startsWith("--component-page-layout-")
);
