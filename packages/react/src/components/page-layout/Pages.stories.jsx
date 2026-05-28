import { useState } from "react";
import { Accordion } from "../accordion/Accordion.jsx";
import { PageNav } from "../page-nav/PageNav.jsx";
import { Banner } from "../banner/Banner.jsx";
import { Button } from "../button/Button.jsx";
import { ButtonContainer } from "../button-container/ButtonContainer.jsx";
import { Card } from "../card/Card.jsx";
import { FieldRow } from "../field-row/FieldRow.jsx";
import { Fieldset } from "../fieldset/Fieldset.jsx";
import { SelectField } from "../field/SelectField.jsx";
import { TextField } from "../field/TextField.jsx";
import { TextareaField } from "../field/TextareaField.jsx";
import { Grid } from "../grid/Grid.jsx";
import { Heading, HeadingMark } from "../heading/Heading.jsx";
import { Icon } from "../icon/Icon.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { PageLayout } from "./PageLayout.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Section } from "../section/Section.jsx";
import { SideNav, SideNavGroup, SideNavItem } from "../side-nav/SideNav.jsx";
import { Switch } from "../switch/Switch.jsx";
import { TopHeader } from "../top-header/TopHeader.jsx";

export default {
  title: "Templates",
  parameters: { layout: "fullscreen" },
  excludeStories: ["Editor"],
};

// ── Shared header data ─────────────────────────────────────────────────────────

const SHARED_NAV = [
  { id: "home", label: "Home", icon: "home", href: "#", iconOnly: true, active: true },
  { id: "projects", label: "Projects", href: "#" },
  { id: "reports", label: "Reports", href: "#" },
];

const SHARED_ACTIONS = [
  {
    id: "notifications",
    icon: "notifications",
    label: "Notifications",
    badge: 3,
    items: [
      { label: "New comment on Project Alpha", onClick: () => {} },
      { label: "Deployment succeeded", onClick: () => {} },
      { divider: true },
      { label: "View all notifications", href: "#" },
    ],
  },
  {
    id: "user",
    icon: "account_circle",
    label: "Account",
    items: [
      { isHeader: true, label: "Alex Kim", description: "alex@example.com" },
      { divider: true },
      { label: "Profile", icon: "person", href: "#" },
      { label: "Settings", icon: "settings", href: "#" },
      { divider: true },
      { label: "Sign out", icon: "logout", onClick: () => {}, danger: true },
    ],
  },
];

// ── Home (marketing) ───────────────────────────────────────────────────────────

const HOME_NAV = [
  { id: "features", label: "Features", href: "#" },
  { id: "pricing", label: "Pricing", href: "#" },
  { id: "docs", label: "Docs", href: "#" },
  { id: "blog", label: "Blog", href: "#" },
];

const STATS = [
  { value: "40+", label: "Components" },
  { value: "3-tier", label: "Token system" },
  { value: "0kb", label: "Runtime JS" },
  { value: "100%", label: "Dark mode" },
];

const FEATURES = [
  { icon: "palette", color: "action",  title: "Design tokens",       desc: "Base → semantic → component tokens make theming predictable at every level." },
  { icon: "widgets", color: "info",    title: "React components",    desc: "40+ accessible components with keyboard nav, ARIA, and dark mode included." },
  { icon: "code",    color: "success", title: "Framework agnostic",  desc: "Token CSS works anywhere. The React package is optional, not required." },
  { icon: "speed",   color: "warn",    title: "Zero runtime",        desc: "Pure CSS custom properties — no CSS-in-JS, no layout flash, no overhead." },
  { icon: "dark_mode", color: "neutral", title: "Dark mode native",  desc: "Light and dark schemes via CSS color-scheme. No JavaScript needed." },
  { icon: "auto_awesome", color: "error", title: "Figma integration", desc: "Code Connect maps every component to its Figma counterpart automatically." },
];

const TESTIMONIALS = [
  {
    quote: "A1 cut our UI review cycles in half. Design and engineering finally share the same language.",
    author: "Jordan Lee",
    role: "Head of Design, Vanta",
  },
  {
    quote: "The three-tier token system is the right abstraction. We shipped dark mode in a single afternoon.",
    author: "Sam Okafor",
    role: "Staff Engineer, Loom",
  },
  {
    quote: "Every component is accessible out of the box. We stopped worrying about ARIA and started shipping features.",
    author: "Maya Patel",
    role: "Principal Engineer, Mercury",
  },
];

