import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  ButtonContainer,
  Card,
  Grid,
  Heading,
  IconButton,
  Inverse,
  LabelsProvider,
  Menu,
  MenuSection,
  MessageBadge,
  PageLayout,
  Paragraph,
  SegmentedControl,
  useLabel,
} from "../../packages/react/src/index.js";
import actionLabels from "../../system/labels/action.json";
import "./styles.css";

const localeOptions = [
  { value: "en", label: "EN" },
  { value: "es", label: "ES" },
  { value: "fr", label: "FR" },
];

const themeOptions = [
  { value: "a1Light", label: "Default" },
  { value: "a1Heritage", label: "Heritage" },
  { value: "a1Accessible", label: "Accessible" },
];

const colorSchemeOptions = [
  { value: "light", icon: "light_mode" },
  { value: "dark", icon: "dark_mode" },
];

const navItems = [
  { id: "components", label: "Components" },
  { id: "tokens", label: "Tokens" },
  { id: "documentation", label: "Documentation" },
  { href: "/storybook/", label: "Storybook" }
];

const componentSections = [
  {
    id: "buttons",
    title: "Buttons",
    summary: "Primary actions, secondary actions, and icon-led calls to action.",
    status: "Ready",
    statusType: "success",
    tokens: "Color, spacing, radius, typography"
  },
  {
    id: "typography",
    title: "Typography",
    summary: "Headings, display type, body copy, and responsive scale behavior.",
    status: "Ready",
    statusType: "success",
    tokens: "Font family, size, line height, weight"
  },
  {
    id: "messaging",
    title: "Messaging",
    summary: "Badges, banners, notifications, and empty states for system feedback.",
    status: "Ready",
    statusType: "success",
    tokens: "Color, icon, spacing"
  },
  {
    id: "layout",
    title: "Layout",
    summary: "Page shells, grids, cards, dialogs, tabs, and pagination primitives.",
    status: "In progress",
    statusType: "info",
    tokens: "Breakpoint, spacing, shadow"
  }
];

