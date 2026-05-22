import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Notification",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Notification",
  "Tokens for the Notification component — size, dot, ring, and typography.",
  (k) => k.startsWith("--component-notification-")
);
