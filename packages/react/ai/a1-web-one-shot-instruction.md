# A1-web one-shot site instruction

Copy everything below into an agent when asking it to create an A1-web site.

---

You are creating a website for **A1-web**, the A1 Design System page-definition editor. Your output is the JSON source of truth for the site. Do not return React, HTML, CSS, SVG, or explanatory prose unless explicitly requested. Return one valid JSON project bundle.

## Request

Create a complete, usable website from this brief:

`[PASTE THE SITE BRIEF HERE]`

Audience: `[AUDIENCE]`
Primary action: `[PRIMARY ACTION]`
Pages needed: `[PAGES OR “CHOOSE THE RIGHT SET”]`
Content/assets supplied: `[CONTENT, IMAGE URLS, BRAND NOTES, OR “GENERATE PLACEHOLDERS”]`

## Required output shape

Return a project bundle with this shape:

```json
{
  "name": "Site name",
  "description": "Short purpose statement",
  "icon": "home",
  "theme": "kong",
  "pages": [
    {
      "id": "home",
      "title": "Home",
      "icon": "home",
      "parentId": null,
      "definition": {
        "schemaVersion": "0.1.0",
        "page": {
          "id": "home",
          "name": "Home",
          "description": "Page purpose",
          "layout": {
            "type": "PageLayout",
            "props": {},
            "regions": [
              {
                "id": "main",
                "name": "Main",
                "nodes": []
              }
            ]
          }
        }
      }
    }
  ]
}
```

`theme` is optional project metadata. `parentId` is null for top-level pages and may reference another page id for nested pages, up to three levels deep. A bare page definition is also valid, but a project bundle is preferred for a website.

## Component node contract

Every node must be an A1 component:

```json
{
  "id": "hero-title",
  "type": "Heading",
  "props": { "as": "h1", "size": { "xs": "lg", "md": "xl" } },
  "utilities": { "maxWidth": "lg", "marginBlock": "24" },
  "content": { "fallback": "A clear page heading", "textKey": "home.hero.title" },
  "a11y": { "labelledBy": "hero-title" },
  "actions": { "onClick": { "type": "navigate", "target": "/about" } },
  "children": []
}
```

Rules for nodes:

- `id` is required, stable, and unique within the page.
- `type` is an exact registered PascalCase A1 component name.
- `props` contains only real props for that component.
- `utilities` contains tokenized spacing/width utilities, never raw CSS.
- Visible text uses `content.fallback`; add `textKey` when localization is useful.
- `Fieldset` uses `props.legend`; form fields use their named `label` prop.
- `a11y` maps to ARIA attributes. Icon-only controls require an accessible label.
- `actions` are declarative metadata only; use `navigate`, `externalLink`, `openDialog`, `appAction`, or `submitForm` with a target. Do not invent executable JavaScript.
- `children` are only used by components that accept children.

## Registered components

Use only these component types:

- Layout: `PageLayout`, `Section`, `Stack`, `Grid`, `Cluster`, `Card`, `Bleed`, `Inset`, `Spacer`, `ButtonContainer`, `Slot`, `Outlet`, `Divider`, `Figure`, `Icon`
- Typography: `Heading`, `Paragraph`, `Blockquote`, `Code`, `List`, `ListItem`
- Actions: `Button`, `Link`, `IconButton`, `Switch`, `SegmentedControl`, `Slider`, `Toolbar`, `Tabs`, `Accordion`, `StickyActions`
- Inputs: `TextField`, `TextareaField`, `SelectField`, `NumberField`, `DateField`, `TimeField`, `PhoneField`, `ZipField`, `CreditCardField`, `Fieldset`, `FieldRow`, `CheckboxGroup`, `RadioGroup`, `ChoiceGroup`
- Feedback: `Banner`, `MessageBadge`, `MessageEmptyState`, `StatusBar`, `CircularProgress`, `StepTracker`
- Navigation/data: `Breadcrumb`, `TopHeader`, `BottomDrawer`, `PageNav`, `TreeMenu`, `Pagination`, `DefinitionList`, `DataTable`, `Calendar`

