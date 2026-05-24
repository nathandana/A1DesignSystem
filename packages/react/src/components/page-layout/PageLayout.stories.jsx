import { useState } from "react";
import { PageLayout } from "./PageLayout.jsx";
import { Heading } from "../heading/Heading.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { SideNav, SideNavGroup, SideNavItem } from "../side-nav/SideNav.jsx";

const meta = {
  title: "Components/Containers/Page Layout",
  component: PageLayout,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    sidebarPlacement: { control: "inline-radio", options: ["start", "end"] },
    stickyHeader:     { control: "boolean" },
  },
};

export default meta;

// ─── Shared demo primitives ───────────────────────────────────────────────────

const headerStyle = {
  padding: "var(--base-spacing-12) var(--base-spacing-16)",
  background: "var(--semantic-color-surface-page)",
  borderBottom: "1px solid var(--semantic-color-border-subtle)",
  display: "flex",
  alignItems: "center",
  gap: "var(--base-spacing-12)",
};

const footerStyle = {
  padding: "var(--base-spacing-16) var(--base-spacing-24)",
  background: "var(--semantic-color-surface-panel)",
  borderTop: "1px solid var(--semantic-color-border-subtle)",
};

const mainStyle = {
  padding: "var(--base-spacing-24)",
};

function Placeholder({ label, height = 120 }) {
  return (
    <div style={{
      height,
      borderRadius: "var(--base-radius-lg)",
      background: "var(--semantic-color-surface-raised)",
      border: "1px dashed var(--semantic-color-border-subtle)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Paragraph size="xs" color="muted">{label}</Paragraph>
    </div>
  );
}

function AppLogo({ collapsed }) {
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

function UserFooter() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-8)", padding: "var(--base-spacing-8)" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--semantic-color-text-muted)", flexShrink: 0 }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--semantic-color-text-default)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Jane Smith</div>
        <div style={{ fontSize: 12, color: "var(--semantic-color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>jane@acme.com</div>
      </div>
    </div>
  );
}

function DemoNavItems() {
  return (
    <>
      <SideNavItem href="#" icon="home" label="Dashboard" active />
      <SideNavGroup icon="folder" label="Projects" defaultOpen>
        <SideNavItem href="#" label="All Projects" />
        <SideNavItem href="#" label="Active" />
        <SideNavItem href="#" label="Archived" />
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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const HeaderAndFooter = {
  name: "Header + Footer",
  render: () => (
    <PageLayout
      header={
        <div style={headerStyle}>
          <Heading as="span" size="xs">A1 Design System</Heading>
        </div>
      }
      footer={
        <div style={footerStyle}>
          <Paragraph size="xs" color="muted">© 2026 A1. All rights reserved.</Paragraph>
        </div>
      }
    >
      <div style={mainStyle}>
        <Paragraph style={{ marginBottom: "var(--base-spacing-16)" }}>Main content area.</Paragraph>
        <Placeholder label="Content block" height={200} />
      </div>
    </PageLayout>
  ),
};

export const WithSidebar = {
  name: "With Sidebar",
  render: () => {
    const [navOpen, setNavOpen] = useState(false);

    return (
      <PageLayout
        header={
          <div style={headerStyle}>
            {/* Menu button: hidden at lg+ via compound-class specificity */}
            <IconButton
              icon="menu"
              label="Open navigation"
              className="a1-pl-story-menu-btn"
              onClick={() => setNavOpen(true)}
            />
            <Heading as="span" size="xs">Dashboard</Heading>
            <style>{`@media (min-width: 1025px) { .a1-pl-story-menu-btn.a1-icon-button { display: none; } }`}</style>
          </div>
        }
        footer={
          <div style={footerStyle}>
            <Paragraph size="xs" color="muted">© 2026 A1. All rights reserved.</Paragraph>
          </div>
        }
        sidebar={
          <SideNav
            open={navOpen}
            onClose={() => setNavOpen(false)}
            header={(collapsed) => <AppLogo collapsed={collapsed} />}
            footer={<UserFooter />}
          >
            <DemoNavItems />
          </SideNav>
        }
      >
        <div style={mainStyle}>
          <Paragraph style={{ marginBottom: "var(--base-spacing-16)" }}>
            Main content area. Resize the preview to see the SideNav respond: persistent at lg/xl, overlay at sm/md, full-width at xs.
          </Paragraph>
          <Placeholder label="Content block" height={240} />
        </div>
      </PageLayout>
    );
  },
};

export const WithRightSideNav = {
  name: "With Right SideNav",
  render: () => {
    const [navOpen, setNavOpen] = useState(false);

    return (
      <PageLayout
        sidebarPlacement="end"
        header={
          <div style={headerStyle}>
            <Heading as="span" size="xs">Dashboard</Heading>
            {/* Menu button: hidden at lg+ via compound-class specificity */}
            <IconButton
              icon="menu"
              label="Open navigation"
              className="a1-pl-story-menu-btn"
              onClick={() => setNavOpen(true)}
              style={{ marginInlineStart: "auto" }}
            />
            <style>{`@media (min-width: 1025px) { .a1-pl-story-menu-btn.a1-icon-button { display: none; } }`}</style>
          </div>
        }
        footer={
          <div style={footerStyle}>
            <Paragraph size="xs" color="muted">© 2026 A1. All rights reserved.</Paragraph>
          </div>
        }
        sidebar={
          <SideNav
            placement="end"
            open={navOpen}
            onClose={() => setNavOpen(false)}
            header={(collapsed) => <AppLogo collapsed={collapsed} />}
            footer={<UserFooter />}
          >
            <DemoNavItems />
          </SideNav>
        }
      >
        <div style={mainStyle}>
          <Paragraph style={{ marginBottom: "var(--base-spacing-16)" }}>
            Main content area with navigation placed on the right edge.
          </Paragraph>
          <Placeholder label="Content block" height={240} />
        </div>
      </PageLayout>
    );
  },
};


export const StickyHeader = {
  name: "Sticky Header",
  render: () => (
    <PageLayout
      stickyHeader
      header={
        <div style={{ ...headerStyle, boxShadow: "var(--semantic-shadow-sm)" }}>
          <Heading as="span" size="xs">Sticky Header</Heading>
          <Paragraph size="xs" color="muted">— scroll the page to see it stay fixed</Paragraph>
        </div>
      }
    >
      <div style={mainStyle}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ marginBottom: "var(--base-spacing-16)" }}>
            <Placeholder label={`Content block ${i + 1}`} height={80} />
          </div>
        ))}
      </div>
    </PageLayout>
  ),
};
