import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Card",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Card",
  "Tokens for the Card container component — padding, radius, border, and shadow.",
  (k) => k.startsWith("--component-card-")
);
