import { useRef, useState } from "react";
import { userEvent, waitFor, within } from "storybook/test";
import { Button } from "../button/Button.jsx";
import { Card } from "../card/Card.jsx";
import { Heading } from "../heading/Heading.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Menu, MenuItem, MenuSection } from "./Menu.jsx";

const meta = {
  title: "Components/Navigation/Menu",
  component: Menu,
  subcomponents: { MenuSection, MenuItem },
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;

function MenuTrigger({ children, label = "Open menu" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        icon="more_vert"
        iconPosition="end"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {label}
      </Button>
      <Menu open={open} onClose={() => setOpen(false)} aria-label={label}>
        {children({ close: () => setOpen(false) })}
      </Menu>
    </>
  );
}

export const AccountMenu = {
  name: "Account menu",
  render: () => (
    <MenuTrigger label="Open account menu">
      {({ close }) => (
        <>
          <MenuSection label="Account">
            <MenuItem icon="person" onClick={close}>Profile</MenuItem>
            <MenuItem icon="tune" onClick={close}>Preferences</MenuItem>
            <MenuItem icon="keyboard" shortcut="⌘K" onClick={close}>Command palette</MenuItem>
          </MenuSection>
          <MenuSection label="Workspace">
            <MenuItem icon="group" onClick={close}>Team settings</MenuItem>
            <MenuItem icon="credit_card" onClick={close}>Billing</MenuItem>
            <MenuItem icon="help" disabled>Help center</MenuItem>
          </MenuSection>
          <MenuSection>
            <MenuItem icon="logout" variant="destructive" onClick={close}>Sign out</MenuItem>
          </MenuSection>
        </>
      )}
    </MenuTrigger>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open account menu/i }));
    await waitFor(() => within(document.body).getByRole("dialog", { name: /open account menu/i }));
  },
};

export const Sections = {
  render: () => (
    <MenuTrigger label="Open sectioned menu">
      {({ close }) => (
        <>
          <MenuSection label="Create">
            <MenuItem icon="add" onClick={close}>New project</MenuItem>
            <MenuItem icon="upload" onClick={close}>Import file</MenuItem>
          </MenuSection>
          <MenuSection label="Manage">
            <MenuItem icon="edit" shortcut="E" onClick={close}>Rename</MenuItem>
            <MenuItem icon="content_copy" shortcut="D" onClick={close}>Duplicate</MenuItem>
            <MenuItem icon="archive" onClick={close}>Archive</MenuItem>
          </MenuSection>
        </>
      )}
    </MenuTrigger>
  ),
};

export const ItemStates = {
  name: "Item states",
  render: () => (
    <MenuTrigger label="Open item states menu">
      {({ close }) => (
        <>
          <MenuSection label="Default">
            <MenuItem icon="visibility" onClick={close}>Preview</MenuItem>
            <MenuItem icon="open_in_new" href="https://example.com">Open external link</MenuItem>
            <MenuItem icon="keyboard" shortcut="⌘/" onClick={close}>Show shortcuts</MenuItem>
          </MenuSection>
          <MenuSection label="Unavailable">
            <MenuItem icon="lock" disabled>Locked option</MenuItem>
          </MenuSection>
          <MenuSection label="Danger zone">
            <MenuItem icon="delete" variant="destructive" onClick={close}>Delete project</MenuItem>
          </MenuSection>
        </>
      )}
    </MenuTrigger>
  ),
};

export const WithIntroText = {
  name: "With nearby content",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", maxWidth: "520px" }}>
      <Paragraph color="muted">
        Menus expose contextual actions without moving the user away from the current surface.
        Use clear item labels and reserve destructive actions for the final section.
      </Paragraph>
      <MenuTrigger label="Open actions">
        {({ close }) => (
          <>
            <MenuSection>
              <MenuItem icon="edit" onClick={close}>Edit details</MenuItem>
              <MenuItem icon="share" onClick={close}>Share</MenuItem>
              <MenuItem icon="download" onClick={close}>Download</MenuItem>
            </MenuSection>
            <MenuSection>
              <MenuItem icon="delete" variant="destructive" onClick={close}>Delete</MenuItem>
            </MenuSection>
          </>
        )}
      </MenuTrigger>
    </div>
  ),
};

// ─── Viewport alignment test ──────────────────────────────────────────────────

const LOREM = "Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.";

export const ViewportAlignment = {
  name: "Viewport alignment",
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: "640px" }}>
      <Paragraph color="muted">{LOREM} {LOREM}</Paragraph>
      <Paragraph color="muted">{LOREM} {LOREM}</Paragraph>
      <Paragraph color="muted">{LOREM}</Paragraph>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <MenuTrigger label="Open menu">
          {({ close }) => (
            <>
              <MenuSection label="Actions">
                <MenuItem icon="edit" shortcut="E" onClick={close}>Rename</MenuItem>
                <MenuItem icon="content_copy" shortcut="D" onClick={close}>Duplicate</MenuItem>
                <MenuItem icon="share" onClick={close}>Share</MenuItem>
                <MenuItem icon="download" onClick={close}>Download</MenuItem>
                <MenuItem icon="archive" onClick={close}>Archive</MenuItem>
              </MenuSection>
              <MenuSection>
                <MenuItem icon="delete" variant="destructive" onClick={close}>Delete</MenuItem>
              </MenuSection>
            </>
          )}
        </MenuTrigger>
      </div>

      <Paragraph color="muted">{LOREM}</Paragraph>
      <Paragraph color="muted">{LOREM} {LOREM}</Paragraph>
      <Paragraph color="muted">{LOREM} {LOREM}</Paragraph>
      <Paragraph color="muted">{LOREM}</Paragraph>
      <Paragraph color="muted">{LOREM} {LOREM}</Paragraph>
    </div>
  ),
};

// ─── Card with context menu ───────────────────────────────────────────────────

function CardMenu({ title, description }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  return (
    <Card style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--base-spacing-8)" }}>
        <Heading as="h3" size="sm">{title}</Heading>
        <div ref={anchorRef} style={{ flexShrink: 0, marginTop: "-4px", marginRight: "-4px" }}>
          <IconButton
            icon="more_vert"
            label="More options"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          />
          <Menu open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} aria-label="Card options">
            <MenuSection>
              <MenuItem icon="edit" onClick={() => setOpen(false)}>Edit</MenuItem>
              <MenuItem icon="open_in_new" onClick={() => setOpen(false)}>Open in full view</MenuItem>
              <MenuItem icon="content_copy" onClick={() => setOpen(false)}>Duplicate</MenuItem>
            </MenuSection>
            <MenuSection>
              <MenuItem icon="delete" variant="destructive" onClick={() => setOpen(false)}>Delete</MenuItem>
            </MenuSection>
          </Menu>
        </div>
      </div>
      <Paragraph size="sm" color="muted" style={{ marginTop: "var(--base-spacing-8)" }}>{description}</Paragraph>
    </Card>
  );
}

export const CardContextMenu = {
  name: "Card context menu",
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--base-spacing-16)", maxWidth: "860px" }}>
      <CardMenu
        title="Q3 Brand Refresh"
        description="Update the color palette and typographic scale across all marketing surfaces."
      />
      <CardMenu
        title="Component Audit"
        description="Review all 48 components for accessibility compliance against WCAG 2.1 AA."
      />
      <CardMenu
        title="Token Migration"
        description="Move legacy hardcoded values to semantic design tokens before the v2 release."
      />
      <CardMenu
        title="Dark Mode QA"
        description="Test every screen in the Heritage and Accessible themes under dark mode conditions."
      />
    </div>
  ),
};
