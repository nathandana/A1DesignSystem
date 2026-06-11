import { BottomDrawer } from "./BottomDrawer.jsx";
import { TopHeader } from "../top-header/TopHeader.jsx";

// ── Shared example data ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home",      label: "Home",      icon: "home",           href: "/",         active: true },
  { id: "explore",   label: "Explore",   icon: "explore",        href: "/explore" },
  { id: "inbox",     label: "Inbox",     icon: "inbox",          href: "/inbox",    badge: 4 },
  { id: "profile",   label: "Profile",   icon: "account_circle", href: "/profile" },
  { id: "settings",  label: "Settings",  icon: "settings",       href: "/settings" },
];

const ACTIONS = [
  {
    id: "user",
    icon: "account_circle",
    label: "Account",
    items: [
      { isHeader: true, label: "Nathan Dana", description: "nathan.dana@gmail.com" },
      { divider: true },
      { label: "Profile",  icon: "person",  href: "#" },
      { label: "Sign out", icon: "logout",  danger: true, onClick: () => {} },
    ],
  },
];

// ── Meta ───────────────────────────────────────────────────────────────────────

const meta = {
  title: "Components/Navigation/BottomDrawer",
  component: BottomDrawer,
  parameters: { layout: "fullscreen" },
};

export default meta;

// ── Stories ────────────────────────────────────────────────────────────────────

export const Default = {
  name: "Default",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ background: "var(--semantic-color-surface-page)", minHeight: 200, paddingBottom: 80 }}>
      <div style={{ padding: "var(--base-spacing-24) var(--base-spacing-24)", color: "var(--semantic-color-text-muted)", fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)" }}>
        Page content — the drawer is fixed to the bottom.
      </div>
      <BottomDrawer items={NAV_ITEMS} />
    </div>
  ),
};

export const ThreeItems = {
  name: "Three items",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ background: "var(--semantic-color-surface-page)", minHeight: 200, paddingBottom: 80 }}>
      <BottomDrawer
        items={[
          { id: "home",    label: "Home",    icon: "home",    href: "/", active: true },
          { id: "search",  label: "Search",  icon: "search",  href: "/search" },
          { id: "profile", label: "Profile", icon: "person",  href: "/profile" },
        ]}
      />
    </div>
  ),
};

export const WithBadges = {
  name: "With badges",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ background: "var(--semantic-color-surface-page)", minHeight: 200, paddingBottom: 80 }}>
      <BottomDrawer
        items={[
          { id: "home",    label: "Home",     icon: "home",           href: "/", active: true },
          { id: "inbox",   label: "Inbox",    icon: "inbox",          href: "/inbox",  badge: 12 },
          { id: "alerts",  label: "Alerts",   icon: "notifications",  href: "/alerts", badge: 99 },
          { id: "cart",    label: "Cart",     icon: "shopping_cart",  href: "/cart",   badge: 3 },
          { id: "profile", label: "Profile",  icon: "account_circle", href: "/profile" },
        ]}
      />
    </div>
  ),
};

export const WithTopHeader = {
  name: "With TopHeader — responsive",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ background: "var(--semantic-color-surface-page)", minHeight: 400, paddingBottom: 80 }}>
      {/*
        xs (≤480px): TopHeader hides nav + hamburger (navIconPosition "hidden").
                     BottomDrawer provides the primary navigation.
        sm (481px+):  TopHeader shows icon-above nav. BottomDrawer is hidden via CSS.
      */}
      <TopHeader
        logoText="A1 Design"
        logoHref="#"
        navIconPosition={{ xs: "hidden", sm: "above", lg: "start" }}
        navItems={NAV_ITEMS}
        actions={ACTIONS}
      />
      <div style={{ padding: "var(--base-spacing-40) var(--base-spacing-40)", fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)" }}>
        Resize to ≤480px to see the BottomDrawer replace the TopHeader nav.
        The same nav items are shared between both components.
      </div>
      {/* Hide at sm+ — same breakpoint where TopHeader nav becomes visible */}
      <div style={{ display: "contents" }}>
        <style>{`
          @media (min-width: 481px) {
            .a1-bottom-drawer-responsive-demo { display: none; }
          }
        `}</style>
        <BottomDrawer
          items={NAV_ITEMS}
          aria-label="Primary navigation"
          className="a1-bottom-drawer-responsive-demo"
        />
      </div>
    </div>
  ),
};