function NavButton({ active, children, ...props }) {
  return (
    <button
      className={`a1-design-nav-link${active ? " a1-design-nav-link--active" : ""}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

function HomePage({ onNavigate }) {
  const labelGetStarted = useLabel("action.getStarted");
  const labelViewDocs = useLabel("action.viewDocumentation");

  return (
    <div className="a1-design-home">
      <section className="a1-design-hero">
        <div className="a1-design-badge-wrap">
          <MessageBadge variant="subtle" icon="auto_awesome">
            AI token generation
          </MessageBadge>
        </div>

        <div className="a1-design-heading-wrap">
          <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo", lg: "xJumbo" }}>
            <div>A1 Design: </div>
            <span style={{ color: "var(--semantic-color-text-accent)" }}>AI-first design systems</span>
          </Heading>
        </div>

        <div className="a1-design-paragraph-wrap">
          <Paragraph size="lg" color="muted">
            A token-driven, component-first design system built for the AI era.
          </Paragraph>
          <Paragraph size="md" color="muted">
            Consistent, accessible, and fully themeable — from design tokens to
            production-ready React components.
          </Paragraph>
        </div>

        <ButtonContainer className="a1-design-actions" align="center">
          <Button variant="primary" icon="arrow_forward" iconPosition="end" onClick={() => onNavigate("components")}>
            {labelGetStarted}
          </Button>
          <Button variant="secondary" onClick={() => onNavigate("documentation")}>
            {labelViewDocs}
          </Button>
        </ButtonContainer>
      </section>

      <Inverse as="section" className="a1-design-overview" aria-labelledby="overview-title">
        <Grid columns={{ xs: 1, md: 2 }} gap={40} className="a1-design-overview-inner">
          <div className="a1-design-overview-copy">
            <MessageBadge variant="subtle" icon="hub">
              System overview
            </MessageBadge>
            <Heading as="h2" id="overview-title" type="display" size={{ xs: "lg", md: "xl" }}>
              Built once, expressed everywhere.
            </Heading>
            <Paragraph size="lg" color="muted">
              A1 Design is a compact proof of concept for a design system where tokens,
              rules, React components, Storybook docs, and Figma foundations share the
              same source of truth.
            </Paragraph>
          </div>

          <dl className="a1-design-overview-list">
            <div>
              <dt>AI-ready</dt>
              <dd>Structured tokens and rules give agents clear constraints for consistent output.</dd>
            </div>
            <div>
              <dt>Themeable</dt>
              <dd>Color, type, spacing, radius, shadows, density, and language can evolve by brand.</dd>
            </div>
            <div>
              <dt>Production-facing</dt>
              <dd>Reusable components, visual docs, and examples show how the system is consumed.</dd>
            </div>
          </dl>
        </Grid>
      </Inverse>
    </div>
  );
}

function DocumentationPage() {
  return (
    <div className="a1-design-content-page">
      <section className="a1-design-page-heading" aria-labelledby="documentation-title">
        <MessageBadge variant="subtle" icon="description">
          Documentation
        </MessageBadge>
        <Heading as="h1" id="documentation-title" type="display" size={{ xs: "xl", md: "xxl" }}>
          Documentation
        </Heading>
        <Paragraph size="lg" color="muted">
          Practical guidance for applying A1 tokens, components, and rules.
        </Paragraph>
      </section>
    </div>
  );
}

function ComponentsPage() {
  return (
    <div className="a1-design-content-page">
      <section className="a1-design-page-heading" aria-labelledby="components-title">
        <Heading as="h1" id="components-title" type="display" size={{ xs: "xl", md: "xxl" }}>
          Components
        </Heading>
        <Paragraph size="lg" color="muted">
          Production-ready React primitives connected to A1 tokens.
        </Paragraph>
      </section>

      <Grid columns={{ xs: 1, md: 2 }} gap={40} className="a1-design-components-layout">
        <aside className="a1-design-toc" aria-labelledby="components-toc-title">
          <Heading as="h2" id="components-toc-title" size="xs">
            Contents
          </Heading>
          <nav aria-label="Components table of contents">
            <ol className="a1-design-toc-list">
              {componentSections.map((section) => (
                <li key={section.id}>
                  <a className="a1-design-toc-link" href={`#${section.id}`}>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="a1-design-component-list">
          {componentSections.map((section) => (
            <Card key={section.id} as="section" id={section.id} shadow="xs" className="a1-design-component-section">
              <div className="a1-design-component-section-header">
                <div>
                  <Heading as="h2" size="md">
                    {section.title}
                  </Heading>
                  <Paragraph size="md" color="muted">
                    {section.summary}
                  </Paragraph>
                </div>
                <MessageBadge status={section.statusType} variant="subtle">
                  {section.status}
                </MessageBadge>
              </div>
              <dl className="a1-design-component-meta">
                <div>
                  <dt>Token coverage</dt>
                  <dd>{section.tokens}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      </Grid>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState("home");
  const [locale, setLocale] = useState("en");
  const [theme, setTheme] = useState("a1Light");
  const [colorScheme, setColorScheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("a1-theme-heritage", theme === "a1Heritage");
    document.documentElement.classList.toggle("a1-theme-accessible", theme === "a1Accessible");
    document.documentElement.classList.toggle("a1-theme-dark", colorScheme === "dark");
  }, [theme, colorScheme]);

  const header = (
    <header className="a1-design-header">
      <button className="a1-design-logo" type="button" onClick={() => setActivePage("home")}>
        <span className="a1-design-logo-accent">A1:</span> Design
      </button>
      <div className="a1-design-header-end">
        <nav>
          <ul className="a1-design-nav-list">
            {navItems.map((item) => (
              <li key={item.id ?? item.href}>
                {item.href ? (
                  <a className="a1-design-nav-link" href={item.href}>
                    {item.label}
                  </a>
                ) : (
                  <NavButton active={activePage === item.id} onClick={() => setActivePage(item.id)}>
                    {item.label}
                  </NavButton>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <IconButton
          icon="settings"
          label="Open settings"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
        />
      </div>
    </header>
  );

  return (
    <LabelsProvider locale={locale} labels={actionLabels}>
      <PageLayout stickyHeader header={header}>
        {activePage === "components" && <ComponentsPage />}
        {activePage === "documentation" && <DocumentationPage />}
        {activePage !== "components" && activePage !== "documentation" && (
          <HomePage onNavigate={setActivePage} />
        )}
      </PageLayout>
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} aria-label="Settings">
        <MenuSection label="Theme">
          <SegmentedControl
            options={themeOptions}
            value={theme}
            onChange={setTheme}
            size="sm"
            fullWidth
          />
        </MenuSection>
        <MenuSection label="Color scheme">
          <SegmentedControl
            options={colorSchemeOptions}
            value={colorScheme}
            onChange={setColorScheme}
            size="sm"
            fullWidth
          />
        </MenuSection>
        <MenuSection label="Language">
          <SegmentedControl
            options={localeOptions}
            value={locale}
            onChange={setLocale}
            size="sm"
            fullWidth
          />
        </MenuSection>
      </Menu>
    </LabelsProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
