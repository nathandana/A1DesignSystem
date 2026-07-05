import { useState } from "react";
import { Button } from "../button/Button.jsx";
import { Snackbar, SnackbarStack } from "./Snackbar.jsx";

export default {
  title: "Components/Messaging/Snackbar",
  component: Snackbar,
  parameters: { layout: "padded" },
  argTypes: {
    position: {
      control: "select",
      options: ["bottom", "bottom-left", "bottom-right", "top", "top-left", "top-right"],
    },
    actionLabel: { control: "text" },
    autoHideDuration: { control: "number" },
    dismissible: { control: "boolean" },
    children: { control: "text" },
    stacked: { table: { disable: true } },
  },
};

export const Configurable = {
  args: {
    open: true,
    children: "Guide deleted.",
    actionLabel: "Undo",
    autoHideDuration: 0,
    dismissible: true,
    position: "bottom",
  },
  render: (args) => (
    <div style={{ minHeight: "var(--base-spacing-128)" }}>
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
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", alignItems: "flex-start", minHeight: "var(--base-spacing-192)" }}>
        <Button variant="primary" onClick={() => setOpen(true)} disabled={open}>
          Delete guide
        </Button>
        <Snackbar
          open={open}
          actionLabel="Undo"
          onAction={() => setOpen(false)}
          onClose={() => setOpen(false)}
          autoHideDuration={6000}
        >
          Guide deleted.
        </Snackbar>
      </div>
    );
  },
};

export const Positions = {
  name: "Positions",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)", maxWidth: "var(--component-snackbar-max-width)" }}>
      {["bottom", "bottom-left", "bottom-right", "top", "top-left", "top-right"].map((position) => (
        <Snackbar
          key={position}
          open
          position={position}
          style={{ position: "static", width: "100%", transform: "none" }}
          onClose={() => {}}
        >
          {position.charAt(0).toUpperCase() + position.slice(1).replaceAll("-", " ")} position
        </Snackbar>
      ))}
    </div>
  ),
};

export const Multiple = {
  name: "Multiple snackbars",
  parameters: { controls: { include: [] } },
  render: () => {
    const [items, setItems] = useState([
      { id: "sync", message: "Saved changes.", actionLabel: "Undo" },
      { id: "publish", message: "Published to the team." },
    ]);
    const add = () => {
      const id = Date.now();
      setItems((current) => [
        { id, message: `Queued update ${current.length + 1}.`, actionLabel: "View" },
        ...current,
      ]);
    };
    const dismiss = (id) => setItems((current) => current.filter((item) => item.id !== id));

    return (
      <div style={{ minHeight: "var(--base-spacing-192)" }}>
        <Button variant="primary" onClick={add}>
          Add snackbar
        </Button>
        <SnackbarStack
          position="bottom-right"
          items={items.map((item) => ({
            ...item,
            onAction: () => dismiss(item.id),
            onClose: () => dismiss(item.id),
            autoHideDuration: 7000,
          }))}
        />
      </div>
    );
  },
};
