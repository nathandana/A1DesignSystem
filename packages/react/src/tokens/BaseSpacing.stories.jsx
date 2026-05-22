import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Base Spacing",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Base Spacing",
  "Numeric spacing scale — pixel-value steps from 1px to 128px. Reference these in component tokens, not directly in component CSS.",
  (k) => k.startsWith("--base-spacing-")
);
