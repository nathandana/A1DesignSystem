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
              <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
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

export const LongContent = {
  name: "Long content (scroll)",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Terms of Service"
          footer={
            <>
              <Button variant="primary" onClick={() => setOpen(false)}>Accept</Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>Decline</Button>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
            {[
              { heading: "1. Introduction", body: "Welcome to our platform. By accessing or using our services, you agree to be bound by these Terms of Service. Please read them carefully before proceeding. If you do not agree to these terms, you may not use our services." },
              { heading: "2. Definitions", body: "In these Terms, \"Service\" refers to the platform and all associated products, features, and functionality. \"User\" means any individual or entity that accesses the Service. \"Content\" means any text, images, data, or other material submitted through the Service." },
              { heading: "3. Account Registration", body: "To access certain features you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized use." },
              { heading: "4. Acceptable Use", body: "You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service. You may not attempt to gain unauthorized access to any part of the Service or any system connected to it." },
              { heading: "5. Intellectual Property", body: "All content and materials available through the Service, including but not limited to text, graphics, logos, and software, are the property of the company and are protected by applicable intellectual property laws." },
              { heading: "6. Privacy", body: "Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to the collection and use of your information as described in the Privacy Policy." },
              { heading: "7. Termination", body: "We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. Upon termination, all licenses granted to you under these Terms will immediately cease." },
              { heading: "8. Limitation of Liability", body: "To the maximum extent permitted by applicable law, the company shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service." },
            ].map(({ heading, body }) => (
              <div key={heading}>
                <Heading as="h3" type="heading" size="xs" style={{ marginBottom: "var(--base-spacing-8)" }}>{heading}</Heading>
                <Paragraph color="muted" size="sm">{body}</Paragraph>
              </div>
            ))}
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
              <Button variant="primary" icon="save" onClick={() => setOpen(false)}>Save changes</Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>Discard</Button>
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
