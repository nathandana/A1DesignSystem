# Color Token Architecture Remediation Plan

## Objective

Make color authoring, theming, color modes, inverse areas, and component consumption predictable from one canonical token model. Preserve current visual behavior during the migration, then simplify the architecture only after parity is proven.

## Baseline Captured

Captured on June 24, 2026 with `npm run test:qa:update`, then verified with a clean `npm run test:qa` comparison.

- 573 Storybook stories have matching committed screenshots in `visual-baselines/`.
- 16 focused color-reference stories cover eight runtime themes in explicit light and dark modes, including inverse and nested-inverse boundaries.
- The comparison run passed all 106 suites and 573 stories with zero visual regressions.
- The accompanying axe scan recorded 15 serious violations across 13 stories.
  The focused color references exposed existing contrast failures in Aperture
  light, CatLympics light/dark, Crochet light, Fresh light/dark, Heritage dark,
  and Marshmallow light; Canvas also exposed contrast and nested-interactive
  findings. A1-368 subsequently resolved this captured starting set.
- Figure stories use repository images so remote image responses cannot invalidate the reference.

## Implementation Status

### Completed in the first remediation slice

- Added `system/color-modes.mjs` as the shared light/dark alias contract for Pure CSS and React Native generation.
- Removed the duplicated dark-mode maps from `scripts/build-html-css.mjs` and `system/build-themes.mjs`.
- Added `npm run tokens:audit:check`, with a generated inventory at `packages/react/ai/color-token-audit.md`.
- The audit blocks duplicate token paths, unresolved aliases, unknown color variables, invalid theme structure, and drift between React's explicit dark selector and the shared mode contract.
- Added a computed-style contract for all 16 focused theme/mode stories at `tests/color/color-contract.json`, maintained with `tokens:contract:update` and checked with `tokens:contract:check`.
- Fixed `InlineEditable` references to nonexistent radius and interaction-color variables; it now uses the established radius and field focus-ring tokens.
- Rebuilt every target with no generated token/theme/Pure/Native output differences from centralizing the mode data.
- Verified 573 Storybook stories with zero visual regressions. The 15
  pre-existing accessibility violations were recorded as the known starting
  set and were subsequently resolved by A1-368.

### Remediation complete

- React, Pure CSS, and React Native now derive their color-mode relationships
  from the shared structured contract.
- Authored React CSS has no raw color values, component CSS has no direct
  base-color references, and the redundant `brand.*` tier has been removed.
- Theme metadata, structured overrides, generated runtime maps, inverse scope,
  component contracts, computed-style fixtures, and visual baselines now
  describe the same architecture.

## Initial Findings

1. Color values originally had parallel sources of truth:
   - DTCG tokens in `system/tokens/` and namespaced theme token folders.
   - Raw CSS custom-property overrides in `system/themes/*/theme.json`.
   - Hand-authored light, dark, system-dark, and inverse maps in `packages/react/src/color-scheme.css`.
2. Style Dictionary originally loaded every theme's namespaced DTCG tokens into one output without generating runtime selector blocks.
3. `system/build-themes.mjs` originally concatenated raw selector declarations, copied generated token files, and independently derived React Native color maps.
4. `scripts/build-html-css.mjs` contains another independent light/dark color matrix for Pure CSS. This can drift from React's `color-scheme.css`.
5. Component color contracts are inconsistent:
   - Some components consume semantic tokens directly.
   - Some use component-specific tokens where a stable component API or exceptional value is useful.
   - Some field states bypass both through private `--a1-field-*` variables.
6. `brand.a1.*` mostly aliases semantic and component tokens. It adds an export vocabulary without currently representing a distinct brand decision layer.
7. Inverse areas work by redefining inherited semantic and selected component variables on `.a1-inverse`. Their behavior depends on selector specificity and source order, and nested inverse areas do not express an explicit recursive mode model.

## Target Model

### Token tiers

- `base.*`: palette ramps and raw values. Components must not consume these directly.
- `semantic.*`: intent-based color roles and the default component consumption layer.
- `component.*`: only for a value that is genuinely component-specific, is part of the component's stable customization contract, or cannot be represented by a shared semantic role.
- `brand.*`: remove unless a documented external consumer requires this compatibility vocabulary. If retained, generate it as a deprecated alias layer.

