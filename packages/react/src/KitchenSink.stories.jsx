import { useState } from "react";
import { userEvent, within, waitFor } from "storybook/test";
import { PageLayout } from "./components/page-layout/PageLayout.jsx";
import { SideNav, SideNavGroup, SideNavItem } from "./components/side-nav/SideNav.jsx";
import { Button } from "./components/button/Button.jsx";
import { ButtonContainer } from "./components/button-container/ButtonContainer.jsx";
import { Card } from "./components/card/Card.jsx";
import { Heading } from "./components/heading/Heading.jsx";
import { IconButton } from "./components/icon-button/IconButton.jsx";
import { Link } from "./components/link/Link.jsx";
import { Menu, MenuSection, MenuItem } from "./components/menu/Menu.jsx";
import { MessageBadge, MessageBanner, MessageEmptyState } from "./components/message/Message.jsx";
import { Notification } from "./components/notification/Notification.jsx";
import { Pagination } from "./components/pagination/Pagination.jsx";
import { Paragraph } from "./components/paragraph/Paragraph.jsx";
import { Section } from "./components/section/Section.jsx";
import { SegmentedControl } from "./components/segmented-control/SegmentedControl.jsx";
import { Tabs, TabList, Tab, TabPanel } from "./components/tabs/Tabs.jsx";
import { Grid, GridItem } from "./components/grid/Grid.jsx";

const meta = {
  title: "Kitchen Sink",
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;

// ─── Layout styles ────────────────────────────────────────────────────────────

const headerStyle = {
  padding: "var(--base-spacing-12) var(--base-spacing-16)",
  background: "var(--semantic-color-surface-page)",
  borderBottom: "1px solid var(--semantic-color-border-subtle)",
  display: "flex",
  alignItems: "center",
  gap: "var(--base-spacing-12)",
  flexShrink: 0,
};

const footerStyle = {
  padding: "var(--base-spacing-12) var(--base-spacing-24)",
  background: "var(--semantic-color-surface-panel)",
  borderTop: "1px solid var(--semantic-color-border-subtle)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
};

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <Heading
      as="h3"
      type="heading"
      size="xs"
      color="muted"
      style={{ marginBottom: "var(--base-spacing-12)" }}
    >
      {children}
    </Heading>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <hr style={{ border: "none", borderTop: "1px solid var(--semantic-color-border-subtle)", margin: "var(--base-spacing-4) 0" }} />
  );
}

// ─── Main page content (padded block) ─────────────────────────────────────────

