import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Segmented Control",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Segmented Control",
  "Tokens for the Segmented Control component — track, segment padding, and selected state.",
  (k) => k.startsWith("--component-segmented-")
);