For charts and analytics, use the A1 data-viz components when they are available in the target surface: `LineChart`, `BarChart`, `AreaChart`, `ComposedChart`, `PieChart`, `ScatterChart`, `RadarChart`, `RadialBarChart`, `FunnelChart`, `TreemapChart`, `SankeyChart`, and `SunburstChart`.

## Design and layout rules

- Build the actual usable site as the first view, not a marketing explanation of the site.
- Use `PageLayout` at the page root and place page content inside `Section` nodes.
- Give primary sections non-zero, consistent `padding` and a `contentWidth` such as `lg`, `xl`, or `2xl`.
- Use `Stack` for one-dimensional flow and `Grid` for multi-column layouts or repeated cards.
- Put two or more sibling cards in a `Grid`.
- Do not use nested decorative cards. Cards are for repeated items, framed tools, and dialogs.
- Use a `TopHeader` only for a standalone page. Project bundles generate navigation from page hierarchy; do not add a duplicate `TopHeader` to every project page.
- Use icons in buttons when an A1 icon exists. Use icon-only buttons for familiar compact actions and provide labels/tooltips through accessibility props.
- Use `Button` for actions, `Link` for navigation, `IconButton` for compact icon actions, fields for input, and menus for option sets.
- Use real bitmap/image assets for meaningful product, place, person, or object imagery. Do not create an SVG illustration when a real image is appropriate.
- Keep hero-scale typography for genuine heroes. Use compact headings inside cards, panels, tables, and tools.
- Keep text inside its container at mobile and desktop widths. Allow wrapping; never let labels or buttons overlap.
- Use responsive prop objects such as `{ "xs": 1, "md": 3 }` and `{ "xs": "column", "md": "row" }`.

## A1 system rules

- Use A1 components only. Never use `div`, `p`, `span`, or arbitrary HTML as a node type.
- Use token vocabulary, not raw px, hex, rem, inline styles, gradients, or custom CSS in JSON.
- Use sentence case. Never author all-caps labels or headings.
- Use semantic heading order and one `h1` per page.
- Every form control has a visible label or an explicit accessible name.
- Do not communicate meaning through color alone; pair status color with text or an icon.
- Use one primary action per local action area.
- Avoid oversized hero sections, decorative blobs, bokeh, generic gradients, and one-note color palettes.
- Prefer restrained, domain-specific layouts over generic card grids.
- Preserve supplied approved content exactly. Do not invent claims, facts, testimonials, statistics, or company details.

## Common values

- Spacing/gap: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
- Section content width: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
- Most component sizes: `sm`, `md`, `lg`; field-family sizes: `compact`, `default`, `comfortable`
- Text/icon colors: `default`, `muted`, `accent`, `inverse`, `success`, `error`, `warn`, `info`
- Status values: `neutral`, `info`, `success`, `warn`, `error`
- Section surfaces: `page`, `panel`, `raised`, `card`
- Button variants: `primary`, `secondary`, `tertiary`, `destructive`, `success`
- Responsive breakpoints: `xs`, `sm`, `md`, `lg`, `xl`
- Icons are Material Symbols snake_case names, such as `home`, `search`, `settings`, `add`, `arrow_forward`, and `check_circle`.

## Final validation before returning JSON

1. Return parseable JSON, not JSONC or Markdown fences.
2. Confirm every node id is unique within its page.
3. Confirm every node type is registered above.
4. Remove every invented prop, raw style, class name, HTML node, and unsupported value.
5. Confirm every primary section has padding and a content width.
6. Confirm responsive values exist for narrow and wide layouts.
7. Confirm headings, labels, links, buttons, images, and icon-only actions are accessible.
8. Confirm project pages use hierarchy-generated navigation and do not duplicate `TopHeader`.
9. Confirm the primary action is obvious and there is a useful empty/loading/error state where the brief implies one.
10. Confirm the generated site can be imported through A1-web Projects → Upload JSON.

When the brief is underspecified, make conservative, domain-appropriate choices and keep the JSON internally consistent. Do not ask for permission to produce the first valid draft.

---

For the full prop registry, editor adapter details, action shapes, and worked examples, keep this instruction synchronized with `packages/react/ai/a1-agent-brief.md` and `packages/react/ai/page-definition-standard.md`.
