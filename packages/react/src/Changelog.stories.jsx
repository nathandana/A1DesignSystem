const meta = {
  title: "Changelog",
  parameters: { layout: "padded", controls: { disable: true } },
};

export default meta;

const releases = [
  {
    version: "v0.13.3",
    date: "2026-06-15",
    sections: [
      {
        type: "Added",
        items: [
          "InlineEditable — added the missing TypeScript types (InlineEditable.d.ts) and a Storybook entry (Components/Forms/Inline Editable) with Configurable, Single line, Multiline, Placeholder, Seamless, and Disabled stories.",
          "InlineEditable seamless prop — edits the text in place via contentEditable instead of swapping to a boxed field. The editable element inherits all typography (font, size, weight, colour, line-height, alignment, wrapping) from the surrounding component, so editing never resizes or restyles the text. This makes any heading, paragraph, label, or button text live-editable by nesting <InlineEditable seamless> inside it. Only a focus ring is added for accessibility; empty state shows the placeholder via :empty::before. CSS class a1-inline-editable--seamless (+ --multiline).",
        ],
      },
      {
        type: "Changed",
        items: [
          "Comfortable required marker — the \"Required\" indicator shown at size=\"comfortable\" (TextField/TextareaField/SelectField and CheckboxGroup/RadioGroup/ChoiceGroup legends) now renders as a small subtle info badge (MessageBadge size=\"sm\", icon suppressed) instead of the larger icon badge. Compact/default sizes still use the asterisk.",
          "Fieldset now fills the full width of its container (inline-size:100%; box-sizing:border-box) regardless of flex/grid/intrinsic sizing.",
          "ChoiceGroup now fills the full width of its container (inline-size:100%; box-sizing:border-box) so it is no longer constrained when placed in a flex/grid parent.",
          "InlineEditable disabled — no longer shows the hover outline; it now reads as plain, selectable text (cursor:auto, user-select:text) with no interactive affordances.",
          "Removed all-uppercase text transforms from shipped CSS — Calendar weekday header, PageNav section heading, and the feature Blockquote citation (plus the pure eyebrow label and figure citation) now render in their authored sentence case. The companion letter-spacing tracking was removed with them.",
        ],
      },
    ],
  },
  {
    version: "v0.13.2",
    date: "2026-06-15",
    sections: [
      {
        type: "Added",
        items: [
          "Token semantic.font.size.formLabel (compact/default/comfortable) — single source of truth for form-field label/legend size. Field, CheckboxGroup, RadioGroup, and ChoiceGroup legends now reference it so they can't drift (no visual change; the values already matched).",
        ],
      },
      {
        type: "Changed",
        items: [
          "DateField / TimeField — the native format placeholder (mm/dd/yyyy, --:--) now renders in the muted text colour while the field is empty, matching the muted mask placeholder used by PhoneField/ZipField/CreditCardField. Components track empty state and add a1-field--mask-empty.",
        ],
      },
    ],
  },
  {
    version: "v0.13.1",
    date: "2026-06-15",
    sections: [
      {
        type: "Added",
        items: [
          "Token semantic.font.size.body.2xs (0.625rem, from new base.font.size.scale.50) — a caption-scale step below body-xs.",
          "Fields — autoComplete is now a documented, first-class prop on the field family (forwarded to the native input). TextField Storybook adds an autoComplete control and an Autocomplete sign-in story.",
        ],
      },
      {
        type: "Changed",
        items: [
          "Fields — removed the background-colour change on the :active (pressed) state for TextField/NumberField/DateField/TimeField/PhoneField/ZipField/CreditCardField and TextareaField. Active now keeps only the border feedback; hover, focus, and read-only treatments are unchanged.",
          "ChoiceGroup compact — reduced label (body-sm → body-xs) and subtext (body-xs → body-2xs) one step each for a denser compact tile.",
          "Storybook — normalized field story titles to Components/Forms/Text Field and Components/Forms/Date Field (were \"Input Text\" / \"Input Date\").",
        ],
      },
    ],
  },
  {
    version: "v0.13.0",
    date: "2026-06-14",
    sections: [
      {
        type: "Added",
        items: [
          "Button fullWidth prop — stretches the button to fill its container (display:flex; width:100%). Default false keeps the natural content width. CSS class a1-button--full-width.",
          "Button loading prop — shows a spinner in place of the icon and makes the button inert (disabled + aria-busy) for in-progress actions like form submission. Full opacity + cursor:progress distinguish it from the disabled state; spinner respects prefers-reduced-motion. CSS classes a1-button--loading / a1-button__spinner.",
          "Rules — icon-button-natural-width (IconButton must never be stretched to full width), button-full-width-usage (when to use fullWidth), and button-loading-state (use loading during async work).",
        ],
      },
    ],
  },
  {
    version: "v0.12.2",
    date: "2026-06-14",
    sections: [
      {
        type: "Fixed",
        items: [
          "Tabs pills variant — implemented the missing CSS. Pill-shaped tabs with a raised resting surface; selected tab uses the action background with action-foreground text. Previously rendered as unstyled buttons.",
          "Tabs segment variant — implemented the missing CSS, mirroring SegmentedControl (raised track, inner-radius segments, selected segment on the page surface with shadow-xs). Previously rendered as unstyled buttons.",
          "Tabs compact size — added compact padding for the pills and segment variants (segment uses the segmented -sm padding tokens) so size has a visible effect across all variants.",
        ],
      },
      {
        type: "Added",
        items: [
          "Token base.radius.pill (624.9375rem) — full-pill radius promoted from the button-only pillBorderRadius; component.button.pillBorderRadius now references it, and Tabs pills use it.",
          "Storybook — Pills (filters) and Segment (view switcher) stories for Tabs.",
          "Storybook — PageNav stories (Default, Flat sections, Custom label) with a real two-column article layout so active-section tracking and the reading-progress bar are demonstrable.",
        ],
      },
    ],
  },
  {
    version: "v0.12.1",
    date: "2026-06-12",
    sections: [
      {
        type: "Fixed",
        items: [
          "ChoiceGroup spacing — removed redundant margin-top on the items grid that doubled the gap between legend/hint and tiles. Spacing now relies solely on the flex container gap, matching other form fields.",
        ],
      },
    ],
  },
  {
    version: "v0.11.0",
    date: "2026-06-11",
    sections: [
      {
        type: "Added",
        items: [
          "StickyActions component — fixed bottom action bar for flows and wizards. contentWidth prop (xs/sm/md/lg/xl/2xl) mirrors Section's max-width values for visual alignment with page content. Nested children stacked with gap; env(safe-area-inset-bottom) for notch devices; z-index 150.",
          "StickyActions rules — no-bottom-drawer (do not combine with BottomDrawer on the same screen), use-button-container (always nest a ButtonContainer), content-width-alignment (match contentWidth to Section above), page-offset (add bottom padding to scrollable content).",
        ],
      },
      {
        type: "Changed",
        items: [
          "Onboarding template refactored to use StickyActions — step content renders in a single Section per step; StickyActions holds StepTracker + ButtonContainer fixed at the bottom so button position never jumps between steps.",
        ],
      },
    ],
  },
  {
    version: "v0.10.0",
    date: "2026-06-11",
    sections: [
      {
        type: "Added",
        items: [
          "semantic.color.surface.field token — independent surface token for form field backgrounds (default neutral.0; dark mode neutral.700; Fresh theme neutral.0/white)",
        ],
      },
      {
        type: "Changed",
        items: [
          "Field, Textarea, Select, Checkbox, Radio, Switch, Choice Group, and Inline Editable now use --semantic-color-surface-field instead of --semantic-color-surface-page",
          "Fieldset surface variant uses surface.card (panel/card grouping) instead of surface.page",
          "DefinitionList copy value affordance now renders as a small tertiary Button with visible copy/copied text and sits immediately after the value content",
          "BottomDrawer stories: added tags: [\"autodocs\"] and argTypes for Storybook Docs page generation",
        ],
      },
      {
        type: "Fixed",
        items: [
          "DataTable notice rows now span full card width on mobile (≤640px) — suppressed the column-label ::before pseudo-element that was pushing banner content to the right",
        ],
      },
    ],
  },
  {
    version: "v0.9.0",
    date: "2026-06-11",
    sections: [
      {
        type: "Added",
        items: [
          "BottomDrawer component — fixed bottom navigation bar for mobile viewports (max 5 items); items support href, onClick, active, badge, and disabled props; badge values are capped at 99+",
          "TopHeader navIconPosition=\"hidden\" — suppresses nav + hamburger at a given breakpoint for use with BottomDrawer at xs; resolveIconAbove() refactored to resolveNavMode() returning \"start\" | \"above\" | \"hidden\"",
          "semantic.color.surface.card token — separates card surface from page surface; Card (React + Pure) now uses --semantic-color-surface-card instead of --semantic-color-surface-page",
          "Fresh theme card contrast — surface.card set to neutral.0 so cards appear white against the mint gradient background",
          "Dark mode card surface — color-scheme.css and both build pipelines override --semantic-color-surface-card to neutral.800 in dark contexts",
          "base.spacing.56 token — 56px spacing value added to system/tokens/spacing.json",
          "component.bottom-drawer tokens — height (56px), border-width (1px), z-index (200) added to system/tokens/component/bottom-drawer.json",
          "BottomDrawer Pure HTML/CSS classes — BEM classes in a1-base.css; scoped classes in a1-pure.css; example page at examples/a1-pure/bottom-drawer.html",
        ],
      },
    ],
  },
  {
    version: "v0.8.0",
    date: "2026-06-10",
    sections: [
      {
        type: "Added",
        items: [
          "CircularProgress size=\"xl\" — 192px ring, new base.spacing.192 token and component.circularProgress.xl.size token; CSS modifier .a1-circular-progress--xl (React) and .a1-circular-progress-xl (Pure)",
          "Field story files split — PhoneField, ZipField, CreditCardField, TimeField, and NumberField each have dedicated Storybook story files; removed from TextField.stories.jsx",
          "DefinitionList component — semantic label/value pairs with row/column layouts, sm/md/lg sizes, auto/fixed responsive label widths, Heading-based value typography, and optional copy buttons",
          "React package publish file list now includes component .d.ts declaration files",
          "Heading runtime validation now honours documented as=\"p\" and as=\"span\" values",
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
          "NumberField unit label now uses --a1-field-font-size (matches input value size at all density levels) instead of fixed body-xs; color remains muted",
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
