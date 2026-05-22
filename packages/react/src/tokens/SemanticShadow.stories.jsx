import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Semantic Shadow",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Semantic Shadow",
  "Elevation shadows — use these to communicate depth and hierarchy between surfaces.",
  (k) => k.startsWith("--semantic-shadow-")
);
