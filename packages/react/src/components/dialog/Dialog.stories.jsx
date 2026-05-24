import { useState } from "react";
import { userEvent, within, waitFor } from "storybook/test";
import { Dialog } from "./Dialog.jsx";
import { Button } from "../button/Button.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

const meta = {
  title: "Components/Containers/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" }
};

export default meta;

export const Default = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Dialog title">
          <Paragraph color="muted">
            This is the dialog body. Use it to present focused content or collect input without
            navigating away from the current page.
          </Paragraph>
        </Dialog>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open dialog/i }));
    await waitFor(() => within(document.body).getByRole("dialog"));
  },
};

export const WithFooter = {
  name: "With footer actions",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm action"
          footer={
            <>
              <Button variant="tertiary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
            </>
          }
        >
          <Paragraph color="muted">
            Are you sure you want to continue? This action cannot be undone.
          </Paragraph>
        </Dialog>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open dialog/i }));
    await waitFor(() => within(document.body).getByRole("dialog"));
  },
};

export const WithRichContent = {
  name: "With rich content",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Project details"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Discard</Button>
              <Button variant="primary" icon="save" onClick={() => setOpen(false)}>Save changes</Button>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
            <Heading as="h3" type="heading" size="xs">Overview</Heading>
            <Paragraph color="muted" size="sm">
              Provide a short description of what this project covers, who it is intended for,
              and any key constraints or deadlines the team should be aware of.
            </Paragraph>
            <Heading as="h3" type="heading" size="xs">Notes</Heading>
            <Paragraph color="muted" size="sm">
              Add any additional context here. This section is optional but helpful for
              onboarding new collaborators.
            </Paragraph>
          </div>
        </Dialog>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open dialog/i }));
    await waitFor(() => within(document.body).getByRole("dialog"));
  },
};
