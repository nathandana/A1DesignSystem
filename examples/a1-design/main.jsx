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
  MessageBanner,
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

const pageIds = ["home", "components", "tokens", "audit", "documentation"];

const navItems = [
  { id: "components", label: "Components" },
  { id: "tokens", label: "Tokens" },
  { id: "audit", label: "Audit" },
  { id: "documentation", label: "Documentation" },
  { href: "/storybook/", label: "Storybook" }
];

const auditSummary = [
  { label: "High", value: "0", status: "success" },
  { label: "Medium", value: "2", status: "warn" },
  { label: "Low", value: "1", status: "info" }
];

const auditFindings = [
  {
    id: "storybook-shell",
    severity: "Medium",
    status: "warn",
    title: "Storybook shell branding depends on private DOM structure",
    summary:
      "The manager head file rewrites Storybook markup with innerHTML, sidebar selectors, raw colors, and a MutationObserver. It works today, but a Storybook update could break it.",
    evidence: [
      ".storybook/manager-head.html:6",
      ".storybook/manager-head.html:55",
      ".storybook/manager-head.html:72",
      ".storybook/manager-head.html:83"
    ],
    recommendation:
      "Move as much as possible into supported Storybook manager configuration and keep any remaining DOM bridge small and well documented."
  },
  {
    id: "inline-story-styles",
    severity: "Medium",
    status: "warn",
    title: "Stories lean on inline styles for layout and documentation",
    summary:
      "The package stories contain hundreds of inline style objects. Story code doubles as consumer guidance, so these examples can normalize bypassing the system.",
    evidence: [
      "packages/react/src/KitchenSink.stories.jsx:31",
      "packages/react/src/components/page-layout/PageLayout.stories.jsx:23",
      "packages/react/src/tokens/_shared.jsx:158"
    ],
    recommendation:
      "Create a small set of docs layout primitives or story utility classes that use tokens and can be reused consistently."
  },
  {
    id: "scrim-token",
    severity: "Low",
    status: "info",
    title: "Scrim colors are authored as raw rgba values",
    summary:
      "The source CSS defines semantic scrim variables directly with rgba values. That is functional, but it skips the token source of truth.",
    evidence: [
      "packages/react/src/color-scheme.css:42",
      "packages/react/src/color-scheme.css:106",
      "packages/react/src/color-scheme.css:184"
    ],
    recommendation:
      "Move scrim values into token JSON or theme generation so all semantic color decisions have one source."
  }
];

function getRouteBase(pathname = window.location.pathname) {
  return pathname.startsWith("/examples/a1-design") ? "/examples/a1-design" : "";
}

function getRoutePage(search = window.location.search) {
  const page = new URLSearchParams(search).get("page") || "home";

  return pageIds.includes(page) ? page : "home";
}

function getRoutePath(page) {
  const base = getRouteBase();
  const indexPath = base ? `${base}/` : "/";

  return page === "home" ? indexPath : `${indexPath}?page=${page}`;
}

function isPlainLeftClick(event) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  );
}

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

