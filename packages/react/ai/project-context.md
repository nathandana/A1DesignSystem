# A1 Design System — Central Context

This file is the entry point for all agents and AI assistants working in this repository. Read it first, then follow the linked context files for implementation details.

**Related files in this directory:**
- `packages/react/ai/labs-code-highlighting.md` — Labs code syntax highlighting: tokenizer, `HighlightedCode`/`LiveHighlightEditor` API, palettes and contrast derivation, line spacing, and the A1 Code wrapping/indent/scroll changes it relies on.
- `packages/react/ai/labs-avatars.md` — Labs avatars: `LabAvatar`/`LabAvatarGroup` API (content, sizes, radii, colour, borders, status, Break the frame, generated pattern), tokens and accessibility.
- `packages/react/ai/labs-pagination-types.md` — long-table page navigation variants and shared render callback.
- `packages/react/ai/labs-data-tables.md` — pagination placement and configurable data table scale.
- `packages/react/ai/labs-automation-builder.md` — sentence/block rule editing and local tests.
- `packages/react/ai/labs-token-studies.md` — token-name treatments and authored hierarchy tracing.
- `packages/react/ai/labs-chat.md` — message styles, entrance motion, composer, scrolling and simulated reply lifecycle.
- `packages/react/ai/labs-step-tracker.md` — six noninteractive A1 position indicator treatments and their configuration.
- `packages/react/ai/labs-steps.md` — eight A1 progress-tab presentations, state ownership, keyboard behavior and responsive strip.
- `packages/react/ai/labs-button-motion.md` — six button hover/press treatments, native behavior and isolated wrappers.
- `packages/react/ai/labs-segmented-motion.md` — Labs segmented control transitions on the A1 SegmentedControl: eight background transitions, `AnimatedSegmentedControl` API, tokens and accessibility.
- `packages/react/ai/labs-accordion-motion.md` — Labs accordion transitions on the A1 Accordion: eight opening/closing variants, `AccordionMotion` API, tokens and accessibility.
- `packages/react/ai/labs-switch-three.md` — Three.js switch, native semantics, token geometry and fallbacks.
- `packages/react/ai/labs-mobile-tables.md` — Labs mobile data tables: nine phone patterns (cards, compact/plain/labeled/legend lists, scrolling, frozen column, expandable, pick a column, grouped) switching to A1 DataTable at md, datasets and findings.
- `packages/react/ai/labs-bulk-actions.md` — Labs bulk actions: selecting many table rows and acting on them from an always-visible bar on A1 DataTable, persistent deletion, and findings for A1.
- `packages/react/ai/labs-data-grid.md` — Labs data grid: A1's experimental react-data-grid wrapper as an editable 127-item inventory, the tested grid model and inventory generator, and evaluation notes.
- `packages/react/ai/labs-fenex.md` — Labs Fenex celebrates: the self-contained animated SVG fox, the shared `Fenex` component (playback, still, confetti, settle), its palette exception and accessibility.
- `packages/react/ai/labs-fit-text.md` — Labs fitted type: lines scaled to fill their container, line-breaking and sizing model, `FitText` API, tokens and accessibility.
- `packages/react/ai/labs-celebrations.md` — Labs submission celebrations: seven success celebrations from a check to Fenex and confetti, the particle physics, `Celebration` API, tokens and accessibility.
- `packages/react/ai/labs-dialog-motion.md` — Labs dialog motion on the A1 Dialog: nine enter/exit animations with direction and exit, scrim color/opacity/blur, `MotionDialog` API, tokens and the Section-margin placement gap.
- `packages/react/ai/labs-contextual-help.md` — Labs contextual help: five help patterns, four triggers, which combinations are allowed and why, `HelpPopover`/`InlineHelp` API, tokens and accessibility.
- `packages/react/ai/labs-password-strength.md` — Labs password strength meters: seven styles, the local strength model, rules, `StrengthMeter` API, tokens and accessibility.
- `packages/react/ai/labs-checkbox-motion.md` — Labs checkbox motion on the A1 CheckboxGroup: eight check/uncheck/mixed animations, `LivelyCheckboxGroup` API, tokens and accessibility.
- `packages/react/ai/labs-radio-variants.md` — Labs animated radio button variants on the A1 RadioGroup: variants, `LivelyRadioGroup` API, tokens and accessibility.
- `packages/react/ai/labs-flip-billboard.md` — split-flap landing hero, shared clock mechanism, copy and playback.
- `packages/react/ai/labs-flip-clock.md` — Three.js split-flap clock, timing, motion, tokens and lifecycle.
- `packages/react/ai/labs-mode-switches.md` — Labs light/dark mode switches: five controls (binary and Auto), their API, physics, tokens and accessibility.
- `packages/react/ai/labs-home.md` — Labs home search and sorting, experiment type tags, responsive gallery and appearance controls.
- `packages/react/ai/labs-form-experiments.md` — long-form chunking and the date-of-birth studies (originally from A1 Web).
- `packages/react/ai/labs-slides.md` — Labs slide deck: transitions from cut to content-aware cascade and morph, content builds, `SlideDeck` API, tokens and validation.
- `packages/react/ai/labs-verification-journey.md` — automatic multi-service verification, checkpoints, errors, receipts and Sticky Actions.
- `packages/react/ai/labs-timeline.md` — Labs timeline: kept connector geometry, horizontal/vertical layouts, `Timeline` API, tokens and validation.
- `packages/react/ai/labs-required-fields.md` — Labs required-fields comparison: five new marking variations (no A1 asterisk or badge), submission treatments, form model API and accessibility.
- `packages/react/ai/labs-billboard-actions.md` — A1-only billboard composition, content/action inputs and responsive preview guidance.
- `packages/react/ai/labs-reordering.md` — controlled reorder list, placement motion, insertion cues and accessibility guidance.
- `packages/react/ai/labs-verify-button.md` — reusable critical-action intent gate, cancellation, animation and accessibility contract.
- `packages/react/ai/labs-connected-nodes.md` — combined Canvas/Node composition, configuration and validation guidance.
- `packages/react/ai/labs-thinking-terminal.md` — terminal activity indicator API, timing, accessibility and promotion guidance.
- `packages/react/ai/labs-switch-morph.md` — reusable switch morph API, token geometry and validation/promotion notes.
- `packages/react/ai/labs-focus-animations.md` — isolated focus experiment API, token dependencies and validation/promotion guidance.
- `packages/react/ai/labs-page-loaders.md` — Labs Blueprint, Jigsaw, Fresh paint and Sunrise page loaders: shared `loading-preview` scaffold, each core's API, timelines, tokens and validation.
- `packages/react/ai/labs-page-construction.md` — Labs "Under construction" page loader: `PageConstruction` API, crane timeline, tokens and validation.
- `packages/react/ai/labs-frosted-glass.md` — Labs frosted glass visual study: `FrostedGlass`/`GlassPane` API, the backdrop-root technique, its user-approved raw-value/token exception and validation.
- `packages/react/ai/labs-button-completion.md` — Labs button-completion experiment (fixed-width and expanding send buttons): API, token dependencies, states and validation/promotion guidance.
- `packages/react/ai/labs-contributing.md` — Labs contribution workflow, sidebar categories, agent instruction maintenance and synchronized app version/changelog policy.
- `packages/react/ai/release-preparation-2026-10-12.md` — Labs release scope, synchronized package versions, validation and website publication.
- `packages/react/ai/release-preparation-2026-09-25.md` — prepared package versions, release scope and validation results.
- `packages/react/ai/project-foundations.md` — repository structure, token flow, themes, labels, and shared system concepts.
- `packages/react/ai/project-workflows.md` — CSS rules, component architecture, package-specific rules, and invariants.
- `packages/react/ai/components.md` — live registry of every component and which packages it exists in. Read it before asking "does X exist?" or "where is Y implemented?". Update it when components change.
- `packages/react/ai/components-maintenance.md` — dated log of component/token/theme/a1-web changes (split out of `components.md`). Add an entry here (newest at the top) whenever you change a component, token, theme, label, rule, or a1-web behaviour.
- `packages/react/ai/quick-orientation.md` — build commands and key file locations.
- `packages/react/ai/a11y-policy.md` — accessibility check policy and commands.
- `packages/react/ai/updates.md` — prop renames, value changes, and removals by version. Read before migrating consumer code between versions.
- `packages/react/ai/page-definition-standard.md` — the AI-readable standard for the A1 page-definition JSON feed (the layout-first format rendered into A1 components by the a1-web Editor and the future site builder). Read before authoring, generating, or rendering page definitions, or changing their types/registry/renderer.
- `packages/react/ai/a1-agent-brief.md` — **single self-contained brief** for handing to a zero-context agent that generates A1 page/project JSON: the page-definition + project-bundle shapes, the full 60-type registry with key props, value vocabularies, rules, and worked examples. Keep its registry synchronized with `page-definition-standard.md`, `pageTypes.ts`, and `componentRegistry.ts`.
- `packages/react/ai/a1-web-one-shot-instruction.md` — copy-paste instruction for asking any agent to create an A1-web website as an importable JSON project bundle, including the JSON contract, design rules, accessibility requirements, and validation checklist.
- `packages/react/ai/content-standards.md` — AI-facing policy for product copy and documentation, including the source hierarchy, AP Style default, A1 overrides, and link to the canonical public standard.
- `packages/react/ai/access-control.md` — a1-web roles, feature/page recommendations, Supabase enforcement boundaries, and follow-up sequencing.
- `packages/react/ai/figma-workflow.md` — rules for creating Figma components: flat public naming, color/text variable binding, auto-layout constraints, size-aware Required markers, nested-property ownership, component property ↔ React prop mapping, and a per-component gap table.
- `packages/react/ai/figma-component-library-future-changes.md` — active checklist and A1-2639 completion record for top-level placement, flat naming, presentation grids and labels, icon-library use, bounded slots, nested properties, size-aware Required markers, interactive states, Boolean focus rings, prototype behavior, and contract synchronization.
- `system/icons/icon-usage.md` — system-level icon usage guidance for agents, with theme override rules and scenario mappings.
- `TODO.md` (repo root) — the living backlog / idea space. Skim it before backlog work; triage new notes, keep items prioritized, and **remove items when they ship**. Maintenance conventions are in the file's header.
- `packages/mcp-server/README.md` — remote MCP server exposing the component registry, tokens, rules, and page-definition contract to AI agents as JSON-RPC tools/resources (`mcp.a1design.app`). Its static index is built from this same `ai/` context plus each component's `.d.ts`; re-run `npm run build:mcp-index` after any change here that should be reflected there.

