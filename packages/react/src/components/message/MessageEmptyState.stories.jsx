import { MessageEmptyState } from "./Message.jsx";
import { Button } from "../button/Button.jsx";
import { Card } from "../card/Card.jsx";
import { Dialog } from "../dialog/Dialog.jsx";
import { useState } from "react";

const meta = {
  title: "Components/Messaging/Empty State",
  component: MessageEmptyState,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    icon: "inbox",
    title: "Nothing here yet",
    description: "Content will appear here once it's available.",
    scale: "section",
  },
  argTypes: {
    scale: {
      control: "inline-radio",
      options: ["page", "section", "card"],
    },
    icon:        { control: "text" },
    title:       { control: "text" },
    description: { control: "text" },
  },
};

export default meta;

export const Configurable = {
  render: (args) => (
    <MessageEmptyState
      {...args}
      action={args.scale !== "card" ? <Button variant={args.scale === "page" ? "primary" : "secondary"}>Get started</Button> : undefined}
    />
  ),
};

export const Scales = {
  name: "All scales",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-64)" }}>

      {/* Page */}
      <div>
        <p style={{ margin: "0 0 var(--base-spacing-16)", fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>scale="page"</p>
        <div style={{ border: "1px dashed var(--semantic-color-border-subtle)", borderRadius: "var(--base-radius-lg)" }}>
          <MessageEmptyState
            scale="page"
            icon="folder_open"
            title="No projects yet"
            description="Create your first project to start organising your work and collaborating with your team."
            action={<Button variant="primary" icon="add">New project</Button>}
          />
        </div>
      </div>

      {/* Section */}
      <div>
        <p style={{ margin: "0 0 var(--base-spacing-16)", fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>scale="section"</p>
        <div style={{ border: "1px dashed var(--semantic-color-border-subtle)", borderRadius: "var(--base-radius-lg)" }}>
          <MessageEmptyState
            scale="section"
            icon="notifications_off"
            title="No notifications"
            description="You're all caught up. We'll let you know when something needs your attention."
            action={<Button variant="secondary">Manage preferences</Button>}
          />
        </div>
      </div>

      {/* Card */}
      <div>
        <p style={{ margin: "0 0 var(--base-spacing-16)", fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>scale="card"</p>
        <div style={{ display: "flex", gap: "var(--base-spacing-16)", flexWrap: "wrap" }}>
          <Card style={{ width: "220px" }}>
            <MessageEmptyState
              scale="card"
              icon="bar_chart"
              title="No data yet"
              description="Data will appear once activity is recorded."
            />
          </Card>
          <Card style={{ width: "220px" }}>
            <MessageEmptyState
              scale="card"
              icon="people"
              title="No members"
              description="Invite people to get started."
              action={<Button variant="tertiary" size="sm">Invite</Button>}
            />
          </Card>
        </div>
      </div>

    </div>
  ),
};

export const InDialog = {
  name: "In a dialog",
  parameters: { controls: { include: [] } },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Recent activity">
          <MessageEmptyState
            scale="card"
            icon="history"
            title="No activity"
            description="Actions will appear here as they happen."
          />
        </Dialog>
      </>
    );
  },
};
