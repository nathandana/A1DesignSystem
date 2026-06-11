import { TopHeader } from "./TopHeader.jsx";

// ── Shared example data ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    icon: "home",
    iconOnly: true,
    href: "/",
    active: true,
  },
  {
    id: "products",
    label: "Products",
    icon: "inventory_2",
    href: "/products",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "analytics",
    href: "/analytics",
    items: [
      { label: "Overview",    href: "/analytics" },
      { divider: true },
      {
        label: "Reports",
        href: "/analytics/reports",
        items: [
          { label: "Revenue", href: "/analytics/reports/revenue" },
          { label: "Engagement", href: "/analytics/reports/engagement" },
          { label: "Retention", href: "/analytics/reports/retention" },
        ],
      },
      { label: "Forecasting", href: "/analytics/forecast" },
    ],
  },
  {
    id: "docs",
    label: "Documentation",
    icon: "article",
    href: "/docs",
  },
];

const ACTIONS = [
  {
    id: "notifications",
    icon: "notifications",
    label: "Notifications",
    badge: 3,
    items: [
      { isHeader: true, label: "Notifications" },
      { divider: true },
      { label: "New comment on Transform",  icon: "chat_bubble",  href: "#" },
      { label: "Build passed",              icon: "check_circle", href: "#" },
      { label: "Review requested",          icon: "rate_review",  href: "#" },
      { divider: true },
      { label: "See all notifications",     href: "#" },
    ],
  },
  {
    id: "settings",
    icon: "settings",
    label: "Settings",
    items: [
      { label: "Preferences", icon: "settings", href: "#" },
      { label: "Appearance",  icon: "palette", href: "#" },
      { label: "API Keys",    icon: "key",     href: "#" },
    ],
  },
  {
    id: "user",
    icon: "account_circle",
    label: "Account",
    items: [
      { isHeader: true, label: "Nathan Dana", description: "nathan.dana@gmail.com" },
      { divider: true },
      { label: "Profile",        icon: "person",     href: "#" },
      { label: "Switch account", icon: "swap_horiz", href: "#" },
      { divider: true },
      { label: "Sign out", icon: "logout", danger: true, onClick: () => {} },
    ],
  },
];

const PAGE_CONTENT = (
  <div
    style={{
      padding: "var(--base-spacing-40) var(--base-spacing-40)",
      fontFamily: "var(--component-paragraph-font-family)",
      fontSize: "var(--semantic-font-size-body-md)",
      color: "var(--semantic-color-text-muted)",
    }}
  >
    Page content
  </div>
);

// ── Meta ───────────────────────────────────────────────────────────────────────

const meta = {
  title: "Components/Navigation/TopHeader",
  component: TopHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    logoText: { control: "text" },
    logoHref: { control: "text" },
    navIconPosition: {
      control: "inline-radio",
      options: ["start", "above", "hidden"],
    },
    loginButton: { control: "boolean", description: "Show login button" },
  },
};

export default meta;

// ── Stories ────────────────────────────────────────────────────────────────────

export const Default = {
  name: "Default",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ background: "var(--semantic-color-surface-page)", minHeight: 300 }}>
      <TopHeader
        logoText="A1 Design"
        logoHref="#"
        navItems={NAV_ITEMS}
        actions={ACTIONS}
      />
      {PAGE_CONTENT}
    </div>
  ),
};

export const WithLoginButton = {
  name: "With login button",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ background: "var(--semantic-color-surface-page)", minHeight: 300 }}>
      <TopHeader
        logoText="A1 Design"
        logoHref="#"
        navItems={NAV_ITEMS}
        actions={[ACTIONS[0]]}
        loginButton={{ label: "Log in", onClick: () => {} }}
      />
      {PAGE_CONTENT}
    </div>
  ),
};

export const NoIcons = {
  name: "Nav items without icons",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ background: "var(--semantic-color-surface-page)", minHeight: 300 }}>
      <TopHeader
        logoText="Acme"
        logoHref="#"
        navItems={[
          { id: "home",      label: "Home",      href: "/",        active: true },
          { id: "products",  label: "Products",  href: "/products" },
          { id: "pricing",   label: "Pricing",   href: "/pricing" },
          {
            id: "company",
            label: "Company",
            items: [
              { label: "About us", href: "/about" },
              { label: "Blog",     href: "/blog" },
              { label: "Careers",  href: "/careers" },
            ],
          },
        ]}
        actions={ACTIONS.slice(2)}
      />
      {PAGE_CONTENT}
    </div>
  ),
};

export const ActiveInSubmenu = {
  name: "Active item in secondary/tertiary menu",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ background: "var(--semantic-color-surface-page)", minHeight: 300 }}>
      <TopHeader
        logoText="A1 Design"
        logoHref="#"
        navItems={[
          { id: "home", label: "Home", icon: "home", iconOnly: true, href: "/" },
          { id: "products", label: "Products", icon: "inventory_2", href: "/products" },
          {
            id: "analytics",
            label: "Analytics",
            icon: "analytics",
            href: "/analytics",
            active: true,
            items: [
              { label: "Overview", href: "/analytics" },
              { divider: true },
              {
                label: "Reports",
                href: "/analytics/reports",
                items: [
                  { label: "Revenue", href: "/analytics/reports/revenue", active: true },
                  { label: "Engagement", href: "/analytics/reports/engagement" },
                  { label: "Retention", href: "/analytics/reports/retention" },
                ],
              },
              { label: "Forecasting", href: "/analytics/forecast" },
            ],
          },
          { id: "docs", label: "Documentation", icon: "article", href: "/docs" },
        ]}
        actions={ACTIONS}
      />
      {PAGE_CONTENT}
    </div>
  ),
};

export const IconAbove = {
  name: "Icon above label",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ background: "var(--semantic-color-surface-page)", minHeight: 300 }}>
      <TopHeader
        logoText="A1 Design"
        logoHref="#"
        navIconPosition="above"
        navItems={NAV_ITEMS}
        actions={ACTIONS}
      />
      {PAGE_CONTENT}
    </div>
  ),
};

export const IconAboveResponsive = {
  name: "Icon above — responsive",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ background: "var(--semantic-color-surface-page)", minHeight: 300 }}>
      <TopHeader
        logoText="A1 Design"
        logoHref="#"
        navIconPosition={{ xs: "above", lg: "start" }}
        navItems={NAV_ITEMS}
        actions={ACTIONS}
      />
      <div
        style={{
          padding: "var(--base-spacing-24) var(--base-spacing-40)",
          fontFamily: "var(--component-paragraph-font-family)",
          fontSize: "var(--semantic-font-size-body-sm)",
          color: "var(--semantic-color-text-muted)",
        }}
      >
        Icon above at xs–md (compact stacked nav, no hamburger). Inline icon+label from lg up.
        Resize the viewport to see the transition.
      </div>
    </div>
  ),
};

export const LogoSlot = {
  name: "Custom logo node",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ background: "var(--semantic-color-surface-page)", minHeight: 300 }}>
      <TopHeader
        logo={
          <span
            style={{
              fontWeight: 900,
              fontSize: "var(--semantic-font-size-heading-sm)",
              letterSpacing: "-0.02em",
            }}
          >
            A1
            <span style={{ color: "var(--semantic-color-text-accent)" }}>.</span>
          </span>
        }
        logoHref="#"
        navItems={NAV_ITEMS}
        actions={ACTIONS}
      />
      {PAGE_CONTENT}
    </div>
  ),
};
