import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../../packages/react/src/Button.jsx";
import { ButtonContainer } from "../../packages/react/src/ButtonContainer.jsx";
import { Card } from "../../packages/react/src/Card.jsx";
import { Heading } from "../../packages/react/src/Heading.jsx";
import { Paragraph } from "../../packages/react/src/Paragraph.jsx";
import { MessageBadge } from "../../packages/react/src/Message.jsx";
import "./styles.css";

const navItems = [
  { id: "components", label: "Components" },
  { id: "tokens", label: "Tokens" },
  { id: "documentation", label: "Documentation" }
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
  return (
    <main className="a1-design-hero">
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
          Get started
        </Button>
        <Button variant="secondary" onClick={() => onNavigate("documentation")}>
          View documentation
        </Button>
      </ButtonContainer>
    </main>
  );
}

function DocumentationPage() {
  return (
    <main className="a1-design-components-page">
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
    </main>
  );
}

function ComponentsPage() {
  return (
    <main className="a1-design-components-page">
      <section className="a1-design-page-heading" aria-labelledby="components-title">
        <MessageBadge variant="subtle" icon="widgets">
          Component library
        </MessageBadge>
        <Heading as="h1" id="components-title" type="display" size={{ xs: "xl", md: "xxl" }}>
          Components
        </Heading>
        <Paragraph size="lg" color="muted">
          Production-ready React primitives connected to A1 tokens.
        </Paragraph>
      </section>

      <div className="a1-design-components-layout">
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
      </div>
    </main>
  );
}

function App() {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="a1-design-page">
      <header className="a1-design-header">
        <button className="a1-design-logo" type="button" onClick={() => setActivePage("home")}>
          <span className="a1-design-logo-accent">A1:</span> Design
        </button>
        <nav>
          <ul className="a1-design-nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavButton active={activePage === item.id} onClick={() => setActivePage(item.id)}>
                  {item.label}
                </NavButton>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {activePage === "components" && <ComponentsPage />}
      {activePage === "documentation" && <DocumentationPage />}
      {activePage !== "components" && activePage !== "documentation" && (
        <HomePage onNavigate={setActivePage} />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
