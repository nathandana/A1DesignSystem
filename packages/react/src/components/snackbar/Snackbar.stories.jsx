import { useState } from "react";
import { Button } from "../button/Button.jsx";
import { Snackbar } from "./Snackbar.jsx";

export default {
  title: "Components/Messaging/Snackbar",
  component: Snackbar,
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "success", "info", "warn", "error"],
    },
    position: {
      control: "select",
      options: ["bottom", "bottom-left", "bottom-right", "top", "top-left", "top-right"],
    },
    actionLabel: { control: "text" },
    children: { control: "text" },
  },
};

export const Configurable = {
  args: {
    open: true,
    children: "Guide deleted.",
    actionLabel: "Undo",
    variant: "default",
    position: "bottom",
  },
  render: (args) => (
    <div style={{ minHeight: 120 }}>
      <Snackbar {...args} onAction={() => {}} onClose={() => {}} />
    </div>
  ),
};

export const Demo = {
  name: "Live demo",
  parameters: { controls: { include: [] } },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", alignItems: "flex-start", minHeight: 200 }}>
        <Button variant="primary" onClick={() => setOpen(true)} disabled={open}>
          Delete guide
        </Button>
        <Snackbar
          open={open}
          actionLabel="Undo"
          onAction={() => setOpen(false)}
          onClose={() => setOpen(false)}
        >
          Guide deleted.
        </Snackbar>
      </div>
    );
  },
};

export const Variants = {
  name: "Variants",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)", maxWidth: 420 }}>
      {["default", "success", "info", "warn", "error"].map((variant) => (
        <Snackbar
          key={variant}
          open
          variant={variant}
          position="bottom-left"
          style={{ position: "static", width: "100%", transform: "none" }}
          onClose={() => {}}
        >
          {variant.charAt(0).toUpperCase() + variant.slice(1)} message content
        </Snackbar>
      ))}
    </div>
  ),
};