> **Scope reminder:** This is a multi-package design system. Changes to tokens, themes, labels, or component APIs can ripple across React, HTML/CSS, React Native, examples, and apps. Before making changes, identify which packages are affected and update all of them.

---

## Agent Rules

These eight rules govern all work in this repository. Read them before starting any task.

1. **Use the system first.** Reach for A1 components, patterns, tokens, and utilities before creating anything custom. Custom UI is a last resort, not a starting point.

2. **Do not invent values.** Never create arbitrary colors, spacing, typography, border-radius, motion, or layout values. Every visual value must trace back to a Style Dictionary token. If a token does not exist for the value you need, add it to `system/tokens/` first.

3. **Semantic structure is required.** Every piece of generated markup must use correct HTML semantics and accessible component structure — not just visually correct output. A `<div>` that looks like a button is not a button.

4. **Visual correctness is not enough.** Output must be structurally correct, accessible (keyboard, screen reader, WCAG AA contrast), tokenized, responsive across breakpoints, and maintainable by a future developer who has no context from this session.

5. **Preserve agreed content.** When working from approved content, JSON data, or Priority Guides, preserve the content, hierarchy, and order exactly. Do not invent, reword, or reorder content that has been agreed.

6. **Document every system change.** When a component API, variant, token, theme, label, rule, feature, or removal changes, update Storybook stories, example pages, changelog entries, and any affected documentation in the same change. If a project, package, or app has a `changelog.md` or `CHANGELOG.md`, update it as features are added or removed.