export const Home = {
  name: "Home",
  render: () => {
    const header = (
      <TopHeader
        logoText="A1"
        logoHref="#"
        navItems={HOME_NAV}
        loginButton={{ label: "Get started free", onClick: () => {} }}
      />
    );

    return (
      <PageLayout header={header} stickyHeader>

        {/* ── Hero ── */}
        <Section padding="lg" inverse surface="page" gradient="accent" gradientPosition="top-right" gap="lg">
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <div style={{ marginBlockEnd: "var(--base-spacing-20)" }}>
              <MessageBadge status="info" subtle>Now in public beta — try it free</MessageBadge>
            </div>
            <Heading
              as="h1"
              type="display"
              size={{ xs: "xl", md: "xxl", lg: "jumbo" }}
              style={{ marginBlockEnd: "var(--base-spacing-24)" }}
            >
              Design systems that{" "}
              <HeadingMark variant="underline" underlineStyle="swoop">
                ship with you
              </HeadingMark>
            </Heading>
            <Paragraph
              size="lg"
              style={{ maxWidth: 560, margin: "0 auto var(--base-spacing-40)" }}
            >
              A shared foundation of components, tokens, and patterns — so your team builds faster without ever drifting out of sync.
            </Paragraph>
            <ButtonContainer align="center">
              <Button variant="primary" size="lg">Start building free</Button>
              <Button variant="secondary" size="lg">View components</Button>
            </ButtonContainer>
          </div>
        </Section>

        {/* ── Stats bar ── */}
        <Section padding="sm" surface="panel" gradient="highlight" gradientPosition="center">
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "var(--base-spacing-32)",
              textAlign: "center",
            }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <Heading
                  as="p"
                  type="display"
                  size="lg"
                  color="accent"
                  style={{ marginBlockEnd: "var(--base-spacing-4)" }}
                >
                  {value}
                </Heading>
                <Paragraph size="sm" color="muted">{label}</Paragraph>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Features ── */}
        <Section padding="lg" gap="lg">
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <Heading
              as="p"
              type="heading"
              size="sm"
              color="accent"
              style={{ marginBlockEnd: "var(--base-spacing-12)", textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              Why teams choose A1
            </Heading>
            <Heading
              as="h2"
              type="display"
              size="md"
              style={{ marginBlockEnd: "var(--base-spacing-16)" }}
            >
              Everything in one{" "}
              <HeadingMark variant="highlight">place</HeadingMark>
            </Heading>
            <Paragraph color="muted">
              From design tokens to production components — a complete toolkit built on open standards with no vendor lock-in.
            </Paragraph>
          </div>
          <Grid columns={3} gap="lg">
            {FEATURES.map(({ icon, color, title, desc }) => (
              <Card key={title} heroIcon={icon} heroColor={color}>
                <div style={{ padding: "var(--base-spacing-20)" }}>
                  <Heading
                    as="h3"
                    type="heading"
                    size="sm"
                    style={{ marginBlockEnd: "var(--base-spacing-8)" }}
                  >
                    {title}
                  </Heading>
                  <Paragraph size="sm" color="muted">{desc}</Paragraph>
                </div>
              </Card>
            ))}
          </Grid>
        </Section>

        {/* ── Testimonials ── */}
        <Section padding="lg" inverse surface="page" gradient="accent" gradientPosition="center" gap="lg">
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <Heading
              as="h2"
              type="display"
              size="md"
              style={{ marginBlockEnd: "var(--base-spacing-8)" }}
            >
              Loved by teams who ship
            </Heading>
            <Paragraph color="muted">Real feedback from design-engineering teams in production.</Paragraph>
          </div>
          <Grid columns={3} gap="md">
            {TESTIMONIALS.map(({ quote, author, role }) => (
              <Card key={author} bare>
                <div style={{ padding: "var(--base-spacing-24)", display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
                  <Paragraph size="sm" style={{ fontStyle: "italic", lineHeight: 1.6 }}>"{quote}"</Paragraph>
                  <div>
                    <Paragraph size="sm" style={{ fontWeight: 600 }}>{author}</Paragraph>
                    <Paragraph size="xs" color="muted">{role}</Paragraph>
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        </Section>

        {/* ── CTA ── */}
        <Section padding="lg" surface="panel" gap="md" style={{ textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <Heading
              as="h2"
              type="display"
              size="md"
              style={{ marginBlockEnd: "var(--base-spacing-16)" }}
            >
              Ready to{" "}
              <HeadingMark variant="underline" underlineStyle="wave">
                get started?
              </HeadingMark>
            </Heading>
            <Paragraph color="muted" style={{ marginBlockEnd: "var(--base-spacing-32)" }}>
              Free for individuals. Scales with your team. No credit card required.
            </Paragraph>
          </div>
          <ButtonContainer align="center">
            <Button variant="primary" size="lg">Start building free</Button>
            <Button variant="secondary" size="lg">Talk to sales</Button>
          </ButtonContainer>
        </Section>

      </PageLayout>
    );
  },
};

// ── Landing ────────────────────────────────────────────────────────────────────

const LANDING_NAV = [
  { id: "product", label: "Product", href: "#" },
  { id: "pricing", label: "Pricing", href: "#" },
  { id: "blog", label: "Blog", href: "#" },
];

const LANDING_FEATURES = [
  { icon: "token", color: "action",  title: "Token-first",     desc: "Design decisions live in tokens, not hardcoded values. Change a theme in one place, see it everywhere." },
  { icon: "bolt",  color: "warn",    title: "Ship fast",       desc: "Pre-built, accessible components let you skip the boilerplate and focus on product." },
  { icon: "lock",  color: "success", title: "Secure by default", desc: "Components follow WCAG 2.1 AA out of the box. No accessibility debt baked in." },
];

export const Landing = {
  name: "Landing",
  render: () => {
    const header = (
      <TopHeader
        logoText="A1"
        logoHref="#"
        navItems={LANDING_NAV}
        loginButton={{ label: "Sign in", onClick: () => {} }}
      />
    );

    return (
      <PageLayout header={header} stickyHeader>

        {/* ── Hero — inverse + gradient ── */}
        <Section padding="lg" inverse surface="page" gradient="accent" gradientPosition="top-left" gap="lg">
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <div style={{ marginBlockEnd: "var(--base-spacing-16)" }}>
              <MessageBadge status="info" subtle>Now in public beta</MessageBadge>
            </div>
            <Heading
              as="h1"
              type="display"
              size={{ xs: "xl", lg: "xxl" }}
              style={{ marginBlockEnd: "var(--base-spacing-20)" }}
            >
              The design system that{" "}
              <HeadingMark variant="highlight">grows with you</HeadingMark>
            </Heading>
            <Paragraph size="lg" style={{ marginBlockEnd: "var(--base-spacing-40)" }}>
              Build consistent UIs without the overhead. A1 gives teams a shared token system and component library that stays in sync from design to code.
            </Paragraph>
            <ButtonContainer align="center">
              <Button variant="primary" size="lg">Get started free</Button>
              <Button variant="secondary" size="lg">See the docs</Button>
            </ButtonContainer>
          </div>
        </Section>

        {/* ── Feature highlights ── */}
        <Section padding="lg" gap="lg">
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <Heading as="h2" type="display" size="sm" style={{ marginBlockEnd: "var(--base-spacing-12)" }}>
              One source of truth
            </Heading>
            <Paragraph color="muted">
              Tokens bridge design and engineering. Components deliver them reliably, every time.
            </Paragraph>
          </div>
          <Grid columns={3} gap="lg">
            {LANDING_FEATURES.map(({ icon, color, title, desc }) => (
              <Card key={title} heroIcon={icon} heroColor={color}>
                <div style={{ padding: "var(--base-spacing-20)" }}>
                  <Heading as="h3" type="heading" size="sm" style={{ marginBlockEnd: "var(--base-spacing-8)" }}>
                    {title}
                  </Heading>
                  <Paragraph size="sm" color="muted">{desc}</Paragraph>
                </div>
              </Card>
            ))}
          </Grid>
        </Section>

        {/* ── Social proof strip ── */}
        <Section padding="sm" surface="panel" gradient="info" gradientPosition="center">
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "var(--base-spacing-32)",
              textAlign: "center",
            }}
          >
            {[
              { value: "50k+", label: "Components rendered daily" },
              { value: "200+", label: "Teams using A1 in prod" },
              { value: "99.9%", label: "Accessibility pass rate" },
            ].map(({ value, label }) => (
              <div key={label}>
                <Heading as="p" type="display" size="md" color="accent" style={{ marginBlockEnd: "var(--base-spacing-4)" }}>
                  {value}
                </Heading>
                <Paragraph size="sm" color="muted">{label}</Paragraph>
              </div>
            ))}
          </div>
        </Section>

        {/* ── CTA ── */}
        <Section padding="lg" inverse surface="page" gradient="accent" gradientPosition="bottom" style={{ textAlign: "center" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <Heading
              as="h2"
              type="display"
              size="sm"
              style={{ marginBlockEnd: "var(--base-spacing-16)" }}
            >
              Start shipping better UIs today
            </Heading>
            <Paragraph style={{ marginBlockEnd: "var(--base-spacing-32)" }}>
              Free for individuals. Scales with your team.
            </Paragraph>
          </div>
          <ButtonContainer align="center">
            <Button variant="primary" size="lg">Create free account</Button>
            <Button variant="secondary" size="lg">Talk to us</Button>
          </ButtonContainer>
        </Section>

      </PageLayout>
    );
  },
};

// ── Details ────────────────────────────────────────────────────────────────────

export const Details = {
  name: "Details",
  render: () => {
    const header = (
      <TopHeader logoText="A1 Platform" logoHref="#" navItems={SHARED_NAV} actions={SHARED_ACTIONS} />
    );

    const METADATA = [
      { label: "Status", value: "In progress" },
      { label: "Owner", value: "Alex Kim" },
      { label: "Due date", value: "Jun 15, 2026" },
      { label: "Team", value: "Design Systems" },
      { label: "Priority", value: "High" },
    ];

    const aside = (
      <div style={{ padding: "var(--base-spacing-24)", display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
        <Heading as="h3" type="heading" size="sm">Project details</Heading>
        {METADATA.map(({ label, value }) => (
          <div key={label}>
            <Paragraph size="xs" color="muted">{label}</Paragraph>
            <Paragraph size="sm">{value}</Paragraph>
          </div>
        ))}
        <Button variant="secondary" size="sm">Edit details</Button>
      </div>
    );

    return (
      <PageLayout header={header} aside={aside} stickyHeader>
        <Section gap="md">
          <div>
            <MessageBadge status="info" subtle>In progress</MessageBadge>
          </div>
          <Heading as="h1" type="heading" size="xl">Design token architecture v2</Heading>
          <Paragraph color="muted" size="lg">
            A complete revision of the token naming convention and structure to support multi-brand theming, dark mode, and component-level overrides.
          </Paragraph>
          <Paragraph>
            Consequat anim esse aliqua magna esse officia proident exercitation. Amet ullamco commodo laborum Lorem aliqua eu aliquip duis elit. Exercitation nostrud cupidatat aliqua labore aliquip sint eiusmod nisi commodo.
          </Paragraph>
          <Heading as="h2" type="heading" size="md">Background</Heading>
          <Paragraph>
            Sint eiusmod ut mollit mollit sit nisi sint duis amet sunt labore sunt. Incididunt velit velit et ut eu eiusmod minim irure Lorem aute. Sunt laborum nulla ea labore dolore est eu duis non cillum aliquip velit. Deserunt do magna consectetur ut dolor incididunt occaecat labore.
          </Paragraph>
          <Paragraph>
            Aute enim et exercitation aute sit duis officia. In labore commodo in ullamco veniam dolor ut. Ex et culpa non duis adipisicing labore dolore enim velit sit nisi amet non.
          </Paragraph>
          <Heading as="h2" type="heading" size="md">Goals</Heading>
          <Paragraph>
            Excepteur enim enim occaecat qui nisi. Cupidatat do nisi nisi nostrud ea aute deserunt labore cillum enim laboris. Nisi labore aliqua officia ut cillum labore consectetur eiusmod.
          </Paragraph>
          <Paragraph>
            Consequat anim esse aliqua magna esse officia proident exercitation. Amet ullamco commodo laborum Lorem aliqua eu aliquip duis elit. Exercitation nostrud cupidatat aliqua labore aliquip.
          </Paragraph>
        </Section>
      </PageLayout>
    );
  },
};

// ── Form ───────────────────────────────────────────────────────────────────────

export const Form = {
  name: "Form",
  render: () => {
    const header = (
      <TopHeader logoText="A1 Platform" logoHref="#" navItems={SHARED_NAV} actions={SHARED_ACTIONS} />
    );

    return (
      <PageLayout header={header} stickyHeader>
        <Section>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Heading as="h1" type="heading" size="lg" style={{ marginBlockEnd: "var(--base-spacing-8)" }}>
              New project
            </Heading>
            <Paragraph color="muted" style={{ marginBlockEnd: "var(--base-spacing-40)" }}>
              Fill in the details below to create a new project.
            </Paragraph>

            <Fieldset legend="Project information" size="comfortable">
              <FieldRow>
                <TextField label="Project name" placeholder="e.g. Design system v3" required />
              </FieldRow>
              <FieldRow>
                <TextareaField label="Description" placeholder="What is this project about?" />
              </FieldRow>
              <FieldRow>
                <SelectField label="Team">
                  <option value="">Select a team</option>
                  <option value="design">Design</option>
                  <option value="eng">Engineering</option>
                  <option value="product">Product</option>
                </SelectField>
                <SelectField label="Priority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </SelectField>
              </FieldRow>
            </Fieldset>

            <Fieldset
              legend="Timeline"
              size="comfortable"
              style={{ marginBlockStart: "var(--base-spacing-24)" }}
            >
              <FieldRow>
                <TextField label="Start date" type="date" />
                <TextField label="Due date" type="date" />
              </FieldRow>
            </Fieldset>

            <Fieldset
              legend="Team members"
              size="comfortable"
              style={{ marginBlockStart: "var(--base-spacing-24)" }}
            >
              <FieldRow>
                <TextField label="Owner" placeholder="name@example.com" required />
              </FieldRow>
              <FieldRow>
                <TextareaField label="Additional members" placeholder="One email per line" />
              </FieldRow>
            </Fieldset>

            <ButtonContainer style={{ marginBlockStart: "var(--base-spacing-32)" }}>
              <Button variant="primary">Create project</Button>
              <Button variant="secondary">Cancel</Button>
            </ButtonContainer>
          </div>
        </Section>
      </PageLayout>
    );
  },
};

// ── Editor ─────────────────────────────────────────────────────────────────────

export const Editor = {
  name: "Editor",
  render: () => {
    const EDITOR_NAV = [
      { id: "file", label: "File", href: "#" },
      { id: "edit", label: "Edit", href: "#" },
      { id: "view", label: "View", href: "#" },
    ];

    const header = (
      <TopHeader logoText="A1 Editor" logoHref="#" navItems={EDITOR_NAV} actions={SHARED_ACTIONS} />
    );

    const sidebar = (
      <SideNav open onClose={() => {}}>
        <SideNavItem as="button" icon="near_me" label="Select" active />
        <SideNavItem as="button" icon="crop_square" label="Rectangle" />
        <SideNavItem as="button" icon="circle" label="Ellipse" />
        <SideNavItem as="button" icon="title" label="Text" />
        <SideNavItem as="button" icon="image" label="Image" />
        <SideNavGroup icon="layers" label="Layers">
          <SideNavItem as="button" icon="widgets" label="Button group" />
          <SideNavItem as="button" icon="text_fields" label="Heading" />
          <SideNavItem as="button" icon="crop_square" label="Card" />
        </SideNavGroup>
      </SideNav>
    );

    const aside = (
      <div
        style={{
          width: 260,
          borderInlineStart: "1px solid var(--semantic-color-border-subtle)",
          overflowY: "auto",
          flexShrink: 0,
        }}
      >
        <Accordion label="Layout" defaultOpen size="sm">
          <div style={{ padding: "var(--base-spacing-4) var(--base-spacing-16) var(--base-spacing-16)" }}>
            <Fieldset size="compact" style={{ border: "none", padding: 0 }}>
              <FieldRow>
                <TextField label="X" defaultValue="120" />
                <TextField label="Y" defaultValue="80" />
              </FieldRow>
              <FieldRow>
                <TextField label="W" defaultValue="320" />
                <TextField label="H" defaultValue="48" />
              </FieldRow>
            </Fieldset>
          </div>
        </Accordion>
        <Accordion label="Appearance" size="sm">
          <div style={{ padding: "var(--base-spacing-4) var(--base-spacing-16) var(--base-spacing-16)" }}>
            <Fieldset size="compact" style={{ border: "none", padding: 0 }}>
              <FieldRow>
                <SelectField label="Fill">
                  <option>Solid</option>
                  <option>Gradient</option>
                  <option>None</option>
                </SelectField>
              </FieldRow>
              <FieldRow>
                <TextField label="Color" defaultValue="#006BE6" />
                <TextField label="Opacity" defaultValue="100%" />
              </FieldRow>
            </Fieldset>
          </div>
        </Accordion>
        <Accordion label="Typography" size="sm">
          <div style={{ padding: "var(--base-spacing-4) var(--base-spacing-16) var(--base-spacing-16)" }}>
            <Fieldset size="compact" style={{ border: "none", padding: 0 }}>
              <FieldRow>
                <SelectField label="Font family">
                  <option>Inter</option>
                  <option>Geist</option>
                  <option>System UI</option>
                </SelectField>
              </FieldRow>
              <FieldRow>
                <TextField label="Size" defaultValue="16" />
                <TextField label="Weight" defaultValue="400" />
              </FieldRow>
            </Fieldset>
          </div>
        </Accordion>
        <Accordion label="Constraints" size="sm">
          <div style={{ padding: "var(--base-spacing-4) var(--base-spacing-16) var(--base-spacing-16)" }}>
            <Fieldset size="compact" style={{ border: "none", padding: 0 }}>
              <FieldRow>
                <SelectField label="Horizontal">
                  <option>Left</option>
                  <option>Right</option>
                  <option>Center</option>
                  <option>Scale</option>
                </SelectField>
              </FieldRow>
              <FieldRow>
                <SelectField label="Vertical">
                  <option>Top</option>
                  <option>Bottom</option>
                  <option>Center</option>
                  <option>Scale</option>
                </SelectField>
              </FieldRow>
            </Fieldset>
          </div>
        </Accordion>
      </div>
    );

    return (
      <PageLayout header={header} sidebar={sidebar} aside={aside} stickyHeader viewportHeight>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--semantic-color-surface-panel)",
            minHeight: "100%",
            padding: "var(--base-spacing-48)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 800,
              background: "var(--semantic-color-surface-page)",
              borderRadius: "var(--base-radius-lg)",
              boxShadow: "var(--semantic-shadow-lg)",
              padding: "var(--base-spacing-48)",
            }}
          >
            <Heading as="h1" type="heading" size="xl" style={{ marginBlockEnd: "var(--base-spacing-16)" }}>
              Canvas preview
            </Heading>
            <Paragraph color="muted" style={{ marginBlockEnd: "var(--base-spacing-32)" }}>
              Select elements using the tool palette on the left to edit their properties in the panel on the right.
            </Paragraph>
            <Grid columns={3} gap="md">
              {["Component A", "Component B", "Component C"].map((label) => (
                <Card key={label}>
                  <div style={{ padding: "var(--base-spacing-16)" }}>
                    <Heading as="h3" type="heading" size="sm" style={{ marginBlockEnd: "var(--base-spacing-4)" }}>
                      {label}
                    </Heading>
                    <Paragraph size="sm" color="muted">Card content area.</Paragraph>
                  </div>
                </Card>
              ))}
            </Grid>
          </div>
        </div>
      </PageLayout>
    );
  },
};

// ── Shared summary data ────────────────────────────────────────────────────────

const SUMMARY_HEADER = (
  <TopHeader logoText="A1 Platform" logoHref="#" />
);

const SUBMITTED_PROJECT = [
  { label: "Project name",  value: "Design token architecture v2" },
  { label: "Team",          value: "Design Systems" },
  { label: "Priority",      value: "High" },
  { label: "Owner",         value: "Alex Kim — alex@example.com" },
  { label: "Start date",    value: "Jun 1, 2026" },
  { label: "Due date",      value: "Jun 15, 2026" },
  { label: "Description",   value: "A complete revision of the token naming convention and structure to support multi-brand theming, dark mode, and component-level overrides." },
];

function SummaryRow({ label, value }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: "var(--base-spacing-16)",
        padding: "var(--base-spacing-12) 0",
        borderBottom: "1px solid var(--semantic-color-border-subtle)",
      }}
    >
      <Paragraph size="sm" color="muted">{label}</Paragraph>
      <Paragraph size="sm">{value}</Paragraph>
    </div>
  );
}

// ── Summary — Success ──────────────────────────────────────────────────────────

export const SummarySuccess = {
  name: "Summary — Success",
  render: () => (
    <PageLayout header={SUMMARY_HEADER} stickyHeader>

      {/* ── Status hero ── */}
      <Section padding="md" surface="page" gradient="success" gradientPosition="center">
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--base-spacing-16)",
          }}
        >
          <Icon
            name="check_circle"
            style={{
              fontSize: 64,
              color: "var(--semantic-color-status-success-background)",
            }}
          />
          <div>
            <Heading as="h1" type="display" size="md" style={{ marginBlockEnd: "var(--base-spacing-8)" }}>
              Project created
            </Heading>
            <Paragraph color="muted" size="lg">
              Your project has been created and your team has been notified.
            </Paragraph>
          </div>
          <MessageBadge status="success">Submitted Jun 1, 2026 at 10:42 am</MessageBadge>
        </div>
      </Section>

      {/* ── Summary ── */}
      <Section padding="md" gap="lg">
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Heading as="h2" type="heading" size="md" style={{ marginBlockEnd: "var(--base-spacing-4)" }}>
            Submission summary
          </Heading>
          <Paragraph color="muted" size="sm" style={{ marginBlockEnd: "var(--base-spacing-24)" }}>
            Review what was submitted. You can edit these details from the project settings at any time.
          </Paragraph>
          <Card>
            <div style={{ padding: "var(--base-spacing-4) var(--base-spacing-24)" }}>
              {SUBMITTED_PROJECT.map((row) => (
                <SummaryRow key={row.label} {...row} />
              ))}
            </div>
          </Card>
          <ButtonContainer style={{ marginBlockStart: "var(--base-spacing-32)" }}>
            <Button variant="primary">Go to project</Button>
            <Button variant="secondary">Back to dashboard</Button>
          </ButtonContainer>
        </div>
      </Section>

    </PageLayout>
  ),
};

