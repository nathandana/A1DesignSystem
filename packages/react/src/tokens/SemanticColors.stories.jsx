import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Semantic Colors",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Semantic Colors",
  "Intent-mapped colors — use these in components and product UI, never the base ramps directly. Values change per theme.",
  (k) => k.startsWith("--semantic-color-")
);
