# A1:Figma plugin refactoring plan

## Decision summary

Refactor `packages/figma/plugins/a1-json` as one user-facing plugin with multiple
internal modules and workflow commands. Do not split it into one plugin per
feature or component, and do not move its core workflows into a widget.

The 13,376-line controller is not a problem merely because of its line count. It
is a problem because those lines are hand-authored source in one global runtime:
627 top-level functions, 137 top-level declarations, three parallel component
registries, a 374-line default-node function, a 177-line audit function, a
32-command message dispatcher, and no plugin-specific build, typecheck, or test
harness. The 5,009-line UI is less alarming than it looks because about 3,053
lines are generated A1 Pure CSS, but its remaining HTML and JavaScript are still
maintained as one file.

The goal is not to force the repository below an arbitrary line count. The
refactored source may have as many or more total lines once it has types and
tests. Success means that a component adapter, audit rule, bridge call, or UI
mode can change without requiring broad edits in unrelated code.

## Current setup and findings

### Plugin inventory

`packages/figma/plugins/a1-json/manifest.json` launches **A1:Figma**, the JSON
bridge, audit, build, breakpoint, and local-sync plugin. It is the only Figma
plugin maintained in this package.

The older standalone **Generate Card** development plugin was removed on this
branch. It was a one-off bootstrap tool that created a Card component set from
hardcoded resolved token values, was not shared infrastructure for A1:Figma,
and must not be restored as part of this refactor.

### A1:Figma source shape

| Area | Current size / shape | Main concern |
| --- | ---: | --- |
| Controller | 13,376 lines | One global file with 627 functions and 137 declarations |
| UI | 5,009 lines | One file; roughly 3,053 lines are generated A1 Pure CSS |
| Component registration | 39 exporters, 43 importers, 38 appliers | Parallel maps can drift |
| UI protocol | 32 controller commands and 31 handled result types | Stringly typed, duplicated dispatch |
| Build tooling | CSS inlining only | No source bundling, typecheck, registry check, or plugin tests |
| Runtime access | Legacy whole-document assumptions | Manifest lacks dynamic-page access and code uses root scans, synchronous node lookup, and `documentchange` |
| Library manifest | JSON file plus embedded controller object | Same data has two maintenance locations |

The most complex functions confirm that the risk is orchestration and branching,
not just component count:

- `defaultNodeForAddTarget`: 374 lines, estimated complexity 46.
- `auditSelection`: 177 lines, estimated complexity 57.
- `handleConvertTo`: 132 lines, estimated complexity 45.
- `handleFixAll`: 111 lines, estimated complexity 36.
- `applyChoiceGroup`: 88 lines, estimated complexity 47.
- `applyTopHeader`: 78 lines, estimated complexity 41.

### Existing strengths to preserve

- Export, import, and update already follow recognizable adapter conventions.
- Shared property, slot, sizing, variable, text, and component-lookup helpers
  exist; they need boundaries rather than wholesale replacement.
- Warnings make Figma/runtime gaps explicit instead of silently dropping data.
- The README has unusually good mapping and limitation documentation.
- The external library manifest and example JSON fixtures provide useful inputs
  for automated contract checks.

## Platform conclusions

