# @gtivr4/a1-design-system-react Changelog

## 0.14.0 — 2026-06-16

### Added

- **IconButton `as` / `href`** — IconButton now accepts `as` (default `"button"`). Pass `as="a"` with an `href` to render it as a navigation link while keeping the icon-button styling. When rendered as an anchor, `disabled` maps to `aria-disabled` (the native `disabled` attribute does not apply to anchors). Added a Storybook "As link" story and the `as`/`href` types.

### Fixed

- **Prop forwarding** — `Banner`, `MessageBadge`, `MessageEmptyState`, `Pagination`, `TopHeader`, `BottomDrawer`, and `Accordion` now spread `...rest` (and merge `className`) onto their root element. They previously dropped unknown props, which broke consumers that rely on passing through DOM attributes / event handlers (e.g. the a1-web Editor's click-to-select).

See `ai/components.md` (Maintenance log) for the full per-component history.
