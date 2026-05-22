import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Button",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Button",
  "Tokens for the Button component — all variants (primary, secondary, tertiary), sizes, states, and focus ring.",
  (k) => k.startsWith("--component-button-")
);