### Theme and mode dimensions

- A **theme** changes brand expression: ramps, typography, shape, and intentional component exceptions.
- A **mode** changes environmental color relationships: light, dark, accessible, and inverse.
- A theme supplies primitive and explicit exceptional overrides. Modes map semantic roles to those primitives.
- Runtime CSS selectors are generated from structured token data rather than duplicated declaration maps.

### Component consumption

- Components read semantic roles by default.
- Component tokens alias semantic roles and exist only when they provide a meaningful public boundary.
- Private CSS variables may compose variants and states, but their defaults must resolve through semantic or component tokens.

## Delivery Plan

### Phase 0: Characterize and protect current behavior

1. Inventory every color custom property and classify it as base, semantic, component, brand, private runtime, or unknown.
2. Inventory every component CSS color reference and record whether it uses base, semantic, component, or private variables.
3. Maintain the Storybook visual-regression reference stories in `packages/react/src/ColorRegression.stories.jsx`. Their committed baselines cover representative surfaces, text, actions, statuses, and fields across base, accessible, aperture, catlympics, crochet, fresh, heritage, and marshmallow themes in explicit light, explicit dark, inverse, and nested-inverse contexts.
4. Add build-time checks for unresolved aliases, unknown custom properties, duplicate token paths, and raw color values outside approved token source files.
5. Add computed-style snapshots for representative components in light, dark, system-dark, accessible, inverse, and nested inverse contexts.

Exit criterion: the current behavior is reproducible and failures identify the exact token, selector, theme, and mode.

Status: **Complete.**

### Phase 1: Establish one structured color schema

1. Define DTCG source files for:
   - Base color ramps.
   - Light semantic role mappings.
   - Dark semantic role mappings.
   - Accessible mode mappings.
   - Component exceptions.
2. Add a documented theme schema that separates token overrides from metadata and activation selectors.
3. Move raw custom-property declarations out of `theme.json` into structured token overrides.
4. Validate every theme against the schema before generation.
5. Stop Style Dictionary from merging unrelated theme namespaces into the default runtime token output unless those namespaces are an intentional public artifact.

Exit criterion: authored color values and aliases live in structured token files; `theme.json` contains metadata and selector configuration only.

Status: **Complete.** Theme metadata and selector activation now live in
`theme.json`; 926 custom-property overrides live in validated structured
override files. Style Dictionary reads canonical tokens only, default font
families moved into `base.font.family.*`, and React, Pure CSS, and React Native
consume the same theme loader without a global `theme.*` namespace.

### Phase 2: Generate every runtime color map

1. Create one shared color-mode generator consumed by React, Pure CSS, and React Native builds.
2. Generate:
   - Root/default variables.
   - Theme selector overrides.
   - Explicit light and dark mode selectors.
   - System preference behavior.
   - Accessible mode overrides.
   - Inverse boundary selectors.
3. Replace the duplicated matrices in `color-scheme.css`, `system/build-themes.mjs`, and `scripts/build-html-css.mjs`.
4. Keep reset, font inheritance, and other non-token CSS hand-authored in a separate file.
5. Add deterministic-output checks so generated files must be clean after a build.

Exit criterion: changing one semantic mode mapping updates every platform output through one generator.

Status: **Complete.**

