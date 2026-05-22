import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Base Radius",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Base Radius",
  "Border-radius scale for corners — from sharp control inputs to fully-rounded pills.",
  (k) => k.startsWith("--base-radius-")
);