7. **Test across themes and breakpoints.** Validate components across all supported themes (light, accessible, heritage) and at all breakpoints (xs through xl). A component that only works in one theme or one viewport size is not finished.

8. **Prefer reusable contracts.** Design component APIs, token structures, and content schemas to be stable and platform-agnostic. Output should be portable across agents, packages, and future contexts without renegotiation.

---

## Start Here

1. Read `packages/react/ai/project-foundations.md` for the system model: monorepo layout, token tiers, theme flow, label format, and supported breakpoints.
2. Read `packages/react/ai/project-workflows.md` before editing CSS, components, examples, package code, or system rules.
3. Check `packages/react/ai/components.md` before asking whether a component exists or where it is implemented.
4. Check `packages/react/ai/quick-orientation.md` for build commands and key file locations.
5. Follow `packages/react/ai/a11y-policy.md` for accessibility-relevant changes.
6. Follow `packages/react/ai/content-standards.md` when authoring or editing product copy, documentation, labels, or examples.

Package-level context files may add package-specific rules on top of these foundations. The central rules here still apply.

For Labs shared demonstration records, Small/Medium/Large presets and the consolidation audit, read [Sample data](labs-sample-data.md).

For Labs tab styling and keyboard/selection behavior, read [Tabs](labs-tabs.md).

For Labs deployment, DNS and release checks, read [Publishing Labs](labs-publishing.md).
