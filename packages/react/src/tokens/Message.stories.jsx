import { tokenPage } from "./_shared.jsx";

export default {
  title: "Foundations/Tokens/Message",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = tokenPage(
  "Message",
  "Tokens for the Message family — Banner, Label (inline status chip), and Empty State.",
  (k) => k.startsWith("--component-message-")
);