function KitchenSinkContent() {
  const [tab, setTab]         = useState("overview");
  const [segment, setSegment] = useState("month");
  const [page, setPage]       = useState(3);

  return (
    <div style={{ padding: "var(--base-spacing-24)", display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)" }}>

      {/* ── Buttons ─────────────────────────────────────────────── */}
      <div>
        <SectionLabel>Buttons</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
          <ButtonContainer>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="success">Success</Button>
          </ButtonContainer>
          <ButtonContainer>
            <Button variant="primary" size="sm" icon="add">Small</Button>
            <Button variant="secondary" size="md" icon="edit">Medium</Button>
            <Button variant="primary" size="lg" icon="check" iconPosition="end">Large</Button>
          </ButtonContainer>
        </div>
      </div>

      {/* ── Message Badges ──────────────────────────────────────── */}
      <div>
        <SectionLabel>Badges</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--base-spacing-8)" }}>
          <MessageBadge status="neutral">Neutral</MessageBadge>
          <MessageBadge status="info">Info</MessageBadge>
          <MessageBadge status="success">Success</MessageBadge>
          <MessageBadge status="warn">Warning</MessageBadge>
          <MessageBadge status="error">Error</MessageBadge>
          <MessageBadge status="neutral" subtle>Subtle neutral</MessageBadge>
          <MessageBadge status="success" subtle>Subtle success</MessageBadge>
          <MessageBadge status="warn" subtle>Subtle warn</MessageBadge>
          <MessageBadge status="error" subtle>Subtle error</MessageBadge>
        </div>
      </div>

      {/* ── Message Banners ─────────────────────────────────────── */}
      <div>
        <SectionLabel>Banners</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-8)" }}>
          <MessageBanner status="neutral" title="Neutral">Something you should know.</MessageBanner>
          <MessageBanner status="info" title="Informational">Your session will expire in 15 minutes.</MessageBanner>
          <MessageBanner status="success" title="Success">Changes saved successfully.</MessageBanner>
          <MessageBanner status="warn" title="Warning">This action may have unintended effects.</MessageBanner>
          <MessageBanner status="error" title="Error">Failed to load data. Please try again.</MessageBanner>
        </div>
      </div>

      {/* ── Tabs + Segmented Control ─────────────────────────────── */}
      <div>
        <SectionLabel>Tabs &amp; Segmented Control</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <Tabs value={tab} onChange={setTab}>
            <TabList>
              <Tab value="overview">Overview</Tab>
              <Tab value="activity">Activity</Tab>
              <Tab value="settings">Settings</Tab>
            </TabList>
            <TabPanel value="overview">
              <Paragraph size="sm" color="muted" style={{ padding: "var(--base-spacing-12) 0" }}>
                Overview panel — summary and key metrics for this project.
              </Paragraph>
            </TabPanel>
            <TabPanel value="activity">
              <Paragraph size="sm" color="muted" style={{ padding: "var(--base-spacing-12) 0" }}>
                Activity panel — recent events and timeline entries.
              </Paragraph>
            </TabPanel>
            <TabPanel value="settings">
              <Paragraph size="sm" color="muted" style={{ padding: "var(--base-spacing-12) 0" }}>
                Settings panel — configure project preferences.
              </Paragraph>
            </TabPanel>
          </Tabs>
          <SegmentedControl
            value={segment}
            onChange={setSegment}
            options={[
              { value: "day",   label: "Day" },
              { value: "week",  label: "Week" },
              { value: "month", label: "Month" },
              { value: "year",  label: "Year" },
            ]}
          />
        </div>
      </div>

      {/* ── Cards + Notifications ───────────────────────────────── */}
      <div>
        <SectionLabel>Cards &amp; Notifications</SectionLabel>
        <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap={16}>
          <GridItem>
            <Notification count={5} variant="error">
              <Card icon="folder" shadow="sm" style={{ padding: "var(--base-spacing-16)", width: "100%" }}>
                <Heading as="h4" type="heading" size="xs">Project Alpha</Heading>
                <Paragraph size="sm" color="muted">Active · 3 contributors</Paragraph>
              </Card>
            </Notification>
          </GridItem>
          <GridItem>
            <Card icon="bar_chart" shadow="md" style={{ padding: "var(--base-spacing-16)", width: "100%" }}>
              <Heading as="h4" type="heading" size="xs">Analytics</Heading>
              <Paragraph size="sm" color="muted">Updated 2 hours ago</Paragraph>
            </Card>
          </GridItem>
          <GridItem>
            <Notification dot variant="success">
              <Card icon="settings" shadow="lg" style={{ padding: "var(--base-spacing-16)", width: "100%" }}>
                <Heading as="h4" type="heading" size="xs">Settings</Heading>
                <Paragraph size="sm" color="muted">System · Global</Paragraph>
              </Card>
            </Notification>
          </GridItem>
        </Grid>
      </div>

      {/* ── Inline notifications ────────────────────────────────── */}
      <div>
        <SectionLabel>Notifications</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--base-spacing-24)", alignItems: "flex-start" }}>
          <Notification dot>
            <IconButton icon="notifications" label="Notifications (dot)" />
          </Notification>
          <Notification count={3}>
            <IconButton icon="notifications" label="Notifications (count)" />
          </Notification>
          <Notification count={150} max={99} variant="error">
            <IconButton icon="notifications" label="Notifications (overflow)" />
          </Notification>
          <Notification label="New" variant="info">
            <Button variant="secondary" size="sm">Messages</Button>
          </Notification>
        </div>
      </div>

      {/* ── Pagination ──────────────────────────────────────────── */}
      <div>
        <SectionLabel>Pagination</SectionLabel>
        <Pagination page={page} totalPages={12} onChange={setPage} />
      </div>

      {/* ── Typography ──────────────────────────────────────────── */}
      <div>
        <SectionLabel>Typography</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>

          {/* Display scale */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>
            <Paragraph size="xs" color="muted" style={{ fontWeight: 600, marginBottom: "var(--base-spacing-4)" }}>Display</Paragraph>
            <Heading as="p" type="display" size="lg">Display · lg</Heading>
            <Heading as="p" type="display" size="md">Display · md</Heading>
            <Heading as="p" type="display" size="sm">Display · sm</Heading>
          </div>

          <Divider />

          {/* Heading scale */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>
            <Paragraph size="xs" color="muted" style={{ fontWeight: 600, marginBottom: "var(--base-spacing-4)" }}>Heading</Paragraph>
            <Heading as="p" type="heading" size="xl">Heading · xl</Heading>
            <Heading as="p" type="heading" size="lg">Heading · lg</Heading>
            <Heading as="p" type="heading" size="md">Heading · md</Heading>
            <Heading as="p" type="heading" size="sm">Heading · sm</Heading>
            <Heading as="p" type="heading" size="xs">Heading · xs</Heading>
          </div>

          <Divider />

          {/* Heading color variants */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>
            <Paragraph size="xs" color="muted" style={{ fontWeight: 600, marginBottom: "var(--base-spacing-4)" }}>Heading colors</Paragraph>
            <Heading as="p" type="heading" size="sm" color="default">Default — primary heading text</Heading>
            <Heading as="p" type="heading" size="sm" color="muted">Muted — secondary and supporting headings</Heading>
            <Heading as="p" type="heading" size="sm" color="accent">Accent — brand emphasis and highlights</Heading>
          </div>

          <Divider />

          {/* Body scale */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>
            <Paragraph size="xs" color="muted" style={{ fontWeight: 600, marginBottom: "var(--base-spacing-4)" }}>Body</Paragraph>
            <Paragraph size="xl">Body xl — hero intros and large callouts that need maximum presence.</Paragraph>
            <Paragraph size="lg">Body lg — lead text for section openers and feature descriptions.</Paragraph>
            <Paragraph size="md">Body md — the default body size used across most UI contexts and descriptions.</Paragraph>
            <Paragraph size="sm">Body sm — secondary content, form help text, and sidebar copy.</Paragraph>
            <Paragraph size="xs">Body xs — captions, timestamps, labels, and fine print.</Paragraph>
          </div>

          <Divider />

          {/* Body color variants + link */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>
            <Paragraph size="xs" color="muted" style={{ fontWeight: 600, marginBottom: "var(--base-spacing-4)" }}>Body colors &amp; links</Paragraph>
            <Paragraph size="md">Default — primary body text for main content areas.</Paragraph>
            <Paragraph size="md" color="muted">Muted — supplementary copy, descriptions, and helper text. <Link href="#">Inline link</Link> within muted text.</Paragraph>
            <Paragraph size="md">Default with an <Link href="#">inline link</Link> in running copy.</Paragraph>
          </div>

        </div>
      </div>

    </div>
  );
}

// ─── Section examples (full-bleed within the main column) ────────────────────

function KitchenSinkSections() {
  return (
    <>
      {/* Panel surface — subtle background lift */}
      <Section surface="panel" padding="sm">
        <SectionLabel>Section — panel surface</SectionLabel>
        <Grid columns={{ xs: 1, sm: 2 }} gap={24}>
          <GridItem>
            <Heading as="h4" type="heading" size="sm">Built for teams</Heading>
            <Paragraph size="md" color="muted" style={{ marginTop: "var(--base-spacing-8)" }}>
              The panel surface separates supporting content from the primary page background,
              creating visual hierarchy without heavy borders or shadows.
            </Paragraph>
          </GridItem>
          <GridItem>
            <Heading as="h4" type="heading" size="sm">Scales responsively</Heading>
            <Paragraph size="md" color="muted" style={{ marginTop: "var(--base-spacing-8)" }}>
              Section padding scales automatically across breakpoints — no per-breakpoint overrides
              needed in application code.
            </Paragraph>
          </GridItem>
        </Grid>
      </Section>

      {/* Raised surface — elevated card-like background */}
      <Section surface="raised" padding="sm">
        <SectionLabel>Section — raised surface</SectionLabel>
        <MessageEmptyState
          scale="section"
          icon="inbox"
          title="No items yet"
          description="Create your first item to get started. It will appear here once added."
          action={<Button variant="primary" icon="add">Create item</Button>}
        />
      </Section>

      {/* Inverse — dark/brand background */}
      <Section inverse padding="md">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--base-spacing-16)", textAlign: "center" }}>
          <SectionLabel>Section — inverse</SectionLabel>
          <Heading as="h2" type="heading" size="md">Ready to get started?</Heading>
          <Paragraph size="md">Join thousands of teams using A1 Design System to ship faster.</Paragraph>
          <div style={{ display: "flex", gap: "var(--base-spacing-8)" }}>
            <Button variant="primary">Get started</Button>
            <Button variant="secondary">Learn more</Button>
          </div>
        </div>
      </Section>
    </>
  );
}

// ─── Full layout ──────────────────────────────────────────────────────────────

function KitchenSinkLayout() {
  const [navOpen,  setNavOpen]  = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <PageLayout
      sidebar={
        <SideNav
          open={navOpen}
          onClose={() => setNavOpen(false)}
          header={(collapsed) => (
            <Heading as="div" type="heading" size="xs">
              {collapsed
                ? "A1"
                : <><span>A1</span><span style={{ color: "var(--semantic-color-text-accent)" }}>:DS</span></>
              }
            </Heading>
          )}
        >
          <SideNavItem href="#" icon="home" label="Overview" active />
          <SideNavGroup icon="widgets" label="Components" defaultOpen>
            <SideNavItem href="#" label="Buttons" />
            <SideNavItem href="#" label="Badges" />
            <SideNavItem href="#" label="Cards" />
            <SideNavItem href="#" label="Dialogs" />
          </SideNavGroup>
          <SideNavGroup icon="palette" label="Foundations">
            <SideNavItem href="#" label="Colors" />
            <SideNavItem href="#" label="Typography" />
            <SideNavItem href="#" label="Spacing" />
          </SideNavGroup>
          <SideNavItem href="#" icon="book" label="Documentation" />
          <SideNavItem href="#" icon="settings" label="Settings" />
        </SideNav>
      }
    >
      {/* Header sits at the top of the main column, to the right of the sidebar */}
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
        <header style={headerStyle}>
          <IconButton
            icon="menu"
            label="Open navigation"
            className="a1-ks-menu-btn"
            onClick={() => setNavOpen(true)}
          />
          <style>{`@media (min-width: 1025px) { .a1-ks-menu-btn.a1-icon-button { display: none; } }`}</style>

          <Heading as="span" size="sm">A1 Design System</Heading>

          <div style={{ marginInlineStart: "auto", display: "flex", gap: "var(--base-spacing-8)", alignItems: "center" }}>
            <Notification count={2} variant="error">
              <IconButton icon="notifications" label="Notifications" />
            </Notification>

            <IconButton
              icon="account_circle"
              label="Account menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            />

            <Menu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              aria-label="Account menu"
            >
              <MenuSection>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-8)", padding: "var(--base-spacing-6) var(--base-spacing-8)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--semantic-color-surface-raised)", flexShrink: 0 }} />
                  <div>
                    <Paragraph size="sm" style={{ fontWeight: 600 }}>Jane Smith</Paragraph>
                    <Paragraph size="xs" color="muted">jane@acme.com</Paragraph>
                  </div>
                </div>
              </MenuSection>
              <MenuSection label="Account">
                <MenuItem icon="person">Profile</MenuItem>
                <MenuItem icon="tune">Preferences</MenuItem>
                <MenuItem icon="keyboard" shortcut="⌘K">Command palette</MenuItem>
              </MenuSection>
              <MenuSection label="Workspace">
                <MenuItem icon="group">Team settings</MenuItem>
                <MenuItem icon="credit_card">Billing</MenuItem>
                <MenuItem icon="help" disabled>Help center</MenuItem>
              </MenuSection>
              <MenuSection>
                <MenuItem icon="logout" variant="destructive" onClick={() => setMenuOpen(false)}>Sign out</MenuItem>
              </MenuSection>
            </Menu>
          </div>
        </header>

        <div style={{ flex: 1 }}>
          <KitchenSinkContent />
          <KitchenSinkSections />
        </div>

        <footer style={footerStyle}>
          <Paragraph size="xs" color="muted">© 2026 A1 Design System</Paragraph>
          <Paragraph size="xs" color="muted">
            <Link href="#">Privacy</Link> · <Link href="#">Terms</Link> · <Link href="#">Status</Link>
          </Paragraph>
        </footer>
      </div>
    </PageLayout>
  );
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Default = {
  name: "Kitchen Sink",
  render: () => <KitchenSinkLayout />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /account menu/i }));
    await waitFor(() => within(document.body).getByRole("dialog", { name: /account menu/i }));
  },
};
