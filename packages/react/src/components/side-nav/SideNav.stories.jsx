import { useState } from "react";
import { SideNav, SideNavGroup, SideNavItem } from "./SideNav.jsx";
import { Heading } from "../heading/Heading.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";

const meta = {
  title: "Components/Navigation/SideNav",
  component: SideNav,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    placement: { control: "inline-radio", options: ["start", "end"] },
  },
};

export default meta;

/* ── Slot placeholder components ───────────────────────────────────────── */

function HeaderSlot({ collapsed }) {
  return (
    <Heading as="div" type="heading" size="xs">
      <span style={{ color: "var(--semantic-color-text-default)" }}>A1</span>
      {!collapsed && (
        <>
          <span style={{ color: "var(--semantic-color-text-default)" }}>:</span>
          <span style={{ color: "var(--semantic-color-text-accent)" }}>Design</span>
        </>
      )}
    </Heading>
  );
}

function FooterSlot() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-8)", padding: "var(--base-spacing-8)" }}>
      <div style={{
        width: 32, height: 32,
        borderRadius: "50%",
        background: "var(--semantic-color-text-muted)",
        flexShrink: 0,
      }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--semantic-color-text-default)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          Jane Smith
        </div>
        <div style={{ fontSize: 12, color: "var(--semantic-color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          jane@acme.com
        </div>
      </div>
    </div>
  );
}

function NavItems() {
  return (
    <>
      <SideNavItem href="#" icon="home" label="Dashboard" active />
      <SideNavGroup icon="folder" label="Projects" defaultOpen>
        <SideNavItem href="#" label="All Projects" />
        <SideNavItem href="#" label="Active" />
        <SideNavGroup label="Archived">
          <SideNavItem href="#" label="2024" />
          <SideNavItem href="#" label="2023" />
        </SideNavGroup>
      </SideNavGroup>
      <SideNavGroup icon="people" label="Team">
        <SideNavItem href="#" label="Members" />
        <SideNavItem href="#" label="Roles & Permissions" />
      </SideNavGroup>
      <SideNavItem href="#" icon="bar_chart" label="Analytics" />
      <SideNavItem href="#" icon="settings" label="Settings" />
    </>
  );
}

/* ── App shell used by Responsive and Collapsed stories ─────────────────── */

function AppShell({ navOpen, setNavOpen, children }) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--semantic-color-surface-page)" }}>
      {children}
      <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--base-spacing-8)",
          height: 56,
          padding: "0 var(--base-spacing-16)",
          borderBottom: "1px solid var(--semantic-color-border-subtle)",
          background: "var(--semantic-color-surface-page)",
          flexShrink: 0,
        }}>
          {/* Menu button — shown on xs/sm/md, hidden at lg+ via inline style tag */}
          <IconButton
            icon="menu"
            label="Open navigation"
            className="a1-story-menu-btn"
            onClick={() => setNavOpen?.(true)}
          />
          <span style={{ fontWeight: 600, fontSize: 15, color: "var(--semantic-color-text-default)" }}>
            A1 Design
          </span>
        </header>
        <main style={{ flex: "1 1 0", minHeight: 0, overflow: "auto", padding: "var(--base-spacing-32)" }}>
          <h1 style={{ margin: 0, fontFamily: "var(--semantic-font-family-heading)", fontSize: 24, color: "var(--semantic-color-text-default)" }}>
            Dashboard
          </h1>
          <p style={{ marginTop: "var(--base-spacing-8)", color: "var(--semantic-color-text-muted)", fontSize: 14 }}>
            Main content area.
          </p>
        </main>
      </div>
      <style>{`@media (min-width: 1025px) { .a1-story-menu-btn.a1-icon-button { display: none; } }`}</style>
    </div>
  );
}

/* ── Stories ───────────────────────────────────────────────────────────── */