function NavLink({ active, children, ...props }) {
  return (
    <a
      className={`a1-design-nav-link${active ? " a1-design-nav-link--active" : ""}`}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

function HomePage({ onNavigate }) {
  const labelGetStarted = useLabel("action.getStarted");
  const labelViewDocs = useLabel("action.viewDocumentation");

  return (
    <div className="a1-design-home">
      <section className="a1-design-hero">
        <div className="a1-design-badge-wrap">
          <MessageBadge subtle  icon="auto_awesome">
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
        <Grid columns={{ xs: 1, md: 2 }} gap="lg" className="a1-design-overview-inner">
          <div className="a1-design-overview-copy">
            <MessageBadge subtle  icon="hub">
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
        <MessageBadge subtle  icon="description">
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

function TokensPage() {
  return (
    <div className="a1-design-content-page">
      <section className="a1-design-page-heading" aria-labelledby="tokens-title">
        <MessageBadge subtle icon="token">
          Tokens
        </MessageBadge>
        <Heading as="h1" id="tokens-title" type="display" size={{ xs: "xl", md: "xxl" }}>
          Tokens
        </Heading>
        <Paragraph size="lg" color="muted">
          The shared source of truth for color, typography, spacing, radius, shadows,
          themes, and responsive behavior.
        </Paragraph>
      </section>

      <Grid columns={{ xs: 1, md: 3 }} gap="md" className="a1-design-token-grid">
        {[
          ["Color", "Semantic surfaces, text, actions, and status colors."],
          ["Typography", "Display, heading, body, family, weight, and line-height decisions."],
          ["Layout", "Spacing, breakpoints, radius, and shadow foundations."]
        ].map(([title, description]) => (
          <Card key={title} shadow="xs" className="a1-design-token-card">
            <Heading as="h2" size="sm">
              {title}
            </Heading>
            <Paragraph size="sm" color="muted">
              {description}
            </Paragraph>
          </Card>
        ))}
      </Grid>
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

      <Grid columns={{ xs: 1, md: 2 }} gap="lg" className="a1-design-components-layout">
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
                <MessageBadge subtle status={section.statusType} >
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

function AuditReportPage() {
  return (
    <div className="a1-design-content-page">
      <section className="a1-design-page-heading" aria-labelledby="audit-title">
        <MessageBadge subtle icon="rule">
          Repo audit
        </MessageBadge>
        <Heading as="h1" id="audit-title" type="display" size={{ xs: "xl", md: "xxl" }}>
          Custom styling and hacks report
        </Heading>
        <Paragraph size="lg" color="muted">
          A focused pass over maintained source files for styling drift, brittle overrides,
          raw values, and examples that teach patterns outside the design system.
        </Paragraph>
      </section>

      <Grid columns={{ xs: 1, md: 3 }} gap="md" className="a1-design-audit-summary" aria-label="Audit summary">
        {auditSummary.map((item) => (
          <Card key={item.label} shadow="xs" className="a1-design-audit-stat">
            <MessageBadge subtle status={item.status}>
              {item.label}
            </MessageBadge>
            <Heading as="p" type="display" size="lg">
              {item.value}
            </Heading>
            <Paragraph size="sm" color="muted">
              Findings
            </Paragraph>
          </Card>
        ))}
      </Grid>

      <MessageBanner status="info" title="Scope">
        Generated output such as build, dist, storybook-static, and visual baselines was excluded.
        No files were changed during the audit.
      </MessageBanner>

      <Grid columns={{ xs: 1, lg: 3 }} gap="lg" className="a1-design-audit-layout">
        <aside className="a1-design-toc" aria-labelledby="audit-toc-title">
          <Heading as="h2" id="audit-toc-title" size="xs">
            Findings
          </Heading>
          <nav aria-label="Audit findings">
            <ol className="a1-design-toc-list">
              {auditFindings.map((finding) => (
                <li key={finding.id}>
                  <a className="a1-design-toc-link" href={`#${finding.id}`}>
                    {finding.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="a1-design-audit-findings">
          {auditFindings.map((finding) => (
            <Card
              key={finding.id}
              as="section"
              id={finding.id}
              shadow="xs"
              className="a1-design-audit-finding"
            >
              <div className="a1-design-audit-finding-header">
                <div>
                  <MessageBadge subtle status={finding.status}>
                    {finding.severity}
                  </MessageBadge>
                  <Heading as="h2" size="md">
                    {finding.title}
                  </Heading>
                </div>
              </div>

              <Paragraph size="md" color="muted">
                {finding.summary}
              </Paragraph>

              <div className="a1-design-audit-detail">
                <Heading as="h3" size="xs">
                  Evidence
                </Heading>
                <ul className="a1-design-audit-evidence">
                  {finding.evidence.map((item) => (
                    <li key={item}>
                      <code>{item}</code>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="a1-design-audit-detail">
                <Heading as="h3" size="xs">
                  Recommendation
                </Heading>
                <Paragraph size="sm" color="muted">
                  {finding.recommendation}
                </Paragraph>
              </div>
            </Card>
          ))}
        </div>
      </Grid>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState(() => getRoutePage());
  const [locale, setLocale] = useState("en");
  const [theme, setTheme] = useState("a1Light");
  const [colorScheme, setColorScheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(page, { replace = false } = {}) {
    const nextPage = pageIds.includes(page) ? page : "home";
    const nextPath = getRoutePath(nextPage);
    const currentPath = `${window.location.pathname}${window.location.search}`;

    if (nextPath !== currentPath) {
      const method = replace ? "replaceState" : "pushState";
      window.history[method]({ page: nextPage }, "", nextPath);
    }

    setActivePage(nextPage);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function handleRouteClick(event, page) {
    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    navigate(page);
  }

  useEffect(() => {
    const resolvedPage = getRoutePage();

    window.history.replaceState({ page: resolvedPage }, "", window.location.href);
    setActivePage(resolvedPage);

    const onPopState = () => {
      setActivePage(getRoutePage());
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("a1-theme-heritage", theme === "a1Heritage");
    document.documentElement.classList.toggle("a1-theme-accessible", theme === "a1Accessible");
    document.documentElement.classList.toggle("a1-theme-dark", colorScheme === "dark");
  }, [theme, colorScheme]);

  useEffect(() => {
    const pageTitle = navItems.find((item) => item.id === activePage)?.label;
    document.title = pageTitle ? `${pageTitle} | A1 Design System` : "A1 Design System";
  }, [activePage]);

  useEffect(() => {
    if (!window.location.hash) return;

    window.requestAnimationFrame(() => {
      const target = document.getElementById(window.location.hash.slice(1));
      target?.scrollIntoView();
    });
  }, [activePage]);

  const header = (
    <header className="a1-design-header">
      <a
        className="a1-design-logo"
        href={getRoutePath("home")}
        onClick={(event) => handleRouteClick(event, "home")}
        aria-current={activePage === "home" ? "page" : undefined}
      >
        <span className="a1-design-logo-accent">A1:</span> Design
      </a>
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
                  <NavLink
                    active={activePage === item.id}
                    href={getRoutePath(item.id)}
                    onClick={(event) => handleRouteClick(event, item.id)}
                  >
                    {item.label}
                  </NavLink>
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
        {activePage === "tokens" && <TokensPage />}
        {activePage === "audit" && <AuditReportPage />}
        {activePage === "documentation" && <DocumentationPage />}
        {activePage !== "components" && activePage !== "tokens" && activePage !== "audit" && activePage !== "documentation" && (
          <HomePage onNavigate={navigate} />
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
