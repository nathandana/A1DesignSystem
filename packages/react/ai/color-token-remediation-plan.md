# Color Token Architecture Remediation Plan

## Objective

Make color authoring, theming, color modes, inverse areas, and component consumption predictable from one canonical token model. Preserve current visual behavior during the migration, then simplify the architecture only after parity is proven.

## Current Findings

1. Color values have parallel sources of truth:
   - DTCG tokens in `system/tokens/` and `system/themes/*/tokens/`.
   - Raw CSS custom-property overrides in `system/themes/*/theme.json`.
   - Hand-authored light, dark, system-dark, and inverse maps in `packages/react/src/color-scheme.css`.
2. Style Dictionary resolves the global token graph, but it also loads every theme's namespaced DTCG tokens into one output. It does not generate the runtime theme selector blocks.
3. `system/build-themes.mjs` concatenates raw selector declarations, copies generated token files, and independently derives React Native color maps.
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
3. Generate a theme/mode/inverse matrix for base, a1-light, accessible, heritage, fresh, crochet, aperture, marshmallow, and catlympics.
4. Add build-time checks for unresolved aliases, unknown custom properties, duplicate token paths, and raw color values outside approved token source files.
5. Add computed-style snapshots for representative components in light, dark, system-dark, accessible, inverse, and nested inverse contexts.

Exit criterion: the current behavior is reproducible and failures identify the exact token, selector, theme, and mode.

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

### Phase 3: Normalize component token contracts

1. Publish a decision rule for when a component token is required.
2. Audit components in families, beginning with fields, buttons, overlays, navigation, and feedback.
3. Replace direct base-color use with semantic roles.
4. Convert `--a1-field-*` defaults to generated semantic or component token aliases; retain private variables only as the internal composition layer.
5. Remove component tokens that merely duplicate a semantic token without providing a public boundary.
6. Add missing component tokens only where the component has a real independent design decision.

Exit criterion: every component color resolves through a documented semantic or component contract, and the inventory check enforces it.

### Phase 4: Make inverse a deliberate scope

1. Define inverse as a mode boundary with an explicit attribute or class contract.
2. Decide and document nested behavior:
   - Recommended: each boundary toggles relative to its nearest mode ancestor.
   - Alternative: inverse always means dark, with a separate explicit light island.
3. Generate inverse mappings from the same mode data as global light and dark.
4. Use low-specificity selectors such as `:where()` where practical and define a single import/layer order.
5. Test inverse inside every theme and mode, including two nested boundaries, portals, dialogs, popovers, and components with component-specific tokens.

Exit criterion: inverse behavior does not depend on accidental source order and nested behavior is tested and documented.

### Phase 5: Resolve the brand alias layer

1. Search package exports, applications, documentation, and external-facing examples for `brand.a1.*` consumption.
2. If there is no required consumer, deprecate and remove it in a major-version path.
3. If consumers exist, generate `brand.a1.*` as compatibility aliases and document that it is not an authoring tier.
4. Add a check preventing new internal component use of brand aliases.

Exit criterion: the brand layer has an explicit owner, purpose, and lifecycle.

### Phase 6: Migrate, document, and release

1. Migrate one component family at a time with before/after computed-style parity.
2. Rebuild and verify React, Pure CSS, React Native, Web Components, examples, Storybook, and a1-web.
3. Validate WCAG contrast across the complete theme/mode matrix.
4. Update the Foundations color and system-map pages to describe the final architecture.
5. Update token documentation, component guidance, changelogs, and migration notes.
6. Remove compatibility code only after all consumers have moved.

Exit criterion: all package outputs derive from the canonical schema, documentation matches the implementation, and visual/a11y regression suites pass.

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
- `system/themes/*/tokens/*.json`
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
- All supported themes, modes, inverse contexts, and representative breakpoints pass visual and accessibility checks.
