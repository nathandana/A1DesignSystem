import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Base Colors",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Base Colors",
  "Raw color palette — the full 0–1000 scale for each hue. Use semantic color tokens in components, never these directly.",
  (k) => k.startsWith("--base-color-")
);