// ── Summary — Error ────────────────────────────────────────────────────────────

export const SummaryError = {
  name: "Summary — Error",
  render: () => (
    <PageLayout header={SUMMARY_HEADER} stickyHeader>

      {/* ── System-level error banner ── */}
      <Banner
        variant="system"
        status="error"
        title="Submission failed"
      >
        We couldn't create your project. Your data has been saved and you can try again below.
      </Banner>

      {/* ── Status section ── */}
      <Section padding="md">
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--base-spacing-20)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-16)" }}>
            <Icon
              name="error"
              style={{
                fontSize: 48,
                color: "var(--semantic-color-status-error-background)",
                flexShrink: 0,
              }}
            />
            <div>
              <Heading as="h1" type="heading" size="xl" style={{ marginBlockEnd: "var(--base-spacing-4)" }}>
                Something went wrong
              </Heading>
              <Paragraph color="muted">
                The project could not be created due to a server error (500). Your input has been preserved below.
              </Paragraph>
            </div>
          </div>

          <Card>
            <div style={{ padding: "var(--base-spacing-16) var(--base-spacing-20)", display: "flex", flexDirection: "column", gap: "var(--base-spacing-8)" }}>
              <Paragraph size="sm" style={{ fontWeight: 600 }}>What you can do</Paragraph>
              {[
                "Try submitting again — the issue may be temporary.",
                "Check your connection and retry if you're offline.",
                "Contact support if the problem persists.",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: "var(--base-spacing-8)", alignItems: "flex-start" }}>
                  <Icon name="arrow_right" style={{ fontSize: 16, marginBlockStart: 2, flexShrink: 0, color: "var(--semantic-color-text-muted)" }} />
                  <Paragraph size="sm" color="muted">{item}</Paragraph>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* ── Retained summary ── */}
      <Section padding="none" style={{ paddingBlockEnd: "var(--base-spacing-64)", paddingInline: "var(--base-spacing-40)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-8)", marginBlockEnd: "var(--base-spacing-16)" }}>
            <Heading as="h2" type="heading" size="md">Your saved data</Heading>
            <MessageBadge status="warn" subtle>Not submitted</MessageBadge>
          </div>
          <Paragraph color="muted" size="sm" style={{ marginBlockEnd: "var(--base-spacing-24)" }}>
            Nothing has been lost. Review your details below before trying again.
          </Paragraph>
          <Card>
            <div style={{ padding: "var(--base-spacing-4) var(--base-spacing-24)" }}>
              {SUBMITTED_PROJECT.map((row) => (
                <SummaryRow key={row.label} {...row} />
              ))}
            </div>
          </Card>
          <ButtonContainer style={{ marginBlockStart: "var(--base-spacing-32)" }}>
            <Button variant="primary">Try again</Button>
            <Button variant="secondary">Edit details</Button>
            <Button variant="tertiary">Contact support</Button>
          </ButtonContainer>
        </div>
      </Section>

    </PageLayout>
  ),
};

