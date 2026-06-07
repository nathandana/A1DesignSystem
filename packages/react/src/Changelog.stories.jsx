const meta = {
  title: "Changelog",
  parameters: { layout: "padded", controls: { disable: true } },
};

export default meta;

const releases = [
  {
    version: "Current session",
    date: "2026-06-01",
    sections: [
      {
        type: "Added",
        items: [
          "Spacer component — xs through xxl sizes, responsive object-syntax breakpoints",
          "Figure: align prop (start / center / end); captionSrOnly prop for screen-reader-only captions",
          "sr-only utility CSS (packages/react/src/utilities/sr-only.css)",
          "Blockquote variants: accent (filled action background), pull (editorial centered with curly quotes), ruled (top + bottom borders centered)",
          "About Page added to portfolio with hero, career story, values grid, skills list, and CTA",
          "A1 Design System case study page (6 principles, system structure, AI guidance, outcomes, reflection)",
          "Playwright screenshot scripts for portfolio and Storybook captures",
          "Portfolio case study images in examples/portfolio/img/a1/",
          "A1 Design System entry in caseStudies.js with card image and metadata",
          "About page routing and sidebar nav entry",
          "Changelog story (this page)",
          "How to Use story",
        ],
      },
      {
        type: "Changed",
        items: [
          "Figure: size prop now applies max-width via class instead of inline style; center alignment applies size constraint to img + figcaption via compound selectors",
          "Paragraph: paragraph + heading spacing now matches paragraph + paragraph (1.5em top margin)",
          "PageLayout viewport-height mode now scrolls an inner main region so header and footer remain outside the page scroll container",
          "TopHeader nav submenus now support divider-separated menu sections",
          "TopHeader nav submenus now support third-level flyout menus from child items",
          "TopHeader tertiary flyouts stay open across pointer movement and show a visible focus outline on their triggers",
          "TopHeader tertiary flyouts flip left when right-side viewport space is constrained and scroll within available height",
          "TopHeader parent nav items stay highlighted while menus are open and header nav items have a stronger pressed state",
          "Menu items now constrain long labels, section labels, and shortcuts so content stays inside the menu container",
          "TopHeader tertiary flyouts now require intentional keyboard opening and trap focus independently once open",
          "TopHeader flyout triggers now wrap long labels so secondary menu items stay inside their container",
          "TopHeader flyout triggers now reuse MenuItem row classes so icons, labels, and chevrons align consistently",
        ],
      },
    ],
  },
  {
    version: "cb502ee",
    date: "2026-05-30",
    sections: [
      {
        type: "Added",
        items: [
          "Data table component with sortable columns, row selection, and pagination",
          "Templates for common layout patterns",
          "Portfolio updates with additional case studies",
          "Theme editor app initial concept",
          "User flows documentation",
          "MessageBanner component",
        ],
      },
    ],
  },
  {
    version: "93d9d67",
    date: "2026-05-25",
    sections: [
      {
        type: "Added",
        items: [
          "Form field components: TextField, SelectField, TextareaField, CheckboxGroup, RadioGroup",
          "CreditCard field component",
          "Inline component for horizontal grouping with gap and alignment",
          "Menu component with keyboard navigation",
          "Switch component",
          "Divider component with horizontal and vertical orientations, responsive breakpoint support",
          "Priority Guide app first pass",
          "Netlify integration and deployment",
        ],
      },
    ],
  },
  {
    version: "4dc1af7",
    date: "2026-05-22",
    sections: [
      {
        type: "Added",
        items: [
          "Accessibility audit tooling and testing setup",
          "Section component with surface variants (default, raised, panel, inverse) and padding scale",
          "Grid component with responsive column spans and bento grid pattern",
          "Page layout component with sidebar and content area",
          "Side navigation component with icons and active state",
          "System banner and Banner components",
          "Dialog component with focus trap and portal rendering",
          "Tabs component with keyboard navigation",
        ],
      },
      {
        type: "Changed",
        items: [
          "Prepared package for npmjs publish",
          "Fixed dark mode in Storybook preview",
        ],
      },
    ],
  },
  {
    version: "82f9a2a",
    date: "2026-05-20",
    sections: [
      {
        type: "Added",
        items: [
          "Theme system with light and dark color schemes",
          "Sidebar layout pattern",
          "Link component",
          "Font loading and preload",
          "Storybook deployment on Netlify",
          "Colors foundation story with semantic color groups",
          "Breakpoints reference story",
          "Spacing utilities story",
        ],
      },
    ],
  },
  {
    version: "10339d2",
    date: "2026-05-18",
    sections: [
      {
        type: "Added",
        items: [
          "Initial component set: Button, Heading, Paragraph, List, ListItem, Blockquote, Figure, Stack, Badge, MessageBadge",
          "Design token system with Style Dictionary",
          "Base, semantic, and component token layers",
          "Color ramps: neutral, accent, info, success, warn, error",
          "Typography scale: display (sm – xJumbo), body",
          "Spacing scale (base-spacing-*)",
          "Border radius, elevation, and motion tokens",
          "React package scaffold with Vite build",
          "Storybook with @storybook/react-vite and addon-docs",
          "Rules documentation story",
          "Kitchen sink story for visual regression reference",
          "Dark mode support via prefers-color-scheme",
        ],
      },
    ],
  },
];

const typeColors = {
  Added: { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
  Changed: { bg: "#fef9c3", text: "#854d0e", border: "#fef08a" },
  Fixed: { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
  Removed: { bg: "#f3f4f6", text: "#374151", border: "#e5e7eb" },
};

function Badge({ type }) {
  const c = typeColors[type] || typeColors.Removed;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        marginRight: 6,
        flexShrink: 0,
      }}
    >
      {type}
    </span>
  );
}

function ChangelogPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>Changelog</h1>
      <p style={{ color: "#6b7280", margin: "0 0 48px", fontSize: 15 }}>
        A running record of additions, changes, and fixes to the A1 Design System.
      </p>

      {releases.map((release) => (
        <div key={release.version} style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{release.version}</h2>
            <span style={{ fontSize: 13, color: "var(--semantic-color-text-muted)" }}>{release.date}</span>
          </div>
          <div
            style={{
              borderLeft: "2px solid var(--semantic-color-border-subtle, #e5e7eb)",
              paddingLeft: 20,
            }}
          >
            {release.sections.map((section) => (
              <div key={section.type} style={{ marginBottom: 20 }}>
                <div style={{ marginBottom: 10 }}>
                  <Badge type={section.type} />
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 14,
                        color: "#374151",
                        padding: "4px 0",
                        paddingLeft: 16,
                        position: "relative",
                        lineHeight: 1.6,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "10px",
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "#d1d5db",
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const AllChanges = {
  name: "All Changes",
  render: () => <ChangelogPage />,
};
