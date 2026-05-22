import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Tab",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Tab",
  "Tokens for the Tabs component — padding, indicator, and active state.",
  (k) => k.startsWith("--component-tab-")
);
