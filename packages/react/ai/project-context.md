# A1 Design System — Central Context

This file is the entry point for all agents and AI assistants working in this repository. Read it first, then follow the linked context files for implementation details.

**Related files in this directory:**
- `packages/react/ai/project-foundations.md` — repository structure, token flow, themes, labels, and shared system concepts.
- `packages/react/ai/project-workflows.md` — CSS rules, component architecture, package-specific rules, and invariants.
- `packages/react/ai/components.md` — live registry of every component and which packages it exists in. Read it before asking "does X exist?" or "where is Y implemented?". Update it when components change.
- `packages/react/ai/components-maintenance.md` — dated log of component/token/theme/a1-web changes (split out of `components.md`). Add an entry here (newest at the top) whenever you change a component, token, theme, label, rule, or a1-web behaviour.
- `packages/react/ai/quick-orientation.md` — build commands and key file locations.
- `packages/react/ai/a11y-policy.md` — accessibility check policy and commands.
- `packages/react/ai/updates.md` — prop renames, value changes, and removals by version. Read before migrating consumer code between versions.
- `packages/react/ai/page-definition-standard.md` — the AI-readable standard for the A1 page-definition JSON feed (the layout-first format rendered into A1 components by the a1-web Editor and the future site builder). Read before authoring, generating, or rendering page definitions, or changing their types/registry/renderer.
- `packages/react/ai/a1-agent-brief.md` — **single self-contained brief** for handing to a zero-context agent that generates A1 page/project JSON: the page-definition + project-bundle shapes, the full 59-component registry with key props, value vocabularies, rules, and worked examples. (Current; the component list in `page-definition-standard.md` is stale by comparison.)
- `system/icons/icon-usage.md` — system-level icon usage guidance for agents, with theme override rules and scenario mappings.
- `TODO.md` (repo root) — the living backlog / idea space. Skim it before backlog work; triage new notes, keep items prioritized, and **remove items when they ship**. Maintenance conventions are in the file's header.

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

Package-level context files may add package-specific rules on top of these foundations. The central rules here still apply.