- Added `LIGHT_MODE_DECLARATIONS` export to `system/color-modes.mjs` — the symmetric complement of `DARK_MODE_VARIABLES` (68 CSS custom properties, all aliasing tokens).
- Added `component.scrim.colorLight` token in `system/tokens/component/scrim.json` so `LIGHT_MODE_DECLARATIONS` can reference `var(--component-scrim-color-light)` instead of a raw `rgba()`.
- Extended `system/build-themes.mjs` to generate `packages/react/src/color-scheme-modes.css` with all 7 mode-switching selector blocks (`.a1-inverse`, `@media prefers-color-scheme: dark`, `html.a1-theme-dark`, `html.a1-theme-dark .a1-inverse`, `html.a1-theme-light`, `html.a1-theme-light .a1-inverse`) from `DARK_MODE_VARIABLES` and `LIGHT_MODE_DECLARATIONS`.
- Split the color-scheme sources into `color-scheme-static.css` (hand-authored reset, typeface, field interaction defaults, notification, reduced-motion, contrast-more, accessible dark, Fresh gradient) and `color-scheme-modes.css` (generated). The published `color-scheme.css` entry point is generated as a self-contained bundle of both files so package consumers do not depend on relative CSS `@import` resolution.
- Fixed two pre-existing bugs in the hand-authored dark-mode CSS: `--semantic-color-surface-inverse` was missing from `html.a1-theme-dark .a1-inverse` (light island in dark page inherited white, making the inverse-surface token wrong in that context); `--semantic-color-surface-field` was missing from `@media dark .a1-inverse`. Both are now set consistently in all light-restore selector blocks via `LIGHT_MODE_DECLARATIONS`.
- Extended `scripts/color/audit-color-tokens.mjs` to check both generated files and to verify `html.a1-theme-light` against `LIGHT_MODE_DECLARATIONS` (blocking finding `reactLightContractDrift`).
- Updated `tests/color/color-contract.json` baseline with the corrected inverse-surface values (`#ffffff` → `#060b14` in `html.a1-theme-dark .a1-inverse` contexts, Heritage equivalents).
- `npm run tokens:audit:check` and `npm run tokens:contract:check` both pass with 0 blocking findings.

### Phase 3: Normalize component token contracts

1. Publish a decision rule for when a component token is required.
2. Audit components in families, beginning with fields, buttons, overlays, navigation, and feedback.
3. Replace direct base-color use with semantic roles.
4. Convert `--a1-field-*` defaults to generated semantic or component token aliases; retain private variables only as the internal composition layer.
5. Remove component tokens that merely duplicate a semantic token without providing a public boundary.
6. Add missing component tokens only where the component has a real independent design decision.

Exit criterion: every component color resolves through a documented semantic or component contract, and the inventory check enforces it.

Status: **Complete.**

- Replaced all 10 direct `base-color` uses in component CSS with semantic or component tokens:
  - **Link** — added `component.link.inverse.{color,colorHover,colorPressed}` (info ramp for dark/inverse contexts). CSS now references `--component-link-inverse-color*`.
  - **Notification** — added `component.notification.neutral.{background,foreground}` (neutral-600 / neutral-0). CSS uses `--component-notification-neutral-*`.
  - **Section** — added `component.section.gradient.highlight` (aliases `base.color.highlighted.200`). CSS and Pure `a1-base.css` use `--component-section-gradient-highlight`.
  - **Segmented control** — added `component.segmented.inactive.{color,colorHover}` (semantic text-muted / base neutral-100). CSS uses `--component-segmented-inactive-color*`.
  - **Snackbar** — created `system/tokens/component/snackbar.json` with `component.snackbar.default.{background,border,foreground}` (always-dark neutral-900 / neutral-0). CSS uses `--component-snackbar-default-*`. Also removed the raw `rgba()` fallback from the box-shadow (guaranteed token).
  - **Switch** — added `component.switch.thumb.on.background` (neutral-0 — always-white thumb on colored track). CSS uses `--component-switch-thumb-on-background`.
- Added `componentBaseColorReferences` to the blocking findings in `scripts/color/audit-color-tokens.mjs`. Any new base-color reference in component CSS now blocks `npm run tokens:audit:check`.
- `tokens:audit:check` passes with 0 blocking findings, including `Direct base-color use in component CSS: 0` and `base tier component references: 0`.
- `tokens:contract:check` continues to pass — no computed value changes (all new tokens alias the same base values that were previously hardcoded in CSS).

### Phase 4: Make inverse a deliberate scope

1. Define inverse as a mode boundary with an explicit attribute or class contract.
2. Decide and document nested behavior:
   - Recommended: each boundary toggles relative to its nearest mode ancestor.
   - Alternative: inverse always means dark, with a separate explicit light island.
3. Generate inverse mappings from the same mode data as global light and dark.
4. Use low-specificity selectors such as `:where()` where practical and define a single import/layer order.
5. Test inverse inside every theme and mode, including two nested boundaries, portals, dialogs, popovers, and components with component-specific tokens.

Exit criterion: inverse behavior does not depend on accidental source order and nested behavior is tested and documented.

Status: **Complete.**

