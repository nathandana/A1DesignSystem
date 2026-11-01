# A1 design language

## Overview

A1 is a working interface system: calm, readable and purposeful. Pale surfaces separate regions, dark text establishes hierarchy, and violet identifies the main action. Use space to group related content before adding containers or decoration. Preserve approved content, hierarchy and order.

Prefer real React components from `@gtivr4/a1-design-system-react`. Read `get_react_setup` through the [A1 MCP server](https://mcp.a1design.app/mcp), then inspect `get_component` and `get_pattern` before writing JSX. Install the published npm package and follow its `guidelines/setup.md` for CSS import order, fonts and required PostCSS custom-media processing. Check the installed version; an MCP source snapshot may be newer than npm.

For a page built inside A1, read `get_json_model`, generate a page or project document, call `validate_json`, repair errors, then call `create_preview` with the validated document. Inspect the returned preview. A signed-in user can import it as a project. Validation checks the contract, not visual quality or complete accessibility.

This file follows [Google's DESIGN.md specification](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md): machine-readable tokens plus rationale. It is generated from A1's resolved tokens and this maintained prose, rather than a separate design system. Read the [Design with A1 guide](https://a1design.app/design-with-a1) for agent setup.

## Colors

Use semantic roles through component props. The `primary` color marks the main action; `on-primary` is its paired text. `ink` is the default reading color, `page` is the canvas and `panel` groups supporting information. Reserve feedback colors for meaning and pair status with text or an icon, never color alone.

These literal values document the default light appearance; do not paste them into application CSS. Base and A1 light use root tokens. Accessible and Heritage override the same roles, while light/dark mode changes surfaces and text. Use A1 theme classes and color-scheme styles, not local recoloring. Use `list_themes` and `get_token` to inspect overrides. Test the selected theme in both modes.

## Typography

Inter and the system sans-serif fallback keep controls and prose consistent. Body text uses a comfortable line height; headings tighten the rhythm without losing readability. Use `Heading` and `Paragraph` props, sentence case and a logical heading outline. Keep one page h1. Let PageTitle own the title scale: heading lg on xs, xxl from md.

Use monospace through `Code` for commands and JSON, with wrapping for narrow layouts. Keep readable line lengths with Section's `contentWidth`. Load Inter and Material Symbols as described by the React setup guide; icons must have accessible names when they are the only control label.

## Layout

Compose PageLayout, Section, Stack and Grid before creating layout CSS. The spacing scale in front matter maps to `semantic.spacing.gap`; use gap and padding props. Prefer a single column on narrow screens and responsive component props as space increases.

**PageTitle must touch the top and side edges of its page or container.** No outer margin, padded ancestor or preceding gap. Its internal spacing stays intact. Put body spacing in a separate sibling Section below it. Breadcrumb destinations must work.

| Breakpoint | Viewport range |
| --- | --- |
<!-- BREAKPOINTS -->

Review xs through xl, text zoom, long content and wrapping. Use the package's custom-media build setup; unprocessed media queries silently disable responsive rules.

## Elevation & Depth

Create hierarchy with page, panel and raised surface props before adding shadows. Cards group related content; dividers separate adjacent reading sections. Use the system's overlay components for menus and dialogs so their layer, scrim and focus treatment remain consistent. Do not invent shadows or z-index values.

## Shapes

Use component-owned radii and the small rounded scale for related containers. Keep buttons, fields and cards consistent with the active theme. A pill shape communicates a distinct compact control or status; it is not a default decoration for every container.

## Components

- PageTitle provides the page heading, context, breadcrumb and actions. Keep at most one primary action in a group.
- Section, Stack and Grid handle padding, alignment, surfaces and responsive composition.
- Button and Link own interaction semantics; IconButton needs an accessible label.
- Field and the appropriate input component provide labels, descriptions and error relationships.
- Dialog owns focus containment and return. Use Snackbar for transient action feedback.
- Code presents copyable snippets; Accordion progressively reveals setup details.
- Use formal patterns where their structure fits. Inspect their editable areas before changing them; preserve system-owned structure.

Read the actual component API before choosing props. Do not assume React props and A1 JSON nodes are interchangeable: JSON has a separate supported registry, content model and adapter contract. Never embed JSX or callback functions in JSON.

## Do's and Don'ts

- Do preserve approved wording and hierarchy. Keep labels in `system/labels/` with descriptions and all supported translations when contributing to A1.
- Do use semantic HTML, visible keyboard focus, named controls, meaningful heading order and WCAG AA contrast. Check reduced motion and touch targets.
- Do validate loading, empty, error, disabled and success states where the flow needs them.
- Do inspect real output at all breakpoints and themes; a schema pass is not a visual review.
- Do request the relevant component, token or pattern from MCP instead of loading every resource into each prompt.
- Don't rebuild A1 components with raw elements or patch their spacing with local CSS. Use props or propose a system change.
- Don't invent colors, spacing, radii, typography or motion values. Add a missing token at the source before using it.
- Don't treat this design summary as an exhaustive API. The installed package and current component contracts govern implementation.

### Maintenance

In the A1 repository, edit `system/tokens/`, the applicable theme sources, or `packages/react/ai/design-md-body.md`, then run `npm run build:tokens`, `npm run build:design-md` and `npm run build:mcp-index`. `npm run design-md:check` checks the root document and public download against the same generator. The web and MCP build checks reject stale copies. Do not hand-edit generated copies. Refresh this file in consuming projects when adopting a new A1 version.
