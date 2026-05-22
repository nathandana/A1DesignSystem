import { useState } from "react";
import { MessageBanner } from "./Message.jsx";

const STATUSES = ["neutral", "info", "success", "warn", "error"];

const meta = {
  title: "Components/Messaging/Banner",
  component: MessageBanner,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    status: "info",
    title: "Banner title",
    children: "This is the body of the message, providing additional context about what happened.",
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: STATUSES,
    },
    title: { control: "text" },
    children: { control: "text", name: "body" },
    icon: { control: "text", description: "Override the default status icon (Material Symbols name)" },
  },
};

export default meta;

export const Configurable = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    if (!visible) return (
      <button onClick={() => setVisible(true)} style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", cursor: "pointer" }}>
        Show banner
      </button>
    );
    return <MessageBanner {...args} onDismiss={() => setVisible(false)} />;
  },
};

export const Statuses = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
      {STATUSES.map(status => (
        <MessageBanner key={status} status={status} title={`${status.charAt(0).toUpperCase() + status.slice(1)} banner`}>
          This is an example {status} message with some supporting body text.
        </MessageBanner>
      ))}
    </div>
  ),
};

export const TitleOnly = {
  name: "Title only",
  parameters: { controls: { include: ["status", "icon"] } },
  render: (args) => (
    <MessageBanner {...args} title="Your changes have been saved." />
  ),
};

export const BodyOnly = {
  name: "Body only",
  parameters: { controls: { include: ["status", "icon"] } },
  render: (args) => (
    <MessageBanner {...args}>
      Your session will expire in 5 minutes. Save your work to avoid losing changes.
    </MessageBanner>
  ),
};

export const Dismissable = {
  parameters: { controls: { include: ["status", "title", "children"] } },
  render: (args) => {
    const [open, setOpen] = useState(true);
    return open
      ? <MessageBanner {...args} onDismiss={() => setOpen(false)} />
      : <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)" }}>Dismissed.</p>;
  },
};