- Defined inverse as opposite the document mode, not a recursive toggle.
- `<Inverse>` and `<Section inverse>` now expose
  `data-a1-color-scope="inverse"` as an explicit, inspectable boundary contract.
- Generated mode selectors own inverse values and their source order.
- The computed contract covers inverse, nested inverse, and a native top-layer
  dialog opened inside the inverse subtree for all 16 theme/mode fixtures.
- Documented that detached consumer portals require an explicit mode class or a
  portal target inside the scoped container.

### Phase 5: Resolve the brand alias layer

1. Search package exports, applications, documentation, and external-facing examples for `brand.a1.*` consumption.
2. If there is no required consumer, deprecate and remove it in a major-version path.
3. If consumers exist, generate `brand.a1.*` as compatibility aliases and document that it is not an authoring tier.
4. Add a check preventing new internal component use of brand aliases.

Exit criterion: the brand layer has an explicit owner, purpose, and lifecycle.

Status: **Complete.**

- Repository search found no runtime, package, example, or component consumers.
- Removed `brand.a1.*` color and typography aliases instead of retaining a
  redundant public tier.
- Removed the Brand tab from the Color foundation and the Brand node from the
  System map.
- Added a blocking audit check preventing new `brand.*` token definitions.

### Phase 6: Migrate, document, and release

1. Migrate one component family at a time with before/after computed-style parity.
2. Rebuild and verify React, Pure CSS, React Native, Web Components, examples, Storybook, and a1-web.
3. Validate WCAG contrast across the complete theme/mode matrix.
4. Update the Foundations color and system-map pages to describe the final architecture.
5. Update token documentation, component guidance, changelogs, and migration notes.
6. Remove compatibility code only after all consumers have moved.

Exit criterion: all package outputs derive from the canonical schema, documentation matches the implementation, and visual/a11y regression suites pass.

Status: **Complete.**

- Rebuilt canonical tokens, theme outputs, Pure CSS, React Native, Web
  Components, React, and a1-web through the repository build pipeline.
- `tokens:audit:check` passes with zero duplicate paths, unresolved aliases,
  unknown references, raw authored React colors, mode drift, direct base-color
  component references, or brand token definitions.
- `tokens:contract:check` passes for all 16 theme/mode fixtures, including
  inverse, nested inverse, and native top-layer dialog scopes.
- Updated the intentional Segmented Control token-table baseline and verified
  all 106 suites and 573 stories with zero visual regressions.
- A1-368 subsequently resolved the established 15-finding accessibility
  baseline across 13 stories. Theme-specific authored light exceptions now
  restore inside inverse scopes on explicit dark pages, and all 16 focused
  theme/mode regression stories participate in release QA. React and Pure CSS
  generators preserve base, light, and dark theme overrides in their matching
  mode scopes.
- Updated the color foundations, system map, architecture guidance,
  maintenance notes, changelogs, and this release plan.

## Suggested Work Sequence

1. Inventory and parity tests.
2. Shared schema and validator.
3. Shared mode generator.
4. Field-family migration as the first component-contract proof.
5. Inverse scope hardening.
6. Remaining component families.
7. Brand alias decision and cleanup.
8. Cross-platform release and documentation.

## Likely Files

- `system/tokens/color-ramp.json`
- `system/tokens/component/*.json`
- `system/themes/*/theme.json`
- `system/themes/*/overrides/*.json`
- `system/theme-config.mjs`
- `sd.config.js`
- `system/build-themes.mjs`
- `scripts/build-html-css.mjs`
- `packages/react/src/color-scheme.css`
- `packages/react/src/components/**/*.css`
- `packages/pure/dist/`
- `packages/react-native/src/tokens/`
- `apps/a1-web/src/pages/foundations/`

## Definition of Done

- One structured source controls each color decision.
- React, Pure CSS, and React Native do not maintain separate hand-authored mode matrices.
- Theme and mode are separate, composable concepts.
- Inverse and nested inverse behavior are deterministic and covered by tests.
- Components do not consume base colors directly.
- Component tokens follow a documented, enforced policy.
- The brand alias layer is removed or explicitly supported as compatibility-only.
- Generated outputs are deterministic, current, and validated in CI.
- All supported themes, modes, inverse contexts, and representative breakpoints
  pass visual checks without regressions; accessibility findings are recorded
  and do not increase from the accepted baseline.
