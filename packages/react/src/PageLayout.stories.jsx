import { PageLayout } from "./PageLayout.jsx";
import { Heading } from "./Heading.jsx";
import { Paragraph } from "./Paragraph.jsx";

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
  padding: "var(--base-spacing-16) var(--base-spacing-24)",
  background: "var(--semantic-color-surface-panel)",
  borderBottom: "1px solid var(--semantic-color-border-subtle)",
  display: "flex",
  alignItems: "center",
  gap: "var(--base-spacing-12)",
};

const sidebarStyle = {
  padding: "var(--base-spacing-24) var(--base-spacing-16)",
  background: "var(--semantic-color-surface-panel)",
  borderRight: "1px solid var(--semantic-color-border-subtle)",
  height: "100%",
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
  render: () => (
    <PageLayout
      header={
        <div style={headerStyle}>
          <Heading as="span" size="xs">A1 Design System</Heading>
        </div>
      }
      footer={
        <div style={footerStyle}>
          <Paragraph size="xs" color="muted">Footer</Paragraph>
        </div>
      }
      sidebar={
        <div style={sidebarStyle}>
          <Heading as="p" size="xs" style={{ marginBottom: "var(--base-spacing-12)" }}>
            Navigation
          </Heading>
          {["Overview", "Components", "Foundations", "Utilities"].map(item => (
            <Paragraph key={item} size="sm" color="muted" style={{ marginBottom: "var(--base-spacing-8)" }}>
              {item}
            </Paragraph>
          ))}
        </div>
      }
    >
      <div style={mainStyle}>
        <Paragraph style={{ marginBottom: "var(--base-spacing-16)" }}>
          Main content with sidebar navigation.
        </Paragraph>
        <Placeholder label="Content block" height={240} />
      </div>
    </PageLayout>
  ),
};

export const SidebarEnd = {
  name: "Sidebar End",
  render: () => (
    <PageLayout
      header={
        <div style={headerStyle}>
          <Heading as="span" size="xs">A1 Design System</Heading>
        </div>
      }
      sidebarPlacement="end"
      sidebar={
        <div style={{ ...sidebarStyle, borderRight: "none", borderLeft: "1px solid var(--semantic-color-border-subtle)" }}>
          <Heading as="p" size="xs" style={{ marginBottom: "var(--base-spacing-8)" }}>Details</Heading>
          <Paragraph size="sm" color="muted">Right-side panel</Paragraph>
        </div>
      }
    >
      <div style={mainStyle}>
        <Paragraph style={{ marginBottom: "var(--base-spacing-16)" }}>
          Sidebar placed at the end (right side).
        </Paragraph>
        <Placeholder label="Content block" height={200} />
      </div>
    </PageLayout>
  ),
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