Figma's own guidance recommends bundling modules when a plugin outgrows a single
source file. A manifest still points at one controller bundle and one UI artifact;
that runtime constraint does not require one source file. See
[Libraries and Bundling](https://developers.figma.com/docs/plugins/libraries-and-bundling/).

The manifest is also on the legacy page-loading model. Current Figma manifests
require `"documentAccess": "dynamic-page"`. Adding it immediately would break
the current root-level `findOne`, synchronous `getNodeById`, and
`documentchange` paths, so it must land with the async access migration. Prefer
current-page access and page-level `nodechange`; load all pages only for an
explicit workflow that genuinely needs them. See
[Migrating Plugins to Dynamically Load Pages](https://developers.figma.com/docs/plugins/migrating-to-dynamic-loading/).

### Multiple plugins

Keep one A1:Figma plugin for now. Audit, build, JSON round-trip, breakpoint
previews, and linked-page sync operate on the same A1 component recognition and
adapter layer. Splitting them before extracting that layer would duplicate the
most delicate code and create separate publishing, discovery, and compatibility
workflows.

Use the plugin manifest's `menu` commands to offer direct entry points such as
**Audit selection**, **Build with A1**, and **Live edit**, while retaining the
full UI. This gives users focused launches without separate installations. See
the [Plugin Manifest menu](https://developers.figma.com/docs/plugins/manifest/#menu).

Reconsider two published plugins only after modularization, and only if measured
product boundaries justify it. A plausible later split would be:

1. **A1 Audit** — read/analyze/fix workflows for a broad design audience.
2. **A1 Bridge** — JSON import/export, breakpoint, and local/project sync for
   design-system and engineering workflows.

Both would consume a shared internal adapter package. Do not split by component
or create one plugin for each current tab. Split only for a distinct audience,
permission/network policy, owner, release cadence, or proven startup cost.

### Widgets

Do not convert the bridge, builder, or audit engine into a widget. A widget is a
persistent multiplayer object placed on the canvas; A1:Figma is a user-invoked
tool that inspects and edits arbitrary design nodes. Widget rendering is driven
by the widget's synchronized state and should not depend on surrounding canvas
nodes. See [Compare the Figma APIs](https://developers.figma.com/compare-apis/)
and [How Widgets Run](https://developers.figma.com/docs/widgets/how-widgets-run/).

A small widget could be a separate future product if A1 wants a persistent,
multiplayer **page-link status** or **audit snapshot** card that collaborators
interact with on the canvas. The current A1 Audit Report Card component already
provides the useful static artifact without adding the Widget API, synchronized
state, and widget lifecycle. A widget is therefore not a refactoring tool.

## Target architecture

Keep the existing plugin directory and make the checked-in source explicit:

```text
packages/figma/
├── package.json
├── code-connect/
└── plugins/a1-json/
    ├── manifest.json
    ├── src/
    │   ├── main.ts
    │   ├── contracts/
    │   │   ├── page-definition.ts
    │   │   ├── messages.ts
    │   │   └── warnings.ts
    │   ├── registry/
    │   │   ├── component-registry.ts
    │   │   └── library-manifest.json
    │   ├── figma/
    │   │   ├── component-source.ts
    │   │   ├── component-properties.ts
    │   │   ├── slots.ts
    │   │   ├── text-and-fonts.ts
    │   │   ├── variables-and-styles.ts
    │   │   ├── layout.ts
    │   │   └── selection.ts
    │   ├── adapters/
    │   │   ├── actions/
    │   │   ├── content/
    │   │   ├── forms/
    │   │   ├── navigation/
    │   │   ├── overlays/
    │   │   ├── data/
    │   │   └── layout/
    │   ├── workflows/
    │   │   ├── export.ts
    │   │   ├── import.ts
    │   │   ├── update.ts
    │   │   ├── audit.ts
    │   │   ├── autofix.ts
    │   │   ├── build.ts
    │   │   ├── breakpoints.ts
    │   │   └── linked-pages.ts
    │   └── ui/
    │       ├── index.html
    │       ├── index.ts
    │       ├── plugin.css
    │       ├── message-client.ts
    │       ├── bridge-client.ts
    │       └── views/
    ├── tests/
    │   ├── fixtures/
    │   ├── registry.test.ts
    │   ├── contracts.test.ts
    │   └── adapters/
    └── dist/
        ├── code.js
        └── ui.html
```

The folders show ownership, not mandatory one-file-per-function granularity.
Start with cohesive domain files, then split a file when it has more than one
reason to change. Avoid replacing the monolith with a maze of tiny pass-through
modules.

### One component registry

Replace `JSON_TYPE_BY_COMPONENT_NAME`, `EXPORTERS`, `IMPORTERS`, `APPLIERS`,
aliases, and handwritten support strings with one typed descriptor per supported
component:

```ts
interface ComponentAdapter {
  figmaName: string;
  aliases?: string[];
  jsonType: ComponentType;
  export?: ExportComponent;
  apply?: ApplyComponent;
  create?: CreateComponent;
  capabilities: {
    update: boolean;
    children: "none" | "slot" | "custom";
  };
}
```

Generate lookups and user-facing supported-component lists from that registry.
Registry checks must reject duplicate names/types and inconsistent capabilities.
An adapter may stay explicit; a complex `Section`, `Tabs`, or `PageLayout`
adapter should not be forced into a declarative mapping DSL.

### Common services

Extract the existing reusable behavior into small services:

- Component source resolution and caching, including published-library keys.
- Component property reading, allowed-value normalization, queued writes, and
  consistent warnings.
- Slot discovery and reconciliation for repeated instance lists.
- Figma node guards and live-node refresh.
- Font, text-style, color-variable, and variable-mode access.
- Fill/hug sizing and parent/child layout placement.
- Page-definition parsing, supported-node collection, stable IDs, responsive
  values, and warning aggregation.

Use a thin `PluginContext` or explicit parameters to supply the Figma API and
services. Pure functions should not read the global `figma` object. This is the
main seam that makes meaningful tests possible.

### UI and controller protocol

Define controller-bound and UI-bound messages as discriminated TypeScript
unions in one shared module. Replace both long `if (message.type === ...)` chains
with handler maps that are exhaustively typed. Keep UI state in one state object
or reducer instead of scattered globals.

Keep the UI vanilla unless a framework produces a clear benefit. The current UI
does not need React to become modular. The build should automatically combine:

1. Authored UI HTML, TypeScript, and plugin-local CSS.
2. Generated A1 Pure/token CSS.
3. The final single `dist/ui.html` required by Figma.

This removes the manual `figma:plugin:sync-css` prerequisite and prevents
generated CSS from dominating the authored file.

## Phased implementation

### Execution progress

- Phase 3 started: component source resolution and imported-source normalization now live in `src/figma/component-source.js`; this first extraction preserves the existing lookup behavior while isolating Figma node access from the controller.
- Phase 3 platform extraction: shared component properties, slots, text/font analysis, variable/style bindings, layout sizing, and selection/node resolution now live under `src/figma/`; component discovery and live updates are page-scoped. The `dynamic-page` manifest flag remains deferred until remaining synchronous style/variable APIs are migrated.
- Phase 4 started: the atomic adapter slice (Divider, Tooltip, Badge, Switch, Code, and Inline) now has a dedicated `src/adapters/atomic.js` dispatch boundary. Divider, Tooltip, Badge, and Switch have moved behind it; Code and Inline are routed through the seam and remain staged for the next extraction pass.

- Phase 0 started: `examples/all-new-components.json` and
  `examples/responsive-grid.json` now have contract copies under
  `plugins/a1-json/tests/fixtures/`, and a structural inventory test records the
  current controller/UI function, registry, and message counts.
- Phase 1 started: `packages/figma` is now a workspace with
  `figma:plugin:build`, `figma:plugin:watch`, `figma:plugin:typecheck`,
  `figma:plugin:test`, and `figma:plugin:check`. A1:Figma source lives under
  `plugins/a1-json/src/`; `plugins/a1-json/dist/` is generated output, and the
  manifest points at `dist/code.js` and `dist/ui.html`. The build also injects
  `a1-library-manifest.json` into `dist/code.js`, removing the second embedded
  manifest copy from authored source.
- Phase 2 complete: `COMPONENT_ADAPTERS` is now the source of truth for JSON
  type, Figma names/aliases, import/export/apply handlers, and declared child
  capabilities. The legacy `EXPORTERS`, `IMPORTERS`, `APPLIERS`, supported-list,
  alias, and JSON-type maps are generated from that descriptor list. Registry
  integrity tests now reject duplicate names/aliases and inconsistent
  capabilities, and message union contracts are tested against the controller/UI
  strings. `defaultNodeForAddTarget` has been split into static quick-add
  templates plus a small computed factory for responsive Grid defaults, with a
  test that keeps quick-add targets and defaults in sync. Pure breakpoint and
  responsive Grid helpers now live in `src/pure/breakpoints.js`, are inlined by
  the plugin build, and have direct node-test coverage. Shared page-definition
  helpers for stable component IDs, option slugs, supported-node collection,
  quick-add template IDs, and linked-page titles now live in
  `src/pure/page-definition.js` with direct node-test coverage. Pure
  component-name canonicalization/matching now lives in `src/pure/name-matching.js`,
  and warning compaction, audit issue grouping/scoring, report metrics,
  recommendations, summaries, findings, and grade calculation now live in
  `src/pure/audit.js`. The Phase 2 inventory baseline is `12,729` controller
  lines, `971` functions, and `741` top-level declarations.

### Phase 0 — Freeze behavior and add a safety harness

Do this before moving component code.

- Record a manual smoke matrix for export, render, update, audit, AutoFix,
  conversion, quick add, breakpoint previews, Playground handoff, and linked
  pages.
- Promote `examples/all-new-components.json` and `responsive-grid.json` into
  named contract fixtures; add smaller fixtures for warning-only behavior.
- Add a structural audit script that records function/registry/message counts so
  the refactor can demonstrate reduced concentration without imposing a total
  line target.
- Add deterministic commands:
  - `figma:plugin:build`
  - `figma:plugin:watch`
  - `figma:plugin:typecheck`
  - `figma:plugin:test`
  - `figma:plugin:check` (build + typecheck + tests + generated-output check)
- Run the existing controller through syntax and lint checks as a baseline.

Exit condition: the current behavior has fixtures and a repeatable smoke list;
no component code has moved yet.

### Phase 1 — Establish source/build boundaries

- Add `packages/figma/package.json`, TypeScript configuration, official
  `@figma/plugin-typings`, and a bundler configuration. Reuse the repository's
  existing Vite toolchain unless a small dedicated bundler proves materially
  simpler.
- Move hand-authored controller and UI source under `src/`; generate only
  `dist/code.js` and `dist/ui.html`.
- Point the development manifest at `dist/`.
- Import `a1-library-manifest.json` into the bundle instead of maintaining an
  embedded copy.
- Make the build inline A1 Pure CSS as part of UI generation.
- Keep behavior byte-for-byte or fixture-for-fixture equivalent where possible.

Exit condition: Figma loads generated artifacts, developers edit modules, and a
clean checkout can reproduce the artifacts with one command.

### Phase 2 — Extract pure contracts and the registry

- Create typed page-node, warning, adapter, and message contracts.
- Replace the parallel component maps with the single descriptor registry.
- Split `defaultNodeForAddTarget` into data-backed defaults and the few defaults
  that require computation.
- Extract pure breakpoint normalization, ID/slug generation, JSON collection,
  audit scoring, and report formatting.
- Add unit tests with Node's built-in test runner or the smallest test runner
  already justified by the build; do not add a browser framework just for pure
  functions.

Exit condition: adding a component requires one registry entry, and registry
drift fails a test.

### Phase 3 — Extract the Figma platform layer and migrate page access

- Move property, slot, text/font, variables/styles, layout, source lookup, and
  selection helpers behind explicit modules.
- Replace synchronous `getNodeById` access with async-safe resolution where
  required.
- Remove startup `figma.root.findOne` scans. Prefer the current page, explicit
  library imports by key, and caches scoped to the active file.
- Replace global `documentchange` listening with current-page `nodechange` when
  it covers the live-preview use case. Load every page only inside an explicit
  command that truly needs whole-document traversal.
- Add `"documentAccess": "dynamic-page"` to the manifest only when these paths
  are migrated and tested.

Exit condition: opening A1:Figma does not force a full-document load, and large
files do not pay a startup penalty for workflows that touch only the current
page.

### Phase 4 — Migrate component adapters by vertical slice

Move complete export/apply/create behavior together; do not move all exporters,
then all importers.

Suggested order:

1. Atomic adapters: Divider, Tooltip, Badge, Switch, Code, Inline.
2. Action adapters: Button, Icon Button, Link, Button Container.
3. Field and option families: Text Field/Search Field/Textarea/Select,
   Radio/Checkbox/Choice Group.
4. Content and data: Figure, Blockquote, Definition List, Menu, Data Table.
5. Composite slots: Card, Banner, Accordion, Dialog, Tabs, Chip Group.
6. Navigation and shells: Breadcrumb, Pagination, Page Nav, Tree Menu,
   Top Header, Page Layout, Bottom Sheet.
7. Authored text/layout: Heading/Paragraph/Stack/Grid/GridItem and Section.

For simple properties, use a shared mapping helper for variant/text/boolean
reads and writes. Keep custom code for slots, detached instances, responsive
metadata, and other asymmetric translations. Each migrated adapter must retain
its expected warnings and pass import/export/update fixtures before the next
slice moves.

Exit condition: the old registries and component-specific functions are gone
from the legacy controller, and component behavior is owned by adapters.

### Phase 5 — Split workflows and UI modes

- Move export/import/update orchestration out of component adapters.
- Isolate audit/reporting, AutoFix/conversion, quick add, breakpoints, and linked
  page sync into workflow modules.
- Replace the controller message chain with a typed handler table.
- Split UI tabs/views, audit rendering, bridge HTTP calls, and plugin messaging.
- Add manifest menu commands for direct workflow entry without creating new
  plugins.
- Keep local bridge domains development-only. If a published build must not
  expose local-sync UI, produce development and distribution manifests from one
  source rather than branching the code manually.

Exit condition: `main.ts` composes services, registers commands/events, and
contains no component mapping or workflow implementation.

### Phase 6 — Reassess product boundaries

- Measure generated controller size, startup time, command latency, and failure
  isolation.
- Interview or observe whether audit and bridge users are actually distinct.
- Split A1 Audit from A1 Bridge only if those measurements and ownership needs
  justify the additional product surface.
- Consider a widget only from a separately approved requirement for a persistent
  multiplayer canvas object.

## Verification gates

Every phase must keep these gates green:

- The plugin builds from a clean checkout and generated output has no unexplained
  diff after a second build.
- Type checking includes the current official Figma Plugin API types.
- Registry integrity tests cover unique Figma names, aliases, JSON types, and
  declared export/import/update support.
- Representative adapters preserve canonical JSON and expected warnings across
  export, import, and update.
- The complete example fixture renders without unsupported-node regression.
- Manual Figma smoke checks cover atomic, slot-based, detached, text, Stack,
  Grid, and shell components.
- Audit score/grouping and AutoFix target selection remain stable on captured
  fixtures.
- The UI cannot send an unhandled controller command or silently ignore a typed
  result.
- Live preview and linked-page sync debounce correctly and stop when disabled.
- Dynamic-page mode does not perform an all-page load during normal current-page
  workflows.
- The README, `figma-workflow.md`, changelog, and build commands are updated as
  behavior and developer workflow change.

## Refactoring guardrails

- Preserve page-definition type names and JSON shapes; schema changes are out of
  scope for this refactor.
- Preserve warning text where fixtures or users depend on it; centralize before
  rewriting.
- Do not mix component redesign with code movement.
- Do not create a generic adapter DSL for complex components merely to reduce
  lines.
- Do not add a framework to the UI unless it removes more complexity than it
  introduces.
- Do not enable dynamic-page mode until every incompatible API path used at
  startup is migrated.
- Do not split published plugins until the shared adapter package exists.
- Treat generated `dist/` and inlined CSS as build output, never authored source.

## Recommended first delivery slice

The safest first pull request should include Phases 0 and 1 only:

1. Add build/typecheck/test/check commands and official Figma typings.
2. Introduce `src/` and `dist/` while preserving behavior.
3. Split authored UI from generated A1 CSS and automate the inlining build.
4. Import the library manifest instead of embedding a second copy.
5. Add registry/message inventory checks and golden JSON fixtures.
6. Leave adapter extraction and dynamic-page behavior changes for subsequent
   reviewable pull requests.

This creates the seam needed for safe refactoring without combining thousands
of moved lines with functional changes.