export const Simple = {
  name: "Simple — Icon & Label",
  render: () => (
    <div style={{ height: "100vh", display: "flex" }}>
      <SideNav>
        <SideNavItem href="#" icon="home" label="Home" active />
        <SideNavItem href="#" icon="inbox" label="Inbox" />
        <SideNavItem href="#" icon="bar_chart" label="Analytics" />
        <SideNavItem href="#" icon="settings" label="Settings" />
      </SideNav>
    </div>
  ),
};

export const Tree = {
  name: "Tree — Expandable Groups",
  render: () => (
    <div style={{ height: "100vh", display: "flex" }}>
      <SideNav>
        <SideNavItem href="#" icon="home" label="Dashboard" active />
        <SideNavGroup icon="folder" label="Projects" defaultOpen>
          <SideNavItem href="#" label="All Projects" />
          <SideNavItem href="#" label="Active" />
          <SideNavGroup label="Archived">
            <SideNavItem href="#" label="2024" />
            <SideNavItem href="#" label="2023" />
            <SideNavGroup label="2022">
              <SideNavItem href="#" label="Q1" />
              <SideNavItem href="#" label="Q2" />
              <SideNavItem href="#" label="Q3" />
              <SideNavItem href="#" label="Q4" />
            </SideNavGroup>
          </SideNavGroup>
        </SideNavGroup>
        <SideNavGroup icon="people" label="Team">
          <SideNavItem href="#" label="Members" />
          <SideNavItem href="#" label="Roles & Permissions" />
          <SideNavItem href="#" label="Invitations" />
        </SideNavGroup>
        <SideNavGroup icon="bar_chart" label="Analytics">
          <SideNavItem href="#" label="Overview" />
          <SideNavItem href="#" label="Traffic" />
          <SideNavItem href="#" label="Conversions" />
        </SideNavGroup>
        <SideNavItem href="#" icon="settings" label="Settings" />
      </SideNav>
    </div>
  ),
};

export const WithHeaderAndFooter = {
  name: "With Header & Footer",
  render: () => (
    <div style={{ height: "100vh", display: "flex" }}>
      <SideNav header={(collapsed) => <HeaderSlot collapsed={collapsed} />} footer={<FooterSlot />}>
        <NavItems />
      </SideNav>
    </div>
  ),
};

export const RightAligned = {
  name: "Right Aligned",
  render: () => (
    <div style={{ height: "100vh", display: "flex", justifyContent: "flex-end" }}>
      <SideNav
        placement="end"
        header={(collapsed) => <HeaderSlot collapsed={collapsed} />}
        footer={<FooterSlot />}
      >
        <NavItems />
      </SideNav>
    </div>
  ),
};

/**
 * At lg/xl (≥1025px) the sidebar is persistent with a collapse toggle (‹) in the top-right.
 * When collapsed it shrinks to an icon rail — click any group icon to re-expand.
 */
export const Collapsed = {
  name: "Collapsed — Desktop Rail",
  render: () => (
    <AppShell>
      <SideNav
        header={(collapsed) => <HeaderSlot collapsed={collapsed} />}
        footer={<FooterSlot />}
        defaultCollapsed
      >
        <NavItems />
      </SideNav>
    </AppShell>
  ),
};

/**
 * Resize the preview to see all three breakpoints:
 * - lg/xl (≥1025px): persistent; ‹ button collapses to icon rail, clicking icon re-expands
 * - sm/md (481–1024px): overlay with scrim; ✕ button or Escape closes the drawer
 * - xs (≤480px): full-width overlay; ✕ button or Escape closes the drawer
 */
export const Responsive = {
  name: "Responsive — Full Layout",
  render: () => {
    const [navOpen, setNavOpen] = useState(false);

    return (
      <AppShell navOpen={navOpen} setNavOpen={setNavOpen}>
        <SideNav
          open={navOpen}
          onClose={() => setNavOpen(false)}
          header={(collapsed) => <HeaderSlot collapsed={collapsed} />}
          footer={<FooterSlot />}
        >
          <NavItems />
        </SideNav>
      </AppShell>
    );
  },
};