// ── Login ──────────────────────────────────────────────────────────────────────

const LOGIN_FEATURES = [
  "40+ accessible components, ready to use",
  "Three-tier design token system",
  "Figma Code Connect for instant handoff",
  "Built-in dark mode, no configuration needed",
];

export const Login = {
  name: "Login",
  render: () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* ── Left: branding panel ── */}
        <Section
          as="div"
          padding="lg"
          inverse
          surface="page"
          gradient="accent"
          gradientPosition="top-left"
          style={{
            flex: "0 0 44%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "var(--base-spacing-64)",
          }}
        >
          {/* Logo */}
          <Heading as="div" type="heading" size="md">A1</Heading>

          {/* Headline + features */}
          <div>
            <Heading
              as="h2"
              type="display"
              size="lg"
              style={{ marginBlockEnd: "var(--base-spacing-20)" }}
            >
              Build faster,{" "}
              <HeadingMark variant="underline" underlineStyle="swoop">
                ship together
              </HeadingMark>
            </Heading>
            <Paragraph size="lg" style={{ marginBlockEnd: "var(--base-spacing-32)" }}>
              Everything your team needs to build consistent, accessible UIs — all in one place.
            </Paragraph>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
              {LOGIN_FEATURES.map((feature) => (
                <div key={feature} style={{ display: "flex", gap: "var(--base-spacing-10)", alignItems: "flex-start" }}>
                  <Icon
                    name="check_circle"
                    aria-hidden="true"
                    style={{
                      fontSize: 20,
                      flexShrink: 0,
                      marginBlockStart: 2,
                      color: "var(--semantic-color-status-success-background)",
                    }}
                  />
                  <Paragraph size="sm">{feature}</Paragraph>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div
            style={{
              borderTop: "1px solid var(--semantic-color-border-subtle)",
              paddingBlockStart: "var(--base-spacing-24)",
            }}
          >
            <Paragraph size="sm" style={{ fontStyle: "italic", marginBlockEnd: "var(--base-spacing-8)" }}>
              "A1 cut our UI review cycles in half. Design and engineering finally share the same language."
            </Paragraph>
            <Paragraph size="xs" color="muted">— Jordan Lee, Head of Design at Vanta</Paragraph>
          </div>
        </Section>

        {/* ── Right: form panel ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--base-spacing-48)",
            background: "var(--semantic-color-surface-page)",
            overflowY: "auto",
          }}
        >
          <div style={{ width: "100%", maxWidth: 400 }}>

            {/* Form header */}
            <div style={{ marginBlockEnd: "var(--base-spacing-32)" }}>
              <Heading as="h1" type="heading" size="lg" style={{ marginBlockEnd: "var(--base-spacing-8)" }}>
                Sign in to your account
              </Heading>
              <Paragraph color="muted">Welcome back. Enter your details to continue.</Paragraph>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-20)" }}
            >
              <TextField
                label="Email address"
                type="email"
                autoComplete="email"
                required
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                style={{ paddingInlineEnd: "44px" }}
                inputOverlay={
                  <IconButton
                    icon={showPassword ? "visibility_off" : "visibility"}
                    label={showPassword ? "Hide password" : "Show password"}
                    variant="tertiary"
                    onClick={() => setShowPassword((v) => !v)}
                    style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)" }}
                  />
                }
              />

              {/* Remember me + forgot password */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Switch label="Remember me" />
                <a
                  href="#"
                  style={{
                    color: "var(--semantic-color-action-background)",
                    fontSize: "var(--semantic-font-size-body-sm)",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Primary action — full width */}
              <Button variant="primary" type="submit" style={{ width: "100%" }}>
                Sign in
              </Button>

              {/* OR divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-12)" }}>
                <div style={{ flex: 1, height: 1, background: "var(--semantic-color-border-subtle)" }} role="presentation" />
                <Paragraph size="sm" color="muted">or continue with</Paragraph>
                <div style={{ flex: 1, height: 1, background: "var(--semantic-color-border-subtle)" }} role="presentation" />
              </div>

              {/* Social login — equal-width buttons */}
              <div style={{ display: "flex", gap: "var(--base-spacing-12)" }}>
                <Button variant="secondary" style={{ flex: 1 }}>
                  <Icon name="language" aria-hidden="true" style={{ fontSize: 18 }} />
                  {" "}Google
                </Button>
                <Button variant="secondary" style={{ flex: 1 }}>
                  <Icon name="terminal" aria-hidden="true" style={{ fontSize: 18 }} />
                  {" "}GitHub
                </Button>
              </div>

              {/* Sign up link */}
              <Paragraph size="sm" color="muted" style={{ textAlign: "center" }}>
                Don't have an account?{" "}
                <a
                  href="#"
                  style={{
                    color: "var(--semantic-color-action-background)",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Sign up for free
                </a>
              </Paragraph>
            </form>
          </div>
        </div>

      </div>
    );
  },
};

// ── 404 — Not Found ────────────────────────────────────────────────────────────

export const NotFound = {
  name: "404 — Not Found",
  render: () => {
    const header = (
      <TopHeader logoText="A1 Platform" logoHref="#" navItems={SHARED_NAV} actions={SHARED_ACTIONS} />
    );

    return (
      <PageLayout header={header} stickyHeader>
        <Section
          padding="lg"
          surface="page"
          gradient="accent"
          gradientPosition="center"
          style={{
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 520 }}>

            {/* Ghost 404 — decorative, aria-hidden */}
            <p
              aria-hidden="true"
              style={{
                margin: 0,
                lineHeight: 1,
                opacity: 0.07,
                userSelect: "none",
                color: "var(--semantic-color-action-background)",
                fontSize: "clamp(120px, 20vw, 240px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
              }}
            >
              404
            </p>

            <div style={{ marginBlockStart: "calc(var(--base-spacing-16) * -1)", marginBlockEnd: "var(--base-spacing-16)" }}>
              <MessageBadge status="error">Error 404</MessageBadge>
            </div>

            <Heading
              as="h1"
              type="heading"
              size="xl"
              style={{ marginBlockEnd: "var(--base-spacing-16)" }}
            >
              Page not found
            </Heading>

            <Paragraph
              color="muted"
              style={{ marginBlockEnd: "var(--base-spacing-40)" }}
            >
              The page you're looking for doesn't exist or may have been moved. Check the URL or head back to somewhere familiar.
            </Paragraph>

            <ButtonContainer align="center">
              <Button variant="primary">Go to home</Button>
              <Button variant="secondary">Go back</Button>
            </ButtonContainer>

          </div>
        </Section>
      </PageLayout>
    );
  },
};

// ── Documentation ──────────────────────────────────────────────────────────────

const DOC_NAV = [
  { id: "home", label: "Home", icon: "home", href: "#", iconOnly: true },
  { id: "components", label: "Components", href: "#", active: true },
  { id: "tokens", label: "Tokens", href: "#" },
  { id: "patterns", label: "Patterns", href: "#" },
];

const DOC_SECTIONS = [
  { id: "overview",      label: "Overview" },
  { id: "anatomy",       label: "Anatomy" },
  { id: "rules",         label: "Usage rules" },
  { id: "accessibility", label: "Accessibility" },
  { id: "preview",       label: "Theme & mode" },
  { id: "properties",    label: "Properties" },
];

const PROP_TABLE = [
  { name: "variant",   type: '"primary" | "secondary" | "tertiary" | "destructive"', def: '"primary"',   desc: "Visual style of the button." },
  { name: "size",      type: '"sm" | "md" | "lg"',          def: '"md"',       desc: "Height and font-size preset." },
  { name: "disabled",  type: "boolean",                     def: "false",      desc: "Prevents interaction and dims the button." },
  { name: "loading",   type: "boolean",                     def: "false",      desc: "Shows a spinner and blocks click events." },
  { name: "icon",      type: "string",                      def: "undefined",  desc: "Material symbol name for a leading icon." },
  { name: "iconEnd",   type: "string",                      def: "undefined",  desc: "Material symbol name for a trailing icon." },
  { name: "type",      type: '"button" | "submit" | "reset"', def: '"button"', desc: "Native button type attribute." },
  { name: "onClick",   type: "(e: MouseEvent) => void",     def: "undefined",  desc: "Click handler." },
  { name: "className", type: "string",                      def: '""',         desc: "Additional CSS class names." },
];

const ANATOMY_PARTS = [
  { num: "1", label: "Container",      desc: "The interactive button element. Sets size, radius, and all interactive states." },
  { num: "2", label: "Leading icon",   desc: "Optional 20 px icon placed before the label. Reinforces the action visually." },
  { num: "3", label: "Label",          desc: "Action text in sentence case. The only required child." },
  { num: "4", label: "Trailing icon",  desc: "Optional icon placed after the label — typically used for dropdowns or external links." },
  { num: "5", label: "Focus ring",     desc: "2 px outline on :focus-visible. Never suppressed — it's a WCAG requirement." },
];

function CalloutNumber({ n, color }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: color,
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {n}
    </span>
  );
}

const CALLOUT_COLORS = [
  "var(--semantic-color-action-background)",
  "var(--semantic-color-status-info-background)",
  "var(--semantic-color-status-success-background)",
  "var(--semantic-color-status-warn-background)",
  "var(--semantic-color-status-error-background)",
];

function DocSection({ id, title, children }) {
  return (
    <section aria-labelledby={id} style={{ scrollMarginTop: "96px" }} id={id}>
      <Heading
        as="h2"
        type="heading"
        size="lg"
        tabIndex={-1}
        style={{ marginBlockEnd: "var(--base-spacing-24)", paddingBlockStart: "var(--base-spacing-48)" }}
      >
        {title}
      </Heading>
      {children}
    </section>
  );
}

export const Documentation = {
  name: "Documentation",
  render: () => {
    const header = (
      <TopHeader logoText="A1 Docs" logoHref="#" navItems={DOC_NAV} actions={SHARED_ACTIONS} />
    );

    const aside = (
      <div style={{ position: "sticky", top: 80, maxHeight: "calc(100vh - 96px)", overflowY: "auto" }}>
        <PageNav sections={DOC_SECTIONS} />
      </div>
    );

    return (
      <PageLayout header={header} aside={aside} asidePlacement="end" stickyHeader>
        <Section padding="md" gap="lg" style={{ maxWidth: 760 }}>

          {/* ── Page header ── */}
          <div style={{ paddingBlockEnd: "var(--base-spacing-16)", borderBottom: "1px solid var(--semantic-color-border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-8)", marginBlockEnd: "var(--base-spacing-12)" }}>
              <Paragraph size="xs" color="muted">Components</Paragraph>
              <Icon name="chevron_right" style={{ fontSize: 14, color: "var(--semantic-color-text-muted)" }} aria-hidden="true" />
              <Paragraph size="xs" color="muted">Actions</Paragraph>
            </div>
            <Heading as="h1" type="heading" size="xl" style={{ marginBlockEnd: "var(--base-spacing-8)" }}>
              Button
            </Heading>
            <Paragraph color="muted" size="lg">
              Triggers an action or navigates to a destination. Buttons communicate what will happen when a user interacts with them.
            </Paragraph>
          </div>

          {/* ── Overview ── */}
          <DocSection id="overview" title="Overview">
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)" }}>
              <Paragraph>
                Buttons are the primary mechanism for user-initiated actions. The <code style={{ fontFamily: "monospace", fontSize: "0.875em", background: "var(--semantic-color-surface-panel)", padding: "1px 5px", borderRadius: 4 }}>variant</code> prop controls visual hierarchy — use one primary button per view to avoid competing calls to action.
              </Paragraph>

              <div>
                <Paragraph size="sm" color="muted" style={{ marginBlockEnd: "var(--base-spacing-12)", fontWeight: 600 }}>Variants</Paragraph>
                <Card>
                  <div style={{ padding: "var(--base-spacing-24)", display: "flex", gap: "var(--base-spacing-12)", flexWrap: "wrap", alignItems: "center" }}>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="tertiary">Tertiary</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </Card>
              </div>

              <div>
                <Paragraph size="sm" color="muted" style={{ marginBlockEnd: "var(--base-spacing-12)", fontWeight: 600 }}>Sizes</Paragraph>
                <Card>
                  <div style={{ padding: "var(--base-spacing-24)", display: "flex", gap: "var(--base-spacing-12)", flexWrap: "wrap", alignItems: "center" }}>
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary" size="md">Medium</Button>
                    <Button variant="primary" size="lg">Large</Button>
                  </div>
                </Card>
              </div>

              <div>
                <Paragraph size="sm" color="muted" style={{ marginBlockEnd: "var(--base-spacing-12)", fontWeight: 600 }}>States</Paragraph>
                <Card>
                  <div style={{ padding: "var(--base-spacing-24)", display: "flex", gap: "var(--base-spacing-12)", flexWrap: "wrap", alignItems: "center" }}>
                    <Button variant="primary">Default</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                    <Button variant="secondary">Default</Button>
                    <Button variant="secondary" disabled>Disabled</Button>
                  </div>
                </Card>
              </div>
            </div>
          </DocSection>

          {/* ── Anatomy ── */}
          <DocSection id="anatomy" title="Anatomy">
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)" }}>
              {/* Visual */}
              <Card>
                <div style={{ padding: "var(--base-spacing-40)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--base-spacing-32)", background: "var(--semantic-color-surface-panel)" }}>
                  {/* Button with annotation brackets */}
                  <div style={{ position: "relative", display: "inline-flex" }}>
                    {/* Outer container annotation */}
                    <div style={{
                      position: "absolute",
                      inset: -12,
                      border: `2px dashed ${CALLOUT_COLORS[0]}`,
                      borderRadius: "var(--base-radius-control)",
                      pointerEvents: "none",
                    }} aria-hidden="true" />
                    {/* Callout 1 badge */}
                    <div style={{ position: "absolute", top: -20, left: -20 }} aria-hidden="true">
                      <CalloutNumber n="1" color={CALLOUT_COLORS[0]} />
                    </div>

                    {/* Rendered button */}
                    <Button variant="primary" size="lg">
                      <Icon name="add" aria-hidden="true" />
                      Add component
                      <Icon name="chevron_right" aria-hidden="true" />
                    </Button>

                    {/* Icon annotation (leading) */}
                    <div style={{ position: "absolute", top: -24, left: 12 }} aria-hidden="true">
                      <CalloutNumber n="2" color={CALLOUT_COLORS[1]} />
                    </div>
                    {/* Label annotation */}
                    <div style={{ position: "absolute", bottom: -24, left: "50%", transform: "translateX(-50%)" }} aria-hidden="true">
                      <CalloutNumber n="3" color={CALLOUT_COLORS[2]} />
                    </div>
                    {/* Trailing icon annotation */}
                    <div style={{ position: "absolute", top: -24, right: 12 }} aria-hidden="true">
                      <CalloutNumber n="4" color={CALLOUT_COLORS[3]} />
                    </div>
                    {/* Focus ring example */}
                    <div style={{
                      position: "absolute",
                      inset: -16,
                      border: `2px solid ${CALLOUT_COLORS[4]}`,
                      borderRadius: "var(--base-radius-control)",
                      opacity: 0.5,
                      pointerEvents: "none",
                    }} aria-hidden="true" />
                    <div style={{ position: "absolute", bottom: -20, right: -20 }} aria-hidden="true">
                      <CalloutNumber n="5" color={CALLOUT_COLORS[4]} />
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ padding: "var(--base-spacing-4) var(--base-spacing-24) var(--base-spacing-24)" }}>
                  {ANATOMY_PARTS.map(({ num, label, desc }, i) => (
                    <div
                      key={num}
                      style={{
                        display: "flex",
                        gap: "var(--base-spacing-12)",
                        alignItems: "flex-start",
                        padding: "var(--base-spacing-10) 0",
                        borderBottom: i < ANATOMY_PARTS.length - 1 ? "1px solid var(--semantic-color-border-subtle)" : undefined,
                      }}
                    >
                      <CalloutNumber n={num} color={CALLOUT_COLORS[i]} />
                      <div>
                        <Paragraph size="sm" style={{ fontWeight: 600, marginBlockEnd: "var(--base-spacing-2)" }}>{label}</Paragraph>
                        <Paragraph size="sm" color="muted">{desc}</Paragraph>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </DocSection>

          {/* ── Rules ── */}
          <DocSection id="rules" title="Usage rules">
            <Grid columns={2} gap="md">
              {/* Do */}
              <Card>
                <div style={{ height: 4, background: "var(--semantic-color-status-success-background)" }} />
                <div style={{ padding: "var(--base-spacing-20)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-8)", marginBlockEnd: "var(--base-spacing-12)" }}>
                    <Icon name="check_circle" style={{ color: "var(--semantic-color-status-success-background)", fontSize: 20 }} aria-hidden="true" />
                    <Paragraph size="sm" style={{ fontWeight: 700, color: "var(--semantic-color-status-success-background)" }}>Do</Paragraph>
                  </div>
                  <div style={{ marginBlockEnd: "var(--base-spacing-16)", padding: "var(--base-spacing-16)", background: "var(--semantic-color-surface-panel)", borderRadius: "var(--base-radius-md)", display: "flex", gap: "var(--base-spacing-8)" }}>
                    <Button variant="primary" size="sm">Save changes</Button>
                    <Button variant="secondary" size="sm">Cancel</Button>
                  </div>
                  <Paragraph size="sm" color="muted">Use one primary button per context and pair it with a lower-emphasis option for the secondary action.</Paragraph>
                </div>
              </Card>

              <Card>
                <div style={{ height: 4, background: "var(--semantic-color-status-error-background)" }} />
                <div style={{ padding: "var(--base-spacing-20)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-8)", marginBlockEnd: "var(--base-spacing-12)" }}>
                    <Icon name="cancel" style={{ color: "var(--semantic-color-status-error-background)", fontSize: 20 }} aria-hidden="true" />
                    <Paragraph size="sm" style={{ fontWeight: 700, color: "var(--semantic-color-status-error-background)" }}>Don't</Paragraph>
                  </div>
                  <div style={{ marginBlockEnd: "var(--base-spacing-16)", padding: "var(--base-spacing-16)", background: "var(--semantic-color-surface-panel)", borderRadius: "var(--base-radius-md)", display: "flex", gap: "var(--base-spacing-8)" }}>
                    <Button variant="primary" size="sm">Save</Button>
                    <Button variant="primary" size="sm">Submit</Button>
                    <Button variant="primary" size="sm">Publish</Button>
                  </div>
                  <Paragraph size="sm" color="muted">Avoid multiple primary buttons in the same view — it creates visual competition and confuses priority.</Paragraph>
                </div>
              </Card>

              <Card>
                <div style={{ height: 4, background: "var(--semantic-color-status-success-background)" }} />
                <div style={{ padding: "var(--base-spacing-20)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-8)", marginBlockEnd: "var(--base-spacing-12)" }}>
                    <Icon name="check_circle" style={{ color: "var(--semantic-color-status-success-background)", fontSize: 20 }} aria-hidden="true" />
                    <Paragraph size="sm" style={{ fontWeight: 700, color: "var(--semantic-color-status-success-background)" }}>Do</Paragraph>
                  </div>
                  <div style={{ marginBlockEnd: "var(--base-spacing-16)", padding: "var(--base-spacing-16)", background: "var(--semantic-color-surface-panel)", borderRadius: "var(--base-radius-md)" }}>
                    <Button variant="destructive" size="sm">Delete project</Button>
                  </div>
                  <Paragraph size="sm" color="muted">Use the destructive variant specifically for irreversible, data-loss actions like deleting or revoking access.</Paragraph>
                </div>
              </Card>

              <Card>
                <div style={{ height: 4, background: "var(--semantic-color-status-error-background)" }} />
                <div style={{ padding: "var(--base-spacing-20)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-8)", marginBlockEnd: "var(--base-spacing-12)" }}>
                    <Icon name="cancel" style={{ color: "var(--semantic-color-status-error-background)", fontSize: 20 }} aria-hidden="true" />
                    <Paragraph size="sm" style={{ fontWeight: 700, color: "var(--semantic-color-status-error-background)" }}>Don't</Paragraph>
                  </div>
                  <div style={{ marginBlockEnd: "var(--base-spacing-16)", padding: "var(--base-spacing-16)", background: "var(--semantic-color-surface-panel)", borderRadius: "var(--base-radius-md)", display: "flex", gap: "var(--base-spacing-8)" }}>
                    <Button variant="destructive" size="sm">Submit form</Button>
                    <Button variant="destructive" size="sm">Cancel</Button>
                  </div>
                  <Paragraph size="sm" color="muted">Don't use the destructive style for ordinary actions — it carries strong emotional weight and will cause anxiety.</Paragraph>
                </div>
              </Card>
            </Grid>
          </DocSection>

          {/* ── Accessibility ── */}
          <DocSection id="accessibility" title="Accessibility">
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
              {[
                {
                  icon: "keyboard",
                  title: "Keyboard interaction",
                  body: "Space and Enter both activate the button. The native <button> element provides this for free — never replace it with a <div> or <span>.",
                },
                {
                  icon: "visibility",
                  title: "Focus visible",
                  body: "A 2 px outline appears on :focus-visible. This is never overridden. Users who navigate by keyboard or switch device rely on this indicator.",
                },
                {
                  icon: "label",
                  title: "Icon-only buttons",
                  body: "When no visible label is present, pass an aria-label that describes the action. The icon alone is not sufficient for screen readers.",
                },
                {
                  icon: "block",
                  title: "Disabled state",
                  body: "Disabled buttons use aria-disabled rather than the disabled attribute where possible. This keeps the element in the tab order and allows tooltips explaining why the action is unavailable.",
                },
                {
                  icon: "contrast",
                  title: "Colour contrast",
                  body: "All variants meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text) in both light and dark modes. The primary button meets AAA (7:1).",
                },
              ].map(({ icon, title, body }) => (
                <Card key={title}>
                  <div style={{ padding: "var(--base-spacing-16) var(--base-spacing-20)", display: "flex", gap: "var(--base-spacing-16)", alignItems: "flex-start" }}>
                    <Icon name={icon} aria-hidden="true" style={{ fontSize: 20, flexShrink: 0, marginBlockStart: 2, color: "var(--semantic-color-action-background)" }} />
                    <div>
                      <Paragraph size="sm" style={{ fontWeight: 600, marginBlockEnd: "var(--base-spacing-4)" }}>{title}</Paragraph>
                      <Paragraph size="sm" color="muted">{body}</Paragraph>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </DocSection>

          {/* ── Theme & mode preview ── */}
          <DocSection id="preview" title="Theme & mode">
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
              <Paragraph color="muted">
                Button tokens resolve through the semantic layer — switching colour scheme or theme requires no per-component changes.
              </Paragraph>

              <Grid columns={2} gap="md">
                {/* Light */}
                <Card>
                  <div style={{ padding: "var(--base-spacing-12) var(--base-spacing-20)", borderBottom: "1px solid var(--semantic-color-border-subtle)" }}>
                    <Paragraph size="xs" color="muted" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Light mode</Paragraph>
                  </div>
                  <div style={{ padding: "var(--base-spacing-24)", display: "flex", gap: "var(--base-spacing-8)", flexWrap: "wrap" }}>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="tertiary">Tertiary</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </Card>

                {/* Dark */}
                <Card className="a1-inverse" style={{ background: "var(--semantic-color-surface-page)" }}>
                  <div style={{ padding: "var(--base-spacing-12) var(--base-spacing-20)", borderBottom: "1px solid var(--semantic-color-border-subtle)" }}>
                    <Paragraph size="xs" color="muted" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Dark mode</Paragraph>
                  </div>
                  <div style={{ padding: "var(--base-spacing-24)", display: "flex", gap: "var(--base-spacing-8)", flexWrap: "wrap" }}>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="tertiary">Tertiary</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </Card>
              </Grid>

              {/* Token reference */}
              <Card>
                <div style={{ padding: "var(--base-spacing-12) var(--base-spacing-20)", borderBottom: "1px solid var(--semantic-color-border-subtle)" }}>
                  <Paragraph size="xs" color="muted" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Token reference</Paragraph>
                </div>
                <div style={{ padding: "var(--base-spacing-4) var(--base-spacing-20) var(--base-spacing-20)" }}>
                  {[
                    { token: "--component-button-primary-background",   role: "Primary fill"         },
                    { token: "--component-button-primary-foreground",   role: "Primary label"        },
                    { token: "--component-button-secondary-border",     role: "Secondary border"     },
                    { token: "--component-button-radius",               role: "Corner radius"        },
                    { token: "--component-button-height-md",            role: "Default height"       },
                  ].map(({ token, role }, i, arr) => (
                    <div
                      key={token}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: "var(--base-spacing-16)",
                        padding: "var(--base-spacing-10) 0",
                        borderBottom: i < arr.length - 1 ? "1px solid var(--semantic-color-border-subtle)" : undefined,
                      }}
                    >
                      <code style={{ fontFamily: "monospace", fontSize: 12, color: "var(--semantic-color-action-background)" }}>{token}</code>
                      <Paragraph size="xs" color="muted">{role}</Paragraph>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </DocSection>

          {/* ── Properties ── */}
          <DocSection id="properties" title="Properties">
            <Card style={{ overflow: "hidden" }}>
              {/* Table header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 100px 1fr",
                  gap: 0,
                  background: "var(--semantic-color-surface-panel)",
                  borderBottom: "1px solid var(--semantic-color-border-subtle)",
                  padding: "var(--base-spacing-10) var(--base-spacing-20)",
                }}
              >
                {["Prop", "Type", "Default", "Description"].map((col) => (
                  <Paragraph key={col} size="xs" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--semantic-color-text-muted)" }}>
                    {col}
                  </Paragraph>
                ))}
              </div>

              {/* Rows */}
              {PROP_TABLE.map(({ name, type, def, desc }, i) => (
                <div
                  key={name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr 100px 1fr",
                    gap: 0,
                    padding: "var(--base-spacing-12) var(--base-spacing-20)",
                    borderBottom: i < PROP_TABLE.length - 1 ? "1px solid var(--semantic-color-border-subtle)" : undefined,
                    alignItems: "start",
                  }}
                >
                  <code style={{ fontFamily: "monospace", fontSize: 13, color: "var(--semantic-color-action-background)", fontWeight: 600 }}>
                    {name}
                  </code>
                  <code style={{ fontFamily: "monospace", fontSize: 12, color: "var(--semantic-color-text-muted)", paddingInlineEnd: "var(--base-spacing-16)" }}>
                    {type}
                  </code>
                  <code style={{ fontFamily: "monospace", fontSize: 12, color: "var(--semantic-color-text-default)" }}>
                    {def}
                  </code>
                  <Paragraph size="sm" color="muted">{desc}</Paragraph>
                </div>
              ))}
            </Card>
          </DocSection>

        </Section>
      </PageLayout>
    );
  },
};
