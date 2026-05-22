import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Base Breakpoints",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Base Breakpoints",
  "Viewport breakpoint boundary values. Use --breakpoint-* CSS custom properties in JavaScript; use the @custom-media names from build/css/breakpoints.css in CSS (requires postcss-custom-media).",
  (k) => k.startsWith("--breakpoint-")
);
