import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Dialog",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Dialog",
  "Tokens for the Dialog (modal) component — padding, radius, border, and shadow.",
  (k) => k.startsWith("--component-dialog-")
);
