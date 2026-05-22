import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Typography",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Typography",
  "Tokens for the Heading and Paragraph components — font family, size, weight, and line-height.",
  (k) => k.startsWith("--component-heading-") || k.startsWith("--component-paragraph-")
);
