import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Icon Button",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Icon Button",
  "Tokens for the Icon Button component — size, icon size, radius, and focus ring.",
  (k) => k.startsWith("--component-icon-button-")
);
