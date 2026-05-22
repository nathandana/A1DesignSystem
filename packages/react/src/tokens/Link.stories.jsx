import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Link",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Link",
  "Tokens for the Link component — color, underline, and hover states.",
  (k) => k.startsWith("--component-link-")
);
