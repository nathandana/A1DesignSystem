import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Semantic Typography",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Semantic Typography",
  "Shared font and radius scale tokens — font sizes, line heights, weights, and border-radius values used across semantic layers.",
  (k) => k.startsWith("--semantic-font-") || k.startsWith("--semantic-radius-")
);
